import { describe, it, expect, vi, beforeAll } from 'vitest';

// ── Unified dependency mocks ───────────────────────────────────────────

vi.mock('@octokit/rest', () => {
  const mockGet = vi.fn();
  const mockGetAllTopics = vi.fn();
  const MockOctokit = vi.fn(() => ({
    rest: { repos: { get: mockGet, getAllTopics: mockGetAllTopics } },
  }));
  return { Octokit: MockOctokit };
});

// chalk with full chainable support: chalk.bold.cyan('x'), chalk.red('x'), etc.
// Each color/tag function is also a proxy so chaining works
function makeChalkChain(): any {
  const handler: ProxyHandler<(...args: any[]) => any> = {
    apply(_target, _thisArg, args) {
      return args[0] ?? ''; // identity
    },
    get(_target, prop) {
      if (prop === 'bold' || prop === 'default') return makeChalkChain();
      return makeChalkChain();
    },
  };
  return new Proxy((s: string) => s, handler);
}

vi.mock('chalk', () => ({
  default: makeChalkChain(),
  red: makeChalkChain(),
  green: makeChalkChain(),
  yellow: makeChalkChain(),
  cyan: makeChalkChain(),
  blue: makeChalkChain(),
  gray: makeChalkChain(),
  white: makeChalkChain(),
  magenta: makeChalkChain(),
  bold: makeChalkChain(),
}));

vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));

// ── Tests ──────────────────────────────────────────────────────────────

import { renderBattle, renderDashboard } from '../commands/watch.js';
import type { RepoData, RepoSnapshot, BattleResult } from '../models.js';

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

  it('renderBattle reveals repo1 as winner with positive starDiff', async () => {
    const makeRepo = (name: string, stars: number): RepoData => ({
      owner: 'test',
      name,
      fullName: `test/${name}`,
      description: 'A great repo',
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

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const { renderBattle } = await import('../commands/watch.js');
    const result: BattleResult = {
      repo1: { repo: makeRepo('alpha', 2000), timestamp: new Date() },
      repo2: { repo: makeRepo('beta', 500), timestamp: new Date() },
      winner: 'repo1',
      starDiff: 1500,
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

  it('renderBattle handles null description/language/license with winner', async () => {
    const makeRepo = (name: string): RepoData => ({
      owner: 'test',
      name,
      fullName: `test/${name}`,
      description: null,
      language: null,
      license: null,
      stars: 100,
      forks: 5,
      openIssues: 2,
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
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});

describe('index CLI', () => {
  it('should export run function', async () => {
    const indexModule = await import('../index.js');
    // index.ts exports { run }, and the auto-run is guarded by VITEST env check
    expect(typeof indexModule.run).toBe('function');
  });
});

describe('renderDashboard', () => {
  const makeRepo = (overrides: Partial<RepoData> = {}): RepoData => ({
    owner: 'facebook',
    name: 'react',
    fullName: 'facebook/react',
    description: 'A UI library',
    language: 'TypeScript',
    license: 'MIT',
    stars: 100000,
    forks: 10000,
    openIssues: 500,
    createdAt: '2013-05-29T21:18:12Z',
    updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z',
    topics: [],
    homepage: null,
    defaultBranch: 'main',
    ...overrides,
  });

  it('renders dashboard without previous (initial state)', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const { renderDashboard } = await import('../commands/watch.js');
    const snapshot: RepoSnapshot = { repo: makeRepo(), timestamp: new Date() };
    renderDashboard(snapshot);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    clearSpy.mockRestore();
  });

  it('renders dashboard with delta display', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const { renderDashboard } = await import('../commands/watch.js');
    const current: RepoSnapshot = {
      repo: makeRepo({ stars: 100010 }),
      timestamp: new Date(),
    };
    const previous: RepoSnapshot = {
      repo: makeRepo({ stars: 100000 }),
      timestamp: new Date(Date.now() - 30000),
    };
    renderDashboard(current, previous);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    clearSpy.mockRestore();
  });

  it('handles null description/license/language', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const { renderDashboard } = await import('../commands/watch.js');
    const snapshot: RepoSnapshot = {
      repo: makeRepo({
        description: null,
        language: null,
        license: null,
      }),
      timestamp: new Date(),
    };
    expect(() => renderDashboard(snapshot)).not.toThrow();
    logSpy.mockRestore();
    clearSpy.mockRestore();
  });
});

describe('renderBattle', () => {
  const makeRepo = (overrides: Partial<RepoData> = {}): RepoData => ({
    owner: 'facebook', name: 'react', fullName: 'facebook/react',
    description: 'A UI library', language: 'TypeScript', license: 'MIT',
    stars: 100000, forks: 10000, openIssues: 500,
    createdAt: '2013-05-29T21:18:12Z', updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z', topics: [], homepage: null, defaultBranch: 'main',
    ...overrides,
  });

  it('renders battle with repo1 winning by stars', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1: RepoData = { ...makeRepo(), stars: 200000 };
    const r2: RepoData = { ...makeRepo({ name: 'next.js', fullName: 'vercel/next.js' }), stars: 100000 };
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'repo1', starDiff: 100000, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'facebook/react', forks: 'Tie', issues: 'Tie', language: 'Same', license: 'Same' },
    };
    renderBattle(result);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders battle with tie', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1 = makeRepo();
    const r2 = makeRepo({ name: 'next.js', fullName: 'vercel/next.js' });
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'tie', starDiff: 0, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'Tie', forks: 'Tie', issues: 'Tie', language: 'Same', license: 'Same' },
    };
    renderBattle(result);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders battle with null fields (description/language/license)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1 = makeRepo({ description: null, language: null, license: null, stars: 50000 });
    const r2 = makeRepo({ name: 'next.js', fullName: 'vercel/next.js', description: null, language: null, license: null, stars: 30000 });
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'repo1', starDiff: 20000, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'facebook/react', forks: 'Tie', issues: 'Tie', language: 'N/A vs N/A', license: 'None vs None' },
    };
    expect(() => renderBattle(result)).not.toThrow();
    logSpy.mockRestore();
  });
});
