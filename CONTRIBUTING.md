# 贡献指南

感谢你对 **ai.mynaxis.com** 的关注！这里是你参与共建的完整指南。

## 行为准则

本项目遵循 [贡献者公约 2.1](CODE_OF_CONDUCT.md)。请尊重所有贡献者。

## 我能贡献什么？

| 贡献类型 | 说明 | 适合人群 |
|----------|------|----------|
| 📝 **内容贡献** | 新增/修正 Agent 角色卡、模型数据、学习路线、项目挑战 | 所有人 |
| 🐛 **Bug 修复** | 修复页面显示、数据加载、游戏系统等 bug | 前端开发者 |
| ✨ **功能建议** | 提出新功能想法并实现 | 前端开发者 |
| 🎨 **设计改进** | CSS 样式、可访问性、移动端适配 | 设计师/前端 |
| 📖 **文档** | 完善 README、数据字段文档、代码注释 | 技术写作者 |

## 本地开发环境

### 前置要求

- [Node.js](https://nodejs.org/) 18+
- Git

### 快速开始

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/happywa147/ai-learning-site.git
cd ai-learning-site

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 构建生产版本
npm run build
```

### 项目结构

```
ai-learning-site/
├── index.html            # 主页面（SPA 入口）
├── app.js                # 核心逻辑（~3400 行，按注释分区组织）
├── styles.css            # 全局样式（CSS 变量 + 响应式）
├── assets/data/          # 18 个 JSON 数据文件
│   ├── agent-roles.json  # 67 张 Agent 角色卡
│   ├── models.json       # 13 个 AI 模型数据
│   ├── tracks.json       # 5 条学习路线
│   ├── projects.json     # 项目挑战库
│   └── ...
├── scripts/              # 构建与工具脚本
│   ├── build.js          # esbuild 构建管线
│   ├── generate-ssg.js   # 静态站点生成
│   └── serve-dev.js      # 本地开发服务器
├── dist/                 # 构建输出（由 npm run build 生成）
├── docs/                 # 文档
│   └── data-schema.md    # 数据字段规范
└── .github/              # GitHub 配置
    ├── workflows/build.yml    # CI/CD 自动部署
    └── ISSUE_TEMPLATE/        # Issue 模板
```

## 代码风格约定

### JavaScript

- **架构**：app.js 保持单文件架构，按 `/* ====== 区块名 ====== */` 注释分区
- **函数命名**：`camelCase`，渲染函数以 `render` 开头（如 `renderAgentRoles`）
- **全局状态**：`state` 对象统一管理，通过 `persistGameState()` 持久化到 localStorage
- **数据加载**：通过 `loadAllData()` 异步获取 JSON 文件，存储在全局变量中
- **缩进**：2 空格
- **引号**：双引号 `"`

### CSS

- **设计系统**：CSS 变量定义在 `:root` 中（`--jujube`, `--earth`, `--muted` 等）
- **响应式**：移动端断点 `max-width: 768px`
- **触摸目标**：所有交互元素 min 44×44px
- **可访问性**：所有聚焦状态有 `:focus-visible` 样式，对比度满足 WCAG AA

### JSON 数据文件

所有 JSON 文件字段规范见 [docs/data-schema.md](docs/data-schema.md)。

**关键规则**：
- 文件必须使用 UTF-8 编码
- 所有文本字段使用简体中文
- 提交前运行 `python3 -m json.tool <file>` 验证格式

## JSON 字段速查

### Agent 角色卡 (`agent-roles.json`)
```json
{
  "name": "角色名",
  "source": "出处",
  "desc": "角色描述",
  "level": "basic|advanced|expert",
  "input": "输入格式",
  "output": "输出格式",
  "check": "质量检验方法",
  "practice": "实战任务建议"
}
```

### 模型数据 (`models.json`)
```json
{
  "name": "模型名称",
  "version": "版本号",
  "type": "text|video",
  "desc": "模型描述",
  "benchmark": { "humanEval": "90.2%", "cEval": "69.3%", "mbpp": "83.5%" },
  "strengths": ["优势1"],
  "url": "官方网址"
}
```

### 学习路线 (`tracks.json`)
```json
{
  "id": {
    "title": "路线标题",
    "summary": "路线简介",
    "outcomes": ["学习成果1"],
    "prereq": ["前置条件1"],
    "selfCheck": ["自测项1"],
    "modules": [
      {
        "title": "模块名",
        "desc": "模块描述",
        "difficulty": "beginner|intermediate|advanced",
        "practice": [
          { "step": "操作步骤", "expect": "预期结果" }
        ],
        "commonErrors": [
          { "error": "常见错误描述", "fix": "解决方法" }
        ]
      }
    ]
  }
}
```

## PR 提交流程

1. **Fork 仓库** → 创建 `feat/xxx` 或 `fix/xxx` 分支
2. **修改代码**，确保本地测试通过：
   ```bash
   npm run dev          # 启动本地服务器测试
   python3 -m json.tool assets/data/*.json > /dev/null  # 验证 JSON
   ```
3. **提交 commit**，使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/)：
   ```
   feat: 新增 Cluade 4 模型数据
   fix: 修复移动端导航菜单无法关闭
   docs: 补充模块难度标签说明
   ```
4. **发起 Pull Request**，填写 PR 模板中的全部信息
5. **等待 Review**，维护者会在 3 个工作日内反馈

### PR 检查清单

提交前请确认：

- [ ] JSON 格式有效（`python3 -m json.tool` 无报错）
- [ ] `npm run build` 成功
- [ ] 本地服务器（`npm run dev`）页面正常渲染
- [ ] 移动端（375px 宽）布局正常
- [ ] 新增内容无政治/色情/侵权内容
- [ ] 签署 DCO（`git commit -s`）

## 开发建议

- **修改 JSON 数据**：直接编辑 `assets/data/` 下的文件，然后刷新浏览器即可看到变化
- **修改 JS/CSS**：编辑 `app.js` 或 `styles.css`，刷新浏览器查看效果
- **调试技巧**：打开浏览器开发者工具 → Application → Local Storage 可查看用户数据状态
- **快速重置数据**：在控制台执行 `localStorage.clear(); location.reload();`

## 获取帮助

- 在 GitHub 上提 [Issue](https://github.com/happywa147/ai-learning-site/issues)
- 网站内「反馈循环」模块可提交使用反馈
- 联系维护者：舰理 Lonny（GitHub: happywa147，Gitee: neomerc）
