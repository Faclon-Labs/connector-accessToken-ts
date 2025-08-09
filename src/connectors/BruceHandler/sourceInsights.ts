import { BRUCE_GET_SOURCE_INSIGHT_URL } from '../../utils/constants.js';
import { BruceHandlerBase } from './base.js';
import { FetchSourceInsightOptions, GetSourceInsightResponse } from './types.js';

export class SourceInsightsHandler {
  private base: BruceHandlerBase;

  constructor(base: BruceHandlerBase) {
    this.base = base;
  }

  /**
   * Fetches a source insight by insightID from the Bruce API using an options object.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/bruce/userInsight/fetch/getSourceInsight/:insightID
   * Method: PUT
   *
   * @param options - Options for fetching source insight:
   *   @param insightID {string} - The insight ID to fetch. (required)
   *   @param projection {object} - (optional) Projection object to fetch only required keys.
   *   @param populate {Array} - (optional) Array of fields to populate. Each object can have:
   *     @param path {string} - Field to populate (e.g., 'tags').
   *     @param select {string} - Fields to select (e.g., 'insightProperty').
   *   @param onPrem {boolean} - (optional) Whether to use HTTP (true) or HTTPS (false, default).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<GetSourceInsightResponse>} The API response data, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       _id: "67a0f921ce9e515b27156125",
   *       organisations: ["5b0d386f82d7525268dfbe06"],
   *       restrictedAccess: false,
   *       whitelistedUsers: [],
   *       tags: ["idk_why"],
   *       insightID: "NOTIF_INS_03",
   *       note: "Testing addition of org",
   *       insightProperty: [
   *         {
   *           propertyDataType: "String",
   *           propertyValue: ["Mumbai"],
   *           _id: "67a0f921ce9e515b27156126",
   *           propertyName: "location"
   *         }
   *       ],
   *       added_by: "6156a091970a3e4bcee2f4c6",
   *       createdAt: "2025-02-03T17:13:05.666Z",
   *       updatedAt: "2025-02-05T11:19:03.834Z",
   *       __v: 0,
   *       users: ["62823b1e78d65a047c05592b"]
   *     }
   *   }
   *
   * @example
   * // Basic usage with insight ID:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03'
   * });
   *
   * // With projection and populate:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03',
   *   projection: { insightID: 1, note: 1, tags: 1 },
   *   populate: [{ path: 'tags', select: 'insightProperty' }]
   * });
   *
   * // With additional headers:
   * const result = await bruceHandler.fetchSourceInsight({
   *   insightID: 'NOTIF_INS_03',
   *   extraHeaders: {
   *     origin: 'https://iosense.io'
   *   }
   * });
   */
  async fetchSourceInsight(options: FetchSourceInsightOptions): Promise<GetSourceInsightResponse> {
    const {
      insightID,
      projection,
      populate,
      onPrem,
      extraHeaders = {},
      ...rest
    } = options;
    
    const url = this.base.formatUrl(BRUCE_GET_SOURCE_INSIGHT_URL, onPrem).replace('{insightID}', encodeURIComponent(insightID));
    
    // Construct the request body
    const body: any = {};
    if (projection !== undefined) body.projection = projection;
    if (populate !== undefined) body.populate = populate;
    
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
    
    return this.base.putWithRetry<GetSourceInsightResponse>(url, body, headers);
  }
} 