import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock dependencies
vi.mock('@octokit/rest', () => {
  const mockGet = vi.fn();
  const mockGetAllTopics = vi.fn();
  const MockOctokit = vi.fn(() => ({
    rest: { repos: { get: mockGet, getAllTopics: mockGetAllTopics } },
  }));
  return { Octokit: MockOctokit };
});

vi.mock('chalk', () => ({
  default: new Proxy(
    {},
    {
      get: () => (s: string) => s,
      apply: () => '',
    }
  ),
  red: (s: string) => s,
  green: (s: string) => s,
  yellow: (s: string) => s,
  cyan: (s: string) => s,
  blue: (s: string) => s,
  gray: (s: string) => s,
  white: (s: string) => s,
  bold: new Proxy(
    {},
    {
      get: () => (s: string) => s,
      apply: () => '',
    }
  ),
}));

vi.mock('cli-table3', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      push: vi.fn(),
      toString: () => '',
    })),
  };
});

vi.mock('ora', () => ({
  default: vi.fn().mockReturnValue({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    text: '',
  }),
}));

import type { RepoData, BattleResult } from '../models.js';

describe('watch command', () => {
  it('should export watchRepo function', async () => {
    const watchModule = await import('../commands/watch.js');
    expect(typeof watchModule.watchRepo).toBe('function');
  });

  it('should export renderDashboard function', async () => {
    const watchModule = await import('../commands/watch.js');
    expect(typeof watchModule.renderDashboard).toBe('function');
  });
});

describe('battle command', () => {
  it('should export battleRepos function', async () => {
    const watchModule = await import('../commands/watch.js');
    expect(typeof watchModule.battleRepos).toBe('function');
  });

  it('should export renderBattle function', async () => {
    const watchModule = await import('../commands/watch.js');
    expect(typeof watchModule.renderBattle).toBe('function');
  });

  it('renderBattle should not throw with valid BattleResult', async () => {
    const makeRepo = (name: string, stars: number): RepoData => ({
      owner: 'test',
      name,
      fullName: `test/${name}`,
      description: null,
      language: 'TypeScript',
      license: 'MIT',
      stars,
      forks: 10,
      openIssues: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    });

    // Spy on console.log to suppress output
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { renderBattle } = await import('../commands/watch.js');
    const result: BattleResult = {
      repo1: { repo: makeRepo('alpha', 1000), timestamp: new Date() },
      repo2: { repo: makeRepo('beta', 500), timestamp: new Date() },
      winner: 'repo1',
      starDiff: 500,
      forkDiff: 0,
      issueDiff: 0,
      scores: {
        stars: 'test/alpha',
        forks: 'Tie',
        issues: 'Tie',
        language: 'Same',
      },
    };

    expect(() => renderBattle(result)).not.toThrow();
    expect(logSpy).toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('renderBattle handles tie correctly', async () => {
    const makeRepo = (name: string): RepoData => ({
      owner: 'test',
      name,
      fullName: `test/${name}`,
      description: null,
      language: null,
      license: null,
      stars: 500,
      forks: 10,
      openIssues: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { renderBattle } = await import('../commands/watch.js');
    const result: BattleResult = {
      repo1: { repo: makeRepo('alpha'), timestamp: new Date() },
      repo2: { repo: makeRepo('beta'), timestamp: new Date() },
      winner: 'tie',
      starDiff: 0,
      forkDiff: 0,
      issueDiff: 0,
      scores: {
        stars: 'Tie',
        forks: 'Tie',
        issues: 'Tie',
        language: 'Same',
      },
    };

    expect(() => renderBattle(result)).not.toThrow();
    logSpy.mockRestore();
  });
});

describe('index CLI', () => {
  it('should export run function', async () => {
    const indexModule = await import('../index.js');
    expect(typeof indexModule.run).toBe('function');
  });
});
