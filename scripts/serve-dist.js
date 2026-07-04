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
  '.br': 'application/octet-stream', // Brotli compressed files
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  let filePath = path.join(DIST, urlPath === '/' ? '/index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();

  // Handle directory requests - serve index.html if exists
  if (!ext) {
    const indexPath = filePath + '/index.html';
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    }
  }

  // Check for .br file if client accepts br encoding
  const acceptsBr = req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('br');
  if (acceptsBr && ext !== '.br' && fs.existsSync(filePath + '.br')) {
    const brPath = filePath + '.br';
    const originalExt = ext || path.extname(filePath + '.html').toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[originalExt] || 'application/octet-stream',
      'Content-Encoding': 'br',
      'Cache-Control': 'no-cache',
    });
    return fs.createReadStream(brPath).pipe(res);
  }

  // Read file
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
