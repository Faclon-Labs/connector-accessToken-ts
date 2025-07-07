import axios, { AxiosResponse } from 'axios';
import { USER_DETAILS_URL, USER_QUOTA_URL, USER_ENTITIES_URL, USER_ENTITY_FETCH_URL, Protocol } from '../utils/constants.js';

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
  _id: string;
  email: string;
  mobile: string;
}

/**
 * The response structure returned by the getUserDetails API endpoint.
 */
export interface UserDetailsResponse {
  personalDetails: PersonalDetails;
  userID: UserID;
  userdashboards: Array<{
    _id: string;
    name: string;
  }>;
  dashboards: Array<{
    _id: string;
    name: string;
  }>;
  mobile: string;
  email: string;
  company: string;
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
    routes: string[];
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
    updatedAt: string;
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
 * const userDetails = await userAccess.getUserDetails({ origin: 'https://iosense.io' });
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
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/getUserDetails
   * Method: GET
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns {Promise<UserDetailsResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "personalDetails": {
   *       "name": {
   *         "first": "John",
   *         "last": "Doe"
   *       },
   *       "phone": {
   *         "number": "9876543210",
   *         "internationalNumber": "+91 9876543210",
   *         "dialCode": "+91",
   *         "countryCode": "IN",
   *         "e164Number": "+919876543210",
   *         "name": "India"
   *       },
   *       "profilePicUrl": "https://example.com/profile.jpg",
   *       "gender": "male"
   *     },
   *     "userID": {
   *       "_id": "5f8d...",
   *       "email": "john.doe@example.com",
   *       "mobile": "+919876543210"
   *     },
   *     "userdashboards": [
   *       {
   *         "_id": "5f8d...",
   *         "name": "Main Dashboard"
   *       }
   *     ],
   *     "dashboards": [
   *       {
   *         "_id": "5f8d...",
   *         "name": "Temperature Monitoring"
   *       }
   *     ],
   *     "mobile": "+919876543210",
   *     "email": "john.doe@example.com",
   *     "company": "Acme Corp"
   *   }
   *
   * @example
   * // Basic usage:
   * const result = await userAccess.getUserDetails();
   *
   * // With additional headers:
   * const result = await userAccess.getUserDetails({
   *   origin: 'https://iosense.io',
   *   organisation: 'my_org'
   * });
   *
   * // With custom headers:
   * const result = await userAccess.getUserDetails({
   *   'x-real-ip': '127.0.0.1',
   *   'user-agent': 'CustomAgent',
   *   fcmToken: 'optional_token'
   * });
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserDetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
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
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/profile/quota
   * Method: GET
   * Permission: Requires 'read' permission on '/overview'
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns {Promise<UserQuotaResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": {
   *       "auto": {
   *         "cred": 1000,
   *         "used": 250,
   *         "safe": 900,
   *         "isActive": true,
   *         "title": "Automation Actions"
   *       },
   *       "report": {
   *         "cred": 500,
   *         "used": 120,
   *         "safe": 450,
   *         "isActive": true,
   *         "title": "Report Generation"
   *       },
   *       "widget": {
   *         "cred": 50,
   *         "used": 10,
   *         "safe": 40,
   *         "isActive": true,
   *         "title": "Dashboard Widget"
   *       },
   *       "device": {
   *         "cred": 500,
   *         "used": 100,
   *         "safe": 400,
   *         "isActive": true,
   *         "title": "DEVICE"
   *       }
   *     }
   *   }
   *
   * @example
   * // Basic usage:
   * const result = await userAccess.getUserQuota();
   *
   * // With additional headers:
   * const result = await userAccess.getUserQuota({
   *   origin: 'https://iosense.io',
   *   organisation: 'my_org'
   * });
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserQuota(
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserQuotaResponse | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
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
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/getUserEntities
   * Method: GET
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns {Promise<UserEntitiesResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": {
   *       "routes": [
   *         "/dashboard",
   *         "/devices",
   *         "/reports"
   *       ],
   *       "updatedAt": "2023-06-15T10:30:45.000Z"
   *     }
   *   }
   *
   * @example
   * // Basic usage:
   * const result = await userAccess.getUserEntities();
   *
   * // With additional headers:
   * const result = await userAccess.getUserEntities({
   *   origin: 'https://iosense.io',
   *   organisation: 'my_org'
   * });
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserEntities(
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserEntitiesResponse | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = USER_ENTITIES_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: UserDetailsHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      const response: AxiosResponse<UserEntitiesResponse> = await axios.get(url, {
        headers,
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
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/userEntity/fetch
   * Method: GET
   * Description: Retrieves a user's authorized navigation routes and permissions
   * Authentication: Required (JWT in Authorization header)
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   *
   * @returns {Promise<UserEntityFetchResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": {
   *       "_id": "507f1f77bcf86cd799439011",
   *       "routes": [
   *         {
   *           "path": "/dashboard",
   *           "title": "Dashboard",
   *           "type": "item",
   *           "children": []
   *         }
   *       ],
   *       "updatedAt": "2023-06-15T10:30:45.000Z"
   *     }
   *   }
   *
   * @example
   * // Basic usage:
   * const result = await userAccess.getUserEntityFetch();
   *
   * // With additional headers:
   * const result = await userAccess.getUserEntityFetch({
   *   origin: 'https://iosense.io',
   *   organisation: 'my_org'
   * });
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getUserEntityFetch(
    extraHeaders: Partial<UserDetailsHeaders> = {}
  ): Promise<UserEntityFetchResponse | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
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

  /**
   * @deprecated Use getUserDetails() instead. This method is kept for backward compatibility.
   * 
   * Fetches the details of the currently authenticated user from the backend API.
   *
   * @param extraHeaders - Optional additional HTTP headers for the request (e.g., origin, organisation, etc.).
   * @returns The user details response object if successful, or null if an error occurs.
   */
  async userdetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    console.warn('userdetails() is deprecated. Use getUserDetails() instead.');
    return this.getUserDetails(extraHeaders);
  }
}

/**
 * Alias for the user details API response type.
 */
export type { UserDetailsResponse as Response };
