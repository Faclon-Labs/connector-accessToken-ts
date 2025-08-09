/**
 * UserAccess orchestrator composing userDetails, userQuota and userEntities handlers.
 * See individual handlers for detailed API shapes and examples.
 */
import { UserAccessBase } from './base.js';
import { UserDetailsHandler } from './userDetails.js';
import { UserQuotaHandler } from './userQuota.js';
import { UserEntitiesHandler } from './userEntities.js';
import type {
  UserDetailsHeaders,
  UserDetailsResponse,
  UserQuotaResponse,
  UserEntitiesResponse,
  UserEntityFetchResponse,
} from './types.js';

/**
 * Orchestrator for UserAccess APIs.
 *
 * Delegates to focused handler classes while sharing a common base
 * for URL formatting, headers and request retry behavior.
 */
export class UserAccess extends UserAccessBase {
  private userDetailsHandler: UserDetailsHandler;
  private userQuotaHandler: UserQuotaHandler;
  private userEntitiesHandler: UserEntitiesHandler;

  /**
   * Creates a new UserAccess instance.
   * @param dataUrl Backend hostname (e.g., 'connector.iosense.io').
   * @param accessToken Bearer token used for Authorization header.
   * @param onPrem If true, uses http; otherwise https.
   * @param tz Optional timezone string, defaults to 'UTC'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    super(dataUrl, accessToken, onPrem, tz);
    this.userDetailsHandler = new UserDetailsHandler(this);
    this.userQuotaHandler = new UserQuotaHandler(this);
    this.userEntitiesHandler = new UserEntitiesHandler(this);
  }

  /**
   * Fetches user profile details.
   * @param extraHeaders Optional headers to merge with defaults.
   */
  async getUserDetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    return this.userDetailsHandler.getUserDetails(extraHeaders);
  }

  /**
   * Retrieves user quota information.
   * @param extraHeaders Optional headers to merge with defaults.
   */
  async getUserQuota(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserQuotaResponse | null> {
    return this.userQuotaHandler.getUserQuota(extraHeaders);
  }

  /**
   * Retrieves available user entities/routes.
   * @param extraHeaders Optional headers to merge with defaults.
   */
  async getUserEntities(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserEntitiesResponse | null> {
    return this.userEntitiesHandler.getUserEntities(extraHeaders);
  }

  /**
   * Retrieves full entity structure for the user.
   * @param extraHeaders Optional headers to merge with defaults.
   */
  async getUserEntityFetch(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserEntityFetchResponse | null> {
    return this.userEntitiesHandler.getUserEntityFetch(extraHeaders);
  }

  /**
   * @deprecated Use getUserDetails() instead.
   */
  async userdetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    // eslint-disable-next-line no-console
    console.warn('userdetails() is deprecated. Use getUserDetails() instead.');
    return this.getUserDetails(extraHeaders);
  }
}

export * from './types.js';
