"use strict";
/* ====== P2-PR7: AI Tutor ====== */
const aiTutorState = { messages: [], context: null, loading: false };

function openAiTutor(context = {}) {
  aiTutorState.context = context;
  aiTutorState.messages = [];
  let overlay = document.querySelector("#aiTutorOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "aiTutorOverlay";
    overlay.className = "ai-tutor-overlay";
    overlay.innerHTML = `
      <div class="ai-tutor-panel">
        <div class="ai-tutor-header">
          <strong>AI 学习辅导</strong>
          <button id="aiTutorClose" type="button" style="background:none;border:none;font-size:22px;cursor:pointer;color:#8a7f72;">×</button>
        </div>
        <div id="aiTutorMessages" class="ai-tutor-messages"></div>
        <div class="ai-tutor-input-area">
          <textarea id="aiTutorInput" rows="2" placeholder="输入你的问题…"></textarea>
          <button id="aiTutorSend" type="button">发送</button>
        </div>
      </div>
    `;
    document.body.append(overlay);
    overlay.querySelector("#aiTutorClose").addEventListener("click", closeAiTutor);
    overlay.querySelector("#aiTutorSend").addEventListener("click", sendAiTutorMessage);
    overlay.querySelector("#aiTutorInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAiTutorMessage(); }
    });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeAiTutor(); });
  }
  overlay.classList.add("tutor-active");
  const sysMsg = context.title
    ? `你好！我是你的 AI 学习辅导。当前上下文：${safeText(context.title)}。${safeText(context.desc || "")}。有什么想深入了解的吗？`
    : `你好！我是你的 AI 学习辅导。有什么 AI 学习相关的问题可以帮你？`;
  aiTutorState.messages.push({ role: "assistant", content: sysMsg });
  renderAiTutorMessages();
}

function closeAiTutor() {
  const overlay = document.querySelector("#aiTutorOverlay");
  if (overlay) overlay.classList.remove("tutor-active");
}

function renderAiTutorMessages() {
  const container = document.querySelector("#aiTutorMessages");
  if (!container) return;
  container.innerHTML = aiTutorState.messages.map((msg) => {
    const cls = msg.role === "user" ? "user" : "assistant";
    return `<div class="ai-tutor-msg ${cls}">${escapeHtml(msg.content)}</div>`;
  }).join("");
  container.scrollTop = container.scrollHeight;
}

async function sendAiTutorMessage() {
  const input = document.querySelector("#aiTutorInput");
  if (!input || !input.value.trim()) return;
  const userMsg = input.value.trim();
  aiTutorState.messages.push({ role: "user", content: userMsg });
  input.value = "";
  renderAiTutorMessages();

  const sendBtn = document.querySelector("#aiTutorSend");
  if (sendBtn) sendBtn.disabled = true;

  aiTutorState.messages.push({ role: "assistant", content: "" });
  const assistantIdx = aiTutorState.messages.length - 1;

  try {
    const contextPrompt = aiTutorState.context
      ? `你是一个 AI 学习教练。当前学习上下文：${safeText(aiTutorState.context.title)} - ${safeText(aiTutorState.context.desc || "")}。请基于此上下文回答问题。`
      : "你是一个 AI 学习教练，专注于帮助中文学习者学习 AI 知识。";

    const apiBaseUrl = localStorage.getItem("ai-tutor-api-url") || "";
    const apiKey = sessionStorage.getItem("ai-tutor-api-key") || "";

    if (!apiBaseUrl || !apiKey) {
      aiTutorState.messages[assistantIdx] = {
        role: "assistant",
        content: "AI 辅导功能需要配置 API。请在浏览器控制台执行：\n\nlocalStorage.setItem('ai-tutor-api-url', 'https://api.deepseek.com/v1');\nsessionStorage.setItem('ai-tutor-api-key', 'sk-xxx你的密钥xxx');\n\n🔒 API 密钥仅存储于当前浏览器会话（sessionStorage），关闭标签页后自动清除，不会持久化到磁盘。\n支持任何兼容 OpenAI 格式的 API（DeepSeek、通义千问等）。"
      };
      renderAiTutorMessages();
      return;
    }

    const messages = [{ role: "system", content: contextPrompt }, ...aiTutorState.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }))];

    const res = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: localStorage.getItem("ai-tutor-model") || "deepseek-chat", messages, stream: true })
    });

    if (!res.ok) throw new Error(`API 返回 ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") break;
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content || "";
          aiTutorState.messages[assistantIdx].content += delta;
          renderAiTutorMessages();
        } catch {}
      }
    }
  } catch (err) {
    aiTutorState.messages[assistantIdx] = {
      role: "assistant",
      content: `抱歉，请求出错了：${err.message}\n\n请检查 API 配置是否正确。你也可以先参考站内内容自学，等配好 API 后再来问我。`
    };
    renderAiTutorMessages();
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

/* ====== P2-PR5: Code Editor Embed ====== */
function createCodeEditorEmbed(projectTitle, level) {
  const templates = {
    "入门": "https://stackblitz.com/edit/python-repl?embed=1&file=main.py",
    "进阶": "https://stackblitz.com/edit/node-starter?embed=1&file=index.js",
    "高阶": "https://stackblitz.com/edit/react-ts?embed=1&file=App.tsx"
  };
  const url = templates[level] || templates["入门"];
  return `
    <button class="code-editor-toggle" onclick="toggleCodeEditor(this, '${url}', '${safeText(projectTitle)}')">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
      在线练习（StackBlitz）
    </button>
  `;
}

function toggleCodeEditor(btn, url, title) {
  const existing = btn.nextElementSibling;
  if (existing && existing.classList.contains("code-editor-embed")) {
    existing.remove();
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>在线练习（StackBlitz）`;
    return;
  }
  const container = document.createElement("div");
  container.className = "code-editor-embed";
  container.innerHTML = `<iframe src="${url}" title="${title} 在线练习" loading="lazy"></iframe>`;
  btn.after(container);
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>收起编辑器`;
}

/* ====== P1-PR4: Cloud Sync (Supabase) ====== */
const syncState = { enabled: false, lastSync: null, supabase: null };

function initCloudSync() {
  const supabaseUrl = localStorage.getItem("ai-sync-supabase-url");
  const supabaseKey = localStorage.getItem("ai-sync-supabase-key");
  if (!supabaseUrl || !supabaseKey) return;

  syncState.enabled = true;
  syncState.supabase = { url: supabaseUrl, key: supabaseKey };
  console.log("[Cloud Sync] 已启用 Supabase 同步");

  const deviceId = getStoredString("ai-sync-device-id", "");
  if (!deviceId) {
    const newId = "dev-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    setStoredValue("ai-sync-device-id", newId);
  }

  setInterval(autoSync, 30000);
}

async function autoSync() {
  if (!syncState.enabled) return;
  const deviceId = getStoredString("ai-sync-device-id", "");
  if (!deviceId) return;

  const allData = exportAllLocalData();
  try {
    await fetch(`${syncState.supabase.url}/rest/v1/learning_progress?device_id=eq.${deviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: syncState.supabase.key,
        Authorization: `Bearer ${syncState.supabase.key}`,
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        device_id: deviceId,
        data: allData,
        updated_at: new Date().toISOString()
      })
    });
    syncState.lastSync = new Date().toLocaleString("zh-CN", { hour12: false });
  } catch (err) {
    console.warn("[Cloud Sync] 同步失败:", err.message);
  }
}

