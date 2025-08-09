import { USER_QUOTA_URL } from '../../utils/constants.js';
import { UserAccessBase } from './base.js';
import { UserDetailsHeaders, UserQuotaResponse } from './types.js';

/**
 * Handler for user quota operations.
 * Uses UserAccessBase for URL formatting, headers and retries.
 */
export class UserQuotaHandler {
  private base: UserAccessBase;

  /**
   * Constructs a UserQuotaHandler.
   * @param base Shared base providing configuration and HTTP helpers.
   */
  constructor(base: UserAccessBase) {
    this.base = base;
  }

  /**
   * Retrieves quota information for the authenticated user.
   * @param extraHeaders Optional additional HTTP headers to merge with defaults.
   * @returns Quota payload or null on failure.
   */
  async getUserQuota(extraHeaders: Partial<UserDetailsHeaders> = {}): Promise<UserQuotaResponse | null> {
    const url = this.base.formatUrl(USER_QUOTA_URL);
    const headers: UserDetailsHeaders = this.base.createHeaders(extraHeaders);

    try {
      const response = await this.base.requestWithRetry<UserQuotaResponse>(url, headers);
      return response;
    } catch (error: any) {
      console.error('User quota error:', error);
      return null;
    }
  }
}