# 数据文件结构说明（data-schema）

本目录下的全部数据文件位于 `assets/data/`，共 18 个 JSON 文件。所有文件由 `app.js` 的 `loadAllData()` 函数在页面加载时通过 `fetch()` 并行拉取，写入对应的内存变量后渲染到 DOM。

> 字段标注：**必填** = 文件中必须存在；**可选** = 可省略或为空。

---

## 1. tracks.json — 学习路线

**用途**：定义 5 条学习路线（零基础入门、RAG 赋能、短视频创作者、AI 应用开发、AI 部署交付），每条路线包含目标、模块和代码示例。

**顶层结构**：对象，key 为路线 ID（如 `freshman`、`rag`、`creator`），value 为路线对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 路线标题 |
| `summary` | string | 是 | 路线简介（1-2 句话） |
| `outcomes` | string[] | 是 | 学习成果列表 |
| `modules` | [string, string][] | 是 | 模块数组，每个元素为 `[模块名, 模块描述]` 二元组 |
| `codeExamples` | object | 否 | 代码示例，key 为模块名，value 为示例代码字符串 |

---

## 2. weeks.json — 12 周自学计划

**用途**：定义 12 周的学习节奏，每周一个主题。

**顶层结构**：数组，每个元素为三元组数组。

| 索引 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `[0]` | string | 是 | 周次（如「第 1 周」） |
| `[1]` | string | 是 | 本周主题 |
| `[2]` | string | 是 | 本周目标 |

---

## 3. starter-steps.json — 新手上手步骤

**用途**：首页「60 秒上手」区域的新手引导步骤。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 步骤标题 |
| `text` | string | 是 | 步骤描述 |
| `action` | string | 是 | 按钮文案 |
| `href` | string | 是 | 跳转链接（如 `index.html?page=map`） |

---

## 4. showcase.json — 作品样例库

**用途**：展示可学习的 AI 作品样例，激励学习者产出。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 作品标题 |
| `type` | string | 是 | 作品类型（如「学习型作品」「内容型作品」） |
| `text` | string | 是 | 作品描述 |
| `outputs` | string[] | 是 | 产出物列表 |

---

## 5. resource-radar.json — GitHub AI 学习资源雷达

**用途**：收录优质 AI 学习资源，标注许可证和可用边界。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 资源名称（通常为仓库全名） |
| `url` | string | 是 | 资源 URL（http/https） |
| `type` | string | 是 | 资源类型（如「课程路线」「Prompt / RAG / Agent」） |
| `license` | string | 是 | 许可证名称（如 MIT） |
| `licenseSpdx` | string | 是 | SPDX 许可证标识（NOASSERTION 表示无标准标识） |
| `lastVerified` | string | 是 | 最后核实日期（YYYY-MM-DD） |
| `source` | string | 是 | 来源说明（如「GitHub API」） |
| `action` | string | 是 | 使用建议（如「值得借鉴」「谨慎改造」） |
| `useFor` | string | 是 | 适用场景说明 |
| `adapt` | string | 是 | 改造建议 |

---

## 6. agent-role-categories.json — Agent 角色卡分类

**用途**：定义角色卡的分类标签，用于角色学院的 Tab 筛选。

**顶层结构**：数组，每个元素为二元组数组。

| 索引 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `[0]` | string | 是 | 分类 ID（如 `all`、`core`、`engineering`） |
| `[1]` | string | 是 | 分类显示名称（如「全部」「核心素养」） |

---

## 7. agent-roles.json — Agent 角色卡

**用途**：67 张 AI Agent 角色卡，每张卡描述一个可复用的 AI 角色。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 角色名称 |
| `category` | string | 是 | 所属分类 ID（对应 `agent-role-categories.json`） |
| `source` | string | 否 | 角色来源标识（用于锚点跳转） |
| `level` | string | 是 | 难度等级（如「入门必修」「进阶核心」） |
| `useFor` | string | 是 | 适用场景 |
| `input` | string | 是 | 输入要求 |
| `output` | string | 是 | 输出说明 |
| `check` | string | 是 | 验收标准 |
| `practice` | string | 是 | 练习建议 |

