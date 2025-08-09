import { DeviceAccessBase } from './base.js';
import { DeviceListHandler } from './deviceList.js';
import { DeviceInfoHandler } from './deviceInfo.js';
import { DeviceDataHandler } from './deviceData.js';
import { DeviceEntitiesHandler } from './deviceEntities.js';
import { DeviceConsumptionHandler } from './deviceConsumption.js';
import { DeviceTimeDataHandler } from './deviceTimeData.js';
import {
  GetAllDevicesPaginatedOptions,
  GetAllDevicesPaginatedResponse,
  GetDeviceDataOptions,
  DeviceDataResponse,
  GetDeviceByDevIDOptions,
  DeviceByDevIDResponse,
  GetLastDPOptions,
  LastDPResponse,
  GetLimitedDataOptions,
  GetLimitedDataResponse,
  GetDataCountOptions,
  GetDataCountResponse,
  LoadEntitiesGenOptions,
  LoadEntitiesGenResponse,
  LoadEntitiesGenByIdOptions,
  LoadEntitiesGenByIdResponse,
  LoadEntitiesGenPaginatedOptions,
  LoadEntitiesGenPaginatedResponse,
  GetMonthlyConsumptionOptions,
  GetMonthlyConsumptionResponse,
  GetDataByTimeRangeOptions,
  DeviceDataByTimeRangeResponse,
  GetDataByTimeRangeCalibrationOptions,
  DeviceDataByTimeRangeCalibrationResponse,
  GetDataByStEtOptions,
  GetDataByStEtResponse,
  GetDataByStEtResponseWithCursor,
  DeviceHeaders,
  LastDataPointsResponse
} from './types.js';

/**
 * Service class for accessing device-related API endpoints.
 *
 * @property DEVICE_DEFAULT_CURSOR_LIMIT - The default maximum number of results to return in device queries (pagination limit).
 */
export class DeviceAccess extends DeviceAccessBase {
  private deviceListHandler: DeviceListHandler;
  private deviceInfoHandler: DeviceInfoHandler;
  private deviceDataHandler: DeviceDataHandler;
  private deviceEntitiesHandler: DeviceEntitiesHandler;
  private deviceConsumptionHandler: DeviceConsumptionHandler;
  private deviceTimeDataHandler: DeviceTimeDataHandler;

  /**
   * Constructs a new DeviceAccess service instance.
   *
   * @param dataUrl - The backend server URL (e.g., 'appserver.iosense.io')
   * @param accessToken - The Bearer access token for Authorization
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'
   * @param tz - Optional timezone string (e.g., 'UTC', 'ICT'). Defaults to 'UTC'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    super(dataUrl, accessToken, onPrem, tz);
    this.deviceListHandler = new DeviceListHandler(this);
    this.deviceInfoHandler = new DeviceInfoHandler(this);
    this.deviceDataHandler = new DeviceDataHandler(this);
    this.deviceEntitiesHandler = new DeviceEntitiesHandler(this);
    this.deviceConsumptionHandler = new DeviceConsumptionHandler(this);
    this.deviceTimeDataHandler = new DeviceTimeDataHandler(this);
  }

  // Device List Operations
  /**
   * Fetches paginated list of user devices with advanced filtering and sorting.
   */
  async getAllDevicesPaginated(options: GetAllDevicesPaginatedOptions = {}): Promise<GetAllDevicesPaginatedResponse | null> {
    return this.deviceListHandler.getAllDevicesPaginated(options);
  }

  // Device Info Operations
  /**
   * Fetches complete configuration data for a specific device.
   */
  async getDeviceData(options: GetDeviceDataOptions): Promise<DeviceDataResponse | null> {
    return this.deviceInfoHandler.getDeviceData(options);
  }

  /**
   * Retrieves detailed configuration of a specific device by its devID.
   */
  async getDeviceByDevID(options: GetDeviceByDevIDOptions): Promise<DeviceByDevIDResponse | null> {
    return this.deviceInfoHandler.getDeviceByDevID(options);
  }

  // Device Data Operations
  /**
   * Retrieves the most recent data points (RSSI values) for all devices belonging to the authenticated user.
   */
  async getLastDataPoints(extraHeaders: Partial<DeviceHeaders> = {}): Promise<LastDataPointsResponse | null> {
    return this.deviceDataHandler.getLastDataPoints(extraHeaders);
  }

  /**
   * Retrieves the most recent data point for specified sensors of a device.
   */
  async getLastDP(options: GetLastDPOptions): Promise<LastDPResponse | null> {
    return this.deviceDataHandler.getLastDP(options);
  }

  /**
   * Retrieves the most recent limited data points for a specific device sensor.
   */
  async getLimitedData(options: GetLimitedDataOptions): Promise<GetLimitedDataResponse | null> {
    return this.deviceDataHandler.getLimitedData(options);
  }

  /**
   * Retrieves the count of data points for a specific device sensor within a time range.
   */
  async getDataCount(options: GetDataCountOptions): Promise<GetDataCountResponse | null> {
    return this.deviceDataHandler.getDataCount(options);
  }

  // Entity Operations
  /**
   * Fetches all load entities available to the authenticated user.
   */
  async loadEntitiesGen(options: LoadEntitiesGenOptions = {}): Promise<LoadEntitiesGenResponse | null> {
    return this.deviceEntitiesHandler.loadEntitiesGen(options);
  }

  /**
   * Fetches a single entity and its device configurations by entity ID.
   */
  async loadEntitiesGenById(options: LoadEntitiesGenByIdOptions): Promise<LoadEntitiesGenByIdResponse | null> {
    return this.deviceEntitiesHandler.loadEntitiesGenById(options);
  }

  /**
   * Fetches paginated load entities with advanced filtering and sorting capabilities.
   */
  async loadEntitiesGenPaginated(options: LoadEntitiesGenPaginatedOptions): Promise<LoadEntitiesGenPaginatedResponse | null> {
    return this.deviceEntitiesHandler.loadEntitiesGenPaginated(options);
  }

  // Consumption Operations
  /**
   * Calculates monthly consumption values for a specified sensor by comparing first and last readings of each month.
   */
  async getMonthlyConsumption(options: GetMonthlyConsumptionOptions): Promise<GetMonthlyConsumptionResponse | null> {
    return this.deviceConsumptionHandler.getMonthlyConsumption(options);
  }

  // Time-based Data Operations
  /**
   * Retrieves device data within a specified time range.
   */
  async getDataByTimeRange(options: GetDataByTimeRangeOptions): Promise<DeviceDataByTimeRangeResponse | null> {
    return this.deviceTimeDataHandler.getDataByTimeRange(options);
  }

  /**
   * Retrieves device data within a specified time range with calibration options.
   */
  async getDataByTimeRangeWithCalibration(options: GetDataByTimeRangeCalibrationOptions): Promise<DeviceDataByTimeRangeCalibrationResponse | null> {
    return this.deviceTimeDataHandler.getDataByTimeRangeWithCalibration(options);
  }

  /**
   * Retrieves device data between start and end times using the StEt endpoint.
   */
  async getDataByStEt(options: GetDataByStEtOptions): Promise<GetDataByStEtResponse | GetDataByStEtResponseWithCursor | null> {
    return this.deviceTimeDataHandler.getDataByStEt(options);
  }
}

// Re-export all types for convenience
export * from './types.js';