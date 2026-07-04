#!/usr/bin/env python3
"""Add 5-minute practice tutorials to all track modules in tracks.json."""
import json, sys

# Practice tutorials for each module
PRACTICE = {
    # === freshman: 零基础入门路线 ===
    "freshman:认知": [
        {"step":"打开 ChatGPT (chat.openai.com) 或 DeepSeek (chat.deepseek.com)，输入：'请用一句话解释什么是 Token，然后把我这句话拆成 Token 列表给我看'","expect":"AI 解释 Token 概念并展示切分结果，你直观看到中文被如何切分"},
        {"step":"继续输入：'请用 200 字解释上下文窗口是什么，以及对话太长会发生什么'","expect":"AI 解释上下文窗口的 Token 限制，说明超限后早期对话会被截断"},
        {"step":"输入一个不存在的事件：'请告诉我 2026 年诺贝尔文学奖得主'，然后用搜索引擎核实","expect":"观察 AI 是否编造了信息——这大概率是'幻觉'现象"},
        {"step":"上传一张日常照片到支持多模态的模型（ChatGPT/通义千问），输入：'请描述这张图片并数出物体数量'","expect":"预期结果：理解 Token、上下文窗口、幻觉、多模态四个核心概念"},
    ],
    "freshman:学习": [
        {"step":"打开 Claude (claude.ai)，粘贴一段你最近读的文章或笔记（500字以上），输入：'请用三层结构整理：核心观点、支撑论据、我可以行动的点'","expect":"AI 输出结构化三层摘要"},
        {"step":"继续输入：'请出 5 道自测题：3 道选择 + 2 道简答，附答案'","expect":"收到带答案的 5 道检测题"},
        {"step":"打开通义千问，粘贴同样内容，输入：'用费曼技巧讲给 12 岁的孩子听，用一个类比'","expect":"AI 用简单类比重新解释，帮你发现理解盲区"},
        {"step":"把两个 AI 的输出对比，标记它们理解不同或遗漏的地方","expect":"预期结果：你获得了'结构化笔记 + 自测题 + 费曼讲解'三步学习闭环"},
    ],
    "freshman:表达": [
        {"step":"打开 ChatGPT，输入：'我要写一篇关于'为什么要学 AI'的短文，受众是大学生，给我三层结构提纲，每层一个关键句'","expect":"AI 输出三层提纲，每层有明确的论点句"},
        {"step":"继续输入：'把第二层展开成 150 字段落，开头用提问钩子，结尾给行动建议'","expect":"AI 生成带钩子和 CTA 的完整段落"},
        {"step":"打开通义千问，输入：'把以下段落改写成 60 秒口播稿：[粘贴上一步段落]'","expect":"AI 输出口语化演讲稿，约 60 秒"},
        {"step":"打开 Gamma (gamma.app)，粘贴你的提纲，选择 AI 生成 PPT","expect":"预期结果：你获得了一份可直接用于展示的 PPT"},
    ],
    "freshman:底线": [
        {"step":"打开 ChatGPT，输入：'请列出学术写作中使用 AI 的 5 条伦理红线，各举一个违规例子'","expect":"AI 输出 5 条规范和反面案例"},
        {"step":"向 DeepSeek 问一个需要核实的问题，如'维生素 C 能预防感冒吗'，复制回答","expect":"AI 给出一段看似权威的回答，可能包含具体数据"},
        {"step":"用百度/Google 搜索 AI 回答中的关键数据，核对原始来源是否存在","expect":"你可能发现 AI 的引用找不到原始来源"},
        {"step":"整理一份'事实核查记录'：原始问题、AI 回答、核查结果","expect":"预期结果：你掌握了'提问→获取→核查→记录'的底线流程"},
    ],
    # === rag: RAG 赋能路线 ===
    "rag:数据": [
        {"step":"准备一份你自己的学习笔记或工作文档（至少 1000 字），保存为 .txt 文件","expect":"你有一份真实文本作为练习素材"},
        {"step":"用 Python 写一段清洗脚本，去除多余空白和特殊字符，按段落切分成片段","expect":"你得到一份干净的文本片段列表"},
        {"step":"用正则或简单规则给每个片段打标签（如 #概念 #案例 #操作步骤）","expect":"片段有了结构化标签"},
        {"step":"统计片段数量、平均长度、标签分布","expect":"预期结果：一份清洗好、打好标签、了解全貌的文档片段集"},
    ],
    "rag:索引": [
        {"step":"打开 OpenAI/DeepSeek 的 embedding API 文档，阅读接口说明","expect":"理解 embedding 接口的输入输出格式"},
        {"step":"编写 Python 脚本，对清洗后的文档片段逐条调用 embedding API","expect":"每个片段得到一个向量表示"},
        {"step":"把向量和原文片段保存到本地 JSON 文件，建立映射关系","expect":"你有一个可查询的向量索引"},
        {"step":"写一个简单的检索函数：输入查询字符串 → 生成 query embedding → 用余弦相似度找最相关的 top 3 片段","expect":"预期结果：一个本地可运行的检索系统"},
    ],
    "rag:问答": [
        {"step":"设计一个 RAG 问答 prompt 模板（含检索到的资料、用户问题、回答格式要求）","expect":"你有一个可复用的 prompt 模板"},
        {"step":"选一个问题，先检索相关片段，再组装 prompt 发给模型","expect":"AI 基于你的资料给出带来源引用的回答"},
        {"step":"造一个'资料库没有答案'的问题测试——确认 AI 会回答'未提及'而非编造","expect":"AI 正确承认不知道"},
        {"step":"对比纯 prompt（不检索）vs RAG 的回答质量差异","expect":"预期结果：你体验到了 RAG 减少幻觉、增强可信度的价值"},
    ],
    "rag:复核": [
        {"step":"把 RAG 回答中的每个事实性声明标注出来，逐条去原文验证","expect":"你看到哪些有依据、哪些被 AI 添油加醋"},
        {"step":"设计一个'置信度打分'规则：高（原文明确支持）/ 中（原文暗示）/ 低（无原文依据）","expect":"应答有了可信度标签"},
        {"step":"对 3 个不同问题的 RAG 回答执行同样的复核流程，记录通过率","expect":"看到不同问题的准确率差异"},
        {"step":"写一份一页纸的'RAG 质量报告'：准确率、常见错误类型、改进建议","expect":"预期结果：你掌握了一套 RAG 质检流程"},
    ],
    # === creator: 短视频创作者路线 ===
    "creator:选题": [
        {"step":"确定你的目标人群（如大学生/职场新人/宝妈），打开 DeepSeek，输入：'你是短视频策划师，针对[目标人群]，在[抖音/小红书]平台，生成 10 个选题，每个含标题和痛点'","expect":"AI 输出 10 个带钩子的选题方案"},
        {"step":"从 10 个选题中筛选 3 个最有爆款潜力的（考量：是否有争议性、是否有情绪共鸣、是否可操作）","expect":"你筛选出 3 个候选选题"},
        {"step":"对每个选题搜索平台同类内容，评估竞争激烈度和差异化空间","expect":"了解每个选题的竞争格局"},
        {"step":"最终选定 1 个选题，写出标题（A/B 两个版本）和 30 字简介","expect":"预期结果：一个经过验证、有差异化的选题"},
    ],
    "creator:脚本": [
        {"step":"打开 ChatGPT，输入你的选题和口播脚本模板 prompt：'你是短视频编剧。主题：[X]，时长 60 秒。0-5s 钩子，5-30s 要点，30-55s 案例，55-60s CTA'","expect":"AI 生成完整的 60 秒脚本"},
        {"step":"自己朗读一遍脚本，计时——如果超时或节奏太慢，让 AI 精简","expect":"脚本时长卡在 60 秒附近"},
        {"step":"标注字幕需要加重的关键词（每 10 秒至少 1 个），添加表情符号提示","expect":"脚本有了字幕标注"},
        {"step":"把同一脚本改写成小红书图文版（5-8 张图 + 每图 1 句文案）","expect":"预期结果：一个平台的两个内容版本"},
    ],
    "creator:画面": [
        {"step":"打开即梦 (jimeng.jianying.com)，用提示词：'科技感扁平插画，年轻人在电脑前学习，暖色调枣红色为主，竖版 9:16' 生成封面","expect":"AI 生成一张短视频封面图"},
        {"step":"打开可灵 (klingai.com)，用图文转视频功能，上传你的脚本截图生成口播背景","expect":"获得一段可用的画面素材"},
        {"step":"打开剪映，导入 AI 生成的素材 + 录制的口播音频，用'智能字幕'功能自动添加字幕","expect":"剪映自动生成字幕"},
        {"step":"导出视频，检查画面是否清晰、字幕是否对位、声音是否清楚","expect":"预期结果：5 分钟内产出一条带 AI 画面的短视频"},
    ],
    "creator:复盘": [
        {"step":"发布你的视频后 24 小时，记录播放量、完播率、互动率、转粉率四个核心数据","expect":"你有一份基础数据"},
        {"step":"打开评论区，用 AI 总结评论中的主要情绪和反馈（正面/负面/建议）","expect":"了解观众的关注点"},
        {"step":"对比数据与选题时的预期，标记出最大偏差（如预期完播 60% 实际 35%）","expect":"找到最需要改进的环节"},
        {"step":"写一份 300 字复盘：做对了什么、哪里可以更好、下一条的三个具体改进","expect":"预期结果：形成数据驱动的迭代习惯"},
    ],
    # === builder: AI 应用开发路线 ===
    "builder:编程": [
        {"step":"在终端用 curl 或 Python requests 调用一次 DeepSeek/OpenAI API，确认能收到回复","expect":"API 返回 JSON 响应"},
        {"step":"写一个 20 行的 Python 脚本：读取 local 文本文件，调用 API 生成摘要，保存结果","expect":"一个可运行的最小 AI 工具"},
        {"step":"加上错误处理：API 超时、返回错误、文件不存在三种情况","expect":"工具更健壮"},
        {"step":"给脚本加命令行参数支持（argparse）：输入文件路径、输出文件名、模型选择","expect":"预期结果：一个健壮、可配置的命令行 AI 工具"},
    ],
    "builder:RAG": [
        {"step":"安装 chromadb：pip install chromadb，创建 Client 和 Collection","expect":"chromadb 初始化成功"},
        {"step":"把你之前的学习笔记导入 chromadb，逐条添加文档和 metadata","expect":"笔记在向量数据库中可查询"},
        {"step":"写一个查询函数：输入问题 → 检索 top 3 → 拼接到 prompt → 发给 LLM → 返回带来源的回答","expect":"一个可工作的端到端 RAG 流程"},
        {"step":"人工测试 5 个问题，记录召回率和回答准确性","expect":"预期结果：一个经过验证的本地 RAG 问答系统"},
    ],
    "builder:Agent": [
        {"step":"用 prompt 设计一个简单 Agent：给定任务 → 拆解步骤 → 选择工具 → 执行","expect":"Agent 的逻辑框架就绪"},
        {"step":"实现两个工具函数：search(query) 和 calculate(expr)，Agent 能选择正确的工具并调用","expect":"Agent 能自主选择工具执行任务"},
        {"step":"给 Agent 加上执行记录——每一步的工具调用、输入、输出都打印出来","expect":"Agent 的执行过程可追踪"},
        {"step":"设计一个多步骤任务（如'搜索某股票价格并计算 3 天涨幅'），观察 Agent 是否能正确串联工具","expect":"预期结果：一个能自主拆解任务、调用工具、汇报结果的 Agent"},
    ],
    "builder:部署": [
        {"step":"用 Flask/FastAPI 把 AI 工具包装成 REST API：/api/chat 端点接收 POST 请求","expect":"你的工具可以通过 HTTP 调用"},
        {"step":"配置环境变量（.env 文件 + python-dotenv），API Key 不硬编码在代码里","expect":"API Key 安全隔离"},
        {"step":"写 Dockerfile，构建镜像并本地运行：docker build -t my-ai-app . && docker run -p 5000:5000 my-ai-app","expect":"工具在 Docker 容器中运行"},
        {"step":"用 curl 或 Postman 测试 /api/chat 接口，确认跨机器能访问","expect":"预期结果：你的 AI 工具可以被任何人通过网络使用"},
    ],
    # === deploy: AI 部署交付路线 ===
    "deploy:交付": [
        {"step":"检查你的项目：README 是否能在 5 分钟内让新人跑起来？依赖是否锁定？License 是否存在？","expect":"列出项目交付的 gap 清单"},
        {"step":"补充 README 的'快速开始'部分：安装依赖 → 配置环境 → 运行 → 示例输出","expect":"新人能照着操作跑通"},
        {"step":"给项目打语义化版本号（如 v1.0.0），写 CHANGELOG.md 记录变更","expect":"项目版本可追溯"},
        {"step":"创建 GitHub Release，上传安装包/可执行文件","expect":"预期结果：一个专业的项目发布"},
    ],
    "deploy:部署": [
        {"step":"把你的项目部署到免费云平台（如 Railway/Render/Zeabur），获取公网 URL","expect":"你的项目有一个公网访问地址"},
        {"step":"配置环境变量（API Key 等）在云平台的面板而非代码中","expect":"敏感信息不入仓库"},
        {"step":"设置自定义域名（如果有），配置 HTTPS","expect":"HTTPS 证书自动签发"},
        {"step":"从手机/另一台电脑访问你的服务，确认可用","expect":"预期结果：你的 AI 工具在生产环境中运行"},
    ],
    "deploy:稳定性": [
        {"step":"给你的服务加一条简单的健康检查端点 /health，返回 {\"status\":\"ok\"}","expect":"监控系统能 ping 这个端点"},
        {"step":"配置日志：记录每次 API 调用的时间、耗时、状态码、错误信息","expect":"出问题时有据可查"},
        {"step":"设置简单的告警：连续 5 次 500 错误 → 发一条提醒（可用 Webhook/钉钉/企微机器人）","expect":"你不会在用户都跑了才发现挂了"},
        {"step":"模拟一次故障（如关掉数据库），观测告警是否触发、日志是否记录","expect":"预期结果：验证了监控和告警链路的有效性"},
    ],
    "deploy:迭代": [
        {"step":"统计你的服务一周的数据：调用量、平均延迟、错误率、用户活跃度","expect":"有数据支撑迭代决策"},
        {"step":"收集 3-5 个用户反馈，用 AI 分析出 top 2 最急需的功能","expect":"迭代方向有用户依据"},
        {"step":"制定下一个版本的发布计划：功能列表、验收标准、时间节点","expect":"版本规划文档化"},
        {"step":"执行一次回滚演练：切到上一个版本 → 运行测试 → 再切回来","expect":"预期结果：你掌握了持续交付+安全回滚的完整流程"},
    ],
}

with open("../assets/data/tracks.json", "r", encoding="utf-8") as f:
    tracks = json.load(f)

for track_id, track in tracks.items():
    modules = track["modules"]
    for i, mod in enumerate(modules):
        if isinstance(mod, list):
            title, desc = mod[0], mod[1]
            key = f"{track_id}:{title}"
            practice = PRACTICE.get(key, [])
            modules[i] = {"title": title, "desc": desc, "practice": practice}
            if practice:
                print(f"  ✅ {key}: {len(practice)} practice steps")
            else:
                print(f"  ⚠️  {key}: NO practice defined")
        else:
            key = f"{track_id}:{mod['title']}"
            practice = PRACTICE.get(key, [])
            if practice and "practice" not in mod:
                mod["practice"] = practice
                print(f"  ✅ {key}: {len(practice)} steps added to existing object")
            else:
                print(f"  ℹ️  {key}: already has practice or no match")

with open("../assets/data/tracks.json", "w", encoding="utf-8") as f:
    json.dump(tracks, f, ensure_ascii=False, indent=2)

print("\n✅ tracks.json updated with practice tutorials")
