import axios, { AxiosResponse } from 'axios';
import { DEVICE_MONTHLY_CONSUMPTION_URL } from '../../utils/constants.js';
import { DeviceAccessBase } from './base.js';
import { 
  GetMonthlyConsumptionOptions,
  GetMonthlyConsumptionResponse 
} from './types.js';

export class DeviceConsumptionHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
  }

  /**
   * Retrieves monthly consumption values for a specified device and sensor by comparing first and last readings of each month.
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
   * @returns {Promise<GetMonthlyConsumptionResponse | null>} The API response data or null if an error occurs
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

    const url = this.base.formatUrl(DEVICE_MONTHLY_CONSUMPTION_URL);

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

    const headers = this.base.createHeaders({
      'Content-Type': 'application/json',
      ...extraHeaders,
    });

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
}