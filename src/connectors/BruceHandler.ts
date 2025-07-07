import axios, { AxiosResponse } from 'axios';
import { MAX_RETRIES, RETRY_DELAY, DEVICE_DEFAULT_CURSOR_LIMIT, BRUCE_USER_INSIGHT_FETCH_PAGINATED_URL,BRUCE_UPDATE_SINGLE_USER_INSIGHT_URL, BRUCE_ADD_USER_INSIGHT_URL, BRUCE_INSIGHT_RESULT_FETCH_PAGINATED_URL, Protocol } from '../utils/constants.js';

export interface FetchUserInsightsOptions {
  pagination?: { page: number; count: number };
  populate?: any[];
  sort?: any;
  projection?: any;
  onPrem?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields like filters, user, etc.
}

export interface PaginationConfig {
    page: number;
    count: number;
  }

export interface FetchSourceInsightOptions {
  insightID: string;
  projection?: any;
  populate?: any[];
  onPrem?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

// --- User Insight Response Types ---
export interface SourceInsightID {
  _id: string;
  tags: string[];
  source: string;
  insightID: string;
  insightProperty: any[];
}

export interface UserInsight {
  _id: string;
  userTags: string[];
  starred: boolean;
  hidden: boolean;
  restrictedAccess: boolean;
  source: string;
  insightID: string;
  insightName: string;
  sourceInsightID: SourceInsightID;
  iconUrl: string;
  added_by: string;
  organisation: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updated_by: string;
}

export interface FetchUserInsightsResponse {
  success: boolean;
  data: {
    data: UserInsight[];
  };
}

// --- Source Insight Response Types ---
export interface VectorConfig {
  _id: string;
  distanceMetric: string;
  modelName: string;
  vectorSize: number;
}

export interface SelectedUser {
  orgName: string;
  user: string;
  email: string;
  userName: string;
}

export interface SourceInsight {
  _id: string;
  organisations: string[];
  restrictedAccess: boolean;
  whitelistedUsers: string[];
  tags: string[];
  users: string[];
  workbenches: string[];
  workbenchTags: string[];
  source: string;
  privilegeUsers: string[];
  insightID: string;
  insightName: string | null;
  note: string;
  insightProperty: any[];
  added_by: string;
  vectorConfig: VectorConfig;
  selectedUsers: SelectedUser[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  updated_by: string;
  firstDataPointTime: string;
  lastDataPointTime: string;
}

export interface GetSourceInsightResponse {
  success: boolean;
  data: SourceInsight;
}

export interface InsightResult {
  _id: string;
  tags: string[];
  applicationID: string | null;
  resultName: string;
  metadata: {
    userID: {
      _id: string;
      userDetail: {
        _id: string;
        personalDetails: {
          name: {
            first: string;
            last: string;
          }
        }
      }
    }
  };
  createdAt: string;
}

export interface InsightResultPagination {
  page: number;
  count: number;
  totalPages: number;
}

export interface FetchInsightResultData {
  data: InsightResult[];
  totalCount: number;
  pagination: InsightResultPagination;
}

export interface FetchInsightResultResponse {
  success: boolean;
  data: FetchInsightResultData;
}

export interface FetchInsightResultOptions {
  insightID: string;
  body: any;
  onPrem?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
}

export interface UpdateSingleUserInsightOptions {
  insightID: string;
  update: object;
  user?: any;
  onPrem?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
}

export interface UpdateSingleUserInsightData {
  _id: string;
  userTags: string[];
  starred: boolean;
  hidden: boolean;
  restrictedAccess: boolean;
  source: string;
  insightID: string;
  insightName: string;
  sourceInsightID: string;
  iconUrl: string;
  added_by: string;
  organisation: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  note: string;
  updated_by: string;
}

export interface UpdateSingleUserInsightResponse {
  success: boolean;
  data: UpdateSingleUserInsightData;
}

// This interface is specific to the addUserInsight response and intentionally differs from UpdateSingleUserInsightData.
export interface AddUserInsightData {
  userTags: string[];
  starred: boolean;
  hidden: boolean;
  restrictedAccess: boolean;
  source: string;
  _id: string;
  insightID: string;
  insightName: string;
  sourceInsightID: string;
  iconUrl: string;
  added_by: string;
  organisation: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AddUserInsightResponse {
  success: boolean;
  data: AddUserInsightData;
}

export interface AddUserInsightOptions {
  body: any;
  onPrem?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
}

export class BruceHandler {
  private dataUrl: string;
  private accessToken: string;
  private onPrem: boolean;
  private tz: string;
  static readonly DEFAULT_CURSOR_LIMIT = DEVICE_DEFAULT_CURSOR_LIMIT;

