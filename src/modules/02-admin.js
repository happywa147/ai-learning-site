"use strict";
/* ====== Invite System ====== */
function generateInviteCode() {
  const existing = localStorage.getItem("ai-invite-code");
  if (existing) return existing;
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  localStorage.setItem("ai-invite-code", code);
  return code;
}

function getInviteLink() {
  const code = generateInviteCode();
  const base = location.origin + location.pathname;
  return `${base}?invite=${code}&ref=${code}&utm_source=invite&utm_medium=link&utm_campaign=referral`;
}

function processInviteParam() {
  const params = new URLSearchParams(location.search);
  const inviteCode = params.get("invite");
  if (inviteCode && !localStorage.getItem("ai-invited-by")) {
    localStorage.setItem("ai-invited-by", inviteCode);
    showToast("🎁 你通过邀请链接加入！完成首次签到可获得 +50 XP 奖励", 3000);
  }
}

function renderInviteSection() {
  const container = document.querySelector("#inviteSection");
  if (!container) return;
  const inviteCount = parseInt(localStorage.getItem("ai-invite-count") || "0", 10);
  const link = getInviteLink();
  /* L3: Invite leaderboard / progress tracker */
  const milestones = [
    { count: 1, badge: "🔰", label: "引路人" },
    { count: 3, badge: "🌟", label: "传播者" },
    { count: 5, badge: "🔥", label: "布道师" },
    { count: 10, badge: "👑", label: "意见领袖" },
    { count: 20, badge: "🏆", label: "社群之光" },
  ];
  const currentMilestone = milestones.filter(m => inviteCount >= m.count).pop();
  const nextMilestone = milestones.find(m => inviteCount < m.count);
  const progressPct = nextMilestone ? Math.min(100, Math.round(inviteCount / nextMilestone.count * 100)) : 100;
  container.innerHTML = `
    <div class="invite-box" style="margin-top:16px;padding:16px;background:rgba(143,47,42,0.04);border-radius:12px;border:1px solid rgba(143,47,42,0.1);">
      <h4 style="margin-bottom:8px;font-size:0.95rem;">🎁 邀请好友一起学</h4>
      <p style="font-size:0.82rem;color:var(--muted);margin-bottom:10px;">
        邀请好友加入，双方各得 <strong style="color:var(--jujube);">+50 XP</strong>！已邀请 <strong style="color:var(--jujube);">${inviteCount}</strong> 人
        ${currentMilestone ? ` — ${currentMilestone.badge} ${currentMilestone.label}` : ""}
      </p>
      ${nextMilestone ? `
        <div style="margin-bottom:10px;font-size:0.75rem;color:var(--muted);">
          邀请 ${nextMilestone.count} 人解锁 ${nextMilestone.badge}「${nextMilestone.label}」称号
          <div style="height:6px;border-radius:3px;background:rgba(143,47,42,0.08);margin-top:4px;overflow:hidden;">
            <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg,var(--earth),var(--jujube));border-radius:3px;transition:width 0.5s;"></div>
          </div>
          <span style="float:right;margin-top:2px;">${inviteCount}/${nextMilestone.count}</span>
        </div>
      ` : '<div style="margin-bottom:10px;font-size:0.78rem;color:var(--earth);">🏆 已达最高邀请称号！</div>'}
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <input type="text" readonly value="${escapeHtml(link)}" style="flex:1;min-width:140px;padding:6px 10px;font-size:0.78rem;border:1px solid var(--line);border-radius:6px;background:var(--surface);" onclick="this.select()" />
        <button onclick="copyInviteLink(this)" style="padding:6px 14px;font-size:0.82rem;background:var(--jujube);color:#fff;border:none;border-radius:6px;cursor:pointer;">复制链接</button>
      </div>
    </div>
  `;
}

