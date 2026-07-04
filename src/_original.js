let tracks = {};

let ownerContact = {};

let repoLinks = {};

const storageKeys = {
  month: "ai-learning-month",
  worldview30Weeks: "ai-learning-worldview-30-weeks",
  leads: "ai-learning-leads",
  feedback: "ai-learning-feedback",
  weeks: "ai-learning-weeks",
  projects: "ai-learning-projects",
  weekProofs: "ai-learning-week-proofs",
  projectProofs: "ai-learning-project-proofs",
  bonusXp: "ai-learning-bonus-xp",
  streak: "ai-learning-streak",
  lastCheckIn: "ai-learning-last-checkin",
  dailyDone: "ai-learning-daily-done"
};

let weeks = [];

let starterSteps = [];

let showcaseItems = [];

let resourceRadarItems = [];

let agentRoleCategories = [];

let agentRoles = [];

function safeParseJson(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
}

function getStoredString(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

let storageNoticeShown = false;

function showStorageUnavailableNotice() {
  if (storageNoticeShown) return;
  storageNoticeShown = true;
  showToast("当前环境不支持本地存储，部分进度可能无法持久化。");
}

function getStoredNumber(key, fallback = 0) {
  const raw = getStoredString(key);
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

function getStoredArray(key, fallback = []) {
  const raw = getStoredString(key);
  const parsed = safeParseJson(raw || "[]", fallback);
  if (!Array.isArray(parsed)) {
    removeStoredValue(key);
    return fallback;
  }
  return parsed;
}

function getStoredObject(key, fallback = {}) {
  const raw = getStoredString(key);
  const parsed = safeParseJson(raw || "{}", fallback);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    removeStoredValue(key);
    return fallback;
  }
  return parsed;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function yesterdayLocalKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateKey(yesterday);
}

function escapeCsvCell(value) {
  const text = String(value ?? "").replaceAll('"', '""');
  const escaped = /^(=|\+|-|@|\t|\r|\n|,)/.test(text) ? `'${text}` : text;
  return `"${escaped}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("`", "&#96;");
}

function safeText(value) {
  return escapeHtml(value);
}

function safeUrl(value) {
  const text = String(value ?? "").trim();
  try {
    const url = new URL(text, window.location.href);
    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return escapeHtml(url.href);
    }
  } catch (error) {
    return "";
  }
  return "";
}

function safeList(items) {
  if (!Array.isArray(items)) return "";
  return items
    .map((item) => `<li>${safeText(item)}</li>`)
    .join("");
}

function isValidContact(contact) {
  const value = toTrimmed(contact);
  if (!value || value.length < 2 || value.includes(" ")) return false;
  const isPhone = /^\d{6,20}$/.test(value);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const isWechat = /^[a-zA-Z0-9_-]{6,24}$/.test(value);
  return isPhone || isEmail || isWechat;
}

function downloadTextFile(content, { fileName, type = "text/plain;charset=utf-8", toastMessage } = {}) {
  if (!fileName) return;
  const blob = new Blob([`\ufeff${String(content ?? "")}`], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  if (toastMessage) {
    showToast(toastMessage);
  }
}

function openCopyFallback(text, message = "复制失败，系统未能直接写入剪贴板。") {
  const fallbackText = String(text ?? "");
  if (!fallbackText) return;
  try {
    window.prompt(`${message}`, fallbackText);
  } catch (error) {
    // ignore
  }
}

async function copyTextWithFallback(text, { button, successText, failureText = "复制失败，系统未能直接写入剪贴板，请手动复制。", hideButtonLabelDelay = 1200 } = {}) {
  const originalText = button?.textContent;
  const ok = await copyText(text);
  if (button) {
    button.textContent = ok ? successText || "已复制" : "复制失败";
    if (hideButtonLabelDelay > 0) {
      setTimeout(() => {
        button.textContent = originalText;
      }, hideButtonLabelDelay);
    }
  }
  if (!ok) {
    openCopyFallback(text, failureText);
    showToast(failureText, 2200);
    return false;
  }
  if (successText) {
    showToast(successText, 1800);
  }
  return true;
}

async function copyText(text) {
  const plainText = String(text ?? "");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (error) {
    // clipboard API may fail in insecure contexts; fallback below
  }

  let area = null;
  try {
    area = document.createElement("textarea");
    area.value = plainText;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, plainText.length);
    return Boolean(document.execCommand && document.execCommand("copy"));
  } catch (error) {
    return false;
  } finally {
    if (area && area.parentNode) area.remove();
  }
}

function toTrimmed(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatReportDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function escapeMarkdownLine(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .replaceAll("\r", " ");
}

let monthlyFallbackUpdates = [];
let monthlyUpdates = [];

function normalizeMonthlyPayload(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item, index) => {
      const safeCards = Array.isArray(item?.cards)
        ? item.cards
            .filter((card) => card && Array.isArray(card.items))
            .map((card, cardIndex) => ({
              title: card.title || `项目 ${cardIndex + 1}`,
              items: card.items
            }))
        : [];
      return {
        id: item?.id || `2026-${String(index + 1).padStart(2, "0")}`,
        label: item?.label || item?.month || `2026-${String(index + 1).padStart(2, "0")}`,
        title: item?.title || "",
        summary: item?.summary || "",
        cards: safeCards,
        updatedAt: item?.updatedAt || item?.date || "",
        lastVerified: item?.lastVerified || "",
        status: item?.status || "published",
        confidence: item?.confidence || "",
        sources: Array.isArray(item?.sources) ? item.sources : [],
        testedTasks: Array.isArray(item?.testedTasks) ? item.testedTasks : []
      };
    })
    .filter((item) => item.status !== "draft" && (item.cards.length || item.title || item.summary));
}

async function loadMonthlyUpdates() {
  if (monthlyFallbackUpdates.length) {
    try {
      const response = await fetch("./assets/monthly-updates.json");
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed) && parsed.length > 0) {
          monthlyUpdates = normalizeMonthlyPayload(parsed);
          return;
        }
      }
    } catch (error) {
      monthlyUpdates = monthlyFallbackUpdates;
      return;
    }
  }
  if (!monthlyUpdates.length) {
    monthlyUpdates = monthlyFallbackUpdates;
  }
}

let worldviewItems = [];

let worldviewRoadmap = [];

let worldview30DayPlan = [];

function renderWorldviewRoadmap() {
  const roadmapRoot = document.querySelector("#worldviewRoadmap");
  if (!roadmapRoot) return;
  roadmapRoot.innerHTML = worldviewRoadmap
    .map(
      (item, index) => `
        <article class="worldview-roadmap-stage" data-index="${index + 1}">
          <header>
            <span>${safeText(item.phase)}</span>
            <h4>${safeText(item.goal)}</h4>
          </header>
          <p>${safeText(item.action)}</p>
          <ul>
            <li><strong>验收：</strong>${safeText(item.check)}</li>
            <li><strong>交付：</strong>${safeText(item.result)}</li>
          </ul>
        </article>
      `
    )
    .join("");
}

function renderWorldview30DayPlan() {
  const container = document.querySelector("#worldview30Plan");
  const summary = document.querySelector("#worldview30Summary");
  if (!container || !summary) return;
  const total = worldview30DayPlan.length;
  const doneCount = state.worldview30Done.size;
  summary.textContent = `已记录 ${doneCount}/${total} 周（可选）：你可以先从中任意选择一周。`;
  container.innerHTML = worldview30DayPlan
    .map((item, index) => {
      const isDone = state.worldview30Done.has(String(index));
      return `
        <article class="worldview-30day-card ${isDone ? "done" : ""}">
          <label class="worldview-30day-item">
            <input type="checkbox" data-worldview-30="${index}" ${isDone ? "checked" : ""} />
            <div>
              <span class="worldview-30day-head">${safeText(item.week)} · 每周复盘指标</span>
              <h4>${safeText(item.goal)}</h4>
            </div>
            <span class="badge">${isDone ? "本周已记录" : "可后续"}</span>
          </label>
          <div class="worldview-30day-block">
            <h5>复盘指标</h5>
            <ul>${safeList(item.metrics)}</ul>
          </div>
          <div class="worldview-30day-block worldview-30day-risk">
            <h5>风险清单</h5>
            <ul>${safeList(item.risks)}</ul>
          </div>
          <p><strong>执行动作：</strong>${safeText(item.action)}</p>
        </article>
      `;
    })
    .join("");
}

function renderWorldview() {
  document.querySelector("#worldviewGrid").innerHTML = worldviewItems
    .map(
      (item, index) => `
        <article class="worldview-card">
          <span>${safeText(String(index + 1).padStart(2, "0"))}</span>
          <h3>${safeText(item.title)}</h3>
          <p>${safeText(item.text)}</p>
          ${item.action ? `<p class="worldview-action">${safeText(item.action)}</p>` : ""}
        </article>
      `
    )
    .join("");
}

let dailyChallenges = [];

let models = [];

let projects = [];

let ranks = [];

let PROJECT_UNLOCK_XP = {};

function getProjectUnlockXp(project) {
  return PROJECT_UNLOCK_XP[project.level] ?? 0;
}

const achievements = [
  { id: "firstWeek", title: "点火", desc: "拿到任意 1 周学习里程碑", tier: "bronze", test: () => state.doneWeeks.size >= 1 },
  { id: "threeWeeks", title: "进入节奏", desc: "有 3 周里程碑记录", tier: "bronze", test: () => state.doneWeeks.size >= 3 },
  { id: "halfWay", title: "半程推进", desc: "有 6 周里程碑记录", tier: "silver", test: () => state.doneWeeks.size >= 6 },
  { id: "projectOne", title: "第一件作品", desc: "点亮 1 个作品项目", tier: "bronze", test: () => state.doneProjects.size >= 1 },
  { id: "creator", title: "作品集雏形", desc: "点亮 3 个作品项目", tier: "silver", test: () => state.doneProjects.size >= 3 },
  { id: "streak", title: "连续手感", desc: "连续记录 3 天", tier: "bronze", test: () => state.streak >= 3 },
  { id: "streak7", title: "一周不断", desc: "连续记录 7 天", tier: "silver", test: () => state.streak >= 7 },
  { id: "streak30", title: "月度坚持", desc: "连续记录 30 天", tier: "gold", test: () => state.streak >= 30 },
  { id: "allProjects", title: "全点亮", desc: "点亮全部 12 个作品项目", tier: "gold", test: () => state.doneProjects.size >= 12 },
  { id: "feedbackGiver", title: "反馈贡献者", desc: "提交 1 条反馈", tier: "bronze", test: () => state.feedback.length >= 1 },
];

let templates = {};

const state = {
  track: "freshman",
  template: "prompt",
  agentCategory: "all",
  agentPage: 0,
  _lastAgentCategory: "all",
  projectLevel: "all",
  projectSearch: "",
  resourceAction: "all",
  resourceLicense: "all",
  resourceSearch: "",
  month: getStoredString(storageKeys.month, "2026-07"),
  worldview30Done: new Set(getStoredArray(storageKeys.worldview30Weeks, [])),
  leads: getStoredArray(storageKeys.leads, []),
  feedback: getStoredArray(storageKeys.feedback, []),
  doneWeeks: new Set(getStoredArray(storageKeys.weeks, [])),
  doneProjects: new Set(getStoredArray(storageKeys.projects, [])),
  weekProofs: getStoredObject(storageKeys.weekProofs, {}),
  projectProofs: getStoredObject(storageKeys.projectProofs, {}),
  bonusXp: getStoredNumber(storageKeys.bonusXp, 0),
  streak: getStoredNumber(storageKeys.streak, 0),
  lastCheckIn: getStoredString(storageKeys.lastCheckIn, ""),
  dailyDone: getStoredString(storageKeys.dailyDone, "")
};

const PAGE_IDS = [
  "home",
  "starter",
  "map",
  "worldview",
  "game",
  "models",
  "resources",
  "showcase",
  "projects",
  "agents",
  "weekly",
  "monthly",
  "toolkit",
  "opensource",
  "faq",
  "feedback",
  "register"
];

const PAGE_META = {
  home: "首页",
  starter: "60 秒新手上手",
  map: "五条学习路径",
  worldview: "AI 时代的世界观",
  game: "学习规则与成长系统",
  models: "国内外模型应用对比",
  resources: "GitHub AI 学习资源雷达",
  showcase: "作品样例库",
  projects: "AI 项目挑战库",
  agents: "Agent 角色学院",
  weekly: "12 周自学节奏",
  monthly: "每月更新区",
  toolkit: "Prompt、Agent、Skill 模板",
  opensource: "开源共建",
  faq: "常见问题",
  feedback: "反馈循环",
  register: "注册学习与联系"
};

