# Task 012: Cycle 9 — history 命令测试 + version bump (dev-1)

**来源**: decision-009.md — 线 2
**截止**: 本轮结束前
**周期**: Cycle 9
**执行者**: dev-1

---

## 任务: history 命令测试 + 基础设施修整

### Part A: history 命令测试

在 `src/__tests__/commands.test.ts` 末尾追加 history 命令测试。

**追加内容**:

```typescript
describe('historyCommand', () => {
  it('exports historyCommand as a function', async () => {
    const historyModule = await import('../commands/history.js');
    expect(typeof historyModule.historyCommand).toBe('function');
  });

  it('renders history output without throwing', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const githubModule = await import('../github.js');
    vi.spyOn(githubModule, 'getRepo').mockResolvedValue({
      owner: 'facebook',
      name: 'react',
      fullName: 'facebook/react',
      description: 'A UI library',
      language: 'TypeScript',
      license: 'MIT',
      stars: 245114,
      forks: 51065,
      openIssues: 1299,
      createdAt: '2013-05-29T21:18:12Z',
      updatedAt: '2026-05-18T00:00:00Z',
      pushedAt: '2026-05-18T00:00:00Z',
      topics: ['react', 'ui', 'frontend'],
      homepage: null,
      defaultBranch: 'main',
    });

    const { historyCommand } = await import('../commands/history.js');
    await historyCommand('facebook/react');

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('handles very new repo with minimal data', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const githubModule = await import('../github.js');
    vi.spyOn(githubModule, 'getRepo').mockResolvedValue({
      owner: 'test',
      name: 'new-repo',
      fullName: 'test/new-repo',
      description: null,
      language: null,
      license: null,
      stars: 5,
      forks: 0,
      openIssues: 0,
      createdAt: '2026-05-01T00:00:00Z',
      updatedAt: '2026-05-18T00:00:00Z',
      pushedAt: '2026-05-18T00:00:00Z',
      topics: [],
      homepage: null,
      defaultBranch: 'main',
    });

    const { historyCommand } = await import('../commands/history.js');
    await expect(historyCommand('test/new-repo')).resolves.not.toThrow();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
```

### Part B: version bump

`package.json`:
- `"version": "0.2.0"` → `"version": "0.2.1"`

### Part C: 确认 coverage 可用

```bash
npm run coverage
```

如果失败，执行：
```bash
npm install @vitest/coverage-v8@latest --legacy-peer-deps --save-dev
```

然后再次运行 `npm run coverage`。

### 验证步骤

```bash
npm test          # 75+ passed (全绿)
npm run coverage  # coverage 报告输出
npm run build     # build 通过
```
