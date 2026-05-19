import { describe, it, expect } from 'vitest';
import type { RepoData, RepoSnapshot, BattleResult, StarPoint } from '../models.js';

describe('RepoData interface', () => {
  it('should allow creating a valid RepoData object', () => {
    const repo: RepoData = {
      owner: 'facebook',
      name: 'react',
      fullName: 'facebook/react',
      description: 'A UI library',
      language: 'TypeScript',
      license: 'MIT',
      stars: 123456,
      forks: 12345,
      openIssues: 500,
      createdAt: '2013-05-29T21:18:12Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: ['react', 'ui', 'frontend'],
      homepage: 'https://react.dev',
      defaultBranch: 'main',
    };
    expect(repo.fullName).toBe('facebook/react');
    expect(repo.stars).toBe(123456);
    expect(repo.language).toBe('TypeScript');
  });

  it('should allow null description and license', () => {
    const repo: RepoData = {
      owner: 'test',
      name: 'test',
      fullName: 'test/test',
      description: null,
      language: null,
      license: null,
      stars: 0,
      forks: 0,
      openIssues: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    };
    expect(repo.description).toBeNull();
    expect(repo.license).toBeNull();
    expect(repo.topics).toEqual([]);
  });

  it('handles empty topics array', () => {
    const repo: RepoData = {
      owner: 'test',
      name: 'empty-tags',
      fullName: 'test/empty-tags',
      description: 'No tags',
      language: 'Go',
      license: 'Apache-2.0',
      stars: 0,
      forks: 0,
      openIssues: 0,
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-15T00:00:00Z',
      pushedAt: '2024-06-15T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    };
    expect(repo.topics).toHaveLength(0);
    // Should be iterable without error
    expect([...repo.topics]).toEqual([]);
  });

  it('handles many topics', () => {
    const repo: RepoData = {
      owner: 'big',
      name: 'project',
      fullName: 'big/project',
      description: 'Many topics',
      language: 'Rust',
      license: 'MIT',
      stars: 100,
      forks: 10,
      openIssues: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      topics: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      homepage: null,
      defaultBranch: 'main',
    };
    expect(repo.topics.length).toBe(8);
  });
});

describe('RepoSnapshot interface', () => {
  it('should hold a repo with a timestamp', () => {
    const repo: RepoData = {
      owner: 'test',
      name: 'test',
      fullName: 'test/test',
      description: null,
      language: null,
      license: null,
      stars: 100,
      forks: 10,
      openIssues: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    };
    const now = new Date();
    const snapshot: RepoSnapshot = { repo, timestamp: now };
    expect(snapshot.repo.stars).toBe(100);
    expect(snapshot.timestamp).toBe(now);
  });
});

describe('BattleResult interface', () => {
  it('should declare a winner and diffs', () => {
    const makeRepo = (stars: number, forks: number, issues: number): RepoData => ({
      owner: 'test',
      name: 'test',
      fullName: `test/test-${stars}`,
      description: null,
      language: null,
      license: null,
      stars,
      forks,
      openIssues: issues,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    });

    const result: BattleResult = {
      repo1: { repo: makeRepo(1000, 50, 10), timestamp: new Date() },
      repo2: { repo: makeRepo(500, 100, 5), timestamp: new Date() },
      winner: 'repo1',
      starDiff: 500,
      forkDiff: -50,
      issueDiff: 5,
      scores: {
        stars: 'test/test-1000',
        forks: 'test/test-500',
        issues: 'test/test-500',
        language: 'Same',
      },
    };

    expect(result.winner).toBe('repo1');
    expect(result.starDiff).toBe(500);
    expect(result.scores.stars).toBe('test/test-1000');
  });

  it('should support ties', () => {
    const makeRepo = (stars: number): RepoData => ({
      owner: 'test',
      name: 'test',
      fullName: `test/test-${stars}`,
      description: null,
      language: null,
      license: null,
      stars,
      forks: 0,
      openIssues: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    });

    const result: BattleResult = {
      repo1: { repo: makeRepo(500), timestamp: new Date() },
      repo2: { repo: makeRepo(500), timestamp: new Date() },
      winner: 'tie',
      starDiff: 0,
      forkDiff: 0,
      issueDiff: 0,
      scores: { stars: 'Tie', forks: 'Tie', issues: 'Tie', language: 'Same' },
    };

    expect(result.winner).toBe('tie');
    expect(result.starDiff).toBe(0);
  });
});

describe('StarPoint interface', () => {
  it('should hold date and stars', () => {
    const point: StarPoint = { date: '2024-01-15', stars: 500 };
    expect(point.date).toBe('2024-01-15');
    expect(point.stars).toBe(500);
  });
});

describe('formatNumber edge cases (imported from github)', () => {
  it('handles zero', async () => {
    const { formatNumber } = await import('../github.js');
    expect(formatNumber(0)).toBe('0');
  });

  it('handles very large numbers (billions)', async () => {
    const { formatNumber } = await import('../github.js');
    // 1.2B rounds to M — the function only goes up to M prefix
    const result = formatNumber(1_200_000_000);
    expect(result).toMatch(/M$/);
  });

  it('handles negative numbers gracefully', async () => {
    const { formatNumber } = await import('../github.js');
    const result = formatNumber(-5000);
    // Should still format without crashing, minus sign preserved
    expect(result).toMatch(/^-/);
    expect(result).toMatch(/K$/);
  });

  it('handles small decimals by flooring', async () => {
    const { formatNumber } = await import('../github.js');
    // Numbers < 1000 are returned as-is (no decimal formatting needed)
    const result = formatNumber(3.14);
    expect(result).toBe('3');
  });
});
