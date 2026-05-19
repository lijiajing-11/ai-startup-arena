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

// Chalk mock that supports chained calls like chalk.bold.cyan('text')
const chalkIdentity = (s: string) => s;
chalkIdentity.bold = new Proxy(chalkIdentity, {
  get: () => chalkIdentity,
  apply: () => '',
}) as any;

vi.mock('chalk', () => ({
  default: chalkIdentity,
  red: chalkIdentity,
  green: chalkIdentity,
  yellow: chalkIdentity,
  cyan: chalkIdentity,
  blue: chalkIdentity,
  gray: chalkIdentity,
  white: chalkIdentity,
  magenta: chalkIdentity,
  bold: chalkIdentity,
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

// Prevent index.ts run() from auto-executing during import
vi.mock('../index.js', () => ({}));

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
    // Use direct import with auto-run suppressed
    const indexModule = await import('../index.js');
    expect(typeof indexModule.run).toBe('function');
  });
});
