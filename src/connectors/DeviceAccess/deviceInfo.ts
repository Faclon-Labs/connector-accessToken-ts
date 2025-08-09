import axios from 'axios';
import { DEVICE_DATA_URL, DEVICE_BY_DEVID_URL } from '../../utils/constants.js';
import { DeviceAccessBase } from './base.js';
import { 
  GetDeviceDataOptions, 
  DeviceDataResponse, 
  GetDeviceByDevIDOptions, 
  DeviceByDevIDResponse,
  DeviceHeaders 
} from './types.js';

export class DeviceInfoHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
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
   * @returns {Promise<DeviceDataResponse | null>} The API response data or null if an error occurs
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

    const url = this.base.formatUrl(DEVICE_DATA_URL).replace('{id}', deviceId);

    const headers: DeviceHeaders = this.base.createHeaders(extraHeaders);

    // Debug logging
    console.log('=== Debug Info ===');
    console.log('URL:', url);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Device ID:', deviceId);
    console.log('==================');

    try {
      return await this.base.requestWithRetry<DeviceDataResponse>(url, headers);
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
   * @returns {Promise<DeviceByDevIDResponse | null>} The API response data or null if an error occurs
   *
   * @example
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

    const url = this.base.formatUrl(DEVICE_BY_DEVID_URL).replace('{devID}', devID);

    const headers: DeviceHeaders = this.base.createHeaders(extraHeaders);

    try {
      return await this.base.requestWithRetry<DeviceByDevIDResponse>(url, headers);
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
}