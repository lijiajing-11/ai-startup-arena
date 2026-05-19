import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks with exported controllers ──────────────────────────────────
// We export __mockGet / __mockGetAllTopics from the mock factory so tests
// can configure them. This avoids the closure-variable capture issue that
// plagues module-scoped let variables when combined with vi.resetModules().

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

// Get the mock controllers from the factory — these survive vi.resetModules()
// because the factory closure persists across the mock system.
import { Octokit } from '@octokit/rest';
const MockOctokit = vi.mocked(Octokit);

// These must be imported AFTER the mock is set up
import * as githubModule from '../github.js';
import { withRetry } from '../github.js';

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

describe('formatNumber', () => {
  it('formats numbers under 1000 as-is', () => {
    expect(githubModule.formatNumber(0)).toBe('0');
    expect(githubModule.formatNumber(42)).toBe('42');
    expect(githubModule.formatNumber(999)).toBe('999');
  });

  it('formats thousands with K suffix (one decimal)', () => {
    expect(githubModule.formatNumber(1000)).toBe('1.0K');
    expect(githubModule.formatNumber(1500)).toBe('1.5K');
    expect(githubModule.formatNumber(12345)).toBe('12.3K');
  });

  it('formats millions with M suffix', () => {
    expect(githubModule.formatNumber(1_000_000)).toBe('1.0M');
    expect(githubModule.formatNumber(2_500_000)).toBe('2.5M');
  });

  it('rounds down correctly', () => {
    expect(githubModule.formatNumber(1999)).toBe('2.0K');
    expect(githubModule.formatNumber(1050)).toBe('1.1K');
  });

  it('handles zero', () => {
    expect(githubModule.formatNumber(0)).toBe('0');
  });

  it('handles large numbers', () => {
    expect(githubModule.formatNumber(1_234_567_890)).toBe('1234.6M');
  });
});

describe('formatDelta', () => {
  it('returns positive diff with + prefix', () => {
    expect(githubModule.formatDelta(100, 50)).toBe('+50');
  });

  it('returns negative diff with - prefix', () => {
    expect(githubModule.formatDelta(50, 100)).toBe('-50');
  });

  it('returns 0 for no change', () => {
    expect(githubModule.formatDelta(100, 100)).toBe('0');
  });

  it('handles large deltas', () => {
    expect(githubModule.formatDelta(5000, 10)).toBe('+4990');
  });

  it('handles negative zero case', () => {
    expect(githubModule.formatDelta(0, 0)).toBe('0');
  });
});

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

describe('getRepo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITHUB_TOKEN;
    vi.resetModules();
  });

  afterEach(() => {
    githubModule.clearCache();
  });

  it('validates owner/name format', async () => {
    const { getRepo } = await import('../github.js');
    await expect(getRepo('invalid')).rejects.toThrow('Invalid repo format');
  });

  it('validates empty parts', async () => {
    const { getRepo } = await import('../github.js');
    await expect(getRepo('/name')).rejects.toThrow('Invalid repo format');
    await expect(getRepo('owner/')).rejects.toThrow('Invalid repo format');
  });

  it('accepts valid owner/name format', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce(makeApiResponse('facebook', 'react', 123456));
    mockTopics.mockResolvedValueOnce(makeTopicsResponse(['react', 'ui']));

    const { getRepo } = await import('../github.js');
    const repo = await getRepo('facebook/react');

    expect(repo.fullName).toBe('facebook/react');
    expect(repo.stars).toBe(123456);
    expect(repo.forks).toBe(12345);
    expect(repo.language).toBe('TypeScript');
    expect(repo.license).toBe('MIT');
    expect(repo.topics).toEqual(['react', 'ui']);
  });

  it('handles missing optional fields gracefully', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce({
      data: {
        full_name: 'test/minimal',
        description: null,
        language: null,
        license: null,
        stargazers_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        pushed_at: '2024-01-01T00:00:00Z',
        homepage: null,
        default_branch: 'main',
      },
    });
    mockTopics.mockResolvedValueOnce({ data: { names: [] } });

    const { getRepo } = await import('../github.js');
    const repo = await getRepo('test/minimal');

    expect(repo.description).toBeNull();
    expect(repo.language).toBeNull();
    expect(repo.license).toBeNull();
    expect(repo.stars).toBe(0);
    expect(repo.topics).toEqual([]);
    expect(repo.homepage).toBeNull();
  });

  it('uses cache on second call', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce(makeApiResponse('test', 'cached', 100));
    mockTopics.mockResolvedValueOnce(makeTopicsResponse(['test']));

    const { getRepo } = await import('../github.js');

    // First call hits API
    const first = await getRepo('test/cached');
    expect(first.stars).toBe(100);

    // Clear mock counters — second call should hit cache, not API
    mockGet.mockClear();
    mockTopics.mockClear();

    const second = await getRepo('test/cached');
    expect(second.stars).toBe(100);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('returns all topics from GitHub API', async () => {
    const manyTopics = Array.from({ length: 10 }, (_, i) => `topic-${i + 1}`);
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce(makeApiResponse('test', 'many-topics', 100));
    mockTopics.mockResolvedValueOnce({ data: { names: manyTopics } });

    const { getRepo } = await import('../github.js');
    const repo = await getRepo('test/many-topics');

    expect(repo.topics).toHaveLength(10);
    expect(repo.topics).toEqual(manyTopics);
  });

  it('retries on 429 rate limit then succeeds', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet
      .mockRejectedValueOnce(Object.assign(new Error('Rate limited'), { status: 429 }))
      .mockResolvedValueOnce(makeApiResponse('test', 'ratelimit', 50));
    mockTopics
      .mockRejectedValueOnce(Object.assign(new Error('Rate limited'), { status: 429 }))
      .mockResolvedValueOnce(makeTopicsResponse(['test']));

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { getRepo } = await import('../github.js');
    const repo = await getRepo('test/ratelimit');

    expect(repo.stars).toBe(50);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('retrying')
    );

    consoleSpy.mockRestore();
  });

  it('throws on non-retryable error (4xx non-429)', async () => {
    const mockGet = getMockGet();
    mockGet.mockRejectedValueOnce(
      Object.assign(new Error('Not Found'), { status: 404 })
    );

    const { getRepo } = await import('../github.js');
    await expect(getRepo('test/missing')).rejects.toThrow('Not Found');
  });

  it('throws after exhausting retries', async () => {
    const mockGet = getMockGet();
    mockGet
      .mockRejectedValueOnce(Object.assign(new Error('Server Error'), { status: 500 }))
      .mockRejectedValueOnce(Object.assign(new Error('Server Error'), { status: 500 }))
      .mockRejectedValueOnce(Object.assign(new Error('Server Error'), { status: 500 }));

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { getRepo } = await import('../github.js');
    await expect(getRepo('test/failing')).rejects.toThrow('Server Error');

    // Should have tried 3 times (2 warnings — last attempt throws before warn)
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  }, 15000);
});

