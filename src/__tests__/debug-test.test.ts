import { describe, it, expect, vi, beforeEach } from 'vitest';

// Same mock setup as multi-watch.test.ts
vi.mock('@octokit/rest', () => {
  const __mockGet = vi.fn();
  const MockOctokit = vi.fn(() => ({
    rest: { repos: { get: __mockGet } },
  }));
  return { Octokit: MockOctokit, __mockGet };
});

import chalkMock from './__mocks__/chalk.js';
vi.mock('chalk', () => ({ default: chalkMock, bold: chalkMock, cyan: chalkMock, green: chalkMock, red: chalkMock, gray: chalkMock, yellow: chalkMock, blue: chalkMock, white: chalkMock, magenta: chalkMock }));
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

describe('debug', () => {
  beforeEach(() => { vi.clearAllMocks(); delete process.env.GITHUB_TOKEN; });

  it('getMockGet returns a functioning mock', async () => {
    const mockGet = getMockGet();
    mockGet.mockResolvedValueOnce({ data: { full_name: 'a/b', stargazers_count: 100, forks_count: 0, open_issues_count: 0, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pushed_at: '2024-01-01T00:00:00Z', homepage: null, default_branch: 'main' } });

    const { getRepo, clearCache } = await import('../github.js');
    clearCache();
    const result = await getRepo('a/b');
    expect(result.stars).toBe(100);
  });

  it('new Octokit in getRepo still gets same mock', async () => {
    const mockGet = getMockGet();
    mockGet.mockResolvedValueOnce({ data: { full_name: 'x/y', stargazers_count: 42, forks_count: 0, open_issues_count: 0, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', pushed_at: '2024-01-01T00:00:00Z', homepage: null, default_branch: 'main' } });

    const { getRepo, clearCache } = await import('../github.js');
    clearCache();
    const result = await getRepo('x/y');
    expect(result.stars).toBe(42);
  });
});
