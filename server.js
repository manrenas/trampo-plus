const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function safePath(requestPath) {
  const urlPath = decodeURIComponent(requestPath.split('?')[0]);
  return path.normalize(urlPath).replace(/^\.+/, '');
}

function sendFile(res, filePath, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro ao ler o ficheiro solicitado.');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestedPath = safePath(req.url || '/');
  const basePath = requestedPath === '/' ? '/index.html' : requestedPath;
  const fullPath = path.join(rootDir, basePath);

  const isInsideRoot = fullPath.startsWith(rootDir);
  if (!isInsideRoot) {
    sendFile(res, path.join(rootDir, '404.html'), 404);
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(res, fullPath, 200);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.html');
      fs.stat(indexPath, (indexErr) => {
        if (!indexErr) {
          sendFile(res, indexPath, 200);
        } else {
          sendFile(res, path.join(rootDir, '404.html'), 404);
        }
      });
      return;
    }

    sendFile(res, path.join(rootDir, '404.html'), 404);
  });
});

server.listen(port, () => {
  console.log(`Servidor ativo em http://localhost:${port}`);
});
