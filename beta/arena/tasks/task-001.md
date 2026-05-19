# Task 001: 补齐测试覆盖

**来源**: decision-001.md
**截止**: 本轮结束前

## 给 dev-1: withRetry + getRepos 边界测试

文件: `src/__tests__/github.test.ts`

### withRetry 独立测试
- `withRetry` 函数本身没有被单独测试 — 现有测试只覆盖了 getRepo 调用它的副作用
- 需要加:
  1. 成功 case: fn 第一次就成功
  2. 重试后成功: fn 前 2 次抛 retryable 错误，第 3 次成功
  3. 耗尽重试: fn 连续抛 3 次 retryable 错误，最终抛出
  4. 非重试错误: fn 抛 404/403，不重试直接抛出
  5. 指数退避: 验证 delay 在合理范围内（用 vi.spyOn 计时器）
- ⚠️ 注意: `withRetry` 是 github.ts 导出的函数，可以直接 import 测试

### getRepos 更多边界
- 已经有一个 `getRepos` 的测试在 `multi-watch.test.ts`，但需要补充:
  1. 空数组输入: `getRepos([])` 应该返回 `[]`
  2. 混合成功/失败: 部分 repo 失败时的行为
  3. 缓存命中: 第二次调用返回缓存数据

## 给 dev-2: renderDashboard + CLI 入口测试

文件: `src/__tests__/commands.test.ts`（已有，需要补充）  
+ 新文件: `src/__tests__/cli.test.ts`

### renderDashboard 渲染测试
现有只有 `renderBattle` 的测试，缺 `renderDashboard`:
1. 基本渲染: 传入一个 RepoSnapshot（无 previous），console.log 被调用
2. delta 显示: 传入 snapshot + previous（有 star 变化），验证 console.log 中的 delta 格式
3. 空字段: language/license/description 为 null 时渲染不报错

### index.ts CLI 入口测试
新文件 `cli.test.ts`:
1. `run` 函数存在且是 function
2. 程序解析 `--version` 返回版本号
3. 程序解析 `--help` 显示帮助文本
4. 程序在空参数时不崩溃

