# 架构文档（ARCHITECTURE）

本站是一个纯静态 AI 学习网站（HTML + CSS + 原生 JavaScript），部署在 GitHub Pages，无后端服务、无构建步骤。

## 整体数据流

```
assets/data/*.json  ──fetch()──▶  app.js 内存变量（let）  ──DOM 操作──▶  浏览器渲染
                                         ▲
                                         │
                              localStorage（用户进度持久化）
```

1. 页面加载时，`bootstrap()` 调用 `loadAllData()`，用 `fetch()` 并行拉取 `assets/data/` 下的 18 个 JSON 文件。
2. 拉取结果写入 `app.js` 顶层的 `let` 变量（如 `tracks`、`weeks`、`models` 等）。
3. 一系列 `renderXxx()` 函数读取这些变量，通过 `innerHTML` / DOM 操作渲染到 `index.html` 中对应的 `<section>`。
4. 用户的签到、周任务完成状态、项目点亮、XP 等写入 `localStorage`，下次访问时恢复。

## 关键文件与职责

| 文件 | 职责 |
|------|------|
| `index.html` | 唯一入口页面，包含所有 `<section>` 区块骨架、SEO meta、结构化数据（JSON-LD） |
| `app.js` | 全部交互逻辑：数据加载、路由、渲染、状态管理、游戏化、导出、云同步（约 2868 行） |
| `styles.css` | 全站样式，含响应式布局、深色卡片、移动端适配 |
| `assets/data/*.json` | 18 个数据文件，存放学习路线、角色卡、模型对比、项目挑战等全部内容 |
| `assets/monthly-updates.json` | 月度更新内容（与 `monthly-fallback.json` 互补，优先加载本文件） |
| `scripts/validate-content.js` | 内容校验脚本，检查 JSON 合法性、必填字段、SEO 文件完整性 |
| `.nojekyll` | 告诉 GitHub Pages 不要运行 Jekyll，直接发布原始文件 |
| `robots.txt` / `sitemap.xml` / `llms.txt` | SEO 与 LLM 爬虫指引 |

## 渲染模式：SPA + `?page=` 参数

本站是单页应用（SPA），所有内容区块以 `<section>` 形式写在 `index.html` 的 `<main>` 中，通过显示/隐藏切换。

### 路由流程

```
浏览器 URL  ──▶  getRequestedPageId()  ──▶  applyCurrentPage()  ──▶  renderCurrentPageContent()
  ?page=map        读取 search / hash        切换 section 显隐        渲染对应内容
```

- `getRequestedPageId()`：从 `location.search` 的 `page` 参数或 `location.hash` 中取出页面 ID，不在 `PAGE_IDS` 列表则回退到 `home`。
- `applyCurrentPage()`：遍历 `main > .section`，匹配的添加 `page-active` 类并取消 `hidden`，其余隐藏；同时更新 `document.title`、`body[data-page]`、导航高亮。
- `syncPageUrl()`：用 `history.pushState` / `replaceState` 更新 URL，不触发刷新。
- `popstate` 事件监听浏览器前进/后退，重新渲染对应页面。

### 支持的页面 ID

`home`、`map`（学习路线）、`worldview`（AI 世界观）、`monthly`（每月更新）、`resources`（资源雷达）、`showcase`（作品样例）、`projects`（项目挑战）、`agents`（Agent 角色学院）、`weekly`（12 周节奏）、`toolkit`（模板）、`opensource`（开源共建）、`faq`（常见问题）、`feedback`（反馈循环）、`register`（注册联系）、`game`（游戏化任务板）。

## 状态管理

### 内存状态

`app.js` 顶层用 `let` 声明所有数据变量，加载后全局可访问：

```js
let tracks = {};
let weeks = [];
let starterSteps = [];
let showcaseItems = [];
let resourceRadarItems = [];
let agentRoleCategories = [];
let agentRoles = [];
let monthlyFallbackUpdates = [];
let worldviewItems = [];
let worldviewRoadmap = [];
let worldview30DayPlan = [];
let dailyChallenges = [];
let models = [];
let projects = [];
let ranks = [];
let PROJECT_UNLOCK_XP = {};
let templates = {};
let ownerContact = {};
let repoLinks = {};
```