function getRequestedPageId() {
  const searchParams = new URLSearchParams(location.search);
  const hashCandidate = (location.hash || "").replace("#", "");
  const raw = searchParams.get("page") || hashCandidate;
  const page = PAGE_IDS.includes(raw) ? raw : "home";
  return page;
}

function syncPageUrl(pageId, options = {}) {
  const targetPage = PAGE_IDS.includes(pageId) ? pageId : "home";
  const url = new URL(location.href);
  if (targetPage === "home") {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", targetPage);
  }
  url.hash = "";
  const method = options.replace ? "replaceState" : "pushState";
  history[method](null, "", `${url.pathname}${url.search}`);
}

function applyCurrentPage(pageId, options = {}) {
  const targetPage = PAGE_IDS.includes(pageId) ? pageId : "home";
  const allSections = Array.from(document.querySelectorAll("main > .section"));
  allSections.forEach((section) => {
    const isActive = section.id === targetPage;
    section.classList.toggle("page-active", isActive);
    section.hidden = !isActive;
    section.setAttribute("aria-hidden", String(!isActive));
    if ("inert" in section) {
      section.inert = !isActive;
    }
  });
  setActiveNavItem(targetPage);
  document.body.setAttribute("data-page", targetPage);
  updateDocumentMeta(targetPage);
  trackPageView(targetPage);

  if (!options.silent) {
    syncPageUrl(targetPage, { replace: options.replace });
  }
}

function updateDocumentMeta(pageId) {
  const pageName = PAGE_META[pageId] || PAGE_META.home;
  const suffix = "AI 原生能力自学站";
  document.title = pageId === "home" ? `${suffix}｜Prompt、Agent、RAG 与 AI 工具学习路线` : `${pageName}｜${suffix}`;
  const section = document.querySelector(`main > .section#${CSS.escape(pageId)}`);
  if (section) {
    section.setAttribute("aria-label", pageName);
  }
}

function resetPageViewport(targetPage) {
  if (typeof targetPage !== "string") return;
  const section = document.querySelector(`main > .section#${CSS.escape(targetPage)}`);
  if (!section) return;

  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
  section.setAttribute("data-focus-locked", "true");
  requestAnimationFrame(() => {
    section.focus({ preventScroll: true });
  });
  window.setTimeout(() => {
    section.removeAttribute("tabindex");
    section.removeAttribute("data-focus-locked");
  }, 350);
}

function renderCurrentPageContent(pageId) {
  const targetPage = PAGE_IDS.includes(pageId) ? pageId : "home";
  const renderMap = {
    home() {
      updateGameHud();
      renderStarter();
    },
    starter() {
      renderStarter();
    },
    map() {
      renderTrack();
    },
    worldview() {
      renderWorldview();
      renderWorldviewRoadmap();
      renderWorldview30DayPlan();
    },
    game() {
      renderDailyChallenge();
      renderBadges();
      updateGameHud();
    },
    models() {
      renderModels(state.modelSearch);
    },
    resources() {
      renderResourceRadar();
    },
    showcase() {
      renderShowcase();
    },
    projects() {
      renderProjects();
    },
    agents() {
      renderAgentDailyChallenge();
      renderAgentRoles();
    },
    weekly() {
      renderWeeks();
    },
    monthly() {
      renderMonthOptions();
      renderMonthlyUpdate();
    },
    toolkit() {
      renderTemplate();
    },
    opensource() {
      // 纯静态内容区，不需要额外渲染
    },
    faq() {
      // 纯静态内容区，不需要额外渲染
    },
    feedback() {
      renderFeedbackCount();
    },
    register() {
      renderContact();
      renderFeedbackCount();
    }
  };

  const renderer = renderMap[targetPage] || renderMap.home;
  renderer();
}

function getTodayKey() {
  return getLocalDateKey(new Date());
}

function ensureMonthExists() {
  if (!monthlyUpdates.length) return;
  if (!monthlyUpdates.find((entry) => entry.id === state.month)) {
    state.month = monthlyUpdates[0].id;
    if (!setStoredValue(storageKeys.month, state.month)) {
      showStorageUnavailableNotice();
    }
  }
}

function renderStarter() {
  document.querySelector("#starterGrid").innerHTML = starterSteps
    .map(
      (step, index) => `
        <article class="starter-card">
          <span>${safeText(String(index + 1).padStart(2, "0"))}</span>
          <h3>${safeText(step.title)}</h3>
          <p>${safeText(step.text)}</p>
          <a class="ghost-btn small" href="${safeText(step.href)}">${safeText(step.action)}</a>
        </article>
      `
    )
    .join("");
}

function renderShowcase() {
  document.querySelector("#showcaseGrid").innerHTML = showcaseItems
    .map(
      (item) => `
        <article class="showcase-card">
          <span class="badge">${safeText(item.type)}</span>
          <h3>${safeText(item.title)}</h3>
          <p>${safeText(item.text)}</p>
          <footer>${item.outputs.map((tag) => `<span class="tag">${safeText(tag)}</span>`).join("")}</footer>
        </article>
      `
    )
    .join("");
}

function renderResourceRadar() {
  const query = state.resourceSearch.trim().toLowerCase();
  const visibleResources = resourceRadarItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const actionMatched = state.resourceAction === "all" || item.action === state.resourceAction;
      const licenseMatched = state.resourceLicense === "all" || item.licenseSpdx === state.resourceLicense;
      const text = `${item.name} ${item.type} ${item.licenseSpdx} ${item.action} ${item.useFor} ${item.adapt}`.toLowerCase();
      return actionMatched && licenseMatched && (!query || text.includes(query));
    });

  document.querySelector("#resourceCount").textContent = `当前显示 ${visibleResources.length} / ${resourceRadarItems.length} 个资源`;

  if (!visibleResources.length) {
    document.querySelector("#resourceRadarGrid").innerHTML =
      '<div class="empty-state">未找到匹配资源，试试关键词：Agent、Prompt、MIT、RAG、工作流。</div>';
    return;
  }

  document.querySelector("#resourceRadarGrid").innerHTML = visibleResources
    .map(({ item, index }) => {
      const href = safeUrl(item.url);
      return `
        <article class="resource-card">
          <div class="resource-card-top">
            <span class="badge">${safeText(item.action)}</span>
            <small>${safeText(item.license)}</small>
          </div>
          <h3>${safeText(item.name)}</h3>
          <p>${safeText(item.useFor)}</p>
          <dl>
            <div><dt>类型</dt><dd>${safeText(item.type)}</dd></div>
            <div><dt>许可证</dt><dd>${safeText(item.licenseSpdx)} · ${safeText(item.source)} 复核于 ${safeText(item.lastVerified)}</dd></div>
            <div><dt>本站处理</dt><dd>${safeText(item.adapt)}</dd></div>
          </dl>
          <div class="resource-actions">
            <button class="ghost-btn small copy-resource-card" type="button" data-resource-copy="${index}">复制资源卡</button>
            <button class="ghost-btn small copy-resource-contribution" type="button" data-resource-contribution="${index}">复制贡献模板</button>
            ${href ? `<a class="ghost-btn small" href="${href}" target="_blank" rel="noopener noreferrer">查看仓库</a>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function buildResourceRadarText(item) {
  return `AI 学习资源卡：${item.name}

仓库：${item.url}
类型：${item.type}
许可证：${item.licenseSpdx}
复核：${item.source} · ${item.lastVerified}
处理建议：${item.action}

值得学习：
${item.useFor}

本站改造方向：
${item.adapt}

使用边界：
复用前请阅读原仓库 LICENSE；NOASSERTION 或限制性许可证只借鉴机制，不搬运原文。请保留来源链接，并把引用、改写和原创内容区分清楚。`;
}

function buildResourceContributionText(item = {}) {
  return `AI 学习资源贡献模板

资源名称：${item.name || ""}
GitHub 地址：${item.url || ""}
类型：${item.type || ""}
当前许可证 SPDX：${item.licenseSpdx || ""}
复核日期：${item.lastVerified || new Date().toISOString().slice(0, 10)}
处理建议：${item.action || "值得借鉴 / 可按许可证复用 / 可改造吸收 / 谨慎改造 / 只借鉴机制"}

为什么值得学习：
${item.useFor || ""}

建议如何改造成本站内容：
${item.adapt || ""}

风险与边界：
请说明是否允许复制原文、代码或图片；许可证不清晰时，只提交机制借鉴和自己的重新表达。

贡献者备注：
`;
}

async function copyResourceCard(index, button) {
  const item = resourceRadarItems[index];
  if (!item) return;
  const ok = await copyTextWithFallback(buildResourceRadarText(item), {
    button,
    successText: `已复制「${item.name}」资源卡。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
  if (!ok) return;
}

async function copyResourceContribution(index, button) {
  const item = resourceRadarItems[index] || {};
  const ok = await copyTextWithFallback(buildResourceContributionText(item), {
    button,
    successText: "已复制资源贡献模板。",
    failureText: "复制失败，请手动复制页面内容。"
  });
  if (!ok) return;
}

function renderTrack() {
  const track = tracks[state.track];
  const detail = document.querySelector("#trackDetail");
  const codeExamples = track.codeExamples || {};
  const prereqHTML = track.prereq ? `
    <div class="prereq-check">
      <h4>开始前的自检</h4>
      <p class="muted" style="margin-bottom:10px;">勾选你已具备的条件，确认你准备好开始这条路线。</p>
      ${track.prereq.map((q, i) => `
        <label class="prereq-question">
          <input type="checkbox" />
          <span>${safeText(q)}</span>
        </label>
      `).join("")}
    </div>
  ` : "";
  const selfCheckHTML = track.selfCheck ? `
    <div class="self-check">
      <h4>学完后的自我检查</h4>
      <p class="muted" style="margin-bottom:10px;">确认你能做到以下事项，再进入下一条路线。</p>
      ${track.selfCheck.map((item, i) => `
        <label class="self-check-item">
          <input type="checkbox" />
          <span>${safeText(item)}</span>
        </label>
      `).join("")}
    </div>
  ` : "";
  detail.innerHTML = `
    <article class="track-card">
      <h3>${safeText(track.title)}</h3>
      <p class="muted">${safeText(track.summary)}</p>
      <ul>${safeList(track.outcomes)}</ul>
      <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(track.title)}', desc: '${safeText(track.summary)}'})">问 AI 辅导</button>
    </article>
    ${prereqHTML}
    <div class="track-modules">
      ${track.modules
        .map(
          ([name, text]) => {
            const example = codeExamples[name] || "";
            return `<article class="module">
              <span>${safeText(name)}</span>
              <h3>${safeText(name)}模块</h3>
              <p class="muted">${safeText(text)}</p>
              ${example ? `<pre style="background:rgba(143,47,42,0.06);padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;margin:8px 0;">${escapeHtml(example)}</pre>` : ""}
              <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(track.title)} - ${safeText(name)}', desc: '${safeText(text)}'})">问 AI</button>
            </article>`;
          }
        )
        .join("")}
    </div>
    ${selfCheckHTML}
  `;
}

function renderWeeks() {
  const list = document.querySelector("#weekList");
  list.innerHTML = weeks
    .map(([week, title, goal], index) => {
      const checked = state.doneWeeks.has(index);
      return `
        <label class="week-item ${checked ? "done" : ""}">
          <input type="checkbox" data-week="${index}" ${checked ? "checked" : ""} />
          <span><strong>${safeText(week)} · ${safeText(title)}</strong><small class="muted">${safeText(goal)}</small></span>
          <span class="tag">${checked ? "已记录" : "可后续"}</span>
        </label>
      `;
    })
    .join("");
  updateProgress();
}

function renderMonthOptions() {
  const select = document.querySelector("#monthSelect");
  select.innerHTML = (monthlyUpdates.length
    ? monthlyUpdates
    : [{ id: "2026-07", label: "2026 年 7 月" }]
  )
    .map((month) => `<option value="${safeText(month.id)}">${safeText(month.label || month.id)}</option>`)
    .join("");
  select.value = state.month;
}

function renderMonthlyUpdate() {
  const update = monthlyUpdates.find((month) => month.id === state.month) || monthlyUpdates[0];
  if (!update) {
    return;
  }
  const evidenceItems = [
    update.lastVerified ? `复核日期：${update.lastVerified}` : "",
    update.confidence ? `可信度：${update.confidence}` : "",
    update.testedTasks?.length ? `测试任务：${update.testedTasks.join(" / ")}` : ""
  ].filter(Boolean);
  const sourceLinks = (update.sources || [])
    .filter((source) => source && source.label && source.url)
    .map((source) => {
      const href = safeUrl(source.url);
      if (!href) return "";
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${safeText(source.label)}</a>`;
    })
    .filter(Boolean);
  document.querySelector("#monthBadge").textContent = safeText(update.label || "");
  document.querySelector("#monthTitle").textContent = safeText(update.title || "");
  document.querySelector("#monthSummary").textContent = safeText(update.summary || "");
  document.querySelector("#monthFocusCount").textContent = String(update.cards?.length || 0);
  document.querySelector("#monthUpdated").textContent = update.updatedAt ? `更新日期：${safeText(update.updatedAt)}` : "";
  document.querySelector("#monthEvidence").innerHTML = [...evidenceItems.map((item) => `<span>${safeText(item)}</span>`), ...sourceLinks].join("");
  document.querySelector("#monthlyGrid").innerHTML = update.cards
    .map((card) => `<article class="monthly-card"><h3>${safeText(card.title)}</h3><ul>${safeList(card.items)}</ul></article>`)
    .join("");
}

function renderModels(keyword = "") {
  const grid = document.querySelector("#modelGrid");
  const query = keyword.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const text = `${model.name} ${model.desc} ${(model.tags || []).join(" ")} ${(model.scenario || "")} ${(model.pricing || "")}`.toLowerCase();
    return text.includes(query);
  });
  if (!filtered.length) {
    grid.innerHTML =
      '<div class="empty-state">未找到匹配模型，建议尝试关键词：编程、短视频、长文本、国内、国际。</div>';
    return;
  }
  const now = new Date();
  grid.innerHTML = filtered
    .map(
      (model) => {
        let expiryHTML = "";
        if (model.lastVerified) {
          const verified = new Date(model.lastVerified);
          const daysSince = Math.floor((now - verified) / 86400000);
          if (daysSince > 60) {
            expiryHTML = `<span class="expiry-warning expired">数据已过期 ${daysSince} 天，请核实</span>`;
          } else if (daysSince > 30) {
            expiryHTML = `<span class="expiry-warning stale">数据 ${daysSince} 天前验证，建议复核</span>`;
          }
        }
        return `
      <article class="model-card">
        <h3>${safeText(model.name)}${expiryHTML}</h3>
        <p>${safeText(model.desc)}</p>
        <p class="muted">${safeText(model.scenario || "")}</p>
        ${model.contextWindow || model.inputPrice || model.outputPrice ? `
        <div class="model-specs" style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;font-size:13px;">
          ${model.contextWindow ? `<span><strong>上下文：</strong>${safeText(model.contextWindow)}</span>` : ""}
          ${model.inputPrice ? `<span><strong>输入：</strong>${safeText(model.inputPrice)}</span>` : ""}
          ${model.outputPrice ? `<span><strong>输出：</strong>${safeText(model.outputPrice)}</span>` : ""}
          ${model.vendor ? `<span><strong>厂商：</strong>${safeText(model.vendor)}</span>` : ""}
        </div>` : ""}
        <p class="muted"><strong>定价：</strong>${safeText(model.pricing || "")}</p>
        <p><strong>优势：</strong>${safeText(Array.isArray(model.strengths) ? model.strengths.join("；") : "")}</p>
        <p><strong>适用边界：</strong>${safeText(Array.isArray(model.limits) ? model.limits.join("；") : "")}</p>
        ${model.lastVerified ? `<p class="muted" style="font-size:11px;">数据验证：${safeText(model.lastVerified)}</p>` : ""}
        ${model.benchmark ? `<div class="model-specs" style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;font-size:13px;">
          ${model.benchmark.humanEval && model.benchmark.humanEval !== "—" ? `<span><strong>HumanEval：</strong>${safeText(model.benchmark.humanEval)}</span>` : ""}
          ${model.benchmark.cEval && model.benchmark.cEval !== "—" ? `<span><strong>C-Eval：</strong>${safeText(model.benchmark.cEval)}</span>` : ""}
          ${model.benchmark.mbpp && model.benchmark.mbpp !== "—" ? `<span><strong>MBPP：</strong>${safeText(model.benchmark.mbpp)}</span>` : ""}
        </div>` : ""}
        <footer>${(model.tags || [])
          .map((tag) => `<span class="tag">${safeText(tag)}</span>`)
          .join("")}</footer>
        <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '模型对比 - ${safeText(model.name)}', desc: '${safeText(model.desc)}'})">问 AI</button>
      </article>
    `;
      }
    )
    .join("");
}

