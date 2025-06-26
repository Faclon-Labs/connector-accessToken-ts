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

//-------------------------------MONGO DATA--------------------------------

export const USER_LOGIN_URL: string = '{protocol}://{backend_url}/api/login';
export const USER_DETAILS_URL: string = '{protocol}://{backend_url}/api/account/getUserDetails';
export const USER_QUOTA_URL: string = '{protocol}://{backend_url}/api/account/profile/quota';
export const USER_ENTITIES_URL: string = '{protocol}://{backend_url}/api/account/getUserEntities';
export const USER_ENTITY_FETCH_URL: string = '{protocol}://{backend_url}/api/account/userEntity/fetch';
export const DEVICE_ALL_URL: string = '{protocol}://{backend_url}/api/account/devices';
export const DEVICE_DATA_URL: string = '{protocol}://{backend_url}/api/account/devices/getDeviceData/{id}';
export const DEVICE_BY_DEVID_URL: string = '{protocol}://{backend_url}/api/account/device/getDevice/{devID}';
export const DEVICE_LAST_DATA_POINTS_URL: string = '{protocol}://{backend_url}/api/account/deviceData/lastDataPoints';
export const DEVICE_DATA_BY_TIME_RANGE_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getData/{devID}/{sensor}/{sTime}/{eTime}/{downSample}';
export const DEVICE_DATA_BY_TIME_RANGE_CALIBRATION_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getDataCalibration/{devID}/{sensor}/{sTime}/{eTime}/{calibration}';
export const DEVICE_LIMITED_DATA_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getLimitedData/{devID}/{sensor}/{lim}';
export const DEVICE_DATA_BY_STET_URL: string = '{protocol}://{backend_url}/api/account/deviceData/getDataByStEt/{devID}/{sTime}/{eTime}';
export const DEVICE_DATA_COUNT_URL: string = '{protocol}://{backend_url}/api/account/deviceData/count/{devID}/{sensor}/{sTime}/{eTime}';

// API Configuration constants
export const MAX_RETRIES: number = 15;
export const RETRY_DELAY: readonly [number, number] = [2, 4] as const;
