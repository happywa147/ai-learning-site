# AI 原生能力自学站

<p align="center">
  <a href="https://ai.mynaxis.com/">
    <img src="https://img.shields.io/badge/site-ai.mynaxis.com-8f2f2a.svg?style=flat-square" alt="正式站点" />
  </a>
  <a href="https://github.com/happywa147/ai-learning-site/actions/workflows/build.yml">
    <img src="https://github.com/happywa147/ai-learning-site/actions/workflows/build.yml/badge.svg" alt="Build Status" />
  </a>
  <a href="https://github.com/happywa147/ai-learning-site/releases">
    <img src="https://img.shields.io/github/v/release/happywa147/ai-learning-site?style=flat-square" alt="GitHub release (latest by date)" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License: MIT" />
  </a>
  <a href="https://github.com/happywa147/ai-learning-site/commits/main">
    <img src="https://img.shields.io/github/last-commit/happywa147/ai-learning-site?style=flat-square" alt="Last commit" />
  </a>
  <a href="https://github.com/happywa147/ai-learning-site/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/happywa147/ai-learning-site?style=flat-square" alt="Contributors" />
  </a>
</p>

<p align="center">
  <a href="https://ai.mynaxis.com/">正式站点</a> ·
  <a href="https://happywa147.github.io/ai-learning-site/">GitHub Pages 备份</a> ·
  <a href="https://github.com/happywa147/ai-learning-site/blob/main/ROADMAP.md">路线图</a> ·
  <a href="https://github.com/happywa147/ai-learning-site/blob/main/CONTRIBUTING.md">贡献指南</a> ·
  <a href="https://github.com/happywa147/ai-learning-site/blob/main/CHANGELOG.md">更新日志</a> ·
  <a href="https://github.com/happywa147/ai-learning-site/blob/main/docs/data-contribution-guide.md">数据贡献规范</a>
</p>

---

## 🎯 项目简介

**ai.mynaxis.com** 是一个面向中文 AI 学习者的开源自学网站。

它不是一本固定教材，而是一个可以**持续更新**的 AI 学习驾驶舱：通过任务、等级、徽章、作品项目、月度更新、反馈循环和世界观框架，帮助学习者长期跟上 AI 应用市场的变化。

### ✨ 为什么值得 Star

- **📅 持续月更**：把 AI 学习从"看完就过时"的教材，变成可月更的学习系统
- **🇨🇳 贴近中国应用市场**：覆盖国内外模型、短视频、内容生产、AI 编程、Agent 和工作流
- **🎮 游戏化学习闭环**：签到、XP、等级、徽章、作品点亮和学习周报，让学习过程可见
- **🎨 作品导向**：学习结果不只停留在笔记，而是沉淀成作品集、脚本工厂、知识库问答和产品观察
- **🚀 纯静态、易部署**：不需要复杂后端，适合 GitHub Pages、课堂演示、个人自学站和内容共创
- **🤖 AI 搜索友好**：提供 `sitemap.xml`、`robots.txt` 和 `llms.txt`，便于搜索引擎与 AI 问答理解站点结构

---

## 📸 项目截图

> 📷 **欢迎贡献截图**！请提交 PR 更新本区域。
> 推荐截图尺寸：桌面端 1600×900，移动端 390×844。

