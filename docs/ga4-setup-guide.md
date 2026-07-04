# Google Analytics 4 测量 ID 获取与配置指南

本指南帮助你在 **ai.mynaxis.com** 站点上配置 Google Analytics 4（GA4），实现流量分析、页面浏览统计、用户行为追踪和获取渠道分析。

---

## 第一步：登录 Google Analytics

1. 打开浏览器，访问 [analytics.google.com](https://analytics.google.com)
2. 使用你的 Google 账号登录（如果没有，先注册一个 Google 账号）
3. 如果这是你第一次使用，系统会引导你创建第一个账号

---

## 第二步：进入管理后台

1. 登录后，点击页面左下角的 **齿轮图标**（⚙ 管理 / Admin）
2. 在「账号」列确认选中你的 Google Analytics 账号
3. 在「媒体资源」列确认选中对应网站的媒体资源（如果没有，点击「创建媒体资源」）

---

## 第三步：创建或找到数据流

1. 在「媒体资源」列下方，点击 **数据流**（Data Streams）
2. 如果你已有 Web 数据流，点击对应的数据流名称即可
3. 如果没有：
   - 点击 **添加数据流** 按钮
   - 选择 **Web**（网站）
   - 输入网站网址：`https://ai.mynaxis.com`
   - 输入数据流名称（例如：`ai-learning-site`）
   - 点击「创建数据流」

---

## 第四步：获取测量 ID

在数据流详情页面中，你会看到：

```
测量 ID：G-XXXXXXXXXX
```

这就是你的 **GA4 测量 ID**，格式为 `G-` 开头，后面跟着一串字母数字组合。

点击测量 ID 旁边的复制图标，将其复制到剪贴板。

---

## 第五步：更新 index.html

1. 打开项目中的 `index.html` 文件
2. 找到大约第 152 行附近的 GA4 配置代码：

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { 'anonymize_ip': true });
</script>
```

3. 将两处 `G-XXXXXXXXXX` 替换为你的实际测量 ID
4. 保存文件

---

## 第六步：部署验证

1. 将更新后的文件推送到 GitHub
2. 等待 GitHub Pages 自动部署完成
3. 回到 GA4 后台，进入「报告」→「实时」
4. 访问你的网站，如果实时报告中出现了活跃用户，说明配置成功

> 注意：数据可能需要 24-48 小时才能完整出现在标准报告中。实时报告可以立即验证配置是否正确。

---

## GA4 的主要优势

配置 GA4 后，你可以获得以下分析能力：

| 功能 | 说明 |
|------|------|
| **流量分析** | 了解每天、每周有多少用户访问你的学习站 |
| **页面浏览** | 追踪哪些学习路线、项目挑战最受欢迎 |
| **用户行为** | 分析用户在学习站内的浏览路径和停留时间 |
| **获取渠道** | 了解用户是通过搜索、社交媒体还是直接访问来到站点 |
| **受众分析** | 了解用户的地理位置、设备类型等基本信息 |

这些数据可以帮助你不断优化内容，让 AI 学习站更贴合用户需求。

---

## 常见问题

**Q: 我已经有 Universal Analytics（UA）ID，还需要 GA4 吗？**

A: 是的，Universal Analytics 已于 2023 年 7 月停止处理数据。必须使用 GA4 测量 ID（G- 开头）。

**Q: 配置后数据没有立即显示？**

A: 正常情况下，实时报告会在几分钟内显示数据，标准报告需要 24-48 小时。如果实时报告也没有数据，请检查测量 ID 是否正确写入。

**Q: 会影响网站性能吗？**

A: GA4 使用异步加载（`async` 属性），不会阻塞页面渲染，对用户体验影响极小。
