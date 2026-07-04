"use strict";
function getTodayKey() {
  return getLocalDateKey(new Date());
}

function ensureMonthExists() {
  if (!monthlyUpdates.length) return;
  if (!monthlyUpdates.find((entry) => entry.id === state.month)) {
    state.month = monthlyUpdates[0].id;
    if (!setStoredValue(storageKeys.month, state.month)) {
      showStorageUnavailableNotice();
    }
  }
}

function renderStarter() {
  document.querySelector("#starterGrid").innerHTML = starterSteps
    .map(
      (step, index) => `
        <article class="starter-card">
          <span>${safeText(String(index + 1).padStart(2, "0"))}</span>
          <h3>${safeText(step.title)}</h3>
          <p>${safeText(step.text)}</p>
          <a class="ghost-btn small" href="${safeText(step.href)}">${safeText(step.action)}</a>
        </article>
      `
    )
    .join("");
}

function renderShowcase() {
  document.querySelector("#showcaseGrid").innerHTML = showcaseItems
    .map(
      (item) => `
        <article class="showcase-card">
          <span class="badge">${safeText(item.type)}</span>
          <h3>${safeText(item.title)}</h3>
          <p>${safeText(item.text)}</p>
          <footer>${item.outputs.map((tag) => `<span class="tag">${safeText(tag)}</span>`).join("")}</footer>
        </article>
      `
    )
    .join("");
}

