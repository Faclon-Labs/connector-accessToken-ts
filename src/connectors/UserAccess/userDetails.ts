import { USER_DETAILS_URL } from '../../utils/constants.js';
import { UserAccessBase } from './base.js';
import { UserDetailsHeaders, UserDetailsResponse } from './types.js';

/**
 * Handler for user profile operations.
 * Uses UserAccessBase for URL formatting, headers and retries.
 */
export class UserDetailsHandler {
  private base: UserAccessBase;

  /**
   * Constructs a UserDetailsHandler.
   * @param base Shared base providing configuration and HTTP helpers.
   */
  constructor(base: UserAccessBase) {
    this.base = base;
  }

  /**
   * Fetches details of the authenticated user.
   * @param extraHeaders Optional additional HTTP headers to merge with defaults.
   * @returns User details payload or null on failure.
   */
  async getUserDetails(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserDetailsResponse | null> {
    const url = this.base.formatUrl(USER_DETAILS_URL);
    const headers: UserDetailsHeaders = this.base.createHeaders(extraHeaders);

    try {
      const response = await this.base.requestWithRetry<UserDetailsResponse>(url, headers);
      return response;
    } catch (error: any) {
      console.error('User details error:', error);
      return null;
    }
  }
}