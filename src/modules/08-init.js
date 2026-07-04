"use strict";
/* ====== Share Image Generator ====== */
async function generateShareImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  const xp = getXp();
  const rank = getRank();

  /* L5: Level-based color scheme */
  const levelColors = (xp >= 2500) ? { top: "#d8a34a", mid: "#b8860b", bot: "#8b6914" }
    : (xp >= 500) ? { top: "#8f2f2a", mid: "#64221f", bot: "#3d2817" }
    : { top: "#5c3a1e", mid: "#3d2817", bot: "#241710" };

  /* Background */
  const bg = ctx.createLinearGradient(0, 0, 0, 800);
  bg.addColorStop(0, levelColors.top);
  bg.addColorStop(0.4, levelColors.mid);
  bg.addColorStop(1, levelColors.bot);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 800);

  /* Decorative accent */
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.arc(520, 100, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 700, 150, 0, Math.PI * 2);
  ctx.fill();

  /* Title */
  ctx.fillStyle = "#fffaf2";
  ctx.font = "bold 32px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AI 原生能力自学站", 300, 70);

  /* Subtitle */
  ctx.font = "16px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillStyle = "rgba(255,250,242,0.7)";
  ctx.fillText("ai.mynaxis.com", 300, 100);

  /* Divider */
  ctx.strokeStyle = "rgba(255,250,242,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 120);
  ctx.lineTo(540, 120);
  ctx.stroke();

  /* Stats card */
  ctx.fillStyle = "rgba(255,250,242,0.1)";
  ctx.beginPath();
  roundRect(ctx, 40, 140, 520, 340, 16);
  ctx.fill();

  const nextRank = getNextRank();
  const progress = nextRank ? Math.min(100, Math.round(((xp - (nextRank.minXp || 0)) / ((nextRank.minXp || 1) - (rank.minXp || 0))) * 100)) : 100;

  /* Rank */
  ctx.fillStyle = "#fffaf2";
  ctx.font = "bold 22px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`🏆 ${rank.name}`, 300, 185);

  /* XP */
  ctx.font = "bold 48px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText(`${xp} XP`, 300, 245);

  /* Progress bar */
  ctx.fillStyle = "rgba(255,250,242,0.15)";
  ctx.fillRect(80, 270, 440, 12);
  ctx.fillStyle = "#d8a34a";
  ctx.fillRect(80, 270, 440 * (progress / 100), 12);

  ctx.font = "13px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillStyle = "rgba(255,250,242,0.6)";
  ctx.fillText(`距 ${nextRank ? nextRank.name : "MAX"} 还需 ${nextRank ? nextRank.minXp - xp : 0} XP`, 300, 305);

  /* Streak */
  ctx.font = "18px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillStyle = "#fffaf2";
  ctx.fillText(`🔥 连续学习 ${state.streak} 天`, 300, 345);

  /* Stats row */
  const weeksCompleted = state.doneWeeks.size;
  const badges = achievements.filter(a => a.test()).length;
  ctx.font = "15px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillStyle = "rgba(255,250,242,0.8)";
  ctx.fillText(`✅ ${weeksCompleted} 周 · 🏅 ${badges} 徽章 · 📅 ${state.lastCheckIn || "未开始"}`, 300, 385);

  /* Badge showcase */
  const earned = achievements.filter(a => a.test());
  ctx.fillStyle = "rgba(255,250,242,0.08)";
  ctx.beginPath();
  const badgeCount = Math.min(earned.length, 8);
  roundRect(ctx, 40, 420, 520, badgeCount * 40 + 16, 16);
  ctx.fill();

  ctx.font = "14px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.textAlign = "left";
  earned.slice(0, 8).forEach((a, i) => {
    const y = 450 + i * 40;
    ctx.fillStyle = "#fffaf2";
    ctx.fillText(`${a.test() ? "🏅" : "⬜"} ${a.title} — ${a.desc}`, 70, y);
  });

  /* Footer */
  ctx.fillStyle = "rgba(255,250,242,0.5)";
  ctx.font = "13px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("扫码加入 ai.mynaxis.com 一起学 AI", 300, 700);

  /* S2: UTM-tracked URL */
  const inviteLink = getInviteLink() + "&utm_source=share&utm_medium=image";
  ctx.fillStyle = "rgba(255,250,242,0.9)";
  ctx.font = "bold 16px 'PingFang SC','Microsoft YaHei',sans-serif";
  ctx.fillText("ai.mynaxis.com", 300, 730);

  /* R2: Real QR code via API */
  try {
    const qrData = encodeURIComponent(inviteLink);
    const qrImg = await loadQRCode(qrData, 120);
    if (qrImg) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(240, 740, 120, 120);
      ctx.drawImage(qrImg, 240, 740, 120, 120);
    } else {
      /* Fallback text if QR fails */
      ctx.fillStyle = "#fff";
      ctx.fillRect(240, 740, 120, 40);
      ctx.fillStyle = "#3d2817";
      ctx.font = "11px 'PingFang SC','Microsoft YaHei',sans-serif";
      ctx.fillText("扫码访问", 300, 765);
    }
  } catch (e) {
    /* Silent fallback */
    ctx.fillStyle = "#fff";
    ctx.fillRect(240, 740, 120, 40);
    ctx.fillStyle = "#3d2817";
    ctx.font = "11px 'PingFang SC','Microsoft YaHei',sans-serif";
    ctx.fillText("扫码访问", 300, 765);
  }

  /* Convert to image and download */
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-learning-${formatReportDate()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    /* P2-10: Share XP reward */
    state.bonusXp += 10;
    persistGameState();
    refreshGame();
    showToast("📤 分享图已生成！发朋友圈/小红书，让更多人加入。获得 +10 XP 奖励！", 2500);
    if (typeof gtag === "function") gtag("event", "share_image", { xp, streak: state.streak, share_url: inviteLink });
  }, "image/png");
}

