# Task 003: 修复 AbortSignal 中断机制 + 补齐测试覆盖

**来源**: decision-003.md
**截止**: 本轮结束前

---

## 给 dev-1: AbortSignal 中断修复 + renderDashboard 测试

### 1. 修复 `watchMultiRepos` 的 AbortSignal 事件监听

**文件**: `src/commands/watch.ts`

**当前的问题**:

```typescript
// 当前实现 — 只依赖 setInterval 内部检查 signal?.aborted
return new Promise((resolve) => {
  const timer = setInterval(async () => {
    if (signal?.aborted) {
      clearInterval(timer);
      // ... resolve()
      return;
    }
    await tick();
  }, interval * 1000);
});
```

如果 interval=9999（测试场景）或 interval=600（用户场景），从 `abortController.abort()` 到实际中断最多要等 interval 秒。

**修复方式**：

在 `new Promise` 内部挂载 AbortSignal 的 `'abort'` 事件监听，让 abort 能立即中断：

```typescript
return new Promise((resolve) => {
  // 立即响应 abort 信号，不等下一个 interval tick
  const onAbort = () => {
    clearInterval(timer);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    console.log(chalk.cyan(`\n📊 Multi-watch summary: ${mins}m ${secs}s watched for ${repoStrs.length} repos`));
    resolve();
  };

  if (signal) {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  const timer = setInterval(async () => {
    if (signal?.aborted) {
      clearInterval(timer);
      if (signal) signal.removeEventListener('abort', onAbort);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      console.log(chalk.cyan(`\n📊 Multi-watch summary: ${mins}m ${secs}s watched for ${repoStrs.length} repos`));
      resolve();
      return;
    }
    await tick();
  }, interval * 1000);
});
```

### 2. 同时对 `watchRepo` 做同样的修复

**文件**: `src/commands/watch.ts`

`watchRepo` 也有完全相同的 `new Promise` + `setInterval` + `signal?.aborted` 模式。同样的修复策略：

```typescript
return new Promise((resolve) => {
  const onAbort = () => {
    clearInterval(timer);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    console.log(chalk.cyan(`\n📊 Watch summary: ${mins}m ${secs}s watched, ${totalGrowth > 0 ? '+' : ''}${totalGrowth} new stars`));
    resolve();
  };

  if (signal) {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  const timer = setInterval(async () => {
    if (signal?.aborted) {
      clearInterval(timer);
      if (signal) signal.removeEventListener('abort', onAbort);
      // ... same resolve logic
      resolve();
      return;
    }
    await tick();
  }, interval * 1000);
});
```

⚠️ `watchRepo` 中 `totalGrowth` 是外部 `let` 变量，在 `onAbort` 闭包中可访问。

### 3. renderDashboard 渲染测试

**文件**: `src/__tests__/commands.test.ts` 追加在现有 describe 块后

需要加的测试：

```typescript
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

  it('renders dashboard without previous (initial state)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { renderDashboard } = await import('../commands/watch.js');
    const snapshot: RepoSnapshot = { repo: makeRepo(), timestamp: new Date() };
    renderDashboard(snapshot);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders dashboard with delta display', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
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
  });

  it('handles null description/license/language', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
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
  });
});
```

注意：这些测试是 `async` 的（因为用了 `await import`），而且 `renderDashboard` 调用了 `console.clear()`——在 test 中需要 mock 掉或者让它静默。

---

## 给 dev-2: multi-watch 测试修复 + withRetry 测试

### 1. 修复 multi-watch.test.ts 的 3 个超时测试

**文件**: `src/__tests__/multi-watch.test.ts`

**根因**: 测试中 `watchMultiRepos` 传的 interval=9999（秒），导致 `setInterval` 的第一个 tick 要 9999 秒后才触发。测试在 100ms 后 `abortController.abort()`，但 `signal?.aborted` 检查只在下一次 interval tick 执行。

**修复方案（二选一）**：

**方案 A（推荐）**：将 interval 改为很小的值（比如 1），让 setInterval 触发后再 abort 来检查中断行为：

```typescript
it('single tick with JSON output does not throw', async () => {
  // ...
  const promise = watchMultiRepos(
    ['facebook/react', 'vercel/next.js'],
    1,  // 1 second interval instead of 9999
    true,
    abortController.signal
  );

  await new Promise((r) => setTimeout(r, 1100));  // wait for first tick (1s interval)
  abortController.abort();
  await promise;
  // ...
}, 5000);
```

**方案 B**：等 dev-1 修好了 AbortSignal 事件监听后，保持 interval=9999，100ms 后 abort，确认 Promise 立即 resolve：

```typescript
it('single tick with JSON output does not throw', async () => {
  // ...
  const promise = watchMultiRepos(
    ['facebook/react', 'vercel/next.js'],
    9999,
    true,
    abortController.signal
  );

  await new Promise((r) => setTimeout(r, 100));  // wait for first tick
  abortController.abort();
  await promise;  // should resolve immediately now, not wait 9999s
  // ...
}, 5000);
```

**建议**：如果你的 Priority 是最快让测试绿灯——用方案 A（独立可验证）。如果你信任 dev-1 的修复——用方案 B（测试 AbortSignal 事件，更有价值）。

### 2. withRetry 独立测试

**文件**: `src/__tests__/github.test.ts`（追加）

```typescript
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
});
```

注意需要 `import { withRetry } from '../github.js'`。

### 3. 清理共享 chalk mock 引用

如果 `commands.test.ts` 里的 chalk mock 和共享 `__mocks__/chalk.ts` 不兼容或有重复，建议统一使用共享 mock。

## 验收标准

1. `npm test` 全部通过，0 failed
2. renderDashboard: 3 个新测试（初始状态、delta 显示、null 字段）
3. withRetry: 5 个新测试（一次成功、重试成功、耗尽失败、403、404）
4. 共享 chalk mock 不会被多个文件重复定义
5. 旧测试全部通过（commands.test.ts 8 个、github.test.ts 21 个、models.test.ts 6 个）
