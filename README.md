<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://knowledgesdk.com/knowledgesdk_light.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://knowledgesdk.com/knowledgesdk_dark.svg" />
    <img src="https://knowledgesdk.com/knowledgesdk_dark.svg" alt="KnowledgeSDK" width="300" />
  </picture>
</p>

<p align="center">
  <b>Official TypeScript / Node.js SDK for <a href="https://knowledgesdk.com">KnowledgeSDK</a></b><br/>
  Extract structured knowledge from any website — business profiles, content, screenshots, sitemaps, and more.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@knowledgesdk/node">
    <img src="https://img.shields.io/npm/v/@knowledgesdk/node.svg?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://github.com/KnowledgeSDK/knowledgesdk-node/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/KnowledgeSDK/knowledgesdk-node.svg?style=flat-square" alt="License" />
  </a>
</p>

# KnowledgeSDK Node.js SDK

## What is KnowledgeSDK?

**KnowledgeSDK** is an API that turns any website into structured, searchable knowledge — built for developers, AI agents, and data pipelines.

- 🔍 **Extract** — Crawl & extract structured knowledge from any website
- 📄 **Scrape** — Convert any URL to clean Markdown
- 🏢 **Classify** — AI-powered business classification from a URL
- 📸 **Screenshot** — Full-page screenshots of any website
- 🗺️ **Sitemap** — Discover all URLs on a domain
- 🧠 **Search** — Semantic search across your extracted knowledge base

