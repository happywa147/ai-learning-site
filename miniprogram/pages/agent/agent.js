// pages/agent/agent.js
const { loadAgentRoles } = require("../../utils/dataLoader");

Page({
  data: {
    agents: [],
    categories: [],
    filteredAgents: [],
    activeCategory: "",
    searchQuery: "",
    showDetail: false,
    detailAgent: null,
    dailyChallenge: null,
  },

  onLoad() {
    this.loadData();
  },

  async loadData() {
    try {
      const data = await loadAgentRoles();
      const roles = data.roles || data;
      const categories = data.categories || [];

      // 为每个 role 添加 categoryName
      const categoryMap = {};
      categories.forEach((cat) => {
        categoryMap[cat.id] = cat.name;
      });
      roles.forEach((role) => {
        role.categoryName = categoryMap[role.category] || "未分类";
      });

      // 随机选一个今日挑战
      const today = new Date().getDate();
      const challengeIndex = today % roles.length;

      this.setData({
        agents: roles,
        categories,
        filteredAgents: roles,
        dailyChallenge: roles[challengeIndex],
      });
    } catch (err) {
      console.error("[Agent] 加载失败", err);
      wx.showToast({ title: "加载失败", icon: "error" });
    }
  },

  // 分类筛选
  selectCategory(e) {
    const catId = e.currentTarget.dataset.id;
    this.filterAgents(catId, this.data.searchQuery);
  },

  // 搜索
  onSearchInput(e) {
    const query = e.detail.value;
    this.setData({ searchQuery: query });
    this.filterAgents(this.data.activeCategory, query);
  },

  clearSearch() {
    this.setData({ searchQuery: "" });
    this.filterAgents(this.data.activeCategory, "");
  },

  // 综合筛选
  filterAgents(categoryId, query) {
    let filtered = this.data.agents;

    if (categoryId) {
      filtered = filtered.filter((a) => a.category === categoryId);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }

    this.setData({
      activeCategory: categoryId,
      filteredAgents: filtered,
    });
  },

  // 显示详情
  showAgentDetail(e) {
    const id = e.currentTarget.dataset.id;
    const agent = this.data.agents.find((a) => a.id === id);
    if (agent) {
      this.setData({ showDetail: true, detailAgent: agent });
    }
  },

  closeDetail() {
    this.setData({ showDetail: false });
  },

  // 复制 Prompt
  copyPrompt(e) {
    const prompt = e.currentTarget.dataset.prompt;
    if (!prompt) {
      wx.showToast({ title: "暂无 Prompt", icon: "none" });
      return;
    }
    wx.setClipboardData({
      data: prompt,
      success() {
        wx.showToast({ title: "已复制", icon: "success" });
      },
    });
  },

  // 今日挑战
  showDailyChallenge() {
    const roles = this.data.agents;
    const today = new Date().getDate();
    const challengeIndex = today % roles.length;
    this.setData({
      showDetail: true,
      detailAgent: roles[challengeIndex],
    });
  },

  onShareAppMessage() {
    return {
      title: "AI Agent 角色卡 - AI 原生能力自学站",
      path: "/pages/agent/agent",
    };
  },
});