---

## 8. monthly-fallback.json — 月度内容（兜底）

**用途**：当 `assets/monthly-updates.json` 加载失败时使用的兜底月度内容。

**顶层结构**：数组，每项为月度更新对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 月份标识（如 `2026-07`） |
| `label` | string | 是 | 显示标签（如「2026 年 7 月」） |
| `status` | string | 是 | 状态：`published` 或 `draft` |
| `updatedAt` | string | 是 | 更新日期（YYYY-MM-DD） |
| `lastVerified` | string | published 时必填 | 最后核实日期（YYYY-MM-DD） |
| `confidence` | string | published 时必填 | 置信度：`low` / `medium` / `high` |
| `sources` | object[] | published 时必填 | 来源列表 |
| `sources[].label` | string | 是 | 来源名称 |
| `sources[].url` | string | 是 | 来源 URL（http/https） |
| `testedTasks` | string[] | published 时必填 | 本月实测任务列表 |
| `title` | string | 是 | 月度主题标题 |
| `summary` | string | 是 | 月度摘要 |
| `cards` | object[] | 是 | 内容卡片列表 |
| `cards[].id` | string | 是 | 卡片 ID |
| `cards[].title` | string | 是 | 卡片标题（如「模型观察」「中国应用市场」） |
| `cards[].items` | string[] | 是 | 卡片内容条目 |

---

## 9. worldview-items.json — AI 世界观

**用途**：AI 世界观核心认知条目，帮助学习者建立思维框架。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 认知标题 |
| `text` | string | 是 | 认知描述 |
| `action` | string | 是 | 行动建议 |

---

## 10. worldview-roadmap.json — 14 天路线图

**用途**：分阶段的 14 天 AI 世界观实践路线图。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `phase` | string | 是 | 阶段标题（如「第1-2天 · 建立坐标系」） |
| `goal` | string | 是 | 阶段目标 |
| `action` | string | 是 | 具体行动 |
| `check` | string | 是 | 验收标准 |
| `result` | string | 是 | 预期产出 |

---

## 11. worldview-30day.json — 30 天计划

**用途**：按周划分的 30 天深度学习计划。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `week` | string | 是 | 周次（如「第1周（1-7天）」） |
| `goal` | string | 是 | 本周目标 |
| `metrics` | string[] | 是 | 衡量指标列表 |
| `risks` | string[] | 是 | 风险提示列表 |
| `action` | string | 是 | 本周行动 |

---

## 12. daily-challenges.json — 每日挑战

**用途**：每日 AI 练习任务，完成可获得 XP。

**顶层结构**：数组，每个元素为二元组数组。

| 索引 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `[0]` | string | 是 | 挑战标题（如「模型侦察」「Prompt 打磨」） |
| `[1]` | string | 是 | 挑战描述 |

---

## 13. models.json — 国内外模型对比

**用途**：9 个主流 AI 模型的横向对比，含定价、能力、场景。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 模型名称 |
| `desc` | string | 是 | 模型简介 |
| `tags` | string[] | 是 | 标签（如「国际」「编程」「多模态」） |
| `scenario` | string | 是 | 适用场景 |
| `pricing` | string | 是 | 定价说明 |
| `strengths` | string[] | 是 | 优势列表 |
| `limits` | string[] | 是 | 局限列表 |
| `vendor` | string | 是 | 厂商 |
| `region` | string | 是 | 地区（`international` 或 `china`） |
| `contextWindow` | string | 是 | 上下文窗口（如 `128K`） |
| `inputPrice` | string | 是 | 输入价格 |
| `outputPrice` | string | 是 | 输出价格 |
| `lastVerified` | string | 是 | 最后核实日期（YYYY-MM-DD） |
| `source` | string | 是 | 价格来源 URL |

