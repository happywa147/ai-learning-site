const tracks = {
  freshman: {
    title: "零基础入门路线",
    summary: "先建立 AI 素养，再把 AI 用到学习、写作、资料整理、编程入门和个人作品集中。",
    outcomes: ["能独立判断一个 AI 工具是否适合自己", "能用 AI 辅助完成学习、研究与资料整理", "能做出一个可展示的小应用或分析报告"],
    modules: [
      ["认知", "大模型、Token、上下文、多模态、幻觉与验证"],
      ["学习", "AI 读书、论文精读、知识复盘、资料助教"],
      ["表达", "结构化写作、PPT、演讲稿、简历与作品集"],
      ["底线", "隐私、引用、学术诚信、版权与事实核查"]
    ]
  },
  creator: {
    title: "短视频创作者路线",
    summary: "把 AI 用在选题、脚本、分镜、配音、画面、剪辑和复盘，服务抖音、快手、小红书、B 站等内容生态。",
    outcomes: ["能搭建稳定的短视频生产流程", "能用 AI 做选题测试和脚本迭代", "能理解平台内容风格差异"],
    modules: [
      ["选题", "人群、痛点、热点、标题、封面钩子"],
      ["脚本", "口播、剧情、知识科普、带货与直播切片"],
      ["画面", "即梦、可灵、通义万相、剪映等工具流"],
      ["复盘", "完播率、互动率、转粉率、评论洞察"]
    ]
  },
  builder: {
    title: "AI 应用开发路线",
    summary: "从 Python/JavaScript 入门，理解 API、RAG、Agent、MCP 与自动化，把想法做成可运行工具。",
    outcomes: ["能调用模型 API 做小工具", "能设计一个 Agent 工作流", "能把 Skill 固化成可复用能力"],
    modules: [
      ["编程", "Python 脚本、网页前端、数据处理、API 调用"],
      ["RAG", "文档切分、向量检索、引用来源、知识库问答"],
      ["Agent", "任务拆解、工具调用、浏览器/代码/搜索协作"],
      ["部署", "本地原型、云端服务、成本估算、日志监控"]
    ]
  }
};

const ownerContact = {
  name: "舰理 Lonny",
  emailParts: ["happywa147", "gmail", "com"],
  qrImage: "./assets/wechat-qr.jpg",
  items: [
    ["微信", "扫码添加"],
    ["邮箱", "点击复制"],
    ["地区", "江苏 无锡"]
  ]
};

const weeks = [
  ["第 1 周", "AI 认知与工具地图", "会区分模型、应用、插件、Agent"],
  ["第 2 周", "Prompt 基础", "写出可复用的任务提示词"],
  ["第 3 周", "上下文工程", "学会喂资料、设格式、做验证"],
  ["第 4 周", "AI 辅助学习", "完成一次学习资料整理和复盘"],
  ["第 5 周", "Python 入门", "做一个自动处理表格的小脚本"],
  ["第 6 周", "网页入门", "做一个个人 AI 作品主页"],
  ["第 7 周", "模型 API", "调用一个模型完成问答或生成任务"],
  ["第 8 周", "RAG 知识库", "让 AI 基于自己的资料回答"],
  ["第 9 周", "Agent 工作流", "设计工具调用与任务拆解流程"],
  ["第 10 周", "短视频生产", "完成选题、脚本、分镜、剪辑方案"],
  ["第 11 周", "中国市场应用", "分析一个 AI 产品的商业模式"],
  ["第 12 周", "作品集发布", "整理 3 个作品并写项目说明"]
];

