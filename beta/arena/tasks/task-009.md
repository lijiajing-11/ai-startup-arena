# Task 009: Cycle 8 — `rs history` 星史趋势图命令 (dev-1)

**来源**: decision-008.md — 线 1
**截止**: 本轮结束前
**周期**: Cycle 8
**执行者**: dev-1

---

## 任务: 实现 `rs history <repo>` 命令

### 设计规格

创建 `src/commands/history.ts`（或者放在已有文件里，按代码组织最佳方式决定）。

**输出示例**（有 chalk 颜色）:

```
facebook/react — Star History
  245,114 stars over 4,758 days · 51.7/day 🔥 Hypersonic

  Growth Velocity:
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰  Latest 3mo: 85/day (Hypersonic)
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰    Last year:   42/day (Rapid)
  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰     All time:   52/day (Hypersonic)

  Star Milestones:
  1,000  ★ Day 46    (2013-07-09)
  10,000  ★ Day 332   (2014-04-20)
  100,000 ★ Day 957   (2016-01-05)
  245,114 ★ Today

  Age: 13.0 years  |  Avg. 51.7 stars/day
```

**关键设计决策：**
- 使用 `getRepo()` 获取 repo 基本信息，不需要额外的 API 调用（避免分页问题）
- 星数历史 = 从创建时间到现在的推算（因为真实 stargazers 数据需要分页）
- 用 repo 中已有的 `createdAt`, `updatedAt`, `stars` 字段推算趋势
- 里程碑：按对数刻度选取关键节点（1, 10, 100, 1K, 10K, 100K）
- 区块条（progress bar style）用 chalk 做彩色渲染

**实现要点：**
1. 在 `src/commands/history.ts` 创建 `historyCommand(repoStr)` 函数
2. 使用 `getRepo()` 获取数据
3. 星速推算 = stars / daysSinceCreation  
4. 近3月星速 = 根据 updatedAt + stars 趋势估算（也可以用 `stars * (90/daysSinceCreation)` 做简单推算）
5. 里程碑用对数刻度模拟
6. 进度条 = `chalk.green('▰'.repeat(count)) + chalk.gray('▱'.repeat(remainder))`
7. 在 `index.ts` 注册 `.command('history <repo>')`

### 注册到 index.ts

```typescript
import { historyCommand } from './commands/history.js';

// 在 run() 中
program
  .command('history <repo>')
  .description('Star history trend — velocity, milestones, growth phases')
  .action(async (repo: string) => {
    try {
      await historyCommand(repo);
    } catch (err: any) {
      console.error(`✗ Error: ${err.message}`);
      process.exit(1);
    }
  });
```

### 类型定义更新 (models.ts)

在 models.ts 中可能不需要新类型，但如果有需要可以加 `HistoryResult` interface。

### 基础设施 (P1)

1. **coverage 修复**: 检查 `npm run coverage` 为什么超时。可能是 `@vitest/coverage-v8` 版本问题。尝试：
   - `npm install @vitest/coverage-v8@latest --legacy-peer-deps --save-dev`
   - 更新 vitest.config.ts 降低 timeout
2. **bump 版本**: `package.json` 版本从 `0.2.0` 到 `0.2.1`

### 测试 (追加，而非新建文件)

在 `src/__tests__/commands.test.ts` 中追加 history 命令的测试：

```typescript
describe('history command', () => {
  it('should export historyCommand function', async () => {
    const historyModule = await import('../commands/history.js');
    expect(typeof historyModule.historyCommand).toBe('function');
  });
});
```

### 验证步骤

```bash
npm test          # 75+ passed (全绿)
npm run build     # 通过
node dist/index.js history facebook/react   # 检查输出效果
node dist/index.js history torvalds/linux   # 检查另一个仓库
```

---

## 参考资料

- Insight 命令 (`src/commands/insight.ts`) — 可以用类似的渲染模式
- Star 速度标签函数 `starSpeedLabel` — 已存在，可直接复用或 import
- 进度条渲染: `chalk.green('▰')`, `chalk.gray('▱')`
