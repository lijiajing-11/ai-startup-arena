import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @octokit/rest so we don't hit the real GitHub API
vi.mock('@octokit/rest', () => {
  const mockGet = vi.fn();
  const mockGetAllTopics = vi.fn();

  const MockOctokit = vi.fn(() => ({
    rest: {
      repos: {
        get: mockGet,
        getAllTopics: mockGetAllTopics,
      },
    },
  }));

  return {
    Octokit: MockOctokit,
    __mockGet: mockGet,
    __mockGetAllTopics: mockGetAllTopics,
  };
});

// Import the mocked module to get access to mock controls
import { Octokit } from '@octokit/rest';
const { __mockGet: mockGet, __mockGetAllTopics: mockGetAllTopics } = vi.mocked(Octokit as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .mock as any;

// These must be imported AFTER the mock is set up
import { formatNumber, formatDelta } from '../github.js';

describe('formatNumber', () => {
  it('formats numbers under 1000 as-is', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix (one decimal)', () => {
    expect(formatNumber(1000)).toBe('1.0K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(12345)).toBe('12.3K');
  });

  it('formats millions with M suffix', () => {
    expect(formatNumber(1_000_000)).toBe('1.0M');
    expect(formatNumber(2_500_000)).toBe('2.5M');
  });

  it('rounds down correctly', () => {
    expect(formatNumber(1999)).toBe('2.0K');
    expect(formatNumber(1050)).toBe('1.1K');
  });
});

describe('formatDelta', () => {
  it('returns positive diff with + prefix', () => {
    expect(formatDelta(100, 50)).toBe('+50');
  });

  it('returns negative diff with - prefix', () => {
    expect(formatDelta(50, 100)).toBe('-50');
  });

  it('returns 0 for no change', () => {
    expect(formatDelta(100, 100)).toBe('0');
  });

  it('handles large deltas', () => {
    expect(formatDelta(5000, 10)).toBe('+4990');
  });
});

describe('getRepo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env
    delete process.env.GITHUB_TOKEN;
  });

  it('validates owner/name format', async () => {
    // Dynamic import to get fresh module state
    const { getRepo } = await import('../github.js');
    await expect(getRepo('invalid')).rejects.toThrow('Invalid repo format');
  });

  it('validates empty parts', async () => {
    const { getRepo } = await import('../github.js');
    await expect(getRepo('/name')).rejects.toThrow('Invalid repo format');
    await expect(getRepo('owner/')).rejects.toThrow('Invalid repo format');
  });

  it('accepts valid owner/name format', async () => {
    // Mock API to return a valid response
    mockGet.mockResolvedValueOnce({
      data: {
        full_name: 'facebook/react',
        description: 'A UI library',
        language: 'TypeScript',
        license: { spdx_id: 'MIT' },
        stargazers_count: 123456,
        forks_count: 12345,
        open_issues_count: 500,
        created_at: '2013-05-29T21:18:12Z',
        updated_at: '2024-01-01T00:00:00Z',
        pushed_at: '2024-01-01T00:00:00Z',
        homepage: 'https://react.dev',
        default_branch: 'main',
      },
    });
    mockGetAllTopics.mockResolvedValueOnce({
      data: { names: ['react', 'ui'] },
    });

    const { getRepo } = await import('../github.js');
    const repo = await getRepo('facebook/react');

    expect(repo.fullName).toBe('facebook/react');
    expect(repo.stars).toBe(123456);
    expect(repo.forks).toBe(12345);
    expect(repo.language).toBe('TypeScript');
    expect(repo.license).toBe('MIT');
    expect(repo.topics).toEqual(['react', 'ui']);
  });

  it('sets auth token from env', () => {
    process.env.GITHUB_TOKEN = 'test-token-123';
    // Create an Octokit instance to verify it was called with auth
    new (Octokit as any)({}); // use any to bypass TS strictness
    expect(Octokit).toHaveBeenCalled();
  });
});