function renderResourceRadar() {
  const query = state.resourceSearch.trim().toLowerCase();
  const visibleResources = resourceRadarItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const actionMatched = state.resourceAction === "all" || item.action === state.resourceAction;
      const licenseMatched = state.resourceLicense === "all" || item.licenseSpdx === state.resourceLicense;
      const text = `${item.name} ${item.type} ${item.licenseSpdx} ${item.action} ${item.useFor} ${item.adapt}`.toLowerCase();
      return actionMatched && licenseMatched && (!query || text.includes(query));
    });

  document.querySelector("#resourceCount").textContent = `当前显示 ${visibleResources.length} / ${resourceRadarItems.length} 个资源`;

  if (!visibleResources.length) {
    document.querySelector("#resourceRadarGrid").innerHTML =
      '<div class="empty-state">未找到匹配资源，试试关键词：Agent、Prompt、MIT、RAG、工作流。</div>';
    return;
  }

  document.querySelector("#resourceRadarGrid").innerHTML = visibleResources
    .map(({ item, index }) => {
      const href = safeUrl(item.url);
      return `
        <article class="resource-card">
          <div class="resource-card-top">
            <span class="badge">${safeText(item.action)}</span>
            <small>${safeText(item.license)}</small>
          </div>
          <h3>${safeText(item.name)}</h3>
          <p>${safeText(item.useFor)}</p>
          <dl>
            <div><dt>类型</dt><dd>${safeText(item.type)}</dd></div>
            <div><dt>许可证</dt><dd>${safeText(item.licenseSpdx)} · ${safeText(item.source)} 复核于 ${safeText(item.lastVerified)}</dd></div>
            <div><dt>本站处理</dt><dd>${safeText(item.adapt)}</dd></div>
          </dl>
          <div class="resource-actions">
            <button class="ghost-btn small copy-resource-card" type="button" data-resource-copy="${index}">复制资源卡</button>
            <button class="ghost-btn small copy-resource-contribution" type="button" data-resource-contribution="${index}">复制贡献模板</button>
            ${href ? `<a class="ghost-btn small" href="${href}" target="_blank" rel="noopener noreferrer">查看仓库</a>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function buildResourceRadarText(item) {
  return `AI 学习资源卡：${item.name}

仓库：${item.url}
类型：${item.type}
许可证：${item.licenseSpdx}
复核：${item.source} · ${item.lastVerified}
处理建议：${item.action}

值得学习：
${item.useFor}

本站改造方向：
${item.adapt}

使用边界：
复用前请阅读原仓库 LICENSE；NOASSERTION 或限制性许可证只借鉴机制，不搬运原文。请保留来源链接，并把引用、改写和原创内容区分清楚。`;
}

function buildResourceContributionText(item = {}) {
  return `AI 学习资源贡献模板

资源名称：${item.name || ""}
GitHub 地址：${item.url || ""}
类型：${item.type || ""}
当前许可证 SPDX：${item.licenseSpdx || ""}
复核日期：${item.lastVerified || new Date().toISOString().slice(0, 10)}
处理建议：${item.action || "值得借鉴 / 可按许可证复用 / 可改造吸收 / 谨慎改造 / 只借鉴机制"}

为什么值得学习：
${item.useFor || ""}

建议如何改造成本站内容：
${item.adapt || ""}

风险与边界：
请说明是否允许复制原文、代码或图片；许可证不清晰时，只提交机制借鉴和自己的重新表达。

贡献者备注：
`;
}

async function copyResourceCard(index, button) {
  const item = resourceRadarItems[index];
  if (!item) return;
  const ok = await copyTextWithFallback(buildResourceRadarText(item), {
    button,
    successText: `已复制「${item.name}」资源卡。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
  if (!ok) return;
}

async function copyResourceContribution(index, button) {
  const item = resourceRadarItems[index] || {};
  const ok = await copyTextWithFallback(buildResourceContributionText(item), {
    button,
    successText: "已复制资源贡献模板。",
    failureText: "复制失败，请手动复制页面内容。"
  });
  if (!ok) return;
}

function renderTrack() {
  const track = tracks[state.track];
  const detail = document.querySelector("#trackDetail");
  const codeExamples = track.codeExamples || {};
  const prereqHTML = track.prereq ? `
    <div class="prereq-check">
      <h4>开始前的自检</h4>
      <p class="muted" style="margin-bottom:10px;">勾选你已具备的条件，确认你准备好开始这条路线。</p>
      ${track.prereq.map((q, i) => `
        <label class="prereq-question">
          <input type="checkbox" />
          <span>${safeText(q)}</span>
        </label>
      `).join("")}
    </div>
  ` : "";
  const selfCheckHTML = track.selfCheck ? `
    <div class="self-check">
      <h4>学完后的自我检查</h4>
      <p class="muted" style="margin-bottom:10px;">确认你能做到以下事项，再进入下一条路线。</p>
      ${track.selfCheck.map((item, i) => `
        <label class="self-check-item">
          <input type="checkbox" />
          <span>${safeText(item)}</span>
        </label>
      `).join("")}
    </div>
  ` : "";
  detail.innerHTML = `
    <article class="track-card">
      <h3>${safeText(track.title)}</h3>
      <p class="muted">${safeText(track.summary)}</p>
      <ul>${safeList(track.outcomes)}</ul>
      <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(track.title)}', desc: '${safeText(track.summary)}'})">问 AI 辅导</button>
    </article>
    ${prereqHTML}
    <div class="track-modules">
      ${track.modules
        .map((mod) => {
          const name = mod.title || mod[0] || "";
          const text = mod.desc || mod[1] || "";
          const example = codeExamples[name] || "";
          const practiceHTML = mod.practice ? `
            <details class="module-practice" style="margin-top:12px;">
              <summary style="cursor:pointer;font-weight:600;color:var(--earth);font-size:0.9rem;">🎯 5分钟实操（${mod.practice.length}步）${mod.difficulty ? `<span style="font-size:0.72rem;color:var(--muted);margin-left:6px;">${difficultyLabel(mod.difficulty)}</span>` : ""}</summary>
              <ol style="margin-top:10px;padding-left:20px;font-size:0.88rem;line-height:1.8;">
                ${mod.practice.map((p, pi) => `
                  <li style="margin-bottom:8px;">
                    <strong>第${pi+1}步：</strong>${safeText(p.step)}<br>
                    <span style="color:var(--muted);font-size:0.82rem;">→ ${safeText(p.expect || "")}</span>
                  </li>
                `).join("")}
              </ol>
            </details>
          ` : "";
          /* R3: Common errors */
          const errorsHTML = mod.commonErrors && mod.commonErrors.length ? `
            <details class="module-errors" style="margin-top:8px;">
              <summary style="cursor:pointer;font-weight:600;color:#b8821e;font-size:0.85rem;">⚠️ 常见错误（${mod.commonErrors.length}条）</summary>
              <div style="margin-top:8px;font-size:0.82rem;line-height:1.7;">
                ${mod.commonErrors.map(ce => `
                  <div style="margin-bottom:6px;padding:6px 10px;background:rgba(184,130,30,0.06);border-radius:6px;border-left:3px solid #b8821e;">
                    <strong>❌ ${safeText(ce.error)}</strong><br>
                    <span style="color:var(--earth);">✅ ${safeText(ce.fix)}</span>
                  </div>
                `).join("")}
              </div>
            </details>
          ` : "";
          return `<article class="module">
              ${mod.difficulty ? `<span class="module-difficulty module-diff-${mod.difficulty}">${difficultyLabel(mod.difficulty)}</span>` : ""}
              <span>${safeText(name)}</span>
              <h3>${safeText(name)}模块</h3>
              <p class="muted">${safeText(text)}</p>
              ${example ? `<pre style="background:rgba(143,47,42,0.06);padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;margin:8px 0;">${escapeHtml(example)}</pre>` : ""}
              ${practiceHTML}
              <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(track.title)} - ${safeText(name)}', desc: '${safeText(text)}'})">问 AI</button>
            </article>`;
        })
        .join("")}
    </div>
    ${selfCheckHTML}
  `;
}

function renderWeeks() {
  const list = document.querySelector("#weekList");
  list.innerHTML = weeks
    .map(([week, title, goal], index) => {
      const checked = state.doneWeeks.has(index);
      return `
        <label class="week-item ${checked ? "done" : ""}">
          <input type="checkbox" data-week="${index}" ${checked ? "checked" : ""} />
          <span><strong>${safeText(week)} · ${safeText(title)}</strong><small class="muted">${safeText(goal)}</small></span>
          <span class="tag">${checked ? "已记录" : "可后续"}</span>
        </label>
      `;
    })
    .join("");
  updateProgress();
}

function renderMonthOptions() {
  const select = document.querySelector("#monthSelect");
  select.innerHTML = (monthlyUpdates.length
    ? monthlyUpdates
    : [{ id: "2026-07", label: "2026 年 7 月" }]
  )
    .map((month) => `<option value="${safeText(month.id)}">${safeText(month.label || month.id)}</option>`)
    .join("");
  select.value = state.month;
}

function renderMonthlyUpdate() {
  const update = monthlyUpdates.find((month) => month.id === state.month) || monthlyUpdates[0];
  if (!update) {
    return;
  }
  const evidenceItems = [
    update.lastVerified ? `复核日期：${update.lastVerified}` : "",
    update.confidence ? `可信度：${update.confidence}` : "",
    update.testedTasks?.length ? `测试任务：${update.testedTasks.join(" / ")}` : ""
  ].filter(Boolean);
  const sourceLinks = (update.sources || [])
    .filter((source) => source && source.label && source.url)
    .map((source) => {
      const href = safeUrl(source.url);
      if (!href) return "";
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${safeText(source.label)}</a>`;
    })
    .filter(Boolean);
  document.querySelector("#monthBadge").textContent = safeText(update.label || "");
  document.querySelector("#monthTitle").textContent = safeText(update.title || "");
  document.querySelector("#monthSummary").textContent = safeText(update.summary || "");
  document.querySelector("#monthFocusCount").textContent = String(update.cards?.length || 0);
  document.querySelector("#monthUpdated").textContent = update.updatedAt ? `更新日期：${safeText(update.updatedAt)}` : "";
  document.querySelector("#monthEvidence").innerHTML = [...evidenceItems.map((item) => `<span>${safeText(item)}</span>`), ...sourceLinks].join("");
  document.querySelector("#monthlyGrid").innerHTML = update.cards
    .map((card) => `<article class="monthly-card"><h3>${safeText(card.title)}</h3><ul>${safeList(card.items)}</ul></article>`)
    .join("");
}

function renderModels(keyword = "") {
  const grid = document.querySelector("#modelGrid");
  const query = keyword.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const text = `${model.name} ${model.desc} ${(model.tags || []).join(" ")} ${(model.scenario || "")} ${(model.pricing || "")}`.toLowerCase();
    return text.includes(query);
  });
  if (!filtered.length) {
    grid.innerHTML =
      '<div class="empty-state">未找到匹配模型，建议尝试关键词：编程、短视频、长文本、国内、国际。</div>';
    return;
  }
  const now = new Date();
  grid.innerHTML = filtered
    .map(
      (model) => {
        let expiryHTML = "";
        if (model.lastVerified) {
          const verified = new Date(model.lastVerified);
          const daysSince = Math.floor((now - verified) / 86400000);
          if (daysSince > 60) {
            expiryHTML = `<span class="expiry-warning expired">数据已过期 ${daysSince} 天，请核实</span>`;
          } else if (daysSince > 30) {
            expiryHTML = `<span class="expiry-warning stale">数据 ${daysSince} 天前验证，建议复核</span>`;
          }
        }
        return `
      <article class="model-card">
        <h3>${safeText(model.name)}${expiryHTML}</h3>
        <p>${safeText(model.desc)}</p>
        <p class="muted">${safeText(model.scenario || "")}</p>
        ${model.contextWindow || model.inputPrice || model.outputPrice ? `
        <div class="model-specs" style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;font-size:13px;">
          ${model.contextWindow ? `<span><strong>上下文：</strong>${safeText(model.contextWindow)}</span>` : ""}
          ${model.inputPrice ? `<span><strong>输入：</strong>${safeText(model.inputPrice)}</span>` : ""}
          ${model.outputPrice ? `<span><strong>输出：</strong>${safeText(model.outputPrice)}</span>` : ""}
          ${model.vendor ? `<span><strong>厂商：</strong>${safeText(model.vendor)}</span>` : ""}
        </div>` : ""}
        <p class="muted"><strong>定价：</strong>${safeText(model.pricing || "")}</p>
        <p><strong>优势：</strong>${safeText(Array.isArray(model.strengths) ? model.strengths.join("；") : "")}</p>
        <p><strong>适用边界：</strong>${safeText(Array.isArray(model.limits) ? model.limits.join("；") : "")}</p>
        ${model.lastVerified ? `<p class="muted" style="font-size:11px;">数据验证：${safeText(model.lastVerified)}</p>` : ""}
        ${model.benchmark ? `<div class="model-specs" style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;font-size:13px;">
          ${model.benchmark.humanEval && model.benchmark.humanEval !== "—" ? `<span><strong>HumanEval：</strong>${safeText(model.benchmark.humanEval)}</span>` : ""}
          ${model.benchmark.cEval && model.benchmark.cEval !== "—" ? `<span><strong>C-Eval：</strong>${safeText(model.benchmark.cEval)}</span>` : ""}
          ${model.benchmark.mbpp && model.benchmark.mbpp !== "—" ? `<span><strong>MBPP：</strong>${safeText(model.benchmark.mbpp)}</span>` : ""}
        </div>` : ""}
        <footer>${(model.tags || [])
          .map((tag) => `<span class="tag">${safeText(tag)}</span>`)
          .join("")}</footer>
        <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '模型对比 - ${safeText(model.name)}', desc: '${safeText(model.desc)}'})">问 AI</button>
      </article>
    `;
      }
    )
    .join("");
}

