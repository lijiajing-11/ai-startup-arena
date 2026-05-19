/** Repo data from GitHub API */
export interface RepoData {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  license: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  homepage: string | null;
  defaultBranch: string;
}

/** A point in star history */
export interface StarPoint {
  date: string;
  stars: number;
}

/** Repo snapshot at a point in time (for watch command deltas) */
export interface RepoSnapshot {
  repo: RepoData;
  timestamp: Date;
}

/** Battle result between two repos */
export interface BattleResult {
  repo1: RepoSnapshot;
  repo2: RepoSnapshot;
  winner: 'repo1' | 'repo2' | 'tie';
  starDiff: number;
  forkDiff: number;
  issueDiff: number;
  scores: Record<string, string>;
}

/** CLI command options */
export interface WatchOptions {
  interval?: number; // seconds between polls (default: 30)
}

export interface BattleOptions {
  verbose?: boolean;
}

/** Repo owner/name parts from parsing "owner/name" */
export interface RepoIdentifier {
  owner: string;
  name: string;
}

/** GitHub API error with status code */
export interface GitHubApiError extends Error {
  status: number;
  response?: {
    data?: unknown;
    headers?: Record<string, string>;
  };
}

/** Retry configuration */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryable?: (status: number) => boolean;
}

/** Options for multi-repo watch */
export interface MultiWatchOptions {
  repos: string[];
  interval: number;
  json: boolean;
}

/** JSON-serializable snapshot for multi-repo --json output */
export interface JsonSnapshot {
  timestamp: string;
  repos: RepoData[];
}

/** JSON-serializable snapshot for single-repo --json output */
export interface SingleJsonSnapshot {
  timestamp: string;
  repo: RepoData;
}
