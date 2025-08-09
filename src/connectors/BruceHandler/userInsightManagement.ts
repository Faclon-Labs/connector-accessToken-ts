import { BRUCE_UPDATE_SINGLE_USER_INSIGHT_URL, BRUCE_ADD_USER_INSIGHT_URL } from '../../utils/constants.js';
import { BruceHandlerBase } from './base.js';
import { 
  UpdateSingleUserInsightOptions, 
  UpdateSingleUserInsightResponse,
  AddUserInsightOptions,
  AddUserInsightResponse 
} from './types.js';

export class UserInsightManagementHandler {
  private base: BruceHandlerBase;

  constructor(base: BruceHandlerBase) {
    this.base = base;
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
    const url = this.base.formatUrl(BRUCE_UPDATE_SINGLE_USER_INSIGHT_URL, onPrem);
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
      Authorization: `Bearer ${this.base.getAccessToken()}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    return this.base.putWithRetry<UpdateSingleUserInsightResponse>(url, body, headers);
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
    const url = this.base.formatUrl(BRUCE_ADD_USER_INSIGHT_URL, onPrem);
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
      Authorization: `Bearer ${this.base.getAccessToken()}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    return this.base.postWithRetry<AddUserInsightResponse>(url, body, headers);
  }
} 