function renderProjects() {
  const query = state.projectSearch.trim().toLowerCase();
  const visibleProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => {
      const levelMatched = state.projectLevel === "all" || project.level === state.projectLevel;
      const text = `${project.title} ${project.level} ${project.time} ${project.desc} ${(project.tools || []).join(" ")} ${(project.tasks || []).join(" ")} ${(project.deliverables || []).join(" ")} ${project.check || ""}`.toLowerCase();
      return levelMatched && (!query || text.includes(query));
    });

  document.querySelector("#projectCount").textContent = `当前显示 ${visibleProjects.length} / ${projects.length} 个挑战`;

  if (!visibleProjects.length) {
    document.querySelector("#projectGrid").innerHTML =
      '<div class="empty-state">未找到匹配挑战，试试关键词：RAG、短视频、Agent、隐私、模型。</div>';
    return;
  }

  document.querySelector("#projectGrid").innerHTML = visibleProjects
    .map(({ project, index }) => {
      const done = state.doneProjects.has(index);
      const requiredXp = getProjectUnlockXp(project);
      const locked = getXp() < requiredXp;
      return `
      <article class="project-card ${locked ? "locked" : ""}" data-unlock-label="${locked ? `需要 ${requiredXp} XP 后解锁` : ""}">
        <div class="project-meta">
          <span class="badge">${safeText(project.level || "挑战")}</span>
          <span>${safeText(project.time || "")}</span>
        </div>
        <h3>${safeText(project.title)}</h3>
        <p>${safeText(project.desc)}</p>
        <footer>${(project.tools || []).map((tag) => `<span class="tag">${safeText(tag)}</span>`).join("")}</footer>
        <p><strong>交付物：</strong>${safeText((project.deliverables || []).join(" / "))}</p>
        <p class="muted"><strong>验收：</strong>${safeText(project.check || "")}</p>
        <ul>${safeList(project.tasks)}</ul>
        <div class="project-actions">
          <button class="ghost-btn small copy-project-challenge" type="button" data-project-copy="${index}">复制挑战模板</button>
          <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(project.title)}', desc: '${safeText(project.desc)}'})">问 AI</button>
          <button type="button" class="${done ? "primary-btn" : "ghost-btn"} small project-toggle" ${locked ? "disabled" : ""} data-project="${index}">
            ${done ? "已点亮 +80 XP" : "点亮作品 +80 XP"}
          </button>
        </div>
        ${!locked ? createCodeEditorEmbed(project.title, project.level) : ""}
      </article>
    `;
    })
    .join("");
}

function buildProjectChallengeText(project) {
  return `AI 项目挑战：${project.title}

难度：${project.level}
预计时间：${project.time}
建议工具：${(project.tools || []).join(" / ")}

目标：
${project.desc}

任务步骤：
${(project.tasks || []).map((task, index) => `${index + 1}. ${task}`).join("\n")}

交付物：
${(project.deliverables || []).map((item, index) => `${index + 1}. ${item}`).join("\n")}

验收标准：
${project.check}

请你作为 AI 学习教练，先帮我把这个挑战拆成今天可交付的最小版本、标准版本和挑战版本，并提醒我哪些事实或来源需要核实。`;
}

async function copyProjectChallenge(index, button) {
  const project = projects[index];
  if (!project) return;
  await copyTextWithFallback(buildProjectChallengeText(project), {
    button,
    successText: `已复制「${project.title}」挑战模板。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
}

function buildAgentRolePrompt(role) {
  return `Agent 角色：${role.name}

适用场景：${role.useFor}
来源参考：${role.source}
能力等级：${role.level}

请你扮演这个角色，按下面规则帮助我：
1. 先确认任务目标、对象、限制和已有材料。
2. 根据角色职责给出可执行步骤，不空泛鼓励。
3. 输出时必须包含“输入、产出、验收标准、下一步练习”。
4. 遇到不确定信息要标注“需要核实”，不要编造事实。

角色输入：${role.input}
期望产出：${role.output}
验收标准：${role.check}
练习任务：${role.practice}`;
}

function getDailyAgentRole() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().setHours(0, 0, 0, 0) - start.getTime();
  const day = Math.floor(diff / 86400000);
  return agentRoles[day % agentRoles.length];
}

function renderAgentDailyChallenge() {
  const role = getDailyAgentRole();
  document.querySelector("#agentDailyName").textContent = role.name;
  document.querySelector("#agentDailyUse").textContent = role.useFor;
  document.querySelector("#agentDailyPractice").textContent = role.practice;
  document.querySelector("#copyDailyAgent").dataset.agentName = role.name;
}

async function copyAgentRoleByName(name, button) {
  const role = agentRoles.find((item) => item.name === name);
  if (!role) return;
  await copyTextWithFallback(buildAgentRolePrompt(role), {
    button,
    successText: `已复制「${role.name}」角色卡。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
}

function getAgentQualityTier(role) {
  const promptLen = (role.prompt || role.input || "").length;
  if (promptLen > 500) return { tier: "expert", label: "专家版" };
  if (promptLen > 200) return { tier: "advanced", label: "进阶版" };
  return { tier: "basic", label: "基础版" };
}

const AGENT_PAGE_SIZE = 12;

function renderAgentRoles() {
  const visibleRoles =
    state.agentCategory === "all"
      ? agentRoles
      : agentRoles.filter((role) => role.category === state.agentCategory);
  const categoryName =
    agentRoleCategories.find(([key]) => key === state.agentCategory)?.[1] || "全部";

  document.querySelector("#agentRoleTabs").innerHTML = agentRoleCategories
    .map(([key, label]) => {
      const count = key === "all" ? agentRoles.length : agentRoles.filter((role) => role.category === key).length;
      return `<button type="button" class="${state.agentCategory === key ? "active" : ""}" data-agent-category="${safeText(key)}">${safeText(label)} <span>${count}</span></button>`;
    })
    .join("");

  document.querySelector("#agentRoleCount").textContent = `${categoryName} · ${visibleRoles.length} / ${agentRoles.length} 个角色`;

  if (state.agentCategory !== (state._lastAgentCategory || "all")) {
    state.agentPage = 0;
    state._lastAgentCategory = state.agentCategory;
  }

  const totalPages = Math.ceil(visibleRoles.length / AGENT_PAGE_SIZE);
  if (state.agentPage >= totalPages) state.agentPage = 0;
  const pageStart = state.agentPage * AGENT_PAGE_SIZE;
  const pageRoles = visibleRoles.slice(pageStart, pageStart + AGENT_PAGE_SIZE);

  document.querySelector("#agentRoleGrid").innerHTML = pageRoles
    .map(
      (role) => {
        const quality = getAgentQualityTier(role);
        const scenario = role.useFor || role.output || "";
        return `
      <article class="agent-role-card">
        <div class="agent-role-top">
          <span class="badge">${safeText(role.level)}</span>
          <span class="agent-quality ${quality.tier}">${quality.label}</span>
          <small>${safeText(role.source)}</small>
        </div>
        <h3>${safeText(role.name)}</h3>
        <p>${safeText(role.useFor)}</p>
        ${scenario ? `<div class="agent-scenario"><strong>使用场景：</strong>${safeText(scenario.substring(0, 100))}</div>` : ""}
        <dl>
          <div><dt>输入</dt><dd>${safeText(role.input)}</dd></div>
          <div><dt>产出</dt><dd>${safeText(role.output)}</dd></div>
          <div><dt>验收</dt><dd>${safeText(role.check)}</dd></div>
        </dl>
        <footer>
          <strong>练习：</strong>${safeText(role.practice)}
        </footer>
        <button class="ghost-btn small copy-agent-role" type="button" data-agent-name="${safeText(role.name)}" aria-label="复制角色卡：${safeText(role.name)}">复制角色卡</button>
      </article>
    `;
      }
    )
    .join("");

  const paginationContainer = document.querySelector("#agentPagination");
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
    } else {
      let html = `<button type="button" ${state.agentPage === 0 ? "disabled" : ""} data-agent-page="prev">上一页</button>`;
      for (let i = 0; i < totalPages; i++) {
        html += `<button type="button" class="${i === state.agentPage ? "active" : ""}" data-agent-page="${i}">${i + 1}</button>`;
      }
      html += `<button type="button" ${state.agentPage >= totalPages - 1 ? "disabled" : ""} data-agent-page="next">下一页</button>`;
      paginationContainer.innerHTML = html;
      paginationContainer.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.agentPage;
          if (action === "prev") state.agentPage = Math.max(0, state.agentPage - 1);
          else if (action === "next") state.agentPage = Math.min(totalPages - 1, state.agentPage + 1);
          else state.agentPage = parseInt(action, 10);
          renderAgentRoles();
        });
      });
    }
  }
}