const monthlyUpdates = [
  {
    id: "2026-07",
    label: "2026 年 7 月",
    title: "从会用工具，升级到会搭工作流",
    summary: "本月重点不是追每一个新模型，而是建立自己的模型选择法、Agent 任务拆解法和内容生产闭环。所有结论都要按月复查，避免把旧规则当成新常识。",
    cards: [
      {
        title: "模型观察",
        items: [
          "国际模型看推理、代码、多模态和 Agent 协作能力。",
          "国内模型看中文、成本、长文本、内容生态和企业落地。",
          "同一任务至少用 2 个模型交叉验证，记录各自强弱。"
        ]
      },
      {
        title: "中国应用市场",
        items: [
          "重点观察 AI 搜索、AI 办公、AI 编程、AI 视频和企业知识库。",
          "短视频场景关注选题、脚本、分镜、配音、剪辑、复盘全链路。",
          "判断产品时看真实场景、付费意愿、交付成本和合规边界。"
        ]
      },
      {
        title: "本月训练",
        items: [
          "做一张自己的模型对比表：写作、编程、长文档、视频、Agent。",
          "搭一个 3 步 Agent 流程：输入、工具、输出验收标准。",
          "完成 1 条短视频从选题到分镜的完整方案。"
        ]
      },
      {
        title: "避坑提醒",
        items: [
          "不要只看榜单，必须拿自己的任务实测。",
          "不要把 AI 输出直接当事实，重要内容要查来源。",
          "不要囤工具，先固定 3 到 5 个高频工具形成肌肉记忆。"
        ]
      }
    ]
  },
  {
    id: "2026-08",
    label: "2026 年 8 月",
    title: "预留更新：作品集与真实场景",
    summary: "下月建议围绕作品集、真实用户反馈、工具成本和自动化流程继续更新。这里保留为可扩展模板。",
    cards: [
      {
        title: "模型观察",
        items: ["补充当月模型变化。", "更新国内外模型实测。", "记录适合自己的默认模型组合。"]
      },
      {
        title: "市场观察",
        items: ["补充当月中国应用热点。", "观察短视频、电商、办公、教育场景。", "记录 1 个值得拆解的 AI 产品。"]
      },
      {
        title: "本月训练",
        items: ["完成 1 个可展示作品。", "做 1 次真实用户反馈。", "整理 1 份项目复盘。"]
      },
      {
        title: "避坑提醒",
        items: ["复查上月结论。", "删除低频工具。", "把常用流程沉淀成模板。"]
      }
    ]
  }
];

const worldviewItems = [
  {
    title: "把 AI 看成新基础设施",
    text: "它不是一个软件，而是一层新的生产力底座，会进入学习、办公、制造、内容、科研、商业和公共服务。"
  },
  {
    title: "从记住答案到提出好问题",
    text: "AI 降低了获取答案的成本，人的价值更集中在定义问题、设定标准、判断真假和选择方向。"
  },
  {
    title: "从单人能力到人机协作能力",
    text: "未来的强者不是不用 AI 的人，也不是盲信 AI 的人，而是能指挥、校验、组合 AI 的人。"
  },
  {
    title: "从工具清单到工作流系统",
    text: "不要追着每个新工具跑。真正有复利的是把常用任务沉淀成 Prompt、Agent、Skill 和可复用流程。"
  },
  {
    title: "从信息消费者到作品创造者",
    text: "AI 会让内容更多，注意力更稀缺。最好的学习证据不是收藏了多少资料，而是做出了什么作品。"
  },
  {
    title: "同时看中国市场与全球格局",
    text: "国际模型提供技术前沿参照，中国市场提供高频真实场景。两边都看，视野才不窄。"
  },
  {
    title: "保持验证精神",
    text: "AI 会流畅地犯错。越是看起来顺滑的答案，越要追问来源、边界、反例和成本。"
  },
  {
    title: "守住人的责任",
    text: "隐私、版权、偏见、学术诚信和商业合规都不能外包给模型。工具越强，人越要有边界感。"
  }
];

