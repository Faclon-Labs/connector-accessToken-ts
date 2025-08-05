// src/constants.ts

export const VERSION: string = '1.0.0';

// Timezones interface and constants
export interface TimezoneConfig {
  readonly UTC: string;
  readonly IST: string;
}

export const TIMEZONES: TimezoneConfig = {
  UTC: 'UTC',
  IST: 'Asia/Kolkata'
} as const;

// Enum for common protocols
export enum Protocol {
  HTTP = 'http',
  HTTPS = 'https'
}

//------------------------------ Login Access -------------------------------

export const USER_LOGIN_URL: string = '{protocol}://{backend_url}/api/login';

//-------------------------------User Access -------------------------------

export const USER_DETAILS_URL: string = '{protocol}://{backend_url}/api/account/getUserDetails';
export const USER_QUOTA_URL: string = '{protocol}://{backend_url}/api/account/profile/quota';
export const USER_ENTITIES_URL: string = '{protocol}://{backend_url}/api/account/getUserEntities';
export const USER_ENTITY_FETCH_URL: string = '{protocol}://{backend_url}/api/account/userEntity/fetch';

//-------------------------------Device Access -------------------------------

export const DEVICE_ALL_URL: string = '{protocol}://{backend_url}/api/account/devices';
export const DEVICE_ALL_PAGINATED_URL: string = '{protocol}://{backend_url}/api/account/devices/{skip}/{limit}';
export const DEVICE_DATA_URL: string = '{protocol}://{backend_url}/api/account/devices/getDeviceData/{id}';
export const DEVICE_BY_DEVID_URL: string = '{protocol}://{backend_url}/api/account/device/getDevice/{devID}';
export const DEVICE_LAST_DATA_POINTS_URL: string = '{protocol}://{backend_url}/api/account/deviceData/lastDataPoints';
export const DEVICE_LAST_DP_URL: string = '{protocol}://{backend_url}/api/account/deviceData/lastDP';
export const DEVICE_DATA_BY_TIME_RANGE_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getData/{devID}/{sensor}/{sTime}/{eTime}/{downSample}';
export const DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getDataCalibration/{devID}/{sensor}/{sTime}/{eTime}/{calibration}';
export const DEVICE_LIMITED_DATA_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getLimitedData/{devID}/{sensor}/{lim}';
export const DEVICE_DATA_BY_STET_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getDataByStEt/{devID}/{sTime}/{eTime}';
export const DEVICE_DATA_COUNT_URL: string = '{protocol}://{backend_url}/api/account/deviceData/count/{devID}/{sensor}/{sTime}/{eTime}';
export const DEVICE_MONTHLY_CONSUMPTION_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getMonthlyConsumption';
export const DEVICE_LOAD_ENTITIES_GEN_URL: string = '{protocol}://{backend_url}/api/account/load-entities-gen';
export const DEVICE_LOAD_ENTITIES_GEN_BY_ID_URL: string = '{protocol}://{backend_url}/api/account/load-entities-gen/{id}';
export const DEVICE_LOAD_ENTITIES_GEN_PAGINATED_URL: string = '{protocol}://{backend_url}/api/account/load-entities-gen/{page}/{limit}';

/*------------------------------- BRUCE HANDLER FUNCTION ------------------------------------------ */
export const BRUCE_USER_INSIGHT_FETCH_PAGINATED_URL: string = '{protocol}://{data_url}/api/account/bruce/userInsight/fetch/paginated';
export const BRUCE_GET_SOURCE_INSIGHT_URL: string = '{protocol}://{data_url}/api/account/bruce/userInsight/fetch/getSourceInsight/{insightID}';
export const BRUCE_INSIGHT_RESULT_FETCH_PAGINATED_URL: string = '{protocol}://{data_url}/api/account/bruce/insightResult/fetch/paginated/{insightID}';
export const BRUCE_UPDATE_SINGLE_USER_INSIGHT_URL: string = '{protocol}://{data_url}/api/account/bruce/userInsight/update/singleUserInsight';
export const BRUCE_ADD_USER_INSIGHT_URL: string = '{protocol}://{data_url}/api/account/bruce/userInsight/add';

//-------------------------------- Constant Limits -------------------------------

// API Configuration constants
export const MAX_RETRIES: number = 15;

// Configuration for API delay
export const RETRY_DELAY: readonly [number, number] = [2, 4] as const;

// Default cursor limit for device queries
export const DEVICE_DEFAULT_CURSOR_LIMIT: number = 25000;

//------------------------------- pubsub Constants -------------------------------
//mongodb
export const DEFAULT_MONGO_URL: string = 'mongodb://localhost:27017/';
//redis
export const DEFAULT_REDIS_URL: string = 'redis://localhost:6379/';
//rabbitmq
export const DEFAULT_RABBITMQ_URL: string = 'amqp://localhost:5672/';
export const DEFAULT_RABBITMQ_USERNAME: string = 'guest';
export const DEFAULT_RABBITMQ_PASSWORD: string = 'guest';
//mqtt
export const DEFAULT_MQTT_BROKER: string = 'localhost';
export const DEFAULT_MQTT_PORT: number = 1883;
//postgres
export const DEFAULT_POSTGRES_HOST: string = 'localhost';
export const DEFAULT_POSTGRES_USER: string = 'postgres';
export const DEFAULT_POSTGRES_PORT: number = 5432;
//kfka
export const DEFAULT_KAFKA_BROKER: string = 'localhost:9092';

