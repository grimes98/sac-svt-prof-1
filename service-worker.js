const CACHE_NAME = 'sac-svt-prof-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'login.html',
  'admin.html',
  'jil-thani.html',
  'maktaba.html',
  'qamous.html',
  'mokhbar.html',
  'wathaiq.html',
  'manifest.json',
  'sac-chatbot.js',
  'sac-memo-analyzer.js',
  'assets/Sac.png'
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✓ [Service Worker] Caching core SAC SVT prof assets');
        return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, {cache: 'reload'})));
      })
      .then(() => self.skipWaiting())
      .catch(err => console.log('SW Install error:', err))
  );
});

// تفعيل وتفريغ الكاش القديم عند التحديث
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('✓ [Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب الطلبات: استخدام الشبكة أولاً للحصول على أحدث التحديثات والمذكرات ثم الكاش كاحتياط
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // إذا كان الاتصال ممتاز، نخزن نسخة في الكاش للمستقبل ونرجع النتيجة
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          })
          .catch(() => {});
        return response;
      })
      .catch(() => {
        // في حال انقطاع الأنترنت، نرجع النسخة المحفوظة في الكاش
        return caches.match(event.request);
      })
  );
});