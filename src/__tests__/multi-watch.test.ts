import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@octokit/rest', () => {
  const __mockGet = vi.fn();
  const __mockGetAllTopics = vi.fn();
  return {
    Octokit: vi.fn(() => ({
      rest: {
        repos: { get: __mockGet, getAllTopics: __mockGetAllTopics },
      },
    })),
    __mockGet,
    __mockGetAllTopics,
  };
});

function makeChalkChain(): any {
  return new Proxy((s: string) => s, {
    apply(_t, _thisArg, args) { return args[0] ?? ''; },
    get() { return makeChalkChain(); },
  });
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

import { __mockGet as mockGet, __mockGetAllTopics as mockGetAllTopics } from '@octokit/rest';

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
  beforeEach(() => { vi.clearAllMocks(); delete process.env.GITHUB_TOKEN; });

  it('fetches multiple repos in parallel and returns data in order', async () => {
    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000))
      .mockResolvedValueOnce(makeApiResponse('microsoft', 'vscode', 150000));
    mockGetAllTopics.mockResolvedValue(makeTopicsResponse());

    const { getRepos, clearCache } = await import('../github.js');
    clearCache();
    const repos = await getRepos(['facebook/react', 'vercel/next.js', 'microsoft/vscode']);
    expect(repos).toHaveLength(3);
    expect(repos[0].fullName).toBe('facebook/react');
    expect(repos[0].stars).toBe(200000);
    expect(mockGet).toHaveBeenCalledTimes(3);
  });

  it('throws on first failure with invalid repo', async () => {
    mockGet.mockRejectedValue(Object.assign(new Error('Not Found'), { status: 404 }));
    mockGetAllTopics.mockResolvedValue(makeTopicsResponse());
    const { getRepos, clearCache } = await import('../github.js');
    clearCache();
    await expect(getRepos(['unknown/ghost'])).rejects.toThrow('Not Found');
  });
});

describe('watchMultiRepos', () => {
  beforeEach(() => { vi.clearAllMocks(); delete process.env.GITHUB_TOKEN; });

  it('exports watchMultiRepos function', async () => {
    const { watchMultiRepos } = await import('../commands/watch.js');
    expect(typeof watchMultiRepos).toBe('function');
  });
});
