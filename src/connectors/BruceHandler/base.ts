import axios, { AxiosResponse } from 'axios';
import { MAX_RETRIES, RETRY_DELAY, DEVICE_DEFAULT_CURSOR_LIMIT, Protocol } from '../../utils/constants.js';

export abstract class BruceHandlerBase {
  protected dataUrl: string;
  protected accessToken: string;
  protected onPrem: boolean;
  protected tz: string;
  static readonly DEFAULT_CURSOR_LIMIT = DEVICE_DEFAULT_CURSOR_LIMIT;

  /**
   * Constructs a new BruceHandler service instance.
   * @param dataUrl - The backend server URL
   * @param accessToken - The Bearer access token for Authorization
   * @param onPrem - If true, uses 'http' protocol (on-premise); otherwise, uses 'https'
   * @param tz - Optional timezone string (defaults to 'UTC')
   */
  constructor(dataUrl: string, accessToken: string, onPrem: boolean, tz: string = 'UTC') {
    this.dataUrl = dataUrl;
    this.accessToken = accessToken;
    this.onPrem = onPrem;
    this.tz = tz;
  }

  /**
   * Formats error messages for failed HTTP requests.
   */
  protected errorMessage(response: AxiosResponse | undefined, url: string): string {
    if (!response) {
      return `\n[URL] ${url}\n[EXCEPTION] No response received`;
    }
    return `\n[STATUS CODE] ${response.status}\n[URL] ${url}\n[SERVER INFO] ${response.headers.server || 'Unknown Server'}\n[RESPONSE] ${response.data}`;
  }

  /**
   * Formats a URL template with protocol and dataUrl.
   */
  public formatUrl(template: string, onPrem?: boolean): string {
    const protocol = (onPrem ?? this.onPrem) ? Protocol.HTTP : Protocol.HTTPS;
    return template.replace('{protocol}', protocol).replace('{data_url}', this.dataUrl);
  }

  /**
   * Sleep helper for retry logic.
   */
  protected _sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        const delay = Math.min(RETRY_DELAY[0] * Math.pow(2, attempt - 1), RETRY_DELAY[1]);
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
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
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
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
        await this._sleep(delay * 1000);
      }
    }
    if (axios.isAxiosError(lastError)) {
      throw new Error(this.errorMessage(lastError.response, url));
    }
    throw lastError;
  }

  /**
   * Getter for accessToken
   */
  public getAccessToken(): string {
    return this.accessToken;
  }
} 