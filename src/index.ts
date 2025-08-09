// Universal entry point - smart detection of environment
// Only exports core classes that work everywhere

// Core classes - work in all environments  
export { DeviceAccess } from './connectors/DeviceAccess';
export { UserAccess } from './connectors/UserAccess'; 
export { BruceHandler } from './connectors/BruceHandler';
export { login } from './connectors/login_manager';

// Essential types only - users can import more from /core if needed
export type { 
  LoginRequest, 
  LoginResponse
} from './connectors/login_manager';

export type {
  DeviceDataResponse
} from './connectors/DeviceAccess';

export type {
  UserDetailsResponse
} from './connectors/UserAccess';

// Note: For full type exports, use 'iosense-sdk/core'
// For PubSub features, use 'iosense-sdk/node' 