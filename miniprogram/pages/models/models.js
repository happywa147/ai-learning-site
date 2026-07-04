// pages/models/models.js
// 模型对比页面
const { loadModels } = require("../../utils/dataLoader");

// 决策树定义
const DECISION_TREE = {
  start: {
    question: "你的主要使用场景是什么？",
    options: [
      { label: "📝 文本创作与对话", next: "budget_text" },
      { label: "💻 编程与代码开发", next: "code_context" },
      { label: "🔬 数学与逻辑推理", next: "budget_reason" },
      { label: "🖼️ 多模态（图像/音频）", next: "multimodal_type" },
    ],
  },
  budget_text: {
    question: "你的预算情况如何？",
    options: [
      { label: "不限预算，要最好效果", recommend: ["gpt-4o", "claude-35-sonnet"] },
      { label: "追求性价比", recommend: ["gpt-4o-mini", "gemini-20-flash", "deepseek-v3"] },
    ],
  },
  code_context: {
    question: "需要处理超长代码库吗？",
    options: [
      { label: "是，需要超长上下文", recommend: ["claude-35-sonnet", "gemini-20-pro"] },
      { label: "否，常规代码任务", recommend: ["gpt-4o", "deepseek-v3", "o3-mini"] },
    ],
  },
  budget_reason: {
    question: "你的预算情况如何？",
    options: [
      { label: "不限预算，要最强推理", recommend: ["o1", "deepseek-r1"] },
      { label: "追求性价比", recommend: ["o3-mini", "deepseek-r1"] },
    ],
  },
  multimodal_type: {
    question: "需要哪种多模态能力？",
    options: [
      { label: "视频理解", recommend: ["gemini-20-pro", "gemini-20-flash"] },
      { label: "图像 + 语音对话", recommend: ["gpt-4o"] },
      { label: "图像理解即可", recommend: ["gpt-4o-mini", "claude-35-sonnet"] },
    ],
  },
};

Page({
  data: {
    models: [],
    filteredModels: [],
    providers: [],
    selectedProvider: "全部",
    sortBy: "benchmark",
    loading: true,
    // 详情
    detailModel: null,
    // 决策树
    treeActive: false,
    treeStep: "start",
    treeQuestion: "",
    treeOptions: [],
    treeHistory: [],
    treeResult: null,
    recommendedModels: [],
  },

  onLoad() {
    this.loadModelsData();
  },

  async loadModelsData() {
    try {
      const models = await loadModels();
      // 提取所有提供商
      const providers = ["全部", ...new Set(models.map((m) => m.provider))];
      this.setData({
        models,
        filteredModels: this.sortModels(models, this.data.sortBy),
        providers,
        loading: false,
      });
    } catch (err) {
      console.error("[Models] 加载失败", err);
      this.setData({ loading: false });
    }
  },

  // 筛选：按提供商
  filterByProvider(e) {
    const provider = e.currentTarget.dataset.provider;
    let filtered = this.data.models;
    if (provider !== "全部") {
      filtered = filtered.filter((m) => m.provider === provider);
    }
    this.setData({
      selectedProvider: provider,
      filteredModels: this.sortModels(filtered, this.data.sortBy),
    });
  },

  // 排序
  changeSort(e) {
    const sortBy = e.currentTarget.dataset.sort;
    this.setData({
      sortBy,
      filteredModels: this.sortModels(this.data.filteredModels, sortBy),
    });
  },

  sortModels(models, sortBy) {
    const arr = [...models];
    if (sortBy === "benchmark") {
      arr.sort((a, b) => b.benchmark - a.benchmark);
    } else if (sortBy === "date") {
      arr.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (sortBy === "name") {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    return arr;
  },

  // 查看模型详情
  showDetail(e) {
    const id = e.currentTarget.dataset.id;
    const model = this.data.models.find((m) => m.id === id);
    this.setData({ detailModel: model, treeActive: false });
  },

  closeDetail() {
    this.setData({ detailModel: null });
  },

  // ========== 决策树 ==========
  openTree() {
    const step = DECISION_TREE.start;
    this.setData({
      treeActive: true,
      treeStep: "start",
      treeQuestion: step.question,
      treeOptions: step.options,
      treeHistory: [],
      treeResult: null,
      recommendedModels: [],
    });
  },

  closeTree() {
    this.setData({ treeActive: false });
  },

  treeSelect(e) {
    const index = e.currentTarget.dataset.index;
    const step = DECISION_TREE[this.data.treeStep];
    const choice = step.options[index];

    // 记录历史
    const history = [...this.data.treeHistory, { step: this.data.treeStep, choice: choice.label }];

    if (choice.next) {
      // 进入下一步
      const nextStep = DECISION_TREE[choice.next];
      this.setData({
        treeStep: choice.next,
        treeQuestion: nextStep.question,
        treeOptions: nextStep.options,
        treeHistory: history,
      });
    } else if (choice.recommend) {
      // 到达结果
      const recommended = this.data.models.filter((m) => choice.recommend.includes(m.id));
      this.setData({
        treeResult: true,
        treeHistory: history,
        recommendedModels: recommended,
      });
    }
  },

  treeBack() {
    const history = [...this.data.treeHistory];
    if (history.length === 0) return;
    const last = history.pop();
    const step = DECISION_TREE[last.step];
    this.setData({
      treeStep: last.step,
      treeQuestion: step.question,
      treeOptions: step.options,
      treeHistory: history,
      treeResult: null,
      recommendedModels: [],
    });
  },

  treeRestart() {
    const step = DECISION_TREE.start;
    this.setData({
      treeStep: "start",
      treeQuestion: step.question,
      treeOptions: step.options,
      treeHistory: [],
      treeResult: null,
      recommendedModels: [],
    });
  },
});
