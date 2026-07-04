#!/usr/bin/env python3
"""Add difficulty labels and commonErrors to all modules in tracks.json."""
import json
import sys

with open("../assets/data/tracks.json", encoding="utf-8") as f:
    tracks = json.load(f)

# Difficulty map: themed to each track's progression
difficulty_map = {
    "freshman": ["beginner", "beginner", "intermediate", "intermediate"],
    "rag": ["intermediate", "intermediate", "advanced", "intermediate"],
    "creator": ["beginner", "intermediate", "advanced", "advanced"],
    "builder": ["intermediate", "advanced", "advanced", "advanced"],
    "deploy": ["advanced", "advanced", "advanced", "advanced"],
}

# Common errors per track/module
common_errors = {
    "freshman": [
        [
            {"error": "AI 回复太长看不懂", "fix": "在提示词末尾加一句「请用通俗易懂的语言解释，避免专业术语」"},
            {"error": "不知道 AI 能做什么", "fix": "试试问「你能帮我做哪些事情？举 10 个例子」"}
        ],
        [
            {"error": "一次性写太长提示词导致 AI 跑偏", "fix": "把任务拆成 2-3 轮对话，每轮只聚焦一个问题"},
            {"error": "忘记告诉 AI 输出格式", "fix": "加上「请用 Markdown 表格输出」或「请用 bullet points 列出」"}
        ],
        [
            {"error": "不知道选哪个 AI 工具", "fix": "Coding 用 Claude/DeepSeek，写作用 DeepSeek/通义千问，长文档用 Gemini/Kimi"},
            {"error": "register 后无法登录", "fix": "检查邮箱验证链接是否过期，重新发送验证邮件"}
        ],
        [
            {"error": "接入 API 时报 401 错误", "fix": "确认 API Key 格式正确（通常以 sk- 开头），检查是否在后台开启了 API 权限"},
            {"error": "Python 环境报 ModuleNotFoundError", "fix": "运行 pip install openai（或 pip3），确认 Python 版本 ≥ 3.8"}
        ],
    ],
    "rag": [
        [
            {"error": "ChromaDB 报版本冲突", "fix": "运行 pip install chromadb==0.4.24，确保与 langchain 版本兼容"},
            {"error": "向量化后搜索不到结果", "fix": "检查 chunk_size 是否太大（500-1000 字符），embedding 模型是否与查询时一致"}
        ],
        [
            {"error": "文档切分后上下文断裂", "fix": "设置 chunk_overlap=200 让相邻 chunk 有重叠"},
            {"error": "检索到了不相关的文档片段", "fix": "用 Reranker 做二次排序，过滤低相关性结果"}
        ],
        [
            {"error": "本地 RAG 查询很慢", "fix": "检查 GPU 加速（pip install faiss-gpu），减少文档数做测试"},
            {"error": "中文文本被错误切分", "fix": "使用 RecursiveCharacterTextSplitter 并设置中文分隔符"}
        ],
        [
            {"error": "RAG 回答不够准确", "fix": "增加 top_k 参数到 5-8，使用混合检索（BM25+向量）"},
            {"error": "Embedding 模型选择不当", "fix": "中文推荐 text2vec-large-chinese 或 bge-large-zh"}
        ],
    ],
    "creator": [
        [
            {"error": "AI 生成图片构图差、细节失真", "fix": "使用构图关键词如 center composition, rule of thirds，并指定 negative prompts"},
            {"error": "生成的图片不符合国内审核要求", "fix": "避免敏感词汇，选择国内合规的生图工具如通义万相"}
        ],
        [
            {"error": "AI 生成视频出现闪烁/抖动", "fix": "增加帧间一致性参数，降低 motion 强度到 30-50%"},
            {"error": "视频生成时间太长", "fix": "先用低分辨率预览（360p），确认效果后再生成高清版"}
        ],
        [
            {"error": "多模态内容排期混乱", "fix": "用 Notion 或飞书表格管理内容日历，标注 AI 工具和生成时间"},
            {"error": "AI 生成文案风格不统一", "fix": "先定义品牌 tone of voice 文档，每次创作时粘贴到 Prompt 中"}
        ],
        [
            {"error": "视频上传后平台压缩画质", "fix": "导出时用 H.265 编码 + 高码率（20Mbps+），避开平台二次压缩"},
            {"error": "AI 视频声音与画面不同步", "fix": "音频单独用 AI 生成后，在剪辑软件中手动对齐，不要依赖 AI 自动合成"}
        ],
    ],
    "builder": [
        [
            {"error": "pip install 报依赖冲突", "fix": "使用虚拟环境 python -m venv venv && source venv/bin/activate，再安装依赖"},
            {"error": "不知道从哪里开始搭建应用", "fix": "先画流程图明确每步输入输出，再用 AI 生成每步的 Prompt 模板"}
        ],
        [
            {"error": "API 调用 401/403 错误", "fix": "确认 API Key 格式正确（以 sk- 开头），在后台开启 API 权限"},
            {"error": "本地运行正常但部署后报错", "fix": "检查环境变量是否配置（API_KEY 等），运行时打印详细日志定位问题"}
        ],
        [
            {"error": "数据库连接失败", "fix": "检查 connection string 格式，确认 IP 白名单设置，先 telnet 测试端口可达性"},
            {"error": "前端调用后端接口跨域报错", "fix": "后端添加 CORS 头 Access-Control-Allow-Origin，或使用反向代理统一域名"}
        ],
        [
            {"error": "生产环境 API 调用费用暴增", "fix": "加缓存层（Redis），对重复查询返回缓存结果，设置每用户每日调用上限"},
            {"error": "多用户并发时数据混乱", "fix": "用 session_id / user_id 严格隔离，数据库查询始终加 WHERE user_id=?"}
        ],
    ],
    "deploy": [
        [
            {"error": "Docker 构建失败 Missing Dockerfile", "fix": "确认 Dockerfile 在项目根目录，运行 docker build -t app . 前先 ls 确认文件存在"},
            {"error": "容器启动后立刻退出", "fix": "检查 ENTRYPOINT/CMD 命令是否正确，运行 docker logs <container> 查看错误信息"}
        ],
        [
            {"error": "GitHub Actions 部署 403", "fix": "检查 Secrets 中 DEPLOY_TOKEN 是否过期，重新生成并更新"},
            {"error": "环境变量未生效", "fix": "确认 docker run -e 或 docker-compose.yml 中 environment 配置正确，进入容器 echo $VAR 验证"}
        ],
        [
            {"error": "CDN 缓存导致更新不可见", "fix": "在构建脚本中添加 version hash 到文件名，或手动清除 CDN 缓存"},
            {"error": "HTTPS 证书过期导致用户无法访问", "fix": "使用 Let's Encrypt 自动续期，配置 certbot renew cron job"}
        ],
        [
            {"error": "日志量太大磁盘爆满", "fix": "配置 logrotate 每天轮转 + 保留 7 天，或接入云日志服务（如阿里云 SLS）"},
            {"error": "性能监控缺失，出问题不知道", "fix": "接入 Prometheus + Grafana，至少监控 CPU/内存/QPS/响应时间 4 个核心指标"}
        ],
    ],
}

count = 0
for track_id, track in tracks.items():
    diffs = difficulty_map.get(track_id, ["beginner"] * len(track["modules"]))
    errs = common_errors.get(track_id, [])
    for i, mod in enumerate(track["modules"]):
        new_diff = diffs[i] if i < len(diffs) else "beginner"
        if mod.get("difficulty") != new_diff:
            mod["difficulty"] = new_diff
            count += 1
        new_errs = errs[i] if i < len(errs) else []
        if mod.get("commonErrors") != new_errs:
            mod["commonErrors"] = new_errs
            count += 1

with open("../assets/data/tracks.json", "w", encoding="utf-8") as f:
    json.dump(tracks, f, ensure_ascii=False, indent=2)

print(f"✅ Added {count} fields (difficulty + commonErrors) to tracks.json")
for track_id, track in tracks.items():
    for i, mod in enumerate(track["modules"]):
        d = mod.get("difficulty", "?")
        ce = len(mod.get("commonErrors", []))
        print(f"  {track_id}/{i}: difficulty={d}, commonErrors={ce}")
