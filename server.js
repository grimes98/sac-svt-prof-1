import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain; charset=UTF-8'
};

// ترويسات الأمان والحماية العالمية لخادم الويب (HTTP Security Headers)
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Access-Control-Allow-Origin': '*'
};

const server = http.createServer((req, res) => {
  // تفكيك الرابط وإزالة الاستعلامات ومحددات التتبع (مثل ?fbclid=... المضافة تلقائياً من فيسبوك)
  let urlPath = req.url.split('?')[0].split('#')[0];
  if (urlPath === '/' || urlPath === '' || urlPath.endsWith('/')) {
    urlPath = '/index.html';
  }

  let filePath = path.join(__dirname, urlPath);

  // التحقق مما إذا كان المسار يشير إلى مجلد (Directory) بدل ملف لتجنب خطأ EISDIR
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (e) {
    // تجاهل أخطاء الفحص الأولي وسيتم معالجتها بأمان في fs.readFile
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      // عند حدوث أي خطأ (مثل ENOENT أو EISDIR)، نعود بأمان لتحميل الصفحة الرئيسية index.html لمنع توقف الموقع في متصفحات فيسبوك وتيك توك
      fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
        if (err) {
          res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('خطأ في تحميل الصفحة الرئيسية index.html');
        } else {
          res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(indexContent, 'utf-8');
        }
      });
    } else {
      // منع التخزين المؤقت لصفحات الإدارة والتسجيل لحماية الجلسات
      let extraHeaders = {};
      if (urlPath.includes('admin') || urlPath.includes('login')) {
        extraHeaders = {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        };
      }
      res.writeHead(200, { ...SECURITY_HEADERS, ...extraHeaders, 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 خادم منصة SAC · SVT prof يعمل بنجاح وبحماية HTTP Security Headers كاملة على المنفذ: ${PORT}`);
});
