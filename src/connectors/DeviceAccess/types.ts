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
 * Interface for getLastDataPoints request options
 */
export interface GetLastDataPointsOptions {
  devices: string[];
  sensors?: string[];
  extraHeaders?: Record<string, string>;
  [key: string]: any;
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
 * Interface for getDataByTimeRange request options
 */
export interface GetDataByTimeRangeOptions {
  devID: string;
  sensor?: string;
  startTime: string | number | Date;
  endTime: string | number | Date;
  downSample?: string | number;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
}

/**
 * Interface for getDataByTimeRangeWithCalibration request options
 */
export interface GetDataByTimeRangeCalibrationOptions {
  devID: string;
  sensor?: string;
  startTime: string | number | Date;
  endTime: string | number | Date;
  calibration?: string | number | boolean;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
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
 * Interface for getDataCount request options
 */
export interface GetDataCountOptions {
  devID: string;
  sensor?: string;
  startTime: string | number | Date;
  endTime: string | number | Date;
  extraHeaders?: Record<string, string>;
  [key: string]: any;
}

/**
 * Interface for getDataCount response
 */
export interface GetDataCountResponse {
  success: boolean;
  data: {
    count: number;
  };
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