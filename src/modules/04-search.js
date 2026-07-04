"use strict";
/* ====== P1-PR3: Global Search ====== */
let searchIndex = [];

function buildSearchIndex() {
  searchIndex = [];
  const safe = (v) => safeText(v || "");

  Object.entries(tracks).forEach(([key, track]) => {
    searchIndex.push({ type: "路线", title: safe(track.title), desc: safe(track.summary), page: "map", keywords: key });
    (track.modules || []).forEach((mod) => {
      searchIndex.push({ type: "路线模块", title: safe(mod[0]), desc: safe(mod[1]), page: "map" });
    });
  });

  (projects || []).forEach((p) => {
    searchIndex.push({ type: "项目挑战", title: safe(p.title), desc: safe(p.desc), page: "projects" });
  });

  (agentRoles || []).forEach((r) => {
    searchIndex.push({ type: "Agent角色", title: safe(r.name), desc: safe(r.useFor), page: "agents" });
  });

  (resourceRadarItems || []).forEach((r) => {
    searchIndex.push({ type: "资源", title: safe(r.name), desc: safe(r.useFor), page: "resources" });
  });

  (models || []).forEach((m) => {
    searchIndex.push({ type: "模型", title: safe(m.name), desc: safe(m.desc), page: "models" });
  });

  (showcaseItems || []).forEach((s) => {
    searchIndex.push({ type: "作品样例", title: safe(s.title), desc: safe(s.text), page: "showcase" });
  });

  (weeks || []).forEach((w, i) => {
    searchIndex.push({ type: "周计划", title: safe(w[0]) + " " + safe(w[1]), desc: safe(w[2]), page: "weekly" });
  });

  (dailyChallenges || []).forEach((c) => {
    searchIndex.push({ type: "每日挑战", title: safe(c[0]), desc: safe(c[1]), page: "game" });
  });

  (worldviewItems || []).forEach((w) => {
    searchIndex.push({ type: "世界观", title: safe(w.title), desc: safe(w.text), page: "worldview" });
  });
}

function performSearch(query) {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  const results = [];
  for (const item of searchIndex) {
    const title = (item.title || "").toLowerCase();
    const desc = (item.desc || "").toLowerCase();
    if (title.includes(q) || desc.includes(q)) {
      results.push({ ...item, _score: (title.includes(q) ? 10 : 0) + (desc.includes(q) ? 1 : 0) });
    }
  }
  results.sort((a, b) => b._score - a._score);
  return results.slice(0, 20);
}

function renderSearchResults(query) {
  const container = document.querySelector("#searchResults");
  if (!container) return;
  if (!query || query.trim().length < 1) {
    container.innerHTML = '<p class="search-empty">输入关键词搜索全站内容</p>';
    return;
  }
  const results = performSearch(query);
  if (results.length === 0) {
    container.innerHTML = '<p class="search-empty">没有找到相关内容，试试其他关键词</p>';
    return;
  }
  container.innerHTML = results.map((r) => `
    <a class="search-result-item" href="index.html?page=${safeText(r.page)}">
      <span class="result-type">${safeText(r.type)}</span>
      <div class="result-title">${safeText(r.title)}</div>
      <div class="result-desc">${safeText(r.desc).substring(0, 80)}</div>
    </a>
  `).join("");

  container.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      closeSearch();
    });
  });
}

function openSearch() {
  const overlay = document.querySelector("#searchOverlay");
  if (!overlay) return;
  overlay.classList.add("search-active");
  overlay.setAttribute("aria-hidden", "false");
  const input = document.querySelector("#searchInput");
  if (input) { input.value = ""; input.focus(); }
  renderSearchResults("");
}

function closeSearch() {
  const overlay = document.querySelector("#searchOverlay");
  if (!overlay) return;
  overlay.classList.remove("search-active");
  overlay.setAttribute("aria-hidden", "true");
}

const searchToggleBtn = document.querySelector("#searchToggle");
if (searchToggleBtn) searchToggleBtn.addEventListener("click", openSearch);
const searchToggleNavBtn = document.querySelector("#searchToggleNav");
if (searchToggleNavBtn) searchToggleNavBtn.addEventListener("click", openSearch);
const searchCloseBtn = document.querySelector("#searchClose");
if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearch);
const searchInputEl = document.querySelector("#searchInput");
if (searchInputEl) searchInputEl.addEventListener("input", (e) => renderSearchResults(e.target.value));
const searchOverlayEl = document.querySelector("#searchOverlay");
if (searchOverlayEl) {
  searchOverlayEl.addEventListener("click", (e) => {
    if (e.target === searchOverlayEl) closeSearch();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});