用户运行时状态（当前路线、当前 Agent 分类、当前月份等）存储在 `state` 对象中。

### 持久化状态（localStorage）

所有用户进度通过 `localStorage` 持久化，key 统一在 `storageKeys` 对象中管理：

| Key | 用途 |
|-----|------|
| `ai-learning-month` | 当前选中的月份 |
| `ai-learning-worldview-30-weeks` | 30 天计划完成周次 |
| `ai-learning-leads` | 报名线索 |
| `ai-learning-feedback` | 反馈记录 |
| `ai-learning-weeks` | 周任务完成状态 |
| `ai-learning-projects` | 项目完成状态 |
| `ai-learning-week-proofs` | 周任务凭证 |
| `ai-learning-project-proofs` | 项目完成凭证 |
| `ai-learning-bonus-xp` | 额外 XP |
| `ai-learning-streak` | 连续签到天数 |
| `ai-learning-last-checkin` | 上次签到日期 |
| `ai-learning-daily-done` | 每日挑战完成状态 |

封装函数：`getStoredString` / `getStoredNumber` / `getStoredArray` / `getStoredObject` / `setStoredValue` / `removeStoredValue`，均带 try-catch 防止 localStorage 不可用时崩溃。

## 游戏化系统

- **XP**：签到、每日挑战、周任务、项目挑战均可获得 XP，累计决定等级。
- **等级**：定义在 `ranks.json`，按 `min` XP 阈值划分（AI 见习生 → Prompt 探索者 → 工具驯化者 → Agent 策划师 → AI 作品制作人 → AI 原生创造者）。
- **项目解锁**：`project-unlock-xp.json` 定义入门/进阶/高阶项目的 XP 门槛。
- **徽章**：通过完成特定里程碑触发，状态存入 localStorage。

## 云同步（可选）

Supabase 云同步为可选功能，用户主动配置 URL 和 API Key 后启用。通过 `fetch()` 调用 Supabase REST API，按 `device_id` 读写 `learning_progress` 表。不配置时不产生任何网络请求。

## 如何新增一个页面/模块

以新增「AI 术语表」页面为例：

### 1. 在 `index.html` 中添加 section

```html
<section id="glossary" class="section" aria-label="AI 术语表">
  <!-- 内容容器，由 app.js 填充 -->
  <div class="container">
    <h2>AI 术语表</h2>
    <div id="glossaryList"></div>
  </div>
</section>
```

### 2. 在 `app.js` 中注册页面 ID

在 `PAGE_IDS` 数组中添加 `"glossary"`，在 `PAGE_META` 对象中添加 `glossary: "AI 术语表"`。

### 3. 添加数据文件

创建 `assets/data/glossary.json`，在 `loadAllData()` 的 `dataFiles` 映射中添加：

```js
glossary: "assets/data/glossary.json",
```

并声明顶层变量 `let glossary = [];`，在加载赋值的 `switch` 中添加 `case "glossary": glossary = data; break;`。

### 4. 编写渲染函数

```js
function renderGlossary() {
  const container = document.getElementById("glossaryList");
  if (!container) return;
  container.innerHTML = glossary
    .map(item => `<div class="card"><h3>${escapeHtml(item.term)}</h3><p>${escapeHtml(item.desc)}</p></div>`)
    .join("");
}
```

### 5. 在 `bootstrap()` 中调用渲染

```js
renderGlossary();
```

### 6. 添加导航入口

在 `index.html` 的导航栏中添加链接：`<a href="index.html?page=glossary">术语表</a>`。

### 7. 更新校验脚本

如果新数据有必填字段，在 `scripts/validate-content.js` 中添加对应校验逻辑。

## 安全约定

- 所有用户可输入内容和外部数据渲染前必须经过 `escapeHtml()` / `safeText()` 转义，防止 XSS。
- URL 必须经过 `safeUrl()` 校验，仅允许 `http`、`https`、`mailto` 协议。
- CSV 导出使用 `escapeCsvCell()` 防止公式注入。