---

## 14. projects.json — 项目挑战库

**用途**：12 个分难度的 AI 项目挑战，完成可获得 XP 并解锁更高难度。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 项目标题 |
| `level` | string | 是 | 难度（`入门` / `进阶` / `高阶`） |
| `time` | string | 是 | 预估时长（如「2-4 小时」） |
| `tools` | string[] | 是 | 推荐工具列表 |
| `desc` | string | 是 | 项目描述 |
| `tasks` | string[] | 是 | 任务步骤列表 |
| `deliverables` | string[] | 是 | 交付物列表 |
| `check` | string | 是 | 验收标准 |

---

## 15. ranks.json — 等级体系

**用途**：定义 XP 等级阈值和称号。

**顶层结构**：数组，每项为对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 等级称号（如「AI 见习生」「Prompt 探索者」） |
| `min` | number | 是 | 该等级最低 XP 值 |

等级递进：AI 见习生(0) → Prompt 探索者(160) → 工具驯化者(360) → Agent 策划师(620) → AI 作品制作人(940) → AI 原生创造者(1320)。

---

## 16. project-unlock-xp.json — 项目解锁 XP 阈值

**用途**：定义不同难度项目的解锁 XP 要求。

**顶层结构**：对象，key 为难度等级，value 为 XP 阈值。

| Key | 类型 | 值 | 说明 |
|-----|------|----|------|
| `入门` | number | `0` | 入门项目无需 XP |
| `进阶` | number | `160` | 进阶项目需 160 XP |
| `高阶` | number | `360` | 高阶项目需 360 XP |

---

## 17. templates.json — Prompt / Agent / Skill 模板

**用途**： toolkit 页面展示的三类可复用模板。

**顶层结构**：对象，key 为模板类型，value 为模板内容字符串。

| Key | 类型 | 说明 |
|-----|------|------|
| `prompt` | string | Prompt 工程模板（学习教练角色） |
| `agent` | string | Agent 工作流模板（学习资料助教） |
| `skill` | string | Skill 模板（短视频脚本生成） |

---

## 18. site-config.json — 站点配置

**用途**：站点拥有者联系方式和仓库链接配置。

**顶层结构**：对象。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `owner` | object | 是 | 拥有者信息 |
| `owner.name` | string | 是 | 姓名 |
| `owner.emailParts` | string[] | 是 | 邮箱分段（防爬虫，如 `["user", "gmail", "com"]`） |
| `owner.qrImage` | string | 是 | 微信二维码图片路径 |
| `owner.items` | [string, string][] | 是 | 联系方式条目，每项为 `[标签, 值]` |
| `repo` | object | 是 | 仓库信息 |
| `repo.newIssue` | string | 是 | GitHub Issue 创建链接 |

---

## 数据加载机制

`app.js` 中的 `loadAllData()` 函数（约第 2257 行）负责加载上述全部文件：

```js
const dataFiles = {
  tracks: "assets/data/tracks.json",
  weeks: "assets/data/weeks.json",
  starterSteps: "assets/data/starter-steps.json",
  showcaseItems: "assets/data/showcase.json",
  resourceRadarItems: "assets/data/resource-radar.json",
  // ... 其余文件
};
```

- 使用 `Promise.all` 并行加载，单个文件失败不影响其他文件。
- `site-config.json` 单独加载，拆分为 `ownerContact` 和 `repoLinks` 两个变量。
- 加载完成后依次调用各 `renderXxx()` 函数渲染页面。

## 校验

运行 `node scripts/validate-content.js` 可校验：
- JSON 文件语法合法性
- `resource-radar.json` 和 `projects.json` 的必填字段
- `monthly-updates.json` 的完整结构
- 关键文件（index.html、app.js 等）是否存在
- 结构化数据（JSON-LD）是否完整
