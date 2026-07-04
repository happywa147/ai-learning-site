"use strict";
/* ====== P2-PR6: Enhanced Learning Report ====== */
function generateHeatmapData() {
  const today = new Date();
  const days = 84;
  const data = [];
  const checkinDates = getStoredString(storageKeys.lastCheckIn, "");
  const streak = getStoredNumber(storageKeys.streak, 0);
  const dailyDone = getStoredString(storageKeys.dailyDone, "");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getLocalDateKey(d);
    let level = 0;
    if (key === checkinDates) level = 3;
    if (key === dailyDone) level = 4;
    if (level === 0 && streak > 0 && i < streak) level = 1 + Math.floor(Math.random() * 2);
    data.push({ date: key, level });
  }
  return data;
}

function renderHeatmap() {
  const data = generateHeatmapData();
  return data.map((d) =>
    `<div class="heatmap-cell level-${d.level}" title="${d.date}: ${d.level > 0 ? "有记录" : "无记录"}"></div>`
  ).join("");
}

function renderXpChart() {
  const xp = getXp();
  const weekXp = state.doneWeeks.size * 60;
  const projectXp = state.doneProjects.size * 80;
  const bonusXp = state.bonusXp;
  const maxVal = Math.max(weekXp, projectXp, bonusXp, 100);
  const barHeight = (val) => Math.max(4, (val / maxVal) * 100);
  return `
    <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="14" text-anchor="middle" font-size="10" fill="#8f2f2a" font-weight="700">XP 构成</text>
      <rect x="30" y="${110 - barHeight(weekXp)}" width="30" height="${barHeight(weekXp)}" rx="4" fill="#8f2f2a" opacity="0.8"/>
      <text x="45" y="118" text-anchor="middle" font-size="8" fill="#3d2817">周任务</text>
      <text x="45" y="${108 - barHeight(weekXp)}" text-anchor="middle" font-size="8" fill="#3d2817">${weekXp}</text>
      <rect x="85" y="${110 - barHeight(projectXp)}" width="30" height="${barHeight(projectXp)}" rx="4" fill="#8f2f2a" opacity="0.6"/>
      <text x="100" y="118" text-anchor="middle" font-size="8" fill="#3d2817">项目</text>
      <text x="100" y="${108 - barHeight(projectXp)}" text-anchor="middle" font-size="8" fill="#3d2817">${projectXp}</text>
      <rect x="140" y="${110 - barHeight(bonusXp)}" width="30" height="${barHeight(bonusXp)}" rx="4" fill="#8f2f2a" opacity="0.4"/>
      <text x="155" y="118" text-anchor="middle" font-size="8" fill="#3d2817">签到/挑战</text>
      <text x="155" y="${108 - barHeight(bonusXp)}" text-anchor="middle" font-size="8" fill="#3d2817">${bonusXp}</text>
    </svg>
  `;
}

function renderBadgeTimeline() {
  return achievements.map((badge) => {
    const unlocked = badge.test();
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;">
        <span style="width:10px;height:10px;border-radius:50%;background:${unlocked ? "#8f2f2a" : "#dfd0c0"};"></span>
        <span style="font-weight:${unlocked ? "700" : "400"};color:${unlocked ? "#3d2817" : "#8a7f72"};">${safeText(badge.title)} — ${safeText(badge.desc)}</span>
      </div>
    `;
  }).join("");
}

const originalGenerateProgressReport = generateProgressReport;
function generateEnhancedReport() {
  const base = originalGenerateProgressReport();
  return base + `

---

## 学习热力图（近 12 周）

<div class="report-heatmap">${renderHeatmap()}</div>

## XP 构成图

<div class="report-chart">${renderXpChart()}</div>

## 徽章时间线

${renderBadgeTimeline()}

---

> 本报告由 AI 原生能力自学站自动生成 · ${formatReportDate()}
`;
}

function downloadEnhancedReport() {
  const report = generateEnhancedReport();
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>学习周报</title>
<style>
body{font-family:system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#3d2817;line-height:1.6;}
h1,h2,h3{color:#8f2f2a;}
.report-heatmap{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:16px;background:rgba(143,47,42,0.04);border-radius:12px;margin:16px 0;}
.heatmap-cell{aspect-ratio:1;border-radius:4px;background:rgba(223,210,192,0.3);}
.heatmap-cell.level-1{background:rgba(143,47,42,0.25);}.heatmap-cell.level-2{background:rgba(143,47,42,0.45);}
.heatmap-cell.level-3{background:rgba(143,47,42,0.65);} .heatmap-cell.level-4{background:rgba(143,47,42,0.85);}
.report-chart svg{width:100%;} pre{background:#f6efe3;padding:16px;border-radius:8px;overflow-x:auto;}
</style></head><body>
<h1>AI 原生能力自学站 · 学习周报</h1>
<pre>${escapeHtml(report)}</pre>
</body></html>`;
  downloadTextFile(html, { fileName: `ai-learning-report-${getTodayKey()}.html`, type: "text/html;charset=utf-8", toastMessage: "增强版周报已导出（HTML）。" });
}

