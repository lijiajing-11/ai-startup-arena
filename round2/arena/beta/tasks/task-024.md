# Task 024: Cycle 18 — 测试翻倍 (dev-2) 🧪

**来源**: decision-015.md — 测试翻倍，从 94 → 150+
**截止**: Cycle 18 结束前
**周期**: Cycle 18
**执行者**: dev-2 🧪

---

## 任务: 为 insight、stars、snapshot、history 命令补充测试

### 背景

当前测试情况（94 个测试分布在 5 个文件）：

| 测试文件 | 当前测试数 | 说明 |
|:--------:|:---------:|------|
| `commands.test.ts` | 29 | watch/battle/snapshot 等复合测试 |
| `coverage.test.ts` | 8 | — |
| `models.test.ts` | 16 | interface 测试 |
| `multi-watch.test.ts` | 10 | — |
| `github.test.ts` | 31 | — |
| **Total** | **94** | — |

**缺失测试的命令**（没有专用测试文件）：

| 命令 | 文件 | 代码行 | 当前测试 | 目标 |
|:----:|:----:|:------:|:--------:|:----:|
| `insight` | `insight.ts` | 72 行 | **0** | **15+** |
| `stars` | `stars.ts` | 16 行 | **0** | **10+** |
| `snapshot` | `snapshot.ts` | 67 行 | **0**（部分测试在 commands.test.ts） | **15+** |
| `history` | `history.ts` | 133 行 | **0** | **15+** |

### 目标

- 新增 4 个测试文件
- 新增 55+ 测试
- 总测试数从 94 → **150+**（增长 60%）
- 全部通过，无污染

### 重要：mock 最佳实践

参考 `coverage.test.ts` 修复后的模式——**不要用顶层共享变量**，用 `vi.mocked()` 在每个测试/describe 块内动态控制：

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRepo } from '../github.js';

// 顶层 mock — 无状态，只用 vi.fn()
vi.mock('../github.js', () => ({
  getRepo: vi.fn(),
  formatNumber: vi.fn((n: number) => n.toLocaleString('en-US')),
}));

