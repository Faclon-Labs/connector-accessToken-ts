import axios, { AxiosResponse } from 'axios';
import {
    USER_LOGIN_URL
} from '../utils/constants.js';

export interface LoginRequest {
  username: string;
  password: string;
  fcmToken?: string;
}

export interface LoginOptions {
  username: string;
  password: string;
  fcmToken?: string;
  dataUrl?: string;
  onPrem?: boolean;
  organisation?: string;
  origin?: string;
  'x-real-ip'?: string;
  'user-agent'?: string;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

export interface LoginResponse {
  success: boolean;
  refresh_token: string;
  authorization: string;
  ifToken: string;
  version: string;
  errors: any[];
  user: User;
}

export interface User {
  id: string;
  isActive: boolean;
  isDemoUser: boolean;
  email: string;
  organisation: Organisation;
  userDetail: UserDetail;
  entitySet: EntitySet[];
  aclRecord: any;
  sessionTime: string;
  isSubUser: boolean;
  isOnlySubUser: boolean;
  parents: any[];
}

export interface Organisation {
  _id: string;
  orgID: string;
  orgName: string;
  iconUrl: string;
  emailLogoUrl: string;
  appName: string;
  reportIcon: string;
  entitySet: string;
}

export interface UserDetail {
  personalDetails: PersonalDetails;
  homeState: string;
  sortOrder: Record<string, number>;
  pageView: Record<string, number>;
  reportDetails: Record<string, ReportDetail>;
  automationAccess: string;
  properties: any[];
}

export interface PersonalDetails {
  name: {
    first: string;
    last: string;
  };
  phone: {
    number: string;
    internationalNumber: string;
    dialCode: string;
    countryCode: string;
    e164Number: string;
    name: string;
  };
  profilePicUrl: string;
  gender: string;
}

export interface ReportDetail {
  _id: string;
  title: string;
  subHeader1: string;
  subHeader2: string;
}

export interface EntitySet {
  newTab: boolean;
  hide: boolean;
  _id: string;
  children: EntitySet[];
  path: string;
  title: string;
  type: string;
  icontype: string;
  name: string;
  collapse?: string;
  time?: any;
}

/**
 * Authenticates a user with the login API.
 *
 * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
 * The function will internally construct the request body for the API call.
 *
 * Endpoint: /api/account/login
 * Method: POST
 *
 * @param options - Options for user login. All fields are optional unless otherwise specified:
 *   @param username {string} - User's email or username. (required)
 *   @param password {string} - User's password. (required)
 *   @param fcmToken {string} - Optional Firebase Cloud Messaging token for push notifications.
 *   @param dataUrl {string} - The backend server URL. Defaults to 'connector.iosense.io'.
 *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
 *   @param organisation {string} - Organisation URL or identifier. Defaults to 'https://iosense.io'.
 *   @param origin {string} - Origin URL for the request. Defaults to 'https://iosense.io'.
 *   @param 'x-real-ip' {string} - (optional) Real IP address of the client.
 *   @param 'user-agent' {string} - (optional) User agent string for the request.
 *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
 *   @param [other fields] - Any additional fields to include in the request body.
 *
 * @returns {Promise<LoginResponse | null>} The API response data or null if login fails, e.g.:
 *   {
 *     success: true,
 *     refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     ifToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     version: "1.0.0",
 *     errors: [],
 *     user: {
 *       id: "603cd490b561b6734a3cd4b5",
 *       isActive: true,
 *       isDemoUser: false,
 *       email: "user@example.com",
 *       organisation: { ... },
 *       userDetail: { ... },
 *       entitySet: [ ... ],
 *       aclRecord: { ... },
 *       sessionTime: "2024-01-01T00:00:00.000Z",
 *       isSubUser: false,
 *       isOnlySubUser: false,
 *       parents: []
 *     }
 *   }
 *
 * @example
 * // Basic login with only required fields (using defaults):
 * const response = await login({
 *   username: 'user@example.com',
 *   password: 'securepassword123'
 * });
 *
 * // Login with custom URLs:
 * const response = await login({
 *   username: 'user@example.com',
 *   password: 'securepassword123',
 *   dataUrl: 'custom.iosense.io',
 *   organisation: 'https://custom.com',
 *   origin: 'https://custom.com'
 * });
 *
 * // Login with optional fields:
 * const response = await login({
 *   username: 'user@example.com',
 *   password: 'securepassword123',
 *   fcmToken: 'fcm_token_here',
 *   dataUrl: 'appserver.iosense.io',
 *   onPrem: false,
 *   organisation: 'https://iosense.io',
 *   origin: 'https://iosense.io',
 *   'x-real-ip': '127.0.0.1',
 *   'user-agent': 'CustomAgent/1.0',
 *   extraHeaders: {
 *     'Custom-Header': 'custom-value'
 *   }
 * });
 */
export async function login(options: LoginOptions): Promise<LoginResponse | null> {
  const {
    username,
    password,
    fcmToken,
    dataUrl = 'connector.iosense.io',
    onPrem = false,
    organisation = 'https://iosense.io',
    origin = 'https://iosense.io',
    'x-real-ip': xRealIp,
    'user-agent': userAgent,
    extraHeaders = {},
    ...rest
  } = options;

  // Construct the request body
  const requestBody: LoginRequest = {
    username,
    password,
  };
  
  if (fcmToken !== undefined) {
    requestBody.fcmToken = fcmToken;
  }

  // Add any other fields provided by the user (except those already handled)
  for (const key of Object.keys(rest)) {
    if (!['dataUrl', 'onPrem', 'organisation', 'origin', 'x-real-ip', 'user-agent', 'extraHeaders'].includes(key)) {
      (requestBody as any)[key] = rest[key];
    }
  }

  // Construct headers
  const headers: Record<string, string> = {
    organisation,
    origin,
    ...extraHeaders,
  };

  if (xRealIp !== undefined) {
    headers['x-real-ip'] = xRealIp;
  }
  if (userAgent !== undefined) {
    headers['user-agent'] = userAgent;
  }
  if (fcmToken !== undefined) {
    headers.fcmToken = fcmToken;
  }

  const protocol = onPrem ? 'http' : 'https';
  const url = USER_LOGIN_URL.replace('{protocol}', protocol).replace('{backend_url}', dataUrl);

  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(url, requestBody, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', {
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

