import { HttpClient } from '../utils/http-client';

export interface ScrapeResult {
  url: string;
  markdown: string;
  title: string | null;
  description: string | null;
  links: string[];
}

export class Scrape {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Scrape a single URL and return its content as Markdown along with metadata.
   * @param url The URL to scrape
   * @returns The scraped content including markdown, title, description and extracted links
   */
  async run(url: string): Promise<ScrapeResult> {
    return this.httpClient.post<ScrapeResult>('/scrape', { url });
  }
}
