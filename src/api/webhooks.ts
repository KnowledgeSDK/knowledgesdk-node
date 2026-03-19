import { HttpClient } from '../utils/http-client';

export interface WebhookCreateOptions {
  url: string;
  events: string[];
  displayName?: string;
}

export interface WebhookFull {
  id: string;
  url: string;
  events: string[];
  displayName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class Webhooks {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Create a new webhook endpoint.
   * @param options The webhook creation options including URL, events, and optional display name
   * @returns The created webhook
   */
  async create(options: WebhookCreateOptions): Promise<WebhookFull> {
    return this.httpClient.post<WebhookFull>('/webhooks', options);
  }

  /**
   * List all registered webhooks.
   * @returns An array of all webhooks
   */
  async list(): Promise<WebhookFull[]> {
    return this.httpClient.get<WebhookFull[]>('/webhooks');
  }

  /**
   * Delete a webhook by ID.
   * @param webhookId The ID of the webhook to delete
   */
  async delete(webhookId: string): Promise<void> {
    return this.httpClient.delete<void>(`/webhooks/${webhookId}`);
  }

  /**
   * Send a test event to a webhook to verify it is working.
   * @param webhookId The ID of the webhook to test
   */
  async test(webhookId: string): Promise<void> {
    return this.httpClient.post<void>(`/webhooks/${webhookId}/test`);
  }
}
