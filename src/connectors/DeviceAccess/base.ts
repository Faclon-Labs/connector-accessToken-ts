import axios, { AxiosResponse } from 'axios';
import { MAX_RETRIES, RETRY_DELAY, DEVICE_DEFAULT_CURSOR_LIMIT, Protocol } from '../../utils/constants.js';

export abstract class DeviceAccessBase {
  protected dataUrl: string;
  protected accessToken: string;
  protected onPrem: boolean;
  protected tz: string;
  static readonly DEFAULT_CURSOR_LIMIT = DEVICE_DEFAULT_CURSOR_LIMIT;

  /**
   * Constructs a new DeviceAccess service instance.
   *
   * @param dataUrl - The backend server URL (e.g., 'appserver.iosense.io')
   * @param accessToken - The Bearer access token for Authorization
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'
   * @param tz - Optional timezone string (e.g., 'UTC', 'ICT'). Defaults to 'UTC'.
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
    this.tz = tz;
  }

  /**
   * Helper method to perform GET requests with retry logic.
   * @param url - The request URL
   * @param headers - The request headers
   * @returns The Axios response data or throws after max retries
   */
  public async requestWithRetry<T>(url: string, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.get<T>(url, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        // Exponential backoff between RETRY_DELAY[0] and RETRY_DELAY[1] seconds
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await new Promise(res => setTimeout(res, delay * 1000));
      }
    }
    throw lastError;
  }

  /**
   * Helper method to perform POST requests with retry logic.
   * @param url - The request URL
   * @param payload - The request payload
   * @param headers - The request headers
   * @returns The Axios response data or throws after max retries
   */
  public async postWithRetry<T>(url: string, payload: any, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.post<T>(url, payload, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await new Promise(res => setTimeout(res, delay * 1000));
      }
    }
    throw lastError;
  }

  /**
   * Helper method to perform PUT requests with retry logic.
   * @param url - The request URL
   * @param payload - The request payload
   * @param headers - The request headers
   * @returns The Axios response data or throws after max retries
   */
  public async putWithRetry<T>(url: string, payload: any, headers: Record<string, string>): Promise<T> {
    let attempt = 0;
    let lastError: any = null;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await axios.put<T>(url, payload, { headers });
        return response.data;
      } catch (error: any) {
        lastError = error;
        attempt++;
        if (attempt >= MAX_RETRIES) break;
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await new Promise(res => setTimeout(res, delay * 1000));
      }
    }
    throw lastError;
  }

  /**
   * Formats URL with protocol and replaces placeholders
   */
  public formatUrl(template: string, onPrem?: boolean): string {
    const protocol = (onPrem ?? this.onPrem) ? Protocol.HTTP : Protocol.HTTPS;
    return template
      .replace('{protocol}', protocol)
      .replace('{backend_url}', this.dataUrl);
  }

  /**
   * Creates standard headers for device API requests
   */
  public createHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      ...extraHeaders,
    };
  }

  /**
   * Getter for accessToken
   */
  public getAccessToken(): string {
    return this.accessToken;
  }

  /**
   * Getter for dataUrl
   */
  public getDataUrl(): string {
    return this.dataUrl;
  }

  /**
   * Getter for onPrem setting
   */
  public isOnPrem(): boolean {
    return this.onPrem;
  }

  /**
   * Getter for timezone
   */
  public getTimezone(): string {
    return this.tz;
  }

  /**
   * Converts various time formats to Unix timestamp.
   * @param time - Time value as string, number, or Date object
   * @returns Unix timestamp in seconds
   */
  public timeToUnix(time: string | number | Date): number {
    if (typeof time === 'number') {
      return time;
    }
    if (time instanceof Date) {
      return Math.floor(time.getTime() / 1000);
    }
    // Assume string format and try to parse
    const timestamp = Date.parse(time);
    if (isNaN(timestamp)) {
      throw new Error(`Invalid time format: ${time}`);
    }
    return Math.floor(timestamp / 1000);
  }
}