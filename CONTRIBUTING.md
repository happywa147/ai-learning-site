# 贡献指南（CONTRIBUTING）

感谢你愿意参与建设这个 AI 学习站。这里不是课程文档仓库，而是一个面向长期演进的学习系统，我们希望任何修改都能尽快进入"可运行、可复用、可复盘"的状态。

## 目录

- [开发原则](#开发原则)
- [贡献流程：Fork → Branch → Commit → PR](#贡献流程fork--branch--commit--pr)
- [5 分钟添加一个项目挑战](#5-分钟添加一个项目挑战)
- [如何贡献月更内容](#如何贡献月更内容)
- [如何翻译角色卡](#如何翻译角色卡)
- [如何添加学习路线](#如何添加学习路线)
- [贡献者徽章体系](#贡献者徽章体系)
- [数据文件速查表](#数据文件速查表)
- [审核建议](#审核建议)
- [行为与沟通](#行为与沟通)

---

## 开发原则

- 以用户体验优先，优先确保页面可用。
- 保持更新节奏稳定：每月更新为主，不追求一次改太多。
- 兼顾 AI 变化和执行可落地性，避免空泛术语。
- 尊重隐私：报名信息仅保存在浏览器本地，避免新增上传逻辑。

## 可修改范围

- 核心页面与交互：`index.html`、`app.js`、`styles.css`
- 数据文件：`assets/data/*.json`（详见[数据文件速查表](#数据文件速查表)）
- 月度内容：`assets/monthly-updates.json`（线上正式数据）和 `assets/data/monthly-fallback.json`（兜底数据）
- 站点治理：`.github/`、`CONTRIBUTING.md`、`README.md`

---

## 贡献流程：Fork → Branch → Commit → PR

### 第 1 步：Fork 并克隆

```bash
# 在 GitHub 上点击 Fork，然后克隆到本地
git clone https://github.com/<你的用户名>/ai-learning-site.git
cd ai-learning-site
```

### 第 2 步：新建分支

```bash
# 分支命名建议：add-project-xxx / monthly-2026-09 / translate-agent-xxx / add-track-xxx
git checkout -b add-project-ai-podcast
```

### 第 3 步：本地运行与验证

```bash
# 启动本地服务器
python3 -m http.server 8765

# 另开一个终端，运行内容校验
node scripts/validate-content.js

# 检查 JS 语法
node --check app.js
```

打开 `http://localhost:8765`，验证以下功能：

- 每周任务/作品进度是否可勾选、可取消
- 月度更新是否可切换且内容正确
- 周报导出按钮是否可输出 `.md`
- 报名提交/导出 CSV 是否正常
- 赞助与联系弹窗交互是否可关闭（含键盘 Esc）
- 390x844 与 1600x900 两种视口下文字和按钮不重叠

### 第 4 步：提交并推送

```bash
git add .
git commit -m "feat: 新增 AI 播客项目挑战"
git push origin add-project-ai-podcast
```

### 第 5 步：发起 PR

在 GitHub 上发起 Pull Request，PR 说明中建议包含：

- 改动类型（新项目 / 月更内容 / 角色卡翻译 / 新路线 / Bug 修复）
- 改动范围（涉及哪些文件）
- 验证截图（可选，但鼓励）
- 风险边界和回滚方式

---

## 5 分钟添加一个项目挑战

项目挑战存放在 `assets/data/projects.json`，是一个 JSON 数组。每个项目挑战告诉学习者"做什么、用什么、交付什么、怎么验收"。

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 项目名称，要具体，如"AI 播客制作" |
| `level` | string | 难度，可选：`入门`、`进阶`、`高阶` |
| `time` | string | 预计耗时，如 `2-4 小时`、`1-2 天` |
| `tools` | string[] | 推荐工具列表，3 个左右 |
| `desc` | string | 一句话描述项目目标和产出 |
| `tasks` | string[] | 任务步骤，3 个左右 |
| `deliverables` | string[] | 交付物清单，3 个左右 |
| `check` | string | 验收标准，一句话写清"怎样算完成" |

### 实操示例

打开 `assets/data/projects.json`，在数组末尾追加一个新对象：

```json
{
  "title": "AI 播客制作",
  "level": "进阶",
  "time": "1-2 天",
  "tools": [
    "ChatGPT/Claude",
    "剪映/ Audacity",
    "小宇宙/喜马拉雅"
  ],
  "desc": "从选题到发布，用 AI 辅助完成一期完整播客，包括大纲、口播稿、封面和发布文案。",
  "tasks": [
    "确定主题和目标听众",
    "用 AI 生成大纲和口播稿",
    "录制、剪辑并发布"
  ],
  "deliverables": [
    "播客大纲",
    "完整口播稿",
    "一期已发布播客"
  ],
  "check": "听众能在 5 分钟内知道这期播客讲什么，且口播稿能直接用于录音。"
}
```

### 检查清单

- [ ] JSON 格式正确（逗号、引号、括号匹配）
- [ ] `level` 值为 `入门`、`进阶` 或 `高阶` 之一
- [ ] 验收标准 `check` 是可执行的判断，不是口号
- [ ] 运行 `node scripts/validate-content.js` 通过
- [ ] 本地页面"项目挑战"区能看到新项目

---

## 如何贡献月更内容

月更内容有两份文件：

- `assets/monthly-updates.json`：线上正式数据，由维护者每月发布时更新。
- `assets/data/monthly-fallback.json`：兜底数据，当线上文件加载失败时使用。贡献者通常修改这份文件。

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 月份标识，格式 `YYYY-MM`，如 `2026-09` |
| `label` | string | 给用户看的月份文本，如 `2026 年 9 月` |
| `status` | string | `published`（已发布）或 `draft`（草稿，不展示） |
| `updatedAt` | string | 更新日期，格式 `YYYY-MM-DD` |
| `lastVerified` | string | 最后复核日期，格式 `YYYY-MM-DD` |
| `sources` | array | 来源列表，每条含 `label` 和 `url` |
| `testedTasks` | string[] | 本月实测过的任务 |
| `confidence` | string | 可信度：`high`、`medium`、`low` |
| `title` | string | 本月主题 |
| `summary` | string | 主线说明，2-3 句话 |
| `cards` | array | 内容卡片，每张含 `id`、`title`、`items` |

建议每期至少包含 4 张卡片：模型观察、市场观察、本月训练、避坑提醒。

### 完整模板

打开 `assets/data/monthly-fallback.json`，追加一个新月份：

```json
{
  "id": "2026-09",
  "label": "2026 年 9 月",
  "status": "draft",
  "updatedAt": "2026-09-01",
  "lastVerified": "2026-09-02",
  "sources": [
    {
      "label": "OpenAI 官方博客",
      "url": "https://openai.com/blog/"
    },
    {
      "label": "站内月更共建模板",
      "url": "https://github.com/happywa147/ai-learning-site/blob/main/.github/ISSUE_TEMPLATE/monthly-update.md"
    }
  ],
  "testedTasks": [
    "用 Claude 写一篇产品分析",
    "用豆包生成短视频脚本",
    "用 Kimi 整理 20 页论文摘要"
  ],
  "confidence": "medium",
  "title": "从单次对话到可复用工作流",
  "summary": "本月重点是把零散的 AI 对话沉淀成可复用的 Prompt、角色卡和工作流模板，让输出从"碰运气"变成"有预期"。",
  "cards": [
    {
      "id": "2026-09-1",
      "title": "模型观察",
      "items": [
        "国际模型关注推理链路、代码生成和多模态理解能力的提升。",
        "国内模型关注中文写作、长文本处理和成本优势。",
        "建议用一个固定任务做交叉对比，记录各自强弱。"
      ]
    },
    {
      "id": "2026-09-2",
      "title": "市场观察",
      "items": [
        "AI 搜索、AI 编程、AI 视频是本月三大热点场景。",
        "关注国内 AI 产品的免费额度和付费转化策略。",
        "记录 1 个值得拆解的 AI 产品。"
      ]
    },
    {
      "id": "2026-09-3",
      "title": "本月训练",
      "items": [
        "把一个高频任务改写成可复用 Prompt 模板。",
        "搭建一个 3 步 Agent 工作流并记录验收结果。",
        "打磨 1 个可展示作品并收集 1 条反馈。"
      ]
    },
    {
      "id": "2026-09-4",
      "title": "避坑提醒",
      "items": [
        "不要只看模型榜单，用自己的任务做实测。",
        "不要把 AI 输出直接当事实，重要内容要查来源。",
        "不要囤工具，先固定 3-5 个高频工具形成肌肉记忆。"
      ]
    }
  ]
}
```

### 检查清单

- [ ] `id` 格式正确且与现有月份不重复
- [ ] `status` 设为 `draft`（草稿）或 `published`（发布）
- [ ] 至少 4 张卡片，每张 3 条以上的 `items`
- [ ] 关键判断有来源链接或实测任务支撑
- [ ] 运行 `node scripts/validate-content.js` 通过
- [ ] 页面"每月更新区"能正确切换到新月份

---

## 如何翻译角色卡

角色卡存放在 `assets/data/agent-roles.json`，目前已有 67 个角色。每张角色卡帮助学习者理解一个 AI 协作角色的职责、输入、输出和验收标准。

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 角色名称（中文） |
| `category` | string | 分类标识，对应 `agent-role-categories.json` 中的分类 |
| `source` | string | 角色来源标识，用英文短横线连接 |
| `level` | string | 难度或定位描述，如 `入门必修`、`进阶核心` |
| `useFor` | string | 这个角色用来解决什么问题 |
| `input` | string | 角色需要接收什么信息 |
| `output` | string | 角色应该产出什么 |
| `check` | string | 验收标准，怎么判断输出合格 |
| `practice` | string | 一个具体的练习建议 |

### 可用分类（`category` 值）

| category 值 | 显示名称 |
|-------------|---------|
| `core` | 核心素养 |
| `engineering` | 工程开发 |
| `research` | 研究核验 |
| `content` | 内容短视频 |
| `product` | 产品体验 |
| `growth` | 增长商业 |
| `design` | 设计品牌 |
| `safety` | 安全治理 |
| `learning` | 学习教练 |

### 翻译示例

如果你要把一个英文社区的角色卡翻译为中文学习角色卡，在 `assets/data/agent-roles.json` 数组末尾追加：

```json
{
  "name": "提示词审计员",
  "category": "safety",
  "source": "safety-prompt-auditor",
  "level": "安全实践",
  "useFor": "检查 Prompt 是否存在注入风险、越权指令和隐私泄露隐患。",
  "input": "系统提示词、用户输入样例、工具权限范围、敏感数据字段。",
  "output": "风险等级清单、攻击样例、修复建议、复测结果。",
  "check": "能复现至少一条注入或越权路径，且修复后通过复测。",
  "practice": "为一个客服 Agent 的系统提示词做一次安全审计，列出 3 个风险点。"
}
```

### 翻译要点

1. **不要直译长篇 Prompt**：本站不搬运原项目的长篇 agent prompt，而是提炼为"用做什么 / 输入什么 / 输出什么 / 怎么验收"的中文学习角色卡。
2. **`name` 要说人话**：用中文表达角色职责，如"事实核验员"而非"Fact Checker"。
3. **`check` 必须可执行**：验收标准要能被学习者自己判断，不是抽象描述。
4. **`practice` 要具体**：练习建议要给出具体任务，让学习者知道"今天就能做什么"。
5. **`source` 用英文短横线**：保持与现有角色一致的命名风格，如 `engineering-code-reviewer`。
6. **标注来源**：如果翻译自外部项目，在 PR 说明中注明原项目和许可证。

### 检查清单

- [ ] `category` 值在已有分类列表中
- [ ] `source` 不与现有角色重复
- [ ] 所有字段均为中文（`source` 除外）
- [ ] `check` 是可执行的判断
- [ ] 运行 `node scripts/validate-content.js` 通过
- [ ] 页面"Agent 角色学院"能按分类筛选到新角色

---

## 如何添加学习路线

学习路线存放在 `assets/data/tracks.json`，是一个 JSON 对象，每个 key 是路线标识，value 是路线详情。

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 路线名称 |
| `summary` | string | 一句话描述路线目标 |
| `outcomes` | string[] | 学习成果，3 条左右 |
| `modules` | array[] | 模块列表，每个模块是 `[模块名, 模块描述]` 的二维数组 |

### 实操示例

打开 `assets/data/tracks.json`，在对象中追加一个新的 key：

```json
"ai-product": {
  "title": "AI 产品观察路线",
  "summary": "从用户洞察到竞品拆解，学会用 AI 思维理解产品定位、场景和增长路径。",
  "outcomes": [
    "能独立完成一个 AI 产品的竞品分析",
    "能用 AI 辅助做用户访谈和需求整理",
    "能写出有来源、有判断的产品观察报告"
  ],
  "modules": [
    [
      "洞察",
      "用户画像、痛点地图、场景分类、AI 替代边界"
    ],
    [
      "竞品",
      "国内外 AI 产品对比、功能矩阵、定价策略、增长路径"
    ],
    [
      "拆解",
      "产品流程、商业模式、技术栈判断、可借鉴机制"
    ],
    [
      "输出",
      "竞品报告、机会判断、风险提醒、可执行建议"
    ]
  ]
}
```

### 检查清单

- [ ] key 用英文短横线命名，如 `ai-product`
- [ ] key 不与现有路线重复（现有：`freshman`、`rag`、`creator`、`builder`、`deploy`）
- [ ] `modules` 每个元素是 `[模块名, 描述]` 的二维数组
- [ ] `outcomes` 至少 3 条，每条是可验证的学习成果
- [ ] 运行 `node scripts/validate-content.js` 通过
- [ ] 页面"学习路线"区能看到新路线

---

## 贡献者徽章体系

我们认可每一位贡献者的付出。以下是贡献者徽章体系：

| 徽章 | 获得条件 |
|------|---------|
| **项目挑战贡献者** | 合并 1 个及以上项目挑战 PR |
| **月更共建者** | 合并 1 次及以上月更内容 PR |
| **角色卡翻译官** | 合并 3 张及以上角色卡翻译 PR |
| **路线规划师** | 合并 1 条及以上学习路线 PR |
| **Bug 猎手** | 合并 3 个及以上 Bug 修复 PR |
| **文档守护者** | 合并 3 次及以上文档改进 PR |
| **核心贡献者** | 累计合并 10 个及以上 PR |

### 展示方式

- **README 展示**：核心贡献者和徽章获得者的 GitHub 用户名会展示在 `README.md` 的"贡献者"区域。
- **月更致谢**：每月更新内容发布时，在 PR 和相关 Issue 中致谢当月贡献者。
- **Star 推荐位**：特别优秀的贡献我们会推荐到 GitHub 仓库的置顶 Issue 或 Discussions。

> 如果你的 PR 被合并但没有出现在致谢名单中，请在 Issue 中提醒维护者。

---

## 数据文件速查表

所有数据文件位于 `assets/data/` 目录下，以 JSON 格式存储。以下按功能模块分类：

### 内容与学习数据

| 文件 | 格式 | 用途 |
|------|------|------|
| `projects.json` | 数组 | 12+ 个 AI 项目挑战，含难度、工具、交付物和验收标准 |
| `tracks.json` | 对象 | 5 条学习路线（零基础、RAG、短视频、开发、部署），每条含模块和成果 |
| `weeks.json` | 数组 | 每周学习任务，格式为 `[周次, 主题, 目标]` |
| `starter-steps.json` | 数组 | 60 秒新手上手的 3 步引导卡片 |
| `daily-challenges.json` | 数组 | 每日挑战任务列表，格式为 `[名称, 描述]` |

### 月更与模型数据

| 文件 | 格式 | 用途 |
|------|------|------|
| `monthly-fallback.json` | 数组 | 月更兜底数据，含模型观察、市场观察、训练建议和避坑提醒 |
| `models.json` | 数组 | 国内外 AI 模型对比，含场景、定价、优劣势 |

### Agent 角色学院

| 文件 | 格式 | 用途 |
|------|------|------|
| `agent-roles.json` | 数组 | 67 个中文学习角色卡，含职责、输入、输出、验收和练习 |
| `agent-role-categories.json` | 数组 | 角色分类筛选项，格式为 `[标识, 显示名]` |

### 世界观与成长体系

| 文件 | 格式 | 用途 |
|------|------|------|
| `worldview-items.json` | 数组 | AI 时代世界观卡片，含标题、说明和行动建议 |
| `worldview-roadmap.json` | 数组 | 世界观 10 天练习路线，分阶段含目标、行动和验收 |
| `worldview-30day.json` | 数组 | 世界观 30 天周报模板，含指标、风险和行动 |
| `ranks.json` | 数组 | 等级体系，含等级名称和所需 XP |
| `project-unlock-xp.json` | 对象 | 项目难度解锁所需 XP，映射 `入门/进阶/高阶` |

### 作品与资源

| 文件 | 格式 | 用途 |
|------|------|------|
| `showcase.json` | 数组 | 作品样例库，展示学习成果应该长什么样 |
| `resource-radar.json` | 数组 | GitHub AI 学习资源雷达，含许可证、复核日期和处理建议 |
| `templates.json` | 对象 | Prompt、Agent、Skill 三种模板的示例文本 |

### 站点配置

| 文件 | 格式 | 用途 |
|------|------|------|
| `site-config.json` | 对象 | 站点配置，含项目主理人信息、联系方式和社交入口 |

> 另有 `assets/monthly-updates.json`（不在 `assets/data/` 下）是线上正式月更数据，字段结构与 `monthly-fallback.json` 一致。

---

## 审核建议

我们建议按照"功能风险优先、体验优先"方式审稿：

- 先看是否影响核心路径（任务签到、学习进度、月更展示）
- 再看是否引入潜在存储/兼容问题
- 最后看文案风格是否统一与合规

## 行为与沟通

- 在 Issue 中先描述目标用户、改动范围、验证截图。
- PR 里给出改动的风险边界和回滚方式。
- 对争议项保留"可替代方案"，避免一次性结论。
- 尊重所有贡献者，保持友善和建设性的沟通氛围。
