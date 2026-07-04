"use strict";
/* ====== Loading Skeleton ====== */
function showLoadingSkeleton() {
  const grids = ["#agentRoleGrid", "#modelGrid", "#projectGrid", "#weekList", "#badgeWall"];
  grids.forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const count = sel === "#agentRoleGrid" ? 6 : sel === "#modelGrid" ? 4 : 3;
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `<div class="skeleton-card"><div class="skeleton"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line"></div></div>`;
    }
    el.innerHTML = html;
  });
}

function hideLoadingSkeleton() {
  const grids = ["#agentRoleGrid", "#modelGrid", "#projectGrid", "#weekList", "#badgeWall"];
  grids.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && el.querySelector(".skeleton-card")) el.innerHTML = "";
  });
}

/* ====== GA4 Event Tracking ====== */
function trackEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

function trackPageView(pageId) {
  trackEvent("page_view", { page_path: `/?page=${pageId}`, page_title: PAGE_META[pageId] || pageId });
}

/* ====== Feedback XP Awarding ====== */
function awardFeedbackXp() {
  if (state.feedback.length > 0 && !state._feedbackXpAwarded) {
    state.bonusXp += 10;
    state._feedbackXpAwarded = true;
    persistGameState();
    showToast("感谢反馈！获得 10 XP 奖励。");
    trackEvent("feedback_submit", { xp: 10 });
  }
}

