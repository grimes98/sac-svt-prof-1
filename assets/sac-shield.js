/* =========================================================================
   🛡️ درع حماية SAC v2 — منصة SAC · SVT prof
   الفكرة:
   1) تصفح عادي → علامة مائية مخفية تماماً (شاشة نقية)
   2) Trigger (PrintScreen / Win+Shift+S / F12 / Ctrl+P / تبديل التبويب…)
      → تومض العلامة المائية + تظهر شاشة التعتيم #antiScreenshotOverlay
      → لا تختفي إلا بضغطتين متتاليتين بالفأرة (Double-Click)
   3) فخ النسخ: أي نص منسوخ يخرج من الحافظة مختوماً بختم الملكية
   * خانات الإدخال (input/textarea) مستثناة حتى لا تتعطل النماذج
   ========================================================================= */
(function () {
  if (window.__sacShieldV2) return;
  window.__sacShieldV2 = 1;

  var OWNER = 'SAC · SVT prof · قريمس أماني · 2026';
  var MSG   = '🛡️ المحتوى محمي — منصة SAC · SVT prof';
  var STAMP = '\n\n© محمي بحقوق منصة SAC · SVT prof — الأستاذة قريمس أماني';

  /* ---------- CSS مضخون برمجياً (لا يحتاج تعديل ملفات الصفحات) ---------- */
  var css =
    'body{-webkit-user-select:none;-moz-user-select:none;user-select:none}' +
    'input,textarea,[contenteditable="true"]{-webkit-user-select:text;-moz-user-select:text;user-select:text}' +
    'img{-webkit-user-drag:none}' +
    '#sacShieldToast{position:fixed;bottom:24px;right:50%;transform:translateX(50%);' +
      'background:#0b3d3d;color:#eaf9f9;padding:10px 22px;border-radius:999px;' +
      'font-size:.88rem;font-weight:700;z-index:2147483000;box-shadow:0 8px 24px rgba(0,60,60,.35);' +
      'opacity:0;pointer-events:none;transition:opacity .25s;font-family:Tajawal,Arial,sans-serif}' +
    '#sacShieldToast.on{opacity:1}' +
    /* شاشة التعتيم */
    '#antiScreenshotOverlay{position:fixed;inset:0;z-index:2147483001;display:none;' +
      'align-items:center;justify-content:center;text-align:center;padding:24px;' +
      'background:radial-gradient(circle at 50% 38%,#3a1010,#120505 78%);color:#ffe3e3;' +
      'font-family:Tajawal,Arial,sans-serif;direction:rtl}' +
    '#antiScreenshotOverlay .bx{max-width:540px;margin:auto}' +
    '#antiScreenshotOverlay .ic{font-size:3.2rem;line-height:1}' +
    '#antiScreenshotOverlay h2{margin:10px 0 8px;font-size:1.6rem;color:#ffb4b4}' +
    '#antiScreenshotOverlay p{margin:6px 0;opacity:.92;line-height:1.9;font-size:.98rem}' +
    '#antiScreenshotOverlay .hint{margin-top:18px;display:inline-block;background:#ffd166;' +
      'color:#4a2b00;font-weight:700;padding:11px 22px;border-radius:999px;font-size:.92rem;' +
      'box-shadow:0 6px 18px rgba(0,0,0,.4)}' +
    /* العلامة المائية الذكية (مخفية، تظهر تحت التعتيم وفوقه للقطة) */
    '.sacWatermark{position:fixed;inset:-22%;z-index:2147483002;display:none;pointer-events:none;' +
      'opacity:0;transform:rotate(-18deg);flex-direction:column;justify-content:space-evenly;overflow:hidden}' +
    '.sacWatermark .wl{white-space:nowrap;text-align:center;font-family:Tajawal,Arial,sans-serif;' +
      'font-weight:700;font-size:36px;color:#ffffff;line-height:2.6}' +
    '.sacWatermark.on{display:flex;opacity:.1}';

  var st = document.createElement('style');
  st.id = 'sacShieldCSS';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------- العناصر ---------- */
  function ready(fn){
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    /* التوست */
    var toast = document.createElement('div');
    toast.id = 'sacShieldToast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);

    /* العلامة المائية: 12 سطر × الاسم مرتين */
    var wm = document.createElement('div');
    wm.className = 'sacWatermark';
    wm.setAttribute('aria-hidden', 'true');
    var html = '';
    for (var i = 0; i < 12; i++) html += '<div class="wl">' + OWNER + ' &nbsp; ' + OWNER + '</div>';
    wm.innerHTML = html;
    document.body.appendChild(wm);

    /* شاشة التعتيم */
    var ov = document.createElement('div');
    ov.id = 'antiScreenshotOverlay';
    ov.setAttribute('role', 'alert');
    ov.innerHTML =
      '<div class="bx"><div class="ic">🛡️</div>' +
      '<h2>⛔ منطقة محمية</h2>' +
      '<p>تم تفعيل نظام حماية المحتوى لمنع التصوير أو النسخ غير المصرّح به.<br>' +
      'هذه الصفحة مملوكة لمنصة <b>SAC · SVT prof</b> — الأستاذة قريمس أماني.</p>' +
      '<span class="hint">💡 لإغلاق شاشة الحماية ومتابعة التصفح: اضغط مرتين متتاليتين بالفأرة (Double-Click) في أي مكان على الشاشة ✕</span></div>';
    document.body.appendChild(ov);

    var tmr;
    function showToast(t) {
      toast.textContent = t || MSG;
      toast.classList.add('on');
      clearTimeout(tmr);
      tmr = setTimeout(function () { toast.classList.remove('on'); }, 2300);
    }
    function shieldON() {                 /* Trigger: تعتيم + وميض العلامة */
      ov.style.display = 'flex';
      wm.classList.add('on');
    }
    function shieldOFF() {                /* الإغلاق الصريح بـ Double-Click فقط */
      ov.style.display = 'none';
      wm.classList.remove('on');
    }

    /* الخانات الحساسة (نماذج) مستثناة */
    function isEdit(t) {
      return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    }

    /* ---------- المشغّلات ---------- */
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); showToast(); });

    document.addEventListener('copy', function (e) {      /* فخ النسخ */
      if (isEdit(e.target)) return;
      e.preventDefault();
      var sel = '';
      try { sel = (window.getSelection && window.getSelection().toString()) || ''; } catch (_) {}
      try {
        if (e.clipboardData) e.clipboardData.setData('text/plain', sel + STAMP);
      } catch (_) {}
      showToast();
    });
    document.addEventListener('cut', function (e) {
      if (isEdit(e.target)) return;
      e.preventDefault(); showToast();
    });
    document.addEventListener('selectstart', function (e) {
      if (isEdit(e.target)) return;
      e.preventDefault();
    });
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') { e.preventDefault(); showToast(); }
    });

    function keyBlock(e) {
      if (isEdit(e.target)) return;
      var k = (e.key || '').toLowerCase();
      var shot  = (e.key === 'PrintScreen' || e.keyCode === 44);
      var dev   = (e.key === 'F12') ||
                  (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c'));
      var snip  = (e.metaKey && e.shiftKey && k === 's');                 /* Win+Shift+S */
      var noPrt = !!window.__sacNoPrintBlock; /* صفحات وظيفتها الطباعة */
      var ctrl  = (e.ctrlKey && ['u', 's', 'x', 'c'].indexOf(k) > -1) || (e.ctrlKey && k === 'p' && !noPrt);
      if (shot || dev || snip || ctrl) {
        if (!shot) { e.preventDefault(); e.stopPropagation(); }
        shieldON(); showToast();
        return false;
      }
    }
    document.addEventListener('keydown', keyBlock, true);
    document.addEventListener('keyup', function (e) {      /* PrintScreen غالباً keyup */
      if (e.key === 'PrintScreen' || e.keyCode === 44) { shieldON(); showToast(); }
    }, true);

    if (!window.__sacNoPrintBlock) window.addEventListener('beforeprint', function () { shieldON(); });
    window.addEventListener('blur', function () { shieldON(); });          /* Snipping/تبديل النوافذ */
    document.addEventListener('visibilitychange', function () { shieldON(); }); /* تبديل التبويبات */

    /* ---------- الإغلاق: ضغطتان متتاليتان بالفأرة في أي مكان ---------- */
    document.addEventListener('dblclick', function () {
      if (ov.style.display === 'flex') { shieldOFF(); showToast('✅ تمت متابعة التصفح'); }
    });
  });
})();