function renderTemplate() {
  document.querySelector("#templateText").textContent = templates[state.template];
}

function renderContact() {
  document.querySelector("#contactName").textContent = ownerContact.name;
  document.querySelector("#contactList").innerHTML = ownerContact.items
    .map(([label, value]) => {
      const content =
        label === "邮箱"
          ? `<button id="copyEmail" class="ghost-btn small" type="button">${safeText(value)}</button>`
          : `<strong>${safeText(value)}</strong>`;
      return `
        <div class="contact-item">
          <span>${safeText(label)}</span>
          ${content}
        </div>
      `;
    })
    .join("");
  document.querySelector("#contactList").insertAdjacentHTML(
    "afterbegin",
    `<div class="qr-card"><img src="${safeText(ownerContact.qrImage)}" alt="微信二维码" loading="lazy" decoding="async" /><span>微信二维码</span></div>`
  );
  document.querySelector("#leadCount").textContent = state.leads.length;
}

function generateProgressReport() {
  const currentMonth = monthlyUpdates.find((month) => month.id === state.month) || monthlyUpdates[0] || {};
  const doneWeekList = weeks
    .map((entry, index) => {
      const [weekName] = entry;
      if (!state.doneWeeks.has(index)) return "";
      const proof = state.weekProofs[String(index)] || "未填写证据";
      return `- ${weekName}：${escapeMarkdownLine(proof)}`;
    })
    .filter(Boolean);
  const doneProjectsList = projects
    .map((project, index) => {
      if (!state.doneProjects.has(index)) return "";
      const proof = state.projectProofs[index] || "未填写证据";
      return `- ${project.title}（${escapeMarkdownLine(proof)}）`;
    })
    .filter(Boolean);
  const rankName = getRank().name;
  const today = formatReportDate(new Date());
  const lines = [
    "# AI 原生能力自学站 · 学习周报",
    "",
    `导出时间：${today}`,
    `当前版本：${currentMonth.title ? escapeMarkdownLine(currentMonth.title) : "默认月度"}`,
    `当前等级：${rankName}`,
    `当前 XP：${getXp()}`,
    `连续学习记录：${state.streak} 天`,
    `已记录周任务：${state.doneWeeks.size} / ${weeks.length}`,
    `已点亮作品：${state.doneProjects.size} / ${projects.length}`,
    ""
  ];
  if (doneWeekList.length) {
    lines.push("## 周任务进度", ...doneWeekList);
  } else {
    lines.push("## 周任务进度", "- 暂无已记录任务");
  }
  lines.push("");
  if (doneProjectsList.length) {
    lines.push("## 作品里程碑", ...doneProjectsList);
  } else {
    lines.push("## 作品里程碑", "- 暂无点亮作品");
  }
  lines.push("");
  lines.push("## 本周建议");
  const nextWeekCandidates = weeks.filter((_, index) => !state.doneWeeks.has(index));
  if (nextWeekCandidates.length) {
    lines.push(`- 下一个推荐任务：${nextWeekCandidates[0][1]}（${nextWeekCandidates[0][2]}）`);
  } else {
    lines.push("- 本阶段里程碑还在持续推进中，可切换到下月更新继续延展。");
  }
  return lines.join("\n");
}

function downloadProgressReport() {
  const report = generateProgressReport();
  const today = formatReportDate(new Date());
  downloadTextFile(report, {
    fileName: `ai-learning-report-${today}.md`,
    type: "text/markdown;charset=utf-8",
    toastMessage: "学习周报已导出。"
  });
}

function getOwnerEmail() {
  return `${ownerContact.emailParts[0]}@${ownerContact.emailParts[1]}.${ownerContact.emailParts[2]}`;
}

let previousActiveElement = null;
let modalCloseResolver = null;
let activeProofCleanup = null;

function getModalFocusables(modal) {
  if (!modal) return [];
  return Array.from(
    modal.querySelectorAll("button, [href], input, select, textarea")
  ).filter((el) => !el.disabled && el.tabIndex !== -1);
}

function trapModalFocus(event) {
  if (event.key !== "Tab") return;
  const focusables = getModalFocusables(activeModal);
  if (!focusables.length) {
    event.preventDefault();
    return;
  }
  const currentIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey) {
    const prev = focusables[(currentIndex - 1 + focusables.length) % focusables.length];
    prev.focus();
  } else {
    const next = focusables[(currentIndex + 1) % focusables.length];
    next.focus();
  }
  event.preventDefault();
}

let activeModal = null;

function openModal(modal) {
  previousActiveElement = document.activeElement;
  activeModal = modal;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", trapModalFocus);
  requestAnimationFrame(() => {
    const focusables = getModalFocusables(activeModal);
    const first = focusables[0];
    if (first) first.focus();
  });
}

function closeModal() {
  const modal = activeModal;
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", trapModalFocus);
  if (activeProofCleanup && modal.id === "proofModal") {
    activeProofCleanup();
    activeProofCleanup = null;
  }
  activeModal = null;
  if (previousActiveElement && previousActiveElement.focus) {
    previousActiveElement.focus();
  }
}

function closeModalWithResult(result = null) {
  if (!activeModal) return null;
  const resolver = modalCloseResolver;
  closeModal();
  if (resolver) {
    modalCloseResolver = null;
    resolver(result);
  }
  return result;
}

function openSponsorModal() {
  openModal(document.querySelector("#sponsorModal"));
}

function closeSponsorModal() {
  closeModal();
}

function requestProof({ title = "补充实践证据", description = "" }) {
  return new Promise((resolve) => {
    const modal = document.querySelector("#proofModal");
    const titleNode = modal.querySelector("#proofTitle");
    const descNode = modal.querySelector("#proofDesc");
    const input = modal.querySelector("#proofInput");
    const submit = modal.querySelector("#proofSubmit");
    const cancel = modal.querySelector("#proofCancel");
    const close = modal.querySelector("#proofClose");

    titleNode.textContent = title;
    descNode.textContent = description;
    input.value = "";
    modalCloseResolver = resolve;

    openModal(modal);

    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      activeProofCleanup = null;
      cleanup();
      closeModalWithResult(value);
    };

    const handleSubmit = () => {
      const proof = toTrimmed(input.value);
      finish(proof || null);
    };
    const handleCancel = () => {
      finish(null);
    };
    const handleKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
    const handleBackdropClose = (event) => {
      if (event.target === modal) {
        handleCancel();
      }
    };
    const cleanup = () => {
      submit.removeEventListener("click", handleSubmit);
      cancel.removeEventListener("click", handleCancel);
      close.removeEventListener("click", handleCancel);
      input.removeEventListener("keydown", handleKeydown);
      modal.removeEventListener("click", handleBackdropClose);
    };
    activeProofCleanup = cleanup;

    submit.addEventListener("click", handleSubmit);
    cancel.addEventListener("click", handleCancel);
    close.addEventListener("click", handleCancel);
    input.addEventListener("keydown", handleKeydown);
    modal.addEventListener("click", handleBackdropClose);
  });
}

function saveLead(lead) {
  state.leads.unshift(lead);
  if (!setStoredValue(storageKeys.leads, state.leads)) {
    showStorageUnavailableNotice();
  }
  renderContact();
}

function renderFeedbackCount() {
  document.querySelector("#feedbackCount").textContent = String(state.feedback.length);
}

function saveFeedback(entry) {
  state.feedback.unshift(entry);
  if (!setStoredValue(storageKeys.feedback, state.feedback)) {
    showStorageUnavailableNotice();
  }
  renderFeedbackCount();
}