function renderProjects() {
  const query = state.projectSearch.trim().toLowerCase();
  const visibleProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => {
      const levelMatched = state.projectLevel === "all" || project.level === state.projectLevel;
      const text = `${project.title} ${project.level} ${project.time} ${project.desc} ${(project.tools || []).join(" ")} ${(project.tasks || []).join(" ")} ${(project.deliverables || []).join(" ")} ${project.check || ""}`.toLowerCase();
      return levelMatched && (!query || text.includes(query));
    });

  document.querySelector("#projectCount").textContent = `当前显示 ${visibleProjects.length} / ${projects.length} 个挑战`;

  if (!visibleProjects.length) {
    document.querySelector("#projectGrid").innerHTML =
      '<div class="empty-state">未找到匹配挑战，试试关键词：RAG、短视频、Agent、隐私、模型。</div>';
    return;
  }

  document.querySelector("#projectGrid").innerHTML = visibleProjects
    .map(({ project, index }) => {
      const done = state.doneProjects.has(index);
      const requiredXp = getProjectUnlockXp(project);
      const locked = getXp() < requiredXp;
      return `
      <article class="project-card ${locked ? "locked" : ""}" data-unlock-label="${locked ? `需要 ${requiredXp} XP 后解锁` : ""}">
        <div class="project-meta">
          <span class="badge">${safeText(project.level || "挑战")}</span>
          <span>${safeText(project.time || "")}</span>
        </div>
        <h3>${safeText(project.title)}</h3>
        <p>${safeText(project.desc)}</p>
        <footer>${(project.tools || []).map((tag) => `<span class="tag">${safeText(tag)}</span>`).join("")}</footer>
        <p><strong>交付物：</strong>${safeText((project.deliverables || []).join(" / "))}</p>
        <p class="muted"><strong>验收：</strong>${safeText(project.check || "")}</p>
        <ul>${safeList(project.tasks)}</ul>
        <div class="project-actions">
          <button class="ghost-btn small copy-project-challenge" type="button" data-project-copy="${index}">复制挑战模板</button>
          <button type="button" class="ai-tutor-btn" onclick="openAiTutor({title: '${safeText(project.title)}', desc: '${safeText(project.desc)}'})">问 AI</button>
          <button type="button" class="${done ? "primary-btn" : "ghost-btn"} small project-toggle" ${locked ? "disabled" : ""} data-project="${index}">
            ${done ? "已点亮 +80 XP" : "点亮作品 +80 XP"}
          </button>
        </div>
        ${!locked ? createCodeEditorEmbed(project.title, project.level) : ""}
      </article>
    `;
    })
    .join("");
}

function buildProjectChallengeText(project) {
  return `AI 项目挑战：${project.title}

难度：${project.level}
预计时间：${project.time}
建议工具：${(project.tools || []).join(" / ")}

目标：
${project.desc}

任务步骤：
${(project.tasks || []).map((task, index) => `${index + 1}. ${task}`).join("\n")}

交付物：
${(project.deliverables || []).map((item, index) => `${index + 1}. ${item}`).join("\n")}

验收标准：
${project.check}

请你作为 AI 学习教练，先帮我把这个挑战拆成今天可交付的最小版本、标准版本和挑战版本，并提醒我哪些事实或来源需要核实。`;
}

