# Task 014: Cycle 10 — 修复 `3 repos calls getRepos` 测试 (dev-2)

**来源**: decision-010.md — 失败测试 1
**截止**: 本轮结束前
**周期**: Cycle 10
**执行者**: dev-2 🚀

---

## 任务: 修复 `3 repos calls getRepos (not battleRepos)` 测试

在 `src/__tests__/commands.test.ts` 中：

### 失败输出

```
FAIL src/__tests__/commands.test.ts > battleMultiRepos > 3 repos calls getRepos (not battleRepos)
TypeError: Cannot destructure property 'data' of 'repoResponse' as it is undefined.
```

### 根因分析

调用链：
```
battleMultiRepos(['a/a', 'b/b', 'c/c']) 
  → getRepos(['a/a', 'b/b', 'c/c'])  // github.ts:177
    → getRepo('a/a'), getRepo('b/b'), getRepo('c/c')  // github.ts 的 forEach
      → octokit.rest.repos.get({ owner, repo: name })  // github.ts:98
        → 返回的结果被解构 const { data } = repoResponse  // github.ts:104
```

**当前 mock 状态：**

顶层 mock (第 5-12 行):
```typescript
vi.mock('@octokit/rest', () => {
  const mockGet = vi.fn();
  const mockGetAllTopics = vi.fn();
  const MockOctokit = vi.fn(() => ({
    rest: { repos: { get: mockGet, getAllTopics: mockGetAllTopics } },
  }));
  return { Octokit: MockOctokit };
});
```

测试级 mock (第 564-587 行):
```typescript
const { Octokit } = await import('@octokit/rest');
const mockOctokit = vi.mocked(Octokit);
mockOctokit.prototype.rest = {
  repos: {
    get: vi.fn().mockResolvedValue({
      data: { full_name: 'test/mock', description: null, language: 'TypeScript',
        license: { spdx_id: 'MIT' },
        stargazers_count: 100, forks_count: 10, open_issues_count: 5,
        created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
        pushed_at: '2024-01-01T00:00:00Z', homepage: null, default_branch: 'main' } }),
    getAllTopics: vi.fn().mockResolvedValue({ data: { names: [] } }),
  },
} as any;
```

**问题**: 这个测试试图通过 `mockOctokit.prototype.rest = {...}` 来覆盖 mock。但顶层 mock 的 `MockOctokit = vi.fn(() => ({ rest: { ... } }))` 是一个**没有 prototype 链**的硬编码对象工厂 — 原型修改根本不会被读到。

当 `github.ts:getRepo()` 调用 `new Octokit()`，顶层 mock constructor 返回 `{ rest: { repos: { get: mockGet, getAllTopics: mockGetAllTopics } } }`，这里 `mockGet` 是顶层 mock 创建时的 `vi.fn()`，默认返回 `undefined`。所以 `mockGet()` 返回 `undefined`，`repoResponse` 是 `undefined`，然后 `const { data } = undefined` 崩溃。

### 修复方案

**推荐**: 移除 `prototype` 覆盖模式，用 `mockImplementation` 设置顶层 mock 的 mockGet：

#### Step 1: 准备 mock 响应辅助函数

在测试用例开头，参考 `github.test.ts` 找到它们的 `makeApiResponse` 辅助函数模式，或者直接写一个新的 mockGet：

```typescript
const fakeRepoResponse = {
  data: {
    full_name: 'test/mock',
    description: null,
    language: 'TypeScript',
    license: { spdx_id: 'MIT' },
    stargazers_count: 100,
    forks_count: 10,
    open_issues_count: 5,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    homepage: null,
    default_branch: 'main',
  },
};

const fakeTopicsResponse = {
  data: { names: [] },
};
```

#### Step 2: 改写测试用例

从第 564 行开始，用 `vi.mocked` 获取 mock 函数并设置返回值：

```typescript
it('3 repos calls getRepos (not battleRepos)', async () => {
  // 获取顶层 mock 的 mock 函数
  const { Octokit } = await import('@octokit/rest');
  const MockOctokit = vi.mocked(Octokit);
  const instance = new MockOctokit(); // 触发构造函数拿到实例
  const mockGet = instance.rest.repos.get as any;
  const mockTopics = instance.rest.repos.getAllTopics as any;

  // 设置两次调用的返回值（一次 repoget，一次 getAllTopics）× 3 个 repo
  mockGet.mockResolvedValue(fakeRepoResponse);
  mockTopics.mockResolvedValue(fakeTopicsResponse);

  const { battleMultiRepos } = await import('../commands/watch.js');
  const result = await battleMultiRepos(['a/a', 'b/b', 'c/c']);
  
  expect(result.repos).toHaveLength(3);
  expect(result.winner).toBe('test/mock');
  expect(mockGet).toHaveBeenCalledTimes(3);
});
```

**关键点**:
- `vi.mocked(Octokit)` 拿到 mock constructor
- `new MockOctokit()` 创建实例，拿到 `mockGet` 和 `mockTopics`
- 顶层 mock 里 `mockGet` 是同一个 `vi.fn()` 引用，所以 `mockResolvedValue` 对所有调用生效
- `getRepo` 内部调用 `octokit.rest.repos.get(...)` → `mockGet(...)` → resolvedValue

#### Step 3: 在 beforeEach 中重置 mock

当前 beforeEach（第 543-547 行）写了一个空壳。改成真正重置：

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

但注意 `vi.clearAllMocks()` 会同时清除 vi.fn() 的调用历史和返回值。更精确的是：

```typescript
beforeEach(() => {
  const { Octokit } = vi.importMock('@octokit/rest') as any;
  // 不需要其他操作，mock implementation 不会被清除
});
```

或者直接删除那个空的 beforeEach。

### 验证

```bash
npm test            # 3 repos calls getRepos 测试通过
npm run build       # build 不受影响
```

### 参考

- `github.test.ts`: 看他们怎么 mock Octokit 响应结构的（已有 makeApiResponse 辅助函数模式）
- `src/github.ts` 第 95-123 行: `getRepo` 函数，看你 mock 响应要满足什么解构

### 不要碰什么

- ❌ 不要改顶层 `vi.mock('@octokit/rest')` 的结构
- ❌ 不要改 `src/` 下的生产代码
- ✅ 只改 `src/__tests__/commands.test.ts` 中的测试用例和 beforeEach
