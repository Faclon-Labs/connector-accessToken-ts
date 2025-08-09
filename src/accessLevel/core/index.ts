// Core exports - works everywhere (browser, Node.js, SSR)
// Only includes HTTP-based features

export { 
  DeviceAccess,
  DeviceLocation,
  DeviceParam,
  DeviceSensor,
  DeviceProperty,
  CustomVariable,
  Device,
  DeviceHeaders,
  DeviceReading,
  DeviceDataResponse,
  DeviceByDevIDResponse,
  LastDataPoint,
  LastDataPointsResponse,
  LastDPResponse,
  TimeRangeDataPoint,
  DeviceDataByTimeRangeResponse,
  DeviceDataByTimeRangeCalibrationResponse,
  LoadEntitiesGenResponse,
  LoadEntitiesGenByIdResponse,
  DeviceSearchParams,
  GetAllDevicesPaginatedOptions,
  GetAllDevicesPaginatedResponse,
  GetDeviceDataOptions,
  GetDeviceByDevIDOptions,
  GetLastDPOptions,
  DeviceDataPoint,
  GetDataByStEtOptions,
  GetDataByStEtResponse,
  GetDataByStEtResponseWithCursor,
  LimitedDataPoint,
  GetLimitedDataResponse,
  GetLimitedDataOptions,
  MonthlyConsumptionData,
  GetMonthlyConsumptionResponse,
  GetMonthlyConsumptionOptions,
  LoadEntitiesGenOptions,
  LoadEntitiesGenByIdOptions,
  EntitySearchParams,
  LoadEntitiesGenPaginatedOptions,
  PaginatedEntityDeviceConfig,
  PaginatedEntityData,
  LoadEntitiesGenPaginatedResponse,
} from '../../connectors/DeviceAccess/DeviceAccess';

export { 
  UserAccess, 
  Name, 
  Phone, 
  PersonalDetails as UserPersonalDetails, 
  UserID, 
  UserDetailsResponse, 
  UserDetailsHeaders, 
  UserQuotaRequest, 
  QuotaItem, 
  UserQuotaResponse, 
  UserEntityRoute, 
  UserEntitiesResponse, 
  UserEntityFetchResponse 
} from '../../connectors/UserAccess/UserAccess';

export { 
  login, 
  LoginRequest, 
  LoginResponse, 
  User, 
  Organisation, 
  UserDetail, 
  PersonalDetails as LoginPersonalDetails, 
  ReportDetail, 
  EntitySet 
} from '../../connectors/login_manager';

export { 
  BruceHandler
} from '../../connectors/BruceHandler/BruceHandler';