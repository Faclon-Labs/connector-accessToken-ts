import axios, { AxiosResponse } from 'axios';
import { 
  DEVICE_LAST_DATA_POINTS_URL, 
  DEVICE_LAST_DP_URL, 
  DEVICE_LIMITED_DATA_URL,
  DEVICE_DATA_COUNT_URL 
} from '../../utils/constants.js';
import { DeviceAccessBase } from './base.js';
import { 
  GetLastDataPointsOptions,
  LastDataPointsResponse,
  GetLastDPOptions, 
  LastDPResponse,
  GetLimitedDataOptions,
  GetLimitedDataResponse,
  GetDataCountOptions,
  GetDataCountResponse,
  DeviceHeaders 
} from './types.js';

export class DeviceDataHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
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
   * // Get last data points for all devices:
   * const lastDataPoints = await deviceAccess.getLastDataPoints();
   * 
   * // Get last data points with additional headers:
   * const lastDataPoints = await deviceAccess.getLastDataPoints({ 
   *   origin: 'https://iosense.io' 
   * });
   */
  async getLastDataPoints(
    extraHeaders: Partial<DeviceHeaders> = {}
  ): Promise<LastDataPointsResponse | null> {
    const url = this.base.formatUrl(DEVICE_LAST_DATA_POINTS_URL);

    const headers: DeviceHeaders = this.base.createHeaders(extraHeaders as Record<string, string>);

    try {
      return await this.base.requestWithRetry<LastDataPointsResponse>(url, headers);
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
   * @returns {Promise<LastDPResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Get last data points for specific sensors:
   * const result = await deviceAccess.getLastDP({
   *   devID: 'F2401_A12',
   *   sensors: ['TOTAL', 'D5']
   * });
   */
  async getLastDP(options: GetLastDPOptions): Promise<LastDPResponse | null> {
    const {
      devID,
      sensors,
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.base.formatUrl(DEVICE_LAST_DP_URL);

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

    const headers = this.base.createHeaders({
      'Content-Type': 'application/json',
      ...extraHeaders,
    });

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
   * Retrieves the most recent limited data points for a specific device sensor.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/getLimitedData/:devID/:sensor/:lim
   * Method: GET
   *
   * @param options - Options for fetching limited data:
   *   @param devID {string} - The device identifier. (required)
   *   @param sensor {string} - The sensor name (defaults to 'arduino'). (optional)
   *   @param lim {number} - The number of data points to retrieve. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<GetLimitedDataResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Get last 100 data points for a specific device:
   * const result = await deviceAccess.getLimitedData({
   *   devID: 'F2401_A12',
   *   sensor: 'TOTAL',
   *   lim: 100
   * });
   */
  async getLimitedData(options: GetLimitedDataOptions): Promise<GetLimitedDataResponse | null> {
    const {
      devID,
      sensor = 'arduino',
      lim,
      extraHeaders = {},
      ...rest
    } = options;

    const url = this.base.formatUrl(DEVICE_LIMITED_DATA_URL)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{lim}', lim.toString());

    const headers: DeviceHeaders = this.base.createHeaders(extraHeaders as Record<string, string>);

    try {
      return await this.base.requestWithRetry<GetLimitedDataResponse>(url, headers);
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
   * Convert a given time to Unix timestamp in milliseconds.
   * @param time - The time to be converted. It can be a string in ISO 8601 format, a Unix timestamp in milliseconds, or a Date object. If null or undefined, the current time is used.
   * @param timezone - The timezone to use (e.g., 'America/New_York', 'UTC'). This is used when time is not provided or doesn't have timezone info. Defaults to this.tz.
   * @returns The Unix timestamp in milliseconds.
   * @throws Error if the provided Unix timestamp is not in milliseconds or if there are mismatched offset times.
   */
  private timeToUnix(time: string | number | Date | null = null, timezone?: string): number {
    const tzToUse = timezone || this.base.getTimezone();
    
    // If time is not provided, use the current time in the specified timezone
    if (time === null || time === undefined) {
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
   * Retrieves the count of data points for a specific device sensor within a time range.
   *
   * This function is designed for cursor and user prompt usage: the user should only provide top-level params (not a nested body object).
   * The function will internally construct the request for the API call.
   *
   * Endpoint: /api/account/deviceData/count/:devID/:sensor/:sTime/:eTime
   * Method: GET
   *
   * @param options - Options for getting data count:
   *   @param devID {string} - The device identifier. (required)
   *   @param sensor {string} - The sensor name (defaults to 'arduino'). (optional)
   *   @param startTime {string | number | Date} - The start time. (required)
   *   @param endTime {string | number | Date} - The end time. (required)
   *   @param extraHeaders {Record<string, string>} - (optional) Additional HTTP headers.
   *   @param [other fields] - Any additional fields to include in the request.
   *
   * @returns {Promise<GetDataCountResponse | null>} The API response data or null if an error occurs
   *
   * @example
   * // Get data count for a device sensor in a time range:
   * const result = await deviceAccess.getDataCount({
   *   devID: 'F2401_A12',
   *   sensor: 'TOTAL',
   *   startTime: '2024-01-17T12:00:00.000Z',
   *   endTime: '2024-01-17T13:00:00.000Z'
   * });
   */
  async getDataCount(options: GetDataCountOptions): Promise<GetDataCountResponse | null> {
    const {
      devID,
      sensor = 'arduino',
      startTime,
      endTime,
      extraHeaders = {},
      ...rest
    } = options;

    // Convert times to Unix timestamps
    const sTime = this.timeToUnix(startTime);
    const eTime = this.timeToUnix(endTime);

    const url = this.base.formatUrl(DEVICE_DATA_COUNT_URL)
      .replace('{devID}', devID)
      .replace('{sensor}', sensor)
      .replace('{sTime}', sTime.toString())
      .replace('{eTime}', eTime.toString());

    const headers: DeviceHeaders = this.base.createHeaders(extraHeaders as Record<string, string>);

    try {
      return await this.base.requestWithRetry<GetDataCountResponse>(url, headers);
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