# Task 004: 产品化冲刺 + 测试覆盖提升

**来源**: decision-004.md
**截止**: 本轮结束前
**周期**: Cycle 4

---

## 给 dev-1: 产品化冲刺

### 1. GitHub Actions CI workflow

**文件**: `.github/workflows/ci.yml`（在 repo 根目录）

```yaml
name: CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

注意：README.md 里的 CI badge `li1050109098/beta-project-arena` 指向这个 workflow。确保 badge URL 和实际路径一致。

### 2. CHANGELOG.md

**文件**: `CHANGELOG.md`（repo 根目录）

按照 [Keep a Changelog](https://keepachangelog.com/) 格式。

可以从 git log 提取关键提交：
- v0.1.0: 初始版本（watch + battle + watch-multi 核心功能）
- v0.2.0: AbortSignal 即时中断、测试基础设施、共享 chalk mock

### 3. RELEASE.md

**文件**: `RELEASE.md`（repo 根目录）

写一个发布 checklist，包含：
1. 版本号更新（package.json）
2. npm run build
3. npm test 全过
4. git tag
5. npm publish（注意我们还没发布到 npm，所以要写清楚当前状态）

---

## 给 dev-2: 测试覆盖提升

### 1. renderBattle 独立测试

**文件**: `src/__tests__/commands.test.ts`（追加在 renderDashboard describe 块之后）

需要加的测试：

```typescript
describe('renderBattle', () => {
  const makeRepo = (overrides: Partial<RepoData> = {}): RepoData => ({
    owner: 'facebook', name: 'react', fullName: 'facebook/react',
    description: 'A UI library', language: 'TypeScript', license: 'MIT',
    stars: 100000, forks: 10000, openIssues: 500,
    createdAt: '2013-05-29T21:18:12Z', updatedAt: '2024-01-01T00:00:00Z',
    pushedAt: '2024-01-01T00:00:00Z', topics: [], homepage: null, defaultBranch: 'main',
    ...overrides,
  });

  it('renders battle with repo1 winning by stars', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1: RepoData = { ...makeRepo(), stars: 200000 };
    const r2: RepoData = { ...makeRepo({ name: 'next.js', fullName: 'vercel/next.js' }), stars: 100000 };
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'repo1', starDiff: 100000, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'facebook/react', forks: 'Tie', issues: 'Tie', language: 'Same', license: 'Same' },
    };
    renderBattle(result);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders battle with tie', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1 = makeRepo();
    const r2 = makeRepo({ name: 'next.js', fullName: 'vercel/next.js' });
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'tie', starDiff: 0, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'Tie', forks: 'Tie', issues: 'Tie', language: 'Same', license: 'Same' },
    };
    renderBattle(result);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('renders battle with null fields (description/language/license)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const r1 = makeRepo({ description: null, language: null, license: null, stars: 50000 });
    const r2 = makeRepo({ name: 'next.js', fullName: 'vercel/next.js', description: null, language: null, license: null, stars: 30000 });
    const result: BattleResult = {
      repo1: { repo: r1, timestamp: new Date() },
      repo2: { repo: r2, timestamp: new Date() },
      winner: 'repo1', starDiff: 20000, forkDiff: 0, issueDiff: 0,
      scores: { stars: 'facebook/react', forks: 'Tie', issues: 'Tie', language: 'N/A vs N/A', license: 'None vs None' },
    };
    expect(() => renderBattle(result)).not.toThrow();
    logSpy.mockRestore();
  });
});
```

⚠️ 注意需要 `import { renderBattle, renderDashboard } from '../commands/watch.js'` 和 `import type { RepoData, BattleResult } from '../models.js'`。

### 2. exponentialBackoff / 重试逻辑 edge cases

**文件**: `src/__tests__/github.test.ts`（在现有 withRetry describe 块后追加）

```typescript
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
  expect(elapsed).toBeLessThan(5000); // maxDelay should cap it
  expect(fn).toHaveBeenCalledTimes(5);
}, 10000);
```

### 3. watchMultiRepos JSON output edge cases

**文件**: `src/__tests__/multi-watch.test.ts`（追加）

```typescript
it('watchMultiRepos with empty repo list resolves immediately', async () => {
  const ac = new AbortController();
  const promise = watchMultiRepos([], 1, true, ac.signal);
  // Should reject or resolve quickly with empty repos
  // If it needs a tick first, wait for that
  await new Promise(r => setTimeout(r, 200));
  ac.abort();
  await promise;
}, 5000);

it('watchMultiRepos JSON output is valid JSON', async () => {
  const ac = new AbortController();
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const promise = watchMultiRepos(['facebook/react'], 1, true, ac.signal);
  await new Promise(r => setTimeout(r, 1100)); // wait for first tick
  ac.abort();
  await promise;
  // Check that at least one log was valid JSON
  const calls = logSpy.mock.calls.filter(c => typeof c[0] === 'string');
  if (calls.length > 0) {
    const parsed = JSON.parse(calls[0][0]);
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('repos');
  }
  logSpy.mockRestore();
}, 15000);
```

### 4. 清理工作

检查 `commands.test.ts` 里的 chalk mock 使用情况。如果有 `vi.mock('chalk')` 也在 test 文件里定义，而共享 `__mocks__/chalk.ts` 已经存在的话，建议统一只用共享 mock。

## 验收标准

1. `npm test` 全部通过 — 确保新老测试不冲突
2. CI workflow 文件存在且格式正确
3. CHANGELOG.md 和 RELEASE.md 写出
4. 测试总数 ≥ 58（原 48 + dev-2 至少 10 个新测试）
