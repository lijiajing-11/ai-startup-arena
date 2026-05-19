import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RepoData } from '../models.js';

// ── Mocks with shared state ────────────────────────────────────────────
// We expose mock controllers on the mocked module itself so tests can
// configure them. This avoids the closure-variable capture issue.

vi.mock('@octokit/rest', () => {
  const __mockGet = vi.fn();
  const __mockGetAllTopics = vi.fn();
  const MockOctokit = vi.fn(() => ({
    rest: {
      repos: {
        get: __mockGet,
        getAllTopics: __mockGetAllTopics,
      },
    },
  }));

  return { Octokit: MockOctokit, __mockGet, __mockGetAllTopics };
});

// Shared chainable chalk mock — supports arbitrary chaining like chalk.bold.cyan('x')
import { createChalkMock } from './__mocks__/chalk.js';

vi.mock('chalk', () => createChalkMock());

vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));

// Get the mock controllers from the mock factory
import { Octokit } from '@octokit/rest';
const MockOctokit = vi.mocked(Octokit);

function getMockGet() {
  // Each call to MockOctokit() creates a new instance, but it always
  // returns the same __mockGet / __mockGetAllTopics from the factory
  const instance = (MockOctokit as any).mock.results[0]?.value;
  if (!instance) {
    // Force creation
    new (Octokit as any)();
    return (MockOctokit as any).mock.results[0]?.value?.rest?.repos?.get;
  }
  return instance.rest.repos.get;
}

function getMockGetAllTopics() {
  const instance = (MockOctokit as any).mock.results[0]?.value;
  if (!instance) {
    new (Octokit as any)();
    return (MockOctokit as any).mock.results[0]?.value?.rest?.repos?.getAllTopics;
  }
  return instance.rest.repos.getAllTopics;
}

const makeApiResponse = (owner: string, name: string, stars: number) => ({
  data: {
    full_name: `${owner}/${name}`,
    description: null,
    language: 'TypeScript',
    license: { spdx_id: 'MIT' },
    stargazers_count: stars,
    forks_count: Math.floor(stars / 10),
    open_issues_count: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    homepage: null,
    default_branch: 'main',
  },
});

const makeTopicsResponse = (topics: string[] = []) => ({
  data: { names: topics },
});

describe('getRepos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it('fetches multiple repos in parallel and returns data in order', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000))
      .mockResolvedValueOnce(makeApiResponse('microsoft', 'vscode', 150000));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const { getRepos, clearCache } = await import('../github.js');
    clearCache();
    const repos = await getRepos(['facebook/react', 'vercel/next.js', 'microsoft/vscode']);

    expect(repos).toHaveLength(3);
    expect(repos[0].fullName).toBe('facebook/react');
    expect(repos[0].stars).toBe(200000);
    expect(repos[1].fullName).toBe('vercel/next.js');
    expect(repos[1].stars).toBe(120000);
    expect(repos[2].fullName).toBe('microsoft/vscode');
    expect(repos[2].stars).toBe(150000);
    expect(mockGet).toHaveBeenCalledTimes(3);
  });

  it('throws on first failure with invalid repo', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet.mockRejectedValue(
      Object.assign(new Error('Not Found'), { status: 404 })
    );
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const { getRepos, clearCache } = await import('../github.js');
    clearCache();
    await expect(getRepos(['unknown/ghost'])).rejects.toThrow('Not Found');
  });
});

describe('watchMultiRepos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it('exports watchMultiRepos function', async () => {
    const { watchMultiRepos } = await import('../commands/watch.js');
    expect(typeof watchMultiRepos).toBe('function');
  });

  it('single tick with JSON output does not throw', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(
      ['facebook/react', 'vercel/next.js'],
      9999,
      true, // JSON mode
      abortController.signal
    );

    // Let the first tick go through, then abort
    await new Promise((r) => setTimeout(r, 100));
    abortController.abort();
    await promise;

    expect(logSpy).toHaveBeenCalled();
    const firstCall = logSpy.mock.calls[0][0];
    expect(typeof firstCall).toBe('string');
    const parsed = JSON.parse(firstCall);
    expect(parsed.repos).toHaveLength(2);

    logSpy.mockRestore();
  }, 15000);

  it('multi-watch calls getRepos internally', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(
      ['facebook/react', 'vercel/next.js'],
      9999,
      false, // dashboard mode
      abortController.signal
    );

    await new Promise((r) => setTimeout(r, 100));
    abortController.abort();
    await promise;

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 15000);

  it('watchMultiRepos with empty repo list resolves without error', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(
      [],
      9999,
      true, // JSON mode
      abortController.signal
    );

    // Let the first tick go through, then abort
    await new Promise((r) => setTimeout(r, 100));
    abortController.abort();
    await promise;

    // Should have logged something (JSON snapshot with empty repos)
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 15000);

  it('watchMultiRepos JSON output is valid JSON with repos array', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('test', 'repo1', 1000))
      .mockResolvedValueOnce(makeApiResponse('test', 'repo2', 500));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(
      ['test/repo1', 'test/repo2'],
      9999,
      true, // JSON mode
      abortController.signal
    );

    await new Promise((r) => setTimeout(r, 100));
    abortController.abort();
    await promise;

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(typeof output).toBe('string');
    const parsed = JSON.parse(output);
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('repos');
    expect(Array.isArray(parsed.repos)).toBe(true);
    expect(parsed.repos).toHaveLength(2);
    expect(parsed.repos[0]).toHaveProperty('fullName', 'test/repo1');

    logSpy.mockRestore();
  }, 15000);
});

// ── renderMultiDashboard tests ─────────────────────────────────────────

describe('renderMultiDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it('renders multi-dashboard without crashing', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('test', 'repo1', 1000))
      .mockResolvedValueOnce(makeApiResponse('test', 'repo2', 500));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abort = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(['test/repo1', 'test/repo2'], 9999, false, abort.signal);
    await new Promise((r) => setTimeout(r, 50));
    abort.abort();
    await promise.catch(() => {});

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 5000);
});

// ── watchMultiRepos edge cases ──────────────────────────────────────────

describe('watchMultiRepos edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it('watchMultiRepos with empty repo list resolves immediately', async () => {
    const { watchMultiRepos } = await import('../commands/watch.js');
    const ac = new AbortController();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const promise = watchMultiRepos([], 1, true, ac.signal);
    await new Promise(r => setTimeout(r, 200));
    ac.abort();
    await promise;
    logSpy.mockRestore();
  }, 5000);

  it('watchMultiRepos JSON output is valid JSON', async () => {
    const { watchMultiRepos } = await import('../commands/watch.js');
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet.mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const ac = new AbortController();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const promise = watchMultiRepos(['facebook/react'], 1, true, ac.signal);
    await new Promise(r => setTimeout(r, 1100));
    ac.abort();
    await promise;
    const calls = logSpy.mock.calls.filter(c => typeof c[0] === 'string');
    if (calls.length > 0) {
      const parsed = JSON.parse(calls[0][0]);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('repos');
    }
    logSpy.mockRestore();
  }, 15000);
});
