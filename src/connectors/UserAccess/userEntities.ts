import { USER_ENTITIES_URL, USER_ENTITY_FETCH_URL } from '../../utils/constants.js';
import { UserAccessBase } from './base.js';
import { UserDetailsHeaders, UserEntitiesResponse, UserEntityFetchResponse } from './types.js';

/**
 * Handler for user entities operations.
 * Provides APIs to fetch routes and entity metadata for the authenticated user.
 */
export class UserEntitiesHandler {
  private base: UserAccessBase;

  /**
   * Constructs a UserEntitiesHandler.
   * @param base Shared base providing configuration and HTTP helpers.
   */
  constructor(base: UserAccessBase) {
    this.base = base;
  }

  /**
   * Retrieves the list of routes/entities available to the user.
   * @param extraHeaders Optional additional HTTP headers to merge with defaults.
   * @returns Entities payload or null on failure.
   */
  async getUserEntities(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserEntitiesResponse | null> {
    const url = this.base.formatUrl(USER_ENTITIES_URL);
    const headers: UserDetailsHeaders = this.base.createHeaders(extraHeaders);

    try {
      const response = await this.base.requestWithRetry<UserEntitiesResponse>(url, headers);
      return response;
    } catch (error: any) {
      console.error('User entities error:', error);
      return null;
    }
  }

  /**
   * Retrieves the full entity structure (routes tree) for the user.
   * @param extraHeaders Optional additional HTTP headers to merge with defaults.
   * @returns Entity fetch payload or null on failure.
   */
  async getUserEntityFetch(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserEntityFetchResponse | null> {
    const url = this.base.formatUrl(USER_ENTITY_FETCH_URL);
    const headers: UserDetailsHeaders = this.base.createHeaders(extraHeaders);

    try {
      const response = await this.base.requestWithRetry<UserEntityFetchResponse>(url, headers);
      return response;
    } catch (error: any) {
      console.error('User entity fetch error:', error);
      return null;
    }
  }
}