function downloadFeedbackCsv() {
  if (!state.feedback.length) {
    showToast("还没有反馈可以导出。");
    return;
  }
  const headers = ["提交时间", "主题", "建议"];
  const rows = state.feedback.map((item) => [item.createdAt, item.topic, item.message]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadTextFile(csv, { fileName: `ai-learning-feedback-${getTodayKey()}.csv`, type: "text/csv;charset=utf-8", toastMessage: "反馈 CSV 已导出。" });
}

function downloadLeadsCsv() {
  if (!state.leads.length) {
    showToast("还没有报名记录可以导出。");
    return;
  }
  const headers = ["提交时间", "姓名", "联系方式", "身份或阶段", "最想学习", "留言"];
  const rows = state.leads.map((lead) => [
    lead.createdAt,
    lead.name,
    lead.contact,
    lead.profile,
    lead.interest,
    lead.message
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadTextFile(csv, { fileName: `ai-learning-leads-${getTodayKey()}.csv`, type: "text/csv;charset=utf-8", toastMessage: "报名 CSV 已导出。" });
}

function hasAnyLocalData() {
  return (
    state.leads.length > 0 ||
    state.feedback.length > 0 ||
    state.worldview30Done.size > 0 ||
    state.doneWeeks.size > 0 ||
    state.doneProjects.size > 0 ||
    Object.keys(state.weekProofs).length > 0 ||
    Object.keys(state.projectProofs).length > 0 ||
    state.bonusXp > 0 ||
    state.streak > 0 ||
    Boolean(state.lastCheckIn) ||
    Boolean(state.dailyDone)
  );
}

function exportAllLocalData() {
  if (!hasAnyLocalData()) {
    showToast("当前没有本机数据可导出。", 1400);
    return;
  }
  const payload = {
    exportedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    version: "1.0",
    storageSummary: {
      leads: state.leads.length,
      feedback: state.feedback.length,
      doneWeeks: state.doneWeeks.size,
      worldview30Done: state.worldview30Done.size,
      doneProjects: state.doneProjects.size
    },
    leads: state.leads,
    feedback: state.feedback,
    progress: {
      month: state.month,
      doneWeeks: [...state.doneWeeks],
      worldview30Done: [...state.worldview30Done],
      doneProjects: [...state.doneProjects],
      weekProofs: state.weekProofs,
      projectProofs: state.projectProofs,
      bonusXp: state.bonusXp,
      streak: state.streak,
      lastCheckIn: state.lastCheckIn,
      dailyDone: state.dailyDone
    }
  };
  downloadTextFile(JSON.stringify(payload, null, 2), {
    fileName: `ai-learning-local-data-${getTodayKey()}.json`,
    type: "application/json;charset=utf-8",
    toastMessage: "全部本机数据已导出。"
  });
}

function clearFeedbackData({ confirmFirst = false, showMessage = true } = {}) {
  if (!state.feedback.length) {
    if (showMessage) showToast("当前没有反馈数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    if (!window.confirm("确认清空所有本机反馈数据？清除后无法恢复。")) return false;
  }
  state.feedback = [];
  if (!removeStoredValue(storageKeys.feedback)) {
    showStorageUnavailableNotice();
  }
  renderFeedbackCount();
  if (showMessage) showToast("反馈数据已清空。", 1600);
  return true;
}

function clearLeadsData({ confirmFirst = false, showMessage = true } = {}) {
  if (!state.leads.length) {
    if (showMessage) showToast("当前没有报名数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    const needBackup = window.confirm("清空前建议先备份，是否先导出报名 CSV？");
    if (needBackup) {
      downloadLeadsCsv();
    }
    if (!window.confirm("确认清空所有本机报名数据？清除后可从页面手动恢复不了。")) {
      return false;
    }
  }
  state.leads = [];
  if (!removeStoredValue(storageKeys.leads)) {
    showStorageUnavailableNotice();
  }
  renderContact();
  if (showMessage) showToast("报名数据已清空。", 1600);
  return true;
}

function clearGameProgressData({ confirmFirst = false, showMessage = true } = {}) {
  if (
    !state.doneWeeks.size &&
    !state.doneProjects.size &&
    !state.worldview30Done.size &&
    !Object.keys(state.weekProofs).length &&
    !Object.keys(state.projectProofs).length &&
    state.bonusXp === 0 &&
    state.streak === 0 &&
    !state.lastCheckIn &&
    !state.dailyDone
  ) {
    if (showMessage) showToast("当前没有进度数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    if (!window.confirm("确认清空所有本机任务与学习进度记录？清除后无法恢复。")) {
      return false;
    }
  }
  state.doneWeeks = new Set();
  state.worldview30Done = new Set();
  state.doneProjects = new Set();
  state.weekProofs = {};
  state.projectProofs = {};
  state.bonusXp = 0;
  state.streak = 0;
  state.lastCheckIn = "";
  state.dailyDone = "";
  if (!removeStoredValue(storageKeys.weeks) || !removeStoredValue(storageKeys.projects) || !removeStoredValue(storageKeys.weekProofs) || !removeStoredValue(storageKeys.projectProofs) || !removeStoredValue(storageKeys.bonusXp) || !removeStoredValue(storageKeys.streak) || !removeStoredValue(storageKeys.lastCheckIn) || !removeStoredValue(storageKeys.dailyDone)) {
    showStorageUnavailableNotice();
  }
  if (!removeStoredValue(storageKeys.worldview30Weeks)) {
    showStorageUnavailableNotice();
  }
  renderWeeks();
  renderProjects();
  renderBadges();
  refreshGame();
  if (showMessage) showToast("学习进度数据已清空。", 1600);
  return true;
}

function clearAllLocalData() {
  if (!hasAnyLocalData()) {
    showToast("当前没有本机数据可清空。", 1400);
    return;
  }
    const needBackup = window.confirm("清空前建议先备份，是否先导出全部本机数据？");
  if (needBackup) {
    exportAllLocalData();
  }
  if (!window.confirm("确认清空全部本机数据？包括报名、反馈和任务进度，清空后不可恢复。")) {
    return;
  }
  clearFeedbackData({ showMessage: false });
  clearLeadsData({ showMessage: false });
  clearGameProgressData({ showMessage: false });
  showToast("全部本机数据已清空。", 1800);
}

function buildIssueUrl({ title, body, labels = "" }) {
  const params = new URLSearchParams({ title, body });
  if (labels) params.set("labels", labels);
  return `${repoLinks.newIssue}?${params.toString()}`;
}

function getFeedbackDraft(form = document.querySelector("#feedbackForm")) {
  const data = new FormData(form);
  const fallback = state.feedback[0] || {};
  const topic = toTrimmed(data.get("topic")) || fallback.topic || "";
  const message = toTrimmed(data.get("message")) || fallback.message || "";
  if (!topic || !message) return null;
  return {
    title: `[Feedback] ${topic}`,
    body: [
      "## 反馈主题",
      "",
      topic,
      "",
      "## 建议内容",
      "",
      message,
      "",
      "## 来源",
      "",
      "- 来自 AI 原生能力自学站页面反馈表单",
      `- 生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`
    ].join("\n")
  };
}

async function copyFeedbackIssueDraft() {
  const draft = getFeedbackDraft();
  if (!draft) {
    showToast("建议先把反馈主题和建议补齐，信息会更完整。", 1800);
    return;
  }
  const text = `${draft.title}\n\n${draft.body}`;
  await copyTextWithFallback(text, {
    successText: "反馈 Issue 草稿已复制，可粘贴到 GitHub。",
    failureText: "复制失败，请手动复制反馈内容。"
  });
}

function openFeedbackIssue() {
  const draft = getFeedbackDraft();
  if (!draft) {
    showToast("建议先把反馈主题和建议补齐，发 Issue 更完整。", 1800);
    return;
  }
  window.open(buildIssueUrl({ ...draft, labels: "feedback" }), "_blank", "noopener");
}

function getLeadDraft(form = document.querySelector("#registerForm")) {
  const data = new FormData(form);
  const fallbackLead = state.leads[0] || {};
  const lead = {
    name: toTrimmed(data.get("name")) || fallbackLead.name || "",
    contact: toTrimmed(data.get("contact")) || fallbackLead.contact || "",
    profile: data.get("profile") || fallbackLead.profile || "",
    interest: data.get("interest") || fallbackLead.interest || "",
    message: toTrimmed(data.get("message")) || fallbackLead.message || "",
    createdAt: fallbackLead.createdAt || new Date().toLocaleString("zh-CN", { hour12: false })
  };
  if (!lead.name || !lead.contact || !lead.profile || !lead.interest) return null;
  return lead;
}

function buildLeadContactText(lead) {
  return [
    "你好，我想加入 AI 原生能力自学站的月更学习名单。",
    "",
    `称呼：${lead.name}`,
    `联系方式：${lead.contact}`,
    `身份或阶段：${lead.profile}`,
    `最想学习：${lead.interest}`,
    lead.message ? `留言：${lead.message}` : "留言：",
    "",
    "说明：这段内容由网页本地生成，请通过邮箱或微信发送给主理人。"
  ].join("\n");
}

async function copyLeadContactDraft() {
  const lead = getLeadDraft();
  if (!lead) {
    showToast("建议先补齐报名信息，或者先用最近一条本机报名记录继续。", 2200);
    return;
  }
  await copyTextWithFallback(buildLeadContactText(lead), {
    successText: "联系草稿已复制，请通过邮箱或微信发给我。",
    failureText: "复制失败，请手动整理联系内容。"
  });
}

function openLeadEmailDraft() {
  const lead = getLeadDraft();
  if (!lead) {
    showToast("建议先补齐报名信息，或者先用最近一条本机报名记录继续。", 2200);
    return;
  }
  const subject = encodeURIComponent("加入 AI 原生能力自学站月更学习名单");
  const body = encodeURIComponent(buildLeadContactText(lead));
  window.location.href = `mailto:${getOwnerEmail()}?subject=${subject}&body=${body}`;
}

function updateProgress() {
  const value = Math.round((state.doneWeeks.size / weeks.length) * 100);
  document.querySelector("#progressValue").textContent = `${value}%`;
  updateGameHud();
}

function getXp() {
  return state.doneWeeks.size * 60 + state.doneProjects.size * 80 + state.bonusXp;
}

function getRank() {
  const xp = getXp();
  return ranks.reduce((current, rank) => (xp >= rank.min ? rank : current), ranks[0]);
}

function getNextRank() {
  const xp = getXp();
  return ranks.find((rank) => rank.min > xp) || ranks[ranks.length - 1];
}

function updateGameHud() {
  const xp = getXp();
  const rank = getRank();
  const nextRank = getNextRank();
  const nextXp = nextRank.min === rank.min ? rank.min + 240 : nextRank.min;
  const currentBase = rank.min;
  const percent = Math.min(100, Math.round(((xp - currentBase) / (nextXp - currentBase)) * 100));
  document.querySelector("#levelValue").textContent = `Lv.${ranks.indexOf(rank) + 1}`;
  document.querySelector("#xpValue").textContent = `${xp} XP`;
  document.querySelector("#streakValue").textContent = `${state.streak} 天`;
  document.querySelector("#rankTitle").textContent = rank.name;
  document.querySelector("#xpBar").style.width = `${percent}%`;
  document.querySelector("#nextRankText").textContent =
    nextRank.min === rank.min ? "已到达当前版本最高等级，继续打磨作品集。" : `距离「${nextRank.name}」还差 ${nextRank.min - xp} XP。`;

  const streakBanner = document.querySelector("#streakBanner");
  if (streakBanner) {
    const multiplier = state.streak >= 100 ? 3 : state.streak >= 30 ? 2 : state.streak >= 7 ? 1.5 : 1;
    if (state.streak >= 3 && multiplier > 1) {
      const tier = state.streak >= 100 ? "streak-100" : state.streak >= 30 ? "streak-30" : "streak-7";
      streakBanner.className = `streak-banner ${tier}`;
      streakBanner.innerHTML = `<span class="streak-fire">🔥</span> 连续 ${state.streak} 天 <span class="streak-multiplier">×${multiplier} XP</span>`;
      streakBanner.style.display = "flex";
    } else if (state.streak >= 3) {
      streakBanner.className = "streak-banner";
      streakBanner.innerHTML = `<span class="streak-fire">🔥</span> 连续 ${state.streak} 天`;
      streakBanner.style.display = "flex";
    } else {
      streakBanner.style.display = "none";
    }
  }
}

function renderDailyChallenge() {
  const todayKey = getTodayKey();
  const index = new Date().getDay();
  const [title, desc] = dailyChallenges[index];
  const done = state.dailyDone === todayKey;
  document.querySelector("#dailyTitle").textContent = title;
  document.querySelector("#dailyDesc").textContent = desc;
  document.querySelector("#dailyButton").textContent = done ? "今日练习已记录" : "记录今日练习 +35 XP";
  document.querySelector("#dailyButton").disabled = done;
  document.querySelector("#checkInButton").textContent = state.lastCheckIn === todayKey ? "今日已记录" : "记录今日进度 +20 XP";
  document.querySelector("#checkInButton").disabled = state.lastCheckIn === todayKey;
}

function renderBadges() {
  document.querySelector("#badgeWall").innerHTML = achievements
    .map((badge) => {
      const unlocked = badge.test();
      const tier = badge.tier || "bronze";
      const tierLabel = tier === "gold" ? "🥇金" : tier === "silver" ? "🥈银" : "🥉铜";
      return `
        <article class="achievement ${unlocked ? "unlocked badge-tier-${tier}" : ""}">
          <strong>${safeText(unlocked ? badge.title : "未解锁")} <span class="badge-tier-label ${tier}">${tierLabel}</span></strong>
          <span>${safeText(badge.desc)}</span>
        </article>
      `;
    })
    .join("");
}

function persistGameState() {
  const isStorageOk =
    setStoredValue(storageKeys.projects, [...state.doneProjects]) &&
    setStoredValue(storageKeys.worldview30Weeks, [...state.worldview30Done]) &&
    setStoredValue(storageKeys.weekProofs, state.weekProofs) &&
    setStoredValue(storageKeys.projectProofs, state.projectProofs) &&
    setStoredValue(storageKeys.bonusXp, state.bonusXp) &&
    setStoredValue(storageKeys.streak, state.streak) &&
    setStoredValue(storageKeys.lastCheckIn, state.lastCheckIn) &&
    setStoredValue(storageKeys.dailyDone, state.dailyDone);
  if (!isStorageOk) {
    showStorageUnavailableNotice();
  }
}

function showToast(message, duration = 1800) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const region = document.querySelector("#statusRegion");
  if (region) region.textContent = message;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = message;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

function refreshGame() {
  updateGameHud();
  renderDailyChallenge();
  renderBadges();
}

function initSectionRevealAnimations() {
  const activeId = getRequestedPageId();
  const activeSection = document.querySelector(`main > .section#${CSS.escape(activeId)}`);
  if (!activeSection) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  activeSection.classList.add("reveal-ready");
  activeSection.style.setProperty("--reveal-delay", "0ms");
  if (prefersReducedMotion) {
    activeSection.classList.add("in-view");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.16,
    rootMargin: "0px 0px -12% 0px"
  });

  observer.observe(activeSection);
}

function setActiveNavItem(sectionId) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const isActive = link.dataset.page === sectionId;
    if (isActive) {
      link.setAttribute("aria-current", "page");
      link.classList.add("active-nav");
    } else {
      link.removeAttribute("aria-current");
      link.classList.remove("active-nav");
    }
  });
}

function updateActiveNav() {
  const active = getRequestedPageId();
  setActiveNavItem(active);
  if (typeof updateMobileTabBar === "function") updateMobileTabBar();
}

function runActionRegressionChecks() {
  const startedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  const currentPage = getRequestedPageId();
  const checks = [];
  const pageJumpChecks = [];

  const add = (name, passed, detail = "") => {
    checks.push({ name, passed, detail });
  };

  const checkInButton = document.querySelector("#checkInButton");
  const dailyButton = document.querySelector("#dailyButton");
  const exportReportButton = document.querySelector("#exportReport");
  const weekInputs = document.querySelectorAll("#weekList [data-week]");
  const copyButtons = document.querySelectorAll("[data-resource-copy], [data-resource-contribution], .copy-project-challenge, .copy-agent-role");
  const resourceNav = document.querySelectorAll("a.nav-link[data-page]").length === PAGE_IDS.length;
  const allNavLinks = document.querySelectorAll("a.nav-link[data-page]");

  add("学习记录按钮存在且可见", Boolean(checkInButton));
  add("今日挑战按钮存在且可见", Boolean(dailyButton));
  add("周报导出按钮存在", Boolean(exportReportButton));
  add("周任务条目勾选控件存在", weekInputs.length >= 1);
  add("复制类按钮存在", copyButtons.length >= 3);
  add("导航条页签覆盖全部页面", resourceNav);

  for (const link of allNavLinks) {
    const target = link.dataset.page;
    if (!PAGE_IDS.includes(target)) {
      add(`无效导航目标 (${target})`, false, `发现非法 page=${target}`);
      continue;
    }
    try {
      applyCurrentPage(target, { silent: true });
      renderCurrentPageContent(target);
      const section = document.querySelector(`#${CSS.escape(target)}`);
      const visible = Boolean(section && !section.hidden && section.getAttribute("aria-hidden") === "false");
      pageJumpChecks.push({ target, visible });
      const hasHorizontalOverflow =
        section &&
        section.scrollWidth >
          (section.clientWidth || document.documentElement.clientWidth || window.innerWidth || 0) + 2;
      if (hasHorizontalOverflow) {
        add(`分页跳转可见性：${target}`, false, "页面在当前断点存在水平溢出");
      }
      if (!visible) {
        add(`分页跳转可见性：${target}`, false, "切换后页面仍被隐藏");
      }
    } catch (error) {
      pageJumpChecks.push({ target, visible: false, error: String(error) });
      add(`分页跳转可见性：${target}`, false, String(error));
    }
  }

  applyCurrentPage(currentPage, { silent: true });
  renderCurrentPageContent(currentPage);
  initSectionRevealAnimations();

  add("分页跳转可见性全部通过", pageJumpChecks.every((item) => item.visible));
  add("任务与周报导出文案能力", Boolean(exportReportButton && typeof downloadProgressReport === "function"));

  return {
    passed: checks.every((item) => item.passed),
    startedAt,
    checks,
    pageJumpChecks
  };
}

function runPreLaunchReadinessChecks() {
  const startedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  const checks = [];
  const add = (name, category, passed, detail = "") => {
    checks.push({ name, category, passed, detail });
  };
  const actionResult = runActionRegressionChecks();

  const p0Items = actionResult.checks.filter((item) => item.name.includes("分页跳转"));
  const p0Passed = p0Items.length >= PAGE_IDS.length && p0Items.every((item) => item.passed);
  const p1Passed = actionResult.passed;
  add("基础路由与分页可见性恢复", "P0", p0Passed, p0Passed ? "通过" : "存在异常");

  const p1Critical = [
    "学习记录按钮存在且可见",
    "今日挑战按钮存在且可见",
    "周报导出按钮存在",
    "周任务条目勾选控件存在",
    "复制类按钮存在",
    "任务与周报导出文案能力"
  ];
  const p1Checks = p1Critical.map((name) => {
    const item = actionResult.checks.find((entry) => entry.name === name);
    if (!item) {
      return { name, passed: false, detail: "未找到该检查项" };
    }
    return item;
  });
  const p1Ok = p1Checks.every((item) => item.passed);
  p1Checks.forEach((item) => add(`功能动作：${item.name}`, "P1", item.passed, item.detail));
  add("P1 综合", "P1", p1Ok, p1Ok ? "通过" : "关键动作存在缺失");

  const localStorageTestPassed = (() => {
    try {
      const testKey = "__ai_site_smoke__";
      localStorage.setItem(testKey, "1");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  })();
  add("本机数据持久化可写", "P1", localStorageTestPassed, localStorageTestPassed ? "通过" : "localStorage 不可用");

  const contactLabel = document.querySelector("#copyEmail");
  const contactSafe = Boolean(contactLabel && !contactLabel.textContent.includes("@"));
  add("邮箱不明文展示", "P1", contactSafe, contactSafe ? "通过" : "邮箱或联系方式文案可能泄露明文");

  const touchControls = Array.from(document.querySelectorAll(".primary-btn, .ghost-btn, .copy-agent-role, .copy-project-challenge, .copy-resource-card, .copy-resource-contribution, .small, .section-actions button, .form-actions button, .register-actions button, .segmented button, .tabs button, .agent-role-tabs button"))
    .filter((button) => button.offsetParent !== null);
  const unsafeTouchCount = touchControls.filter((button) => {
    const minHeight = Number.parseFloat(getComputedStyle(button).minHeight || "0");
    return minHeight > 0 && minHeight < 44;
  }).length;
  const p2TouchPassed = unsafeTouchCount === 0;
  add("移动端按钮触达 >= 44px", "P2", p2TouchPassed, p2TouchPassed ? "通过" : `${unsafeTouchCount} 个按钮小于 44px`);

  const listItems = Array.from(document.querySelectorAll("section li"))
    .filter((item) => item.offsetParent !== null);
  const badListMargin = listItems.filter((item) => Number.parseFloat(getComputedStyle(item).marginBottom || "0") < 4).length;
  const p2ListPassed = listItems.length === 0 || badListMargin === 0;
  add("列表行距不挤压", "P2", p2ListPassed, p2ListPassed ? "通过" : `${badListMargin} 个列表项行距不足`);

  const reachableScore = actionResult.pageJumpChecks.every((entry) => entry.visible !== false);
  add("分页跳转与聚焦可达", "P2", reachableScore, reachableScore ? "通过" : "至少一页跳转后不可见或异常");

  let p0Failed = checks.filter((item) => item.category === "P0" && !item.passed).length;
  let p1Failed = checks.filter((item) => item.category === "P1" && !item.passed).length;
  let p2Failed = checks.filter((item) => item.category === "P2" && !item.passed).length;
  const score = Math.max(0, 100 - p0Failed * 25 - p1Failed * 10 - p2Failed * 4);
  const level = score >= 90 ? "可发布" : score >= 80 ? "预发布（待修）" : "阻塞中";

  return {
    startedAt,
    score,
    level,
    passed: p0Passed && p1Passed,
    p0Failed,
    p1Failed,
    p2Failed,
    checks,
    actionRegression: actionResult
  };
}

window.__aiLearningActionRegression = runActionRegressionChecks;
window.__aiLearningPreLaunchReadiness = runPreLaunchReadinessChecks;

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.dataset.page;
    if (!targetId) return;
    if (targetId === getRequestedPageId()) {
      event.preventDefault();
      resetPageViewport(targetId);
      return;
    }
    event.preventDefault();
    applyCurrentPage(targetId);
    renderCurrentPageContent(targetId);
    initSectionRevealAnimations();
    resetPageViewport(targetId);
    window.setTimeout(() => updateActiveNav(), 30);
  });
});