/* ====== P3-12: Interactive Decision Tree (Multi-step Q&A) ====== */
function renderModelDecisionTree() {
  const container = document.querySelector("#modelDecisionTree");
  if (!container) return;

  const questions = [
    {
      id: "q1",
      text: "你的主要使用场景是什么？",
      options: [
        { label: "写代码 / 编程", value: "coding" },
        { label: "处理长文档 / 长文本", value: "longtext" },
        { label: "生成视频 / 图片", value: "video" },
        { label: "中文写作 / 创作", value: "chinese" },
        { label: "搭建 Agent 工作流", value: "agent" }
      ]
    },
    {
      id: "q2_coding",
      text: "你更看重哪个？",
      condition: "coding",
      options: [
        { label: "最强编程能力", value: "coding_power", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">Claude 3.5 Sonnet</a>，编程 benchmark 领先。` },
        { label: "国内免费可用", value: "coding_free", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">DeepSeek Coder</a>，国内免费且编程能力优秀。` }
      ]
    },
    {
      id: "q2_longtext",
      text: "你的文档有多长？",
      condition: "longtext",
      options: [
        { label: "超长（10 万字以上）", value: "longtext_huge", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">Gemini 1.5 Pro</a>（200 万 token 上下文）。` },
        { label: "中等长度", value: "longtext_mid", rec: `推荐 Claude 3.5 Sonnet（20 万 token）或国内 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">Kimi</a>。` }
      ]
    },
    {
      id: "q2_video",
      condition: "video",
      text: "你需要哪种视频功能？",
      options: [
        { label: "国内工具优先", value: "video_cn", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">可灵 / 即梦 / 通义万相</a>，国内视频生成工具。` },
        { label: "追求国际前沿", value: "video_intl", rec: `推荐 Runway Gen-3 或 Sora，国际顶级视频生成模型。` }
      ]
    },
    {
      id: "q2_chinese",
      condition: "chinese",
      text: "你的中文创作类型是什么？",
      options: [
        { label: "日常写作 / 对话", value: "chinese_daily", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">DeepSeek</a>（中文理解优秀且免费）或通义千问。` },
        { label: "专业内容 / 学术", value: "chinese_pro", rec: `推荐 Claude（中文专业内容表现好）或 DeepSeek（性价比高）。` }
      ]
    },
    {
      id: "q2_agent",
      condition: "agent",
      text: "你的 Agent 开发经验如何？",
      options: [
        { label: "新手入门", value: "agent_beginner", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">DeepSeek</a>（性价比高，适合练习 Agent 调用）。` },
        { label: "有经验需要强模型", value: "agent_pro", rec: `推荐 <a href="#" onclick="event.preventDefault();applyCurrentPage('models');syncPageUrl('models');renderCurrentPageContent('models');resetPageViewport('models');" style="color:var(--jujube);text-decoration:underline;">GPT-4o</a>（Agent 生态最成熟）或 Claude 3.5 Sonnet。` }
      ]
    }
  ];

  let step = 0;
  let answers = {};

  function renderStep() {
    if (step === 0) {
      const q = questions[0];
      container.innerHTML = `
        <div class="model-decision-tree">
          <div class="decision-step-indicator">
            <span class="decision-step-num">1</span>
            <span style="color:var(--muted);font-size:0.78rem;">共 2 步</span>
          </div>
          <h4>${safeText(q.text)}</h4>
          <div class="decision-options">
            ${q.options.map(opt => `
              <button class="decision-option" data-value="${opt.value}">${safeText(opt.label)}</button>
            `).join("")}
          </div>
          <div id="decisionResult"></div>
        </div>
      `;
      container.querySelectorAll(".decision-option").forEach(btn => {
        btn.addEventListener("click", () => {
          answers[q.id] = btn.dataset.value;
          step = 1;
          renderStep();
          trackEvent("model_decision_step1", { answer: btn.dataset.value });
        });
      });
    } else if (step === 1) {
      const condition = answers.q1;
      const q2 = questions.find(q => q.condition === condition);
      if (!q2) { step = 0; renderStep(); return; }
      container.innerHTML = `
        <div class="model-decision-tree">
          <div class="decision-step-indicator">
            <span class="decision-step-num">2</span>
            <span style="color:var(--muted);font-size:0.78rem;">共 2 步</span>
          </div>
          <h4>${safeText(q2.text)}</h4>
          <div class="decision-options">
            ${q2.options.map(opt => `
              <button class="decision-option" data-value="${opt.value}" data-rec="${escapeHtml(opt.rec)}">${safeText(opt.label)}</button>
            `).join("")}
          </div>
          <button class="ghost-btn small" id="decisionBack" style="margin-top:12px;">← 返回上一步</button>
          <div id="decisionResult"></div>
        </div>
      `;
      container.querySelectorAll(".decision-option").forEach(btn => {
        btn.addEventListener("click", () => {
          const result = container.querySelector("#decisionResult");
          if (result) {
            result.className = "decision-result";
            result.innerHTML = btn.dataset.rec || "请选择一个选项。";
          }
          trackEvent("model_decision_step2", { answer: btn.dataset.value, category: condition });
        });
      });
      container.querySelector("#decisionBack").addEventListener("click", () => {
        step = 0;
        renderStep();
      });
    }
  }

  renderStep();
}

/* ====== Prerequisite Check ====== */
function renderPrereqCheck(trackId) {
  const track = tracks[trackId];
  if (!track || !track.prereq) return "";
  return `
    <div class="prereq-check">
      <h4>开始前的自检</h4>
      <p class="muted" style="margin-bottom:10px;">勾选你已具备的条件，确认你准备好开始这条路线。</p>
      ${track.prereq.map((q, i) => `
        <label class="prereq-question">
          <input type="checkbox" id="prereq-${trackId}-${i}" />
          <span>${safeText(q)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

/* ====== P2-8: Self-check with Quiz Questions ====== */
const selfCheckQuizBank = {
  freshman: [
    { q: "什么是 Prompt？", options: ["给 AI 的指令文本", "一段代码", "一个图片文件", "一种数据格式"], answer: 0 },
    { q: "Prompt 中哪个元素最重要？", options: ["背景描述", "具体任务", "输出格式", "以上都重要"], answer: 3 },
    { q: "Token 在 AI 语境中指什么？", options: ["一种加密货币", "AI 处理的最小文本单元", "用户身份标识", "一种编程语法"], answer: 1 },
  ],
  rag: [
    { q: "RAG 的核心原理是什么？", options: ["检索外部知识 + 生成回答", "只靠模型内部知识", "直接翻译文本", "压缩存储数据"], answer: 0 },
    { q: "向量数据库在 RAG 中做什么？", options: ["存储用户密码", "存储文本的语义向量用于相似度搜索", "渲染页面", "生成图像"], answer: 1 },
    { q: "为什么需要 RAG 而不是纯大模型？", options: ["大模型不够快", "大模型可能缺乏最新/专业信息", "RAG 更便宜", "大模型不能对话"], answer: 1 },
  ],
  creator: [
    { q: "AI 内容创作最关键的第一步是什么？", options: ["选择最贵的模型", "明确创作目标和受众", "收集尽可能多的素材", "发布即可"], answer: 1 },
    { q: "如何避免 AI 生成的文本「千篇一律」？", options: ["只用一种 Prompt", "在 Prompt 中加入风格、语气等个性化约束", "不用 AI 创作", "多换模型"], answer: 1 },
    { q: "AI 生成的内容可以直接发布吗？", options: ["可以，无需审核", "不行，必须人工审核和改写", "只有图片可以", "看心情"], answer: 1 },
  ],
  builder: [
    { q: "Agent 和普通 Prompt 的区别是什么？", options: ["Agent 可以自主决策和多步执行", "Agent 只能对话", "没有区别", "Agent 更慢"], answer: 0 },
    { q: "Agent 的核心组件有哪些？", options: ["只需要 Prompt", "感知、决策、行动、记忆", "只需要 API", "只需要数据库"], answer: 1 },
    { q: "为什么 Agent 需要记忆功能？", options: ["为了记住密码", "为了在多步任务中保持上下文连贯", "为了存储图片", "没必要"], answer: 1 },
  ],
  deploy: [
    { q: "AI 应用部署时最需要注意什么？", options: ["界面漂亮", "安全性、稳定性和成本控制", "只用免费方案", "不需要注意"], answer: 1 },
    { q: "API Key 应该怎么保管？", options: ["写在代码注释里", "存在 sessionStorage 或环境变量，不硬编码", "分享给所有人", "无所谓"], answer: 1 },
    { q: "为什么需要监控已部署的 AI 应用？", options: ["为了好看", "及时发现异常、成本失控和用户体验问题", "不需要监控", "只为写报告"], answer: 1 },
  ],
};

function renderSelfCheck(trackId) {
  const track = tracks[trackId];
  if (!track || !track.selfCheck) return "";

  const quiz = selfCheckQuizBank[trackId] || [];
  const quizHTML = quiz.length > 0 ? `
    <div class="self-check-quiz" style="margin-bottom:16px;">
      <h4 style="color:var(--jujube);font-size:0.92rem;">🧪 知识检测</h4>
      <p style="font-size:0.82rem;color:var(--muted);margin-bottom:12px;">回答以下问题，检验你的理解程度。</p>
      ${quiz.map((item, i) => `
        <div class="quiz-item" style="margin-bottom:12px;padding:12px;background:rgba(143,47,42,0.04);border-radius:8px;border:1px solid var(--line);">
          <p style="font-weight:600;font-size:0.85rem;margin-bottom:8px;">${safeText(item.q)}</p>
          <div class="quiz-options" style="display:flex;flex-direction:column;gap:6px;">
            ${item.options.map((opt, j) => `
              <button class="quiz-option ghost-btn small" data-track="${trackId}" data-q="${i}" data-opt="${j}" style="text-align:left;width:100%;min-height:36px;">${safeText(opt)}</button>
            `).join("")}
          </div>
          <div class="quiz-feedback" id="quiz-feedback-${trackId}-${i}" style="margin-top:6px;font-size:0.82rem;"></div>
        </div>
      `).join("")}
    </div>
  ` : "";

  return `
    <div class="self-check">
      <h4>学完后的自我检查</h4>
      <p class="muted" style="margin-bottom:10px;">确认你能做到以下事项，再进入下一个模块。</p>
      ${quizHTML}
      ${track.selfCheck.map((item, i) => `
        <label class="self-check-item">
          <input type="checkbox" id="selfcheck-${trackId}-${i}" onchange="updateSelfCheckFeedback('${trackId}')" />
          <span>${safeText(item)}</span>
        </label>
      `).join("")}
      <div id="selfcheck-feedback-${trackId}" style="margin-top:10px;font-size:0.82rem;color:var(--muted);"></div>
    </div>
  `;
}

/* Handle quiz option clicks */
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".quiz-option");
  if (!btn) return;
  const trackId = btn.dataset.track;
  const qIndex = Number(btn.dataset.q);
  const optIndex = Number(btn.dataset.opt);
  const quiz = selfCheckQuizBank[trackId] || [];
  const question = quiz[qIndex];
  if (!question) return;

  const feedbackEl = document.querySelector(`#quiz-feedback-${trackId}-${qIndex}`);
  const isCorrect = optIndex === question.answer;

  const container = btn.closest(".quiz-item");
  container.querySelectorAll(".quiz-option").forEach((opt, j) => {
    opt.disabled = true;
    if (j === question.answer) {
      opt.style.background = "rgba(95,127,82,0.12)";
      opt.style.borderColor = "var(--plant)";
      opt.style.color = "var(--plant)";
    } else if (j === optIndex && !isCorrect) {
      opt.style.background = "rgba(143,47,42,0.08)";
      opt.style.borderColor = "var(--jujube)";
      opt.style.color = "var(--jujube)";
    }
  });

  if (feedbackEl) {
    feedbackEl.innerHTML = isCorrect
      ? `<span style="color:var(--plant);">✅ 正确！</span>`
      : `<span style="color:var(--jujube);">❌ 不正确，正确答案是：${safeText(question.options[question.answer])}</span>`;
  }

  if (isCorrect) {
    state.bonusXp += 5;
    persistGameState();
    showToast("问答正确！获得 5 XP", 1200);
  }
  trackEvent("self_check_quiz", { track: trackId, question: qIndex, correct: isCorrect });
});

/* L4: Adaptive self-check feedback */
function updateSelfCheckFeedback(trackId) {
  const track = tracks[trackId];
  if (!track || !track.selfCheck) return;
  const feedbackEl = document.querySelector(`#selfcheck-feedback-${trackId}`);
  if (!feedbackEl) return;
  const allBoxes = document.querySelectorAll(`[id^="selfcheck-${trackId}-"]`);
  const allChecked = Array.from(allBoxes).every(b => b.checked);
  const noneChecked = Array.from(allBoxes).every(b => !b.checked);
  if (allChecked) {
    feedbackEl.innerHTML = `<span style="color:var(--plant);">✅ 太棒了！你已经完全掌握了这条路线，可以去挑战下一个模块了。</span>`;
  } else if (noneChecked) {
    feedbackEl.innerHTML = "";
  } else {
    const unchecked = track.selfCheck.filter((_, i) => !(document.querySelector(`#selfcheck-${trackId}-${i}`)||{}).checked);
    const firstUnchecked = unchecked[0] || "";
    feedbackEl.innerHTML = `<span style="color:var(--earth);">💡 如果你还不能「${safeText(firstUnchecked)}」，请回到对应模块重新练习，或使用下方「问 AI」按钮寻求帮助。</span>`;
  }
}

/* ====== Admin Dashboard ====== */
function renderAdminDashboard() {
  const container = document.querySelector("#adminContent");
  if (!container) return;
  const xp = getXp();
  const rank = getRank();
  const doneWeeks = state.doneWeeks.size;
  const badges = achievements.filter(a => a.test()).length;
  const allData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("ai-")) {
      try { allData[key] = JSON.parse(localStorage.getItem(key)); }
      catch { allData[key] = localStorage.getItem(key); }
    }
  }
  const checks = {
    "localStorage 可用": true,
    "签到记录": state.lastCheckIn || "无",
    "连续天数": state.streak,
    "完成周数": `${doneWeeks}/12`,
    "徽章获得": `${badges}/${achievements.length}`,
    "API Key 已配置": !!sessionStorage.getItem("ai-tutor-api-key"),
    "云同步启用": syncState.enabled,
    "邀请码": generateInviteCode(),
    "XP 商店购买数": (JSON.parse(localStorage.getItem("ai-xp-shop") || "[]")).length,
  };
  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
      ${Object.entries(checks).map(([k, v]) => `
        <div style="padding:16px;border-radius:10px;background:var(--surface);border:1px solid var(--line);">
          <div style="font-size:0.8rem;color:var(--muted);">${k}</div>
          <div style="font-size:1.3rem;font-weight:700;color:var(--jujube);margin-top:4px;">${v}</div>
        </div>
      `).join("")}
    </div>
    <!-- S1: Aggregation stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
      <div style="padding:16px;border-radius:10px;background:var(--surface);border:1px solid var(--line);">
        <div style="font-weight:600;margin-bottom:10px;color:var(--earth);">📊 游戏化数据概览</div>
        <div style="font-size:0.85rem;line-height:2;">
          <div>总累计 XP：<strong style="color:var(--jujube);">${xp}</strong></div>
          <div>签到次数：<strong style="color:var(--jujube);">${state.streak || 0} 次</strong></div>
          <div>完成周数比例：<strong style="color:var(--jujube);">${doneWeeks}/12 (${Math.round(doneWeeks/12*100)}%)</strong></div>
          <div>等级进度：<strong style="color:var(--jujube);">${xp}/${getNextRank() ? getNextRank().minXp : '∞'} XP → ${getNextRank() ? getNextRank().name : 'MAX'}</strong></div>
          <div>徽章完成率：<strong style="color:var(--jujube);">${badges}/${achievements.length} (${Math.round(badges/achievements.length*100)}%)</strong></div>
          <div>累积反馈次数：<strong style="color:var(--jujube);">${parseInt(localStorage.getItem("ai-feedback-count")||"0",10)} 次</strong></div>
        </div>
      </div>
      <div style="padding:16px;border-radius:10px;background:var(--surface);border:1px solid var(--line);">
        <div style="font-weight:600;margin-bottom:10px;color:var(--earth);">🎯 XP 消耗分析</div>
        <div style="font-size:0.85rem;line-height:2;">
          <div>XP 商店购买数：<strong style="color:var(--jujube);">${(JSON.parse(localStorage.getItem("ai-xp-shop")||"[]")).length} / ${xpShop.length}</strong></div>
          <div>已花费 XP：<strong style="color:var(--jujube);">${(JSON.parse(localStorage.getItem("ai-xp-shop")||"[]")).reduce((sum, id) => sum + (xpShop.find(i => i.id===id)||{}).cost||0, 0)} XP</strong></div>
          <div>邀请成功次数：<strong style="color:var(--jujube);">${localStorage.getItem("ai-invite-count")||"0"} 人</strong></div>
          <div>邀请获得 XP：<strong style="color:var(--jujube);">${(parseInt(localStorage.getItem("ai-invite-count")||"0",10)) * 50} XP</strong></div>
        </div>
      </div>
    </div>
    <details style="margin-top:16px;">
      <summary style="cursor:pointer;font-weight:600;color:var(--earth);">📊 完整 localStorage 数据</summary>
      <pre style="margin-top:10px;background:rgba(143,47,42,0.04);padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;max-height:400px;overflow-y:auto;">${escapeHtml(JSON.stringify(allData, null, 2))}</pre>
    </details>
    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="ghost-btn" onclick="downloadAllData()">📥 导出完整数据 (JSON)</button>
      <button class="ghost-btn" style="color:var(--jujube);" onclick="if(confirm('确定要清除所有本地数据？此操作不可撤销！')){localStorage.clear();sessionStorage.clear();location.reload();}">🗑️ 清除所有数据</button>
    </div>
  `;
}

function downloadAllData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try { data[key] = JSON.parse(localStorage.getItem(key)); }
    catch { data[key] = localStorage.getItem(key); }
  }
  downloadTextFile(JSON.stringify(data, null, 2), { fileName: `ai-learning-backup-${formatReportDate()}.json`, type: "application/json", toastMessage: "数据已导出" });
}

/* ====== P3-11: Knowledge Dependency Graph ====== */
const knowledgeDependencies = [
  { from: "freshman", to: "rag", label: "掌握 Prompt 基础后可进入 RAG" },
  { from: "freshman", to: "creator", label: "理解 AI 基础后可做内容创作" },
  { from: "rag", to: "builder", label: "RAG 知识是 Agent 构建的前置" },
  { from: "creator", to: "builder", label: "创作经验有助于设计 Agent 交互" },
  { from: "builder", to: "deploy", label: "Agent 构建完成后需学会部署上线" },
];

function renderKnowledgeGraph() {
  const container = document.querySelector("#knowledgeGraph");
  if (!container) return;

  const trackColors = {
    freshman: "#5c3a1e",
    rag: "#8f2f2a",
    creator: "#b87546",
    builder: "#5f7f52",
    deploy: "#d8a34a"
  };

  const trackNames = {
    freshman: "Prompt 新手",
    rag: "RAG 构建者",
    creator: "内容创作者",
    builder: "Agent 构建者",
    deploy: "部署运维者"
  };

  const positions = {
    freshman: { x: 150, y: 40 },
    rag: { x: 50, y: 130 },
    creator: { x: 250, y: 130 },
    builder: { x: 150, y: 220 },
    deploy: { x: 150, y: 310 }
  };

  const doneTracks = new Set();
  Object.keys(tracks).forEach(key => {
    if (state.track === key) doneTracks.add(key);
  });

  container.innerHTML = `
    <div class="knowledge-graph-container">
      <h4 style="margin-bottom:12px;color:var(--jujube);">路线依赖图谱</h4>
      <p style="font-size:0.82rem;color:var(--muted);margin-bottom:16px;">了解路线间的前后依赖关系，科学规划学习顺序。</p>
      <svg viewBox="0 0 300 360" style="width:100%;max-width:300px;display:block;margin:0 auto;">
        ${knowledgeDependencies.map(dep => {
          const from = positions[dep.from];
          const to = positions[dep.to];
          const isDone = doneTracks.has(dep.from);
          return `
            <line x1="${from.x}" y1="${from.y + 24}" x2="${to.x}" y2="${to.y - 4}"
              stroke="${isDone ? trackColors[dep.from] : '#dfd2c0'}"
              stroke-width="${isDone ? 2 : 1}" stroke-dasharray="${isDone ? '' : '4 4'}" />
            <text x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 + 16}"
              fill="${isDone ? trackColors[dep.from] : '#8a7f72'}"
              font-size="8" text-anchor="middle">${safeText(dep.label.substring(0, 15))}</text>
          `;
        }).join("")}
        ${Object.entries(positions).map(([key, pos]) => {
          const color = trackColors[key];
          const name = trackNames[key];
          const isActive = state.track === key;
          const hasProgress = doneTracks.has(key);
          return `
            <rect x="${pos.x - 40}" y="${pos.y - 12}" width="80" height="24" rx="12"
              fill="${isActive ? color : hasProgress ? color + '66' : '#f6efe3'}"
              stroke="${color}" stroke-width="${isActive ? 2 : 1}" />
            <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" font-size="11"
              fill="${isActive ? '#fffaf2' : color}" font-weight="${isActive ? '700' : '400'}">${safeText(name)}</text>
          `;
        }).join("")}
      </svg>
    </div>
  `;
}

