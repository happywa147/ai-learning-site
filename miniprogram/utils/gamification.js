/**
 * gamification.js - 游戏化系统工具
 * 签到/XP/等级/徽章/每日任务
 */

const STORAGE_KEYS = {
  XP: "ai-xp",
  STREAK: "ai-streak",
  LAST_CHECKIN: "ai-last-checkin",
  BADGES: "ai-badges",
  LEVEL: "ai-level",
  DAILY_TASKS: "ai-daily-tasks",
  MONTH_DATA: "ai-month-data",
};

// 等级配置
const RANKS = [
  { name: "AI 素人", minXP: 0 },
  { name: "AI 见习生", minXP: 100 },
  { name: "AI 学徒", minXP: 300 },
  { name: "AI 实践者", minXP: 600 },
  { name: "AI 达人", minXP: 1000 },
  { name: "AI 专家", minXP: 1500 },
  { name: "AI 原生者", minXP: 2500 },
];

// 徽章定义
const BADGE_DEFS = [
  { id: "first-checkin", name: "初次报到", desc: "完成首次签到", tier: "bronze" },
  { id: "3-day-streak", name: "三天打鱼", desc: "连续签到 3 天", tier: "bronze" },
  { id: "7-day-streak", name: "一周坚持", desc: "连续签到 7 天", tier: "silver" },
  { id: "30-day-streak", name: "月度达人", desc: "连续签到 30 天", tier: "gold" },
  { id: "first-track", name: "路线起步", desc: "开始第一条学习路线", tier: "bronze" },
  { id: "complete-track", name: "路线通关", desc: "完成一条学习路线", tier: "gold" },
  { id: "first-share", name: "分享达人", desc: "首次分享学习卡片", tier: "bronze" },
  { id: "invite-friend", name: " propagation 大使", desc: "成功邀请一位朋友", tier: "silver" },
];

// 获取今日日期字符串（本地时区）
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 获取昨天日期字符串
function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 加载游戏状态
function loadGameState(app) {
  const gd = app.globalData;
  gd.xp = parseInt(wx.getStorageSync(STORAGE_KEYS.XP) || "0", 10);
  gd.streak = parseInt(wx.getStorageSync(STORAGE_KEYS.STREAK) || "0", 10);
  gd.lastCheckIn = wx.getStorageSync(STORAGE_KEYS.LAST_CHECKIN) || "";
  gd.badges = wx.getStorageSync(STORAGE_KEYS.BADGES) || [];
  gd.level = parseInt(wx.getStorageSync(STORAGE_KEYS.LEVEL) || "1", 10);
  gd.monthData = wx.getStorageSync(STORAGE_KEYS.MONTH_DATA) || ensureMonthExists();
}

// 保存游戏状态
function persistGameState(app) {
  const gd = app.globalData;
  wx.setStorageSync(STORAGE_KEYS.XP, gd.xp);
  wx.setStorageSync(STORAGE_KEYS.STREAK, gd.streak);
  wx.setStorageSync(STORAGE_KEYS.LAST_CHECKIN, gd.lastCheckIn);
  wx.setStorageSync(STORAGE_KEYS.BADGES, gd.badges);
  wx.setStorageSync(STORAGE_KEYS.LEVEL, gd.level);
  wx.setStorageSync(STORAGE_KEYS.MONTH_DATA, gd.monthData);
}

// 签到
function checkIn(app) {
  const today = getTodayKey();
  if (app.globalData.lastCheckIn === today) {
    return { success: false, message: "今日已签到" };
  }

  const yesterday = getYesterdayKey();
  let streak = app.globalData.streak;

  if (app.globalData.lastCheckIn === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  // 计算 multiplier
  let multiplier = 1;
  if (streak >= 100) multiplier = 3;
  else if (streak >= 30) multiplier = 2;
  else if (streak >= 7) multiplier = 1.5;

  const baseXP = 10;
  const xpGained = Math.round(baseXP * multiplier);

  app.globalData.streak = streak;
  app.globalData.lastCheckIn = today;
  app.globalData.xp += xpGained;

  // 更新等级
  updateLevel(app);

  // 检查徽章
  checkBadges(app);

  persistGameState(app);

  return {
    success: true,
    xpGained,
    streak,
    multiplier,
    totalXP: app.globalData.xp,
  };
}

// 更新等级
function updateLevel(app) {
  const xp = app.globalData.xp;
  let newLevel = 1;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      newLevel = i + 1;
      break;
    }
  }
  app.globalData.level = newLevel;
}

