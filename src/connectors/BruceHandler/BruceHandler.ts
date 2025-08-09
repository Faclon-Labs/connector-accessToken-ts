import { BruceHandlerBase } from './base.js';
import { UserInsightsHandler } from './userInsights.js';
import { SourceInsightsHandler } from './sourceInsights.js';
import { UserInsightManagementHandler } from './userInsightManagement.js';
import { InsightResultsHandler } from './insightResults.js';
import {
  FetchUserInsightsOptions,
  FetchUserInsightsResponse,
  FetchSourceInsightOptions,
  GetSourceInsightResponse,
  UpdateSingleUserInsightOptions,
  UpdateSingleUserInsightResponse,
  AddUserInsightOptions,
  AddUserInsightResponse,
  FetchInsightResultOptions,
  FetchInsightResultResponse
} from './types.js';

export class BruceHandler extends BruceHandlerBase {
  private userInsightsHandler: UserInsightsHandler;
  private sourceInsightsHandler: SourceInsightsHandler;
  private userInsightManagementHandler: UserInsightManagementHandler;
  private insightResultsHandler: InsightResultsHandler;

  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    super(dataUrl, accessToken, onPrem, tz);
    this.userInsightsHandler = new UserInsightsHandler(this);
    this.sourceInsightsHandler = new SourceInsightsHandler(this);
    this.userInsightManagementHandler = new UserInsightManagementHandler(this);
    this.insightResultsHandler = new InsightResultsHandler(this);
  }

  /**
   * Fetches all insights added to the user's account, with support for advanced filtering, sorting, projection, and pagination.
   */
  async fetchUserInsights(options: FetchUserInsightsOptions = {}): Promise<FetchUserInsightsResponse> {
    return this.userInsightsHandler.fetchUserInsights(options);
  }

  /**
   * Fetches a source insight by insightID from the Bruce API using an options object.
   */
  async fetchSourceInsight(options: FetchSourceInsightOptions): Promise<GetSourceInsightResponse> {
    return this.sourceInsightsHandler.fetchSourceInsight(options);
  }

  /**
   * Update an insight in the user's account.
   */
  async updateSingleUserInsight(options: Omit<UpdateSingleUserInsightOptions, 'body'> & {
    insightID: string;
    update: object;
    user?: any;
    [key: string]: any;
  }): Promise<UpdateSingleUserInsightResponse> {
    return this.userInsightManagementHandler.updateSingleUserInsight(options);
  }

  /**
   * Add a new insight to the user's account.
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
    return this.userInsightManagementHandler.addUserInsight(options);
  }

  /**
   * Fetches paginated insight results for a given insight ID from the Bruce API.
   */
  async fetchInsightResult(options: Omit<FetchInsightResultOptions, 'body'> & {
    filters?: any;
    projection?: any;
    pagination?: any;
    [key: string]: any;
  }): Promise<FetchInsightResultResponse> {
    return this.insightResultsHandler.fetchInsightResult(options);
  }
}

// Re-export all types for convenience
export * from './types.js';

