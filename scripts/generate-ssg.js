#!/usr/bin/env node
/**
 * SSG — Static Site Generator for ai.mynaxis.com
 * Generates standalone HTML pages for each major content page from JSON data.
 * Output: dist/ssg/ — individual HTML pages for SEO indexing.
 */
const fs = require("fs");
const path = require("path");
const dist = path.join(__dirname, "..", "dist");
const ssgDir = path.join(dist, "ssg");
fs.mkdirSync(ssgDir, { recursive: true });

const tracks = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "dist", "data.17f56def.json"), "utf8"));
// The merged JSON has all 18 files as top-level keys
// Find the tracks data
let tracksData = tracks["assets/data/tracks.json"];
if (!tracksData) {
  // Try alternate key format
  const keys = Object.keys(tracks);
  const tracksKey = keys.find(k => k.includes("tracks"));
  if (tracksKey) tracksData = tracks[tracksKey];
}
if (!tracksData) {
  // Fallback: read from source
  console.log("⚠️  Reading tracks from source file");
  tracksData = fs.readFileSync(path.join(__dirname, "..", "assets", "data", "tracks.json"), "utf8");
}
const parsed = typeof tracksData === "string" ? JSON.parse(tracksData) : tracksData;

/* HTML template */
const wrap = (title, body, metaDesc) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}｜AI 原生能力自学站</title>
  <meta name="description" content="${metaDesc}">
  <meta property="og:title" content="${title}｜AI 原生能力自学站">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://ai.mynaxis.com/">
  <link rel="canonical" href="https://ai.mynaxis.com/">
  <style>
    body { font-family: "PingFang SC","Microsoft YaHei",sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #3d2817; line-height: 1.8; }
    h1 { color: #8f2f2a; border-bottom: 2px solid #8f2f2a; padding-bottom: 8px; }
    h2 { color: #64221f; margin-top: 30px; }
    .module { background: #f6efe3; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #8f2f2a; }
    .step { margin: 8px 0 8px 20px; font-size: 0.95rem; }
    .expect { color: #5f524a; font-size: 0.88rem; margin-left: 20px; }
    .outcome { background: rgba(143,47,42,0.05); padding: 4px 12px; border-radius: 4px; display: inline-block; margin: 4px; }
    .cta { text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg,#8f2f2a,#64221f); color: #fff; border-radius: 12px; }
    .cta a { color: #d8a34a; font-weight: bold; }
  </style>
</head>
<body>
${body}
<div class="cta">
  <p style="font-size:1.1rem;">🚀 这只是静态快照。访问 <a href="https://ai.mynaxis.com/">ai.mynaxis.com</a> 体验完整交互版。</p>
  <p style="font-size:0.9rem;opacity:0.8;">签到 · XP · 等级 · 徽章 · 连击 · 项目挑战 · Agent 角色卡 · AI 辅导</p>
</div>
</body>
</html>`;

/* Generate index page */
const indexBody = `<h1>AI 原生能力自学站</h1>
<p>面向中文学习者的 AI 学习任务系统。用任务、等级、徽章和作品集驱动学习。</p>
<h2>五条学习路线</h2>
${Object.entries(parsed).map(([id, t]) => `
  <div class="module">
    <h3><a href="/ssg/${id}.html">${t.title}</a></h3>
    <p>${t.summary}</p>
  </div>
`).join("")}
<h2>学习路线详情</h2>
<ul>
  ${Object.entries(parsed).map(([id, t]) => `<li><a href="/ssg/${id}.html">${t.title}</a> — ${t.summary.substring(0, 60)}...</li>`).join("")}
</ul>`;

fs.writeFileSync(path.join(ssgDir, "index.html"), wrap("五条学习路线", indexBody, "五条系统的 AI 学习路线：零基础入门、RAG 赋能、短视频创作、AI 应用开发、AI 部署交付"));

/* Generate individual track pages */
Object.entries(parsed).forEach(([id, t]) => {
  const modulesHTML = t.modules.map((m, i) => {
    const title = m.title || m[0];
    const desc = m.desc || m[1];
    const practiceHTML = m.practice ? `
      <h4>🎯 5 分钟实操教程</h4>
      ${m.practice.map((p, pi) => `
        <div class="step"><strong>第${pi+1}步：</strong>${p.step}</div>
        <div class="expect">→ ${p.expect}</div>
      `).join("")}
    ` : "";
    return `<div class="module">
      <h3>${i+1}. ${title}</h3>
      <p>${desc}</p>
      ${practiceHTML}
    </div>`;
  }).join("");

  const prereqHTML = t.prereq ? `
    <h4>开始前的自检</h4>
    <ul>${t.prereq.map(q => `<li>${q}</li>`).join("")}</ul>
  ` : "";

  const selfCheckHTML = t.selfCheck ? `
    <h4>学完后的自我检查</h4>
    <ul>${t.selfCheck.map(item => `<li>${item}</li>`).join("")}</ul>
  ` : "";

  const outcomesHTML = `<p>${(t.outcomes || []).map(o => `<span class="outcome">${o}</span>`).join(" ")}</p>`;

  const body = `<h1>${t.title}</h1>
<p>${t.summary}</p>
${outcomesHTML}
${prereqHTML}
${modulesHTML}
${selfCheckHTML}
<p style="margin-top:20px;">← <a href="/ssg/">返回所有路线</a> | <a href="/">返回主站</a></p>`;

  fs.writeFileSync(path.join(ssgDir, `${id}.html`), wrap(t.title, body, t.summary.substring(0, 150)));
  console.log(`  ✅ ssg/${id}.html — ${t.title}`);
});

console.log(`\n✅ SSG complete: ${Object.keys(parsed).length + 1} pages in ${ssgDir}`);