|                             首页与学习驾驶舱                              |                                 学习路线详情                                  |
| :-----------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
|              _[点击查看线上 Demo](https://ai.mynaxis.com/)_               |                _[点击查看线上 Demo](https://ai.mynaxis.com/)_                 |
| ![首页截图](https://via.placeholder.com/800x450?text=Homepage+Screenshot) | ![路线截图](https://via.placeholder.com/800x450?text=Track+Detail+Screenshot) |

|                                     模型对比                                      |                                    Agent 角色学院                                     |
| :-------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
|                  _[点击查看线上 Demo](https://ai.mynaxis.com/)_                   |                    _[点击查看线上 Demo](https://ai.mynaxis.com/)_                     |
| ![模型截图](https://via.placeholder.com/800x450?text=Model+Comparison+Screenshot) | ![Agent 截图](https://via.placeholder.com/800x450?text=Agent+Role+Academy+Screenshot) |

---

## 🚀 快速开始

### 在线体验

直接访问：**[https://ai.mynaxis.com/](https://ai.mynaxis.com/)**

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/happywa147/ai-learning-site.git
cd ai-learning-site

# 安装依赖（可选，用于构建和生产部署）
npm install

# 启动本地开发服务器
npm run dev
# 或直接使用 Python 启动静态服务器
python3 -m http.server 8765

# 打开浏览器访问
open http://localhost:8765
```

### 构建生产版本

```bash
npm run build
# 构建输出在 dist/ 目录
# 使用 npm run serve 预览构建结果
```

---

## 🎯 适合谁

- ✅ 刚开始系统学习 AI 的新人
- ✅ 想把 AI 用进工作流的职场人
- ✅ 做短视频、图文、直播和内容矩阵的创作者
- ✅ 想入门 AI 编程、Agent、Skill、RAG 的实践者
- ✅ 关注中国 AI 应用市场和产品机会的人
- ✅ 想陪伴家人或团队建立 AI 学习节奏的人

---

## ✨ 核心功能

| 功能                               | 说明                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| 🎮 **AI 学习游戏化**               | 签到、XP、等级、徽章和任务进度，让学习过程可视化           |
| 📚 **五条学习路径**                | 零基础入门、短视频创作者、RAG、AI 应用开发、AI 部署交付    |
| 🤖 **国内外模型对比**              | 按应用场景理解模型差异，含 benchmark 数据                  |
| 🎨 **作品样例库**                  | 展示学习成果应该长什么样                                   |
| 🔧 **Agent 角色学院**              | 67 个可筛选中文学习角色卡，支持复制角色卡和今日 Agent 挑战 |
| 📡 **GitHub AI 学习资源雷达**      | 标注值得借鉴、可按许可证复用、需谨慎改造的开源项目         |
| 🚀 **AI 项目挑战库**               | 12 个带难度、时间、工具、交付物和验收标准的项目挑战        |
| 💡 **Prompt、Agent、Skill 模板库** | 可直接复制使用的模板                                       |
| 📊 **每月更新区**                  | 模型观察、中国应用市场、本月训练、避坑提醒                 |
| 🌍 **AI 时代世界观**               | 基础设施、协作方式、验证精神、责任边界                     |
| 📋 **学习周报**                    | 导出 Markdown 学习报告                                     |
| 🔄 **反馈循环**                    | 本地记录反馈，可导出 CSV 供月更参考                        |
| 📱 **PWA 支持**                    | 可安装到桌面，支持离线访问                                 |
| 🔍 **SEO 优化**                    | sitemap.xml、robots.txt、OGP meta、JSON-LD                 |
| ♿ **无障碍**                      | WCAG AA 对比度、focus-visible、44px 触控区                 |

---

## 🏗️ 项目架构

```
ai-learning-site/
├── index.html                # 主页面（SPA 入口）
├── src/
│   └── modules/              # JavaScript 模块（9 个文件）
│       ├── 00-config.js      # 配置和全局状态
│       ├── 01-gamelogic.js  # 游戏逻辑（签到/XP/等级/徽章）
│       ├── 02-admin.js       # 管理后台
│       ├── 03-events.js      # 事件处理
│       ├── 04-search.js      # 搜索功能
│       ├── 05-report.js      # 报告生成
│       ├── 06-ai-tutor.js   # AI 导师
│       ├── 07-misc.js       # 杂项功能
│       └── 08-init.js       # 初始化
├── styles.css                # 全局样式（CSS 变量 + 响应式）
├── assets/
│   └── data/                # JSON 数据文件
│       ├── tracks.json       # 5 条学习路线
│       ├── models.json       # 13 个 AI 模型数据
│       ├── agent-roles.json  # 67 张 Agent 角色卡
│       ├── projects.json     # 项目挑战库
│       └── ...              # 其他数据文件
├── scripts/                  # 构建与工具脚本
│   ├── build.js              # esbuild 构建管线
│   ├── generate-ssg.js     # 静态站点生成
│   └── validate-content.js  # 内容校验
├── dist/                     # 构建输出（由 npm run build 生成）
├── docs/                     # 文档
│   ├── data-schema.md        # 数据字段规范
│   └── data-contribution-guide.md # 数据贡献规范
└── .github/                  # GitHub 配置
    ├── workflows/build.yml     # CI/CD 自动部署
    └── ISSUE_TEMPLATE/        # Issue 模板
```

---

## 🛠️ 技术栈

| 类别         | 技术                                                         |
| ------------ | ------------------------------------------------------------ |
| **前端**     | HTML5、CSS3（CSS 变量 + 响应式）、Vanilla JavaScript（ES6+） |
| **构建**     | esbuild（打包 + minify + content hash）                      |
| **部署**     | GitHub Actions → GitHub Pages                                |
| **PWA**      | manifest.json + Service Worker（离线缓存）                   |
| **压缩**     | Brotli（77-82% 体积缩减）                                    |
| **代码质量** | ESLint + Prettier + Husky + lint-staged                      |
| **分析**     | Google Analytics 4（GA4）                                    |

---

## 📅 每月更新

本项目的核心是**持续更新**，而非固定教材。

每月更新内容位于 `assets/monthly-updates.json`，包含：

- 🔍 **模型观察**：新发布模型的能力边界和适用场景
- 🇨🇳 **中国应用市场**：短视频、内容生产、AI 编程、Agent 的新变化
- 💪 **本月训练**：具体的 Prompt / Agent / RAG 练习任务
- ⚠️ **避坑提醒**：本月值得注意的失败案例和认知误区

### 如何贡献月更

详见 [CONTRIBUTING.md](CONTRIBUTING.md#如何提交月更)。

---

## 🤝 参与贡献

本项目以可持续更新为核心，欢迎通过 Issue 与 PR 一起共建！

### 贡献方式

| 贡献类型        | 说明                                                 | 适合人群    |
| --------------- | ---------------------------------------------------- | ----------- |
| 📝 **内容贡献** | 新增/修正 Agent 角色卡、模型数据、学习路线、项目挑战 | 所有人      |
| 🐛 **Bug 修复** | 修复页面显示、数据加载、游戏系统等 bug               | 前端开发者  |
| ✨ **功能建议** | 提出新功能想法并实现                                 | 前端开发者  |
| 🎨 **设计改进** | CSS 样式、可访问性、移动端适配                       | 设计师/前端 |
| 📖 **文档**     | 完善 README、数据字段文档、代码注释                  | 技术写作者  |

### 快速贡献指南

1. **Fork** 仓库
2. 创建 **分支**：`git checkout -b feat/your-feature`
3. **修改** 代码或数据
4. **验证**：运行 `npm run build` 和 `npm run lint`
5. **提交**：使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/)
6. **发起 PR**：填写 PR 模板中的全部信息

详细流程见：

- [CONTRIBUTING.md](CONTRIBUTING.md) — 完整贡献指南
- [docs/data-contribution-guide.md](docs/data-contribution-guide.md) — 数据贡献规范
- [docs/data-schema.md](docs/data-schema.md) — 数据字段规范

---

## 📝 文档

| 文档                                                               | 说明                                    |
| ------------------------------------------------------------------ | --------------------------------------- |
| [README.md](README.md)                                             | 项目介绍和快速开始                      |
| [CONTRIBUTING.md](CONTRIBUTING.md)                                 | 贡献指南（本地开发、代码风格、PR 流程） |
| [CHANGELOG.md](CHANGELOG.md)                                       | 更新日志（Keep a Changelog 格式）       |
| [docs/data-contribution-guide.md](docs/data-contribution-guide.md) | 数据贡献规范                            |
| [docs/data-schema.md](docs/data-schema.md)                         | 数据字段规范                            |
| [ARCHITECTURE.md](ARCHITECTURE.md)                                 | 项目架构文档                            |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)                           | 贡献者公约 2.1                          |
| [ROADMAP.md](ROADMAP.md)                                           | 项目路线图                              |

---

## 🎯 路线图

### ✅ v1.0.0（已完成）

- [x] 5 条学习路线 + 20 个课程模块
- [x] 游戏化系统（签到/XP/等级/徽章）
- [x] 13 个 AI 模型数据 + benchmark 对比
- [x] 67 张 Agent 角色卡
- [x] PWA 支持 + Service Worker
- [x] SEO 优化（sitemap/robots/OGP）
- [x] GA4 集成
- [x] 模块化架构（9 个 JS 模块）
- [x] GitHub Actions 自动部署
- [x] 18 位专家三轮评审（综合 8.6/10）

### 🔄 v1.1.0（进行中）

- [ ] Tree-shaking（引入 Rollup）
- [ ] Vitest 单元测试覆盖核心游戏逻辑
- [ ] sw.js 预缓存优化
- [ ] GitHub Discussions 集成

### 🚀 v2.0.0（规划中）

- [ ] CloudBase 云同步替代 localStorage
- [ ] 用户贡献内容审核流程
- [ ] 多语言支持（英文/日文）
- [ ] 移动端原生 App（React Native）

---

## 📊 项目统计

<p align="center">
  <img src="https://img.shields.io/github/languages/top/happywa147/ai-learning-site?style=flat-square" alt="Top Language" />
  <img src="https://img.shields.io/github/repo-size/happywa147/ai-learning-site?style=flat-square" alt="Repo Size" />
  <img src="https://img.shields.io/github/stars/happywa147/ai-learning-site?style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/forks/happywa147/ai-learning-site?style=flat-square" alt="Forks" />
  <img src="https://img.shields.io/github/issues/happywa147/ai-learning-site?style=flat-square" alt="Issues" />
  <img src="https://img.shields.io/github/issues-pr/happywa147/ai-learning-site?style=flat-square" alt="Pull Requests" />
</p>

---

## 📜 更新日志

完整更新日志见 [CHANGELOG.md](CHANGELOG.md)。

### 最新版本：v1.0.0（2026-07-04）

**首个正式版本** — 经过 18 位专家三轮迭代评审（综合均分 8.6/10），达到上线就绪状态。

主要变化：

- ✨ 新增：5 条学习路线、游戏化系统、模型决策树（交互式）、新手引导
- 🔧 修复：分享图 QR 码、邀请链接 UTM、购买动画、管理后台统计
- 🔄 变更：GA4 真实 ID、模块化架构、构建管线 9 步骤
- 📝 文档：CHANGELOG.md、数据贡献规范、优化 README

---

## 📄 许可证

本项目采用 **MIT 许可证** — 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- Agent 角色学院的设计灵感参考 [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)
- 站点图标来自 [Feather Icons](https://feathericons.com/)
- 颜色方案受中国传统色彩启发

---

## 📧 联系与反馈

- **GitHub Issues**：[提交问题或建议](https://github.com/happywa147/ai-learning-site/issues)
- **网站反馈**：使用站点内「反馈循环」模块
- **邮件**：通过站点内「注册与联系」模块获取
- **微信**：扫码关注站点动态（见站点首页）

---

<p align="center">
  ⭐ 如果这个项目对你有帮助，请点一个 Star！⭐<br/>
  <a href="https://github.com/happywa147/ai-learning-site">https://github.com/happywa147/ai-learning-site</a>
</p>
