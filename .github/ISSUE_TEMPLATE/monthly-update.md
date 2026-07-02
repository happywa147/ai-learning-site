---
name: 月度更新
about: 提交 / 校验每月更新区内容
title: "[Monthly] "
labels:
  - monthly-update
assignees: []
---

## 更新月份

- 月度 ID（如 2026-09）：
- 月度标题：

## 主要内容

### 模型观察
- 

### 中国市场观察
- 

### 本月训练任务
- 

### 避坑提醒
- 

## 数据与清单

- JSON 片段（请尽量按 `docs/monthly-updates-schema.md` 填写）：

```json
{
  "id": "2026-09",
  "label": "2026 年 9 月",
  "status": "published",
  "updatedAt": "2026-09-01",
  "lastVerified": "2026-09-01",
  "sources": [
    {
      "label": "官方文档或实测记录名称",
      "url": "https://example.com"
    }
  ],
  "testedTasks": [
    "写清楚本月用于验证结论的任务"
  ],
  "confidence": "medium",
  "title": "",
  "summary": "",
  "cards": [
    {
      "title": "模型观察",
      "items": []
    }
  ]
}
```

## 来源与复核

- 官方来源链接：
- 实测任务或样例输出：
- 结论适用边界：
- 建议下次复核日期：
- 可信度（low / medium / high）：

## 验证记录

- 是否运行 `node scripts/validate-content.js`：
- 本地验证页面：
- 月份切换是否正常：
- 内容是否能正常显示：
