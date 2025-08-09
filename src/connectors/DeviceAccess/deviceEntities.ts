import axios, { AxiosResponse } from 'axios';
import { 
  DEVICE_LOAD_ENTITIES_GEN_URL, 
  DEVICE_LOAD_ENTITIES_GEN_BY_ID_URL,
  DEVICE_LOAD_ENTITIES_GEN_PAGINATED_URL 
} from '../../utils/constants.js';
import { DeviceAccessBase } from './base.js';
import { 
  LoadEntitiesGenOptions,
  LoadEntitiesGenResponse,
  LoadEntitiesGenByIdOptions,
  LoadEntitiesGenByIdResponse,
  LoadEntitiesGenPaginatedOptions,
  LoadEntitiesGenPaginatedResponse,
  DeviceHeaders 
} from './types.js';

export class DeviceEntitiesHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
  }

  /**
   * Fetches all load entities available to the authenticated user.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/load-entities-gen
   * Method: GET
   *
   * @param options - Options for fetching entities:
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<LoadEntitiesGenResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Basic usage:
   * const result = await deviceAccess.loadEntitiesGen();
   *
   * // With additional headers:
   * const result = await deviceAccess.loadEntitiesGen({
   *   extraHeaders: {
   *     origin: 'https://iosense.io'
   *   }
   * });
   */
  async loadEntitiesGen(options: LoadEntitiesGenOptions = {}): Promise<LoadEntitiesGenResponse | null> {
    const {
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.base.formatUrl(DEVICE_LOAD_ENTITIES_GEN_URL);

    const headers: Record<string, string> = this.base.createHeaders(extraHeaders);

    try {
      const response: AxiosResponse<LoadEntitiesGenResponse> = await axios.get(url, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Load entities gen error:', {
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
   * Fetches a single entity and its device configurations by ID.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/load-entities-gen/:id
   * Method: GET
   *
   * @param options - Options for fetching entity by ID:
   *   @param id {string} - The MongoDB ObjectID of the load entity to fetch. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<LoadEntitiesGenByIdResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Basic usage with entity ID:
   * const result = await deviceAccess.loadEntitiesGenById({
   *   id: '667ff38140ad724aeae6eaf5'
   * });
   *
   * // With additional headers:
   * const result = await deviceAccess.loadEntitiesGenById({
   *   id: '667ff38140ad724aeae6eaf5',
   *   extraHeaders: {
   *     origin: 'https://iosense.io'
   *   }
   * });
   */
  async loadEntitiesGenById(options: LoadEntitiesGenByIdOptions): Promise<LoadEntitiesGenByIdResponse | null> {
    const {
      id,
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.base.formatUrl(DEVICE_LOAD_ENTITIES_GEN_BY_ID_URL).replace('{id}', id);

    const headers: Record<string, string> = this.base.createHeaders(extraHeaders);

    try {
      const response: AxiosResponse<LoadEntitiesGenByIdResponse> = await axios.get(url, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Load entities gen by id error:', {
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
   * Fetches paginated load entities with advanced filtering and sorting capabilities.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/load-entities-gen/:page/:limit
   * Method: PUT
   *
   * @param options - Options for fetching paginated entities:
   *   @param page {number} - Page number for pagination (1-based). (required)
   *   @param limit {number} - Number of entities to return per page. (required)
   *   @param search {EntitySearchParams} - Search parameters for filtering entities. (optional)
   *     @param all {string[]} - Searches across all fields.
   *     @param name {string[]} - Filters by entity name.
   *     @param tags {string[]} - Filters by tags.
   *   @param archive {boolean} - Include archived entities (default: false). (optional)
   *   @param order {'increment' | 'decrement'} - Sort order direction. (optional)
   *   @param sort {'alphabetical' | 'timeUpdated' | 'timeCreated'} - Sort field. (optional)
   *   @param projection {string} - Fields to include in entity projection. (optional)
   *   @param deviceProjection {string} - Fields to include in device projection. (optional)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<LoadEntitiesGenPaginatedResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Basic pagination:
   * const result = await deviceAccess.loadEntitiesGenPaginated({
   *   page: 1,
   *   limit: 10
   * });
   *
   * // Advanced filtering and sorting:
   * const result = await deviceAccess.loadEntitiesGenPaginated({
   *   page: 1,
   *   limit: 20,
   *   search: {
   *     name: ["cluster"],
   *     tags: ["production"]
   *   },
   *   archive: false,
   *   order: "decrement",
   *   sort: "timeUpdated",
   *   projection: "name star devConfigs",
   *   deviceProjection: "devID devName sensors"
   * });
   */
  async loadEntitiesGenPaginated(options: LoadEntitiesGenPaginatedOptions): Promise<LoadEntitiesGenPaginatedResponse | null> {
    const {
      page,
      limit,
      search,
      archive,
      order,
      sort,
      projection,
      deviceProjection,
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.base.formatUrl(DEVICE_LOAD_ENTITIES_GEN_PAGINATED_URL)
      .replace('{page}', page.toString())
      .replace('{limit}', limit.toString());

    // Construct the request body
    const requestBody: any = {};

    if (search !== undefined) {
      requestBody.search = search;
    }
    if (archive !== undefined) {
      requestBody.archive = archive;
    }
    if (order !== undefined) {
      requestBody.order = order;
    }
    if (sort !== undefined) {
      requestBody.sort = sort;
    }
    if (projection !== undefined) {
      requestBody.projection = projection;
    }
    if (deviceProjection !== undefined) {
      requestBody.deviceProjection = deviceProjection;
    }

    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['page', 'limit', 'search', 'archive', 'order', 'sort', 'projection', 'deviceProjection', 'extraHeaders'].includes(key)) {
        requestBody[key] = rest[key];
      }
    }

    const headers = this.base.createHeaders({
      'Content-Type': 'application/json',
      ...extraHeaders,
    });

    try {
      const response: AxiosResponse<LoadEntitiesGenPaginatedResponse> = await axios.put(url, requestBody, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Load entities gen paginated error:', {
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