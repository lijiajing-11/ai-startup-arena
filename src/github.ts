import { Octokit } from '@octokit/rest';
import type { RepoData, StarPoint } from './models.js';

// ── Cache ────────────────────────────────────────────────────────────────
const cache = new Map<string, { data: RepoData; timestamp: number }>();
const CACHE_TTL = 60_000; // 60 seconds

// ── Retry helper ─────────────────────────────────────────────────────────
interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryable?: (status: number) => boolean;
}

const DEFAULT_RETRY: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 1_000,
  maxDelayMs: 15_000,
  // 429 (rate limit), 5xx (server errors), and network errors (status=0)
  retryable: (status: number) => status === 429 || status >= 500 || status === 0,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, retryable } = {
    ...DEFAULT_RETRY,
    ...options,
  };

  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? 0;

      if (attempt === maxAttempts || !retryable(status)) {
        throw err;
      }

      // Exponential backoff with jitter
      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const jitter = Math.random() * 0.3 * delay;
      console.warn(
        `⏳ GitHub API error (${status}), retrying in ${Math.round((delay + jitter) / 1000)}s... (attempt ${attempt}/${maxAttempts})`
      );
      await sleep(delay + jitter);
    }
  }

  // TS exhaustiveness — unreachable because loop always throws on last attempt
  throw lastErr;
}

// ── GitHub client ────────────────────────────────────────────────────────
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    return new Octokit({ auth: token, userAgent: 'repo-sense/0.2.0' });
  }
  return new Octokit({ userAgent: 'repo-sense/0.2.0' });
}

function parseRepo(repo: string): { owner: string; name: string } {
  const parts = repo.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(`Invalid repo format: "${repo}". Use "owner/name" format (e.g., "facebook/react")`);
  }
  return { owner: parts[0], name: parts[1] };
}

function getCacheKey(owner: string, name: string): string {
  return `${owner}/${name}`;
}

// ── Public API ───────────────────────────────────────────────────────────
export async function getRepo(repoStr: string): Promise<RepoData> {
  const { owner, name } = parseRepo(repoStr);
  const cacheKey = getCacheKey(owner, name);
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const octokit = getOctokit();
  const [repoResponse, topicsResponse] = await withRetry(async () => {
    const [repoData, topicsData] = await Promise.all([
      octokit.rest.repos.get({ owner, repo: name }),
      octokit.rest.repos.getAllTopics({ owner, repo: name }),
    ]);
    return [repoData, topicsData] as const;
  });

  const { data } = repoResponse;
  const { data: topicsData } = topicsResponse;

  const repoData: RepoData = {
    owner,
    name,
    fullName: data.full_name,
    description: data.description,
    language: data.language,
    license: data.license?.spdx_id ?? null,
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    pushedAt: data.pushed_at,
    topics: topicsData.names ?? [],
    homepage: data.homepage,
    defaultBranch: data.default_branch,
  };

  cache.set(cacheKey, { data: repoData, timestamp: now });
  return repoData;
}

export async function getStarHistory(repoStr: string, points: number = 10): Promise<StarPoint[]> {
  const repo = await getRepo(repoStr);

  const created = new Date(repo.createdAt);
  const now = new Date();
  const totalStars = repo.stars;
  const totalDays = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  // Estimate star history based on linear time distribution
  // (GitHub doesn't expose star timestamps via REST, so this is a best-effort estimate)
  const history: StarPoint[] = [];
  for (let i = 0; i < points; i++) {
    const fraction = (i + 1) / points;
    const date = new Date(created.getTime() + (now.getTime() - created.getTime()) * fraction);
    const estimatedStars = Math.round(totalStars * fraction);
    history.push({
      date: date.toISOString().split('T')[0],
      stars: estimatedStars,
    });
  }

  return history;
}

// ── Display helpers ──────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return sign + (abs / 1_000_000).toFixed(1) + 'M';
  if (abs >= 1_000) return sign + (abs / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function formatDelta(current: number, previous: number): string {
  const diff = current - previous;
  if (diff > 0) return `+${diff}`;
  if (diff < 0) return `${diff}`;
  return '0';
}

export function clearCache(): void {
  cache.clear();
}

/**
 * Batch-fetch multiple repos in parallel.
 * Returns results in the same order as the input strings.
 */
export async function getRepos(repoStrs: string[]): Promise<RepoData[]> {
  const results = await Promise.allSettled(
    repoStrs.map((r) => getRepo(r))
  );
  return results.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }
    return r.value;
  });
}

// Export for testing
export { parseRepo, cache as _cache };
