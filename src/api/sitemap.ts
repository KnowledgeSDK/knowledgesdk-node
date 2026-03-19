import { HttpClient } from '../utils/http-client';

export interface SitemapResult {
  url: string;
  urls: string[];
  count: number;
}

export class Sitemap {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Discover all URLs for a given website by crawling its sitemap(s).
   * Falls back to crawling the site if no sitemap.xml is found.
   * @param url The root URL of the website
   * @returns The root URL, a list of discovered URLs, and the total count
   */
  async run(url: string): Promise<SitemapResult> {
    return this.httpClient.post<SitemapResult>('/sitemap', { url });
  }
}
