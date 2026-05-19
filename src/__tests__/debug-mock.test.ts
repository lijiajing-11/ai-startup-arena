import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import chalkMock from './__mocks__/chalk.js';
vi.mock('chalk', () => ({ default: chalkMock, red: chalkMock, green: chalkMock, yellow: chalkMock, cyan: chalkMock, blue: chalkMock, gray: chalkMock, white: chalkMock, magenta: chalkMock, bold: chalkMock }));
vi.mock('cli-table3', () => ({ default: vi.fn().mockImplementation(() => ({ push: vi.fn(), toString: () => '' })) }));

import { Octokit } from '@octokit/rest';
const MockOctokit = vi.mocked(Octokit);

function getMockGet() {
  const instance = (MockOctokit as any).mock.results[0]?.value;
  if (!instance) {
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

describe('debug-mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
  });

  it('getMockGet works after clearAllMocks', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    expect(typeof mockGet).toBe('function');
    expect(typeof mockTopics).toBe('function');

    mockGet.mockResolvedValueOnce(makeApiResponse('test', 'repo', 100));
    mockTopics.mockResolvedValueOnce(makeTopicsResponse(['react']));

    const { getRepo, clearCache } = await import('../github.js');
    clearCache();

    const start = Date.now();
    const repo = await getRepo('test/repo');
    console.error('DEBUG: getRepo took', Date.now() - start, 'ms, stars:', repo.stars);
    expect(repo.stars).toBe(100);
    expect(repo.topics).toEqual(['react']);
  }, 10000);

  it('watchMultiRepos single tick JSON', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();

    mockGet
      .mockResolvedValueOnce(makeApiResponse('facebook', 'react', 200000))
      .mockResolvedValueOnce(makeApiResponse('vercel', 'next.js', 120000));
    mockTopics.mockResolvedValue(makeTopicsResponse());

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const abortController = new AbortController();

    const { watchMultiRepos } = await import('../commands/watch.js');
    const start = Date.now();
    const promise = watchMultiRepos(
      ['facebook/react', 'vercel/next.js'],
      9999,
      true,
      abortController.signal
    );

    await new Promise((r) => setTimeout(r, 100));
    abortController.abort();
    await promise;
    console.error('DEBUG: watchMultiRepos took', Date.now() - start, 'ms');

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  }, 15000);
});
