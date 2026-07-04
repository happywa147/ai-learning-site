"use strict";
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
  "register",
  "admin"
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
  register: "注册学习与联系",
  admin: "管理仪表盘"
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
    },
    admin() {
      renderAdminDashboard();
    }
  };

  const renderer = renderMap[targetPage] || renderMap.home;
  renderer();
}

