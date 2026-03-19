import { HttpClient } from '../utils/http-client';

export interface BusinessClassification {
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

export class Classify {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Classify a business by analyzing its website URL.
   * Returns a structured business profile with industry, target audience, and key insights.
   * @param url The URL of the business website to classify
   * @returns A structured business classification
   */
  async run(url: string): Promise<BusinessClassification> {
    return this.httpClient.post<BusinessClassification>('/classify', { url });
  }
}
