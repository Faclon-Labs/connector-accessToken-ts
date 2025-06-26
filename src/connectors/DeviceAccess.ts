import axios, { AxiosResponse } from 'axios';
import { DEVICE_ALL_URL, DEVICE_DATA_URL, DEVICE_BY_DEVID_URL, DEVICE_LAST_DATA_POINTS_URL, DEVICE_DATA_BY_TIME_RANGE_URL, DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL, DEVICE_LIMITED_DATA_URL, DEVICE_DATA_BY_STET_URL, DEVICE_DATA_COUNT_URL, TIMEZONES, MAX_RETRIES, RETRY_DELAY } from '../../utils/constants.js';

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
 * Service class for accessing device-related API endpoints.
 */
export class DeviceAccess {
  private dataUrl: string;
  private accessToken: string;
  private onPrem: boolean;
  private tz: string;

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
   * Fetches all devices associated with the authenticated user.
   *
   * @description
   * This method retrieves a list of all devices associated with the authenticated user's account.
   * It includes detailed information about each device such as device ID, name, type, sensors,
   * parameters, units, location, and custom configurations.
   *
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns An array of Device objects if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const devices = await deviceAccess.getAllDevices({ origin: 'https://iosense.io' });
   * // Example output:
   * // [
   * //   {
   * //     "_id": "dummy_device_id_123",
   * //     "tags": ["dummy_tag_1", "dummy_tag_2", "dummy_tag_3"],
   * //     "addedOn": "2023-12-27T15:35:12.177Z",
   * //     "widgets": [],
   * //     "mapSensorConfig": [],
   * //     "isHidden": false,
   * //     "dynamicFilter": [],
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
   * //     "canUserEdit": true,
   * //     "star": false,
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
   * //     ],
   * //     "added_by": "dummy_user_id_123",
   * //     "location": {
   * //       "latitude": 40.7128,
   * //       "longitude": -74.0060
   * //     },
   * //     "iconURL": "../../../assets/img/device_types/dummy_device.svg?timestamp=1234567890",
   * //     "config": [],
   * //     "geoFences": [],
   * //     "custom": {
   * //       "SENSOR_1": [
   * //         {
   * //           "customShow": "Raw Variable",
   * //           "customVariable": "dummy_device_001_SENSOR_1"
   * //         },
   * //         {
   * //           "customShow": "Processed Reading",
   * //           "customVariable": "1*dummy_device_001_SENSOR_1+0"
   * //         }
   * //       ]
   * //     },
   * //     "__v": 0,
   * //     "mapIconConfig": null
   * //   }
   * // ]
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during metadata retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getAllDevices(extraHeaders: Partial<DeviceHeaders> = {}): Promise<Device[] | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = DEVICE_ALL_URL.replace('{protocol}', protocol).replace('{backend_url}', this.dataUrl);
    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