async function copyProjectChallenge(index, button) {
  const project = projects[index];
  if (!project) return;
  await copyTextWithFallback(buildProjectChallengeText(project), {
    button,
    successText: `已复制「${project.title}」挑战模板。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
}

function buildAgentRolePrompt(role) {
  return `Agent 角色：${role.name}

适用场景：${role.useFor}
来源参考：${role.source}
能力等级：${role.level}

请你扮演这个角色，按下面规则帮助我：
1. 先确认任务目标、对象、限制和已有材料。
2. 根据角色职责给出可执行步骤，不空泛鼓励。
3. 输出时必须包含“输入、产出、验收标准、下一步练习”。
4. 遇到不确定信息要标注“需要核实”，不要编造事实。

角色输入：${role.input}
期望产出：${role.output}
验收标准：${role.check}
练习任务：${role.practice}`;
}

function getDailyAgentRole() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().setHours(0, 0, 0, 0) - start.getTime();
  const day = Math.floor(diff / 86400000);
  return agentRoles[day % agentRoles.length];
}

function renderAgentDailyChallenge() {
  const role = getDailyAgentRole();
  document.querySelector("#agentDailyName").textContent = role.name;
  document.querySelector("#agentDailyUse").textContent = role.useFor;
  document.querySelector("#agentDailyPractice").textContent = role.practice;
  document.querySelector("#copyDailyAgent").dataset.agentName = role.name;
}

async function copyAgentRoleByName(name, button) {
  const role = agentRoles.find((item) => item.name === name);
  if (!role) return;
  await copyTextWithFallback(buildAgentRolePrompt(role), {
    button,
    successText: `已复制「${role.name}」角色卡。`,
    failureText: "复制失败，请手动复制页面内容。"
  });
}

function getAgentQualityTier(role) {
  const promptLen = (role.prompt || role.input || "").length;
  if (promptLen > 500) return { tier: "expert", label: "专家版" };
  if (promptLen > 200) return { tier: "advanced", label: "进阶版" };
  return { tier: "basic", label: "基础版" };
}

/* L2: Difficulty label helper */
function difficultyLabel(level) {
  const labels = { beginner: "🌱 入门", intermediate: "🌿 进阶", advanced: "🔥 高级" };
  return labels[level] || "";
}

const AGENT_PAGE_SIZE = 12;

function renderAgentRoles() {
  const visibleRoles =
    state.agentCategory === "all"
      ? agentRoles
      : agentRoles.filter((role) => role.category === state.agentCategory);
  const categoryName =
    agentRoleCategories.find(([key]) => key === state.agentCategory)?.[1] || "全部";

  document.querySelector("#agentRoleTabs").innerHTML = agentRoleCategories
    .map(([key, label]) => {
      const count = key === "all" ? agentRoles.length : agentRoles.filter((role) => role.category === key).length;
      return `<button type="button" class="${state.agentCategory === key ? "active" : ""}" data-agent-category="${safeText(key)}">${safeText(label)} <span>${count}</span></button>`;
    })
    .join("");

  document.querySelector("#agentRoleCount").textContent = `${categoryName} · ${visibleRoles.length} / ${agentRoles.length} 个角色`;

  if (state.agentCategory !== (state._lastAgentCategory || "all")) {
    state.agentPage = 0;
    state._lastAgentCategory = state.agentCategory;
  }

  const totalPages = Math.ceil(visibleRoles.length / AGENT_PAGE_SIZE);
  if (state.agentPage >= totalPages) state.agentPage = 0;
  const pageStart = state.agentPage * AGENT_PAGE_SIZE;
  const pageRoles = visibleRoles.slice(pageStart, pageStart + AGENT_PAGE_SIZE);

  document.querySelector("#agentRoleGrid").innerHTML = pageRoles
    .map(
      (role) => {
        const quality = getAgentQualityTier(role);
        const scenario = role.useFor || role.output || "";
        return `
      <article class="agent-role-card">
        <div class="agent-role-top">
          <span class="badge">${safeText(role.level)}</span>
          <span class="agent-quality ${quality.tier}">${quality.label}</span>
          <small>${safeText(role.source)}</small>
        </div>
        <h3>${safeText(role.name)}</h3>
        <p>${safeText(role.useFor)}</p>
        ${scenario ? `<div class="agent-scenario"><strong>使用场景：</strong>${safeText(scenario.substring(0, 100))}</div>` : ""}
        <dl>
          <div><dt>输入</dt><dd>${safeText(role.input)}</dd></div>
          <div><dt>产出</dt><dd>${safeText(role.output)}</dd></div>
          <div><dt>验收</dt><dd>${safeText(role.check)}</dd></div>
        </dl>
        <footer>
          <strong>练习：</strong>${safeText(role.practice)}
        </footer>
        <button class="ghost-btn small copy-agent-role" type="button" data-agent-name="${safeText(role.name)}" aria-label="复制角色卡：${safeText(role.name)}">复制角色卡</button>
      </article>
    `;
      }
    )
    .join("");

  const paginationContainer = document.querySelector("#agentPagination");
  if (paginationContainer) {
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
    } else {
      let html = `<button type="button" ${state.agentPage === 0 ? "disabled" : ""} data-agent-page="prev">上一页</button>`;
      for (let i = 0; i < totalPages; i++) {
        html += `<button type="button" class="${i === state.agentPage ? "active" : ""}" data-agent-page="${i}">${i + 1}</button>`;
      }
      html += `<button type="button" ${state.agentPage >= totalPages - 1 ? "disabled" : ""} data-agent-page="next">下一页</button>`;
      paginationContainer.innerHTML = html;
      paginationContainer.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.agentPage;
          if (action === "prev") state.agentPage = Math.max(0, state.agentPage - 1);
          else if (action === "next") state.agentPage = Math.min(totalPages - 1, state.agentPage + 1);
          else state.agentPage = parseInt(action, 10);
          renderAgentRoles();
        });
      });
    }
  }
}

function renderTemplate() {
  document.querySelector("#templateText").textContent = templates[state.template];
}

function renderContact() {
  document.querySelector("#contactName").textContent = ownerContact.name;
  document.querySelector("#contactList").innerHTML = ownerContact.items
    .map(([label, value]) => {
      const content =
        label === "邮箱"
          ? `<button id="copyEmail" class="ghost-btn small" type="button">${safeText(value)}</button>`
          : `<strong>${safeText(value)}</strong>`;
      return `
        <div class="contact-item">
          <span>${safeText(label)}</span>
          ${content}
        </div>
      `;
    })
    .join("");
  document.querySelector("#contactList").insertAdjacentHTML(
    "afterbegin",
    `<div class="qr-card"><img src="${safeText(ownerContact.qrImage)}" alt="微信二维码" loading="lazy" decoding="async" /><span>微信二维码</span></div>`
  );
  document.querySelector("#leadCount").textContent = state.leads.length;
}

function generateProgressReport() {
  const currentMonth = monthlyUpdates.find((month) => month.id === state.month) || monthlyUpdates[0] || {};
  const doneWeekList = weeks
    .map((entry, index) => {
      const [weekName] = entry;
      if (!state.doneWeeks.has(index)) return "";
      const proof = state.weekProofs[String(index)] || "未填写证据";
      return `- ${weekName}：${escapeMarkdownLine(proof)}`;
    })
    .filter(Boolean);
  const doneProjectsList = projects
    .map((project, index) => {
      if (!state.doneProjects.has(index)) return "";
      const proof = state.projectProofs[index] || "未填写证据";
      return `- ${project.title}（${escapeMarkdownLine(proof)}）`;
    })
    .filter(Boolean);
  const rankName = getRank().name;
  const today = formatReportDate(new Date());
  const lines = [
    "# AI 原生能力自学站 · 学习周报",
    "",
    `导出时间：${today}`,
    `当前版本：${currentMonth.title ? escapeMarkdownLine(currentMonth.title) : "默认月度"}`,
    `当前等级：${rankName}`,
    `当前 XP：${getXp()}`,
    `连续学习记录：${state.streak} 天`,
    `已记录周任务：${state.doneWeeks.size} / ${weeks.length}`,
    `已点亮作品：${state.doneProjects.size} / ${projects.length}`,
    ""
  ];
  if (doneWeekList.length) {
    lines.push("## 周任务进度", ...doneWeekList);
  } else {
    lines.push("## 周任务进度", "- 暂无已记录任务");
  }
  lines.push("");
  if (doneProjectsList.length) {
    lines.push("## 作品里程碑", ...doneProjectsList);
  } else {
    lines.push("## 作品里程碑", "- 暂无点亮作品");
  }
  lines.push("");
  lines.push("## 本周建议");
  const nextWeekCandidates = weeks.filter((_, index) => !state.doneWeeks.has(index));
  if (nextWeekCandidates.length) {
    lines.push(`- 下一个推荐任务：${nextWeekCandidates[0][1]}（${nextWeekCandidates[0][2]}）`);
  } else {
    lines.push("- 本阶段里程碑还在持续推进中，可切换到下月更新继续延展。");
  }
  return lines.join("\n");
}

function downloadProgressReport() {
  const report = generateProgressReport();
  const today = formatReportDate(new Date());
  downloadTextFile(report, {
    fileName: `ai-learning-report-${today}.md`,
    type: "text/markdown;charset=utf-8",
    toastMessage: "学习周报已导出。"
  });
}

function getOwnerEmail() {
  return `${ownerContact.emailParts[0]}@${ownerContact.emailParts[1]}.${ownerContact.emailParts[2]}`;
}

let previousActiveElement = null;
let modalCloseResolver = null;
let activeProofCleanup = null;

function getModalFocusables(modal) {
  if (!modal) return [];
  return Array.from(
    modal.querySelectorAll("button, [href], input, select, textarea")
  ).filter((el) => !el.disabled && el.tabIndex !== -1);
}

function trapModalFocus(event) {
  if (event.key !== "Tab") return;
  const focusables = getModalFocusables(activeModal);
  if (!focusables.length) {
    event.preventDefault();
    return;
  }
  const currentIndex = focusables.indexOf(document.activeElement);
  if (event.shiftKey) {
    const prev = focusables[(currentIndex - 1 + focusables.length) % focusables.length];
    prev.focus();
  } else {
    const next = focusables[(currentIndex + 1) % focusables.length];
    next.focus();
  }
  event.preventDefault();
}

let activeModal = null;

function openModal(modal) {
  previousActiveElement = document.activeElement;
  activeModal = modal;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", trapModalFocus);
  requestAnimationFrame(() => {
    const focusables = getModalFocusables(activeModal);
    const first = focusables[0];
    if (first) first.focus();
  });
}

function closeModal() {
  const modal = activeModal;
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", trapModalFocus);
  if (activeProofCleanup && modal.id === "proofModal") {
    activeProofCleanup();
    activeProofCleanup = null;
  }
  activeModal = null;
  if (previousActiveElement && previousActiveElement.focus) {
    previousActiveElement.focus();
  }
}

function closeModalWithResult(result = null) {
  if (!activeModal) return null;
  const resolver = modalCloseResolver;
  closeModal();
  if (resolver) {
    modalCloseResolver = null;
    resolver(result);
  }
  return result;
}

function openSponsorModal() {
  openModal(document.querySelector("#sponsorModal"));
}

function closeSponsorModal() {
  closeModal();
}

function requestProof({ title = "补充实践证据", description = "" }) {
  return new Promise((resolve) => {
    const modal = document.querySelector("#proofModal");
    const titleNode = modal.querySelector("#proofTitle");
    const descNode = modal.querySelector("#proofDesc");
    const input = modal.querySelector("#proofInput");
    const submit = modal.querySelector("#proofSubmit");
    const cancel = modal.querySelector("#proofCancel");
    const close = modal.querySelector("#proofClose");

    titleNode.textContent = title;
    descNode.textContent = description;
    input.value = "";
    modalCloseResolver = resolve;

    openModal(modal);

    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      activeProofCleanup = null;
      cleanup();
      closeModalWithResult(value);
    };

    const handleSubmit = () => {
      const proof = toTrimmed(input.value);
      finish(proof || null);
    };
    const handleCancel = () => {
      finish(null);
    };
    const handleKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };
    const handleBackdropClose = (event) => {
      if (event.target === modal) {
        handleCancel();
      }
    };
    const cleanup = () => {
      submit.removeEventListener("click", handleSubmit);
      cancel.removeEventListener("click", handleCancel);
      close.removeEventListener("click", handleCancel);
      input.removeEventListener("keydown", handleKeydown);
      modal.removeEventListener("click", handleBackdropClose);
    };
    activeProofCleanup = cleanup;

    submit.addEventListener("click", handleSubmit);
    cancel.addEventListener("click", handleCancel);
    close.addEventListener("click", handleCancel);
    input.addEventListener("keydown", handleKeydown);
    modal.addEventListener("click", handleBackdropClose);
  });
}

function saveLead(lead) {
  state.leads.unshift(lead);
  if (!setStoredValue(storageKeys.leads, state.leads)) {
    showStorageUnavailableNotice();
  }
  renderContact();
}

function renderFeedbackCount() {
  document.querySelector("#feedbackCount").textContent = String(state.feedback.length);
}

function saveFeedback(entry) {
  state.feedback.unshift(entry);
  if (!setStoredValue(storageKeys.feedback, state.feedback)) {
    showStorageUnavailableNotice();
  }
  renderFeedbackCount();
}

function downloadFeedbackCsv() {
  if (!state.feedback.length) {
    showToast("还没有反馈可以导出。");
    return;
  }
  const headers = ["提交时间", "主题", "建议"];
  const rows = state.feedback.map((item) => [item.createdAt, item.topic, item.message]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadTextFile(csv, { fileName: `ai-learning-feedback-${getTodayKey()}.csv`, type: "text/csv;charset=utf-8", toastMessage: "反馈 CSV 已导出。" });
}

function downloadLeadsCsv() {
  if (!state.leads.length) {
    showToast("还没有报名记录可以导出。");
    return;
  }
  const headers = ["提交时间", "姓名", "联系方式", "身份或阶段", "最想学习", "留言"];
  const rows = state.leads.map((lead) => [
    lead.createdAt,
    lead.name,
    lead.contact,
    lead.profile,
    lead.interest,
    lead.message
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadTextFile(csv, { fileName: `ai-learning-leads-${getTodayKey()}.csv`, type: "text/csv;charset=utf-8", toastMessage: "报名 CSV 已导出。" });
}

function hasAnyLocalData() {
  return (
    state.leads.length > 0 ||
    state.feedback.length > 0 ||
    state.worldview30Done.size > 0 ||
    state.doneWeeks.size > 0 ||
    state.doneProjects.size > 0 ||
    Object.keys(state.weekProofs).length > 0 ||
    Object.keys(state.projectProofs).length > 0 ||
    state.bonusXp > 0 ||
    state.streak > 0 ||
    Boolean(state.lastCheckIn) ||
    Boolean(state.dailyDone)
  );
}

function exportAllLocalData() {
  if (!hasAnyLocalData()) {
    showToast("当前没有本机数据可导出。", 1400);
    return;
  }
  const payload = {
    exportedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    version: "1.0",
    storageSummary: {
      leads: state.leads.length,
      feedback: state.feedback.length,
      doneWeeks: state.doneWeeks.size,
      worldview30Done: state.worldview30Done.size,
      doneProjects: state.doneProjects.size
    },
    leads: state.leads,
    feedback: state.feedback,
    progress: {
      month: state.month,
      doneWeeks: [...state.doneWeeks],
      worldview30Done: [...state.worldview30Done],
      doneProjects: [...state.doneProjects],
      weekProofs: state.weekProofs,
      projectProofs: state.projectProofs,
      bonusXp: state.bonusXp,
      streak: state.streak,
      lastCheckIn: state.lastCheckIn,
      dailyDone: state.dailyDone
    }
  };
  downloadTextFile(JSON.stringify(payload, null, 2), {
    fileName: `ai-learning-local-data-${getTodayKey()}.json`,
    type: "application/json;charset=utf-8",
    toastMessage: "全部本机数据已导出。"
  });
}

function clearFeedbackData({ confirmFirst = false, showMessage = true } = {}) {
  if (!state.feedback.length) {
    if (showMessage) showToast("当前没有反馈数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    if (!window.confirm("确认清空所有本机反馈数据？清除后无法恢复。")) return false;
  }
  state.feedback = [];
  if (!removeStoredValue(storageKeys.feedback)) {
    showStorageUnavailableNotice();
  }
  renderFeedbackCount();
  if (showMessage) showToast("反馈数据已清空。", 1600);
  return true;
}

function clearLeadsData({ confirmFirst = false, showMessage = true } = {}) {
  if (!state.leads.length) {
    if (showMessage) showToast("当前没有报名数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    const needBackup = window.confirm("清空前建议先备份，是否先导出报名 CSV？");
    if (needBackup) {
      downloadLeadsCsv();
    }
    if (!window.confirm("确认清空所有本机报名数据？清除后可从页面手动恢复不了。")) {
      return false;
    }
  }
  state.leads = [];
  if (!removeStoredValue(storageKeys.leads)) {
    showStorageUnavailableNotice();
  }
  renderContact();
  if (showMessage) showToast("报名数据已清空。", 1600);
  return true;
}

function clearGameProgressData({ confirmFirst = false, showMessage = true } = {}) {
  if (
    !state.doneWeeks.size &&
    !state.doneProjects.size &&
    !state.worldview30Done.size &&
    !Object.keys(state.weekProofs).length &&
    !Object.keys(state.projectProofs).length &&
    state.bonusXp === 0 &&
    state.streak === 0 &&
    !state.lastCheckIn &&
    !state.dailyDone
  ) {
    if (showMessage) showToast("当前没有进度数据。", 1400);
    return false;
  }
  if (confirmFirst) {
    if (!window.confirm("确认清空所有本机任务与学习进度记录？清除后无法恢复。")) {
      return false;
    }
  }
  state.doneWeeks = new Set();
  state.worldview30Done = new Set();
  state.doneProjects = new Set();
  state.weekProofs = {};
  state.projectProofs = {};
  state.bonusXp = 0;
  state.streak = 0;
  state.lastCheckIn = "";
  state.dailyDone = "";
  if (!removeStoredValue(storageKeys.weeks) || !removeStoredValue(storageKeys.projects) || !removeStoredValue(storageKeys.weekProofs) || !removeStoredValue(storageKeys.projectProofs) || !removeStoredValue(storageKeys.bonusXp) || !removeStoredValue(storageKeys.streak) || !removeStoredValue(storageKeys.lastCheckIn) || !removeStoredValue(storageKeys.dailyDone)) {
    showStorageUnavailableNotice();
  }
  if (!removeStoredValue(storageKeys.worldview30Weeks)) {
    showStorageUnavailableNotice();
  }
  renderWeeks();
  renderProjects();
  renderBadges();
  refreshGame();
  if (showMessage) showToast("学习进度数据已清空。", 1600);
  return true;
}

function clearAllLocalData() {
  if (!hasAnyLocalData()) {
    showToast("当前没有本机数据可清空。", 1400);
    return;
  }
    const needBackup = window.confirm("清空前建议先备份，是否先导出全部本机数据？");
  if (needBackup) {
    exportAllLocalData();
  }
  if (!window.confirm("确认清空全部本机数据？包括报名、反馈和任务进度，清空后不可恢复。")) {
    return;
  }
  clearFeedbackData({ showMessage: false });
  clearLeadsData({ showMessage: false });
  clearGameProgressData({ showMessage: false });
  showToast("全部本机数据已清空。", 1800);
}

function buildIssueUrl({ title, body, labels = "" }) {
  const params = new URLSearchParams({ title, body });
  if (labels) params.set("labels", labels);
  return `${repoLinks.newIssue}?${params.toString()}`;
}

function getFeedbackDraft(form = document.querySelector("#feedbackForm")) {
  const data = new FormData(form);
  const fallback = state.feedback[0] || {};
  const topic = toTrimmed(data.get("topic")) || fallback.topic || "";
  const message = toTrimmed(data.get("message")) || fallback.message || "";
  if (!topic || !message) return null;
  return {
    title: `[Feedback] ${topic}`,
    body: [
      "## 反馈主题",
      "",
      topic,
      "",
      "## 建议内容",
      "",
      message,
      "",
      "## 来源",
      "",
      "- 来自 AI 原生能力自学站页面反馈表单",
      `- 生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}`
    ].join("\n")
  };
}

async function copyFeedbackIssueDraft() {
  const draft = getFeedbackDraft();
  if (!draft) {
    showToast("建议先把反馈主题和建议补齐，信息会更完整。", 1800);
    return;
  }
  const text = `${draft.title}\n\n${draft.body}`;
  await copyTextWithFallback(text, {
    successText: "反馈 Issue 草稿已复制，可粘贴到 GitHub。",
    failureText: "复制失败，请手动复制反馈内容。"
  });
}

function openFeedbackIssue() {
  const draft = getFeedbackDraft();
  if (!draft) {
    showToast("建议先把反馈主题和建议补齐，发 Issue 更完整。", 1800);
    return;
  }
  window.open(buildIssueUrl({ ...draft, labels: "feedback" }), "_blank", "noopener");
}

function getLeadDraft(form = document.querySelector("#registerForm")) {
  const data = new FormData(form);
  const fallbackLead = state.leads[0] || {};
  const lead = {
    name: toTrimmed(data.get("name")) || fallbackLead.name || "",
    contact: toTrimmed(data.get("contact")) || fallbackLead.contact || "",
    profile: data.get("profile") || fallbackLead.profile || "",
    interest: data.get("interest") || fallbackLead.interest || "",
    message: toTrimmed(data.get("message")) || fallbackLead.message || "",
    createdAt: fallbackLead.createdAt || new Date().toLocaleString("zh-CN", { hour12: false })
  };
  if (!lead.name || !lead.contact || !lead.profile || !lead.interest) return null;
  return lead;
}

function buildLeadContactText(lead) {
  return [
    "你好，我想加入 AI 原生能力自学站的月更学习名单。",
    "",
    `称呼：${lead.name}`,
    `联系方式：${lead.contact}`,
    `身份或阶段：${lead.profile}`,
    `最想学习：${lead.interest}`,
    lead.message ? `留言：${lead.message}` : "留言：",
    "",
    "说明：这段内容由网页本地生成，请通过邮箱或微信发送给主理人。"
  ].join("\n");
}

async function copyLeadContactDraft() {
  const lead = getLeadDraft();
  if (!lead) {
    showToast("建议先补齐报名信息，或者先用最近一条本机报名记录继续。", 2200);
    return;
  }
  await copyTextWithFallback(buildLeadContactText(lead), {
    successText: "联系草稿已复制，请通过邮箱或微信发给我。",
    failureText: "复制失败，请手动整理联系内容。"
  });
}

function openLeadEmailDraft() {
  const lead = getLeadDraft();
  if (!lead) {
    showToast("建议先补齐报名信息，或者先用最近一条本机报名记录继续。", 2200);
    return;
  }
  const subject = encodeURIComponent("加入 AI 原生能力自学站月更学习名单");
  const body = encodeURIComponent(buildLeadContactText(lead));
  window.location.href = `mailto:${getOwnerEmail()}?subject=${subject}&body=${body}`;
}

function updateProgress() {
  const value = Math.round((state.doneWeeks.size / weeks.length) * 100);
  document.querySelector("#progressValue").textContent = `${value}%`;
  updateGameHud();
}

function getXp() {
  return state.doneWeeks.size * 60 + state.doneProjects.size * 80 + state.bonusXp;
}

function getRank() {
  const xp = getXp();
  return ranks.reduce((current, rank) => (xp >= rank.min ? rank : current), ranks[0]);
}

function getNextRank() {
  const xp = getXp();
  return ranks.find((rank) => rank.min > xp) || ranks[ranks.length - 1];
}

function updateGameHud() {
  const xp = getXp();
  const rank = getRank();
  const nextRank = getNextRank();
  const nextXp = nextRank.min === rank.min ? rank.min + 240 : nextRank.min;
  const currentBase = rank.min;
  const percent = Math.min(100, Math.round(((xp - currentBase) / (nextXp - currentBase)) * 100));
  document.querySelector("#levelValue").textContent = `Lv.${ranks.indexOf(rank) + 1}`;
  document.querySelector("#xpValue").textContent = `${xp} XP`;
  document.querySelector("#streakValue").textContent = `${state.streak} 天`;
  document.querySelector("#rankTitle").textContent = rank.name;
  document.querySelector("#xpBar").style.width = `${percent}%`;
  document.querySelector("#nextRankText").textContent =
    nextRank.min === rank.min ? "已到达当前版本最高等级，继续打磨作品集。" : `距离「${nextRank.name}」还差 ${nextRank.min - xp} XP。`;

  const streakBanner = document.querySelector("#streakBanner");
  if (streakBanner) {
    const multiplier = state.streak >= 100 ? 3 : state.streak >= 30 ? 2 : state.streak >= 7 ? 1.5 : 1;
    if (state.streak >= 3 && multiplier > 1) {
      const tier = state.streak >= 100 ? "streak-100" : state.streak >= 30 ? "streak-30" : "streak-7";
      streakBanner.className = `streak-banner ${tier}`;
      streakBanner.innerHTML = `<span class="streak-fire">🔥</span> 连续 ${state.streak} 天 <span class="streak-multiplier">×${multiplier} XP</span>`;
      streakBanner.style.display = "flex";
    } else if (state.streak >= 3) {
      streakBanner.className = "streak-banner";
      streakBanner.innerHTML = `<span class="streak-fire">🔥</span> 连续 ${state.streak} 天`;
      streakBanner.style.display = "flex";
    } else {
      streakBanner.style.display = "none";
    }
  }
}

function renderDailyChallenge() {
  const todayKey = getTodayKey();
  const index = new Date().getDay();
  const [title, desc] = dailyChallenges[index];
  const done = state.dailyDone === todayKey;
  document.querySelector("#dailyTitle").textContent = title;
  document.querySelector("#dailyDesc").textContent = desc;
  document.querySelector("#dailyButton").textContent = done ? "今日练习已记录" : "记录今日练习 +35 XP";
  document.querySelector("#dailyButton").disabled = done;
  document.querySelector("#checkInButton").textContent = state.lastCheckIn === todayKey ? "今日已记录" : "记录今日进度 +20 XP";
  document.querySelector("#checkInButton").disabled = state.lastCheckIn === todayKey;
}

function renderBadges() {
  document.querySelector("#badgeWall").innerHTML = achievements
    .map((badge) => {
      const unlocked = badge.test();
      const tier = badge.tier || "bronze";
      const tierLabel = tier === "gold" ? "🥇金" : tier === "silver" ? "🥈银" : "🥉铜";
      return `
        <article class="achievement ${unlocked ? "unlocked badge-tier-${tier}" : ""}">
          <strong>${safeText(unlocked ? badge.title : "未解锁")} <span class="badge-tier-label ${tier}">${tierLabel}</span></strong>
          <span>${safeText(badge.desc)}</span>
        </article>
      `;
    })
    .join("");
}

function persistGameState() {
  const isStorageOk =
    setStoredValue(storageKeys.projects, [...state.doneProjects]) &&
    setStoredValue(storageKeys.worldview30Weeks, [...state.worldview30Done]) &&
    setStoredValue(storageKeys.weekProofs, state.weekProofs) &&
    setStoredValue(storageKeys.projectProofs, state.projectProofs) &&
    setStoredValue(storageKeys.bonusXp, state.bonusXp) &&
    setStoredValue(storageKeys.streak, state.streak) &&
    setStoredValue(storageKeys.lastCheckIn, state.lastCheckIn) &&
    setStoredValue(storageKeys.dailyDone, state.dailyDone);
  if (!isStorageOk) {
    showStorageUnavailableNotice();
  }
}

function showToast(message, duration = 1800) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const region = document.querySelector("#statusRegion");
  if (region) region.textContent = message;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = message;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, duration);
}

function refreshGame() {
  updateGameHud();
  renderDailyChallenge();
  renderBadges();
  renderInviteSection();
  renderXpShop();
  renderDailyTasks();
}

/* ====== P2-9: Daily Tasks System ====== */
const DAILY_TASKS_KEY = "ai-learning-daily-tasks";

const dailyTasksPool = [
  { id: "checkin", title: "记录今日进度", xp: 20, desc: "点击「记录今日进度」按钮，养成每日签到习惯。" },
  { id: "dailyChallenge", title: "完成今日挑战", xp: 35, desc: "完成每日挑战，获得额外 XP 奖励。" },
  { id: "readModule", title: "阅读一个学习模块", xp: 10, desc: "进入任意学习路线，完整阅读一个模块的内容。" },
  { id: "shareProgress", title: "分享学习进度", xp: 10, desc: "生成并分享你的学习进度图片。" },
  { id: "feedback", title: "提交一条反馈", xp: 10, desc: "对站点内容提出改进建议，帮助更多人。" },
  { id: "copyPrompt", title: "复制一个 Prompt 模板", xp: 5, desc: "进入模板工具区，复制一个模板到剪贴板。" },
  { id: "exploreAgent", title: "探索一个 Agent 角色", xp: 5, desc: "在 Agent 角色学院中浏览一个角色卡。" },
];

function getTodayTasks() {
  const todayKey = getTodayKey();
  const stored = getStoredObject(DAILY_TASKS_KEY, {});
  if (stored.date === todayKey) return stored;
  // Generate new daily tasks (pick 3 from pool)
  const seed = todayKey.split("-").reduce((a, b) => a + Number(b), 0);
  const shuffled = [...dailyTasksPool].sort((a, b) => {
    const ha = (seed * a.id.length) % 100;
    const hb = (seed * b.id.length) % 100;
    return ha - hb;
  });
  const tasks = shuffled.slice(0, 3);
  const newTasks = { date: todayKey, tasks, completed: [] };
  setStoredValue(DAILY_TASKS_KEY, newTasks);
  return newTasks;
}

function completeTask(taskId) {
  const todayTasks = getTodayTasks();
  if (todayTasks.completed.includes(taskId)) return;
  todayTasks.completed.push(taskId);
  setStoredValue(DAILY_TASKS_KEY, todayTasks);
  const task = todayTasks.tasks.find(t => t.id === taskId);
  if (task) {
    state.bonusXp += task.xp;
    persistGameState();
    refreshGame();
    showToast(`任务完成：${task.title}，获得 ${task.xp} XP！`);
  }
}

function renderDailyTasks() {
  const container = document.querySelector("#dailyTasksSection");
  if (!container) return;
  const todayTasks = getTodayTasks();
  const totalXp = todayTasks.tasks.reduce((sum, t) => sum + t.xp, 0);
  const earnedXp = todayTasks.tasks
    .filter(t => todayTasks.completed.includes(t.id))
    .reduce((sum, t) => sum + t.xp, 0);
  const allDone = todayTasks.tasks.every(t => todayTasks.completed.includes(t.id));

  container.innerHTML = `
    <div style="margin-top:20px;padding:16px;background:rgba(143,47,42,0.04);border-radius:12px;border:1px solid rgba(143,47,42,0.1);">
      <h4 style="font-size:0.95rem;margin-bottom:8px;">📋 今日任务 <span style="font-size:0.78rem;color:var(--muted);">可获得 ${totalXp} XP · 已获得 ${earnedXp} XP</span></h4>
      ${todayTasks.tasks.map(task => {
        const isDone = todayTasks.completed.includes(task.id);
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:10px;margin-bottom:8px;border-radius:8px;background:${isDone ? 'rgba(95,127,82,0.08)' : 'var(--surface)'};border:1px solid ${isDone ? 'rgba(95,127,82,0.3)' : 'var(--line)'};transition:all 0.2s;">
            <span style="font-size:1.2rem;">${isDone ? '✅' : '⬜'}</span>
            <div style="flex:1;">
              <strong style="font-size:0.85rem;color:${isDone ? 'var(--plant)' : 'var(--ink)'};">${safeText(task.title)} <span style="font-size:0.72rem;color:var(--jujube);">+${task.xp} XP</span></strong>
              <div style="font-size:0.78rem;color:var(--muted);">${safeText(task.desc)}</div>
            </div>
            ${!isDone ? `<button onclick="completeTask('${task.id}')" style="padding:4px 12px;font-size:0.78rem;background:var(--earth);color:#fff;border:none;border-radius:6px;cursor:pointer;min-height:32px;">完成</button>` : ''}
          </div>
        `;
      }).join("")}
      ${allDone ? '<div style="text-align:center;padding:8px;font-size:0.85rem;color:var(--plant);">🎉 今日任务全部完成！</div>' : ''}
    </div>
  `;
}

