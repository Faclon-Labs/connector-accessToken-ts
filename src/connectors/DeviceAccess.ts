import axios, { AxiosResponse } from 'axios';
import { DEVICE_ALL_PAGINATED_URL, DEVICE_DATA_URL, DEVICE_BY_DEVID_URL, DEVICE_LAST_DATA_POINTS_URL, DEVICE_LAST_DP_URL, DEVICE_DATA_BY_TIME_RANGE_URL, DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL, DEVICE_LIMITED_DATA_URL, DEVICE_DATA_BY_STET_URL, DEVICE_DATA_COUNT_URL, DEVICE_MONTHLY_CONSUMPTION_URL, DEVICE_LOAD_ENTITIES_GEN_URL, DEVICE_LOAD_ENTITIES_GEN_BY_ID_URL, DEVICE_LOAD_ENTITIES_GEN_PAGINATED_URL, TIMEZONES, MAX_RETRIES, RETRY_DELAY, DEVICE_DEFAULT_CURSOR_LIMIT, Protocol } from '../utils/constants.js';

/**
 * Interface for device location information
 */
export interface DeviceLocation {
  latitude: number | null;
  longitude: number | null;
}

/**
 * Interface for device parameter configuration
 */
export interface DeviceParam {
  paramName: string;
  paramValue: string | number | boolean;
}

/**
 * Interface for device sensor information
 */
export interface DeviceSensor {
  sensorId: string;
  sensorName: string;
  globalName: string;
}

/**
 * Interface for device property configuration
 */
export interface DeviceProperty {
  propertyName: string;
  propertyValue: string | number | boolean;
}

/**
 * Interface for custom variable configuration
 */
export interface CustomVariable {
  customShow: string;
  customVariable: string;
}

/**
 * Interface representing a device's complete information
 */
export interface Device {
  _id: string;
  tags: string[];
  addedOn: string;
  widgets: any[];
  mapSensorConfig: any[];
  isHidden: boolean;
  dynamicFilter?: any[];
  devID: string;
  devName: string;
  params: Record<string, DeviceParam[]>;
  sensors: DeviceSensor[];
  devTypeID: string;
  devTypeName: string;
  topic: string;
  canUserEdit: boolean;
  star: boolean;
  unit: Record<string, string[]>;
  unitSelected: Record<string, string>;
  properties: DeviceProperty[];
  added_by: string;
  location: DeviceLocation;
  iconURL?: string;
  config: any[];
  geoFences: any[];
  custom: Record<string, CustomVariable[]>;
  __v: number;
  mapIconConfig?: any;
}

/**
 * Headers required for the device API requests
 */
export type DeviceHeaders = Record<string, string>;

/**
 * Interface for device data readings
 */
export interface DeviceReading {
  _id: string;
  deviceID: string;
  sensorID: string;
  value: number;
  timestamp: string;
  processedValue: number;
  rawValue: number;
  unit: string;
}

/**
 * Interface for device data response
 */
export interface DeviceDataResponse {
  success: boolean;
  data: {
    readings: DeviceReading[];
    deviceInfo: Device;
  };
}

/**
 * Interface for device by devID response
 */
export interface DeviceByDevIDResponse {
  success: boolean;
  data: {
    location: DeviceLocation;
    tags: string[];
    addedOn: string;
    _id: string;
    devID: string;
    devName: string;
    params: Record<string, DeviceParam[]>;
    sensors: DeviceSensor[];
    devTypeID: string;
    devTypeName: string;
    topic: string;
    unit: Record<string, string[]>;
    unitSelected: Record<string, string>;
    properties: DeviceProperty[];
  };
}

/**
 * Interface for last data point information
 */
export interface LastDataPoint {
  time: string;
  value: string | number;
}

/**
 * Interface for last data points response
 */
export interface LastDataPointsResponse {
  success: boolean;
  data: Record<string, LastDataPoint>;
}

/**
 * Interface for last data point response (specific device and sensors)
 */
export interface LastDPResponse {
  success: boolean;
  data: {
    devID: string;
    data: Record<string, LastDataPoint>;
  };
}

/**
 * Interface for time range data point
 */
export interface TimeRangeDataPoint {
  time: string;
  value: number;
}

/**
 * Interface for device data by time range response
 */
export interface DeviceDataByTimeRangeResponse {
  success: boolean;
  data: TimeRangeDataPoint[][];
}

/**
 * Interface for device data by time range with calibration response
 */
export interface DeviceDataByTimeRangeCalibrationResponse {
  success: boolean;
  data: TimeRangeDataPoint[][];
}

/**
 * Response type for loadEntitiesGen API.
 */