  /**
   * Constructs a new BruceHandler service instance.
   * @param dataUrl - The backend server URL
   * @param accessToken - The Bearer access token for Authorization
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'
   * @param tz - Optional timezone string (defaults to 'UTC')
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
    this.tz = tz;
  }

  /**
   * Formats error messages for failed HTTP requests.
   */
  private errorMessage(response: AxiosResponse | undefined, url: string): string {
    if (!response) {
      return `\n[URL] ${url}\n[EXCEPTION] No response received`;
    }
    return `\n[STATUS CODE] ${response.status}\n[URL] ${url}\n[SERVER INFO] ${response.headers.server || 'Unknown Server'}\n[RESPONSE] ${response.data}`;
  }

  /**
   * Formats a URL template with protocol and dataUrl.
   */
  private formatUrl(template: string, onPrem?: boolean): string {
    const protocol = (onPrem ?? this.onPrem) ? Protocol.HTTP : Protocol.HTTPS;
    return template.replace('{protocol}', protocol).replace('{data_url}', this.dataUrl);
  }

  /**
   * Sleep helper for retry logic.
   */
  private _sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper method to perform GET requests with retry logic.
   * @param url - The request URL
   * @param headers - The request headers
   * @returns The Axios response data or throws after max retries
   */
  private async requestWithRetry<T>(url: string, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.get<T>(url, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * Fetches all insights added to the user's account, with support for advanced filtering, sorting, projection, and pagination.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/bruce/userInsight/fetch/paginated
   * Method: PUT
   *
   * @param options - Options for fetching user insights. All fields are optional unless otherwise specified:
   *   @param pagination {Object} - Pagination object.
   *     @param page {number} - Page number (1-based).
   *     @param count {number} - Number of insights per page.
   *   @param filters {Object} - Filter object for insights.
   *     @param _id {string} - ID of the insight (for fetching a single unique insight).
   *     @param insightID {string} - ID of the insight.
   *     @param insightName {string} - Name of the insight.
   *     @param tags {string[]} - Tags to filter insights.
   *     @param starred {boolean} - Starred status. By default, only non-starred are returned unless true is specified.
   *     @param hidden {boolean} - Hidden status. By default, hidden insights are not returned unless true is specified.
   *   @param populate {Array<Object>} - Array of fields to populate. Each object can have:
   *     @param path {string} - Field to populate (e.g., 'sourceInsightID').
   *     @param select {string} - Fields to select (e.g., 'tags').
   *   @param projection {Object} - Projection object to fetch only required keys (e.g., { insightID: 1, insightName: 1 }).
   *   @param sort {Object} - Sort object. Keys can be:
   *     @param createdAt {number} - Sort by creation date (-1 for descending, 1 for ascending).
   *     @param starred {number} - Sort by starred status (-1 for starred first).
   *     @param insightName {number} - Sort by name (-1 for Z-A, 1 for A-Z).
   *   @param user {Object} - User object (id, email, organisation, etc.).
   *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<FetchUserInsightsResponse>} The API response data, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       data: [
   *         // Array of user insight objects (UserInsight[])
   *       ]
   *     }
   *   }
   *
   * @example
   * // Fetch page 2, 3 insights per page, only starred insights, sorted by starred and createdAt descending, with tags populated:
   * const result = await bruceHandler.fetchUserInsights({
   *   pagination: { page: 2, count: 3 },
   *   filters: { starred: true },
   *   sort: { starred: -1, createdAt: -1 },
   *   populate: [{ path: 'sourceInsightID', select: 'tags' }],
   *   projection: { insightID: 1, insightName: 1 },
   *   user: { email: 'aditya@faclon.com', organisation: '5b0d386f82d7525268dfbe06' }
   * });
   *
   * // Fetch all insights with a specific tag, not hidden, sorted by name A-Z:
   * const result = await bruceHandler.fetchUserInsights({
   *   filters: { tags: ['thats_a_new_insight'], hidden: false },
   *   sort: { insightName: 1 },
   *   projection: { insightID: 1, insightName: 1, iconUrl: 1 },
   *   user: { email: 'aditya@faclon.com', organisation: '5b0d386f82d7525268dfbe06' }
   * });
   */
  async fetchUserInsights(options: FetchUserInsightsOptions = {}): Promise<FetchUserInsightsResponse> {
    const {
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.formatUrl(BRUCE_USER_INSIGHT_FETCH_PAGINATED_URL, onPrem);
    const payload = { ...rest };

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.put(url, payload, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * Fetches a source insight by insightID from the Bruce API using an options object.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/bruce/userInsight/fetch/getSourceInsight/:insightID
   * Method: PUT
   *
   * @param options - Options for fetching source insight:
   *   @param insightID {string} - The insight ID to fetch. (required)
   *   @param projection {object} - (optional) Projection object to fetch only required keys.
   *   @param populate {Array} - (optional) Array of fields to populate. Each object can have:
   *     @param path {string} - Field to populate (e.g., 'tags').
   *     @param select {string} - Fields to select (e.g., 'insightProperty').
   *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<GetSourceInsightResponse>} The API response data, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       _id: "67a0f921ce9e515b27156125",
   *       organisations: ["5b0d386f82d7525268dfbe06"],
   *       restrictedAccess: false,
   *       whitelistedUsers: [],
   *       tags: ["idk_why"],
   *       insightID: "NOTIF_INS_03",
   *       note: "Testing addition of org",
   *       insightProperty: [
   *         {
   *           propertyDataType: "String",
   *           propertyValue: ["Mumbai"],
   *           _id: "67a0f921ce9e515b27156126",
   *           propertyName: "location"
   *         }
   *       ],
   *       added_by: "6156a091970a3e4bcee2f4c6",
   *       createdAt: "2025-02-03T17:13:05.666Z",
   *       updatedAt: "2025-02-05T11:19:03.834Z",
   *       __v: 0,
   *       users: ["62823b1e78d65a047c05592b"]
   *     }
   *   }
   *
   * @example
   * // Basic usage with insight ID:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03'
   * });
   *
   * // With projection and populate:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03',
   *   projection: { insightID: 1, note: 1, tags: 1 },
   *   populate: [{ path: 'tags', select: 'insightProperty' }]
   * });
   *
   * // With additional headers:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03',
   *   extraHeaders: {
   *     origin: 'https://iosense.io'
   *   }
   * });
   */
  async fetchSourceInsight(options: FetchSourceInsightOptions): Promise<GetSourceInsightResponse> {
    const {
      insightID,
      projection,
      populate,
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;
    
    // Import the constant here to avoid import errors if it was removed above
    const BRUCE_GET_SOURCE_INSIGHT_URL = '{protocol}://{data_url}/api/account/bruce/userInsight/fetch/getSourceInsight/{insightID}';
    const url = this.formatUrl(BRUCE_GET_SOURCE_INSIGHT_URL, onPrem).replace('{insightID}', encodeURIComponent(insightID));
    
    // Construct the request body
    const body: any = {};
    if (projection !== undefined) body.projection = projection;
    if (populate !== undefined) body.populate = populate;
    
    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['insightID', 'onPrem', 'extraHeaders'].includes(key)) {
        body[key] = rest[key];
      }
    }
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.put(url, body, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * Update an insight in the user's account.
   *
   * Allows the user to update only the following fields for a user insight:
   *   - note: String - Note for the insight.
   *   - userTags: Array<string> - Tags for the insight.
   *   - starred: Boolean - Starred status of the insight.
   *   - hidden: Boolean - Hidden status of the insight.
   *   - iconUrl: String - Icon for the insight.
   *
   * The user should specify only the params (not the body). The method will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/bruce/userInsight/update/singleUserInsight
   * Method: PUT
   *
   * @param options - Options for updating a user insight:
   *   @param insightID {string} - ID of the insight to update. (required)
   *   @param update {object} - Object containing the fields to update (see above). (required)
   *   @param user {object} - User object with details (id, email, organisation, etc.). (optional)
   *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<UpdateSingleUserInsightResponse>} The API response data.
   *
   * @example
   * const result = await bruceHandler.updateSingleUserInsight({
   *   insightID: 'INS_Test420',
   *   update: {
   *     insightName: 'A subtle name for Insight',
   *     iconUrl: 'http://real.image/ok.png',
   *     note: 'Testing update',
   *     userTags: ['thats_a_new_insight', 'not_that_new']
   *   },
   *   user: {
   *     id: '603cd490b561b6734a3cd4b5',
   *     email: 'aditya@faclon.com',
   *     organisation: '5b0d386f82d7525268dfbe06',
   *     // ...other user fields
   *   }
   * });
   */
  async updateSingleUserInsight(options: Omit<UpdateSingleUserInsightOptions, 'body'> & {
    insightID: string;
    update: object;
    user?: any;
    [key: string]: any;
  }): Promise<UpdateSingleUserInsightResponse> {
    const {
      insightID,
      update,
      user,
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;
    const url = this.formatUrl(BRUCE_UPDATE_SINGLE_USER_INSIGHT_URL, onPrem);
    const body: any = {
      insightID,
      update,
    };
    if (user !== undefined) body.user = user;
    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['onPrem', 'extraHeaders'].includes(key)) {
        body[key] = rest[key];
      }
    }
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.put(url, body, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * Add a new insight to the user's account.
   *
   * This function allows adding an insight to a user's account by specifying top-level parameters. The function will internally construct the request body for the API call. The user does not need to provide a `body` object directly.
   *
   * - It is a clone of the insight document with limited keys.
   * - Insight properties and default tags are fetched from the insight document.
   * - User quota is checked and incremented before adding the insight.
   * - User must have access to the insight to add it to their account.
   *
   * @param options - Options for adding a user insight:
   *   @param insightID {string} - ID of the insight to add. (required)
   *   @param insightName {string} - Name of the insight. (required)
   *   @param note {string} - Note for the insight. (optional)
   *   @param userTags {Array<string>} - Tags for the insight. (optional)
   *   @param starred {boolean} - Starred status of the insight. (optional)
   *   @param hidden {boolean} - Hidden status of the insight. (optional)
   *   @param icon {string} - Icon for the insight. (optional)
   *   @param organisations {Array<string>} - Organisation IDs to associate. (optional)
   *   @param user {object} - User object with details (id, email, organisation, etc.). (optional)
   *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<AddUserInsightResponse>} The API response data.
   *
   * @example
   * const result = await bruceHandler.addUserInsight({
   *   insightID: 'INS_Test420',
   *   insightName: 'INS_Test420',
   *   organisations: ['5b0d386f82d7525268dfbe06'],
   *   user: {
   *     id: '603cd490b561b6734a3cd4b5',
   *     email: 'aditya@faclon.com',
   *     organisation: '5b0d386f82d7525268dfbe06',
   *     // ...other user fields
   *   },
   *   userTags: [],
   *   note: 'Testing addition of org',
   *   starred: true,
   *   hidden: false,
   *   icon: 'trust_me_i_m_a_link',
   * });
   */
  async addUserInsight(options: Omit<AddUserInsightOptions, 'body'> & {
    insightID: string;
    insightName: string;
    note?: string;
    userTags?: string[];
    starred?: boolean;
    hidden?: boolean;
    icon?: string;
    organisations?: string[];
    user?: any;
    [key: string]: any;
  }): Promise<AddUserInsightResponse> {
    const {
      insightID,
      insightName,
      note,
      userTags,
      starred,
      hidden,
      icon,
      organisations,
      user,
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;
    const url = this.formatUrl(BRUCE_ADD_USER_INSIGHT_URL, onPrem);
    const body: any = {
      insightID,
      insightName,
    };
    if (note !== undefined) body.note = note;
    if (userTags !== undefined) body.userTags = userTags;
    if (starred !== undefined) body.starred = starred;
    if (hidden !== undefined) body.hidden = hidden;
    if (icon !== undefined) body.icon = icon;
    if (organisations !== undefined) body.organisations = organisations;
    if (user !== undefined) body.user = user;
    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['onPrem', 'extraHeaders'].includes(key)) {
        body[key] = rest[key];
      }
    }
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.post(url, body, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * @description - Fetches paginated insight results for a given insight ID from the Bruce API. This function allows filtering, projection, and pagination of results. It is designed to be used by the cursor or any user prompt to fetch insight results based on user-specified criteria.
   *
   * @param options - The options for fetching insight results.
   *   @param insightID {string} - ID of the insight to fetch results for.
   *   @param body {object} - Request body containing:
   *     @param filters {object} - Filter object for results.
   *       @param _id {string} - ID of the result.
   *       @param applicationID {string[]} - Array of application IDs.
   *       @param resultName {string} - Name of the result.
   *       @param tags {string[]} - Tags to filter results.
   *       @param startDate {string} - Start date (ISO string) for filtering results.
   *       @param endDate {string} - End date (ISO string) for filtering results.
   *       @param insightProperty {Array<{ propertyName: string; propertyValue: string[] }>} - Array of insight properties to filter results.
   *     @param projection {object} - Projection object to fetch only required keys.
   *     @param pagination {object} - Pagination object. If not provided, all results are returned.
   *       @param page {number} - Page number. If not provided, defaults to all results.
   *       @param count {number} - Number of results per page.
   *   @param onPrem {boolean} - Optional. Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - Optional. Additional HTTP headers.
   *
   * @returns {Promise<FetchInsightResultResponse>} The API response containing the paginated insight results, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       data: [
   *         {
   *           _id: string,
   *           tags: string[],
   *           applicationID: string | null,
   *           resultName: string,
   *           metadata: {
   *             userID: {
   *               _id: string,
   *               userDetail: {
   *                 _id: string,
   *                 personalDetails: {
   *                   name: {
   *                     first: string,
   *                     last: string
   *                   }
   *                 }
   *               }
   *             }
   *           },
   *           createdAt: string
   *         }
   *       ],
   *       totalCount: number,
   *       pagination: {
   *         page: number,
   *         count: number,
   *         totalPages: number
   *       }
   *     }
   *   }
   */
  async fetchInsightResult(options: Omit<FetchInsightResultOptions, 'body'> & {
    filters?: any;
    projection?: any;
    pagination?: any;
    [key: string]: any;
  }): Promise<FetchInsightResultResponse> {
    const {
      insightID,
      filters,
      projection,
      pagination,
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;
    const url = this.formatUrl(BRUCE_INSIGHT_RESULT_FETCH_PAGINATED_URL, onPrem).replace('{insightID}', encodeURIComponent(insightID));
    const body: any = {};
    if (filters !== undefined) body.filters = filters;
    if (projection !== undefined) body.projection = projection;
    if (pagination !== undefined) body.pagination = pagination;
    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['insightID', 'onPrem', 'extraHeaders'].includes(key)) {
        body[key] = rest[key];
      }
    }
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.put(url, body, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }
}

