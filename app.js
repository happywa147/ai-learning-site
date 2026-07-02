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

const repoLinks = {
  newIssue: "https://github.com/happywa147/ai-learning-site/issues/new"
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

const starterSteps = [
  {
    title: "选一条路线",
    text: "从零基础、内容创作或应用开发里选一个入口，先确定本月主线。",
    action: "查看路线",
    href: "#map"
  },
  {
    title: "完成今日挑战",
    text: "用 10 分钟做一次模型侦察、Prompt 打磨或事实核查，先拿到手感。",
    action: "进入任务板",
    href: "#game"
  },
  {
    title: "点亮一个作品",
    text: "从样例里挑一个方向，把学习结果变成能展示、能复盘的产出。",
    action: "看作品样例",
    href: "#showcase"
  }
];

const showcaseItems = [
  {
    title: "AI 学习助教报告",
    type: "学习型作品",
    text: "把一份课程资料整理成知识地图、自测题和 7 天复习计划。",
    outputs: ["知识地图", "自测题", "复习计划"]
  },
  {
    title: "短视频脚本工厂",
    type: "内容型作品",
    text: "围绕一个垂直主题，输出选题库、标题、口播稿、分镜和复盘指标。",
    outputs: ["30 个选题", "5 条脚本", "分镜表"]
  },
  {
    title: "个人知识库问答",
    type: "应用型作品",
    text: "让 AI 基于自己的笔记或资料回答问题，并保留引用来源和边界说明。",
    outputs: ["资料清洗", "问答流程", "引用来源"]
  },
  {
    title: "中国 AI 产品观察",
    type: "商业型作品",
    text: "拆解一个国内 AI 产品的目标用户、核心场景、收费方式和增长路径。",
    outputs: ["竞品表", "用户画像", "机会判断"]
  }
];

const agentRoleCategories = [
  ["all", "全部"],
  ["core", "核心素养"],
  ["engineering", "工程开发"],
  ["research", "研究核验"],
  ["content", "内容短视频"],
  ["product", "产品体验"],
  ["growth", "增长商业"],
  ["design", "设计品牌"],
  ["safety", "安全治理"],
  ["learning", "学习教练"]
];

const agentRoles = [
  {
    name: "Prompt 工程师",
    category: "core",
    source: "engineering-prompt-engineer",
    level: "入门必修",
    useFor: "把模糊需求变成稳定、可复用的任务提示。",
    input: "目标、对象、限制、示例、输出格式。",
    output: "结构化 Prompt、测试用例、失败修正建议。",
    check: "同一任务换 2 个模型仍能得到可用结果。",
    practice: "把“帮我写一篇文章”改成一条可复用内容生产 Prompt。"
  },
  {
    name: "Agent 工作流架构师",
    category: "core",
    source: "engineering-multi-agent-systems-architect",
    level: "进阶核心",
    useFor: "判断什么时候用单 Agent，什么时候拆成多角色协作。",
    input: "任务目标、可用工具、风险、人工审核点。",
    output: "角色分工、输入输出契约、失败恢复路径。",
    check: "每个角色都说得清“负责什么”和“不负责什么”。",
    practice: "设计一个“资料收集 → 核验 → 写作 → 审稿”的四步工作流。"
  },
  {
    name: "事实核验员",
    category: "research",
    source: "product-trend-researcher / research workflow",
    level: "可信度底座",
    useFor: "检查模型、工具、市场判断是否有来源和边界。",
    input: "待核查结论、来源链接、复核日期。",
    output: "证据等级、疑点清单、可引用/不可引用判断。",
    check: "重要结论至少有一个可靠来源或一条实测记录。",
    practice: "为本月模型观察补 3 条官方来源和 1 条实测任务。"
  },
  {
    name: "最小改动工程师",
    category: "engineering",
    source: "engineering-minimal-change-engineer",
    level: "工程习惯",
    useFor: "修 bug 或补小功能时控制范围，避免越改越乱。",
    input: "问题描述、相关文件、验收标准。",
    output: "最小 diff、风险说明、验证记录。",
    check: "只改和问题直接相关的文件，且能说明为什么。",
    practice: "修一个按钮文案或表单校验问题，并写出验证步骤。"
  },
  {
    name: "代码审查员",
    category: "engineering",
    source: "engineering-code-reviewer",
    level: "质量关卡",
    useFor: "发现 bug、回归风险、安全隐患和缺测试。",
    input: "diff、运行方式、核心用户路径。",
    output: "按严重级别排列的问题清单。",
    check: "每条问题都能指向具体文件、场景和后果。",
    practice: "审查一次页面表单改动，找出隐私和交互风险。"
  },
  {
    name: "技术手册作者",
    category: "engineering",
    source: "engineering-technical-writer",
    level: "开源必备",
    useFor: "让项目易读、易运行、易贡献、易复现。",
    input: "功能说明、命令、数据格式、常见问题。",
    output: "README、贡献指南、Schema 文档、验证清单。",
    check: "新人照着文档能在 10 分钟内跑起来。",
    practice: "给一个 JSON 数据文件补字段说明和提交前检查。"
  },
  {
    name: "GEO / AI 搜索优化官",
    category: "growth",
    source: "marketing-agentic-search-optimizer",
    level: "增长进阶",
    useFor: "让 AI 搜索、问答引擎和浏览器 agent 更容易理解网站。",
    input: "页面结构、FAQ、llms.txt、结构化数据。",
    output: "可引用答案块、Schema 建议、任务可完成性检查。",
    check: "用户问问题时，AI 能引用清楚段落，而不是猜测。",
    practice: "为一个 FAQ 补 2 句可直接引用的短答案。"
  },
  {
    name: "增长黑客",
    category: "growth",
    source: "marketing-growth-hacker",
    level: "传播实验",
    useFor: "设计 Star、分享、复访和贡献转化路径。",
    input: "访问入口、CTA、用户行为、传播素材。",
    output: "增长实验、指标、预期影响、复盘方式。",
    check: "每个动作都有可观察指标，如 Star、Issue、复访。",
    practice: "设计一个“完成周报后分享到 GitHub Issue”的流程。"
  },
  {
    name: "中文总编辑",
    category: "content",
    source: "marketing-book-co-author / content creator",
    level: "表达校准",
    useFor: "把空泛口号改成具体、克制、有证据的中文表达。",
    input: "页面文案、目标读者、证据材料。",
    output: "结构调整、标题建议、删改清单。",
    check: "读者能知道今天该做什么，而不是只被鼓舞。",
    practice: "把一段 AI 学习口号改成 3 个可执行步骤。"
  },
  {
    name: "短视频工作流教练",
    category: "content",
    source: "marketing-short-video-editing-coach / douyin-strategist",
    level: "内容生产",
    useFor: "把选题、脚本、分镜、剪辑和复盘串成流程。",
    input: "目标人群、平台、主题、素材、指标。",
    output: "选题表、脚本、分镜、发布与复盘清单。",
    check: "输出能直接进入拍摄或剪辑，而不是停在想法。",
    practice: "用 AI 做 10 个选题，挑 1 个写成 60 秒口播稿。"
  },
  {
    name: "行为激励设计师",
    category: "learning",
    source: "product-behavioral-nudge-engine",
    level: "留存设计",
    useFor: "降低学习焦虑，把大任务拆成能完成的小胜利。",
    input: "学习目标、用户状态、卡点、时间预算。",
    output: "最低完成版、标准版、挑战版和复盘提示。",
    check: "学习者就算只有 5 分钟，也知道下一步能做什么。",
    practice: "把一个 2 小时项目拆成 5 分钟、30 分钟、2 小时三档。"
  },
  {
    name: "品牌守护者",
    category: "design",
    source: "design-brand-guardian",
    level: "长期 IP",
    useFor: "统一定位、命名、视觉气质和对外表达。",
    input: "目标人群、价值主张、页面文案、视觉元素。",
    output: "品牌口径、命名建议、该说/不该说清单。",
    check: "用户能用一句话向别人介绍这个项目。",
    practice: "为本站写一句不超过 24 字的传播口号。"
  },
  {
    name: "上下文工程师",
    category: "core",
    source: "engineering-context-engineer",
    level: "模型协作",
    useFor: "把资料、约束、示例和历史决策组织成模型能稳定使用的上下文。",
    input: "任务目标、参考资料、禁止事项、历史输出。",
    output: "上下文包、引用清单、压缩摘要、边界说明。",
    check: "模型回答能引用关键资料，且不把缺失信息编出来。",
    practice: "把 3 篇资料压缩成一个 800 字以内的上下文包。"
  },
  {
    name: "工具调用设计师",
    category: "core",
    source: "engineering-tool-use-designer",
    level: "Agent 基础",
    useFor: "判断 Agent 什么时候该调用搜索、代码、浏览器、表格或文件工具。",
    input: "任务步骤、工具能力、权限边界、失败样例。",
    output: "工具清单、调用条件、人工确认点、回退策略。",
    check: "每次工具调用都有明确目的，不把简单任务复杂化。",
    practice: "为“写月度 AI 趋势报告”设计 5 个工具调用节点。"
  },
  {
    name: "Skill 设计师",
    category: "core",
    source: "engineering-skill-designer",
    level: "能力固化",
    useFor: "把一次成功做法沉淀成可复用的 Skill、模板或流程。",
    input: "成功案例、触发条件、步骤、反例。",
    output: "Skill 说明、检查清单、示例输入输出。",
    check: "别人看到 Skill 后能复现同类任务。",
    practice: "把一次优秀的资料整理流程写成 6 步 Skill。"
  },
  {
    name: "模型选型顾问",
    category: "core",
    source: "product-model-selection-advisor",
    level: "应用判断",
    useFor: "根据任务、成本、速度、隐私和生态选择合适模型。",
    input: "任务类型、预算、时延要求、数据敏感度。",
    output: "模型候选、取舍理由、测试题、切换预案。",
    check: "选型理由能经得起任务实测，而不是只看榜单。",
    practice: "为写作、编程、图片理解各设计 1 个模型对比题。"
  },
  {
    name: "RAG 知识库架构师",
    category: "engineering",
    source: "engineering-rag-architect",
    level: "应用开发",
    useFor: "设计文档切分、检索、引用和答案生成的知识库流程。",
    input: "资料类型、更新频率、用户问题、引用要求。",
    output: "切分方案、元数据字段、召回策略、验收问题集。",
    check: "回答能给出来源，并能承认资料中没有答案。",
    practice: "为 20 篇课程笔记设计一个最小 RAG 方案。"
  },
  {
    name: "API 集成工程师",
    category: "engineering",
    source: "engineering-api-integration-specialist",
    level: "开发实战",
    useFor: "把模型 API、第三方服务和前端页面可靠地连起来。",
    input: "接口文档、认证方式、请求样例、错误码。",
    output: "调用流程、错误处理、限流策略、测试脚本。",
    check: "网络失败、额度不足、参数错误时都有清楚提示。",
    practice: "给一个模型调用流程补 4 种错误处理文案。"
  },
  {
    name: "前端体验工程师",
    category: "engineering",
    source: "engineering-frontend-ux-engineer",
    level: "作品打磨",
    useFor: "把 AI 功能做成用户能理解、能反复使用的网页体验。",
    input: "用户路径、页面结构、交互状态、异常情况。",
    output: "组件方案、状态设计、响应式检查、空状态文案。",
    check: "手机和桌面都能顺畅完成核心任务。",
    practice: "为一个 AI 工具页补加载、失败、成功三个状态。"
  },
  {
    name: "数据清洗工程师",
    category: "engineering",
    source: "engineering-data-cleaning-specialist",
    level: "数据底座",
    useFor: "把杂乱表格、网页文本和笔记整理成可分析数据。",
    input: "原始文件、字段含义、缺失规则、输出格式。",
    output: "清洗步骤、字段表、异常值报告、可复用脚本。",
    check: "清洗前后数量、字段和异常都有记录。",
    practice: "把 30 条工具信息整理成统一字段的 CSV。"
  },
  {
    name: "测试用例设计师",
    category: "engineering",
    source: "testing-test-case-designer",
    level: "质量训练",
    useFor: "把功能需求变成正常、边界、异常和回归测试。",
    input: "功能描述、用户路径、风险点、历史 bug。",
    output: "测试矩阵、手工步骤、自动化建议、验收标准。",
    check: "至少覆盖一条失败路径和一条边界路径。",
    practice: "为报名表单设计 8 条测试用例。"
  },
  {
    name: "论文精读助教",
    category: "research",
    source: "research-paper-reading-assistant",
    level: "研究入门",
    useFor: "拆解 AI 论文的问题、方法、实验和局限。",
    input: "论文链接、摘要、图表、阅读目标。",
    output: "三层摘要、术语解释、贡献与局限、复述题。",
    check: "能用自己的话说清论文解决了什么问题。",
    practice: "选一篇模型论文，整理 5 个关键术语。"
  },
  {
    name: "竞品研究员",
    category: "research",
    source: "product-competitive-researcher",
    level: "市场观察",
    useFor: "比较国内外 AI 产品定位、功能、价格和增长路径。",
    input: "竞品名单、用户群、官网信息、使用体验。",
    output: "竞品表、差异点、机会判断、风险提醒。",
    check: "每个判断都有来源或亲自体验依据。",
    practice: "对比 3 个 AI PPT 工具的免费额度和适用场景。"
  },
  {
    name: "趋势雷达员",
    category: "research",
    source: "marketing-trend-radar",
    level: "月更观察",
    useFor: "从模型发布、产品更新和平台变化中识别值得学习的趋势。",
    input: "新闻、官方博客、产品更新、社区反馈。",
    output: "趋势摘要、影响对象、学习建议、观察期限。",
    check: "区分事实、推测和个人判断。",
    practice: "为本月 AI 更新写 3 条“值得学/暂观察”的判断。"
  },
  {
    name: "引用来源管理员",
    category: "research",
    source: "research-citation-manager",
    level: "可信表达",
    useFor: "管理链接、发布日期、引用句和证据等级。",
    input: "文章草稿、来源链接、引用位置。",
    output: "来源表、引用建议、过期风险、替换链接。",
    check: "读者能从每个关键判断追到来源。",
    practice: "给一篇 AI 工具测评补 6 条来源记录。"
  },
  {
    name: "数据分析解释员",
    category: "research",
    source: "data-analysis-interpreter",
    level: "分析素养",
    useFor: "把指标、图表和问卷结果翻译成可行动结论。",
    input: "数据表、指标定义、样本范围、业务问题。",
    output: "发现、异常、可能原因、下一步实验。",
    check: "不把相关性直接说成因果。",
    practice: "用 20 条用户反馈总结 3 个改版机会。"
  },
  {
    name: "案例拆解师",
    category: "research",
    source: "business-case-analyst",
    level: "格局训练",
    useFor: "拆解优秀 AI 应用、开源项目或商业案例背后的机制。",
    input: "案例链接、用户反馈、产品流程、商业数据。",
    output: "结构化拆解、可借鉴点、不可复制点、复盘问题。",
    check: "不只夸结果，要说明为什么它能成立。",
    practice: "拆解一个热门开源 AI 项目的增长路径。"
  },
  {
    name: "选题策划师",
    category: "content",
    source: "content-topic-strategist",
    level: "内容起点",
    useFor: "把目标用户的疑问变成可持续更新的选题库。",
    input: "目标人群、平台、关键词、近期热点。",
    output: "选题池、优先级、标题方向、验证方式。",
    check: "选题能对应明确读者和具体问题。",
    practice: "为 AI 学习新手生成 20 个小红书选题。"
  },
  {
    name: "脚本编剧",
    category: "content",
    source: "content-scriptwriter",
    level: "短视频实战",
    useFor: "把知识点写成有开头钩子、节奏和行动号召的脚本。",
    input: "主题、受众、时长、平台风格、案例。",
    output: "口播稿、镜头提示、字幕重点、结尾 CTA。",
    check: "前 5 秒能让目标用户知道为什么要看。",
    practice: "把“什么是 Agent”写成 60 秒口播稿。"
  },
  {
    name: "分镜导演",
    category: "content",
    source: "content-storyboard-director",
    level: "视频执行",
    useFor: "把脚本拆成画面、字幕、素材和剪辑节奏。",
    input: "脚本、素材库、平台比例、视觉参考。",
    output: "分镜表、素材清单、剪辑节奏、替代方案。",
    check: "每句重要信息都有对应画面支撑。",
    practice: "为一个 AI 工具教程设计 8 镜头分镜。"
  },
  {
    name: "剪辑复盘官",
    category: "content",
    source: "content-editing-analyst",
    level: "持续改进",
    useFor: "根据完播率、互动率和评论判断视频哪里该改。",
    input: "发布数据、评论、视频结构、对照样本。",
    output: "问题定位、二剪建议、下一条优化点。",
    check: "复盘能指向具体秒点或具体表达。",
    practice: "为一条 90 秒视频写出 5 个二剪建议。"
  },
  {
    name: "课程设计师",
    category: "content",
    source: "education-curriculum-designer",
    level: "教学产品",
    useFor: "把知识体系拆成学习路径、任务和作品验收。",
    input: "学习目标、对象基础、周期、作品要求。",
    output: "课程地图、每周任务、测验、作品标准。",
    check: "每节课都有可交付成果。",
    practice: "把“AI 编程入门”拆成 4 周课程计划。"
  },
  {
    name: "产品经理",
    category: "product",
    source: "product-manager",
    level: "需求判断",
    useFor: "把用户问题转成优先级清楚的功能需求。",
    input: "用户反馈、目标人群、限制条件、业务目标。",
    output: "需求说明、优先级、验收标准、风险。",
    check: "需求能回答为谁解决什么问题。",
    practice: "为本站 Agent 学院写 5 条用户故事。"
  },
  {
    name: "用户研究员",
    category: "product",
    source: "product-user-researcher",
    level: "需求洞察",
    useFor: "通过访谈和问卷理解学习者真实卡点。",
    input: "研究问题、用户样本、访谈记录、问卷结果。",
    output: "洞察、证据、用户分层、机会点。",
    check: "结论来自用户原话或行为证据。",
    practice: "写 8 个问题采访一个 AI 初学者。"
  },
  {
    name: "信息架构师",
    category: "product",
    source: "product-information-architect",
    level: "结构设计",
    useFor: "整理导航、模块层级和用户找内容的路径。",
    input: "页面列表、用户任务、内容类型、访问数据。",
    output: "导航结构、命名建议、入口优先级、查找路径。",
    check: "用户 3 次点击内能找到核心内容。",
    practice: "重新排序本站导航，并说明理由。"
  },
  {
    name: "无障碍体验检查员",
    category: "product",
    source: "product-accessibility-reviewer",
    level: "体验底线",
    useFor: "检查颜色对比、键盘可用、表单标签和移动端可读性。",
    input: "页面截图、DOM 结构、交互流程。",
    output: "可访问性问题、修复建议、验证方法。",
    check: "不依赖鼠标也能完成主要操作。",
    practice: "检查一个表单的标签、焦点和错误提示。"
  },
  {
    name: "游戏化系统设计师",
    category: "product",
    source: "product-gamification-designer",
    level: "留存机制",
    useFor: "设计 XP、徽章、任务、等级和复访节奏。",
    input: "学习任务、用户动机、周期、奖励限制。",
    output: "任务系统、奖励规则、反作弊提醒、复盘机制。",
    check: "奖励推动真实学习，而不是只刷按钮。",
    practice: "为 60 个 Agent 设计 5 个解锁徽章。"
  },
  {
    name: "反馈闭环经理",
    category: "product",
    source: "product-feedback-loop-manager",
    level: "迭代机制",
    useFor: "把用户反馈转成可追踪的问题、决策和发布说明。",
    input: "反馈内容、截图、影响范围、复现步骤。",
    output: "问题分类、优先级、Issue 草稿、回访话术。",
    check: "反馈者能看到自己的建议被如何处理。",
    practice: "把 10 条反馈整理成 P0-P3 改进列表。"
  },
  {
    name: "定价与赞助设计师",
    category: "growth",
    source: "business-pricing-sponsorship-designer",
    level: "可持续运营",
    useFor: "设计赞助、会员、课程或咨询的价值边界。",
    input: "用户价值、成本、竞品、赞助权益。",
    output: "权益方案、价格假设、风险说明、实验计划。",
    check: "商业动作不伤害开源信任。",
    practice: "为本站写 3 档赞助权益，但保留免费核心内容。"
  },
  {
    name: "开源运营官",
    category: "growth",
    source: "open-source-community-operator",
    level: "GitHub 增长",
    useFor: "提升 Star、Issue、PR、贡献者和项目可信度。",
    input: "README、Issue 模板、路线图、贡献门槛。",
    output: "开源运营计划、贡献路径、发布节奏、指标。",
    check: "新人知道该提什么 Issue，怎么贡献第一步。",
    practice: "设计一个“good first issue”清单。"
  },
  {
    name: "SEO 内容策划",
    category: "growth",
    source: "marketing-seo-content-strategist",
    level: "搜索流量",
    useFor: "围绕用户搜索问题组织页面标题、FAQ 和内容集群。",
    input: "关键词、目标读者、竞争页面、站内模块。",
    output: "内容地图、标题建议、FAQ、内部链接。",
    check: "页面能回答一个清晰搜索意图。",
    practice: "为“AI 自学路线”写 8 个 FAQ 问题。"
  },
  {
    name: "社媒传播官",
    category: "growth",
    source: "marketing-social-distribution-manager",
    level: "传播执行",
    useFor: "把一次更新改写成适合公众号、小红书、即刻、X 的素材。",
    input: "更新内容、目标平台、受众、行动目标。",
    output: "多平台文案、封面建议、评论互动问题。",
    check: "每个平台文案都符合它的语境。",
    practice: "把 Agent 学院发布改写成 4 个平台版本。"
  },
  {
    name: "用户转化设计师",
    category: "growth",
    source: "growth-conversion-designer",
    level: "行动设计",
    useFor: "让用户从浏览走向 Star、打卡、反馈、赞助或联系。",
    input: "用户路径、CTA、页面位置、转化目标。",
    output: "CTA 文案、路径优化、实验假设、指标。",
    check: "转化动作自然，不打断学习体验。",
    practice: "为 Agent 学院设计 3 个不突兀的 CTA。"
  },
  {
    name: "视觉系统设计师",
    category: "design",
    source: "design-visual-system-designer",
    level: "设计基础",
    useFor: "统一颜色、字体、间距、卡片和按钮状态。",
    input: "品牌气质、现有页面、组件截图、使用场景。",
    output: "视觉规范、组件建议、修正清单。",
    check: "新增页面看起来属于同一个产品。",
    practice: "为本站枣红、暖土、绿植色系写 6 条使用规则。"
  },
  {
    name: "交互原型师",
    category: "design",
    source: "design-interaction-prototyper",
    level: "体验原型",
    useFor: "把功能想法快速画成交互流程和状态变化。",
    input: "用户任务、入口、状态、成功/失败条件。",
    output: "流程图、低保真原型、状态清单。",
    check: "用户不用说明书也知道下一步。",
    practice: "画出“筛选 Agent → 复制练习 → 打卡”的流程。"
  },
  {
    name: "文案微交互设计师",
    category: "design",
    source: "design-microcopy-writer",
    level: "细节体验",
    useFor: "优化按钮、空状态、错误提示和确认弹窗里的短文案。",
    input: "界面位置、用户情绪、限制、动作结果。",
    output: "微文案、替代版本、语气说明。",
    check: "文案具体、诚实、让人知道发生了什么。",
    practice: "给“复制失败”“暂无结果”“已保存”各写 3 个版本。"
  },
  {
    name: "图像提示设计师",
    category: "design",
    source: "design-image-prompt-designer",
    level: "多模态创作",
    useFor: "为封面、插图、视频画面和产品图写可控图像 Prompt。",
    input: "主题、风格、构图、比例、禁止元素。",
    output: "图像 Prompt、负面提示、迭代建议。",
    check: "输出画面能服务信息，而不只是好看。",
    practice: "为“AI 学习地图”设计 3 条封面图 Prompt。"
  },
  {
    name: "演示叙事设计师",
    category: "design",
    source: "design-presentation-storyteller",
    level: "表达呈现",
    useFor: "把项目、课程或产品做成清楚有节奏的演示。",
    input: "目标听众、核心结论、证据、时间限制。",
    output: "演示结构、页面标题、讲稿、追问准备。",
    check: "每页只服务一个明确观点。",
    practice: "把本站介绍整理成 6 页路演大纲。"
  },
  {
    name: "隐私风险审查员",
    category: "safety",
    source: "security-privacy-risk-reviewer",
    level: "安全底线",
    useFor: "检查邮箱、二维码、表单、日志和用户数据是否过度暴露。",
    input: "数据字段、页面代码、存储方式、第三方服务。",
    output: "隐私风险、最小化建议、告知文案。",
    check: "不收集不必要数据，敏感信息不直接暴露。",
    practice: "审查一个联系表单，列出 5 个隐私注意点。"
  },
  {
    name: "版权合规提醒员",
    category: "safety",
    source: "legal-copyright-compliance-helper",
    level: "内容边界",
    useFor: "判断学习资料、开源 prompt、图片和视频素材如何合规引用。",
    input: "来源链接、许可证、引用方式、使用场景。",
    output: "可用性判断、署名建议、替代方案。",
    check: "区分灵感参考、改写、转载和商用。",
    practice: "为一个 MIT 项目写出网站引用说明。"
  },
  {
    name: "AI 安全红队员",
    category: "safety",
    source: "security-ai-red-team-tester",
    level: "风险测试",
    useFor: "测试 Prompt 注入、越权、幻觉、隐私泄露等 AI 应用风险。",
    input: "应用功能、系统提示、工具权限、敏感场景。",
    output: "攻击样例、风险等级、缓解建议、复测结果。",
    check: "问题能复现，修复后能复测。",
    practice: "为一个知识库问答应用设计 5 条 Prompt 注入测试。"
  },
  {
    name: "内容安全编辑",
    category: "safety",
    source: "safety-content-moderation-editor",
    level: "发布审查",
    useFor: "检查页面、课程和社媒内容是否含误导、夸大或不适当表达。",
    input: "待发布内容、受众、平台规则、敏感主题。",
    output: "风险句、替代表达、发布建议。",
    check: "降低误解风险，但不把内容改得空洞。",
    practice: "把 5 句夸大的 AI 宣传语改成可信表达。"
  },
  {
    name: "学术诚信顾问",
    category: "safety",
    source: "education-academic-integrity-advisor",
    level: "学习边界",
    useFor: "帮助学生合理使用 AI，避免代写、抄袭和引用不当。",
    input: "作业要求、使用方式、引用材料、学校规则。",
    output: "可用/不可用边界、披露建议、学习替代方案。",
    check: "AI 帮助学习者思考，而不是替学习者完成责任。",
    practice: "为一份课程论文写 AI 使用声明模板。"
  },
  {
    name: "学习路径规划师",
    category: "learning",
    source: "education-learning-path-planner",
    level: "自学导航",
    useFor: "根据基础、目标和时间设计可执行 AI 学习路线。",
    input: "当前水平、目标、每周时间、偏好作品。",
    output: "路线图、周任务、里程碑、复盘问题。",
    check: "计划能从今天开始执行，而不是只有远景。",
    practice: "给零基础学习者设计 4 周 AI 入门路线。"
  },
  {
    name: "费曼讲解教练",
    category: "learning",
    source: "education-feynman-explainer",
    level: "理解训练",
    useFor: "把复杂概念讲到高中生、家长或老板都能听懂。",
    input: "概念、目标听众、已有理解、类比限制。",
    output: "三层解释、类比、反例、自测问题。",
    check: "听众能复述核心意思并举一个例子。",
    practice: "用三层解释讲清楚 Token 和上下文窗口。"
  },
  {
    name: "错题复盘教练",
    category: "learning",
    source: "education-error-review-coach",
    level: "学习闭环",
    useFor: "分析学习任务失败原因，提炼下次改进策略。",
    input: "任务目标、失败输出、尝试过程、时间投入。",
    output: "错误类型、原因、改进 Prompt、下次练习。",
    check: "复盘能转成下一次具体行动。",
    practice: "复盘一次 AI 回答不准确的原因，并改写 Prompt。"
  },
  {
    name: "作品集导师",
    category: "learning",
    source: "education-portfolio-mentor",
    level: "成果展示",
    useFor: "把学习成果包装成可展示、可讲述、可复盘的作品。",
    input: "作品材料、目标受众、过程记录、结果证据。",
    output: "作品说明、截图清单、故事线、改进计划。",
    check: "别人能看懂你做了什么、为什么做、学到了什么。",
    practice: "为一个 AI 小工具写 300 字作品说明。"
  },
  {
    name: "面试模拟官",
    category: "learning",
    source: "career-interview-simulator",
    level: "职业连接",
    useFor: "围绕 AI 项目、实习、作品集和职业方向做模拟面试。",
    input: "岗位方向、项目经历、简历、薄弱点。",
    output: "面试问题、追问、参考回答、改进建议。",
    check: "回答能体现真实经历，而不是背模板。",
    practice: "为“AI 应用开发实习”准备 10 个面试问题。"
  },
  {
    name: "家长沟通翻译官",
    category: "learning",
    source: "education-parent-communication-translator",
    level: "跨代沟通",
    useFor: "把 AI 学习价值、风险和行动计划讲给家长或非技术伙伴。",
    input: "学习目标、担心点、案例、时间投入。",
    output: "沟通话术、风险说明、共同约定、观察指标。",
    check: "对方听完知道支持什么、监督什么。",
    practice: "写一段给家长看的“为什么学 AI 不是玩物丧志”。"
  },
  {
    name: "认知升级教练",
    category: "learning",
    source: "education-worldview-coach",
    level: "世界观训练",
    useFor: "帮助学习者建立 AI 时代的系统观、协作观和长期主义。",
    input: "困惑问题、行业案例、个人目标、价值判断。",
    output: "思考框架、反方观点、行动原则、阅读建议。",
    check: "能区分技术能力、社会影响和个人选择。",
    practice: "回答“AI 时代什么能力更值钱”并列出反方观点。"
  }
];

function safeParseJson(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    return fallback;
  }
}

