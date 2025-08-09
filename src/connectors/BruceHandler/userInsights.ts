import { BRUCE_USER_INSIGHT_FETCH_PAGINATED_URL } from '../../utils/constants.js';
import { BruceHandlerBase } from './base.js';
import { FetchUserInsightsOptions, FetchUserInsightsResponse } from './types.js';

export class UserInsightsHandler {
  private base: BruceHandlerBase;

  constructor(base: BruceHandlerBase) {
    this.base = base;
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

    const url = this.base.formatUrl(BRUCE_USER_INSIGHT_FETCH_PAGINATED_URL, onPrem);
    const payload = { ...rest };

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.base.getAccessToken()}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    return this.base.putWithRetry<FetchUserInsightsResponse>(url, payload, headers);
  }
} 