window.addEventListener("popstate", () => {
  const pageId = getRequestedPageId();
  applyCurrentPage(pageId, { silent: true });
  renderCurrentPageContent(pageId);
  initSectionRevealAnimations();
  updateActiveNav();
  resetPageViewport(pageId);
});

document.querySelectorAll("[data-track]").forEach((button) => {
  button.addEventListener("click", () => {
    state.track = button.dataset.track;
    document.querySelectorAll("[data-track]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTrack();
  });
});

document.querySelector("#agentRoleTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-agent-category]");
  if (!button) return;
  state.agentCategory = button.dataset.agentCategory;
  renderAgentRoles();
});

document.querySelector("#agents").addEventListener("click", (event) => {
  const roleButton = event.target.closest(".copy-agent-role, #copyDailyAgent");
  if (!roleButton) return;
  copyAgentRoleByName(roleButton.dataset.agentName, roleButton);
});

document.querySelector("#weekList").addEventListener("change", async (event) => {
  const input = event.target.closest("[data-week]");
  if (!input) return;
  const index = Number(input.dataset.week);
  const proofKey = String(index);
  if (input.checked && !state.weekProofs[proofKey]) {
    const proof = await requestProof({
      title: "补充周度进展证据",
      description: "建议先写一句本周学习记录（内容、复盘、链接或产出）。"
    });
    if (!proof || !proof.trim()) {
      input.checked = false;
    showToast("建议补一条学习记录，再把它整理进归档会更完整。", 1600);
      return;
    }
    state.weekProofs[proofKey] = proof.trim();
  }
  if (!input.checked) {
    delete state.weekProofs[proofKey];
    state.doneWeeks.delete(index);
  } else {
    state.doneWeeks.add(index);
  }
  if (!setStoredValue(storageKeys.weeks, [...state.doneWeeks]) || !setStoredValue(storageKeys.weekProofs, state.weekProofs)) {
    showStorageUnavailableNotice();
  }
  renderWeeks();
  renderProjects();
  renderBadges();
  showToast(input.checked ? "已记录本周状态，获得 60 XP。" : "已取消本周记录，不影响后续进度。");
});

document.querySelector("#worldview30Plan").addEventListener("change", (event) => {
  const input = event.target.closest("[data-worldview-30]");
  if (!input) return;
  const index = String(Number(input.dataset.worldview30));
  if (input.checked) {
    state.worldview30Done.add(index);
    showToast("本周记录已保存。", 1200);
  } else {
    state.worldview30Done.delete(index);
    showToast("已取消本周记录。", 1200);
  }
  if (!setStoredValue(storageKeys.worldview30Weeks, [...state.worldview30Done])) {
    showStorageUnavailableNotice();
  }
  renderWorldview30DayPlan();
});

document.querySelector("#projectGrid").addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-project-copy]");
  if (copyButton) {
    copyProjectChallenge(Number(copyButton.dataset.projectCopy), copyButton);
    return;
  }

  const button = event.target.closest("[data-project]");
  if (!button) return;
  const index = Number(button.dataset.project);
  const requiredXp = getProjectUnlockXp(projects[index]);
  const locked = getXp() < requiredXp;
  if (button.disabled || locked) {
    showToast(`这个挑战还在沉淀中，建议先到 ${requiredXp} XP 再继续，也来得及。`, 1600);
    return;
  }
  if (!state.doneProjects.has(index) && !state.projectProofs[index]) {
    const proof = await requestProof({
      title: "补充作品进展证据",
      description: "建议写一句该作品的进展依据（链接、文件名、提交口径）。"
    });
    if (!proof || !proof.trim()) {
      showToast("建议补一条作品进展证据，方便后续复盘会更清晰。", 1600);
      return;
    }
    state.projectProofs[index] = proof.trim();
  }
  if (state.doneProjects.has(index)) {
    state.doneProjects.delete(index);
    delete state.projectProofs[index];
  } else {
    state.doneProjects.add(index);
  }
  persistGameState();
  renderProjects();
  refreshGame();
  showToast(state.doneProjects.has(index) ? "作品已点亮，获得 80 XP。" : "作品已取消点亮。");
});

document.querySelector("#projectSearch").addEventListener("input", (event) => {
  state.projectSearch = event.target.value;
  renderProjects();
});

document.querySelectorAll("[data-project-level]").forEach((button) => {
  button.addEventListener("click", () => {
    state.projectLevel = button.dataset.projectLevel;
    document.querySelectorAll("[data-project-level]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects();
  });
});

document.querySelector("#modelSearch").addEventListener("input", (event) => {
  renderModels(event.target.value);
});

document.querySelector("#monthSelect").addEventListener("change", (event) => {
  state.month = event.target.value;
  if (!setStoredValue(storageKeys.month, state.month)) {
    showStorageUnavailableNotice();
  }
  renderMonthlyUpdate();
});

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    state.template = button.dataset.template;
    document.querySelectorAll("[data-template]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTemplate();
  });
});

document.querySelector("#copyTemplate").addEventListener("click", async () => {
  const button = document.querySelector("#copyTemplate");
  await copyTextWithFallback(templates[state.template], {
    button,
    successText: "已复制模板。",
    failureText: "复制失败，请长按选择文本手动复制。",
    hideButtonLabelDelay: 1200
  });
});

document.querySelector("#checkInButton").addEventListener("click", () => {
  const todayKey = getTodayKey();
  if (state.lastCheckIn === todayKey) return;
  const yesterday = yesterdayLocalKey();
  state.streak = state.lastCheckIn === yesterday ? state.streak + 1 : 1;
  state.lastCheckIn = todayKey;
  const multiplier = state.streak >= 100 ? 3 : state.streak >= 30 ? 2 : state.streak >= 7 ? 1.5 : 1;
  const earnedXp = Math.round(20 * multiplier);
  state.bonusXp += earnedXp;
  persistGameState();
  refreshGame();
  const streakMsg = multiplier > 1
    ? `今日进度已记录，获得 ${earnedXp} XP（连击 ${state.streak} 天 ×${multiplier}）！`
    : `今日进度已记录，获得 ${earnedXp} XP。`;
  showToast(streakMsg);
  if (typeof gtag === "function") gtag("event", "check_in", { streak: state.streak, xp: earnedXp });
});

