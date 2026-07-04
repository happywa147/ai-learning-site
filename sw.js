const CACHE_NAME = "ai-learning-v1";

const PRECACHE_ASSETS = ["/", "/index.html", "/styles.css", "/app.js", "/manifest.json"];

/* Install: pre-cache key assets */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Pre-cache failed for some assets:", err);
      });
    })
  );
  self.skipWaiting();
});

/* Activate: clean old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

/* Fetch: cache-first for static assets, network-first for data */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET requests */
  if (request.method !== "GET") return;

  /* Skip browser extensions and chrome-extension requests */
  if (!url.protocol.startsWith("http")) return;

  /* Skip Google Analytics requests */
  if (url.hostname.includes("google-analytics.com") || url.hostname.includes("googletagmanager.com")) return;

  /* Cache-first strategy for static assets (same origin) */
  if (url.origin === self.location.origin) {
    const isDataRequest = url.pathname.includes("/data/") || url.pathname.includes("/api/");

    if (isDataRequest) {
      /* Network-first for data */
      event.respondWith(
        fetch(request)
          .then((response) => {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            return response;
          })
          .catch(() => caches.match(request).then((cached) => cached || offlineFallback()))
      );
    } else {
      /* Cache-first for static assets */
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;

          return fetch(request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== "basic") {
                return response;
              }
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
              return response;
            })
            .catch(() => {
              if (request.destination === "document") {
                return caches.match("/index.html");
              }
              return offlineFallback();
            });
        })
      );
    }
    return;
  }

  /* External resources: network-only */
  event.respondWith(fetch(request));
});

/* Basic offline fallback page */
function offlineFallback() {
  return new Response(
    `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>离线 - AI 原生能力自学站</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #fdf6f3;
      color: #2c2c2c;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 24px;
    }
    .offline-card {
      background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 420px; width: 100%; padding: 40px 32px; text-align: center;
    }
    .offline-icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; margin-bottom: 8px; color: #8f2f2a; }
    p { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 24px; }
    .retry-btn {
      display: inline-block; padding: 10px 28px; background: #8f2f2a; color: #fff;
      border-radius: 8px; text-decoration: none; font-size: 15px;
      border: none; cursor: pointer;
    }
    .retry-btn:hover { background: #a33a33; }
    .hint { font-size: 13px; color: #999; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="offline-card">
    <div class="offline-icon">&#128264;</div>
    <h1>当前处于离线状态</h1>
    <p>AI 原生能力自学站需要网络连接才能加载最新内容。<br />请检查你的网络连接后重试。</p>
    <button class="retry-btn" onclick="location.reload()">重新连接</button>
    <p class="hint">你之前浏览过的页面可以在离线时访问。</p>
  </div>
</body>
</html>`,
    {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}
