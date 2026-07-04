"use strict";
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

  /* Invite reward: if this is a new user's first check-in and they were invited */
  const inviterId = localStorage.getItem("ai-invited-by");
  if (inviterId && !localStorage.getItem("ai-invite-rewarded")) {
    state.bonusXp += 50;
    localStorage.setItem("ai-invite-rewarded", "1");
    persistGameState();
    refreshGame();
    showToast("🎉 邀请奖励 +50 XP！你的邀请人也获得了 50 XP。", 2500);
    if (typeof gtag === "function") gtag("event", "invite_reward", { inviter: inviterId });
  }
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

