# AI 原生能力自学站

一个面向 AI 学习者、创作者、职场人和项目实践者的开源自学网站。

它不是一本固定教材，而是一个可以持续更新的 AI 学习驾驶舱：通过任务、等级、徽章、作品项目、月度更新、反馈循环和世界观框架，帮助学习者长期跟上 AI 应用市场的变化。

[![Deploy GitHub Pages](https://github.com/happywa147/ai-learning-site/actions/workflows/pages.yml/badge.svg)](https://github.com/happywa147/ai-learning-site/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-8f2f2a.svg)](https://happywa147.github.io/ai-learning-site/)

[在线访问](https://happywa147.github.io/ai-learning-site/) · [路线图](./ROADMAP.md) · [贡献指南](./CONTRIBUTING.md) · [截图与传播素材](./docs/SCREENSHOTS.md) · [MIT License](./LICENSE)

如果你也想共建一份持续月更的中文 AI 学习地图，欢迎 Star 跟进更新，也欢迎通过 Issue 提交模型实测、作品样例和学习任务建议。

## 当前版本状态

- 最新版本以 `main` 分支和 GitHub Pages 部署结果为准。
- 每次发布前会运行 `node scripts/validate-content.js`，检查 JS、月更 JSON、结构化数据和关键 SEO 文件。
- 线上地址应能访问 `index.html`、`sitemap.xml`、`robots.txt` 和 `llms.txt`。

## 为什么值得 Star

- **持续更新**：把 AI 学习从“看完就过时”的教材，变成可月更的学习系统。
- **贴近中国应用市场**：覆盖国内外模型、短视频、内容生产、AI 编程、Agent 和工作流。
- **游戏化学习闭环**：签到、XP、等级、徽章、作品点亮和学习周报，让学习过程可见。
- **作品导向**：学习结果不只停留在笔记，而是沉淀成作品集、脚本工厂、知识库问答和产品观察。
- **纯静态、易部署**：不需要复杂后端，适合 GitHub Pages、课堂演示、个人自学站和内容共创。
- **AI 搜索友好**：提供 `sitemap.xml`、`robots.txt` 和 `llms.txt`，便于搜索引擎与 AI 问答理解站点结构。

## 适合谁

- 刚开始系统学习 AI 的新人
- 想把 AI 用进工作流的职场人
- 做短视频、图文、直播和内容矩阵的创作者
- 想入门 AI 编程、Agent、Skill、RAG 的实践者
- 关注中国 AI 应用市场和产品机会的人
- 想陪伴家人或团队建立 AI 学习节奏的人

## 核心功能

- 60 秒新手上手：快速进入路线、任务、作品循环
- AI 学习游戏化：签到、XP、等级、徽章和任务进度
- AI 时代世界观：基础设施、协作方式、验证精神、责任边界
- 每月更新区：模型观察、中国应用市场、本月训练、避坑提醒
- 三条学习路线：零基础入门、短视频创作者、AI 应用开发
- 国内外模型对比：按应用场景理解模型差异
- 作品样例库：展示学习成果应该长什么样
- 作品集项目：学习助教、短视频脚本工厂、知识库问答、Agent 小工具等
- Prompt、Agent、Skill 模板库
- Agent 角色学院：60 个可筛选中文学习角色卡，把专业 agent 指令库改造成可练习、可验收的任务角色
- 反馈循环：本地记录反馈，可导出 CSV 供月更参考
- 学习周报：导出 Markdown 学习报告
- 注册与联系：本地保存报名草稿，可复制联系内容或生成邮件草稿
- 赞助窗口：支持微信扫码赞助

## 项目截图

当前建议准备 4 张截图用于 GitHub README、社交传播和版本说明：

1. 首页与学习驾驶舱
2. 60 秒新手上手
3. 每月更新区
4. 作品样例库与反馈区

截图规范见 [docs/SCREENSHOTS.md](./docs/SCREENSHOTS.md)。

## 推荐仓库 Topics

建议在 GitHub 仓库 Settings 或 About 区添加：

`ai-learning`、`ai-education`、`prompt-engineering`、`agents`、`rag`、`ai-tools`、`china-ai`、`github-pages`、`static-site`、`learning-dashboard`

## 本地运行

这是一个纯静态网站，不需要构建工具。

环境建议：

- Node.js 18 或更高版本，用于语法和内容校验。
- Python 3，用于启动本地静态服务。
- 推荐使用 Chrome、Edge 或 Safari 进行桌面与移动端预览。

```bash
python3 -m http.server 8765
```

然后打开：

```text
http://localhost:8765
```

也可以直接打开 `index.html` 预览，但使用本地服务器更接近真实部署环境。

## 本地验收

提交前建议运行：

```bash
node scripts/validate-content.js
```

再手动检查：

- 首页、60 秒上手、月更、作品、反馈、注册区是否能正常访问。
- 签到、周任务证明、作品点亮、周报导出是否正常。
- 反馈是否能生成 GitHub Issue 或复制 Issue 草稿。
- 报名是否明确为本机草稿，并能复制联系内容或生成邮件草稿。
- 390x844 与 1600x900 两种视口下文字和按钮不重叠。

## 数据与隐私说明

- 学习进度、签到、徽章、报名信息保存在浏览器 `localStorage` 中。
- 当前静态版本不会把报名信息自动发送到服务器。
- 如果希望主理人收到反馈或报名信息，需要使用页面上的 GitHub Issue、复制草稿、邮件或微信方式主动发送。
- 邮箱在页面上不直接明文展示，而是通过点击按钮复制。
- 微信联系二维码和赞助二维码分别作为图片资源保存在 `assets/` 目录。

## 维护方式

每月更新内容位于 `assets/monthly-updates.json`。

字段规范见 [docs/monthly-updates-schema.md](./docs/monthly-updates-schema.md)。

新增一个月份时，追加一条数据并更新：

- `label`
- `status`（正式发布用 `published`，草稿用 `draft`，草稿不会展示）
- `title`
- `summary`
- `updatedAt`
- `lastVerified`
- `sources`
- `testedTasks`
- `confidence`
- `cards`

模型对比、路线、项目和模板也都集中在 `app.js` 中，方便后续迭代。

## 参与贡献

这个项目以可持续更新为核心，欢迎通过 Issue 与 PR 一起共建。

### 如何提交月更

1. 在 `assets/monthly-updates.json` 新增或更新当月条目。
2. 建议同步更新 `README.md` 中“本月重点/观察主题”说明（可选）。
3. 在 PR 说明里写明：
   - 更新月份 ID（如 `2026-09`）
   - 核心场景与观察结论
   - 官方来源、实测任务、复核日期和可信度
   - 是否含模型、应用场景、作业建议与避坑三部分
   - 是否已本地验证
4. 运行 `node scripts/validate-content.js`。
5. 通过页面中“每月更新区”手动验证：月份切换、卡片展示、更新日期是否正常。

### 内容质量标准（建议执行）

- 更新内容必须可复核，优先给出对照任务而非空口号。
- 模型对比避免绝对化结论，明确适用场景和边界。
- 每月至少保留 1 条中国应用场景观察与 1 条作品实践建议。
- 涉及证据链时使用来源链条，不要出现无来源的结论断言。
- 站内模板只能说明贡献流程，不能作为模型能力或市场判断的唯一事实来源。

### 开发与提交流程

1. `Fork` 仓库。
2. 新建分支。
3. 运行：

```bash
python3 -m http.server 8765
node scripts/validate-content.js
```

4. 打开 `http://localhost:8765` 验证页面交互。
5. 提交 PR 并附带变更截图（可选，但鼓励）。

### 联系与披露

- 邮箱不在页面上直接明文展示，通过复制按钮提供。
- 赞助与合作二维码图片与联系信息独立放在 `assets/` 目录，避免直接泄露联系方式。
- Agent 角色学院的设计灵感参考 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)；该项目使用 MIT License。本站没有原样搬运其长篇 agent prompt，而是面向中文 AI 学习场景重新组织为学习角色卡。

更多流程和模板见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 部署建议

仓库已接入 GitHub Actions 发布：

1. 确认 `Settings` → `Pages` 的 Source 为 `GitHub Actions`。
2. 合并到 `main` 后 GitHub Actions 会自动构建并部署静态文件。
3. workflow 会先运行 `node scripts/validate-content.js`，通过后只发布 `_site` 目录中的静态文件。
4. 推送成功后在 Actions 页面可查看部署运行状态。
5. 访问地址可在 Pages 的 `Visit site` 中获取。

常见排查：

- 如果 Actions 的 `Deploy` 步骤失败，优先确认 `Settings` → `Pages` 是否选择 `GitHub Actions`。
- 如果 `sitemap.xml`、`robots.txt` 或 `llms.txt` 线上 404，确认 workflow 的 `_site` 打包步骤包含这些文件。
- 如果月更内容没有展示，确认条目 `status` 为 `published`，并通过内容校验脚本。

## 项目定位

AI 变化太快，固定教材很容易过时。这个网站的目标是把“学习 AI”做成一个长期系统：

- 底层学世界观和判断力
- 中层学工具、模型和工作流
- 上层跟进中国应用市场与真实项目
- 最终用作品证明学习结果
