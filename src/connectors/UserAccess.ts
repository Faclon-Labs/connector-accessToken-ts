import axios, { AxiosResponse } from 'axios';
import { USER_DETAILS_URL, USER_QUOTA_URL, USER_ENTITIES_URL, USER_ENTITY_FETCH_URL } from '../../utils/constants.js';

/**
 * Represents a user's name with first and last fields.
 */
export interface Name {
  first: string;
  last: string;
}

/**
 * Represents a user's phone details, including international formats and country info.
 */
export interface Phone {
  number: string;
  internationalNumber: string;
  dialCode: string;
  countryCode: string;
  e164Number: string;
  name: string;
}

/**
 * Contains personal details of the user, such as name, phone, profile picture, and gender.
 */
export interface PersonalDetails {
  name: Name;
  phone: Phone;
  profilePicUrl: string;
  gender: string;
}

/**
 * Represents the user ID object returned by the getUserDetails API, including user status, email, roles, and other metadata.
 */
export interface UserID {
  isSubUser: boolean;
  isOnlySubUser: boolean;
  parents: any[];
  unverifiedParents: any[];
  suspendedParents: any[];
  subUsers: any[];
  tags: any[];
  activationKeys: string[];
  isActive: boolean;
  isDemoUser: boolean;
  search: any[];
  isRegisteredFromUserPortal: boolean;
  reportLogsCustomFolders: any[];
  starReportLogsFolders: any[];
  _id: string;
  hasClientCompany: boolean;
  quota: string[];
  email: string;
  added_by: string;
  organisation: string;
  clientCompany: string | null;
  timeCreated: string;
  userDetail: string;
  aclRecord: string;
  __v: number;
  resetPasswordExpires: string;
  resetPasswordToken: string;
  password: string;
  ifToken: string;
}

/**
 * The response structure returned by the getUserDetails API endpoint.
 */
export interface UserDetailsResponse {
  personalDetails: PersonalDetails;
  userID: UserID;
  userdashboards: any[];
  dashboards: any[];
  email: string;
}

/**
 * Headers required for the getUserDetails API request.
 *
 * @example
 * {
 *   Authorization: 'Bearer <access_token>',
 *   origin: 'https://iosense.io',
 *   organisation?: 'your_organisation',
 *   'x-real-ip'?: '127.0.0.1',
 *   'user-agent'?: 'CustomAgent',
 *   fcmToken?: 'optional_token',
 * }
 */
export type UserDetailsHeaders = Record<string, string>;

/**
 * Request body for getUserQuota API.
 */
export interface UserQuotaRequest {
  entity: string;
  value: number;
}

/**
 * Structure for each quota item in the response.
 */
export interface QuotaItem {
  cred: number;
  used: number;
  safe: number;
  isActive: boolean;
  title: string;
}

/**
 * The response structure returned by the getUserQuota API endpoint.
 */
export interface UserQuotaResponse {
  success: boolean;
  data: Record<string, QuotaItem>;
}

/**
 * Structure for a route in the user entities response.
 */
export interface UserEntityRoute {
  newTab: boolean;
  hide: boolean;
  _id: string;
  children: UserEntityRoute[];
  path: string;
  title: string;
  type: string;
  icontype: string;
  name: string;
  collapse?: string;
  time?: any;
}

/**
 * The response structure returned by the getUserEntities API endpoint.
 */
export interface UserEntitiesResponse {
  success: boolean;
  data: {
    _id: string;
    routes: UserEntityRoute[];
    updatedAt: string;
  };
}

/**
 * The response structure returned by the userEntity/fetch API endpoint.
 */
