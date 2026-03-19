import { HttpClient } from '../utils/http-client';

export interface ScreenshotResult {
  url: string;
  screenshot: string; // base64-encoded PNG
}

export class Screenshot {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Capture a full-page screenshot of a URL.
   * @param url The URL to screenshot
   * @returns The original URL and a base64-encoded PNG screenshot
   */
  async run(url: string): Promise<ScreenshotResult> {
    return this.httpClient.post<ScreenshotResult>('/screenshot', { url });
  }
}
