/**
 * Represents a user's name information.
 */
export interface Name {
  first: string;
  last: string;
}

/**
 * Phone information with multiple common formats.
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
 * Personal details pertaining to a user profile.
 */
export interface PersonalDetails {
  name: Name;
  phone: Phone;
  profilePicUrl: string;
  gender: string;
}

/**
 * Minimal identity details for a user.
 */
export interface UserID {
  _id: string;
  email: string;
  mobile: string;
}

/**
 * Response payload returned by getUserDetails.
 */
export interface UserDetailsResponse {
  personalDetails: PersonalDetails;
  userID: UserID;
  userdashboards: Array<{ _id: string; name: string }>;
  dashboards: Array<{ _id: string; name: string }>;
  mobile: string;
  email: string;
  company: string;
}

/**
 * Standard header map for UserAccess requests.
 */
export type UserDetailsHeaders = Record<string, string>;

/**
 * Request body for getUserQuota endpoint.
 */
export interface UserQuotaRequest {
  entity: string;
  value: number;
}

/**
 * Quota item describing credits, usage, and status.
 */
export interface QuotaItem {
  cred: number;
  used: number;
  safe: number;
  isActive: boolean;
  title: string;
}

/**
 * Response payload returned by getUserQuota.
 */
export interface UserQuotaResponse {
  success: boolean;
  data: Record<string, QuotaItem>;
}

/**
 * Route entry describing a navigable path and its metadata.
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
 * Response payload returned by getUserEntities.
 */
export interface UserEntitiesResponse {
  success: boolean;
  data: {
    routes: string[];
    updatedAt: string;
  };
}

/**
 * Response payload returned by userEntity/fetch.
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
 * Back-compat alias for getUserDetails response type.
 */
export type { UserDetailsResponse as Response };