function getStoredString(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function removeStoredValue(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

let storageNoticeShown = false;

function showStorageUnavailableNotice() {
  if (storageNoticeShown) return;
  storageNoticeShown = true;
  showToast("当前环境不支持本地存储，部分进度可能无法持久化。");
}

function getStoredNumber(key, fallback = 0) {
  const raw = getStoredString(key);
  const num = Number(raw);
  return Number.isFinite(num) ? num : fallback;
}

function getStoredArray(key, fallback = []) {
  const raw = getStoredString(key);
  const parsed = safeParseJson(raw || "[]", fallback);
  if (!Array.isArray(parsed)) {
    removeStoredValue(key);
    return fallback;
  }
  return parsed;
}

function getStoredObject(key, fallback = {}) {
  const raw = getStoredString(key);
  const parsed = safeParseJson(raw || "{}", fallback);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    removeStoredValue(key);
    return fallback;
  }
  return parsed;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function yesterdayLocalKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateKey(yesterday);
}

function escapeCsvCell(value) {
  const text = String(value ?? "").replaceAll('"', '""');
  const escaped = /^(=|\+|-|@|\t|\r|\n|,)/.test(text) ? `'${text}` : text;
  return `"${escaped}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("`", "&#96;");
}

function safeText(value) {
  return escapeHtml(value);
}

function safeUrl(value) {
  const text = String(value ?? "").trim();
  try {
    const url = new URL(text, window.location.href);
    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return escapeHtml(url.href);
    }
  } catch (error) {
    return "";
  }
  return "";
}

