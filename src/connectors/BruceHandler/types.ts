import { AxiosResponse } from 'axios';

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