export interface LoadEntitiesGenResponse {
  success: boolean;
  data: Array<{
    _id: string;
    isProductionEntity: boolean;
    tags: string[];
    isFixedValue: boolean;
    added_by: string;
    name: string;
    star: boolean;
    devConfigs: Array<{
      isProductionDevice: boolean;
      _id: string;
      device: Device;
      percentage: number;
      sensor: string;
      devType: string;
    }>;
    unit: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

/**
 * Response type for loadEntitiesGenById API.
 */
export interface LoadEntitiesGenByIdResponse {
  success: boolean;
  data: {
    _id: string;
    archive: boolean;
    isProductionEntity: boolean;
    tags: string[];
    isFixedValue: boolean;
    added_by: string;
    name: string;
    star: boolean;
    devConfigs: Array<{
      isProductionDevice: boolean;
      _id: string;
      device: {
        _id: string;
        devID: string;
        devName: string;
        sensors: Array<{
          sensorId: string;
          sensorName: string;
          globalName: string;
        }>;
        devTypeName: string;
      };
      percentage: number;
      sensor: string;
      devType?: string;
    }>;
    unit: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

/**
 * Interface for search parameters in paginated devices request
 */
export interface DeviceSearchParams {
  all?: string[];
  devID?: string[];
  devName?: string[];
  tags?: string[];
}

/**
 * Interface for paginated devices request options
 */
export interface GetAllDevicesPaginatedOptions {
  skip?: number;
  limit?: number;
  search?: DeviceSearchParams;
  isHidden?: boolean;
  order?: 'stared' | 'default';
  sort?: 'AtoZ' | 'ZtoA';
  filter?: string[];
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for paginated devices response
 */
export interface GetAllDevicesPaginatedResponse {
  success: boolean;
  data: {
    devices: Device[];
    totalCount: number;
    pagination: {
      skip: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * Interface for getDeviceData request options
 */
export interface GetDeviceDataOptions {
  deviceId: string;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for getDeviceByDevID request options
 */
export interface GetDeviceByDevIDOptions {
  devID: string;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for getLastDP request options
 */
export interface GetLastDPOptions {
  devID: string;
  sensors: string[];
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for device data point with multiple sensor values
 */
export interface DeviceDataPoint {
  time: string;
  [key: string]: string | number | boolean; // Dynamic sensor values (temperature, humidity, status, etc.)
}

/**
 * Interface for getDataByStEt request options
 */
export interface GetDataByStEtOptions {
  devID: string;
  startTime: string | number | Date;
  endTime: string | number | Date;
  cursor?: boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for getDataByStEt response without cursor
 */
export interface GetDataByStEtResponse {
  success: boolean;
  data: DeviceDataPoint[];
}

/**
 * Interface for getDataByStEt response with cursor
 */
export interface GetDataByStEtResponseWithCursor {
  success: boolean;
  data: DeviceDataPoint[];
  cursor: string;
}

/**
 * Interface for limited data point
 */
export interface LimitedDataPoint {
  time: string;
  value: number;
}

/**
 * Interface for getLimitedData response
 */
export interface GetLimitedDataResponse {
  success: boolean;
  data: LimitedDataPoint[];
}

/**
 * Interface for getLimitedData request options
 */
export interface GetLimitedDataOptions {
  devID: string;
  sensor?: string; // defaults to 'arduino' per API docs
  lim: number;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for monthly consumption data point
 */
export interface MonthlyConsumptionData {
  start: number;
  startTime: string;
  initial: number;
  last: number;
}

/**
 * Interface for getMonthlyConsumption response
 */
export interface GetMonthlyConsumptionResponse {
  success: boolean;
  data: MonthlyConsumptionData[];
}

/**
 * Interface for getMonthlyConsumption request options
 */
export interface GetMonthlyConsumptionOptions {
  device: string;
  sensor: string;
  endTime: string | number | Date;
  months: number;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for loadEntitiesGen request options
 */
export interface LoadEntitiesGenOptions {
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for loadEntitiesGenById request options
 */
export interface LoadEntitiesGenByIdOptions {
  id: string;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for entity search parameters
 */
export interface EntitySearchParams {
  all?: string[];
  name?: string[];
  tags?: string[];
}

/**
 * Interface for loadEntitiesGenPaginated request options
 */
export interface LoadEntitiesGenPaginatedOptions {
  page: number;
  limit: number;
  search?: EntitySearchParams;
  archive?: boolean;
  order?: 'increment' | 'decrement';
  sort?: 'alphabetical' | 'timeUpdated' | 'timeCreated';
  projection?: string;
  deviceProjection?: string;
  extraHeaders?: Record<string, string>;
  [key: string]: any; // Allow arbitrary fields for future extensibility
}

/**
 * Interface for paginated entity device configuration
 */
export interface PaginatedEntityDeviceConfig {
  device: {
    _id: string;
    devID: string;
    name: string;
    sensors?: Array<{
      sensorId: string;
      unit: string;
    }>;
  };
  sensor: string;
}

/**
 * Interface for paginated entity data
 */
export interface PaginatedEntityData {
  _id: string;
  name: string;
  star: boolean;
  devConfigs: PaginatedEntityDeviceConfig[];
}

/**
 * Interface for loadEntitiesGenPaginated response
 */
export interface LoadEntitiesGenPaginatedResponse {
  success: boolean;
  data: {
    totalCount: number;
    data: PaginatedEntityData[];
  };
}

/**
 * Service class for accessing device-related API endpoints.
 *
 * @property DEVICE_DEFAULT_CURSOR_LIMIT - The default maximum number of results to return in device queries (pagination limit).
 */
export class DeviceAccess {
  private dataUrl: string;
  private accessToken: string;
  private onPrem: boolean;
  private tz: string;

  /**
   * The default maximum number of results to return in device queries (pagination limit).
   */
  static readonly DEFAULT_CURSOR_LIMIT = DEVICE_DEFAULT_CURSOR_LIMIT;

  /**
   * Constructs a new DeviceAccess service instance.
   *
   * @param dataUrl - The backend server URL (e.g., 'appserver.iosense.io')
   * @param accessToken - The Bearer access token for Authorization
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'
   * @param tz - Optional timezone string (e.g., 'UTC', 'ICT'). Defaults to 'UTC'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
    this.tz = tz;
  }

  /**
   * Helper method to perform GET requests with retry logic.
   * @param url - The request URL
   * @param headers - The request headers
   * @returns The Axios response data or throws after max retries
   */
  private async requestWithRetry<T>(url: string, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.get<T>(url, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        // Exponential backoff between RETRY_DELAY[0] and RETRY_DELAY[1] seconds
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await new Promise(res => setTimeout(res, delay * 1000));
      }
    }
    throw lastError;
  }

  /**
   * Fetches paginated list of user devices with advanced filtering and sorting.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * 
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
   * @returns {Promise<GetAllDevicesPaginatedResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       devices: [
   *         {
   *           _id: "dummy_device_id_123",
   *           tags: ["temperature", "sensor"],
   *           addedOn: "2023-12-27T15:35:12.177Z",
   *           devID: "dummy_device_001",
   *           devName: "Temperature Sensor Device",
   *           sensors: [
   *             {
   *               sensorId: "SENSOR_1",
   *               sensorName: "Temperature Sensor",
   *               globalName: "Temperature Sensor"
   *             }
   *           ],
   *           devTypeID: "TEMPERATURE_DEVICE",
   *           devTypeName: "Temperature Device Type",
   *           topic: "devicesIn/dummy_device_001/data",
   *           canUserEdit: true,
   *           star: true,
   *           unit: {
   *             "SENSOR_1": ["°C", "°F"]
   *           },
   *           unitSelected: {
   *             "SENSOR_1": "°C"
   *           },
   *           properties: [
   *             {
   *               propertyName: "connectionTimeout",
   *               propertyValue: "600"
   *             }
   *           ],
   *           added_by: "dummy_user_id_123",
   *           location: {
   *             latitude: 40.7128,
   *             longitude: -74.0060
   *           },
   *           iconURL: "../../../assets/img/device_types/temperature_device.svg",
   *           config: [],
   *           geoFences: [],
   *           custom: {
   *             "SENSOR_1": [
   *               {
   *                 customShow: "Raw Variable",
   *                 customVariable: "dummy_device_001_SENSOR_1"
   *               }
   *             ]
   *           },
   *           __v: 0,
   *           mapIconConfig: null
   *         }
   *       ],
   *       totalCount: 150,
   *       pagination: {
   *         skip: 0,
   *         limit: 10,
   *         totalPages: 15
   *       }
   *     }
   *   }
   *
   * @example
   * // Basic pagination - get first 10 devices:
   * const result = await deviceAccess.getAllDevicesPaginated({
   *   skip: 0,
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
   *
   * // Get starred devices sorted by name Z to A:
   * const result = await deviceAccess.getAllDevicesPaginated({
   *   skip: 10,
   *   limit: 5,
   *   order: "stared",
   *   sort: "ZtoA"
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

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_ALL_PAGINATED_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
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

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

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

  /**
   * Fetches complete configuration data for a specific device.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/devices/getDeviceData/:id
   * Method: GET
   *
   * @param options - Options for fetching device data:
   *   @param deviceId {string} - The device ID to retrieve data for. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<DeviceDataResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       readings: [
   *         {
   *           _id: "507f1f77bcf86cd799439011",
   *           deviceID: "DEV12345",
   *           sensorID: "temp1",
   *           value: 25.5,
   *           timestamp: "2024-01-17T12:34:56.789Z",
   *           processedValue: 25.5,
   *           rawValue: 25.5,
   *           unit: "°C"
   *         }
   *       ],
   *       deviceInfo: {
   *         _id: "507f1f77bcf86cd799439011",
   *         devID: "DEV12345",
   *         devName: "Temperature Sensor 1",
   *         devTypeID: "TEMP_SENSOR",
   *         sensors: [
   *           {
   *             sensorId: "temp1",
   *             sensorName: "Temperature",
   *             globalName: "AmbientTemp"
   *           }
   *         ],
   *         params: {
   *           temp1: [
   *             {
   *               paramName: "m",
   *               paramValue: 1.2
   *             }
   *           ]
   *         },
   *         location: {
   *           latitude: 12.9716,
   *           longitude: 77.5946
   *         },
   *         isHidden: false,
   *         tags: ["temperature", "sensor"],
   *         addedOn: "2023-12-27T15:35:12.177Z",
   *         widgets: [],
   *         mapSensorConfig: [],
   *         dynamicFilter: [],
   *         devTypeName: "Temperature Sensor",
   *         topic: "devicesIn/DEV12345/data",
   *         canUserEdit: true,
   *         star: false,
   *         unit: {
   *           temp1: ["°C", "°F"]
   *         },
   *         unitSelected: {
   *           temp1: "°C"
   *         },
   *         properties: [
   *           {
   *             propertyName: "connectionTimeout",
   *             propertyValue: "600"
   *           }
   *         ],
   *         added_by: "user_id_123",
   *         iconURL: "../../../assets/img/device_types/temp_sensor.svg",
   *         config: [],
   *         geoFences: [],
   *         custom: {
   *           temp1: [
   *             {
   *               customShow: "Raw Variable",
   *               customVariable: "DEV12345_temp1"
   *             }
   *           ]
   *         },
   *         __v: 0,
   *         mapIconConfig: null
   *       }
   *     }
   *   }
   *
   * @example
   * // Get device data for a specific device:
   * const result = await deviceAccess.getDeviceData({
   *   deviceId: 'DEV12345'
   * });
   *
   * // Get device data with additional headers:
   * const result = await deviceAccess.getDeviceData({
   *   deviceId: 'DEV12345',
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getDeviceData(options: GetDeviceDataOptions): Promise<DeviceDataResponse | null> {
    const {
      deviceId,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_DATA_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{id}', deviceId);

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    // Debug logging
    console.log('=== Debug Info ===');
    console.log('URL:', url);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Device ID:', deviceId);
    console.log('==================');

    try {
      return await this.requestWithRetry<DeviceDataResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get device data error:', {
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
   * Retrieves detailed configuration of a specific device by its devID.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/device/getDevice/:devID
   * Method: GET
   *
   * @param options - Options for fetching device by devID:
   *   @param devID {string} - The device identifier to retrieve. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<DeviceByDevIDResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       _id: "507f1f77bcf86cd799439011",
   *       devID: "DEV12345",
   *       devName: "Temperature Sensor 1",
   *       devTypeID: "TEMP_SENSOR",
   *       sensors: [
   *         {
   *           sensorId: "temp1",
   *           sensorName: "Temperature",
   *           globalName: "AmbientTemp"
   *         }
   *       ],
   *       params: {
   *         temp1: [
   *           {
   *             paramName: "m",
   *             paramValue: 1.2
   *           }
   *         ]
   *       },
   *       properties: [
   *         {
   *           propertyName: "automation",
   *           propertyValue: true
   *         }
   *       ],
   *       unitSelected: {
   *         temp1: "°C"
   *       },
   *       location: {
   *         latitude: 12.9716,
   *         longitude: 77.5946
   *       },
   *       tags: ["sensor", "temperature"],
   *       addedOn: "2023-06-15T10:30:45.000Z"
   *     }
   *   }
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const device = await deviceAccess.getDeviceByDevID('dummy_device_001', { origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": {
   * //     "location": {
   * //       "latitude": 40.7128,
   * //       "longitude": -74.0060
   * //     },
   * //     "tags": ["dummy_tag_1", "dummy_tag_2", "dummy_tag_3"],
   * //     "addedOn": "2023-12-27T15:35:12.177Z",
   * //     "_id": "dummy_device_id_123",
   * //     "devID": "dummy_device_001",
   * //     "devName": "Dummy Device Name",
   * //     "params": {
   * //       "SENSOR_1": [
   * //         {
   * //           "paramName": "m",
   * //           "paramValue": "1"
   * //         },
   * //         {
   * //           "paramName": "c",
   * //           "paramValue": 0
   * //         },
   * //         {
   * //           "paramName": "min",
   * //           "paramValue": 0
   * //         },
   * //         {
   * //           "paramName": "max",
   * //           "paramValue": 100
   * //         },
   * //         {
   * //           "paramName": "automation",
   * //           "paramValue": false
   * //         }
   * //       ]
   * //     },
   * //     "sensors": [
   * //       {
   * //         "sensorId": "SENSOR_1",
   * //         "sensorName": "Temperature Sensor",
   * //         "globalName": "Temperature Sensor"
   * //       },
   * //       {
   * //         "sensorId": "SENSOR_2",
   * //         "sensorName": "Humidity Sensor",
   * //         "globalName": "Humidity Sensor"
   * //       }
   * //     ],
   * //     "devTypeID": "DUMMY_DEVICE_TYPE",
   * //     "devTypeName": "Dummy Device Type",
   * //     "topic": "devicesIn/dummy_device_001/data",
   * //     "unit": {
   * //       "SENSOR_1": ["°C", "°F"],
   * //       "SENSOR_2": ["%", "g/m³"]
   * //     },
   * //     "unitSelected": {
   * //       "SENSOR_1": "°C",
   * //       "SENSOR_2": "%"
   * //     },
   * //     "properties": [
   * //       {
   * //         "propertyName": "connectionTimeout",
   * //         "propertyValue": "600"
   * //       },
   * //       {
   * //         "propertyName": "automation",
   * //         "propertyValue": false
   * //       }
   * //     ]
   * //   }
   * // }
   * ```
   *
   * // Get device configuration with additional headers:
   * const result = await deviceAccess.getDeviceByDevID({
   *   devID: 'DEV12345',
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getDeviceByDevID(options: GetDeviceByDevIDOptions): Promise<DeviceByDevIDResponse | null> {
    const {
      devID,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_BY_DEVID_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID);

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<DeviceByDevIDResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get device by devID error:', {
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
   * Retrieves the most recent data points (RSSI values) for all devices belonging to the authenticated user.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/lastDataPoints
   * Method: GET
   *
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The last data points response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * 
   * // Get last data points for all devices:
   * const lastDataPoints = await deviceAccess.getLastDataPoints();
   * 
   * // Get last data points with additional headers:
   * const lastDataPoints = await deviceAccess.getLastDataPoints({ 
   *   origin: 'https://iosense.io' 
   * });
   * 
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": {
   * //     "F2401_A12": {
   * //       "time": "2024-01-17T12:34:56.789Z",
   * //       "value": -45
   * //     },
   * //     "APREBMA_4": {
   * //       "time": "2024-01-17T12:30:45.123Z",
   * //       "value": -52
   * //     },
   * //     "DEVICE_3": {
   * //       "time": "N/A",
   * //       "value": "N/A"
   * //     }
   * //   }
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getLastDataPoints(
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<LastDataPointsResponse | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LAST_DATA_POINTS_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<LastDataPointsResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get last data points error:', {
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
   * Retrieves the most recent data point for specified sensors of a device.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: /api/account/deviceData/lastDP
   * Method: PUT
   *
   * @param options - Options for fetching last data points for specific device and sensors:
   *   @param devID {string} - The device identifier. (required)
   *   @param sensors {string[]} - List of sensor names to query. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<LastDPResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     success: true,
   *     data: {
   *       devID: "F2401_A12",
   *       data: {
   *         "TOTAL": {
   *           "value": 69723,
   *           "time": "2024-10-10T11:41:30.000Z"
   *         },
   *         "D5": {
   *           "value": 12345,
   *           "time": "2024-10-10T11:41:30.000Z"
   *         }
   *       }
   *     }
   *   }
   *
   * @example
   * // Get last data points for specific sensors:
   * const result = await deviceAccess.getLastDP({
   *   devID: 'F2401_A12',
   *   sensors: ['TOTAL', 'D5']
   * });
   *
   * // Get last data points with additional headers:
   * const result = await deviceAccess.getLastDP({
   *   devID: 'F2401_A12',
   *   sensors: ['TOTAL'],
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getLastDP(options: GetLastDPOptions): Promise<LastDPResponse | null> {
    const {
      devID,
      sensors,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LAST_DP_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);

    // Construct the request body
    const requestBody: any = {
      devID,
      sensors,
    };

    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['devID', 'sensors', 'extraHeaders'].includes(key)) {
        requestBody[key] = rest[key];
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    try {
      const response: AxiosResponse<LastDPResponse> = await axios.put(url, requestBody, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get last DP error:', {
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
   * Convert a given time to Unix timestamp in milliseconds.
   * @param time - The time to be converted. It can be a string in ISO 8601 format, a Unix timestamp in milliseconds, or a Date object. If null or undefined, the current time is used.
   * @param timezone - The timezone to use (e.g., 'America/New_York', 'UTC'). This is used when time is not provided or doesn't have timezone info. Defaults to this.tz.
   * @returns The Unix timestamp in milliseconds.
   * @throws Error if the provided Unix timestamp is not in milliseconds or if there are mismatched offset times.
   */
  private timeToUnix(time: string | number | Date | null = null, timezone?: string): number {
    const tzToUse = timezone || this.tz;
    // If time is not provided, use the current time in the specified timezone
    if (time === null || time === undefined) {
      // Create a date in the current timezone
      const now = new Date();
      return now.getTime();
    }

    // If time is already in Unix timestamp format (number)
    if (typeof time === "number") {
      // Validate that it's in milliseconds (>10 digits)
      if (time <= 0 || String(time).length <= 10) {
        throw new Error(
          "Unix timestamp must be a positive integer in milliseconds, not seconds."
        );
      }
      return time;
    }

    // If time is in string format, convert it to a Date object
    let dateObj: Date;
    if (typeof time === "string") {
      // Parse the string into a Date object
      dateObj = new Date(time);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date string: ${time}`);
      }
    } else if (time instanceof Date) {
      dateObj = time;
    } else {
      throw new Error("Time must be a string, number, Date object, or null");
    }

    // Return the Unix timestamp in milliseconds
    return dateObj.getTime();
  }

  /**
   * Retrieves historical sensor data for a specific device, with optional downsampling.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/getData/:devID/:sensor/:sTime/:eTime/:downSample?
   * Method: GET
   *
   * @param devID - The device identifier (string)
   * @param sensor - The sensor name (string)
   * @param startTime - The start time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param endTime - The end time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param downSample - Optional downsampling interval in seconds (e.g., 60 for 60 seconds)
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device data by time range response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * 
   * // Using ISO strings with downsampling
   * const data1 = await deviceAccess.getDataByTimeRange(
   *   'F2401_A12',
   *   'TOTAL',
   *   '2024-01-17T12:00:00.000Z',
   *   '2024-01-17T13:00:00.000Z',
   *   60, // 60 seconds downsampling
   *   { origin: 'https://iosense.io' }
   * );
   * 
   * // Using Date objects without downsampling
   * const startDate = new Date('2024-01-17T12:00:00.000Z');
   * const endDate = new Date('2024-01-17T13:00:00.000Z');
   * const data2 = await deviceAccess.getDataByTimeRange(
   *   'F2401_A12',
   *   'D5',
   *   startDate,
   *   endDate
   * );
   * 
   * // Using Unix timestamps in milliseconds
   * const data3 = await deviceAccess.getDataByTimeRange(
   *   'APREBMA_4',
   *   'TOTAL',
   *   1705492800000, // 2024-01-17T12:00:00.000Z
   *   1705496400000, // 2024-01-17T13:00:00.000Z
   *   300 // 5 minutes downsampling
   * );
   * 
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": [
   * //     [
   * //       {
   * //         "time": "2024-01-17T12:00:00.000Z",
   * //         "value": 69723
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:01:00.000Z",
   * //         "value": 69745
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:02:00.000Z",
   * //         "value": 69767
   * //       }
   * //     ]
   * //   ]
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   * @throws Error if the provided timestamps are invalid or not in milliseconds.
   */
  async getDataByTimeRange(
    devID: string,
    sensor: string,
    startTime: string | number | Date,
    endTime: string | number | Date,
    downSample?: number,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<DeviceDataByTimeRangeResponse | null> {
    // Convert times to Unix timestamps in milliseconds
    const startTimeUnix = this.timeToUnix(startTime);
    const endTimeUnix = this.timeToUnix(endTime);

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    let url = DEVICE_DATA_BY_TIME_RANGE_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{sTime}', startTimeUnix.toString())
      .replace('{eTime}', endTimeUnix.toString());

    // Add downSample parameter if provided
    if (downSample !== undefined) {
      url = url.replace('{downSample}', downSample.toString());
    } else {
      url = url.replace('/{downSample}', ''); // Remove the downSample parameter from URL
    }

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<DeviceDataByTimeRangeResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get data by time range error:', {
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
   * Retrieves historical sensor data with optional linear calibration (y = mx + c) applied.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/getDataCalibration/:devID/:sensor/:sTime/:eTime/:calibration?
   * Method: GET
   *
   * @param devID - The device identifier (string)
   * @param sensor - The sensor name (string)
   * @param startTime - The start time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param endTime - The end time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param calibration - Optional flag to enable calibration (boolean)
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device data by time range with calibration response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * 
   * // Using ISO strings with calibration enabled
   * const data1 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'F2401_A12',
   *   'TOTAL',
   *   '2024-01-17T12:00:00.000Z',
   *   '2024-01-17T13:00:00.000Z',
   *   true, // enable calibration
   *   { origin: 'https://iosense.io' }
   * );
   * 
   * // Using Date objects without calibration
   * const startDate = new Date('2024-01-17T12:00:00.000Z');
   * const endDate = new Date('2024-01-17T13:00:00.000Z');
   * const data2 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'F2401_A12',
   *   'D5',
   *   startDate,
   *   endDate,
   *   false // disable calibration
   * );
   * 
   * // Using Unix timestamps in milliseconds with calibration
   * const data3 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'APREBMA_4',
   *   'TOTAL',
   *   1705492800000, // 2024-01-17T12:00:00.000Z
   *   1705496400000, // 2024-01-17T13:00:00.000Z
   *   true // enable calibration
   * );
   * 
   * // Example output (without calibration):
   * // {
   * //   "success": true,
   * //   "data": [
   * //     [
   * //       {
   * //         "time": "2025-06-20T13:49:37.000Z",
   * //         "value": 235.11
   * //       },
   * //       {
   * //         "time": "2025-06-20T13:47:51.000Z",
   * //         "value": 234.67
   * //       },
   * //       {
   * //         "time": "2025-06-20T13:46:58.000Z",
   * //         "value": 235.4
   * //       }
   * //     ]
   * //   ]
   * // }
   * 
   * // Example output (with calibration - applies y = mx + c formula):
   * // {
   * //   "success": true,
   * //   "data": [
   * //     [
   * //       {
   * //         "time": "2025-06-20T13:49:37.000Z",
   * //         "value": 235.11 // calibrated value
   * //       },
   * //       {
   * //         "time": "2025-06-20T13:47:51.000Z",
   * //         "value": 234.67 // calibrated value
   * //       },
   * //       {
   * //         "time": "2025-06-20T13:46:58.000Z",
   * //         "value": 235.4 // calibrated value
   * //       }
   * //     ]
   * //   ]
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   * @throws Error if the provided timestamps are invalid or not in milliseconds.
   */
  async getDataByTimeRangeWithCalibration(
    devID: string,
    sensor: string,
    startTime: string | number | Date,
    endTime: string | number | Date,
    calibration: boolean,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<DeviceDataByTimeRangeCalibrationResponse | null> {
    // Convert times to Unix timestamps in milliseconds
    const startTimeUnix = this.timeToUnix(startTime);
    const endTimeUnix = this.timeToUnix(endTime);

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    let url = DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{sTime}', startTimeUnix.toString())
      .replace('{eTime}', endTimeUnix.toString());

    // Add calibration parameter if provided
    if (calibration !== undefined) {
      url = url.replace('{calibration}', calibration.toString());
    } else {
      url = url.replace('/{calibration}', ''); // Remove the calibration parameter from URL
    }

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<DeviceDataByTimeRangeCalibrationResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get data by time range with calibration error:', {
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
   * Retrieves all sensor data for a device within a specified time range, organized by timestamp.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/getDataByStEt/:devID/:sTime/:eTime
   * Method: GET
   *
   * @param options - Options for fetching device data by time range:
   *   @param devID {string} - The device identifier. (required)
   *   @param startTime {string | number | Date} - The start time for the data range. (required)
   *   @param endTime {string | number | Date} - The end time for the data range. (required)
   *   @param cursor {boolean} - (optional) When true, enables cursor-based pagination.
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<GetDataByStEtResponse | GetDataByStEtResponseWithCursor | null>} The API response data or null if an error occurs, e.g.:
   *   
   *   **Without Cursor:**
   *   {
   *     "success": true,
   *     "data": [
   *       {
   *         "time": "2023-01-01T00:00:00Z",
   *         "temperature": 25.4,
   *         "humidity": 60.2,
   *         "status": "ON"
   *       },
   *       {
   *         "time": "2023-01-01T00:01:00Z",
   *         "temperature": 25.6,
   *         "humidity": 59.8,
   *         "status": "ON"
   *       }
   *     ]
   *   }
   *   
   *   **With Cursor:**
   *   {
   *     "success": true,
   *     "data": [
   *       {
   *         "time": "2023-01-01T00:00:00Z",
   *         "temperature": 25.4,
   *         "humidity": 60.2,
   *         "status": "ON"
   *       }
   *     ],
   *     "cursor": "next_cursor_token"
   *   }
   *
   * @example
   * // Basic usage without cursor:
   * const result = await deviceAccess.getDataByStEt({
   *   devID: 'MJTEM_C1',
   *   startTime: '2025-01-27T07:00:00.000Z',
   *   endTime: '2025-01-28T06:59:59.000Z'
   * });
   *
   * // With cursor pagination enabled:
   * const result = await deviceAccess.getDataByStEt({
   *   devID: 'MJTEM_C1',
   *   startTime: '2025-01-27T07:00:00.000Z',
   *   endTime: '2025-01-28T06:59:59.000Z',
   *   cursor: true
   * });
   *
   * // Using Date objects:
   * const startDate = new Date('2025-01-27T07:00:00.000Z');
   * const endDate = new Date('2025-01-28T06:59:59.000Z');
   * const result = await deviceAccess.getDataByStEt({
   *   devID: 'MJTEM_C1',
   *   startTime: startDate,
   *   endTime: endDate,
   *   cursor: false
   * });
   *
   * // Using Unix timestamps:
   * const result = await deviceAccess.getDataByStEt({
   *   devID: 'MJTEM_C1',
   *   startTime: 1706337600000, // 2025-01-27T07:00:00.000Z
   *   endTime: 1706423999999,   // 2025-01-28T06:59:59.999Z
   *   cursor: true,
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getDataByStEt(options: GetDataByStEtOptions): Promise<GetDataByStEtResponse | GetDataByStEtResponseWithCursor | null> {
    const {
      devID,
      startTime,
      endTime,
      cursor,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const sTime = this.timeToUnix(startTime).toString();
    const eTime = this.timeToUnix(endTime).toString();
    
    // Build the base URL
    let url = DEVICE_DATA_BY_STET_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sTime}', sTime)
      .replace('{eTime}', eTime);

    // Add cursor query parameter if provided
    if (cursor !== undefined) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}cursor=${cursor}`;
    }

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<GetDataByStEtResponse | GetDataByStEtResponseWithCursor>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get data by StEt error:', {
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
   * Retrieves a limited number of recent data points for a specific sensor on a device.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/getLimitedData/:devID/:sensor/:lim
   * Method: GET
   *
   * @param options - Options for fetching limited data points:
   *   @param devID {string} - The device identifier. (required)
   *   @param sensor {string} - (optional) The sensor name. Defaults to 'arduino' per API documentation.
   *   @param lim {number} - The maximum number of data points to return. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<GetLimitedDataResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": [
   *       {
   *         "time": "2023-06-15T12:00:00Z",
   *         "value": 25.4
   *       },
   *       {
   *         "time": "2023-06-15T11:55:00Z",
   *         "value": 25.2
   *       }
   *     ]
   *   }
   *
   * @example
   * // Basic usage with default sensor (arduino):
   * const result = await deviceAccess.getLimitedData({
   *   devID: 'MJTEM_C1',
   *   lim: 5
   * });
   *
   * // With specific sensor:
   * const result = await deviceAccess.getLimitedData({
   *   devID: 'MJTEM_C1',
   *   sensor: 'D5',
   *   lim: 10
   * });
   *
   * // With additional headers:
   * const result = await deviceAccess.getLimitedData({
   *   devID: 'MJTEM_C1',
   *   sensor: 'temperature',
   *   lim: 20,
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getLimitedData(options: GetLimitedDataOptions): Promise<GetLimitedDataResponse | null> {
    const {
      devID,
      sensor = 'arduino', // Default to 'arduino' per API docs
      lim,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LIMITED_DATA_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{lim}', lim.toString());

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<GetLimitedDataResponse>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get limited data error:', {
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
   * Fetches the count of data points for a specific device and sensor within a given time range.
   *
   * @description
   * This method retrieves the total number of data points recorded for a given device and sensor between the specified start and end times. This is useful for analytics, reporting, or pagination scenarios where you need to know how many records exist in a time window. The time range can be specified as ISO strings, Date objects, or Unix timestamps in milliseconds.
   *
   * @param devID - The device ID for which to count data points
   * @param sensor - The sensor ID for which to count data points
   * @param startTime - The start time (string | number | Date) for the data range
   * @param endTime - The end time (string | number | Date) for the data range
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The JSON response from the API or null if an error occurs. The response typically includes a count field.
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const countResult = await deviceAccess.getDataCount('MJT_C1', 'D5', '2025-01-27T07:00:00', '2025-01-28T06:59:59');
   * // Example output:
   * // {
   * //   success: true,
   * //   count: 1234
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getDataCount(
    devID: string,
    sensor: string,
    startTime: string | number | Date,
    endTime: string | number | Date,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<any | null> {
    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const sTime = this.timeToUnix(startTime).toString();
    const eTime = this.timeToUnix(endTime).toString();
    const url = DEVICE_DATA_COUNT_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{sTime}', sTime)
      .replace('{eTime}', eTime);
    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    try {
      return await this.requestWithRetry<any>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get data count error:', {
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
   * Loads all entities and their device configurations for the authenticated user.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide optional headers.
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/load-entities-gen
   * Method: GET
   *
   * @param options - Options for loading entities:
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<LoadEntitiesGenResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": [
   *       {
   *         "_id": "5f8d7a1b2c3d4e5f6a7b8c9d",
   *         "name": "Production Line 1",
   *         "star": true,
   *         "isProductionEntity": true,
   *         "devConfigs": [
   *           {
   *             "device": {
   *               "_id": "5f8e7a1b2c3d4e5f6a7b8c9e",
   *               "devID": "MACHINE_001",
   *               "devName": "Conveyor Belt",
   *               "sensors": [
   *                 {
   *                   "sensorId": "rpm",
   *                   "sensorName": "RPM Sensor",
   *                   "globalName": "RPM"
   *                 }
   *               ],
   *               "devTypeName": "Conveyor"
   *             },
   *             "devType": "conveyor",
   *             "sensor": "rpm",
   *             "percentage": 60,
   *             "isProductionDevice": true
   *           }
   *         ],
   *         "tags": ["production", "line1"],
   *         "isFixedValue": false,
   *         "unit": "rpm",
   *         "createdAt": "2023-01-01T00:00:00Z",
   *         "updatedAt": "2023-01-01T00:00:00Z",
   *         "__v": 0
   *       },
   *       {
   *         "_id": "5f8d7a1b2c3d4e5f6a7b8c9f",
   *         "name": "Fixed Load",
   *         "star": false,
   *         "isProductionEntity": false,
   *         "devConfigs": [],
   *         "tags": ["fixed", "load"],
   *         "isFixedValue": true,
   *         "unit": "kW",
   *         "createdAt": "2023-01-01T00:00:00Z",
   *         "updatedAt": "2023-01-01T00:00:00Z",
   *         "__v": 0
   *       }
   *     ]
   *   }
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

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LOAD_ENTITIES_GEN_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

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
   * Fetches a single entity and its device configurations by entity ID.
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
   * @returns {Promise<LoadEntitiesGenByIdResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": {
   *       "_id": "667ff38140ad724aeae6eaf5",
   *       "archive": false,
   *       "isProductionEntity": false,
   *       "tags": [],
   *       "isFixedValue": false,
   *       "added_by": "6480835f60fc9faa38fc324b",
   *       "name": "testCluster2",
   *       "star": false,
   *       "devConfigs": [
   *         {
   *           "isProductionDevice": false,
   *           "_id": "667ff38140ad724aeae6eaf6",
   *           "device": {
   *             "_id": "659d29afc2342a43231eba37",
   *             "devID": "MJTEM_C1",
   *             "devName": "MJTEM_C1",
   *             "sensors": [
   *               {
   *                 "sensorId": "D5",
   *                 "sensorName": "Line to Neutral Voltage",
   *                 "globalName": "Line to Neutral Voltage"
   *               },
   *               {
   *                 "sensorId": "D30",
   *                 "sensorName": "Forward Active Energy",
   *                 "globalName": "Forward Active Energy"
   *               }
   *             ],
   *             "devTypeName": "Energymeter"
   *           },
   *           "percentage": 100,
   *           "sensor": "D30",
   *           "devType": "ENERGY765"
   *         }
   *       ],
   *       "unit": "%",
   *       "createdAt": "2024-06-29T11:44:01.176Z",
   *       "updatedAt": "2024-11-05T14:08:09.207Z",
   *       "__v": 0
   *     }
   *   }
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

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LOAD_ENTITIES_GEN_BY_ID_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{id}', id);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

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
   * Calculates monthly consumption values for a specified sensor by comparing first and last readings of each month.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: PUT /api/account/deviceData/getMonthlyConsumption
   * Method: PUT
   *
   * @param options - Options for calculating monthly consumption:
   *   @param device {string} - The device identifier. (required)
   *   @param sensor {string} - The sensor name to measure consumption. (required)
   *   @param endTime {string | number | Date} - The end timestamp (inclusive) for the analysis period. (required)
   *   @param months {number} - The number of months to analyze backwards from the end time. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<GetMonthlyConsumptionResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": [
   *       {
   *         "start": 1685577600,
   *         "startTime": "2023-06-01T00:00:00Z",
   *         "initial": 1250.5,
   *         "last": 1350.2
   *       },
   *       {
   *         "start": 1682899200,
   *         "startTime": "2023-05-01T00:00:00Z",
   *         "initial": 1150.0,
   *         "last": 1249.8
   *       }
   *     ]
   *   }
   *
   * @example
   * // Basic usage with ISO string end time:
   * const result = await deviceAccess.getMonthlyConsumption({
   *   device: 'DEVICE_123',
   *   sensor: 'energy',
   *   endTime: '2023-06-30T23:59:59Z',
   *   months: 6
   * });
   *
   * // Using Date object for end time:
   * const endDate = new Date('2023-06-30T23:59:59Z');
   * const result = await deviceAccess.getMonthlyConsumption({
   *   device: 'DEVICE_123',
   *   sensor: 'power',
   *   endTime: endDate,
   *   months: 12
   * });
   *
   * // Using Unix timestamp for end time:
   * const result = await deviceAccess.getMonthlyConsumption({
   *   device: 'DEVICE_123',
   *   sensor: 'water',
   *   endTime: 1688169599000, // 2023-06-30T23:59:59Z
   *   months: 3,
   *   extraHeaders: {
   *     'Custom-Header': 'custom-value'
   *   }
   * });
   */
  async getMonthlyConsumption(options: GetMonthlyConsumptionOptions): Promise<GetMonthlyConsumptionResponse | null> {
    const {
      device,
      sensor,
      endTime,
      months,
      extraHeaders = {},
      ...rest
    } = options;

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_MONTHLY_CONSUMPTION_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);

    // Convert endTime to ISO string if it's a Date or number
    const endTimeISO = typeof endTime === 'string' 
      ? endTime 
      : new Date(endTime).toISOString();

    // Construct the request body
    const requestBody: any = {
      device,
      sensor,
      endTime: endTimeISO,
      months,
    };

    // Add any other fields provided by the user (except those already handled)
    for (const key of Object.keys(rest)) {
      if (!['device', 'sensor', 'endTime', 'months', 'extraHeaders'].includes(key)) {
        requestBody[key] = rest[key];
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    try {
      const response: AxiosResponse<GetMonthlyConsumptionResponse> = await axios.put(url, requestBody, { headers });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get monthly consumption error:', {
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
   * Retrieves paginated, filtered, and sorted load entities with advanced query capabilities.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request body for the API call.
   *
   * Endpoint: PUT /api/account/load-entities-gen/:page/:limit
   * Method: PUT
   *
   * @param options - Options for fetching paginated entities:
   *   @param page {number} - Page number (1-based index). (required)
   *   @param limit {number} - Items per page. (required)
   *   @param search {EntitySearchParams} - (optional) Search criteria object.
   *     @param all {string[]} - Searches across all fields.
   *     @param name {string[]} - Filters by entity name.
   *     @param tags {string[]} - Filters by tags.
   *   @param archive {boolean} - (optional) Archive status filter.
   *   @param order {string} - (optional) Sort order: 'increment' or 'decrement'.
   *   @param sort {string} - (optional) Sort field: 'alphabetical', 'timeUpdated', or 'timeCreated'.
   *   @param projection {string} - (optional) Comma-separated entity fields to include.
   *   @param deviceProjection {string} - (optional) Comma-separated device fields to include.
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request body.
   *
   * @returns {Promise<LoadEntitiesGenPaginatedResponse | null>} The API response data or null if an error occurs, e.g.:
   *   {
   *     "success": true,
   *     "data": {
   *       "totalCount": 42,
   *       "data": [
   *         {
   *           "_id": "5f8d7a1b2c3d4e5f6a7b8c9d",
   *           "name": "Production Line A",
   *           "star": true,
   *           "devConfigs": [
   *             {
   *               "device": {
   *                 "_id": "5f8e7a1b2c3d4e5f6a7b8c9e",
   *                 "devID": "MACHINE_001",
   *                 "name": "Conveyor A",
   *                 "sensors": [
   *                   {
   *                     "sensorId": "rpm",
   *                     "unit": "RPM"
   *                   }
   *                 ]
   *               },
   *               "sensor": "rpm"
   *             }
   *           ]
   *         }
   *       ]
   *     }
   *   }
   *
   * @example
   * // Basic pagination:
   * const result = await deviceAccess.loadEntitiesGenPaginated({
   *   page: 1,
   *   limit: 10
   * });
   *
   * // With search and filtering:
   * const result = await deviceAccess.loadEntitiesGenPaginated({
   *   page: 1,
   *   limit: 20,
   *   search: {
   *     all: ["production"],
   *     name: ["line"],
   *     tags: ["critical"]
   *   },
   *   archive: false,
   *   order: "increment",
   *   sort: "alphabetical"
   * });
   *
   * // With projections:
   * const result = await deviceAccess.loadEntitiesGenPaginated({
   *   page: 2,
   *   limit: 5,
   *   projection: "name,star,devConfigs",
   *   deviceProjection: "devID,name,sensors",
   *   extraHeaders: {
   *     origin: 'https://iosense.io'
   *   }
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

    const protocol = this.onPrem ? Protocol.HTTP : Protocol.HTTPS;
    const url = DEVICE_LOAD_ENTITIES_GEN_PAGINATED_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
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

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

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