function safeList(items) {
  if (!Array.isArray(items)) return "";
  return items
    .map((item) => `<li>${safeText(item)}</li>`)
    .join("");
}

function isValidContact(contact) {
  const value = toTrimmed(contact);
  if (!value || value.length < 2 || value.includes(" ")) return false;
  const isPhone = /^\d{6,20}$/.test(value);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const isWechat = /^[a-zA-Z0-9_-]{6,24}$/.test(value);
  return isPhone || isEmail || isWechat;
}

async function copyText(text) {
  const plainText = String(text ?? "");
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (error) {
    // clipboard API may fail in insecure contexts; fallback below
  }

  let area = null;
  try {
    area = document.createElement("textarea");
    area.value = plainText;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, plainText.length);
    return Boolean(document.execCommand && document.execCommand("copy"));
  } catch (error) {
    return false;
  } finally {
    if (area && area.parentNode) area.remove();
  }
}

function toTrimmed(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatReportDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function escapeMarkdownLine(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .replaceAll("\r", " ");
}

const monthlyFallbackUpdates = [
  {
    id: "2026-07",
    label: "2026 年 7 月",
    status: "published",
    updatedAt: "2026-07-01",
    lastVerified: "2026-07-02",
    sources: [
      {
        label: "站内月更共建模板",
        url: "https://github.com/happywa147/ai-learning-site/blob/main/.github/ISSUE_TEMPLATE/monthly-update.md"
      }
    ],
    testedTasks: ["模型对比表", "三步 Agent 流程", "短视频选题到分镜方案"],
    confidence: "medium",
    title: "从会用工具，升级到会搭工作流",
    summary: "本月重点不是追每一个新模型，而是建立自己的模型选择法、Agent 任务拆解法和内容生产闭环。所有结论都要按月复查，避免把旧规则当成新常识。",
    cards: [
      {
        id: "2026-07-1",
        title: "模型观察",
        items: [
          "国际模型看推理、代码、多模态和 Agent 协作能力。",
          "国内模型看中文、成本、长文本、内容生态和企业落地。",
          "同一任务至少用 2 个模型交叉验证，记录各自强弱。"
        ]
      },
      {
        id: "2026-07-2",
        title: "中国应用市场",
        items: [
          "重点观察 AI 搜索、AI 办公、AI 编程、AI 视频和企业知识库。",
          "短视频场景关注选题、脚本、分镜、配音、剪辑、复盘全链路。",
          "判断产品时看真实场景、付费意愿、交付成本和合规边界。"
        ]
      },
      {
        id: "2026-07-3",
        title: "本月训练",
        items: [
          "做一张自己的模型对比表：写作、编程、长文档、视频、Agent。",
          "搭一个 3 步 Agent 流程：输入、工具、输出验收标准。",
          "完成 1 条短视频从选题到分镜的完整方案。"
        ]
      },
      {
        id: "2026-07-4",
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
    status: "draft",
    updatedAt: "2026-08-01",
    title: "预留更新：作品集与真实场景",
    summary: "下月建议围绕作品集、真实用户反馈、工具成本和自动化流程继续更新。这里保留为可扩展模板。",
    cards: [
      {
        id: "2026-08-1",
        title: "模型观察",
        items: [
          "补充当月模型变化。",
          "更新国内外模型实测。",
          "记录适合自己的默认模型组合。"
        ]
      },
      {
        id: "2026-08-2",
        title: "市场观察",
        items: [
          "补充当月中国应用热点。",
          "观察短视频、电商、办公、教育场景。",
          "记录 1 个值得拆解的 AI 产品。"
        ]
      },
      {
        id: "2026-08-3",
        title: "本月训练",
        items: [
          "完成 1 个可展示作品。",
          "做 1 次真实用户反馈。",
          "整理 1 份项目复盘。"
        ]
      },
      {
        id: "2026-08-4",
        title: "避坑提醒",
        items: ["复查上月结论。", "删除低频工具。", "把常用流程沉淀成模板。"]
      }
    ]
  }
];
let monthlyUpdates = [];

function normalizeMonthlyPayload(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((item, index) => {
      const safeCards = Array.isArray(item?.cards)
        ? item.cards
            .filter((card) => card && Array.isArray(card.items))
            .map((card, cardIndex) => ({
              title: card.title || `项目 ${cardIndex + 1}`,
              items: card.items
            }))
        : [];
      return {
        id: item?.id || `2026-${String(index + 1).padStart(2, "0")}`,
        label: item?.label || item?.month || `2026-${String(index + 1).padStart(2, "0")}`,
        title: item?.title || "",
        summary: item?.summary || "",
        cards: safeCards,
        updatedAt: item?.updatedAt || item?.date || "",
        lastVerified: item?.lastVerified || "",
        status: item?.status || "published",
        confidence: item?.confidence || "",
        sources: Array.isArray(item?.sources) ? item.sources : [],
        testedTasks: Array.isArray(item?.testedTasks) ? item.testedTasks : []
      };
    })
    .filter((item) => item.status !== "draft" && (item.cards.length || item.title || item.summary));
}

async function loadMonthlyUpdates() {
  if (monthlyFallbackUpdates.length) {
    try {
      const response = await fetch("./assets/monthly-updates.json");
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed) && parsed.length > 0) {
          monthlyUpdates = normalizeMonthlyPayload(parsed);
          return;
        }
      }
    } catch (error) {
      monthlyUpdates = monthlyFallbackUpdates;
      return;
    }
  }
  if (!monthlyUpdates.length) {
    monthlyUpdates = monthlyFallbackUpdates;
  }
}

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
          <span>${safeText(String(index + 1).padStart(2, "0"))}</span>
          <h3>${safeText(item.title)}</h3>
          <p>${safeText(item.text)}</p>
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
    tags: ["国际", "编程", "多模态", "Agent"],
    scenario: "英文和复杂任务优先，适合做国际基准与代码协作。",
    pricing: "按 token 计费，试错成本相对可控，API 接口生态成熟。",
    strengths: ["稳定的推理与长链路规划", "生态集成完善", "插件/工具联动成熟"],
    limits: ["对中文细节有时偏保守", "任务链越长成本越高"]
  },
  {
    name: "Claude",
    desc: "长文档阅读、写作润色、代码解释和复杂任务分解表现突出，适合深度学习与文本工作。",
    tags: ["国际", "长文本", "写作", "代码"],
    scenario: "中文长文阅读、论文拆解、复杂文档写作反馈。",
    pricing: "API + 平台体验并行，超长上下文能力更强。",
    strengths: ["长文理解与结构化输出", "任务分解清晰", "写作质量稳定"],
    limits: ["对代码执行链路仍需人工校验", "偏研究/写作流程，不适合每个场景高频工具调用"]
  },
  {
    name: "Gemini",
    desc: "与搜索、文档、视频理解和 Google 生态结合紧密，适合做多模态学习参考。",
    tags: ["国际", "多模态", "搜索", "视频"],
    scenario: "多模态学习、资料检索和短内容学习链路补全。",
    pricing: "分版本与渠道差异较大，注意调用限额与模型版本切换。",
    strengths: ["搜索与多模态联动", "学习场景融合能力", "适合做内容分析"],
    limits: ["跨版本行为不一致", "某些场景结构化落地仍需后处理"]
  },
  {
    name: "DeepSeek",
    desc: "在中文、推理、代码和开源生态中影响力强，适合学习推理模型与低成本应用开发。",
    tags: ["国内", "推理", "编程", "开源"],
    scenario: "中文推理、编程小工具和低成本应用实验。",
    pricing: "开源与托管路线并存，低门槛试验与私有化思路可行。",
    strengths: ["中文任务友好", "性价比高", "适合模型对比与实验"],
    limits: ["部分版本更新节奏快", "接口和实例差异需要验参"]
  },
  {
    name: "通义千问 / Qwen",
    desc: "阿里生态覆盖广，开源模型、云服务、多模态和企业应用都值得关注。",
    tags: ["国内", "开源", "云服务", "多模态"],
    scenario: "企业场景与本地化服务对接，适合做“落地第一层”。",
    pricing: "云服务与开源权重并存，按调用与部署模式定。",
    strengths: ["生态链完整", "国内业务兼容性好", "多模态起步快"],
    limits: ["模型规模与配置影响体验", "同类竞品更新密集需持续复测"]
  },
  {
    name: "Kimi",
    desc: "长文本、资料阅读和中文信息处理是学习场景常用方向，适合做论文与资料助手。",
    tags: ["国内", "长文本", "学习", "资料整理"],
    scenario: "学习资料总结、课程复盘、长文本问答。",
    pricing: "多以套餐或 token 计费形式出现，需留意上下文长度溢出策略。",
    strengths: ["长文本信息抓取", "中文语境表现稳定", "适合做知识提炼"],
    limits: ["任务复杂度升高时，输出结构仍需二次校验", "与外部工具联动仍需模板约束"]
  },
  {
    name: "豆包 / 火山引擎",
    desc: "贴近内容生态和国内消费级应用，适合观察短视频、图像、语音和创作工具链。",
    tags: ["国内", "短视频", "创作", "语音"],
    scenario: "选题、脚本、配音与素材生成的内容生产链。",
    pricing: "偏内容生产平台化服务，按调用和素材资源分层。",
    strengths: ["短视频生态融合度高", "对内容素材链条友好", "快速产出闭环"],
    limits: ["深度业务决策支持较弱", "商业化报表与流程化复用能力有限"]
  },
  {
    name: "文心 / 腾讯混元 / 智谱 GLM",
    desc: "适合观察国内企业级、办公、搜索、政务和行业应用落地，对理解中国市场很有帮助。",
    tags: ["国内", "企业应用", "办公", "行业"],
    scenario: "企业办公协作、政府/行业场景知识问答、流程化资料处理。",
    pricing: "多供应商定价差异明显，项目化选型更常见。",
    strengths: ["行业适配能力", "中文知识工作流支持", "企业接入路径清晰"],
    limits: ["体验一致性受版本影响", "通用任务上不一定领先"]
  },
  {
    name: "可灵 / 即梦 / 通义万相",
    desc: "偏视频与图像生成工具，适合短视频、广告、电商素材和创意表达训练。",
    tags: ["国内", "视频", "图像", "内容生产"],
    scenario: "内容创作环节的素材生产与创意实验。",
    pricing: "多按图像/视频产出与算力计费，素材预算需前置定义。",
    strengths: ["创作速度快", "视觉表现多样", "适合内容矩阵规模化试验"],
    limits: ["版权与发布合规要求高", "结果稳定性波动"]
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

const PROJECT_UNLOCK_XP = 160;

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
  agentCategory: "all",
  month: getStoredString("ai-learning-month", "2026-07"),
  leads: getStoredArray("ai-learning-leads", []),
  feedback: getStoredArray("ai-learning-feedback", []),
  doneWeeks: new Set(getStoredArray("ai-learning-weeks", [])),
  doneProjects: new Set(getStoredArray("ai-learning-projects", [])),
  weekProofs: getStoredObject("ai-learning-week-proofs", {}),
  projectProofs: getStoredObject("ai-learning-project-proofs", {}),
  bonusXp: getStoredNumber("ai-learning-bonus-xp", 0),
  streak: getStoredNumber("ai-learning-streak", 0),
  lastCheckIn: getStoredString("ai-learning-last-checkin", ""),
  dailyDone: getStoredString("ai-learning-daily-done", "")
};

