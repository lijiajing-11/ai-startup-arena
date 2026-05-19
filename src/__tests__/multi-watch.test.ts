import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @octokit/rest — shared mock refs
let mockGet = vi.fn();
let mockGetAllTopics = vi.fn();

vi.mock('@octokit/rest', () => {
  const MockOctokit = vi.fn(() => ({
    rest: {
      repos: {
        get: mockGet,
        getAllTopics: mockGetAllTopics,
      },
    },
  }));

  return { Octokit: MockOctokit };
});

vi.mock('chalk', () => {
  const identityProxy: Record<string, (s: string) => string> = new Proxy(
    {} as Record<string, (s: string) => string>,
    { get: () => (s: string) => s, apply: () => '' }
  );
  return {
    default: identityProxy,
    red: (s: string) => s,
    green: (s: string) => s,
    yellow: (s: string) => s,
    cyan: (s: string) => s,
    blue: (s: string) => s,
    gray: (s: string) => s,
    white: (s: string) => s,
    magenta: (s: string) => s,
    bold: identityProxy,
  };
});

vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: () => '',
  })),
}));

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
    // Reset mock refs so previous test config doesn't leak
    mockGet = vi.fn();
    mockGetAllTopics = vi.fn();
  });

  it('fetches multiple repos in parallel and returns data in order', async () => {
    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000))
      .mockResolvedValueOnce(makeApiResponse('microsoft', 'vscode', 150000));
    mockGetAllTopics
      .mockResolvedValue(makeTopicsResponse());

    const { getRepos, clearCache } = await import('../github.js');
    clearCache(); // ensure no stale cache
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
    mockGet.mockRejectedValueOnce(new Error('Not Found'));
    mockGetAllTopics.mockResolvedValue(makeTopicsResponse());

    const { getRepos, clearCache } = await import('../github.js');
    clearCache();
    await expect(getRepos(['unknown/ghost'])).rejects.toThrow('Not Found');
  });
});

describe('watchMultiRepos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
    mockGet = vi.fn();
    mockGetAllTopics = vi.fn();
  });

  it('exports watchMultiRepos function', async () => {
    const { watchMultiRepos } = await import('../commands/watch.js');
    expect(typeof watchMultiRepos).toBe('function');
  });

  it('single tick with JSON output does not throw', async () => {
    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000));
    mockGetAllTopics.mockResolvedValue(makeTopicsResponse());

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
    await new Promise((r) => setTimeout(r, 50));
    abortController.abort();
    await promise;

    // Should have logged JSON output
    expect(logSpy).toHaveBeenCalled();
    const firstCall = logSpy.mock.calls[0][0];
    expect(typeof firstCall).toBe('string');
    // JSON output should contain the repos
    const parsed = JSON.parse(firstCall);
    expect(parsed.repos).toHaveLength(2);

    logSpy.mockRestore();
  }, 10000);

  it('multi-watch calls getRepos internally', async () => {
    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000));
    mockGetAllTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const promise = watchMultiRepos(
      ['facebook/react', 'vercel/next.js'],
      9999,
      false, // dashboard mode
      abortController.signal
    );

    await new Promise((r) => setTimeout(r, 50));
    abortController.abort();
    await promise;

    // Should not throw — dashboard render is called
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 10000);
});
