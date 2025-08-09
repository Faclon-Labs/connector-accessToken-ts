import axios, { AxiosResponse } from 'axios';
import { DEVICE_ALL_PAGINATED_URL, Protocol } from '../../utils/constants.js';
import { DeviceAccessBase } from './base.js';
import { GetAllDevicesPaginatedOptions, GetAllDevicesPaginatedResponse } from './types.js';

export class DeviceListHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
  }

  /**
   * Fetches paginated list of user devices with advanced filtering and sorting.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * @param options - Options for fetching paginated devices. All fields are optional unless otherwise specified:
   *   @param skip {number} - Page number for pagination, 1-based (default: 1, minimum: 1).
   *   @param limit {number} - Number of devices to return per page (default: 10).
   *   @param search {DeviceSearchParams} - Search parameters for filtering devices.
   *     @param all {string[]} - Searches across all fields.
   *     @param devID {string[]} - Filters by device ID.
   *     @param devName {string[]} - Filters by device name.
   *     @param tags {string[]} - Filters by tags.
   *   @param isHidden {boolean} - Include hidden devices (default: false).
   *   @param order {string} - Sort order: 'stared' or 'default' (default: 'stared').
   *   @param sort {string} - Name sorting: 'AtoZ' or 'ZtoA' (default: 'AtoZ').
   *   @param filter {string[]} - Advanced filters (e.g., ['priority:high']).
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<GetAllDevicesPaginatedResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Basic pagination - get first 10 devices:
   * const result = await deviceAccess.getAllDevicesPaginated({
   *   skip: 1,
   *   limit: 10
   * });
   *
   * // Search for temperature devices with specific tags:
   * const result = await deviceAccess.getAllDevicesPaginated({
   *   skip: 0,
   *   limit: 20,
   *   search: {
   *     all: ["sensor"],
   *     devID: ["DEV"],
   *     tags: ["temperature"]
   *   },
   *   isHidden: false,
   *   order: "stared",
   *   sort: "AtoZ",
   *   filter: ["priority:high"]
   * });
   */
  async getAllDevicesPaginated(options: GetAllDevicesPaginatedOptions = {}): Promise<GetAllDevicesPaginatedResponse | null> {
    const {
      skip = 1,  // Default to 1 as per API requirement
      limit = 10,
      search,
      isHidden = false,
      order = 'stared',
      sort = 'AtoZ',
      filter,
      extraHeaders = {},
      ...rest
    } = options;

    // Ensure skip is at least 1 (API requirement)
    const validSkip = Math.max(1, skip);

    const url = this.base.formatUrl(DEVICE_ALL_PAGINATED_URL)
      .replace('{skip}', validSkip.toString())
      .replace('{limit}', limit.toString());

    // Construct the request body
    const requestBody: any = {
      isHidden,
      order,
      sort,
    };

    if (search !== undefined) {
      requestBody.search = search;
    }
    if (filter !== undefined) {
      requestBody.filter = filter;
    }

    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['skip', 'limit', 'search', 'isHidden', 'order', 'sort', 'filter', 'extraHeaders'].includes(key)) {
        requestBody[key] = rest[key];
      }
    }

    const headers = this.base.createHeaders({
      'Content-Type': 'application/json',
      ...extraHeaders,
    });

    try {
      const response: AxiosResponse<GetAllDevicesPaginatedResponse> = await axios.put(url, requestBody, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get all devices paginated error:', {
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