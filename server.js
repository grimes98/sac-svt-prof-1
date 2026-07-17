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

const server = http.createServer(async (req, res) => {
  // معالج نبض الحياة السريع (Keep-Alive Heartbeat / Ping Endpoint) للحفاظ على نشاط الخادم على Render ومنع وضع السكون
  if (req.method === "GET" && (req.url === "/api/ping" || req.url === "/ping")) {
    res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/plain; charset=UTF-8" });
    return res.end("PONG 🟢 — SAC server is awake and active!");
  }

  // 1. معالج واجهة برمجة التطبيقات الذكية (/api/chat) لربط المساعد الذكي بنماذج الذكاء الاصطناعي العالمية (Arena / OpenRouter / OpenAI)
  if (req.method === 'POST' && req.url.startsWith('/api/chat')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { question, systemPrompt } = JSON.parse(body || '{}');
        if (!question) {
          res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'السؤال مطلوب' }));
        }

        // التحقق من وجود مفتاح API في متغيرات البيئة على خادم Render (مثل OPENROUTER_API_KEY أو ARENA_API_KEY أو OPENAI_API_KEY)
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.ARENA_API_KEY || process.env.OPENAI_API_KEY;
        const endpoint = process.env.AI_ENDPOINT_URL || (process.env.OPENAI_API_KEY ? 'https://api.openai.com/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions');
        const model = process.env.AI_MODEL_NAME || 'deepseek/deepseek-chat';

        if (apiKey) {
          const aiReq = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt || 'أنت خبير بيداغوجي وعالم أحياء متخصص في منهاج علوم الطبيعة والحياة للتعليم المتوسط في الجزائر (الجيل الثاني).' },
                { role: 'user', content: question }
              ],
              temperature: 0.7,
              max_tokens: 1000
            })
          });
          const aiRes = await aiReq.json();
          const reply = aiRes.choices?.[0]?.message?.content;
          if (reply) {
            res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ reply: reply, source: 'arena_proxy_api' }));
          }
        }

        // في حال عدم وجود مفتاح API مخزن، يتم التوجيه السحابي الفوري إلى البوابة المفتوحة المجانية (Pollinations AI Gateway)
        const pollPrompt = (systemPrompt ? systemPrompt + '\n\nالسؤال: ' : '') + question;
        const pollReq = await fetch(`https://text.pollinations.ai/${encodeURIComponent(pollPrompt)}`, { method: 'GET' });
        if (pollReq.ok) {
          const pollText = await pollReq.text();
          if (pollText && pollText.trim().length > 10) {
            res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ reply: pollText.trim(), source: 'pollinations_cloud' }));
          }
        }

        res.writeHead(503, { ...SECURITY_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'تعذر الاتصال بالسحابة، الرجاء الاعتماد على المحرك المحلي المدمج' }));
      } catch (err) {
        res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. تفكيك الرابط وإزالة الاستعلامات ومحددات التتبع (مثل ?fbclid=... المضافة تلقائياً من فيسبوك)
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
      if (urlPath.includes("takwin-10") || urlPath.includes("i3lam-ali")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-i3lam-ali.html")) ? "takwin-i3lam-ali.html" : "takwin-10.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-01") || urlPath.includes("3ulum-tarbiya")) {
        const altPath = path.join(__dirname, "takwin-01.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-02") || urlPath.includes("nafs-tarbawi")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-nafs-tarbawi.html")) ? "takwin-nafs-tarbawi.html" : "takwin-02.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-03") || urlPath.includes("namaw")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-namaw.html")) ? "takwin-namaw.html" : "takwin-03.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-04") || urlPath.includes("didactique")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-didactique.html")) ? "takwin-didactique.html" : "takwin-04.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-05") || urlPath.includes("mota3aqidin")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-mota3aqidin.html")) ? "takwin-mota3aqidin.html" : "takwin-05.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-11") || urlPath.includes("anmat")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-11.html")) ? "takwin-11.html" : "anmat.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
      if (urlPath.includes("takwin-12") || urlPath.includes("istratijiyat")) {
        const altPath = path.join(__dirname, fs.existsSync(path.join(__dirname, "takwin-12.html")) ? "takwin-12.html" : "istratijiyat.html");
        if (fs.existsSync(altPath)) {
          return fs.readFile(altPath, (err, altContent) => {
            if (!err) {
              res.writeHead(200, { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=UTF-8" });
              return res.end(altContent, "utf-8");
            }
          });
        }
      }
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

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 خادم منصة SAC · SVT prof يعمل بنجاح وبحماية HTTP Security Headers وتوجيه المساعد الذكي (/api/chat) على المنفذ: ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    process.exit(0);
  });
});
