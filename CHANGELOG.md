# Changelog

本文件记录 ai.mynaxis.com 的所有 notable changes，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中

- [ ] 引入 Rollup 实现 Tree-shaking
- [ ] Vitest 单元测试覆盖核心游戏逻辑
- [ ] Cypress E2E 测试（签到→XP→分享关键旅程）
- [ ] CloudBase 云同步替代 localStorage
- [ ] GitHub Discussions 集成

---

## [1.0.0] - 2026-07-04

> **首个正式版本** — 经过 18 位专家三轮迭代评审（综合均分 8.6/10），达到上线就绪状态。

### ✨ 新增

#### 内容与学习系统

- **5 条学习路线**：零基础入门 / RAG 赋能 / 短视频创作者 / AI 应用开发 / AI 部署交付
- **20 个课程模块**，每个模块含实践步骤、常见错误提示（共 40 条）
- **难度标签**：所有模块标注初级 / 中级 / 高级
- **自测选择题**：每条路线含 3 道互动知识检测题
- **路线间知识依赖图谱**：可视化展示 5 条路线的前序关系
- **每月更新区**：模型观察、中国应用市场、本月训练、避坑提醒

#### 游戏化系统

- **签到系统**：连续签到倍率（7d×1.5 / 30d×2 / 100d×3）
- **XP 系统**：完成任务、签到、分享均可获得 XP
- **等级系统**：XP → 等级 → 解锁称号
- **徽章系统**：铜 / 银 / 金三级徽章
- **每日任务**：随机 3 个日常任务，各 +10 XP
- **XP 商店**：5 种虚拟物品可兑换
- **购买动画特效**：xpPurchaseFlash 缩放 + 金色光晕

#### 社交与分享

- **Canvas 分享图生成**：等级证书风格，支持下载
- **真实 QR 码**：分享图集成 QR 码 API，扫码直达网站
- **UTM 追踪**：邀请链接含 UTM 参数，GA4 可追踪来源
- **邀请系统**：6 位邀请码，被邀请人注册 +50 XP
- **邀请排行榜**：展示 Top 10 + 5 个里程碑徽章
- **分享即时 XP 奖励**：Canvas 下载完成后 +10 XP Toast

#### 模型与 Agent

- **13 个 AI 模型数据**，含 benchmark 对比
- **模型决策树（交互式）**：步骤式 Q&A，引导用户选择合适模型
- **67 张 Agent 角色卡**，支持筛选、复制、今日挑战
- **Agent 质量分级**：basic / advanced / expert 三级

#### 管理与数据

- **管理后台聚合统计**：XP 消耗分析、用户行为洞察
- **学习进度报告导出**：Markdown 格式周报
- **反馈系统**：本地记录，可导出 CSV / 生成 GitHub Issue
- **自适应自检反馈**：根据用户答题情况给出个性化建议

#### 新手体验

- **新手引导（4 步）**：首次访问弹出引导流程
  - 第 1 步：网站使命介绍
  - 第 2 步：选择学习路线
  - 第 3 步：每天签到赚 XP
  - 第 4 步：解锁徽章和等级
- **Cookie 标记**：`ai-onboarding-done`，引导只出现一次

#### 工程与部署

- **模块化架构**：app.js 3565 行拆分为 9 个 ES 模块（`src/modules/`）
- **esbuild 构建管线**：9 步骤（拼接 → minify → content hash → SSG → 数据拆分 → Brotli）
- **GitHub Actions 自动部署**：推送 main 即自动构建发布到 GitHub Pages
- **Brotli 压缩**：JS 77% / CSS 82% / HTML 80% 体积缩减
- **SSG 静态生成**：6 个路线页面预渲染，利于 SEO
- **数据按页面拆分**：5 个分片 JSON（home / tracks / models / agent / resources）
- **Service Worker**：Cache First 离线缓存策略 + 离线降级页

#### SEO 与可访问性

- **PWA 支持**：manifest.json + theme-color + apple-touch-icon
- **SEO 基础**：robots.txt + sitemap.xml + OGP meta + JSON-LD
- **GA4 集成**：Google Analytics 4，IP 匿名化（GDPR 合规）
- **无障碍**：WCAG AA 对比度、focus-visible、44px 触控区、aria 属性
- **LLMs.txt**：供 AI 爬虫理解站点结构

#### 代码质量

- **ESLint + Prettier + Husky + lint-staged**：pre-commit 自动检查
- **validate-content.js**：提交前内容校验（JS / JSON / SEO 文件）
- **CONTRIBUTING.md**：189 行贡献指南，含本地开发 + JSON 字段说明
- **ARCHITECTURE.md**：项目架构文档
- **CODE_OF_CONDUCT.md**：贡献者公约 2.1
- **privacy.html**：隐私政策（CCPA / GDPR）

### 🔧 修复

- 修复 tracks.json 难度标签缺失问题（20/20 模块已补全）
- 修复分享图 QR 码只显示占位符问题（集成真实 API）
- 修复 invite link 未带 UTM 参数问题
- 修复 purchase animation 只执行一次问题（xpPurchaseFlash 重构）
- 修复 admin dashboard XP 消耗统计不准确问题（聚合逻辑优化）
- 修复模型决策树无法点击导航问题（添加 click 事件）
- 修复邀请排行榜里程碑不展示问题（渲染逻辑修复）
- 修复自适应反馈逻辑错误（checkAdaptive 函数重构）
- 修复等级对应分享图配色方案不一致问题（getShareColorScheme 统一）
- 修复 sw.js 预缓存引用错误 /app.js 问题（改为运行时缓存）

### 🔄 变更

- `index.html` GA4 测量 ID 从占位符更新为真实 ID（`G-4GNCZR9P5N`）
- `package.json` 新增 devDependencies（eslint / prettier / husky / lint-staged）
- `.github/workflows/build.yml` 构建步骤从 6 步扩展为 9 步
- `CONTRIBUTING.md` 项目结构说明更新为模块化架构
- `README.md` 本地运行指南更新（推荐 `npm run dev` 而非 `python3 -m http.server`）

### 🗑️ 移除

- 无（首个版本）

---

## [0.9.0] - 2026-06-XX（内部测试版）

> 初始版本，含基础学习路线、游戏化系统、模型对比、Agent 角色卡功能。

### ✨ 新增

- 初始项目架构（纯静态 HTML + CSS + vanilla JS）
- 3 条学习路线（零基础 / RAG / 创作者）
- 基础签到系统和 XP 系统
- 8 个 AI 模型数据
- 30 张 Agent 角色卡
- GitHub Pages 手动部署

---

## 版本号说明

| 版本号段 | 含义                            | 当前版本 |
| :------: | :------------------------------ | -------- |
|  MAJOR   | 不兼容的 API 修改或重大架构调整 | 1        |
|  MINOR   | 向后兼容的功能新增              | 0        |
|  PATCH   | 向后兼容的问题修正              | 0        |

**发布节奏**：

- **MINOR 版本**：每月跟随"每月更新区"发布
- **PATCH 版本**：紧急 bug 修复，随时发布
- **MAJOR 版本**：重大架构调整（如引入云同步、多语言支持）

---

[Unreleased]: https://github.com/happywa147/ai-learning-site/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/happywa147/ai-learning-site/releases/tag/v1.0.0
[0.9.0]: https://github.com/happywa147/ai-learning-site/releases/tag/v0.9.0
