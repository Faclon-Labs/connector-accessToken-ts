import axios from 'axios';
import { Protocol } from '../../utils/constants.js';

/**
 * Base class providing shared configuration and HTTP utilities for UserAccess handlers.
 *
 * Exposes helpers for URL formatting, header creation (with undefined filtering),
 * and a lightweight GET-with-retry mechanism tailored for UserAccess endpoints.
 */
export abstract class UserAccessBase {
  protected dataUrl: string;
  protected accessToken: string;
  protected onPrem: boolean;
  protected tz: string;

  /**
   * Creates a new base context.
   * @param dataUrl Backend hostname (e.g., 'connector.iosense.io').
   * @param accessToken Bearer token used for Authorization header.
   * @param onPrem If true, uses http; otherwise https.
   * @param tz Timezone identifier used by callers for time-sensitive logic. Defaults to 'UTC'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
    this.tz = tz;
  }

  /**
   * Formats a URL template by injecting protocol and backend host.
   * @param template URL template containing {protocol} and {backend_url} placeholders.
   * @param onPrem Optional override for on-prem protocol selection.
   * @returns Fully formatted absolute URL.
   */
  public formatUrl(template: string, onPrem?: boolean): string {
    const protocol = (onPrem ?? this.onPrem) ? Protocol.HTTP : Protocol.HTTPS;
    return template
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);
  }

  /**
   * Builds request headers ensuring all values are strings (filters out undefined).
   * @param extraHeaders Optional additional headers.
   * @returns A Record<string, string> ready for HTTP requests.
   */
  public createHeaders(extraHeaders: Partial<Record<string, string>> = {}): Record<string, string> {
    const merged: Record<string, string | undefined> = {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
    // Filter undefined values to satisfy Record<string, string>
    const filteredEntries = Object.entries(merged).filter(([, v]) => v !== undefined) as Array<[
      string,
      string
    ]>;
    return Object.fromEntries(filteredEntries);
  }

  /**
   * Performs a GET request with simple retry behavior.
   * @param url The target URL.
   * @param headers Request headers.
   * @typeParam T Expected response body type.
   * @throws Last encountered error after exhausting retries.
   */
  public async requestWithRetry<T>(url: string, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    // conservative retries specific to UserAccess endpoints
    const maxRetries = 5;
    const delayMs = 1000;
    while (attempt < maxRetries) {
      try {
        const response = await axios.get<T>(url, { headers });
        return response.data as T;
      } catch (error) {
        lastError = error;
        attempt += 1;
        if (attempt >= maxRetries) break;
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
    throw lastError;
  }

  /**
   * Returns current access token.
   */
  public getAccessToken(): string {
    return this.accessToken;
  }

  /**
   * Returns backend hostname.
   */
  public getDataUrl(): string {
    return this.dataUrl;
  }

  /**
   * Indicates if on-prem protocol should be used.
   */
  public isOnPrem(): boolean {
    return this.onPrem;
  }

  /**
   * Returns configured timezone identifier.
   */
  public getTimezone(): string {
    return this.tz;
  }
}