# PR 模板

## 变更类型

请勾选本次变更涉及的类型（可多选）：

- [ ] 页面 / 交互（index.html、app.js、styles.css）
- [ ] 数据内容（assets/data/*.json）
- [ ] 文档（README、docs/ 等）
- [ ] 工具 / 脚本（scripts/）
- [ ] 配置 / 部署（.github/、deploy/）

## 变更描述

请简要说明本次改动做了什么、为什么这样做。

## 关联 Issue

 closes #

## 测试说明

- [ ] 运行 `python3 -m http.server 8765` 本地预览
- [ ] 运行 `node --check app.js` 语法检查
- [ ] 运行 `node scripts/validate-content.js` 内容校验
- [ ] 验证签到、周任务、项目点亮等核心功能
- [ ] 验证移动端显示正常
- [ ] 验证 `?page=` 路由切换正常

## 检查清单

- [ ] 新增内容有明确来源和核实日期
- [ ] 不使用「可搬运改写」等模糊表述，许可证边界清晰
- [ ] 不引入外部依赖，保持纯静态
- [ ] 用户数据相关变更考虑了 localStorage 兼容性