function getTodayKey() {
  return getLocalDateKey(new Date());
}

function ensureMonthExists() {
  if (!monthlyUpdates.length) return;
  if (!monthlyUpdates.find((entry) => entry.id === state.month)) {
    state.month = monthlyUpdates[0].id;
    if (!setStoredValue("ai-learning-month", state.month)) {
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

function renderTrack() {
  const track = tracks[state.track];
  const detail = document.querySelector("#trackDetail");
  detail.innerHTML = `
    <article class="track-card">
      <h3>${safeText(track.title)}</h3>
      <p class="muted">${safeText(track.summary)}</p>
      <ul>${safeList(track.outcomes)}</ul>
    </article>
    <div class="track-modules">
      ${track.modules
        .map(
          ([name, text]) =>
            `<article class="module"><span>${safeText(name)}</span><h3>${safeText(name)}模块</h3><p class="muted">${safeText(text)}</p></article>`
        )
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
          <span><strong>${safeText(week)} · ${safeText(title)}</strong><small class="muted">${safeText(goal)}</small></span>
          <span class="tag">${checked ? "已完成" : "待学习"}</span>
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
  grid.innerHTML = filtered
    .map(
      (model) => `
      <article class="model-card">
        <h3>${safeText(model.name)}</h3>
        <p>${safeText(model.desc)}</p>
        <p class="muted">${safeText(model.scenario || "")}</p>
        <p class="muted"><strong>定价：</strong>${safeText(model.pricing || "")}</p>
        <p><strong>优势：</strong>${safeText(Array.isArray(model.strengths) ? model.strengths.join("；") : "")}</p>
        <p><strong>适用边界：</strong>${safeText(Array.isArray(model.limits) ? model.limits.join("；") : "")}</p>
        <footer>${(model.tags || [])
          .map((tag) => `<span class=\"tag\">${safeText(tag)}</span>`)
          .join("")}</footer>
      </article>
    `
    )
    .join("");
}

function renderProjects() {
  document.querySelector("#projectGrid").innerHTML = projects
    .map((project, index) => {
      const done = state.doneProjects.has(index);
      const locked = getXp() < PROJECT_UNLOCK_XP && index > 1;
      return `
      <article class="project-card ${locked ? "locked" : ""}">
        <h3>${safeText(project.title)}</h3>
        <p>${safeText(project.desc)}</p>
        <ul>${safeList(project.tasks)}</ul>
        <button class="${done ? "primary-btn" : "ghost-btn"} small project-toggle" ${locked ? "disabled" : ""} data-project="${index}">
          ${done ? "已点亮 +80 XP" : "点亮作品 +80 XP"}
        </button>
      </article>
    `;
    })
    .join("");
}

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
      return `<button class="${state.agentCategory === key ? "active" : ""}" data-agent-category="${safeText(key)}">${safeText(label)} <span>${count}</span></button>`;
    })
    .join("");

  document.querySelector("#agentRoleCount").textContent = `${categoryName} · ${visibleRoles.length} / ${agentRoles.length} 个角色`;

  document.querySelector("#agentRoleGrid").innerHTML = visibleRoles
    .map(
      (role) => `
      <article class="agent-role-card">
        <div class="agent-role-top">
          <span class="badge">${safeText(role.level)}</span>
          <small>${safeText(role.source)}</small>
        </div>
        <h3>${safeText(role.name)}</h3>
        <p>${safeText(role.useFor)}</p>
        <dl>
          <div><dt>输入</dt><dd>${safeText(role.input)}</dd></div>
          <div><dt>产出</dt><dd>${safeText(role.output)}</dd></div>
          <div><dt>验收</dt><dd>${safeText(role.check)}</dd></div>
        </dl>
        <footer>
          <strong>练习：</strong>${safeText(role.practice)}
        </footer>
      </article>
    `
    )
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
    `连续签到：${state.streak} 天`,
    `已完成周任务：${state.doneWeeks.size} / ${weeks.length}`,
    `已点亮作品：${state.doneProjects.size} / ${projects.length}`,
    ""
  ];
  if (doneWeekList.length) {
    lines.push("## 周任务进度", ...doneWeekList);
  } else {
    lines.push("## 周任务进度", "- 暂无完成任务");
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
    lines.push("- 本阶段任务完成，可切换到下月更新继续跟进。");
  }
  return lines.join("\n");
}

function downloadProgressReport() {
  const report = generateProgressReport();
  const blob = new Blob([`\ufeff${report}`], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = formatReportDate(new Date());
  link.href = url;
  link.download = `ai-learning-report-${today}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("学习周报已导出。");
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
  if (!setStoredValue("ai-learning-leads", state.leads)) {
    showStorageUnavailableNotice();
  }
  renderContact();
}

function renderFeedbackCount() {
  document.querySelector("#feedbackCount").textContent = String(state.feedback.length);
}

function saveFeedback(entry) {
  state.feedback.unshift(entry);
  if (!setStoredValue("ai-learning-feedback", state.feedback)) {
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
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-learning-feedback-${getTodayKey()}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("反馈 CSV 已导出。");
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
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-learning-leads-${getTodayKey()}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("报名 CSV 已导出。");
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
    showToast("请先填写反馈主题和建议。");
    return;
  }
  const text = `${draft.title}\n\n${draft.body}`;
  const ok = await copyText(text);
  showToast(ok ? "反馈 Issue 草稿已复制，可粘贴到 GitHub。" : "复制失败，请手动复制反馈内容。", 2200);
}

function openFeedbackIssue() {
  const draft = getFeedbackDraft();
  if (!draft) {
    showToast("请先填写反馈主题和建议。");
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
    showToast("请先完整填写报名信息，或使用最近一条本机报名记录。", 2200);
    return;
  }
  const ok = await copyText(buildLeadContactText(lead));
  showToast(ok ? "联系草稿已复制，请通过邮箱或微信发给我。" : "复制失败，请手动整理联系内容。", 2200);
}

function openLeadEmailDraft() {
  const lead = getLeadDraft();
  if (!lead) {
    showToast("请先完整填写报名信息，或使用最近一条本机报名记录。", 2200);
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
}

function renderDailyChallenge() {
  const todayKey = getTodayKey();
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
          <strong>${safeText(unlocked ? badge.title : "未解锁")}</strong>
          <span>${safeText(badge.desc)}</span>
        </article>
      `;
    })
    .join("");
}

function persistGameState() {
  const isStorageOk =
    setStoredValue("ai-learning-projects", [...state.doneProjects]) &&
    setStoredValue("ai-learning-week-proofs", state.weekProofs) &&
    setStoredValue("ai-learning-project-proofs", state.projectProofs) &&
    setStoredValue("ai-learning-bonus-xp", state.bonusXp) &&
    setStoredValue("ai-learning-streak", state.streak) &&
    setStoredValue("ai-learning-last-checkin", state.lastCheckIn) &&
    setStoredValue("ai-learning-daily-done", state.dailyDone);
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
}

document.querySelectorAll("[data-track]").forEach((button) => {
  button.addEventListener("click", () => {
    state.track = button.dataset.track;
    document.querySelectorAll("[data-track]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTrack();
  });
});

document.querySelector("#agentRoleTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-agent-category]");
  if (!button) return;
  state.agentCategory = button.dataset.agentCategory;
  renderAgentRoles();
});

document.querySelector("#weekList").addEventListener("change", async (event) => {
  const input = event.target.closest("[data-week]");
  if (!input) return;
  const index = Number(input.dataset.week);
  const proofKey = String(index);
  if (input.checked && !state.weekProofs[proofKey]) {
    const proof = await requestProof({
      title: "补充周度实践证据",
      description: "请写一句本周完成证据（学习内容、复盘、链接或产出）。"
    });
    if (!proof || !proof.trim()) {
      input.checked = false;
      showToast("请先填写一条实践证据，再完成任务。", 1600);
      return;
    }
    state.weekProofs[proofKey] = proof.trim();
  }
  if (!input.checked) {
    delete state.weekProofs[proofKey];
    state.doneWeeks.delete(index);
  } else {
    state.doneWeeks.add(index);
  }
  if (!setStoredValue("ai-learning-weeks", [...state.doneWeeks]) || !setStoredValue("ai-learning-week-proofs", state.weekProofs)) {
    showStorageUnavailableNotice();
  }
  renderWeeks();
  renderProjects();
  renderBadges();
  showToast(input.checked ? "任务完成，获得 60 XP。" : "任务已取消，XP 已重新计算。");
});

document.querySelector("#projectGrid").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-project]");
  if (!button) return;
  const index = Number(button.dataset.project);
  const locked = getXp() < PROJECT_UNLOCK_XP && index > 1;
  if (button.disabled || locked) {
    showToast("这个作品还没解锁，请先累积 160 XP。", 1600);
    return;
  }
  if (!state.doneProjects.has(index) && !state.projectProofs[index]) {
    const proof = await requestProof({
      title: "补充作品完成证据",
      description: "请写一句该作品的完成依据（链接、文件名、提交口径）。"
    });
    if (!proof || !proof.trim()) {
      showToast("请先填写一条作品完成证据。", 1600);
      return;
    }
    state.projectProofs[index] = proof.trim();
  }
  if (state.doneProjects.has(index)) {
    state.doneProjects.delete(index);
    delete state.projectProofs[index];
  } else {
    state.doneProjects.add(index);
  }
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
  if (!setStoredValue("ai-learning-month", state.month)) {
    showStorageUnavailableNotice();
  }
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
  const ok = await copyText(templates[state.template]);
  const button = document.querySelector("#copyTemplate");
  button.textContent = ok ? "已复制" : "复制失败";
  if (!ok) showToast("复制失败，请长按选择文本手动复制。");
  setTimeout(() => {
    button.textContent = "复制模板";
  }, 1200);
});

document.querySelector("#checkInButton").addEventListener("click", () => {
  const todayKey = getTodayKey();
  if (state.lastCheckIn === todayKey) return;
  const yesterday = yesterdayLocalKey();
  state.streak = state.lastCheckIn === yesterday ? state.streak + 1 : 1;
  state.lastCheckIn = todayKey;
  state.bonusXp += 20;
  persistGameState();
  refreshGame();
  showToast("签到成功，获得 20 XP。");
});

document.querySelector("#dailyButton").addEventListener("click", () => {
  const todayKey = getTodayKey();
  if (state.dailyDone === todayKey) return;
  state.dailyDone = todayKey;
  state.bonusXp += 35;
  persistGameState();
  refreshGame();
  showToast("今日挑战完成，获得 35 XP。");
});

document.querySelector("#exportReport").addEventListener("click", downloadProgressReport);

document.querySelector("#feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const topic = toTrimmed(data.get("topic"));
  const message = toTrimmed(data.get("message"));
  if (!topic || !message || message.length < 2) {
    showToast("请补充反馈主题和建议。");
    return;
  }
  saveFeedback({
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    topic,
    message
  });
  form.reset();
  showToast("反馈已记录在本机；如需让我收到，请生成 GitHub Issue。", 2600);
});

document.querySelector("#exportFeedback").addEventListener("click", downloadFeedbackCsv);
document.querySelector("#copyFeedbackIssue").addEventListener("click", copyFeedbackIssueDraft);
document.querySelector("#openFeedbackIssue").addEventListener("click", openFeedbackIssue);

document.querySelector("#registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = toTrimmed(data.get("name"));
  const contact = toTrimmed(data.get("contact"));
  const profile = data.get("profile");
  const interest = data.get("interest");
  const message = toTrimmed(data.get("message"));
  if (!name || name.length < 2 || !contact || contact.length < 2 || !profile || !interest) {
    showToast("请完整填写必填项并按要求填写。");
    return;
  }
  if (!isValidContact(contact)) {
    showToast("联系方式格式不对：请输入微信号（6-24位）、手机号或完整邮箱。");
    return;
  }
  saveLead({
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    name,
    contact,
    profile,
    interest,
    message
  });
  form.reset();
  showToast("报名草稿已保存在本机；请复制草稿或写邮件联系我。", 2600);
  setTimeout(() => document.querySelector("#game").scrollIntoView({ behavior: "smooth", block: "start" }), 300);
});

document.querySelector("#copyLeadContact").addEventListener("click", copyLeadContactDraft);
document.querySelector("#openLeadEmail").addEventListener("click", openLeadEmailDraft);

document.querySelector("#clearLeads").addEventListener("click", () => {
  if (!state.leads.length) {
    showToast("当前没有报名数据。", 1400);
    return;
  }
  const needBackup = window.confirm("清空前建议先导出 CSV，是否先导出备份？");
  if (needBackup) {
    downloadLeadsCsv();
  }
  if (!window.confirm("确认清空所有本机报名数据？清除后可从页面手动恢复不了。")) {
    return;
  }
  state.leads = [];
  if (!removeStoredValue("ai-learning-leads")) {
    showStorageUnavailableNotice();
  }
  renderContact();
  showToast("报名数据已清空。", 1600);
});

document.querySelector("#exportLeads").addEventListener("click", downloadLeadsCsv);

document.querySelector("#contactList").addEventListener("click", async (event) => {
  const button = event.target.closest("#copyEmail");
  if (!button) return;
  const ok = await copyText(getOwnerEmail());
  button.textContent = ok ? "已复制" : "复制失败";
  showToast(ok ? "邮箱已复制。" : "复制失败，请长按邮箱文本手动复制。");
  setTimeout(() => {
    button.textContent = "点击复制";
  }, 1200);
});

document.querySelector("#sponsorNav").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorFloat").addEventListener("click", openSponsorModal);
document.querySelector("#sponsorClose").addEventListener("click", closeSponsorModal);
document.querySelector("#sponsorModal").addEventListener("click", (event) => {
  if (event.target.id === "sponsorModal") closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModalWithResult(null);
});
document.querySelector("#sponsorCopyEmail").addEventListener("click", async () => {
  const ok = await copyText(getOwnerEmail());
  if (!ok) {
    showToast("复制失败，请手动识别弹窗中的邮箱。请在下一步联系。", 2200);
    return;
  }
  showToast("邮箱已复制，可联系赞助合作。");
});

async function bootstrap() {
  await loadMonthlyUpdates();
  if (!state.month || !monthlyUpdates.length) {
    state.month = "2026-07";
  }
  ensureMonthExists();
  renderStarter();
  renderTrack();
  renderWorldview();
  renderMonthOptions();
  renderMonthlyUpdate();
  renderWeeks();
  renderModels();
  renderProjects();
  renderShowcase();
  renderAgentRoles();
  renderTemplate();
  renderContact();
  renderFeedbackCount();
  refreshGame();
}

bootstrap();
