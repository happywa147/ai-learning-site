// pages/index/index.js - 首页
const { checkIn, getTodayTasks, completeTask, getTodayKey } = require("../../utils/gamification");

const app = getApp();

Page({
  data: {
    title: "AI 原生能力自学站",
    subtitle: "每日精进，成为 AI 原生者",
    streak: 0,
    sessionXP: 0,
    tasks: [],
    hasCheckedIn: false,
    navCards: [
      { id: "tracks", title: "学习路线", desc: "系统化进阶路径", icon: "🛤️" },
      { id: "models", title: "模型库", desc: "AI 模型速查", icon: "🧠" },
      { id: "agent", title: "Agent 角色", desc: "实用 AI 助手", icon: "🤖" },
    ],
  },

  onLoad() {
    this.refreshAll();
  },

  onShow() {
    this.refreshAll();
  },

  refreshAll() {
    const today = getTodayKey();
    const hasCheckedIn = app.globalData.lastCheckIn === today;
    const tasks = getTodayTasks(app);
    this.setData({
      streak: app.globalData.streak,
      hasCheckedIn,
      tasks,
    });
  },

  handleCheckIn() {
    const result = checkIn(app);
    if (result.success) {
      this.setData({
        streak: result.streak,
        sessionXP: this.data.sessionXP + result.xpGained,
        hasCheckedIn: true,
      });
      wx.showToast({
        title: `签到成功 +${result.xpGained}XP`,
        icon: "none",
        duration: 2000,
      });
    } else {
      wx.showToast({
        title: result.message,
        icon: "none",
      });
    }
  },

  handleCompleteTask(e) {
    const { id } = e.currentTarget.dataset;
    const task = this.data.tasks.find((t) => t.id === id);
    if (task && task.done) return;

    const success = completeTask(app, id);
    if (success) {
      const tasks = getTodayTasks(app);
      this.setData({
        tasks,
        sessionXP: this.data.sessionXP + (task ? task.xp : 10),
      });
      wx.showToast({
        title: `任务完成 +${task ? task.xp : 10}XP`,
        icon: "none",
      });
    } else {
      wx.showToast({
        title: "任务已完成或已过期",
        icon: "none",
      });
    }
  },

  handleNavigate(e) {
    const { page } = e.currentTarget.dataset;
    wx.switchTab({ url: `/pages/${page}/${page}` });
  },

  onShareAppMessage() {
    return {
      title: "AI 原生能力自学站 - 一起开启 AI 学习之旅",
      path: "/pages/index/index",
    };
  },
});
