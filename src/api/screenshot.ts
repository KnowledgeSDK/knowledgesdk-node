import { HttpClient } from '../utils/http-client';

export type ViewportPreset = 'mobile' | 'tablet' | 'desktop' | 'desktop_hd';

export type ScreenshotWaitUntil = 'load' | 'dom_content_loaded' | 'network_idle';

export interface ScreenshotCookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
}

export interface ScreenshotWaitOptions {
  until?: ScreenshotWaitUntil;
  selector?: string;
  delayMs?: number;
  timeoutMs?: number;
}

export interface ScreenshotOptions {
  /** Viewport preset or custom { width, height }. Default: "desktop" (1280x800). */
  viewport?: ViewportPreset | { width: number; height: number };
  /** Capture full scrollable height. Default: false. When true, viewport height is ignored. */
  fullPage?: boolean;
  /** Element-only capture via CSS selector. */
  capture?: { selector?: string };
  /** Wait rules before capture. */
  wait?: ScreenshotWaitOptions;
  /** Custom headers forwarded to the target site. Up to 20. */
  headers?: Record<string, string>;
  /** Auth cookies forwarded to the target site. Up to 50. */
  auth?: { cookies?: ScreenshotCookie[] };
}

export interface ScreenshotResult {
  runId: string;
  url: string;
  /** Public CDN URL of the PNG. Permanent and immutable — safe to embed. */
  screenshotUrl: string;
  mimeType: string;
  bytes: number;
  durationMs: number;
}

export class Screenshot {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Capture a screenshot of a URL and return a public CDN URL of the PNG.
   *
   * @example
   * // Simplest case — desktop default
   * await ks.screenshot.run("https://example.com");
   *
   * @example
   * // Mobile preview
   * await ks.screenshot.run("https://stripe.com", { viewport: "mobile" });
   *
   * @example
   * // Full-page authenticated capture
   * await ks.screenshot.run("https://app.example.com/billing", {
   *   viewport: "desktop_hd",
   *   fullPage: true,
   *   auth: { cookies: [{ name: "session", value: "abc123", domain: "app.example.com" }] },
   *   wait: { until: "network_idle" },
   * });
   */
  async run(url: string, options?: ScreenshotOptions): Promise<ScreenshotResult> {
    return this.httpClient.post<ScreenshotResult>('/screenshot', { url, ...options });
  }
}
