# Task 007: Cycle 7 — 修 coverage 毒瘤 + `rs insight` 深度洞察命令

**来源**: decision-007.md
**截止**: 本轮结束前
**周期**: Cycle 7

---

## 给 dev-1: 基础设施修复 + 新功能

### 1. 🔧 P0: 修 coverage 毒瘤

**问题**: `@vitest/coverage-v8` 在 `package.json` 里有声明 (`"^3.2.4"`) 但在 lockfile 里版本冲突，导致 `npm install` 卡住。

**优先尝试方案**（按顺序）：

**方案 A**: 直接修 lockfile
```bash
# 1. 从 package-lock.json 中删除旧 @vitest/coverage-v8 entry
# 2. 然后重装
npm install @vitest/coverage-v8@3.2.4 --save-dev --legacy-peer-deps
```

**方案 B**: 如果 A 失败，完整重装
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**验证**:
```bash
npx vitest run --coverage
# 应输出 coverage 报告，阈值 50%
```

**确认 `coverage` script 存在**:
检查 `package.json` 的 `scripts` 是否有 `"coverage": "vitest run --coverage"`，如果没有就加上。

### 2. 🚀 P0: `rs insight` 命令

**新文件**: `src/commands/insight.ts`

`rs insight <repo>` 输出仓库深度洞察，比 `stars` 更丰富。

```typescript
import chalk from 'chalk';
import { getRepo } from '../github.js';

interface InsightData {
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  topics: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
  starsPerDay: number;      // stars / repo age in days
  starSpeedLabel: string;   // "🔥 hot" / "📈 steady" / "💤 slow"
}

export async function insightCommand(repoStr: string): Promise<void> {
  // Fork API doesn't easily return all needed fields from getRepo.
  // Use getRepo (which calls octokit.rest.repos.get) to get full repo data.
  // Actually we need the Octokit response's data object directly.
  // So: import { octokit } from '../github.js' OR call getRepo and get extra fields.
  
  // Best approach: add a function in github.ts that returns the full data, 
  // or just use getRepo and calculate from what we have.
  
  // For now, use getRepo then calculate:
  const repo = await getRepo(repoStr);
  
  // repo comes from models.ts which has: fullName, stars, forks, openIssues, language, license
  // But insight needs more: topics, description, createdAt, updatedAt
  // 
  // SO: We need to either:
  // Option 1: Extend RepoData in models.ts with new fields
  // Option 2: Make a direct API call in insight.ts
  //
  // Option 1 is cleanest. Add to models.ts:
  //   topics: string[];
  //   description: string;
  //   createdAt: string;
  //   updatedAt: string;
  // And update github.ts's getRepo to populate them.
}
```

**重要**: 见上面注释——需要改 `models.ts` 和 `github.ts`。具体步骤：

**Step 2a**: 扩展 `models.ts` — 在 `RepoData` 中加入新字段

```typescript
export interface RepoData {
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  topics: string[];        // NEW
  description: string;      // NEW
  createdAt: string;        // NEW — ISO date string
  updatedAt: string;        // NEW — ISO date string
}
```

**Step 2b**: 更新 `github.ts` 的 `getRepo` 函数——在构造 RepoData 时填入新字段

```typescript
// 在 getRepo 函数中，大约 70-90 行处
return {
  fullName: data.full_name,
  stars: data.stargazers_count,
  forks: data.forks_count,
  openIssues: data.open_issues_count,
  language: data.language,
  license: data.license?.spdx_id ?? null,
  topics: data.topics ?? [],           // NEW
  description: data.description ?? '',  // NEW
  createdAt: data.created_at,           // NEW
  updatedAt: data.updated_at,           // NEW
};
```

**Step 2c**: 创建 `src/commands/insight.ts`

