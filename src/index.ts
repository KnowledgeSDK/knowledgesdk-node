import { Extract } from './api/extract';
import { Scrape } from './api/scrape';
import { Classify } from './api/classify';
import { Screenshot } from './api/screenshot';
import { Sitemap } from './api/sitemap';
import { Search } from './api/search';
import { Webhooks } from './api/webhooks';
import { Jobs } from './api/jobs';
import { HttpClient } from './utils/http-client';
import {
  KnowledgeSDKError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from './errors';
import { DEFAULT_BASE_URL, DEFAULT_MAX_RETRIES, DEFAULT_TIMEOUT, DEFAULT_API_VERSION } from './constants';

export interface KnowledgeSDKOptions {
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
  apiVersion?: string;
}

export class KnowledgeSDK {
  /**
   * The Extract resource — full pipeline extraction (sync and async)
   */
  public readonly extract: Extract;

  /**
   * The Scrape resource — single-page scraping to Markdown
   */
  public readonly scrape: Scrape;

  /**
   * The Classify resource — business classification from a URL
   */
  public readonly classify: Classify;

  /**
   * The Screenshot resource — full-page screenshots as base64 PNG
   */
  public readonly screenshot: Screenshot;

  /**
   * The Sitemap resource — URL discovery via sitemap crawling
   */
  public readonly sitemap: Sitemap;

  /**
   * The Search resource — semantic search across indexed knowledge items
   */
  public readonly search: Search;

  /**
   * The Webhooks resource — manage webhook endpoints
   */
  public readonly webhooks: Webhooks;

  /**
   * The Jobs resource — retrieve and poll async job results
   */
  public readonly jobs: Jobs;

  private httpClient: HttpClient;

  /**
   * Create a new KnowledgeSDK client instance.
   *
   * @param apiKey Your KnowledgeSDK API key (must start with 'sk_ks_')
   * @param options Optional configuration for the client
   *
   * @example
   * ```typescript
   * import { KnowledgeSDK } from '@knowledge/node';
   *
   * const client = new KnowledgeSDK('sk_ks_your_api_key');
   * ```
   */
  constructor(apiKey: string, options: KnowledgeSDKOptions = {}) {
    if (!apiKey) {
      throw new AuthenticationError('API key is required', {
        code: 'api_key_required',
      });
    }

    if (!apiKey.startsWith('sk_ks_')) {
      throw new AuthenticationError(
        'Invalid API key format. Keys must start with sk_ks_',
        { code: 'invalid_api_key_format' }
      );
    }

    // Initialize the HTTP client
    this.httpClient = new HttpClient(
      apiKey,
      options.baseUrl || DEFAULT_BASE_URL,
      options.maxRetries ?? DEFAULT_MAX_RETRIES,
      options.timeout ?? DEFAULT_TIMEOUT,
      options.apiVersion || DEFAULT_API_VERSION
    );

    // Initialize API resources
    this.extract = new Extract(this.httpClient);
    this.scrape = new Scrape(this.httpClient);
    this.classify = new Classify(this.httpClient);
    this.screenshot = new Screenshot(this.httpClient);
    this.sitemap = new Sitemap(this.httpClient);
    this.search = new Search(this.httpClient);
    this.webhooks = new Webhooks(this.httpClient);
    this.jobs = new Jobs(this.httpClient);
  }

  /**
   * Set custom headers to be included with every request
   * @param headers Record of header names and values
   * @returns The KnowledgeSDK instance for chaining
   */
  setHeaders(headers: Record<string, string>): KnowledgeSDK {
    this.httpClient.setHeaders(headers);
    return this;
  }

  /**
   * Set a specific custom header
   * @param name Header name
   * @param value Header value
   * @returns The KnowledgeSDK instance for chaining
   */
  setHeader(name: string, value: string): KnowledgeSDK {
    this.httpClient.setHeader(name, value);
    return this;
  }

  /**
   * Enable or disable debug mode.
   * When enabled, all requests and responses will be logged to the console.
   * @param enabled Whether debug mode should be enabled
   * @returns The KnowledgeSDK instance for chaining
   */
  setDebugMode(enabled: boolean): KnowledgeSDK {
    this.httpClient.setDebugMode(enabled);
    return this;
  }

  /**
   * Set the API version to use for requests
   * @param version API version string (e.g., 'v1', 'v2')
   * @returns The KnowledgeSDK instance for chaining
   */
  setApiVersion(version: string): KnowledgeSDK {
    this.httpClient.setApiVersion(version);
    return this;
  }
}

// Re-export error classes
export {
  KnowledgeSDKError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
};

// Re-export constants
export { DEFAULT_BASE_URL, DEFAULT_MAX_RETRIES, DEFAULT_TIMEOUT } from './constants';

// Re-export resource types
export type { ExtractResult, ExtractOptions, ExtractAsyncOptions, ExtractAsyncResult, ExtractStreamOptions, ExtractStreamEvent, KnowledgeItem, BusinessProfile } from './api/extract';
export type { ScrapeResult } from './api/scrape';
export type { BusinessClassification } from './api/classify';
export type { ScreenshotResult } from './api/screenshot';
export type { SitemapResult } from './api/sitemap';
export type { SearchResult, SearchHit, SearchOptions } from './api/search';
export type { WebhookFull, WebhookCreateOptions } from './api/webhooks';
export type { JobResult, JobStatus, PollOptions } from './api/jobs';