async function copyInviteLink(btn) {
  try {
    await navigator.clipboard.writeText(getInviteLink());
    const orig = btn.textContent;
    btn.textContent = "已复制！";
    btn.style.background = "var(--plant)";
    setTimeout(() => { btn.textContent = orig; btn.style.background = "var(--jujube)"; }, 1500);
  } catch (e) {
    showToast("复制失败，请手动复制链接");
  }
}

/* ====== XP Shop ====== */
const xpShop = [
  { id: "avatar-gold", name: "金色头像框", cost: 200, icon: "🟡", desc: "在个人档案中显示金色边框" },
  { id: "avatar-diamond", name: "钻石头像框", cost: 500, icon: "💎", desc: "最稀有的头像框，彰显坚持" },
  { id: "badge-custom", name: "自定义徽章名", cost: 300, icon: "✏️", desc: "给一枚徽章起你喜欢的名字" },
  { id: "role-exclusive", name: "神秘角色卡", cost: 400, icon: "🔮", desc: "解锁一张专属隐藏角色卡" },
  { id: "theme-night", name: "暗夜主题", cost: 150, icon: "🌙", desc: "解锁暗色模式皮肤" },
];

function getXpShopPurchases() {
  try {
    return JSON.parse(localStorage.getItem("ai-xp-shop") || "[]");
  } catch (e) { return []; }
}

function purchaseXpItem(itemId) {
  const item = xpShop.find(i => i.id === itemId);
  if (!item) return;
  const xp = getXp();
  if (xp < item.cost) {
    showToast(`XP 不足！需要 ${item.cost} XP，当前 ${xp} XP`, 2000);
    return;
  }
  const purchases = getXpShopPurchases();
  if (purchases.includes(itemId)) {
    showToast("你已经拥有这个物品了", 1500);
    return;
  }
  state.bonusXp -= item.cost;
  purchases.push(itemId);
  localStorage.setItem("ai-xp-shop", JSON.stringify(purchases));
  persistGameState();
  showToast(`🎉 成功解锁「${item.name}」！消耗 ${item.cost} XP`, 2000);
  /* S3: Purchase animation — flash purchased card */
  const card = document.querySelector(`[data-xp-item="${itemId}"]`);
  if (card) { card.classList.add("xp-purchased"); setTimeout(() => card.classList.remove("xp-purchased"), 800); }
  refreshGame();
}

function renderXpShop() {
  const container = document.querySelector("#xpShopSection");
  if (!container) return;
  const xp = getXp();
  const purchases = getXpShopPurchases();
  container.innerHTML = `
    <div style="margin-top:20px;">
      <h4 style="margin-bottom:12px;font-size:0.95rem;">🏪 XP 商店 <span style="font-size:0.78rem;color:var(--muted);">余额 ${xp} XP</span></h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;">
        ${xpShop.map(item => {
          const owned = purchases.includes(item.id);
          const canBuy = xp >= item.cost && !owned;
          return `
            <div data-xp-item="${item.id}" style="padding:12px;border-radius:10px;background:${owned?'rgba(95,127,82,0.08)':'var(--surface)'};border:1px solid ${owned?'rgba(95,127,82,0.3)':'var(--line)'};text-align:center;transition:transform 0.3s,box-shadow 0.3s;">
              <div style="font-size:1.6rem;">${item.icon}</div>
              <div style="font-weight:600;font-size:0.85rem;margin:6px 0;">${escapeHtml(item.name)}</div>
              <div style="font-size:0.72rem;color:var(--muted);margin-bottom:8px;">${escapeHtml(item.desc)}</div>
              ${owned
                ? '<span style="font-size:0.78rem;color:var(--plant);">✅ 已拥有</span>'
                : `<button onclick="purchaseXpItem('${item.id}')" style="padding:4px 12px;font-size:0.78rem;background:${canBuy?'var(--earth)':'#ccc'};color:#fff;border:none;border-radius:6px;cursor:${canBuy?'pointer':'not-allowed'};" ${canBuy?'':'disabled'}>${item.cost} XP</button>`
              }
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
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