```typescript
import chalk from 'chalk';
import { getRepo } from '../github.js';

export async function insightCommand(repoStr: string): Promise<void> {
  const repo = await getRepo(repoStr);
  
  // Calculate star velocity
  const createdAt = new Date(repo.createdAt);
  const daysSinceCreation = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  const starsPerDay = repo.stars / daysSinceCreation;
  
  let starSpeedLabel: string;
  if (starsPerDay > 50) starSpeedLabel = '🔥 Hypersonic';
  else if (starsPerDay > 10) starSpeedLabel = '📈 Rapid';
  else if (starsPerDay > 3) starSpeedLabel = '📊 Steady';
  else if (starsPerDay > 0.5) starSpeedLabel = '💤 Slow';
  else starSpeedLabel = '🪦 Stale';
  
  // Build topics display
  const topicsDisplay = repo.topics.length > 0 
    ? repo.topics.slice(0, 5).map(t => chalk.cyan(`#${t}`)).join(' ')
    : chalk.dim('None');
  
  // Last updated relative time
  const updatedAt = new Date(repo.updatedAt);
  const daysSinceUpdate = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const updatedStr = daysSinceUpdate === 0 ? 'Today' 
    : daysSinceUpdate === 1 ? 'Yesterday'
    : `${daysSinceUpdate} days ago`;
  
  // ── Render ──
  console.log(`\n${chalk.bold.hex('#58a6ff')(repo.fullName)} ${chalk.dim('— Insight')}`);
  if (repo.description) {
    console.log(`  ${chalk.gray(repo.description)}\n`);
  }
  
  console.log(`  ${chalk.yellow('★')} ${chalk.bold(String(repo.stars))} stars  ·  ${chalk.bold(String(starsPerDay.toFixed(1)))}/day  ${starSpeedLabel}`);
  console.log(`  ${chalk.cyan('⑂')} ${repo.forks} forks  ·  ⚠ ${repo.openIssues} open issues`);
  console.log(`  ${chalk.gray('⎆')} ${repo.language || chalk.dim('N/A')}  ·  ${chalk.gray('©')} ${repo.license || chalk.dim('None')}`);
  console.log(`  🏷  ${topicsDisplay}`);
  console.log(`  ${chalk.gray('📅')} Created ${repo.createdAt.slice(0, 10)}  ·  Last updated ${updatedStr}`);
  console.log();
}
```

**Step 2d**: 在 `src/index.ts` 注册 `insight` 命令

在现有命令后面加：
```typescript
import { insightCommand } from './commands/insight.js';

// 在 program 定义中：
program
  .command('insight <repo>')
  .description('Deep repository insight — star velocity, topics, age, and more')
  .action(async (repo: string) => {
    try {
      await insightCommand(repo);
    } catch (err: any) {
      console.error(`✗ Error: ${err.message}`);
      process.exit(1);
    }
  });
```

**验证**:
```bash
npx tsx src/index.ts insight facebook/react
# 应输出带 chalk 颜色的深度洞察
```

### 3. 验证全部通过

```bash
npm test          # ≥ 61 passed
npm run build     # tsup 构建成功
npm run coverage  # coverage 报告输出（阈值 50%）
```

---

## 给 dev-2: 测试 + 稳定性

### 1. 🧪 `insight` 命令测试

在 `src/__tests__/commands.test.ts` 中追加 `insightCommand` 的 describe 块（至少 2 个测试）：

```typescript
import { insightCommand } from '../commands/insight.js';

// 在文件末尾加：
describe('insightCommand', () => {
  it('exports insightCommand as a function', () => {
    expect(typeof insightCommand).toBe('function');
  });

  it('renders insight output without throwing', async () => {
    // Mock getRepo to return insight-compatible data
    // Then call insightCommand and check console.log
  });
});
```

**注意**: `insightCommand` 需要 `getRepo` 返回新字段（topics, description, createdAt, updatedAt）。mock 时记得返回这些字段。

### 2. 🧪 `models.ts` 测试扩展

在 `src/__tests__/models.test.ts` 追加至少 2 个测试：

- 测试 `RepoData` 新字段的默认值处理（空 topics 数组）
- 测试 `formatNumber` 的 edge case（0, 很大小数）

### 3. 验证

```bash
npm test   # 全部通过
```

---

## 给 mkt: README 更新

等到 dev-1 和 dev-2 都完成后，再更新 README：

1. 在命令参考中加入 `insight` 命令文档
2. 加一个 `insight` 的 ASCII gallery（类似 watch-multi 的展示方式）
3. 如果 coverage 通了，加 coverage badge（等 coverage 报告确认后有数值再放，或者用 shields.io 动态 badge）

**注意**: 先等 coverage 修好再更新 README 的 badge 部分。