document.querySelector("#dailyButton").addEventListener("click", () => {
  const todayKey = getTodayKey();
  if (state.dailyDone === todayKey) return;
  state.dailyDone = todayKey;
  state.bonusXp += 35;
  persistGameState();
  refreshGame();
  showToast("今日练习已记录，获得 35 XP。");
});

document.querySelector("#exportReport").addEventListener("click", () => {
  if (typeof downloadEnhancedReport === "function") downloadEnhancedReport();
  else downloadProgressReport();
});

document.querySelector("#resourceSearch").addEventListener("input", (event) => {
  state.resourceSearch = event.target.value;
  renderResourceRadar();
});

document.querySelectorAll("[data-resource-action]").forEach((button) => {
  button.addEventListener("click", () => {
    state.resourceAction = button.dataset.resourceAction;
    document.querySelectorAll("[data-resource-action]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderResourceRadar();
  });
});

document.querySelectorAll("[data-resource-license]").forEach((button) => {
  button.addEventListener("click", () => {
    state.resourceLicense = button.dataset.resourceLicense;
    document.querySelectorAll("[data-resource-license]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderResourceRadar();
  });
});

document.querySelector("#resourceRadarGrid").addEventListener("click", async (event) => {
  const copyButton = event.target.closest(".copy-resource-card");
  if (copyButton) {
    await copyResourceCard(Number(copyButton.dataset.resourceCopy), copyButton);
    return;
  }
  const contributionButton = event.target.closest(".copy-resource-contribution");
  if (contributionButton) {
    await copyResourceContribution(Number(contributionButton.dataset.resourceContribution), contributionButton);
  }
});

document.querySelector("#feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const topic = toTrimmed(data.get("topic"));
  const message = toTrimmed(data.get("message"));
  if (!topic || !message || message.length < 2) {
    showToast("请补充反馈主题和建议。");
    return;
  }
  saveFeedback({
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    topic,
    message
  });
  form.reset();
  showToast("反馈已记录在本机；如需让我收到，请生成 GitHub Issue。", 2600);
});

document.querySelector("#exportFeedback").addEventListener("click", downloadFeedbackCsv);
document.querySelector("#copyFeedbackIssue").addEventListener("click", copyFeedbackIssueDraft);
document.querySelector("#openFeedbackIssue").addEventListener("click", openFeedbackIssue);

document.querySelector("#registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = toTrimmed(data.get("name"));
  const contact = toTrimmed(data.get("contact"));
  const profile = data.get("profile");
  const interest = data.get("interest");
  const message = toTrimmed(data.get("message"));
  if (!name || name.length < 2 || !contact || contact.length < 2 || !profile || !interest) {
    showToast("请完整填写必填项并按要求填写。");
    return;
  }
  if (!isValidContact(contact)) {
    showToast("联系方式格式不对：请输入微信号（6-24位）、手机号或完整邮箱。");
    return;
  }
  saveLead({
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    name,
    contact,
    profile,
    interest,
    message
  });
  form.reset();
  showToast("报名草稿已保存在本机；请复制草稿或写邮件联系我。", 2600);
  applyCurrentPage("game");
  renderCurrentPageContent("game");
  initSectionRevealAnimations();
});

document.querySelector("#copyLeadContact").addEventListener("click", copyLeadContactDraft);
document.querySelector("#openLeadEmail").addEventListener("click", openLeadEmailDraft);

document.querySelector("#clearLeads").addEventListener("click", () => {
  clearLeadsData({ confirmFirst: true });
});

document.querySelector("#exportLeads").addEventListener("click", downloadLeadsCsv);
document.querySelector("#clearFeedback").addEventListener("click", () => {
  clearFeedbackData({ confirmFirst: true });
});
document.querySelector("#exportAllData").addEventListener("click", exportAllLocalData);
document.querySelector("#clearAllData").addEventListener("click", clearAllLocalData);

document.querySelector("#contactList").addEventListener("click", async (event) => {
  const button = event.target.closest("#copyEmail");
  if (!button) return;
  await copyTextWithFallback(getOwnerEmail(), {
    button,
    successText: "邮箱已复制。",
    failureText: "复制失败，请长按邮箱文本手动复制。"
  });
});

document.querySelector("#sponsorNav").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorFloat").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorClose").addEventListener("click", closeSponsorModal);
document.querySelector("#sponsorModal").addEventListener("click", (event) => {
  if (event.target.id === "sponsorModal") closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModalWithResult(null);
});
document.querySelector("#sponsorCopyEmail").addEventListener("click", async () => {
  await copyTextWithFallback(getOwnerEmail(), {
    successText: "邮箱已复制，可联系赞助合作。",
    failureText: "复制失败，请手动识别弹窗中的邮箱。请在下一步联系。"
  });
});


async function loadAllData() {
  const dataFiles = {
    tracks: "assets/data/tracks.json",
    weeks: "assets/data/weeks.json",
    starterSteps: "assets/data/starter-steps.json",
    showcaseItems: "assets/data/showcase.json",
    resourceRadarItems: "assets/data/resource-radar.json",
    agentRoleCategories: "assets/data/agent-role-categories.json",
    agentRoles: "assets/data/agent-roles.json",
    monthlyFallbackUpdates: "assets/data/monthly-fallback.json",
    worldviewItems: "assets/data/worldview-items.json",
    worldviewRoadmap: "assets/data/worldview-roadmap.json",
    worldview30DayPlan: "assets/data/worldview-30day.json",
    dailyChallenges: "assets/data/daily-challenges.json",
    models: "assets/data/models.json",
    projects: "assets/data/projects.json",
    ranks: "assets/data/ranks.json",
    PROJECT_UNLOCK_XP: "assets/data/project-unlock-xp.json",
    templates: "assets/data/templates.json",
    ownerContact: null,  // loaded from site-config.json
    repoLinks: null,     // loaded from site-config.json
  };

  const entries = Object.entries(dataFiles).filter(([, file]) => file);
  const results = await Promise.all(
    entries.map(async ([key, file]) => {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return [key, data];
      } catch (err) {
        console.warn(`Failed to load ${file}:`, err.message);
        return [key, null];
      }
    })
  );

  // Assign loaded data to variables
  for (const [key, data] of results) {
    if (data === null) continue;
    switch (key) {
      case "tracks": tracks = data; break;
      case "weeks": weeks = data; break;
      case "starterSteps": starterSteps = data; break;
      case "showcaseItems": showcaseItems = data; break;
      case "resourceRadarItems": resourceRadarItems = data; break;
      case "agentRoleCategories": agentRoleCategories = data; break;
      case "agentRoles": agentRoles = data; break;
      case "monthlyFallbackUpdates": monthlyFallbackUpdates = data; break;
      case "worldviewItems": worldviewItems = data; break;
      case "worldviewRoadmap": worldviewRoadmap = data; break;
      case "worldview30DayPlan": worldview30DayPlan = data; break;
      case "dailyChallenges": dailyChallenges = data; break;
      case "models": models = data; break;
      case "projects": projects = data; break;
      case "ranks": ranks = data; break;
      case "PROJECT_UNLOCK_XP": PROJECT_UNLOCK_XP = data; break;
      case "templates": templates = data; break;
    }
  }

  // Load site config (owner + repo links)
  try {
    const res = await fetch("assets/data/site-config.json");
    if (res.ok) {
      const config = await res.json();
      if (config.owner) ownerContact = config.owner;
      if (config.repo) repoLinks = config.repo;
    }
  } catch (err) {
    console.warn("Failed to load site-config.json:", err.message);
  }
}

async function bootstrap() {
  await loadAllData();
  await loadMonthlyUpdates();
  if (!state.month || !monthlyUpdates.length) {
    state.month = "2026-07";
  }
  ensureMonthExists();
  renderStarter();
  renderTrack();
  renderWorldview();
  renderMonthOptions();
  renderMonthlyUpdate();
  renderResourceRadar();
  renderWeeks();
  renderModels();
  renderProjects();
  renderShowcase();
  renderAgentDailyChallenge();
  renderAgentRoles();
  renderTemplate();
  renderContact();
  renderFeedbackCount();
  refreshGame();
  const initialPage = getRequestedPageId();
  applyCurrentPage(initialPage, { silent: true });
  renderCurrentPageContent(initialPage);
  syncPageUrl(initialPage, { replace: true });
  initSectionRevealAnimations();
  updateActiveNav();
  resetPageViewport(initialPage);
  window.setTimeout(() => updateActiveNav(), 120);
}

/* ====== P0-PR2: Mobile Navigation Toggle ====== */
const navToggle = document.querySelector("#navToggle");
const mainNav = document.querySelector("#mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      mainNav.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function updateMobileTabBar() {
  const active = getRequestedPageId();
  document.querySelectorAll(".tabbar-item").forEach((item) => {
    if (item.dataset.page === active) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

/* ====== P1-PR3: Global Search ====== */
let searchIndex = [];

function buildSearchIndex() {
  searchIndex = [];
  const safe = (v) => safeText(v || "");

  Object.entries(tracks).forEach(([key, track]) => {
    searchIndex.push({ type: "路线", title: safe(track.title), desc: safe(track.summary), page: "map", keywords: key });
    (track.modules || []).forEach((mod) => {
      searchIndex.push({ type: "路线模块", title: safe(mod[0]), desc: safe(mod[1]), page: "map" });
    });
  });

  (projects || []).forEach((p) => {
    searchIndex.push({ type: "项目挑战", title: safe(p.title), desc: safe(p.desc), page: "projects" });
  });

  (agentRoles || []).forEach((r) => {
    searchIndex.push({ type: "Agent角色", title: safe(r.name), desc: safe(r.useFor), page: "agents" });
  });

  (resourceRadarItems || []).forEach((r) => {
    searchIndex.push({ type: "资源", title: safe(r.name), desc: safe(r.useFor), page: "resources" });
  });

  (models || []).forEach((m) => {
    searchIndex.push({ type: "模型", title: safe(m.name), desc: safe(m.desc), page: "models" });
  });

  (showcaseItems || []).forEach((s) => {
    searchIndex.push({ type: "作品样例", title: safe(s.title), desc: safe(s.text), page: "showcase" });
  });

  (weeks || []).forEach((w, i) => {
    searchIndex.push({ type: "周计划", title: safe(w[0]) + " " + safe(w[1]), desc: safe(w[2]), page: "weekly" });
  });

  (dailyChallenges || []).forEach((c) => {
    searchIndex.push({ type: "每日挑战", title: safe(c[0]), desc: safe(c[1]), page: "game" });
  });

  (worldviewItems || []).forEach((w) => {
    searchIndex.push({ type: "世界观", title: safe(w.title), desc: safe(w.text), page: "worldview" });
  });
}

function performSearch(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  const results = [];
  for (const item of searchIndex) {
    const title = (item.title || "").toLowerCase();
    const desc = (item.desc || "").toLowerCase();
    if (title.includes(q) || desc.includes(q)) {
      results.push({ ...item, _score: (title.includes(q) ? 10 : 0) + (desc.includes(q) ? 1 : 0) });
    }
  }
  results.sort((a, b) => b._score - a._score);
  return results.slice(0, 20);
}

function renderSearchResults(query) {
  const container = document.querySelector("#searchResults");
  if (!container) return;
  if (!query || query.trim().length < 1) {
    container.innerHTML = '<p class="search-empty">输入关键词搜索全站内容</p>';
    return;
  }
  const results = performSearch(query);
  if (results.length === 0) {
    container.innerHTML = '<p class="search-empty">没有找到相关内容，试试其他关键词</p>';
    return;
  }
  container.innerHTML = results.map((r) => `
    <a class="search-result-item" href="index.html?page=${safeText(r.page)}">
      <span class="result-type">${safeText(r.type)}</span>
      <div class="result-title">${safeText(r.title)}</div>
      <div class="result-desc">${safeText(r.desc).substring(0, 80)}</div>
    </a>
  `).join("");

  container.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      closeSearch();
    });
  });
}