    try {
      return await this.requestWithRetry<Device[]>(url, headers);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Get all devices error:', {
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
   * Fetches data for a specific device by its ID.
   *
   * @description
   * This method retrieves the data readings and device information for a specific device.
   * It includes sensor readings with timestamps, processed and raw values, and units.
   *
   * @param deviceId - The ID of the device to fetch data for
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device data response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const deviceData = await deviceAccess.getDeviceData('dummy_device_id_123', { origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": {
   * //     "readings": [
   * //       {
   * //         "_id": "dummy_reading_id_1",
   * //         "deviceID": "dummy_device_id_123",
   * //         "sensorID": "SENSOR_1",
   * //         "value": 25.5,
   * //         "timestamp": "2024-01-17T12:34:56.789Z",
   * //         "processedValue": 25.5,
   * //         "rawValue": 25.5,
   * //         "unit": "°C"
   * //       },
   * //       {
   * //         "_id": "dummy_reading_id_2",
   * //         "deviceID": "dummy_device_id_123",
   * //         "sensorID": "SENSOR_2",
   * //         "value": 65.2,
   * //         "timestamp": "2024-01-17T12:34:56.789Z",
   * //         "processedValue": 65.2,
   * //         "rawValue": 65.2,
   * //         "unit": "%"
   * //       }
   * //     ],
   * //     "deviceInfo": {
   * //       // Full device information as shown in getAllDevices response
   * //     }
   * //   }
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getDeviceData(
    deviceId: string,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<DeviceDataResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const url = DEVICE_DATA_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{id}', deviceId);

    const headers: DeviceHeaders = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };

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
   * Fetches a specific device by its devID.
   *
   * @description
   * This method retrieves detailed information about a specific device using its devID.
   * It includes device configuration, sensors, parameters, units, and properties.
   *
   * @param devID - The devID of the device to fetch
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device response if successful, or null if an error occurs
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
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getDeviceByDevID(
    devID: string,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<DeviceByDevIDResponse | null> {
    const protocol = this.onPrem ? 'http' : 'https';
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
   * Fetches the last data points for all devices.
   *
   * @description
   * This method retrieves the most recent data points for all devices associated with the authenticated user.
   * It returns a mapping of device IDs to their last recorded time and value.
   *
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The last data points response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const lastDataPoints = await deviceAccess.getLastDataPoints({ origin: 'https://iosense.io' });
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": {
   * //     "dummy_device_1": {
   * //       "time": "2024-01-17T12:34:56.789Z",
   * //       "value": 25.5
   * //     },
   * //     "dummy_device_2": {
   * //       "time": "2024-01-17T12:30:45.123Z",
   * //       "value": 65.2
   * //     },
   * //     "dummy_device_3": {
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
    const protocol = this.onPrem ? 'http' : 'https';
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
   * Fetches device data for a specific time range with downsampling.
   *
   * @description
   * This method retrieves device data for a specific sensor within a given time range.
   * It supports downsampling to reduce data points and uses Unix timestamps in milliseconds.
   *
   * @param devID - The device ID
   * @param sensor - The sensor ID
   * @param startTime - The start time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param endTime - The end time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param downSample - Optional downsampling factor
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device data by time range response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * 
   * // Using ISO strings
   * const data1 = await deviceAccess.getDataByTimeRange(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   '2024-01-17T12:00:00.000Z',
   *   '2024-01-17T13:00:00.000Z',
   *   60,
   *   { origin: 'https://iosense.io' }
   * );
   * 
   * // Using Date objects
   * const startDate = new Date('2024-01-17T12:00:00.000Z');
   * const endDate = new Date('2024-01-17T13:00:00.000Z');
   * const data2 = await deviceAccess.getDataByTimeRange(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   startDate,
   *   endDate,
   *   60
   * );
   * 
   * // Using Unix timestamps in milliseconds
   * const data3 = await deviceAccess.getDataByTimeRange(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   1705492800000, // 2024-01-17T12:00:00.000Z
   *   1705496400000, // 2024-01-17T13:00:00.000Z
   *   60
   * );
   * 
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": [
   * //     [
   * //       {
   * //         "time": "2024-01-17T12:00:00.000Z",
   * //         "value": 25.5
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:01:00.000Z",
   * //         "value": 25.7
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:02:00.000Z",
   * //         "value": 25.3
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

    const protocol = this.onPrem ? 'http' : 'https';
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
   * Fetches device data for a specific time range with calibration.
   *
   * @description
   * This method retrieves calibrated device data for a specific sensor within a given time range.
   * It uses Unix timestamps in milliseconds and applies calibration to the data values.
   *
   * @param devID - The device ID
   * @param sensor - The sensor ID
   * @param startTime - The start time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param endTime - The end time (can be ISO string, Date object, or Unix timestamp in milliseconds)
   * @param calibration - The calibration factor to apply to the data
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The device data by time range with calibration response if successful, or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * 
   * // Using ISO strings
   * const data1 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   '2024-01-17T12:00:00.000Z',
   *   '2024-01-17T13:00:00.000Z',
   *   1.5, // calibration factor
   *   { origin: 'https://iosense.io' }
   * );
   * 
   * // Using Date objects
   * const startDate = new Date('2024-01-17T12:00:00.000Z');
   * const endDate = new Date('2024-01-17T13:00:00.000Z');
   * const data2 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   startDate,
   *   endDate,
   *   0.8 // calibration factor
   * );
   * 
   * // Using Unix timestamps in milliseconds
   * const data3 = await deviceAccess.getDataByTimeRangeWithCalibration(
   *   'dummy_device_001',
   *   'SENSOR_1',
   *   1705492800000, // 2024-01-17T12:00:00.000Z
   *   1705496400000, // 2024-01-17T13:00:00.000Z
   *   2.0 // calibration factor
   * );
   * 
   * // Example output:
   * // {
   * //   "success": true,
   * //   "data": [
   * //     [
   * //       {
   * //         "time": "2024-01-17T12:00:00.000Z",
   * //         "value": 38.25 // calibrated value (25.5 * 1.5)
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:01:00.000Z",
   * //         "value": 38.55 // calibrated value (25.7 * 1.5)
   * //       },
   * //       {
   * //         "time": "2024-01-17T12:02:00.000Z",
   * //         "value": 37.95 // calibrated value (25.3 * 1.5)
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
    calibration: number,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<DeviceDataByTimeRangeCalibrationResponse | null> {
    // Convert times to Unix timestamps in milliseconds
    const startTimeUnix = this.timeToUnix(startTime);
    const endTimeUnix = this.timeToUnix(endTime);

    const protocol = this.onPrem ? 'http' : 'https';
    const url = DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{sTime}', startTimeUnix.toString())
      .replace('{eTime}', endTimeUnix.toString())
      .replace('{calibration}', calibration.toString());

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
   * Fetches device data for a specific device and time range using the getDataByStEt endpoint.
   *
   * @description
   * This method retrieves all available data points for a given device within a specified start and end time range. The data returned typically includes timestamped sensor readings or status values, and is useful for historical analysis, reporting, or custom data visualizations. The time range can be specified as ISO strings, Date objects, or Unix timestamps in milliseconds. The response format and included fields may vary depending on the device and backend implementation, but generally includes an array of objects with time and value fields.
   *
   * @param devID - The device ID for which to fetch data
   * @param startTime - The start time (string | number | Date) for the data range
   * @param endTime - The end time (string | number | Date) for the data range
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The JSON response from the API or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const data = await deviceAccess.getDataByStEt('MJTEM_C1', '2025-01-27T07:00:00', '2025-01-28T06:59:59');
   * // Example output:
   * // {
   * //   success: true,
   * //   data: [
   * //     { time: '2025-01-28T05:43:28.491Z', RSSI: '-1' },
   * //     { time: '2025-01-28T03:42:28.479Z', RSSI: '-1' },
   * //     { time: '2025-01-28T01:41:28.476Z', RSSI: '-1' },
   * //     { time: '2025-01-27T23:40:28.472Z', RSSI: '-1' },
   * //     { time: '2025-01-27T21:39:28.468Z', RSSI: '-1' },
   * //     { time: '2025-01-27T19:38:28.459Z', RSSI: '-1' },
   * //     { time: '2025-01-27T17:37:28.450Z', RSSI: '-1' },
   * //     { time: '2025-01-27T15:36:28.439Z', RSSI: '-1' },
   * //     { time: '2025-01-27T13:35:28.427Z', RSSI: '-1' },
   * //     { time: '2025-01-27T11:34:22.883Z', RSSI: '-1' },
   * //     { time: '2025-01-27T09:33:22.880Z', RSSI: '-1' },
   * //     { time: '2025-01-27T07:32:22.873Z', RSSI: '-1' }
   * //   ]
   * // }
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getDataByStEt(
    devID: string,
    startTime: string | number | Date,
    endTime: string | number | Date,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<any | null> {
    const protocol = this.onPrem ? 'http' : 'https';
    const sTime = this.timeToUnix(startTime).toString();
    const eTime = this.timeToUnix(endTime).toString();
    const url = DEVICE_DATA_BY_STET_URL
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl)
      .replace('{devID}', devID)
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
   * Fetches a limited number of recent data points for a specific device and sensor.
   *
   * @description
   * This method retrieves the most recent data points for a given device and sensor, up to the specified limit. It is useful for quickly fetching the latest readings for a sensor, such as for displaying recent trends or for monitoring dashboards. The data is returned as an array of objects, each containing a timestamp and value. The number of records returned will not exceed the specified limit.
   *
   * @param devID - The device ID for which to fetch data
   * @param sensor - The sensor ID for which to fetch data
   * @param lim - The maximum number of records to fetch
   * @param extraHeaders - Optional additional HTTP headers for the request
   * @returns The JSON response from the API or null if an error occurs
   *
   * @example
   * ```typescript
   * const deviceAccess = new DeviceAccess('appserver.iosense.io', '<access_token>', false);
   * const data = await deviceAccess.getLimitedData('MJTEM_C1', 'D5', 5);
   * // Example output:
   * // [
   * //   [
   * //     { time: '2024-11-19T07:39:00.000Z', value: 720477 },
   * //     { time: '2024-11-19T07:38:30.000Z', value: 720477 },
   * //     { time: '2024-11-19T07:38:00.000Z', value: 720477 },
   * //     { time: '2024-11-19T07:37:30.000Z', value: 720477 },
   * //     { time: '2024-11-19T07:37:00.000Z', value: 720477 }
   * //   ]
   * // ]
   * ```
   *
   * @throws Error if an error occurs during the HTTP request, such as a network issue or timeout.
   * @throws Error if an unexpected error occurs during data retrieval, such as parsing JSON data or other unexpected issues.
   */
  async getLimitedData(
    devID: string,
    sensor: string,
    lim: number,
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<any | null> {
    const protocol = this.onPrem ? 'http' : 'https';
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
      return await this.requestWithRetry<any>(url, headers);
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
    const protocol = this.onPrem ? 'http' : 'https';
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
}
