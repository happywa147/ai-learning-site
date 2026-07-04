// pages/profile/profile.js - 个人中心
const { RANKS, getRank, getNextRank, getTodayKey, BADGE_DEFS } = require("../../utils/gamification");

const app = getApp();

Page({
  data: {
    xp: 0,
    level: 1,
    rankName: "",
    nextRankName: "",
    progressPercent: 0,
    currentRankXP: 0,
    nextRankXP: 0,
    xpToNext: 0,
    streak: 0,
    badges: [],
    monthCheckInDays: [],
    calendarDays: [],
    calendarTitle: "",
    inviteCode: "",
    isAdmin: false,
    userInfo: null,
    hasUserInfo: false,
  },

  onLoad() {
    this.generateInviteCode();
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    const gd = app.globalData;
    const level = gd.level;
    const rank = getRank(level);
    const nextRank = getNextRank(level);

    let progressPercent = 100;
    let nextRankXP = rank.minXP;
    let xpToNext = 0;

    if (nextRank) {
      nextRankXP = nextRank.minXP;
      xpToNext = nextRank.minXP - gd.xp;
      const range = nextRank.minXP - rank.minXP;
      progressPercent = range > 0 ? Math.round(((gd.xp - rank.minXP) / range) * 100) : 100;
    }

    // 构建徽章列表（已获得 + 未获得）
    const earnedBadges = gd.badges || [];
    const allBadges = BADGE_DEFS.map((def) => {
      const earned = earnedBadges.find((b) => b.id === def.id);
      return {
        ...def,
        earned: !!earned,
        earnedAt: earned ? earned.earnedAt : "",
      };
    });

    // 构建签到日历
    const calendar = this.buildCalendar();

    // 管理员判定：等级 >= 5（AI 达人及以上）
    const isAdmin = level >= 5;

    this.setData({
      xp: gd.xp,
      level,
      rankName: rank.name,
      nextRankName: nextRank ? nextRank.name : "",
      progressPercent: Math.min(Math.max(progressPercent, 0), 100),
      currentRankXP: rank.minXP,
      nextRankXP,
      xpToNext,
      streak: gd.streak,
      badges: allBadges,
      calendarDays: calendar.days,
      calendarTitle: calendar.title,
      monthCheckInDays: calendar.checkedDays,
      isAdmin,
    });
  },

  buildCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayWeek = new Date(year, month, 1).getDay();

    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthData = app.globalData.monthData || {};
    const monthInfo = monthData[monthKey] || { checkIns: {} };
    const lastCheckIn = app.globalData.lastCheckIn;

    const days = [];
    // 填充月初空白
    for (let i = 0; i < firstDayWeek; i++) {
      days.push({ empty: true });
    }
    let checkedDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${monthKey}-${String(d).padStart(2, "0")}`;
      const isCheckedIn = !!(monthInfo.checkIns[dateKey] || lastCheckIn === dateKey);
      if (isCheckedIn) checkedDays++;
      days.push({
        day: d,
        isToday: d === today,
        isCheckedIn,
      });
    }

    const monthNames = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    return {
      days,
      title: `${year}年 ${monthNames[month]}`,
      checkedDays,
    };
  },

  generateInviteCode() {
    const code = "AI" + Math.random().toString(36).substring(2, 8).toUpperCase();
    this.setData({ inviteCode: code });
  },

  handleCopyInvite() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({ title: "邀请码已复制", icon: "success" });
      },
    });
  },

  handleGetUserProfile() {
    wx.getUserProfile({
      desc: "用于完善个人资料",
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
      fail: () => {
        wx.showToast({ title: "已取消授权", icon: "none" });
      },
    });
  },

  handleAdmin() {
    wx.showModal({
      title: "管理员入口",
      content: "暂未开放，敬请期待",
      showCancel: false,
    });
  },

  onShareAppMessage() {
    return {
      title: `我在 AI 原生能力自学站已获得 ${this.data.xp} XP，快来一起学习吧！`,
      path: "/pages/index/index",
    };
  },
});