function openSearch() {
  const overlay = document.querySelector("#searchOverlay");
  if (!overlay) return;
  overlay.classList.add("search-active");
  overlay.setAttribute("aria-hidden", "false");
  const input = document.querySelector("#searchInput");
  if (input) { input.value = ""; input.focus(); }
  renderSearchResults("");
}

function closeSearch() {
  const overlay = document.querySelector("#searchOverlay");
  if (!overlay) return;
  overlay.classList.remove("search-active");
  overlay.setAttribute("aria-hidden", "true");
}

const searchToggleBtn = document.querySelector("#searchToggle");
if (searchToggleBtn) searchToggleBtn.addEventListener("click", openSearch);
const searchToggleNavBtn = document.querySelector("#searchToggleNav");
if (searchToggleNavBtn) searchToggleNavBtn.addEventListener("click", openSearch);
const searchCloseBtn = document.querySelector("#searchClose");
if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
const searchInputEl = document.querySelector("#searchInput");
if (searchInputEl) searchInputEl.addEventListener("input", (e) => renderSearchResults(e.target.value));
const searchOverlayEl = document.querySelector("#searchOverlay");
if (searchOverlayEl) {
  searchOverlayEl.addEventListener("click", (e) => {
    if (e.target === searchOverlayEl) closeSearch();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});

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

/* ====== P2-PR7: AI Tutor ====== */
const aiTutorState = { messages: [], context: null, loading: false };

function openAiTutor(context = {}) {
  aiTutorState.context = context;
  aiTutorState.messages = [];
  let overlay = document.querySelector("#aiTutorOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "aiTutorOverlay";
    overlay.className = "ai-tutor-overlay";
    overlay.innerHTML = `
      <div class="ai-tutor-panel">
        <div class="ai-tutor-header">
          <strong>AI 学习辅导</strong>
          <button id="aiTutorClose" type="button" style="background:none;border:none;font-size:22px;cursor:pointer;color:#8a7f72;">×</button>
        </div>
        <div id="aiTutorMessages" class="ai-tutor-messages"></div>
        <div class="ai-tutor-input-area">
          <textarea id="aiTutorInput" rows="2" placeholder="输入你的问题…"></textarea>
          <button id="aiTutorSend" type="button">发送</button>
        </div>
      </div>
    `;
    document.body.append(overlay);
    overlay.querySelector("#aiTutorClose").addEventListener("click", closeAiTutor);
    overlay.querySelector("#aiTutorSend").addEventListener("click", sendAiTutorMessage);
    overlay.querySelector("#aiTutorInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAiTutorMessage(); }
    });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeAiTutor(); });
  }
  overlay.classList.add("tutor-active");
  const sysMsg = context.title
    ? `你好！我是你的 AI 学习辅导。当前上下文：${safeText(context.title)}。${safeText(context.desc || "")}。有什么想深入了解的吗？`
    : `你好！我是你的 AI 学习辅导。有什么 AI 学习相关的问题可以帮你？`;
  aiTutorState.messages.push({ role: "assistant", content: sysMsg });
  renderAiTutorMessages();
}

function closeAiTutor() {
  const overlay = document.querySelector("#aiTutorOverlay");
  if (overlay) overlay.classList.remove("tutor-active");
}

function renderAiTutorMessages() {
  const container = document.querySelector("#aiTutorMessages");
  if (!container) return;
  container.innerHTML = aiTutorState.messages.map((msg) => {
    const cls = msg.role === "user" ? "user" : "assistant";
    return `<div class="ai-tutor-msg ${cls}">${escapeHtml(msg.content)}</div>`;
  }).join("");
  container.scrollTop = container.scrollHeight;
}

async function sendAiTutorMessage() {
  const input = document.querySelector("#aiTutorInput");
  if (!input || !input.value.trim()) return;
  const userMsg = input.value.trim();
  aiTutorState.messages.push({ role: "user", content: userMsg });
  input.value = "";
  renderAiTutorMessages();

  const sendBtn = document.querySelector("#aiTutorSend");
  if (sendBtn) sendBtn.disabled = true;

  aiTutorState.messages.push({ role: "assistant", content: "" });
  const assistantIdx = aiTutorState.messages.length - 1;

  try {
    const contextPrompt = aiTutorState.context
      ? `你是一个 AI 学习教练。当前学习上下文：${safeText(aiTutorState.context.title)} - ${safeText(aiTutorState.context.desc || "")}。请基于此上下文回答问题。`
      : "你是一个 AI 学习教练，专注于帮助中文学习者学习 AI 知识。";

    const apiBaseUrl = localStorage.getItem("ai-tutor-api-url") || "";
    const apiKey = sessionStorage.getItem("ai-tutor-api-key") || "";

    if (!apiBaseUrl || !apiKey) {
      aiTutorState.messages[assistantIdx] = {
        role: "assistant",
        content: "AI 辅导功能需要配置 API。请在浏览器控制台执行：\n\nlocalStorage.setItem('ai-tutor-api-url', 'https://api.deepseek.com/v1');\nsessionStorage.setItem('ai-tutor-api-key', 'sk-xxx你的密钥xxx');\n\n🔒 API 密钥仅存储于当前浏览器会话（sessionStorage），关闭标签页后自动清除，不会持久化到磁盘。\n支持任何兼容 OpenAI 格式的 API（DeepSeek、通义千问等）。"
      };
      renderAiTutorMessages();
      return;
    }

    const messages = [{ role: "system", content: contextPrompt }, ...aiTutorState.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }))];

    const res = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: localStorage.getItem("ai-tutor-model") || "deepseek-chat", messages, stream: true })
    });

    if (!res.ok) throw new Error(`API 返回 ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") break;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content || "";
          aiTutorState.messages[assistantIdx].content += delta;
          renderAiTutorMessages();
        } catch {}
      }
    }
  } catch (err) {
    aiTutorState.messages[assistantIdx] = {
      role: "assistant",
      content: `抱歉，请求出错了：${err.message}\n\n请检查 API 配置是否正确。你也可以先参考站内内容自学，等配好 API 后再来问我。`
    };
    renderAiTutorMessages();
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ====== P2-PR5: Code Editor Embed ====== */
function createCodeEditorEmbed(projectTitle, level) {
  const templates = {
    "入门": "https://stackblitz.com/edit/python-repl?embed=1&file=main.py",
    "进阶": "https://stackblitz.com/edit/node-starter?embed=1&file=index.js",
    "高阶": "https://stackblitz.com/edit/react-ts?embed=1&file=App.tsx"
  };
  const url = templates[level] || templates["入门"];
  return `
    <button class="code-editor-toggle" onclick="toggleCodeEditor(this, '${url}', '${safeText(projectTitle)}')">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
      在线练习（StackBlitz）
    </button>
  `;
}

function toggleCodeEditor(btn, url, title) {
  const existing = btn.nextElementSibling;
  if (existing && existing.classList.contains("code-editor-embed")) {
    existing.remove();
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>在线练习（StackBlitz）`;
    return;
  }
  const container = document.createElement("div");
  container.className = "code-editor-embed";
  container.innerHTML = `<iframe src="${url}" title="${title} 在线练习" loading="lazy"></iframe>`;
  btn.after(container);
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>收起编辑器`;
}

/* ====== P1-PR4: Cloud Sync (Supabase) ====== */
const syncState = { enabled: false, lastSync: null, supabase: null };

function initCloudSync() {
  const supabaseUrl = localStorage.getItem("ai-sync-supabase-url");
  const supabaseKey = localStorage.getItem("ai-sync-supabase-key");
  if (!supabaseUrl || !supabaseKey) return;

  syncState.enabled = true;
  syncState.supabase = { url: supabaseUrl, key: supabaseKey };
  console.log("[Cloud Sync] 已启用 Supabase 同步");

  const deviceId = getStoredString("ai-sync-device-id", "");
  if (!deviceId) {
    const newId = "dev-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    setStoredValue("ai-sync-device-id", newId);
  }

  setInterval(autoSync, 30000);
}

async function autoSync() {
  if (!syncState.enabled) return;
  const deviceId = getStoredString("ai-sync-device-id", "");
  if (!deviceId) return;

  const allData = exportAllLocalData();
  try {
    await fetch(`${syncState.supabase.url}/rest/v1/learning_progress?device_id=eq.${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: syncState.supabase.key,
        Authorization: `Bearer ${syncState.supabase.key}`,
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        device_id: deviceId,
        data: allData,
        updated_at: new Date().toISOString()
      })
    });
    syncState.lastSync = new Date().toLocaleString("zh-CN", { hour12: false });
  } catch (err) {
    console.warn("[Cloud Sync] 同步失败:", err.message);
  }
}

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

/* ====== Model Decision Tree ====== */
function renderModelDecisionTree() {
  const container = document.querySelector("#modelDecisionTree");
  if (!container) return;
  container.innerHTML = `
    <div class="model-decision-tree">
      <h4>不知道选哪个模型？告诉我你的需求</h4>
      <button class="decision-option" data-need="coding">我要写代码 / 编程</button>
      <button class="decision-option" data-need="longtext">我要处理长文档 / 长文本</button>
      <button class="decision-option" data-need="video">我要生成视频</button>
      <button class="decision-option" data-need="chinese">我要中文创作 / 写作</button>
      <button class="decision-option" data-need="agent">我要搭建 Agent 工作流</button>
      <div id="decisionResult"></div>
    </div>
  `;
  const recommendations = {
    coding: "推荐 <strong>Claude 3.5 Sonnet</strong>（编程能力最强）或 <strong>DeepSeek Coder</strong>（国内免费可用）。两者都支持长上下文编程任务。",
    longtext: "推荐 <strong>Gemini 1.5 Pro</strong>（200 万 token 上下文窗口）或 <strong>Claude 3.5 Sonnet</strong>（20 万 token）。国内可选 <strong>Kimi</strong>（长文本处理优秀）。",
    video: "推荐 <strong>可灵 / 即梦 / 通义万相</strong>（国内视频生成）。国际可选 <strong>Runway Gen-3</strong> 或 <strong>Sora</strong>（如有访问权限）。",
    chinese: "推荐 <strong>DeepSeek</strong>（中文理解优秀且免费）或 <strong>通义千问</strong>（阿里生态集成好）。国际模型中 <strong>Claude</strong> 中文表现也不错。",
    agent: "推荐 <strong>GPT-4o</strong>（Agent 生态最成熟）或 <strong>Claude 3.5 Sonnet</strong>（工具调用能力强）。国内可选 <strong>DeepSeek</strong>（性价比高）。"
  };
  container.querySelectorAll(".decision-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const need = btn.dataset.need;
      const result = document.querySelector("#decisionResult");
      if (result) {
        result.className = "decision-result";
        result.innerHTML = recommendations[need] || "请选择一个选项。";
      }
      trackEvent("model_decision", { need });
    });
  });
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

/* ====== Self-check Checklist ====== */
function renderSelfCheck(trackId) {
  const track = tracks[trackId];
  if (!track || !track.selfCheck) return "";
  return `
    <div class="self-check">
      <h4>学完后的自我检查</h4>
      <p class="muted" style="margin-bottom:10px;">确认你能做到以下事项，再进入下一个模块。</p>
      ${track.selfCheck.map((item, i) => `
        <label class="self-check-item">
          <input type="checkbox" id="selfcheck-${trackId}-${i}" />
          <span>${safeText(item)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

/* ====== Bootstrap ====== */
async function bootstrap() {
  showLoadingSkeleton();
  await loadAllData();
  await loadMonthlyUpdates();
  hideLoadingSkeleton();
  if (!state.month || !monthlyUpdates.length) {
    state.month = "2026-07";
  }
  ensureMonthExists();
  buildSearchIndex();
  renderStarter();
  renderTrack();
  renderWorldview();
  renderMonthOptions();
  renderMonthlyUpdate();
  renderResourceRadar();
  renderWeeks();
  renderModels();
  renderModelDecisionTree();
  renderProjects();
  renderShowcase();
  renderAgentDailyChallenge();
  renderAgentRoles();
  renderTemplate();
  renderContact();
  renderFeedbackCount();
  refreshGame();
  initCloudSync();
  const initialPage = getRequestedPageId();
  applyCurrentPage(initialPage, { silent: true });
  renderCurrentPageContent(initialPage);
  syncPageUrl(initialPage, { replace: true });
  initSectionRevealAnimations();
  updateActiveNav();
  updateMobileTabBar();
  resetPageViewport(initialPage);
  window.setTimeout(() => { updateActiveNav(); updateMobileTabBar(); }, 120);
}

bootstrap();