describe('insightCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 在每个测试前设置默认 mock 返回值
    vi.mocked(getRepo).mockResolvedValue({
      fullName: 'facebook/react',
      stars: 230000,
      forks: 47000,
      openIssues: 1200,
      language: 'TypeScript',
      license: 'MIT',
      topics: ['react', 'ui', 'frontend'],
      createdAt: '2013-05-29T21:18:12Z',
      updatedAt: '2024-01-01T00:00:00Z',
      pushedAt: '2024-01-01T00:00:00Z',
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

  it('logs repository full name', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { insightCommand } = await import('../commands/insight.js');
    await insightCommand('facebook/react');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('facebook/react')
    );
    logSpy.mockRestore();
  });
});
```

**关键规则：**
1. `vi.mock()` 在顶层（vitest 要求在文件顶部）
2. `vi.mocked(fn).mockReturnValue/ResolvedValue` 在 `beforeEach` 中设置默认值
3. `vi.clearAllMocks()` 在每个 `beforeEach` 中调用
4. 特定测试用 `vi.mocked(fn).mockReturnValue(x)` 覆盖默认值
5. 如果 mock 的模块被多个测试文件使用（如 `github.js`），确保每个测试文件的 mock 是隔离的

### 文件清单

#### 1. `src/__tests__/insight.test.ts` — 15+ 测试

测试 `insightCommand(repoStr)` 单仓库模式：

| # | 测试 | 说明 |
|:-:|------|------|
| 1 | 输出包含仓库 fullName | 验证 repo name 出现在输出中 |
| 2 | 输出包含 star 数量 | 验证 230,000 格式化 |
| 3 | 输出 star 速度标签 | "Hypersonic"、"Rapid" 等 |
| 4 | 输出 topics | 验证 topics 渲染 |
| 5 | 输出 license | MIT / None |
| 6 | 输出更新日期 | "Today"、"Yesterday"、"N days ago" |
| 7 | 处理零 stars | 边缘 case |
| 8 | 处理无 topics | topics=[] → "None" |
| 9 | 处理无 license | license=null → "None" |
| 10 | 处理无语言 | language=null → "N/A" |
| 11 | 处理无 description | description=null → 不输出描述行 |
| 12 | 处理刚创建的仓库 | createdAt = today → 速度 0 |
| 13 | 输出 star 速度图标 | 验证 emoji 正确性 |
| 14 | 不抛出异常 | 始终正常执行 |
| 15 | 输出调用 console.log | 至少调用了 console.log |

#### 2. `src/__tests__/stars.test.ts` — 10+ 测试

测试 `starsCommand(repoStr)`：

| # | 测试 | 说明 |
|:-:|------|------|
| 1 | 输出仓库名称 | chalk.bold 格式 |
| 2 | 输出 star 数量 | formatNumber 格式化 |
| 3 | 输出 fork 数量 | — |
| 4 | 输出 issue 数量 | — |
| 5 | 输出语言 | — |
| 6 | 输出 license | — |
| 7 | 处理零值 | stars=0, forks=0 |
| 8 | 处理大量值 | 大数字格式化 |
| 9 | 处理 null 语言 | → "N/A" |
| 10 | 不抛出异常 | — |

#### 3. `src/__tests__/snapshot.test.ts` — 15+ 测试

测试 `snapshotCommand(repoStr, options)`：

| # | 测试 | 说明 |
|:-:|------|------|
| 1 | 默认输出调用 renderSnapshot | 验证 table 渲染 |
| 2 | JSON 输出格式 | JSON.stringify 被调用 |
| 3 | JSON 输出包含 command 字段 | "snapshot" |
| 4 | JSON 输出包含 timestamp | ISO 格式 |
| 5 | JSON 输出包含 repo 字段 | owner/name |
| 6 | JSON 输出包含 data | 完整 RepoData |
| 7 | 处理 options.json=true | 走 JSON 分支 |
| 8 | 处理 options.json=false | 走 table 分支 |
| 9 | 处理小数字 | 格式化正确 |
| 10 | 处理大数字 | locale 格式化 |
| 11 | 处理无 topics | → "None" |
| 12 | 处理无 homepage | → "None" |
| 13 | 处理无 license | → "None" |
| 14 | 输出包含 "SNAPSHOT" 标题 | 验证 header |
| 15 | 不抛出异常 | — |

#### 4. `src/__tests__/history.test.ts` — 15+ 测试

测试 `historyCommand(repoStr)`：

| # | 测试 | 说明 |
|:-:|------|------|
| 1 | 输出包含仓库名称 | — |
| 2 | 输出 star 数量 | — |
| 3 | 计算 daysSinceCreation | 验证天数 |
| 4 | 计算 starsPerDay | — |
| 5 | 标签 "Hypersonic" (>50/day) | — |
| 6 | 标签 "Rapid" (10-50/day) | — |
| 7 | 标签 "Steady" (3-10/day) | — |
| 8 | 标签 "Slow" (0.5-3/day) | — |
| 9 | 标签 "Stale" (<0.5/day) | — |
| 10 | 输出 growth velocity bars | 验证 bar 渲染 |
| 11 | 输出 milestone 列表 | — |
| 12 | 最后 milestone 标 "Today" | — |
| 13 | 处理很老的仓库 | 大量天数 |
| 14 | 处理新仓库 | ~1 day old |
| 15 | 不抛出异常 | — |

### 执行顺序

1. `insight.test.ts` — 15 测试（最简单，纯 mock getRepo）
2. `stars.test.ts` — 10 测试（最简单命令）
3. `snapshot.test.ts` — 15 测试（两个分支：默认 + JSON）
4. `history.test.ts` — 15 测试（最复杂，涉及日期计算）

### 验证

```bash
npm test                    # → 150+ passed, 0 failed ✅
npm run build               # → exit 0 ✅
```

### 不要碰什么

- ❌ 不要改 `src/commands/*.ts` 中的逻辑代码
- ❌ 不要改已有的测试文件（commands.test.ts、coverage.test.ts 等）
- ❌ 不要改 package.json
- ❌ 不要删任何现有测试

---

*dev-2，Alpha 有 265 测试，我们只有 94。这是本轮最大的质量缺口。4 个测试文件、55+ 测试，让仲裁者看到 β-Labs 不只是 UI 漂亮——我们的代码经得起考验。按顺序来，每完成一个就跑全测试，确保无污染。🚀*
