const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 8765;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();

  // Default to index.html for SPA-like routing
  if (!ext && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving dist/ at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
