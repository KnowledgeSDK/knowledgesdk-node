import { HttpClient } from '../utils/http-client';

export interface SearchHit {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  score: number;
}

export interface SearchResult {
  hits: SearchHit[];
  total: number;
  query: string;
}

export interface SearchOptions {
  limit?: number;
  apiKeyId?: string;
}

export class Search {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Search across indexed knowledge items using a natural language query.
   * @param query The search query string
   * @param options Optional search parameters including result limit and API key ID filter
   * @returns Matching knowledge items ranked by relevance score
   */
  async run(query: string, options?: SearchOptions): Promise<SearchResult> {
    return this.httpClient.post<SearchResult>('/search', {
      query,
      ...options,
    });
  }
}