// 获取等级信息
function getRank(level) {
  return RANKS[level - 1] || RANKS[0];
}

// 获取下一等级
function getNextRank(level) {
  return RANKS[level] || null;
}

// 获取 XP
function getXP(app) {
  return app.globalData.xp;
}

// 添加 XP
function addXP(app, amount, reason) {
  app.globalData.xp += amount;
  updateLevel(app);
  persistGameState(app);
  return app.globalData.xp;
}

// 检查徽章
function checkBadges(app) {
  const badges = app.globalData.badges;
  const streak = app.globalData.streak;

  // 首次签到
  if (!badges.find((b) => b.id === "first-checkin")) {
    badges.push({ ...BADGE_DEFS[0], earnedAt: getTodayKey() });
  }

  // 连续签到徽章
  if (streak >= 3 && !badges.find((b) => b.id === "3-day-streak")) {
    badges.push({ ...BADGE_DEFS[1], earnedAt: getTodayKey() });
  }
  if (streak >= 7 && !badges.find((b) => b.id === "7-day-streak")) {
    badges.push({ ...BADGE_DEFS[2], earnedAt: getTodayKey() });
  }
  if (streak >= 30 && !badges.find((b) => b.id === "30-day-streak")) {
    badges.push({ ...BADGE_DEFS[3], earnedAt: getTodayKey() });
  }
}

// 确保月份数据存在
function ensureMonthExists() {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const stored = wx.getStorageSync(STORAGE_KEYS.MONTH_DATA);
  if (stored && stored[key]) return stored;

  const data = stored || {};
  data[key] = {
    checkIns: {},
    modulesCompleted: {},
    totalXPEarned: 0,
  };
  return data;
}

// 每日任务
const DAILY_TASKS = [
  { id: "read-resource", label: "📖 阅读一篇资源文章", xp: 10 },
  { id: "try-prompt", label: "✍️ 尝试一个新 Prompt", xp: 10 },
  { id: "share-card", label: "📤 分享学习卡片", xp: 10 },
  { id: "check-model", label: "🔍 了解一个新模型", xp: 10 },
  { id: "explore-agent", label: "🤖 浏览 Agent 角色卡", xp: 10 },
];

function getTodayTasks(app) {
  const today = getTodayKey();
  const stored = wx.getStorageSync("ai-daily-tasks");
  if (stored && stored.date === today) {
    return stored.tasks;
  }
  // 随机选 3 个
  const shuffled = [...DAILY_TASKS].sort(() => Math.random() - 0.5);
  const tasks = shuffled.slice(0, 3).map((t) => ({ ...t, done: false }));
  wx.setStorageSync("ai-daily-tasks", { date: today, tasks });
  return tasks;
}

function completeTask(app, taskId) {
  const today = getTodayKey();
  const stored = wx.getStorageSync("ai-daily-tasks");
  if (!stored || stored.date !== today) return false;

  const task = stored.tasks.find((t) => t.id === taskId && !t.done);
  if (!task) return false;

  task.done = true;
  wx.setStorageSync("ai-daily-tasks", stored);
  addXP(app, task.xp, task.label);
  persistGameState(app);
  return true;
}

module.exports = {
  STORAGE_KEYS,
  RANKS,
  BADGE_DEFS,
  getTodayKey,
  getYesterdayKey,
  loadGameState,
  persistGameState,
  checkIn,
  updateLevel,
  getRank,
  getNextRank,
  getXP,
  addXP,
  checkBadges,
  ensureMonthExists,
  getTodayTasks,
  completeTask,
};
