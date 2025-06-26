import axios, { AxiosResponse } from 'axios';
import {
    USER_LOGIN_URL
} from '../../utils/constants.js';

export interface LoginRequest {
  username: string;
  password: string;
  fcmToken?: string;
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

export async function login(
  dataUrl: string,
  onPrem: boolean,
  request: LoginRequest,
  headers: {
    organisation: string;
    origin: string;
    'x-real-ip'?: string;
    'user-agent'?: string;
    fcmToken?: string;
  }
): Promise<LoginResponse | null> {
  const protocol = onPrem ? 'http' : 'https';
  const url = USER_LOGIN_URL.replace('{protocol}', protocol).replace('{backend_url}', dataUrl);

  try {
    const response: AxiosResponse<LoginResponse> = await axios.post(url, request, {
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

