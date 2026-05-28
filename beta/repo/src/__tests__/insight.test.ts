import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRepo } from '../github.js';

vi.mock('../github.js', () => ({
  getRepo: vi.fn(),
}));

describe('insightCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRepo).mockResolvedValue({
      fullName: 'facebook/react',
      stars: 230000,
      forks: 47000,
      openIssues: 1200,
      language: 'TypeScript',
      license: 'MIT',
      topics: ['react', 'ui', 'frontend'],
      createdAt: '2013-05-29T21:18:12Z',
      updatedAt: new Date().toISOString(),
      pushedAt: new Date().toISOString(),
      description: 'A declarative UI library',
      homepage: 'https://react.dev',
      owner: 'facebook',
      name: 'react',
      defaultBranch: 'main',
      size: 1000,
      watchers: 10000,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);
  });

  it('输出包含仓库 fullName', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('facebook/react')
    );
    logSpy.mockRestore();
  });

  it('输出包含 star 数量', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('230000')
    );
    logSpy.mockRestore();
  });

  it('输出 star 速度标签', async () => {
    // 用近一点的时间让 starsPerDay > 50
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'fast/repo',
      stars: 100000,
      forks: 5000,
      openIssues: 200,
      language: 'TypeScript',
      license: 'MIT',
      topics: ['fast'],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      pushedAt: new Date().toISOString(),
      description: 'Fast growing repo',
      homepage: 'https://fast.dev',
      owner: 'fast',
      name: 'repo',
      defaultBranch: 'main',
      size: 500,
      watchers: 100,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('fast/repo');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rapid')
    );
    logSpy.mockRestore();
  });

  it('输出 topics', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('#react')
    );
    logSpy.mockRestore();
  });

  it('输出 license', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('MIT')
    );
    logSpy.mockRestore();
  });

  it('处理零 stars', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'empty/repo',
      stars: 0,
      forks: 0,
      openIssues: 0,
      language: 'TypeScript',
      license: null,
      topics: [],
      createdAt: '2024-06-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      description: null,
      homepage: null,
      owner: 'empty',
      name: 'repo',
      defaultBranch: 'main',
      size: 1,
      watchers: 0,
      isPrivate: false,
      hasIssues: false,
      hasWiki: false,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('empty/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('0 stars');
    expect(allOutput).toContain('Stale');
    logSpy.mockRestore();
  });

  it('处理无 topics → "None"', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'no-topics/repo',
      stars: 100,
      forks: 10,
      openIssues: 5,
      language: 'Go',
      license: 'Apache-2.0',
      topics: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      description: 'No topics repo',
      homepage: null,
      owner: 'no-topics',
      name: 'repo',
      defaultBranch: 'main',
      size: 100,
      watchers: 10,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('no-topics/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('None');
    logSpy.mockRestore();
  });

  it('处理无 license → "None"', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'no-license/repo',
      stars: 100,
      forks: 10,
      openIssues: 5,
      language: 'Python',
      license: null,
      topics: ['python'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      description: null,
      homepage: null,
      owner: 'no-license',
      name: 'repo',
      defaultBranch: 'main',
      size: 100,
      watchers: 10,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('no-license/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('None');
    logSpy.mockRestore();
  });

  it('处理无语言 → "N/A"', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'no-lang/repo',
      stars: 100,
      forks: 10,
      openIssues: 5,
      language: null,
      license: 'MIT',
      topics: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      description: null,
      homepage: null,
      owner: 'no-lang',
      name: 'repo',
      defaultBranch: 'main',
      size: 100,
      watchers: 10,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('no-lang/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('N/A');
    logSpy.mockRestore();
  });

  it('处理无 description → 不输出描述行', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'no-desc/repo',
      stars: 100,
      forks: 10,
      openIssues: 5,
      language: 'Rust',
      license: 'MIT',
      topics: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-06-01T00:00:00Z',
      pushedAt: '2024-06-01T00:00:00Z',
      description: null,
      homepage: null,
      owner: 'no-desc',
      name: 'repo',
      defaultBranch: 'main',
      size: 100,
      watchers: 10,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('no-desc/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    // With description=null, the description line should NOT appear
    // The code does: if (repo.description) { console.log(description) }
    // So description should NOT be in output
    expect(allOutput).not.toContain('A declarative');
    logSpy.mockRestore();
  });

  it('处理刚创建的仓库 → 速度 0', async () => {
    const today = new Date().toISOString();
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'fresh/repo',
      stars: 0,
      forks: 0,
      openIssues: 0,
      language: null,
      license: null,
      topics: [],
      createdAt: today,
      updatedAt: today,
      pushedAt: today,
      description: null,
      homepage: null,
      owner: 'fresh',
      name: 'repo',
      defaultBranch: 'main',
      size: 1,
      watchers: 0,
      isPrivate: false,
      hasIssues: false,
      hasWiki: false,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('fresh/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('0.0/day');
    logSpy.mockRestore();
  });

  it('不抛出异常', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await expect(insightCommand('facebook/react')).resolves.not.toThrow();
    logSpy.mockRestore();
  });

  it('至少调用了 console.log', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('输出速度 emoji 图标', async () => {
    vi.mocked(getRepo).mockResolvedValueOnce({
      fullName: 'steady/repo',
      stars: 1000,
      forks: 100,
      openIssues: 50,
      language: 'Python',
      license: 'MIT',
      topics: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      pushedAt: new Date().toISOString(),
      description: 'Steady',
      homepage: null,
      owner: 'steady',
      name: 'repo',
      defaultBranch: 'main',
      size: 100,
      watchers: 50,
      isPrivate: false,
      hasIssues: true,
      hasWiki: true,
      archived: false,
      disabled: false,
      fork: false,
    } as any);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('steady/repo');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    // ~1000 stars / ~1250 days ≈ 0.8/day → Slow (0.5-3)
    expect(allOutput).toContain('Slow');
    expect(allOutput).toContain('/day');
    logSpy.mockRestore();
  });

  it('输出创建日期格式 YYYY-MM-DD', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    const allOutput = logSpy.mock.calls.map(c => String(c[0])).join('\n');
    expect(allOutput).toContain('2013-05-29');
    logSpy.mockRestore();
  });
});