export interface UserEntityFetchResponse {
  success: boolean;
  data: {
    _id: string;
    routes: UserEntityRoute[];
    userID: string;
    organisation: string;
    clientCompany: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

/**
 * Service class for accessing user-related API endpoints.
 *
 * This class is designed to be instantiated with a backend URL, an access token, and a flag indicating whether the server is on-premise.
 * It provides a method to fetch user details using a GET request, automatically including the access token in the Authorization header.
 *
 * Example usage:
 * ```typescript
 * const userAccess = new UserAccess('appserver.iosense.io', '<access_token>', false);
 * const userDetails = await userAccess.userdetails({ origin: 'https://iosense.io' });
 * ```
 */
export class UserAccess {
  private dataUrl: string;
  private accessToken: string;
  private onPrem: boolean;

  /**
   * Constructs a new UserAccess service instance.
   *
   * @param dataUrl - The backend server URL (e.g., 'appserver.iosense.io').
   * @param accessToken - The Bearer access token for Authorization.
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean) {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
  }

  /**
   * Fetches the details of the currently authenticated user from the backend API.
   *
   * @description
   * This method fetches comprehensive user metadata from the backend API, including personal details,
   * user status, contact information, and profile data. It is typically used to personalize dashboards,
   * build user profiles, or display authenticated user data in the frontend UI. The HTTP or HTTPS protocol
   * is chosen dynamically based on deployment mode (`onPrem`).
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns The user details response object if successful as shown in the example, or null if an error occurs.
   *
   * @example
   * ```typescript
   * const userAccess = new UserAccess('appserver.iosense.io', '<access_token>', false);
   * const userDetails = await userAccess.userdetails({ origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   personalDetails: {
   * //     name: { first: 'John', last: 'Doe' },
   * //     phone: {
   * //       number: '1234567890',
   * //       internationalNumber: '+91 1234567890',
   * //       dialCode: '91',
   * //       countryCode: 'in',
   * //       e164Number: '+911234567890',
   * //       name: 'India'
   * //     },
   * //     profilePicUrl: 'https://example.com/profile.jpg',
   * //     gender: 'male'
   * //   },
   * //   userID: {
   * //     isSubUser: false,
   * //     isOnlySubUser: false,
   * //     parents: [],
   * //     unverifiedParents: [],
   * //     suspendedParents: [],
   * //     subUsers: [],
   * //     tags: [],
   * //     activationKeys: ['dummy_activation_key'],
   * //     isActive: true,
   * //     isDemoUser: false,
   * //     search: [],
   * //     isRegisteredFromUserPortal: false,
   * //     reportLogsCustomFolders: [],
   * //     starReportLogsFolders: [],
   * //     _id: 'dummy_user_id',
   * //     hasClientCompany: false,
   * //     quota: ['dummy_quota_id'],
   * //     email: 'john.doe@example.com',
   * //     added_by: 'dummy_added_by',
   * //     organisation: 'dummy_organisation_id',
   * //     clientCompany: null,
   * //     timeCreated: '2023-01-01T00:00:00.000Z',
   * //     userDetail: 'dummy_user_detail_id',
   * //     aclRecord: 'dummy_acl_record_id',
   * //     __v: 0,
   * //     resetPasswordExpires: '2023-12-31T23:59:59.999Z',
   * //     resetPasswordToken: '',
   * //     password: 'dummy_hashed_password',
   * //     ifToken: 'dummy_if_token'
   * //   },
   * //   userdashboards: [],
   * //   dashboards: [],
   * //   email: 'john.doe@example.com'
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async userdetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = USER_DETAILS_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: UserDetailsHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      const response: AxiosResponse<UserDetailsResponse> = await axios.get(url, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('User details error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }

  /**
   * Fetches the quota information for the user from the backend API.
   *
   * @description
   * This method fetches quota information for various entities (devices, widgets, etc.) for the authenticated user.
   * It sends a GET request to the `/api/account/profile/quota` endpoint.
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns The user quota response object if successful, or null if an error occurs.
   *
   * @example
   * ```typescript
   * const userAccess = new UserAccess('appserver.iosense.io', '<access_token>', false);
   * const quota = await userAccess.getUserQuota({ origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   success: true,
   * //   data: {
   * //     widget: { cred: 50, used: 10, safe: 40, isActive: true, title: 'Dashboard Widget' },
   * //     device: { cred: 500, used: 100, safe: 400, isActive: true, title: 'DEVICE' },
   * //     sms: { cred: 30, used: 5, safe: 25, isActive: true, title: 'SMS' },
   * //     email: { cred: 60, used: 20, safe: 40, isActive: true, title: 'EMAIL' },
   * //     contact: { cred: 15, used: 2, safe: 13, isActive: true, title: 'CONTACT' },
   * //     trigger: { cred: 12, used: 1, safe: 11, isActive: true, title: 'TRIGGER' },
   * //     report: { cred: 2500, used: 300, safe: 2200, isActive: true, title: 'REPORT' },
   * //     auto: { cred: 15, used: 0, safe: 15, isActive: true, title: 'Automation Action' },
   * //     voiceCal: { cred: 12, used: 2, safe: 10, isActive: true, title: 'Voice alerts' },
   * //     USER: { cred: 12, used: 0, safe: 12, isActive: true, title: 'CLIENT' },
   * //     APIS: { cred: 12, used: 0, safe: 12, isActive: true, title: 'APIS' },
   * //     Testing: { cred: 12, used: 0, safe: 12, isActive: true, title: 'Testing' },
   * //     'AI Token': { cred: 12, used: 0, safe: 12, isActive: true, title: 'AI Token' },
   * //     Test: { cred: 12, used: 0, safe: 12, isActive: true, title: 'Test' },
   * //     whatsapp: { cred: 25, used: 5, safe: 20, isActive: true, title: 'WHATSAPP' }
   * //   }
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserQuota(
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserQuotaResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = USER_QUOTA_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: UserDetailsHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      const response: AxiosResponse<UserQuotaResponse> = await axios.get(url, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('User quota error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }

  /**
   * Fetches the user entities for the authenticated user from the backend API.
   *
   * @description
   * This method fetches the entities (routes, dashboards, etc.) available to the authenticated user.
   * It sends a GET request to the `/api/account/getUserEntities` endpoint with the specified query parameters.
   *
   * @param params - The query parameters containing the entity and value.
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns The user entities response object if successful, or null if an error occurs.
   *
   * @example
   * ```typescript
   * const userAccess = new UserAccess('appserver.iosense.io', '<access_token>', false);
   * const params = { entity: 'devices', value: 2 };
   * const entities = await userAccess.getUserEntities(params, { origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   success: true,
   * //   data: {
   * //     _id: 'dummy_id',
   * //     routes: [
   * //       {
   * //         newTab: false,
   * //         hide: false,
   * //         _id: 'route_id',
   * //         children: [],
   * //         path: '/dashboard',
   * //         title: 'Dashboard',
   * //         type: 'link',
   * //         icontype: 'dashboard',
   * //         name: 'Dashboard',
   * //         collapse: 'dashboard',
   * //       },
   * //       // ... more routes ...
   * //     ],
   * //     updatedAt: '2025-06-19T14:59:29.939Z',
   * //   }
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserEntities(
    params: { entity: string; value: number },
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserEntitiesResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = USER_ENTITIES_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: UserDetailsHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      const response: AxiosResponse<UserEntitiesResponse> = await axios.get(url, {
        headers,
        params,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('User entities error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }

  /**
   * Fetches the user entity data for the authenticated user from the backend API.
   *
   * @description
   * This method fetches the entities (routes, dashboards, etc.) for the authenticated user.
   * It sends a GET request to the `/api/account/userEntity/fetch` endpoint.
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns The user entity fetch response object if successful, or null if an error occurs.
   *
   * @example
   * ```typescript
   * const userAccess = new UserAccess('appserver.iosense.io', '<access_token>', false);
   * const entities = await userAccess.getUserEntityFetch({ origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   success: true,
   * //   data: {
   * //     _id: 'dummy_id',
   * //     routes: [
   * //       {
   * //         newTab: false,
   * //         hide: false,
   * //         _id: 'route_id',
   * //         children: [],
   * //         path: '/dashboard',
   * //         title: 'Dashboard',
   * //         type: 'link',
   * //         icontype: 'dashboard',
   * //         name: 'Dashboard',
   * //         collapse: 'dashboard',
   * //       },
   * //       // ... more routes ...
   * //     ],
   * //     userID: 'dummy_user_id',
   * //     organisation: 'dummy_org_id',
   * //     clientCompany: null,
   * //     createdAt: '2023-06-07T13:17:19.189Z',
   * //     updatedAt: '2025-06-19T14:59:29.939Z',
   * //     __v: 0,
   * //   }
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserEntityFetch(
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserEntityFetchResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = USER_ENTITY_FETCH_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: UserDetailsHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      const response: AxiosResponse<UserEntityFetchResponse> = await axios.get(url, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('User entity fetch error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  }
}

/**
 * Alias for the user details API response type.
 */
export type { UserDetailsResponse as Response };