function renderWorldview() {
  document.querySelector("#worldviewGrid").innerHTML = worldviewItems
    .map(
      (item, index) => `
        <article class="worldview-card">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

const dailyChallenges = [
  ["模型侦察", "任选一个模型，记录它最适合的 3 个任务和 1 个明显短板。"],
  ["Prompt 打磨", "把一个随手问题改写成有目标、约束、格式和评价标准的 Prompt。"],
  ["工具试炼", "用 AI 完成一次资料整理，并把原始资料和输出结果对比检查。"],
  ["短视频演练", "为一个成长、行业或兴趣主题写 3 个标题、1 个开头钩子和 30 秒脚本。"],
  ["代码小步", "让 AI 帮你写一个 20 行以内的小脚本，然后逐行解释给自己听。"],
  ["事实核查", "找出 AI 回答中 2 个需要核实的点，并记录核实来源。"],
  ["作品推进", "给自己的一个 AI 项目补一段项目说明：目标、输入、输出、边界。"]
];

const models = [
  {
    name: "ChatGPT / OpenAI",
    desc: "适合通用推理、编程协作、多模态任务和产品原型。适合拿来当国际基准模型观察。",
    tags: ["国际", "编程", "多模态", "Agent"]
  },
  {
    name: "Claude",
    desc: "长文档阅读、写作润色、代码解释和复杂任务分解表现突出，适合深度学习与文本工作。",
    tags: ["国际", "长文本", "写作", "代码"]
  },
  {
    name: "Gemini",
    desc: "与搜索、文档、视频理解和 Google 生态结合紧密，适合做多模态学习参考。",
    tags: ["国际", "多模态", "搜索", "视频"]
  },
  {
    name: "DeepSeek",
    desc: "在中文、推理、代码和开源生态中影响力强，适合学习推理模型与低成本应用开发。",
    tags: ["国内", "推理", "编程", "开源"]
  },
  {
    name: "通义千问 / Qwen",
    desc: "阿里生态覆盖广，开源模型、云服务、多模态和企业应用都值得关注。",
    tags: ["国内", "开源", "云服务", "多模态"]
  },
  {
    name: "Kimi",
    desc: "长文本、资料阅读和中文信息处理是学习场景常用方向，适合做论文与资料助手。",
    tags: ["国内", "长文本", "学习", "资料整理"]
  },
  {
    name: "豆包 / 火山引擎",
    desc: "贴近内容生态和国内消费级应用，适合观察短视频、图像、语音和创作工具链。",
    tags: ["国内", "短视频", "创作", "语音"]
  },
  {
    name: "文心 / 腾讯混元 / 智谱 GLM",
    desc: "适合观察国内企业级、办公、搜索、政务和行业应用落地，对理解中国市场很有帮助。",
    tags: ["国内", "企业应用", "办公", "行业"]
  },
  {
    name: "可灵 / 即梦 / 通义万相",
    desc: "偏视频与图像生成工具，适合短视频、广告、电商素材和创意表达训练。",
    tags: ["国内", "视频", "图像", "内容生产"]
  }
];

const projects = [
  {
    title: "AI 学习助教",
    desc: "上传学习资料，整理重点、生成测验、输出复习计划。",
    tasks: ["资料结构化", "错题与薄弱点记录", "生成一份复习报告"]
  },
  {
    title: "短视频脚本工厂",
    desc: "面向抖音/小红书/B 站，做选题、标题、脚本、分镜和复盘。",
    tasks: ["建立 30 个选题库", "生成 5 条脚本", "完成 1 条剪辑方案"]
  },
  {
    title: "个人知识库问答",
    desc: "把笔记、PDF、学习资料做成可追溯引用的问答助手。",
    tasks: ["资料清洗", "知识库检索", "答案引用来源"]
  },
  {
    title: "AI 简历与作品集",
    desc: "把项目经历、实践成果和自学成果包装成可展示作品集。",
    tasks: ["经历量化", "项目说明", "个人主页"]
  },
  {
    title: "中国 AI 产品观察",
    desc: "选择一个国内 AI 产品，拆解用户、场景、商业模式和增长路径。",
    tasks: ["竞品对比", "用户访谈", "写一份产品分析"]
  },
  {
    title: "Agent 小工具",
    desc: "做一个能调用搜索、代码或文档工具的自动化助手。",
    tasks: ["任务拆解", "工具清单", "日志与失败处理"]
  }
];

const ranks = [
  { name: "AI 见习生", min: 0 },
  { name: "Prompt 探索者", min: 160 },
  { name: "工具驯化者", min: 360 },
  { name: "Agent 策划师", min: 620 },
  { name: "AI 作品制作人", min: 940 },
  { name: "AI 原生创造者", min: 1320 }
];

const achievements = [
  { id: "firstWeek", title: "点火", desc: "完成任意一周学习任务", test: () => state.doneWeeks.size >= 1 },
  { id: "threeWeeks", title: "进入节奏", desc: "完成 3 周学习任务", test: () => state.doneWeeks.size >= 3 },
  { id: "halfWay", title: "半程推进", desc: "完成 6 周学习任务", test: () => state.doneWeeks.size >= 6 },
  { id: "projectOne", title: "第一件作品", desc: "点亮 1 个作品项目", test: () => state.doneProjects.size >= 1 },
  { id: "creator", title: "作品集雏形", desc: "点亮 3 个作品项目", test: () => state.doneProjects.size >= 3 },
  { id: "streak", title: "连续手感", desc: "连续签到 3 天", test: () => state.streak >= 3 }
];

const templates = {
  prompt: `你是我的 AI 学习教练。

目标：帮助我学习【主题】。
我的基础：【零基础/有一点编程/会做内容】。
输出要求：
1. 先用 200 字讲清核心概念
2. 给 3 个真实应用场景
3. 设计一个 30 分钟练习
4. 最后用 5 道题检查我是否学会

约束：不要空泛鼓励，遇到不确定信息请标注“需要核实”。`,
  agent: `Agent 名称：学习资料助教

目标：把一组学习资料变成可复习、可测试、可追踪的学习系统。
输入：PDF、笔记、文章、题目、项目资料。
工具：
- 文档解析：提取章节、概念、公式
- 检索：回答问题时引用来源
- 测验生成：按难度生成题目
- 复盘表：记录错题和薄弱点

工作流：
1. 建立主题知识地图
2. 按模块输出重点、难点和例题
3. 生成自测题
4. 根据错题生成下一周复习计划`,
  skill: `Skill：短视频脚本生成

适用场景：知识科普、个人成长、行业观察、产品介绍。
固定输入：
- 平台：抖音 / 小红书 / B 站 / 快手
- 目标人群：
- 主题：
- 时长：
- 风格：

固定输出：
1. 3 个标题
2. 5 秒开头钩子
3. 分镜脚本
4. 口播稿
5. 拍摄/剪辑建议
6. 发布后复盘指标`
};

const state = {
  track: "freshman",
  template: "prompt",
  month: localStorage.getItem("ai-learning-month") || monthlyUpdates[0].id,
  leads: JSON.parse(localStorage.getItem("ai-learning-leads") || "[]"),
  doneWeeks: new Set(JSON.parse(localStorage.getItem("ai-learning-weeks") || "[]")),
  doneProjects: new Set(JSON.parse(localStorage.getItem("ai-learning-projects") || "[]")),
  bonusXp: Number(localStorage.getItem("ai-learning-bonus-xp") || "0"),
  streak: Number(localStorage.getItem("ai-learning-streak") || "0"),
  lastCheckIn: localStorage.getItem("ai-learning-last-checkin") || "",
  dailyDone: localStorage.getItem("ai-learning-daily-done") || ""
};

const todayKey = new Date().toISOString().slice(0, 10);

function renderTrack() {
  const track = tracks[state.track];
  const detail = document.querySelector("#trackDetail");
  detail.innerHTML = `
    <article class="track-card">
      <h3>${track.title}</h3>
      <p class="muted">${track.summary}</p>
      <ul>${track.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
    </article>
    <div class="track-modules">
      ${track.modules
        .map(([name, text]) => `<article class="module"><span>${name}</span><h3>${name}模块</h3><p class="muted">${text}</p></article>`)
        .join("")}
    </div>
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
          <span><strong>${week} · ${title}</strong><small class="muted">${goal}</small></span>
          <span class="tag">${checked ? "已完成" : "待学习"}</span>
        </label>
      `;
    })
    .join("");
  updateProgress();
}

function renderMonthOptions() {
  const select = document.querySelector("#monthSelect");
  select.innerHTML = monthlyUpdates.map((month) => `<option value="${month.id}">${month.label}</option>`).join("");
  select.value = state.month;
}

function renderMonthlyUpdate() {
  const update = monthlyUpdates.find((month) => month.id === state.month) || monthlyUpdates[0];
  document.querySelector("#monthBadge").textContent = update.label;
  document.querySelector("#monthTitle").textContent = update.title;
  document.querySelector("#monthSummary").textContent = update.summary;
  document.querySelector("#monthFocusCount").textContent = update.cards.length;
  document.querySelector("#monthlyGrid").innerHTML = update.cards
    .map(
      (card) => `
        <article class="monthly-card">
          <h3>${card.title}</h3>
          <ul>${card.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderModels(keyword = "") {
  const grid = document.querySelector("#modelGrid");
  const query = keyword.trim().toLowerCase();
  const filtered = models.filter((model) => {
    const text = `${model.name} ${model.desc} ${model.tags.join(" ")}`.toLowerCase();
    return text.includes(query);
  });
  grid.innerHTML = filtered
    .map(
      (model) => `
      <article class="model-card">
        <h3>${model.name}</h3>
        <p>${model.desc}</p>
        <footer>${model.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</footer>
      </article>
    `
    )
    .join("");
}

function renderProjects() {
  document.querySelector("#projectGrid").innerHTML = projects
    .map((project, index) => {
      const done = state.doneProjects.has(index);
      const locked = getXp() < 160 && index > 1;
      return `
      <article class="project-card ${locked ? "locked" : ""}">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <ul>${project.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
        <button class="${done ? "primary-btn" : "ghost-btn"} small project-toggle" data-project="${index}">
          ${done ? "已点亮 +80 XP" : "点亮作品 +80 XP"}
        </button>
      </article>
    `;
    })
    .join("");
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
          ? `<button id="copyEmail" class="ghost-btn small" type="button">${value}</button>`
          : `<strong>${value}</strong>`;
      return `
        <div class="contact-item">
          <span>${label}</span>
          ${content}
        </div>
      `;
    })
    .join("");
  document.querySelector("#contactList").insertAdjacentHTML(
    "afterbegin",
    `<div class="qr-card"><img src="${ownerContact.qrImage}" alt="微信二维码" /><span>微信二维码</span></div>`
  );
  document.querySelector("#leadCount").textContent = state.leads.length;
}

function getOwnerEmail() {
  return `${ownerContact.emailParts[0]}@${ownerContact.emailParts[1]}.${ownerContact.emailParts[2]}`;
}

function openSponsorModal() {
  const modal = document.querySelector("#sponsorModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeSponsorModal() {
  const modal = document.querySelector("#sponsorModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function saveLead(lead) {
  state.leads.unshift(lead);
  localStorage.setItem("ai-learning-leads", JSON.stringify(state.leads));
  renderContact();
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
  const escapeCell = (value) => `"${String(value || "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-learning-leads-${todayKey}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("报名 CSV 已导出。");
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
}

function renderDailyChallenge() {
  const index = new Date().getDay();
  const [title, desc] = dailyChallenges[index];
  const done = state.dailyDone === todayKey;
  document.querySelector("#dailyTitle").textContent = title;
  document.querySelector("#dailyDesc").textContent = desc;
  document.querySelector("#dailyButton").textContent = done ? "今日挑战已完成" : "完成挑战 +35 XP";
  document.querySelector("#dailyButton").disabled = done;
  document.querySelector("#checkInButton").textContent = state.lastCheckIn === todayKey ? "今日已签到" : "今日签到 +20 XP";
  document.querySelector("#checkInButton").disabled = state.lastCheckIn === todayKey;
}

function renderBadges() {
  document.querySelector("#badgeWall").innerHTML = achievements
    .map((badge) => {
      const unlocked = badge.test();
      return `
        <article class="achievement ${unlocked ? "unlocked" : ""}">
          <strong>${unlocked ? badge.title : "未解锁"}</strong>
          <span>${badge.desc}</span>
        </article>
      `;
    })
    .join("");
}

function persistGameState() {
  localStorage.setItem("ai-learning-projects", JSON.stringify([...state.doneProjects]));
  localStorage.setItem("ai-learning-bonus-xp", String(state.bonusXp));
  localStorage.setItem("ai-learning-streak", String(state.streak));
  localStorage.setItem("ai-learning-last-checkin", state.lastCheckIn);
  localStorage.setItem("ai-learning-daily-done", state.dailyDone);
}

function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, 1800);
}

function refreshGame() {
  updateGameHud();
  renderDailyChallenge();
  renderBadges();
}

document.querySelectorAll("[data-track]").forEach((button) => {
  button.addEventListener("click", () => {
    state.track = button.dataset.track;
    document.querySelectorAll("[data-track]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTrack();
  });
});

document.querySelector("#weekList").addEventListener("change", (event) => {
  const input = event.target.closest("[data-week]");
  if (!input) return;
  const index = Number(input.dataset.week);
  if (input.checked) state.doneWeeks.add(index);
  else state.doneWeeks.delete(index);
  localStorage.setItem("ai-learning-weeks", JSON.stringify([...state.doneWeeks]));
  renderWeeks();
  renderProjects();
  renderBadges();
  showToast(input.checked ? "任务完成，获得 60 XP。" : "任务已取消，XP 已重新计算。");
});

document.querySelector("#projectGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-project]");
  if (!button) return;
  const index = Number(button.dataset.project);
  if (state.doneProjects.has(index)) state.doneProjects.delete(index);
  else state.doneProjects.add(index);
  persistGameState();
  renderProjects();
  refreshGame();
  showToast(state.doneProjects.has(index) ? "作品已点亮，获得 80 XP。" : "作品已取消点亮。");
});

document.querySelector("#modelSearch").addEventListener("input", (event) => {
  renderModels(event.target.value);
});

document.querySelector("#monthSelect").addEventListener("change", (event) => {
  state.month = event.target.value;
  localStorage.setItem("ai-learning-month", state.month);
  renderMonthlyUpdate();
});

document.querySelectorAll("[data-template]").forEach((button) => {
  button.addEventListener("click", () => {
    state.template = button.dataset.template;
    document.querySelectorAll("[data-template]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTemplate();
  });
});

document.querySelector("#copyTemplate").addEventListener("click", async () => {
  await navigator.clipboard.writeText(templates[state.template]);
  const button = document.querySelector("#copyTemplate");
  button.textContent = "已复制";
  setTimeout(() => {
    button.textContent = "复制模板";
  }, 1200);
});

document.querySelector("#checkInButton").addEventListener("click", () => {
  if (state.lastCheckIn === todayKey) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = state.lastCheckIn === yesterday ? state.streak + 1 : 1;
  state.lastCheckIn = todayKey;
  state.bonusXp += 20;
  persistGameState();
  refreshGame();
  showToast("签到成功，获得 20 XP。");
});

document.querySelector("#dailyButton").addEventListener("click", () => {
  if (state.dailyDone === todayKey) return;
  state.dailyDone = todayKey;
  state.bonusXp += 35;
  persistGameState();
  refreshGame();
  showToast("今日挑战完成，获得 35 XP。");
});

document.querySelector("#registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  saveLead({
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    name: data.get("name"),
    contact: data.get("contact"),
    profile: data.get("profile"),
    interest: data.get("interest"),
    message: data.get("message")
  });
  form.reset();
  showToast("注册成功，信息已保存在本机。");
});

document.querySelector("#exportLeads").addEventListener("click", downloadLeadsCsv);

document.querySelector("#contactList").addEventListener("click", async (event) => {
  const button = event.target.closest("#copyEmail");
  if (!button) return;
  await navigator.clipboard.writeText(getOwnerEmail());
  button.textContent = "已复制";
  showToast("邮箱已复制。");
  setTimeout(() => {
    button.textContent = "点击复制";
  }, 1200);
});

document.querySelector("#sponsorNav").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorFloat").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorClose").addEventListener("click", closeSponsorModal);
document.querySelector("#sponsorModal").addEventListener("click", (event) => {
  if (event.target.id === "sponsorModal") closeSponsorModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSponsorModal();
});
document.querySelector("#sponsorCopyEmail").addEventListener("click", async () => {
  await navigator.clipboard.writeText(getOwnerEmail());
  showToast("邮箱已复制，可联系赞助合作。");
});

renderTrack();
renderWorldview();
renderMonthOptions();
renderMonthlyUpdate();
renderWeeks();
renderModels();
renderProjects();
renderTemplate();
renderContact();
refreshGame();