> [Get your API key](https://knowledgesdk.com/connect)

## Installation

```bash
npm install @knowledgesdk/node
```

```bash
yarn add @knowledgesdk/node
```

## Quick Start

```typescript
import { KnowledgeSDK } from '@knowledgesdk/node';

const client = new KnowledgeSDK('sk_ks_your_api_key');

// Run the full extraction pipeline on a website
const result = await client.extract.run('https://stripe.com');
console.log(result.business.businessName);
console.log(result.knowledgeItems);
```

## Authentication

All API calls require an API key. Keys are prefixed with `sk_ks_`. Pass your key to the constructor:

```typescript
const client = new KnowledgeSDK('sk_ks_your_api_key');
```

You can also set `KNOWLEDGE_SDK_API_KEY` as an environment variable and pass it explicitly:

```typescript
const client = new KnowledgeSDK(process.env.KNOWLEDGE_SDK_API_KEY!);
```

## Configuration

```typescript
const client = new KnowledgeSDK('sk_ks_your_api_key', {
  baseUrl: 'https://api.knowledgesdk.com',  // default
  maxRetries: 3,                             // default — retries on 429 and 5xx
  timeout: 30000,                            // default — 30 seconds
});
```

## Resources

### `extract`

Run the full pipeline against a URL: scrape, classify, and return structured knowledge items.

#### Synchronous

```typescript
const result = await client.extract.run('https://stripe.com', {
  maxPages: 20,
});

console.log(result.business.businessName);       // "Stripe"
console.log(result.business.industrySector);     // "Fintech"
console.log(result.business.confidenceScore);    // 0.92
console.log(result.pagesScraped);                // 18
console.log(result.sitemapUrls);                 // 54
console.log(result.knowledgeItems.length);       // 12

result.knowledgeItems.forEach((item) => {
  console.log(`[${item.category}] ${item.title}`);
  console.log(item.content);
});
```

**`ExtractResult` shape:**

```typescript
{
  business: {
    businessName: string;
    businessType: string;
    industrySector: string;
    targetAudience: string;
    description: string;
    valueProposition: string;
    painPoints: string[];
    uniqueSellingPoints: string[];
    keyInsights: string[];
    confidenceScore: number;    // 0-1
  };
  knowledgeItems: Array<{
    title: string;
    description: string;
    content: string;
    category: string;
    source: string;             // URL of source page
  }>;
  pagesScraped: number;
  sitemapUrls: number;
}
```

#### Asynchronous

For long-running extractions, use `runAsync` to get a job ID and poll for the result:

```typescript
const { jobId, status } = await client.extract.runAsync('https://stripe.com', {
  maxPages: 50,
  callbackUrl: 'https://your-server.com/webhooks/knowledgesdk',
});

// Poll until complete
const job = await client.jobs.poll(jobId, {
  intervalMs: 3000,   // check every 3 seconds
  timeoutMs: 300000,  // give up after 5 minutes
});

if (job.status === 'completed') {
  const result = job.result as ExtractResult;
  console.log(result.business.businessName);
}
```

---

### `scrape`

Scrape a single page and receive its content as Markdown along with metadata.

```typescript
const page = await client.scrape.run('https://stripe.com/pricing');

console.log(page.title);        // "Pricing & Fees — Stripe"
console.log(page.description);  // "Simple, transparent pricing..."
console.log(page.markdown);     // Full page content in Markdown
console.log(page.links);        // Array of hrefs found on the page
```

**`ScrapeResult` shape:**

```typescript
{
  url: string;
  markdown: string;
  title: string | null;
  description: string | null;
  links: string[];
}
```

---

### `classify`

Classify a business by analyzing its website. Returns a structured profile without scraping the full site.

```typescript
const classification = await client.classify.run('https://stripe.com');

console.log(classification.businessName);       // "Stripe"
console.log(classification.businessType);       // "B2B Software"
console.log(classification.industrySector);     // "Payments & Financial Infrastructure"
console.log(classification.targetAudience);     // "Developers and businesses of all sizes"
console.log(classification.valueProposition);   // "Financial infrastructure for the internet"
console.log(classification.painPoints);         // ["Complex payment integrations", "Global compliance"]
console.log(classification.uniqueSellingPoints); // ["Developer-first APIs", "Global payments"]
console.log(classification.confidenceScore);    // 0.89
```

---

### `screenshot`

Capture a full-page screenshot of any URL. Returns a base64-encoded PNG.

```typescript
const { url, screenshot } = await client.screenshot.run('https://stripe.com');

// Write to disk
import { writeFileSync } from 'fs';
const buffer = Buffer.from(screenshot, 'base64');
writeFileSync('screenshot.png', buffer);

// Or use inline in HTML
const dataUrl = `data:image/png;base64,${screenshot}`;
```

---

### `sitemap`

Discover all publicly accessible URLs for a website via its sitemap or by crawling.

```typescript
const { url, urls, count } = await client.sitemap.run('https://stripe.com');

console.log(`Found ${count} URLs`);
urls.forEach((u) => console.log(u));
```

**`SitemapResult` shape:**

```typescript
{
  url: string;
  urls: string[];
  count: number;
}
```

---

### `search`

Perform a semantic search across your indexed knowledge items.

```typescript
const results = await client.search.run('how do I cancel my subscription', {
  limit: 10,
});

console.log(`${results.total} results for "${results.query}"`);

results.hits.forEach((hit) => {
  console.log(`[score: ${hit.score.toFixed(2)}] ${hit.title}`);
  console.log(`Category: ${hit.category} | Source: ${hit.source}`);
  console.log(hit.content);
});
```

**`SearchResult` shape:**

```typescript
{
  hits: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    source: string;
    score: number;       // relevance score, higher is better
  }>;
  total: number;
  query: string;
}
```

---

### `webhooks`

Register webhook endpoints to receive real-time event notifications.

#### Create a webhook

```typescript
const webhook = await client.webhooks.create({
  url: 'https://your-server.com/webhooks/knowledgesdk',
  events: ['extract.completed', 'extract.failed'],
  displayName: 'My Production Webhook',
});

console.log(webhook.id);     // "wh_abc123"
console.log(webhook.status); // "active"
```

#### List webhooks

```typescript
const webhooks = await client.webhooks.list();
webhooks.forEach((wh) => {
  console.log(`${wh.id}: ${wh.url} — ${wh.status}`);
});
```

#### Delete a webhook

```typescript
await client.webhooks.delete('wh_abc123');
```

#### Test a webhook

Send a test payload to verify your endpoint is reachable:

```typescript
await client.webhooks.test('wh_abc123');
```

---

### `jobs`

Retrieve or poll the result of an asynchronous job.

#### Get a job by ID

```typescript
const job = await client.jobs.get('job_abc123');

console.log(job.status);      // 'pending' | 'processing' | 'completed' | 'failed'
console.log(job.createdAt);
console.log(job.completedAt);
```

#### Poll until complete

```typescript
import { TimeoutError } from '@knowledgesdk/node';

try {
  const job = await client.jobs.poll('job_abc123', {
    intervalMs: 2000,    // poll every 2 seconds (default)
    timeoutMs: 120000,   // give up after 2 minutes (default)
  });

  if (job.status === 'completed') {
    console.log('Job completed:', job.result);
  } else {
    console.error('Job failed:', job.error);
  }
} catch (err) {
  if (err instanceof TimeoutError) {
    console.error('Job timed out — try polling again later');
  }
}
```

---

## Error Handling

All errors extend `KnowledgeSDKError` and carry structured metadata.

```typescript
import {
  KnowledgeSDK,
  KnowledgeSDKError,
  APIError,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  TimeoutError,
} from '@knowledgesdk/node';

const client = new KnowledgeSDK('sk_ks_your_api_key');

try {
  const result = await client.extract.run('https://stripe.com');
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.error('Invalid API key:', err.message);
  } else if (err instanceof RateLimitError) {
    console.error('Rate limit hit. Retry after:', err.retryAfter);
  } else if (err instanceof TimeoutError) {
    console.error('Request timed out:', err.message);
  } else if (err instanceof NetworkError) {
    console.error('Network error:', err.message);
  } else if (err instanceof APIError) {
    console.error(`API error ${err.statusCode}:`, err.message);
    console.error('Error code:', err.code);
    console.error('Request ID:', err.requestId);
  } else if (err instanceof KnowledgeSDKError) {
    console.error('KnowledgeSDK error:', err.message);
  } else {
    throw err;
  }
}
```

### Error Classes

| Class | Description |
|---|---|
| `KnowledgeSDKError` | Base class for all SDK errors |
| `APIError` | 4xx/5xx responses from the API |
| `AuthenticationError` | Missing or invalid API key (401) |
| `NetworkError` | Network connectivity issues |
| `RateLimitError` | API rate limit exceeded (429) |
| `TimeoutError` | Request or job polling timed out |

All errors expose:
- `message` — human-readable description
- `statusCode` — HTTP status code (where applicable)
- `code` — machine-readable error code
- `requestId` — request ID from the API (for support)
- `data` — raw response body (where available)

---

## Debug Mode

Enable request/response logging for development:

```typescript
const client = new KnowledgeSDK('sk_ks_your_api_key');
client.setDebugMode(true);

// All requests and responses will now be printed to the console
const result = await client.scrape.run('https://stripe.com');
```

---

## Advanced Usage

### Custom headers

```typescript
client.setHeaders({
  'x-custom-header': 'my-value',
  'x-trace-id': requestId,
});
```

### Retry configuration

By default the SDK retries up to 3 times on rate-limit (429) and server errors (5xx) using exponential backoff with jitter. Configure at construction:

```typescript
const client = new KnowledgeSDK('sk_ks_your_api_key', {
  maxRetries: 5,
  timeout: 60000, // 60 seconds
});
```

### Full async extraction workflow

```typescript
import { KnowledgeSDK, ExtractResult, TimeoutError } from '@knowledgesdk/node';

const client = new KnowledgeSDK(process.env.KNOWLEDGE_SDK_API_KEY!);

async function extractWebsite(url: string): Promise<ExtractResult> {
  // Kick off async job
  const { jobId } = await client.extract.runAsync(url, {
    maxPages: 100,
    callbackUrl: 'https://your-server.com/webhooks/knowledgesdk',
  });

  console.log(`Started job ${jobId}, polling for result...`);

  // Poll until complete (up to 10 minutes)
  const job = await client.jobs.poll(jobId, {
    intervalMs: 5000,
    timeoutMs: 600000,
  });

  if (job.status === 'failed') {
    throw new Error(`Extraction failed: ${job.error}`);
  }

  return job.result as ExtractResult;
}

const result = await extractWebsite('https://shopify.com');
console.log(`Extracted ${result.knowledgeItems.length} knowledge items`);
```

---

## TypeScript

The SDK is written in TypeScript and exports all types. No additional `@types` package is required.

```typescript
import type {
  ExtractResult,
  ExtractOptions,
  ExtractAsyncResult,
  KnowledgeItem,
  BusinessProfile,
  ScrapeResult,
  BusinessClassification,
  ScreenshotResult,
  SitemapResult,
  SearchResult,
  SearchHit,
  WebhookFull,
  WebhookCreateOptions,
  JobResult,
  JobStatus,
  KnowledgeSDKOptions,
} from '@knowledgesdk/node';
```

---

## Documentation

Full API reference → **[knowledgesdk.com/docs](https://knowledgesdk.com/docs)**

---

## Prefer the REST API?

You can call the KnowledgeSDK API directly without this SDK. Full REST reference and language-agnostic guides at **[knowledgesdk.com/docs](https://knowledgesdk.com/docs)**

## Contributing

We ❤️ PRs!

1. **Fork** → `git checkout -b feat/awesome`
2. Add tests & docs
3. **PR** against `main`

## License

[MIT](LICENSE)
