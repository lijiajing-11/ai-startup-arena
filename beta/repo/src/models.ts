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
export interface JsonSnapshot {
  timestamp: string;
  repos: RepoData[];
}

/** JSON-serializable snapshot for single-repo --json output */
export interface SingleJsonSnapshot {
  timestamp: string;
  repo: RepoData;
}

/** Result of insight --compare between two repos */
export interface InsightCompareResult {
  repo1: RepoData;
  repo2: RepoData;
  starDiff: number;
  forkDiff: number;
  issueDiff: number;
  winner: 'repo1' | 'repo2' | 'tie';
  starsPerDay1: number;
  starsPerDay2: number;
}
