// pages/tracks/tracks.js
// 学习路线页面
const { loadTracks } = require("../../utils/dataLoader");
const { addXP } = require("../../utils/gamification");

const PROGRESS_KEY = "ai-track-progress";

Page({
  data: {
    tracks: [],
    expandedId: "",
    completedModules: {},
    quizState: {}, // { trackId: { active, current, answers } }
    quizResult: {}, // { trackId: { done, correct, total } }
    loading: true,
  },

  onLoad() {
    this.loadTracksData();
  },

  onShow() {
    // 每次显示时刷新完成状态
    if (!this.data.loading) {
      this.refreshCompletion();
    }
  },

  async loadTracksData() {
    try {
      const tracks = await loadTracks();
      const completed = wx.getStorageSync(PROGRESS_KEY) || {};
      // 为每条路线计算完成进度
      const tracksWithProgress = tracks.map((t) => {
        const total = t.modules.length;
        const done = t.modules.filter((m) => completed[m.id]).length;
        return {
          ...t,
          totalModules: total,
          completedCount: done,
          percent: total ? Math.round((done / total) * 100) : 0,
        };
      });
      this.setData({
        tracks: tracksWithProgress,
        completedModules: completed,
        loading: false,
      });
    } catch (err) {
      console.error("[Tracks] 加载失败", err);
      this.setData({ loading: false });
    }
  },

  refreshCompletion() {
    const completed = wx.getStorageSync(PROGRESS_KEY) || {};
    const tracks = this.data.tracks.map((t) => {
      const total = t.modules.length;
      const done = t.modules.filter((m) => completed[m.id]).length;
      return { ...t, totalModules: total, completedCount: done, percent: total ? Math.round((done / total) * 100) : 0 };
    });
    this.setData({ tracks, completedModules: completed });
  },

  // 展开/折叠路线
  toggleTrack(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      expandedId: this.data.expandedId === id ? "" : id,
    });
  },

  // 标记模块完成/取消
  toggleModule(e) {
    const { moduleid, trackid } = e.currentTarget.dataset;
    const completed = { ...this.data.completedModules };
    const app = getApp();
    let xpMsg = "";

    if (completed[moduleid]) {
      // 取消完成
      delete completed[moduleid];
      xpMsg = "已取消完成";
    } else {
      // 标记完成，获得 XP
      completed[moduleid] = true;
      addXP(app, 15, "完成学习模块");
      xpMsg = "模块已完成 +15 XP";

      // 检查路线是否全部完成
      const track = this.data.tracks.find((t) => t.id === trackid);
      if (track) {
        const allDone = track.modules.every((m) => completed[m.id]);
        if (allDone) {
          addXP(app, 50, "完成学习路线: " + track.name);
          xpMsg = "路线全部完成 +65 XP";
        }
      }
    }

    wx.setStorageSync(PROGRESS_KEY, completed);
    this.refreshCompletion();
    this.setData({ completedModules: completed });

    wx.showToast({ title: xpMsg, icon: "none", duration: 2000 });
  },

  // 开始自测
  startQuiz(e) {
    const trackId = e.currentTarget.dataset.trackid;
    this.setData({
      quizState: {
        ...this.data.quizState,
        [trackId]: { active: true, current: 0, answers: [] },
      },
      quizResult: {
        ...this.data.quizResult,
        [trackId]: { done: false, correct: 0, total: 0 },
      },
    });
  },

  // 选择答案
  selectAnswer(e) {
    const { trackid, index } = e.currentTarget.dataset;
    const idx = parseInt(index, 10);
    const state = this.data.quizState[trackid];
    if (!state) return;

    const track = this.data.tracks.find((t) => t.id === trackid);
    if (!track) return;

    const newAnswers = [...state.answers, idx];
    const next = state.current + 1;

    if (next >= track.quiz.length) {
      // 测验结束，计算成绩
      let correct = 0;
      newAnswers.forEach((ans, i) => {
        if (ans === track.quiz[i].answer) correct++;
      });
      const app = getApp();
      const xpGain = correct * 10;
      if (xpGain > 0) {
        addXP(app, xpGain, "自测答题");
      }
      this.setData({
        quizState: {
          ...this.data.quizState,
          [trackid]: { active: false, current: 0, answers: [] },
        },
        quizResult: {
          ...this.data.quizResult,
          [trackid]: { done: true, correct, total: track.quiz.length, xp: xpGain },
        },
      });
    } else {
      this.setData({
        quizState: {
          ...this.data.quizState,
          [trackid]: { active: true, current: next, answers: newAnswers },
        },
      });
    }
  },

  // 关闭自测
  closeQuiz(e) {
    const trackId = e.currentTarget.dataset.trackid;
    this.setData({
      quizState: {
        ...this.data.quizState,
        [trackId]: { active: false, current: 0, answers: [] },
      },
      quizResult: {
        ...this.data.quizResult,
        [trackId]: { done: false, correct: 0, total: 0 },
      },
    });
  },
});
