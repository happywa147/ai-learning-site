# 月更数据 Schema

月更内容存放在 `assets/monthly-updates.json`。每条记录代表一个月份，正式展示前必须满足本页规则。

## 顶层结构

顶层必须是数组：

```json
[
  {
    "id": "2026-07",
    "label": "2026 年 7 月",
    "status": "published",
    "updatedAt": "2026-07-01",
    "lastVerified": "2026-07-02",
    "sources": [],
    "testedTasks": [],
    "confidence": "medium",
    "title": "",
    "summary": "",
    "cards": []
  }
]
```

## 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 月份 ID，格式建议为 `YYYY-MM`。 |
| `label` | string | 是 | 页面下拉框显示名称。 |
| `status` | string | 是 | `published` 会展示，`draft` 不展示。 |
| `updatedAt` | string | published 必填 | 内容发布日期，格式为 `YYYY-MM-DD`。 |
| `lastVerified` | string | published 必填 | 最近人工复核日期，格式为 `YYYY-MM-DD`。 |
| `sources` | array | published 必填 | 来源列表，必须是可访问的 `http` 或 `https` 链接。 |
| `testedTasks` | array | published 必填 | 本月用于验证结论的任务或实测记录。 |
| `confidence` | string | published 必填 | `low`、`medium`、`high` 三选一。 |
| `title` | string | 是 | 本月主题标题。 |
| `summary` | string | 是 | 本月摘要，避免绝对化断言。 |
| `cards` | array | 是 | 页面卡片，每张卡片包含 `title` 和 `items`。 |

## 来源优先级

优先使用：

- 官方产品文档、模型文档、价格页、发布公告
- 可复现的实测记录、任务输出、对比表
- 权威机构报告或可信开发者文档

不建议把站内模板、个人印象、社交平台传闻作为事实来源。站内模板只能作为贡献流程说明，不能单独支撑市场或模型判断。

## 可信度标签

- `high`：有官方来源，并有可复现实测或多来源交叉验证。
- `medium`：有明确来源，但实测样本有限，或结论只适合部分场景。
- `low`：仍在观察，来源不足或变化很快，不适合写成稳定结论。

## 发布前校验

提交 PR 前至少运行：

```bash
node scripts/validate-content.js
```

该脚本会检查：

- `app.js` 语法
- 月更 JSON 是否可解析
- `published` 内容是否包含来源、复核日期、实测任务和可信度
- 来源 URL 是否为 `http` 或 `https`
- `index.html` 是否包含关键结构化数据
- `sitemap.xml`、`robots.txt`、`llms.txt` 等关键文件是否存在
