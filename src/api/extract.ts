import { HttpClient } from '../utils/http-client';

export interface KnowledgeItem {
  title: string;
  description: string;
  content: string;
  category: string;
  source: string;
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  industrySector: string;
  targetAudience: string;
  description: string;
  valueProposition: string;
  painPoints: string[];
  uniqueSellingPoints: string[];
  keyInsights: string[];
  confidenceScore: number;
}

export interface ExtractResult {
  business: BusinessProfile;
  knowledgeItems: KnowledgeItem[];
  pagesScraped: number;
  sitemapUrls: number;
}

export interface ExtractOptions {
  maxPages?: number;
}

export interface ExtractStreamOptions {
  maxPages?: number;
}

export type ExtractStreamEvent =
  | { type: 'connected'; message: string }
  | { type: 'progress'; message: string }
  | { type: 'business_classified'; business: { businessName: string; businessType: string; industry: string; description: string } }
  | { type: 'pages_planned'; pages: Array<{ url: string; purpose: string }> }
  | { type: 'page_scraped'; url: string; index: number; total: number; status: 'done' | 'failed' }
  | { type: 'urls_triaged'; suggestedUrls: Array<{ url: string; reason: string }> }
  | { type: 'complete'; result: ExtractResult }
  | { type: 'error'; message: string };

export interface ExtractAsyncOptions {
  maxPages?: number;
  callbackUrl?: string;
}

export interface ExtractAsyncResult {
  jobId: string;
  status: string;
}

export class Extract {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Run a synchronous extraction pipeline against a URL.
   * Scrapes the site, classifies the business, and returns structured knowledge items.
   * @param url The URL to extract knowledge from
   * @param options Optional extraction options
   * @returns The full extraction result including business profile and knowledge items
   */
  async run(url: string, options?: ExtractOptions): Promise<ExtractResult> {
    return this.httpClient.post<ExtractResult>('/business', {
      url,
      ...options,
    });
  }

  /**
   * Start an asynchronous extraction pipeline and return a job ID.
   * Use jobs.poll() or jobs.get() to retrieve the result when complete.
   * @param url The URL to extract knowledge from
   * @param options Optional async extraction options including a callbackUrl
   * @returns The job ID and initial status
   */
  async runAsync(url: string, options?: ExtractAsyncOptions): Promise<ExtractAsyncResult> {
    return this.httpClient.post<ExtractAsyncResult>('/business/async', {
      url,
      ...options,
    });
  }

  /**
   * Stream extraction progress as server-sent events.
   * Yields typed events as the pipeline runs: classification, page discovery,
   * per-page scraping, and the final complete result.
   * Requires Node.js 18+ (native fetch).
   *
   * @example
   * ```typescript
   * for await (const event of client.extract.runStream('https://stripe.com')) {
   *   if (event.type === 'page_scraped') {
   *     console.log(`Scraped ${event.index + 1}/${event.total}: ${event.url}`);
   *   }
   *   if (event.type === 'complete') {
   *     console.log(event.result.knowledgeItems);
   *   }
   * }
   * ```
   */
  async *runStream(url: string, options?: ExtractStreamOptions): AsyncGenerator<ExtractStreamEvent> {
    yield* this.httpClient.streamPost<ExtractStreamEvent>('/business/stream', {
      url,
      ...options,
    });
  }
}
