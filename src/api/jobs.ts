import { HttpClient } from '../utils/http-client';
import { TimeoutError } from '../errors';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface JobResult {
  jobId: string;
  status: JobStatus;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PollOptions {
  /** Interval in milliseconds between status checks. Defaults to 2000ms. */
  intervalMs?: number;
  /** Maximum time in milliseconds to wait before throwing a TimeoutError. Defaults to 120000ms (2 minutes). */
  timeoutMs?: number;
}

export class Jobs {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get the current status and result of an async job.
   * @param jobId The job ID returned from an async operation (e.g. extract.runAsync)
   * @returns The current job status and result if completed
   */
  async get(jobId: string): Promise<JobResult> {
    return this.httpClient.get<JobResult>(`/jobs/${jobId}`);
  }

  /**
   * Poll a job until it completes or fails, then return the result.
   * Throws a TimeoutError if the job does not complete within the timeout window.
   * @param jobId The job ID to poll
   * @param options Optional polling configuration
   * @returns The final job result once status is 'completed' or 'failed'
   */
  async poll(jobId: string, options?: PollOptions): Promise<JobResult> {
    const intervalMs = options?.intervalMs ?? 2000;
    const timeoutMs = options?.timeoutMs ?? 120000;

    const startTime = Date.now();

    while (true) {
      const job = await this.get(jobId);

      if (job.status === 'completed' || job.status === 'failed') {
        return job;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed + intervalMs >= timeoutMs) {
        throw new TimeoutError(
          `Job ${jobId} did not complete within ${timeoutMs}ms. Last status: ${job.status}`,
          { code: 'job_timeout', data: { jobId, status: job.status } }
        );
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}
