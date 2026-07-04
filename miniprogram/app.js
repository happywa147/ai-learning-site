// app.js - AI 原生能力自学站 微信小程序
const { loadTracks, loadModels, loadAgentRoles } = require("./utils/dataLoader");
const {
  getXP,
  getRank,
  getNextRank,
  getTodayKey,
  ensureMonthExists,
  persistGameState,
  loadGameState,
} = require("./utils/gamification");

App({
  onLaunch() {
    // 加载本地游戏状态
    loadGameState(this);
    // 预加载数据（异步）
    this.loadAllData();
  },

  globalData: {
    // 游戏状态
    xp: 0,
    streak: 0,
    lastCheckIn: "",
    badges: [],
    level: 1,
    // 数据缓存
    tracks: null,
    models: null,
    agentRoles: null,
    agentRoleCategories: null,
    // 主题色
    themeColor: "#722F37",
    themeColorLight: "#8B4513",
    bgColor: "#F5F0E8",
  },

  async loadAllData() {
    try {
      const [tracks, models, agentRoles] = await Promise.all([loadTracks(), loadModels(), loadAgentRoles()]);
      this.globalData.tracks = tracks;
      this.globalData.models = models;
      this.globalData.agentRoles = agentRoles.roles;
      this.globalData.agentRoleCategories = agentRoles.categories;
      console.log("[App] 数据加载完成");
    } catch (err) {
      console.error("[App] 数据加载失败", err);
    }
  },
});