/* R2: QR code image loader */
function loadQRCode(data, size) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timeout = setTimeout(() => { resolve(null); }, 4000);
    img.onload = () => { clearTimeout(timeout); resolve(img); };
    img.onerror = () => { clearTimeout(timeout); resolve(null); };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
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
  processInviteParam();
  const initialPage = getRequestedPageId();
  applyCurrentPage(initialPage, { silent: true });
  renderCurrentPageContent(initialPage);
  syncPageUrl(initialPage, { replace: true });
  initSectionRevealAnimations();
  updateActiveNav();
  updateMobileTabBar();
  resetPageViewport(initialPage);
  window.setTimeout(() => { updateActiveNav(); updateMobileTabBar(); }, 120);
  // Show onboarding for first-time visitors
  showOnboarding();
  renderKnowledgeGraph();
}

/* ====== Onboarding (新手引导) ====== */
const ONBOARDING_KEY = "ai-learning-onboarding-done";

function showOnboarding() {
  if (localStorage.getItem(ONBOARDING_KEY)) return;
  const steps = [
    {
      title: "欢迎来到 AI 原生能力自学站",
      desc: "这里是你从零到一掌握 AI 学习能力的起点。让我们花 30 秒了解站点的核心功能。",
      icon: "🏠"
    },
    {
      title: "五条学习路径",
      desc: "从 Prompt 新手到 Agent 构建者，每条路线有周计划、实操步骤和自检清单。点击「学习路径」开始探索。",
      icon: "🗺️"
    },
    {
      title: "游戏化成长系统",
      desc: "签到获得 XP、完成挑战解锁徽章、连续学习获得连击加成。你的每一步都有反馈。",
      icon: "🏆"
    },
    {
      title: "开始你的第一周",
      desc: "点击下方「开始学习」进入新手路线，完成第一个模块即可获得 60 XP。准备好了吗？",
      icon: "🚀",
      action: "start"
    }
  ];

  let currentStep = 0;

  const overlay = document.createElement("div");
  overlay.className = "onboarding-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "新手引导");
  overlay.innerHTML = `
    <div class="onboarding-panel">
      <div class="onboarding-progress">
        ${steps.map((_, i) => `<div class="onboarding-dot ${i === 0 ? "active" : ""}" data-step="${i}"></div>`).join("")}
      </div>
      <div class="onboarding-step" id="onboardingStepContent"></div>
      <div class="onboarding-actions">
        <button class="ghost-btn small" id="onboardingSkip">跳过引导</button>
        <button class="primary-btn" id="onboardingNext">下一步</button>
      </div>
    </div>
  `;
  document.body.append(overlay);

  function renderStep(index) {
    const step = steps[index];
    const content = overlay.querySelector("#onboardingStepContent");
    content.innerHTML = `
      <div class="onboarding-icon">${step.icon}</div>
      <h3>${safeText(step.title)}</h3>
      <p>${safeText(step.desc)}</p>
    `;
    overlay.querySelectorAll(".onboarding-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i <= index);
    });
    const nextBtn = overlay.querySelector("#onboardingNext");
    if (step.action === "start" || index === steps.length - 1) {
      nextBtn.textContent = "开始学习";
    } else {
      nextBtn.textContent = "下一步";
    }
  }

  renderStep(0);

  overlay.querySelector("#onboardingNext").addEventListener("click", () => {
    currentStep++;
    if (currentStep >= steps.length) {
      closeOnboarding(true);
      return;
    }
    renderStep(currentStep);
  });

  overlay.querySelector("#onboardingSkip").addEventListener("click", () => {
    closeOnboarding(true);
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOnboarding(true);
  });

  function closeOnboarding(completed) {
    overlay.remove();
    localStorage.setItem(ONBOARDING_KEY, "1");
    if (completed) {
      applyCurrentPage("starter");
      renderCurrentPageContent("starter");
      resetPageViewport("starter");
    }
  }
}

bootstrap();
