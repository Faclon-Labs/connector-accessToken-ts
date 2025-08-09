import { BRUCE_INSIGHT_RESULT_FETCH_PAGINATED_URL } from '../../utils/constants.js';
import { BruceHandlerBase } from './base.js';
import { FetchInsightResultOptions, FetchInsightResultResponse } from './types.js';

export class InsightResultsHandler {
  private base: BruceHandlerBase;

  constructor(base: BruceHandlerBase) {
    this.base = base;
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
    const url = this.base.formatUrl(BRUCE_INSIGHT_RESULT_FETCH_PAGINATED_URL, onPrem).replace('{insightID}', encodeURIComponent(insightID));
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
      Authorization: `Bearer ${this.base.getAccessToken()}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };
    return this.base.putWithRetry<FetchInsightResultResponse>(url, body, headers);
  }
} 