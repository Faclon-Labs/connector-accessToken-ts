import { DeviceAccessBase } from './base.js';
import {
  GetDataByTimeRangeOptions,
  DeviceDataByTimeRangeResponse,
  GetDataByTimeRangeCalibrationOptions,
  DeviceDataByTimeRangeCalibrationResponse,
  GetDataByStEtOptions,
  GetDataByStEtResponse,
  GetDataByStEtResponseWithCursor
} from './types.js';
import {
  DEVICE_DATA_BY_TIME_RANGE_URL,
  DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL,
  DEVICE_DATA_BY_STET_URL
} from '../../utils/constants.js';

/**
 * Handler for time-based device data operations.
 * Manages data retrieval by time ranges with various options.
 */
export class DeviceTimeDataHandler {
  private base: DeviceAccessBase;

  constructor(base: DeviceAccessBase) {
    this.base = base;
  }

  /**
   * Retrieves device data within a specified time range.
   * 
   * @param options - Configuration options for the time range query
   * @returns Promise resolving to time range data or null if unsuccessful
   */
  async getDataByTimeRange(options: GetDataByTimeRangeOptions): Promise<DeviceDataByTimeRangeResponse | null> {
    try {
      const { devID, sensor = 'arduino', startTime, endTime, downSample = 1, extraHeaders = {} } = options;
      
      // Convert dates to Unix timestamps if needed
      const sTime = this.base.timeToUnix(startTime);
      const eTime = this.base.timeToUnix(endTime);
      
      // Format URL with parameters
      const url = this.base.formatUrl(
        DEVICE_DATA_BY_TIME_RANGE_URL
          .replace('{devID}', devID)
          .replace('{sensor}', sensor)
          .replace('{sTime}', sTime.toString())
          .replace('{eTime}', eTime.toString())
          .replace('{downSample}', downSample.toString())
      );

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.base.getAccessToken()}`,
        'Content-Type': 'application/json',
        ...extraHeaders
      };

      // Make request
      const response = await this.base.requestWithRetry<DeviceDataByTimeRangeResponse>(url, headers);
      return response;
    } catch (error) {
      console.error('Error in getDataByTimeRange:', error);
      return null;
    }
  }

  /**
   * Retrieves device data within a specified time range with calibration options.
   * 
   * @param options - Configuration options for the calibrated time range query
   * @returns Promise resolving to calibrated time range data or null if unsuccessful
   */
  async getDataByTimeRangeWithCalibration(options: GetDataByTimeRangeCalibrationOptions): Promise<DeviceDataByTimeRangeCalibrationResponse | null> {
    try {
      const { devID, sensor = 'arduino', startTime, endTime, calibration = true, extraHeaders = {} } = options;
      
      // Convert dates to Unix timestamps if needed
      const sTime = this.base.timeToUnix(startTime);
      const eTime = this.base.timeToUnix(endTime);
      
      // Format URL with parameters
      const url = this.base.formatUrl(
        DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL
          .replace('{devID}', devID)
          .replace('{sensor}', sensor)
          .replace('{sTime}', sTime.toString())
          .replace('{eTime}', eTime.toString())
          .replace('{calibration}', calibration.toString())
      );

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.base.getAccessToken()}`,
        'Content-Type': 'application/json',
        ...extraHeaders
      };

      // Make request
      const response = await this.base.requestWithRetry<DeviceDataByTimeRangeCalibrationResponse>(url, headers);
      return response;
    } catch (error) {
      console.error('Error in getDataByTimeRangeWithCalibration:', error);
      return null;
    }
  }

  /**
   * Retrieves device data between start and end times using the StEt endpoint.
   * 
   * @param options - Configuration options for the StEt query
   * @returns Promise resolving to StEt data or null if unsuccessful
   */
  async getDataByStEt(options: GetDataByStEtOptions): Promise<GetDataByStEtResponse | GetDataByStEtResponseWithCursor | null> {
    try {
      const { devID, startTime, endTime, cursor = false, extraHeaders = {} } = options;
      
      // Convert dates to Unix timestamps if needed
      const sTime = this.base.timeToUnix(startTime);
      const eTime = this.base.timeToUnix(endTime);
      
      // Format URL with parameters
      const url = this.base.formatUrl(
        DEVICE_DATA_BY_STET_URL
          .replace('{devID}', devID)
          .replace('{sTime}', sTime.toString())
          .replace('{eTime}', eTime.toString())
      );

      // Prepare headers
      const headers = {
        'Authorization': `Bearer ${this.base.getAccessToken()}`,
        'Content-Type': 'application/json',
        ...extraHeaders
      };

      // Make request
      if (cursor) {
        const response = await this.base.requestWithRetry<GetDataByStEtResponseWithCursor>(url, headers);
        return response;
      } else {
        const response = await this.base.requestWithRetry<GetDataByStEtResponse>(url, headers);
        return response;
      }
    } catch (error) {
      console.error('Error in getDataByStEt:', error);
      return null;
    }
  }
} 