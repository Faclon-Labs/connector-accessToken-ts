/**
 * UserAccess module public API.
 * Re-exports orchestrator, base, handlers, and types for convenience.
 */
// Main UserAccess orchestrator
export { UserAccess } from './UserAccess.js';

// Base
export { UserAccessBase } from './base.js';

// Handlers
export { UserDetailsHandler } from './userDetails.js';
export { UserQuotaHandler } from './userQuota.js';
export { UserEntitiesHandler } from './userEntities.js';

// Types
export * from './types.js';