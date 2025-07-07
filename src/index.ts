// Main entry point for API-Documentation
// Exporting all main classes and interfaces from pubsub and connectors

// PubSub Exports
export { MongoCRUD, MongoConfig } from './pubsub/mongo_crud';
export { RedisCRUD, RedisConfig } from './pubsub/redis_crud';
export { RMQHandler, RMQCredentials } from './pubsub/rmq_handler';
export { MqttConnector, MqttConfig, DevicePayload } from './pubsub/mqtt_handler';

// Connectors Exports
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
  // New interfaces for refactored functions
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
  // New interfaces for paginated load entities
  EntitySearchParams,
  LoadEntitiesGenPaginatedOptions,
  PaginatedEntityDeviceConfig,
  PaginatedEntityData,
  LoadEntitiesGenPaginatedResponse,
} from './connectors/DeviceAccess';
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
} from './connectors/UserAccess';
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
} from './connectors/login_manager'; 