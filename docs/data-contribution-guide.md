# 数据贡献规范

> 本文档规定如何向 ai.mynaxis.com 贡献学习内容（路线、模块、模型、Agent 角色卡、项目挑战等）。
> 遵循本规范可以确保数据质量一致、易于维护、适合中文 AI 学习者使用。

## 目录

1. [通用规则](#通用规则)
2. [学习路线（tracks.json）](#学习路线tracksjson)
3. [模型数据（models.json）](#模型数据modelsjson)
4. [Agent 角色卡（agent-roles.json）](#agent-角色卡agent-rolesjson)
5. [项目挑战（projects.json）](#项目挑战projectsjson)
6. [资源雷达（resource-radar.json）](#资源雷达resource-radarjson)
7. [提交流程](#提交流程)
8. [审核标准](#审核标准)

---

## 通用规则

### ✅ 必须遵守

1. **使用简体中文**：所有 `title`、`desc`、`summary`、`practice` 等文本字段使用简体中文
2. **UTF-8 编码**：JSON 文件必须使用 UTF-8 编码，无 BOM
3. **格式验证**：提交前运行 `python3 -m json.tool <file>` 确保 JSON 格式有效
4. **无个人敏感信息**：不包含真实姓名、电话、地址、微信号等
5. **尊重版权**：引用的外部内容需注明来源，不使用侵权材料

### 📝 内容质量标准

| 标准         | 说明                                               |
| ------------ | -------------------------------------------------- |
| **可复核**   | 给出的结论必须有官方来源或实测任务支撑，避免空口号 |
| **场景明确** | 说明适用场景和边界，不做绝对化结论                 |
| **中国应用** | 每月至少含 1 条中国应用场景观察                    |
| **证据链**   | 涉及证据时使用来源链条，不出现无来源的结论断言     |
| **时效性**   | 标注信息更新日期（`updatedAt` / `lastVerified`）   |

---

## 学习路线（tracks.json）

### 文件位置

```
assets/data/tracks.json
```

### 数据结构

```json
{
  "<track-id>": {
    "title": "路线标题（简短，不超过 10 个汉字）",
    "summary": "路线简介（1-2 句话，说明适合人群和学习目标）",
    "outcomes": ["学习成果 1（具体、可验证）", "学习成果 2"],
    "prereq": ["前置条件 1（如无则写'无'）", "前置条件 2"],
    "selfCheck": ["自测项 1（学完后的自我检验）", "自测项 2"],
    "modules": [
      {
        "id": "<track-id>-m01",
        "title": "模块标题",
        "desc": "模块描述（2-3 句话）",
        "difficulty": "beginner | intermediate | advanced",
        "practice": [
          {
            "step": "操作步骤（具体、可复现）",
            "expect": "预期结果（如何验证操作成功）"
          }
        ],
        "commonErrors": [
          {
            "error": "常见错误描述（具体场景）",
            "fix": "解决方法（步骤清晰）"
          }
        ]
      }
    ]
  }
}
```

### 字段说明

| 字段                     | 类型   | 必填 | 说明                                             |
| ------------------------ | ------ | :--: | ------------------------------------------------ |
| `track-id`               | String |  ✅  | 路线 ID，小写字母 + 连字符，如 `freshman`、`rag` |
| `title`                  | String |  ✅  | 路线标题，简短明确                               |
| `summary`                | String |  ✅  | 路线简介，说明适合人群和学习目标                 |
| `outcomes`               | Array  |  ✅  | 学习成果，至少 2 条，具体可验证                  |
| `prereq`                 | Array  |  ✅  | 前置条件，如无则填 `["无"]`                      |
| `selfCheck`              | Array  |  ✅  | 自测项，至少 3 条                                |
| `modules`                | Array  |  ✅  | 课程模块，每个路线 4-5 个模块                    |
| `modules[].id`           | String |  ✅  | 模块 ID，格式 `<track-id>-m<序号>`               |
| `modules[].difficulty`   | String |  ✅  | 难度：`beginner` / `intermediate` / `advanced`   |
| `modules[].practice`     | Array  |  ✅  | 实践步骤，每个模块 2-4 步                        |
| `modules[].commonErrors` | Array  |  ✅  | 常见错误，每个模块 2 条                          |

### 示例：新增一个模块

```json
{
  "id": "freshman-m03",
  "title": "第一次和 AI 协作写文章",
  "desc": "学会用提示词让 AI 帮你写、改、续写文章，并理解人类在其中的把关作用。",
  "difficulty": "beginner",
  "practice": [
    {
      "step": "打开 AI 对话框，输入：'请帮我写一篇关于 AI 应用的 800 字文章，面向职场新人'",
      "expect": "AI 生成一篇结构完整的文章，含标题、引言、正文、结尾"
    },
    {
      "step": "在 AI 回复后输入：'请把第 2 段改得更口语化，加入一个职场场景的例子'",
      "expect": "AI 修改指定段落，语言更自然，例子贴合职场"
    }
  ],
  "commonErrors": [
    {
      "error": "提示词太模糊，如'帮我写篇文章'，AI 输出泛泛而谈",
      "fix": "加具体场景、字数、风格、受众，如'写一篇 800 字文章，面向职场新人，风格口语化'"
    },
    {
      "error": "直接复制 AI 输出不把关，导致事实错误",
      "fix": "用人话复述一遍 AI 的回答，卡壳的地方就是没懂的地方，需要追问或查资料"
    }
  ]
}
```

### 难度标签规范

| 标签           | 说明                                 | 适合人群                   |
| -------------- | ------------------------------------ | -------------------------- |
| `beginner`     | 零基础，不需要前置知识               | 第一次接触 AI 的学习者     |
| `intermediate` | 需要基础 Prompt 能力，能看懂 AI 输出 | 用过 AI 工具 1-2 个月      |
| `advanced`     | 需要编程基础或复杂工作流理解         | 有 AI 项目实践经验的开发者 |

---

## 模型数据（models.json）

### 文件位置

```
assets/data/models.json
```

### 数据结构

```json
{
  "models": [
    {
      "name": "模型名称（含版本，如 Claude 3.7 Sonnet）",
      "version": "版本号",
      "type": "text | video | image | code",
      "desc": "模型描述（2-3 句话，说明核心能力和适用场景）",
      "benchmark": {
        "humanEval": "90.2%",
        "codeEval": "69.3%",
        "mbpp": "83.5%"
      },
      "strengths": ["优势 1（具体，有场景）", "优势 2"],
      "url": "官方网站链接"
    }
  ]
}
```

### 字段说明

| 字段        | 类型   | 必填 | 说明                                      |
| ----------- | ------ | :--: | ----------------------------------------- |
| `name`      | String |  ✅  | 模型名称，含版本号                        |
| `version`   | String |  ✅  | 版本号，如 `3.7`、`1.5`                   |
| `type`      | String |  ✅  | 类型：`text` / `video` / `image` / `code` |
| `desc`      | String |  ✅  | 描述，说明核心能力和适用场景              |
| `benchmark` | Object |  ⚠️  | 基准测试成绩（如有），键值对格式          |
| `strengths` | Array  |  ✅  | 优势列表，至少 2 条                       |
| `url`       | String |  ✅  | 官方网站链接，以 `https://` 开头          |

### 注意事项

- **避免绝对化结论**：不说"XX 模型最强"，而说"XX 模型在 YY 场景表现突出"
- **标注数据来源**：benchmark 数据需注明测试时间和来源
- **中国模型优先**：尽量包含至少 3 个中国AI 公司模型（如通义千问、文心一言、讯飞星火）

---

## Agent 角色卡（agent-roles.json）

### 文件位置

```
assets/data/agent-roles.json
```

### 数据结构

```json
[
  {
    "name": "角色名称（如：产品经理 AI 搭档）",
    "source": "来源或灵感（如：参考《启示录》）",
    "desc": "角色描述（2-3 句话，说明角色定位和帮助你做什么）",
    "level": "basic | advanced | expert",
    "input": "输入格式说明（如：产品需求文档草稿）",
    "output": "输出格式说明（如：结构化的 PRD 大纲）",
    "check": "质量检验方法（如：能否通过'五个为什么'测试）",
    "practice": "实战任务建议（具体可操作的任务）"
  }
]
```

### 字段说明

| 字段       | 类型   | 必填 | 说明                                  |
| ---------- | ------ | :--: | ------------------------------------- |
| `name`     | String |  ✅  | 角色名称，简洁有力                    |
| `source`   | String |  ⚠️  | 来源或灵感（可选）                    |
| `desc`     | String |  ✅  | 角色描述，说明定位和帮助你做什么      |
| `level`    | String |  ✅  | 难度：`basic` / `advanced` / `expert` |
| `input`    | String |  ✅  | 输入格式说明                          |
| `output`   | String |  ✅  | 输出格式说明                          |
| `check`    | String |  ✅  | 质量检验方法                          |
| `practice` | String |  ✅  | 实战任务建议                          |

### 质量检查清单

- [ ] 角色定位明确，不是泛泛的"AI 助手"
- [ ] 输入/输出格式具体，用户知道怎么用
- [ ] 质量检验方法可操作，不是空话
- [ ] 实战任务具体，能在 30 分钟内完成

---

## 项目挑战（projects.json）

### 文件位置

```
assets/data/projects.json
```

### 数据结构

```json
{
  "projects": [
    {
      "id": "p01",
      "title": "项目标题",
      "difficulty": "⭐⭐⭐⭐⭐",
      "time": "预计完成时间（如：2-3 小时）",
      "tools": ["工具 1", "工具 2"],
      "outcome": "交付物说明",
      "acceptance": ["验收标准 1", "验收标准 2"]
    }
  ]
}
```

### 难度星级规范

| 星级       | 含义 | 所需能力                      |
| ---------- | ---- | ----------------------------- |
| ⭐⭐       | 简单 | 零基础，会基本电脑操作        |
| ⭐⭐⭐     | 中等 | 用过 AI 工具，能写基本 Prompt |
| ⭐⭐⭐⭐   | 较难 | 有编程基础或复杂工作流经验    |
| ⭐⭐⭐⭐⭐ | 挑战 | 需要综合多个 AI 工具完成项目  |

---

## 资源雷达（resource-radar.json）

### 文件位置

```
assets/data/resource-radar.json
```

### 数据结构

```json
[
  {
    "name": "资源名称",
    "type": "开源项目 | 教程 | 工具 | 数据集",
    "license": "许可证（如：MIT、Apache 2.0）",
    "desc": "资源描述",
    "url": "资源链接",
    "verifiedAt": "2026-07-01",
    "advice": "可直接复用 | 需谨慎改造 | 仅借鉴机制"
  }
]
```

### 处理建议规范

| advice 值    | 含义                       | 使用场景                        |
| ------------ | -------------------------- | ------------------------------- |
| `可直接复用` | 许可证清晰，可原样使用     | MIT / Apache 2.0 等宽松许可证   |
| `需谨慎改造` | 许可证有限制，需修改后使用 | GPL / AGPL 等强 Copyleft 许可证 |
| `仅借鉴机制` | 许可证不清晰或限制较强     | 无许可证或限制较强的项目        |

---

## 提交流程

### 1. Fork 仓库

```bash
# 点击 GitHub 上的 Fork 按钮，然后克隆你的 Fork
git clone https://github.com/<your-username>/ai-learning-site.git
cd ai-learning-site
```

### 2. 创建分支

```bash
git checkout -b feat/add-<your-contribution>
```

### 3. 修改数据文件

- 编辑对应的 JSON 文件（如 `assets/data/tracks.json`）
- **重要**：保持 JSON 格式有效，运行：
  ```bash
  python3 -m json.tool assets/data/tracks.json > /dev/null
  ```

### 4. 本地验证

```bash
# 启动本地服务器
npm run dev
# 或
python3 -m http.server 8765

# 打开浏览器访问 http://localhost:8765
# 验证你的修改已正确渲染
```

### 5. 提交更改

```bash
git add assets/data/tracks.json
git commit -m "feat: 新增 XXX 路线/模块/模型数据

- 说明本次修改的内容
- 涉及哪些文件
- 为什么这样修改"
```

### 6. 发起 Pull Request

- 推送到你的 Fork：`git push origin feat/add-<your-contribution>`
- 在 GitHub 上点击「Compare & pull request」
- 填写 PR 模板，说明你的修改
- 等待维护者审核（通常 3 个工作日内反馈）

---

## 审核标准

维护者会从以下维度审核你的贡献：

| 维度           | 审核要点                                   |
| -------------- | ------------------------------------------ |
| **格式有效性** | JSON 格式正确，无语法错误                  |
| **内容质量**   | 遵循本文档的「内容质量标准」               |
| **时效性**     | 信息是最新的，标注了更新日期               |
| **适用性**     | 内容适合中文 AI 学习者，不过度依赖英文材料 |
| **安全性**     | 不含个人敏感信息、恶意链接、侵权内容       |

### 常见拒绝原因

| 原因                     | 解决方法                         |
| ------------------------ | -------------------------------- |
| JSON 格式错误            | 运行 `python3 -m json.tool` 检查 |
| 内容泛泛而谈，无可操作性 | 加入具体步骤、场景、示例         |
| 缺少来源或证据链         | 补充官方链接或实测任务说明       |
| 使用繁体中文或英文       | 改为简体中文                     |
| 一次性提交过多不相关修改 | 拆分为多个小 PR                  |

---

## 提问与帮助

- 在 GitHub 上提 [Issue](https://github.com/happywa147/ai-learning-site/issues)
- 选择「数据贡献」模板
- 说明你想贡献的内容类型和大致思路

感谢你的贡献！🙏

---

_本文档随项目迭代更新，最新版本请查看 [docs/data-contribution-guide.md](https://github.com/happywa147/ai-learning-site/blob/main/docs/data-contribution-guide.md)_