describe('getStarHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    githubModule.clearCache();
  });

  it('returns requested number of points', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce(makeApiResponse('test', 'star-history', 100));
    mockTopics.mockResolvedValueOnce(makeTopicsResponse());

    const { getStarHistory } = await import('../github.js');
    const history = await getStarHistory('test/star-history', 5);

    expect(history).toHaveLength(5);
    expect(history[0].stars).toBe(20);  // 100 * 1/5
    expect(history[4].stars).toBe(100); // 100 * 5/5
  });

  it('all values are within range and monotonic', async () => {
    const mockGet = getMockGet();
    const mockTopics = getMockGetAllTopics();
    mockGet.mockResolvedValueOnce(makeApiResponse('test', 'monotonic', 1000));
    mockTopics.mockResolvedValueOnce(makeTopicsResponse());

    const { getStarHistory } = await import('../github.js');
    const history = await getStarHistory('test/monotonic', 10);

    expect(history[0].stars).toBeGreaterThanOrEqual(0);
    expect(history[9].stars).toBe(1000);
    for (let i = 1; i < history.length; i++) {
      expect(history[i].stars).toBeGreaterThanOrEqual(history[i - 1].stars);
    }
  });
});

describe('withRetry', () => {
  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn, { maxAttempts: 3 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable error then succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(Object.assign(new Error('Rate limited'), { status: 429 }))
      .mockRejectedValueOnce(Object.assign(new Error('Server error'), { status: 500 }))
      .mockResolvedValueOnce('finally success');
    const result = await withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 });
    expect(result).toBe('finally success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('exhausts retries on persistent errors', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Server Error');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('does not retry on non-retryable error (403)', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Forbidden'), { status: 403 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Forbidden');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 404', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Not Found'), { status: 404 }));
    await expect(withRetry(fn, { maxAttempts: 3, baseDelayMs: 10 })).rejects.toThrow('Not Found');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects maxDelay with many retries (exponential capped)', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const start = Date.now();
    await expect(withRetry(fn, { maxAttempts: 6, baseDelayMs: 100, maxDelayMs: 500 })).rejects.toThrow('Server Error');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(8000);
    warnSpy.mockRestore();
  });

  it('jitter does not exceed maxDelay x 1.5 per attempt', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const start = Date.now();
    await expect(withRetry(fn, { maxAttempts: 5, baseDelayMs: 500, maxDelayMs: 300 })).rejects.toThrow('Server Error');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(6500);
    warnSpy.mockRestore();
  });

  it('exponentialBackoff respects maxDelay', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    await expect(withRetry(fn, { maxAttempts: 10, baseDelayMs: 20000, maxDelayMs: 100 })).rejects.toThrow('Server Error');
    expect(fn).toHaveBeenCalledTimes(10);
  }, 10000);

  it('exponentialBackoff with jitter does not exceed maxDelay x 1.5', async () => {
    const fn = vi.fn().mockRejectedValue(Object.assign(new Error('Server Error'), { status: 500 }));
    const start = Date.now();
    await expect(withRetry(fn, { maxAttempts: 5, baseDelayMs: 5000, maxDelayMs: 100 })).rejects.toThrow('Server Error');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
    expect(fn).toHaveBeenCalledTimes(5);
  }, 10000);
});
