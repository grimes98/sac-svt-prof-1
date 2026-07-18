/* =========================================================================
   🔬 أداة «تحليل مذكرتي» بالذكاء الاصطناعي البيداغوجي — SAC Memo Analyzer AI
   نظام فحص مذكرات الـ PDF وإعطاء الإيجابيات، السلبيات، والتقييم البيداغوجي
   (إصدار مُصحَّح: تحليل ديناميكي حقيقي يعتمد على نص كل ملف مرفوع)
   ========================================================================= */

(function(){
  if (document.getElementById('sacMemoAnalyzerModal')) return;

  /* ------------------------- جلسة المستخدم والرصيد ------------------------- */
  function isAnalyzerLogged() {
    try {
      const role = localStorage.getItem('sac_role');
      const sess = localStorage.getItem('sac_session') || localStorage.getItem('sac_user_session');
      return (role === 'admin' || role === 'user' || !!sess);
    } catch (e) { return false; }
  }

  function getGuestMemoCount() {
    return parseInt(localStorage.getItem('sac_guest_memo_count') || '0', 10) || 0;
  }

  function setGuestMemoCount(cnt) {
    try { localStorage.setItem('sac_guest_memo_count', cnt.toString()); } catch (e) {}
  }

  /* ------------------------- أدوات مساعدة عامة ------------------------- */

  // تهريب النص لعرضه داخل HTML بأمان
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // تطبيع النص العربي لتسهيل البحث عن الكلمات المفتاحية (موحَّد الهمزات والتاء المربوطة...)
  function normalizeAr(s) {
    return String(s || '')
      .replace(/[ً-ْٰ]/g, '')   // حذف التشكيل
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  // قص النص الطويل مع إضافة علامة حذف
  function clip(s, max) {
    s = String(s || '').replace(/\s+\n/g, '\n').trim();
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const last = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('.'));
    return (last > 80 ? cut.slice(0, last) : cut).trim() + ' …';
  }

  function hasAny(norm, keywords) {
    return keywords.some(k => norm.indexOf(normalizeAr(k)) !== -1);
  }

  /* ------------------------- بناء نافذة الأداة (Modal) ------------------------- */
  const modal = document.createElement('div');
  modal.id = 'sacMemoAnalyzerModal';
  modal.style.cssText = 'position:fixed; inset:0; z-index:999998; background:rgba(10,35,38,0.85); backdrop-filter:blur(12px); display:none; align-items:center; justify-content:center; padding:16px; font-family:"Tajawal",sans-serif; direction:rtl; opacity:0; transition:0.3s; overflow-y:auto;';

  modal.innerHTML = `
    <div style="background:#fff; width:100%; max-width:740px; border-radius:24px; border:3px solid #00a8a8; box-shadow:0 25px 80px rgba(0,0,0,0.4); display:flex; flex-direction:column; overflow:hidden; max-height:92vh;">

      <!-- الترويسة -->
      <div style="background:linear-gradient(135deg, #0a5860, #00a8a8); color:#fff; padding:16px 22px; display:flex; align-items:center; gap:12px; border-bottom:2px solid #28c8c8;">
        <div style="font-size:2rem; background:rgba(255,255,255,0.18); width:48px; height:48px; border-radius:12px; display:grid; place-items:center;">🔬</div>
        <div style="flex:1;">
          <div style="font-weight:800; font-size:1.2rem; line-height:1.2;">أداة «تحليل مذكرتي» بالذكاء الاصطناعي البيداغوجي</div>
          <div style="font-size:0.85rem; opacity:0.92;">تحليل مذكرات علوم الطبيعة والحياة (PDF) وإعطاء الإيجابيات، السلبيات، واقتراحات التحسين</div>
        </div>
        <button onclick="window.closeSacMemoAnalyzer()" style="background:rgba(255,255,255,0.2); color:#fff; border:none; width:32px; height:32px; border-radius:50%; font-size:1rem; font-weight:800; cursor:pointer; transition:0.2s;">✕</button>
      </div>

      <!-- شريط حالة الرصيد والحجم المسموح -->
      <div id="memoAnalyzerStatusHeader" style="background:#eefaf7; border-bottom:1px solid #daeeee; padding:8px 18px; font-size:0.88rem; font-weight:700; color:#007878; display:flex; align-items:center; justify-content:space-between;">
        <span>💡 جاري فحص الرصيد وحجم الملف المسموح...</span>
      </div>

      <!-- محتوى الأداة الداخلي -->
      <div style="flex:1; padding:20px 24px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;">

        <!-- منطقة الرفع -->
        <div id="memoUploadZoneContainer">
          <label id="memoDropZone" style="border:2.5px dashed #00a8a8; background:#f2fafa; border-radius:18px; padding:32px 20px; text-align:center; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; transition:0.3s; user-select:none;">
            <div style="font-size:3rem; margin-bottom:4px;">📑</div>
            <div style="font-weight:800; font-size:1.1rem; color:#173a3a;">اختر أو اسحب ملف المذكرة بصيغة PDF هنا</div>
            <div id="memoUploadSizeLimitText" style="font-size:0.86rem; color:#5f7d7d;">الصيغة المسموحة: .PDF (الحد الأقصى للحجم: 4 MB للزوار / 15 MB للمشتركين)</div>
            <input type="file" id="memoPdfFileInput" accept=".pdf" style="display:none" onchange="window.handleSacMemoFileSelect(this)">
            <div style="margin-top:8px; background:#00a8a8; color:#fff; padding:8px 22px; border-radius:12px; font-weight:800; font-size:0.92rem; box-shadow:0 4px 12px rgba(0,168,168,0.25);">📂 تصفح ملفات جهازك</div>
          </label>

          <!-- معلومات الملف المختار وزر بدء التحليل -->
          <div id="memoSelectedFileInfo" style="display:none; background:#eef4fb; border:1px solid #cdddf0; border-radius:14px; padding:14px 18px; margin-top:14px; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.8rem;">📑</span>
              <div>
                <div id="memoSelectedFileName" style="font-weight:800; color:#2456a0; font-size:0.98rem; word-break:break-all;">—</div>
                <div id="memoSelectedFileSize" style="font-size:0.82rem; color:#5f7d7d;">—</div>
              </div>
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="window.resetSacMemoFile()" style="background:#fff; color:#e11d48; border:1px solid #fecdd3; padding:8px 14px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer;">✕ تغيير الملف</button>
              <button id="memoStartAnalyzeBtn" onclick="window.startSacMemoAnalysis()" style="background:linear-gradient(135deg, #0d9488, #0f766e); color:#fff; border:none; padding:8px 20px; border-radius:10px; font-weight:800; font-size:0.92rem; cursor:pointer; box-shadow:0 4px 14px rgba(13,148,136,0.35);">🚀 ابدأ التحليل البيداغوجي الذكي</button>
            </div>
          </div>
        </div>

        <!-- شاشة الخطوات والتقدم أثناء التحليل -->
        <div id="memoAnalysisProgress" style="display:none; flex-direction:column; align-items:center; justify-content:center; padding:36px 20px; background:#f8fafc; border:1px solid #daeeee; border-radius:18px; text-align:center;">
          <div class="spinner" style="width:50px; height:50px; border:5px solid #daeeee; border-top-color:#00a8a8; border-radius:50%; animation:sacSpin 0.9s linear infinite; margin-bottom:18px;"></div>
          <div id="memoProgressStepText" style="font-weight:800; font-size:1.08rem; color:#0a5860; margin-bottom:8px;">⏳ جارٍ قراءة ملف الـ PDF...</div>
          <div style="font-size:0.88rem; color:#5f7d7d;">يستخدم الذكاء الاصطناعي معايير الوثيقة المرافقة لمنهاج علوم الطبيعة والحياة (الجيل الثاني)</div>
        </div>

        <!-- تقرير النتيجة: يُملأ ديناميكياً بالكامل حسب محتوى كل ملف -->
        <div id="memoAnalysisReport" style="display:none; flex-direction:column; gap:16px;"></div>

      </div>

      <!-- تذييل سريع -->
      <div style="background:#f8fafc; border-top:1px solid #daeeee; padding:10px 20px; font-size:0.82rem; color:#5f7d7d; text-align:center;">
        منصة SAC · SVT prof — أداة تحليل المذكرات بالذكاء الاصطناعي البيداغوجي (الجيل الثاني)
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // حركة الـ Spinner
  if (!document.getElementById('sacMemoAnalyzerStyle')) {
    const st = document.createElement('style');
    st.id = 'sacMemoAnalyzerStyle';
    st.textContent = '@keyframes sacSpin { to { transform: rotate(360deg); } }';
    document.head.appendChild(st);
  }

  /* ------------------------- شريط الرصيد ------------------------- */
  window.updateSacMemoAnalyzerQuotaUI = function() {
    const statusHeader = document.getElementById('memoAnalyzerStatusHeader');
    const uploadZone = document.getElementById('memoDropZone');
    const sizeLimitText = document.getElementById('memoUploadSizeLimitText');
    const reportFooter = document.getElementById('memoReportActionsFooter');
    if (!statusHeader || !uploadZone) return;

    if (isAnalyzerLogged()) {
      statusHeader.style.background = '#dcfce7';
      statusHeader.style.color = '#15803d';
      statusHeader.innerHTML = `<span>🔓 تحليلات غير محدودة للمذكرات (∞) — الحد الأقصى لحجم الملف: 15 ميغابايت (15 MB)</span><span>✨ مشترك فعّال</span>`;
      uploadZone.style.pointerEvents = 'auto';
      uploadZone.style.opacity = '1';
      if (sizeLimitText) sizeLimitText.textContent = 'الصيغة المسموحة: .PDF (الحد الأقصى للحجم: 15 ميغابايت - حساب مشترك)';
    } else {
      const cnt = getGuestMemoCount();
      const remaining = Math.max(0, 5 - cnt);
      if (remaining > 0) {
        statusHeader.style.background = '#eefaf7';
        statusHeader.style.color = '#007878';
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> تحليل مجاني للمذكرات كزائر — الحد الأقصى للحجم: 4 MB</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
        uploadZone.style.pointerEvents = 'auto';
        uploadZone.style.opacity = '1';
        if (sizeLimitText) sizeLimitText.textContent = 'الصيغة المسموحة: .PDF (الحد الأقصى للحجم: 4 ميغابايت للزوار)';
      } else {
        statusHeader.style.background = '#fef3c7';
        statusHeader.style.color = '#b45309';
        statusHeader.innerHTML = `<span>🔒 استنفدت التحليل المجاني للمذكرات كزائر (5 من 5)</span><a href="login.html" style="color:#92400e; font-weight:800; text-decoration:underline;">دخول للحصول على ∞ ←</a>`;
        uploadZone.style.pointerEvents = 'none';
        uploadZone.style.opacity = '0.55';
      }
    }
  };

  /* ------------------------- فتح وإغلاق النافذة ------------------------- */
  window.openSacMemoAnalyzer = function() {
    window.updateSacMemoAnalyzerQuotaUI();
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
  };

  window.closeSacMemoAnalyzer = function() {
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 280);
  };

  modal.onclick = (e) => {
    if (e.target === modal) window.closeSacMemoAnalyzer();
  };

  /* ------------------------- اختيار الملف وفحص الحجم ------------------------- */
  let selectedPdfFile = null;
  window.handleSacMemoFileSelect = function(input) {
    if (!input || !input.files || !input.files[0]) return;
    const f = input.files[0];

    if (!f.name.toLowerCase().endsWith('.pdf')) {
      alert('⚠️ يرجى اختيار ملف مذكرة بصيغة PDF (.pdf) فقط.');
      input.value = '';
      return;
    }

    const maxBytes = isAnalyzerLogged() ? (15 * 1024 * 1024) : (4 * 1024 * 1024);
    if (f.size > maxBytes) {
      const limitStr = isAnalyzerLogged() ? '15 ميغابايت' : '4 ميغابايت (المسموحة للزوار)';
      alert('⚠️ حجم الملف المختار (' + (f.size / 1048576).toFixed(1) + ' MB) يتجاوز الحد الأقصى المسموح وهو ' + limitStr + '!' +
            (isAnalyzerLogged() ? '' : '\n\nيُرجى تسجيل الدخول بحساب المشترك لرفع مذكرات حتى 15 MB.'));
      input.value = '';
      return;
    }

    selectedPdfFile = f;
    document.getElementById('memoDropZone').style.display = 'none';
    document.getElementById('memoSelectedFileInfo').style.display = 'flex';
    document.getElementById('memoSelectedFileName').textContent = f.name;
    document.getElementById('memoSelectedFileSize').textContent =
      (f.size > 1048576) ? (f.size / 1048576).toFixed(2) + ' MB' : (f.size / 1024).toFixed(1) + ' KB';
  };

  window.resetSacMemoFile = function() {
    selectedPdfFile = null;
    const input = document.getElementById('memoPdfFileInput');
    if (input) input.value = '';
    document.getElementById('memoSelectedFileInfo').style.display = 'none';
    document.getElementById('memoAnalysisProgress').style.display = 'none';
    const rep = document.getElementById('memoAnalysisReport');
    rep.style.display = 'none';
    rep.innerHTML = ''; // مسح التقرير السابق لضمان عدم بقاء نتيجة قديمة
    document.getElementById('memoDropZone').style.display = 'flex';
    window.updateSacMemoAnalyzerQuotaUI();
  };

  /* ------------------------- إطلاق التحليل ------------------------- */
  window.startSacMemoAnalysis = function() {
    if (!selectedPdfFile) {
      alert('⚠️ يرجى اختيار ملف المذكرة أولاً بصيغة PDF.');
      return;
    }

    if (!isAnalyzerLogged() && getGuestMemoCount() >= 5) {
      window.updateSacMemoAnalyzerQuotaUI();
      alert('🔒 لقد استنفدت رصيد التحليل المجاني للمذكرات للزوار (5 من 5). يُرجى تسجيل الدخول للمتابعة!');
      return;
    }

    if (!isAnalyzerLogged()) {
      setGuestMemoCount(getGuestMemoCount() + 1);
    }

    document.getElementById('memoSelectedFileInfo').style.display = 'none';
    const progressDiv = document.getElementById('memoAnalysisProgress');
    const stepText = document.getElementById('memoProgressStepText');
    progressDiv.style.display = 'flex';

    // تشغيل التحليل الحقيقي فوراً بالتوازي مع إظهار خطوات التقدم
    const analysisPromise = generateDynamicSacMemoReport(selectedPdfFile);

    const steps = [
      '⏳ [1/4] جارٍ قراءة صفحات ملف الـ PDF وتحليل الترويسة والمعلومات العامة...',
      '⏳ [2/4] جارٍ فحص تسلسل المسعى العلمي والوضعية الانطلاقية المشكلة...',
      '⏳ [3/4] جارٍ مطابقة معايير ومؤشرات التقويم مع الوثيقة المرافقة (الوجاهة، أدوات المادة، الانسجام)...',
      '⏳ [4/4] جارٍ صياغة تقرير الإيجابيات، السلبيات، وتوصيات المفتش الافتراضي...'
    ];

    let currentStep = 0;
    stepText.textContent = steps[0];

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        stepText.textContent = steps[currentStep];
      } else {
        clearInterval(stepInterval);
        analysisPromise.then(() => {
          progressDiv.style.display = 'none';
          document.getElementById('memoAnalysisReport').style.display = 'flex';
          window.updateSacMemoAnalyzerQuotaUI();
        }).catch(() => {
          progressDiv.style.display = 'none';
          document.getElementById('memoAnalysisReport').style.display = 'flex';
        });
      }
    }, 700);
  };

  /* ------------------------- تحميل مكتبات خارجية عند الحاجة ------------------------- */
  function loadScriptOnce(url, globalFlag) {
    return new Promise((resolve) => {
      if (window[globalFlag]) return resolve(true);
      const s = document.createElement('script');
      s.src = url;
      s.onload = () => resolve(!!window[globalFlag]);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
      setTimeout(() => resolve(!!window[globalFlag]), 15000); // مهلة أمان
    });
  }

  /* ------------------------- استخراج نص الـ PDF ------------------------- */
  /* يعيد { text, ocr } — ويستعمل OCR تلقائياً للمذكرات الممسوحة ضوئياً (صور) */
  async function extractPdfText(file, onProgress) {
    let extractedText = '';
    let usedOcr = false;
    let buffer = null;

    try { buffer = await file.arrayBuffer(); } catch (e) { return { text: '', ocr: false }; }
    if (!buffer) return { text: '', ocr: false };

    let pdfDoc = null;

    // المرحلة 1: استخلاص الطبقة النصية عبر pdf.js (الأدق)
    try {
      const loaded = window.pdfjsLib
        ? true
        : await loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjsLib');

      if (loaded && window.pdfjsLib && window.pdfjsLib.getDocument) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        pdfDoc = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const textArr = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          textArr.push(textContent.items.map(it => it.str).join(' '));
        }
        extractedText = textArr.join('\n');
      }
    } catch (e) { /* نتابع للمراحل الاحتياطية */ }

    // المرحلة 2 (OCR): إذا النص ضعيف/معدوم → المذكرة صور ممسوحة، نتعرف عليها آلياً
    const rawLen = (extractedText || '').replace(/\s/g, '').length;
    if (rawLen < 40 && pdfDoc) {
      try {
        const ocrText = await ocrPdfPages(pdfDoc, onProgress);
        if (ocrText && ocrText.replace(/\s/g, '').length > rawLen) {
          extractedText = ocrText;
          usedOcr = true;
        }
      } catch (e) {}
    }

    // المرحلة 3 (احتياطية أخيرة): فك ترميز UTF-8 خام وانتقاء المقاطع النصية الحقيقية
    if ((!extractedText || extractedText.trim().length < 25) && buffer) {
      try {
        const bytes = new Uint8Array(buffer).subarray(0, 900000);
        const decoded = new TextDecoder('utf-8').decode(bytes);
        // انتقاء أسطر/مقاطع فيها حروف عربية أو نصوص مقروءة، وتجاهل الطوبولوجيا الثنائية للـ PDF
        const runs = decoded.match(/[\u0600-\u06FF][\u0600-\u06FF\p{L}\p{N}\s.,:؛()«»\-–/＋+×%]{4,}|(?:[A-Za-z][\p{L}\p{N}\s.,:;()\-–]{5,})/gu) || [];
        const tempStr = runs.filter(r => r.trim().length >= 5).join('\n');
        if (tempStr.length > extractedText.length) extractedText = tempStr;
      } catch (e) {}
    }

    if (pdfDoc) { try { pdfDoc.destroy(); } catch (e) {} }
    return { text: extractedText || '', ocr: usedOcr };
  }
  window.__sacExtractPdfText = extractPdfText;

  /* ------------------------- OCR بالعربية (Tesseract.js) ------------------------- */
  async function ocrPdfPages(pdfDoc, onProgress) {
    const loaded = window.Tesseract
      ? true
      : await loadScriptOnce('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js', 'Tesseract');
    if (!loaded || !window.Tesseract || !window.Tesseract.createWorker) return '';

    const maxPages = Math.min(pdfDoc.numPages, 8); // حماية من الملفات الكبيرة
    let worker = null;
    const parts = [];
    try {
      if (onProgress) onProgress('🔍 المذكرة عبارة عن صور ممسوحة — جاري تحميل محرك القراءة الضوئية العربي (OCR)...');
      worker = await window.Tesseract.createWorker('ara', 1, {
        logger: (m) => {
          if (onProgress && m.status === 'recognizing text' && typeof m.progress === 'number') {
            onProgress('🔍 OCR — التعرف على النص: ' + Math.round(m.progress * 100) + '%');
          }
        }
      });

      for (let p = 1; p <= maxPages; p++) {
        try {
          const page = await pdfDoc.getPage(p);
          const viewport = page.getViewport({ scale: 2.2 }); // تكبير لتحسين دقة التعرف
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext('2d');
          if (!ctx) break;
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (onProgress) onProgress('🔍 OCR: قراءة نص الصفحة ' + p + ' من ' + maxPages + ' ...');
          const res = await Promise.race([
            worker.recognize(canvas),
            new Promise((_, rej) => setTimeout(() => rej(new Error('ocr-timeout')), 90000))
          ]);
          if (res && res.data && res.data.text) parts.push(res.data.text);
        } catch (e) { /* صفحة واحدة فاشلة لا توقف العملية */ }
      }
    } catch (e) { return ''; }
    finally {
      if (worker) { try { await worker.terminate(); } catch (e) {} }
    }
    return parts.join('\n');
  }
  window.__sacOcrPdfPages = ocrPdfPages;

  /* =========================================================================
     🧠 نواة التحليل البيداغوجي — تعمل على النص المستخرج فعلياً من الملف
     تُرجع: { html, score, meta } — لكل ملف نتيجة مختلفة حسب محتواه
     ========================================================================= */
  window.__sacMemoTextAnalysis = function(cleanText, fileName, fileSize, opts) {
    opts = opts || {};
    cleanText = String(cleanText || '').replace(/\r/g, '');
    const lowerName = String(fileName || '').toLowerCase();
    const norm = normalizeAr(cleanText);
    const normName = normalizeAr(lowerName);

    const isVerySmall = (fileSize || 0) < 1200;
    const hasPedago = hasAny(norm, ['مذكرة', 'الكفاءة', 'مقطع', 'النشاط', 'الوضعية', 'الدرس', 'المستوى', 'الجيل الثاني', 'علوم', 'التقويم', 'تعليمة', 'وثيقة']);
    const isBlankOrEmpty = isVerySmall || (cleanText.trim().length < 35 && !hasPedago);

    /* ---------------- الحالة 1: ملف فارغ أو غير مقروء ---------------- */
    if (isBlankOrEmpty) {
      return {
        score: 12,
        meta: { blank: true },
        html: `
        <div style="background:linear-gradient(135deg, #fef2f2, #fee2e2); border:2px solid #f87171; border-radius:16px; padding:16px 20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <div style="background:#dc2626; color:#fff; font-size:1.4rem; font-weight:800; padding:12px 18px; border-radius:14px; box-shadow:0 4px 14px rgba(220,38,38,0.25);">12%</div>
          <div style="flex:1; min-width:220px;">
            <div style="font-weight:800; font-size:1.1rem; color:#991b1b;">التقييم البيداغوجي العام: مذكرة فارغة أو مسودة غير مكتملة العناصر</div>
            <div style="font-size:0.88rem; color:#b91c1c; margin-top:3px;">الملف المرفوع فارغ أو لا يحتوي على نصوص بيداغوجية مقروءة صالحة لمنهاج الجيل الثاني</div>
          </div>
        </div>

        <div style="background:#fff; border:1px solid #daeeee; border-radius:14px; padding:14px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-weight:800; color:#0a5860; font-size:0.98rem; margin-bottom:6px;">📌 فحص هيكل الترويسة والموارد المستهدفة:</div>
          <p style="font-size:0.92rem; color:#b91c1c; line-height:1.7; margin:0;">
            ❌ <b>لم يتم العثور على ترويسة إدارية أو بيداغوجية مكتملة في هذا الملف</b> (المستوى، الميدان، المقطع، أو الكفاءة الختامية غير موجودة لأن الملف فارغ أو غير محرَّر).
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px;">
          <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:16px; padding:16px 18px;">
            <h4 style="color:#15803d; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
              <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
              <span>الإيجابيات المتاحة:</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.9rem; line-height:1.8;">
              <li><b>صيغة الملف مقبولة:</b> تم رفع الملف بصيغة (.PDF) الرسمية المعتمدة في المنصة.</li>
            </ul>
          </div>

          <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:16px; padding:16px 18px;">
            <h4 style="color:#be123c; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
              <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
              <span>السلبيات والنقاط الحرجة الواجب استدراكها:</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.9rem; line-height:1.8;">
              <li><b>انعدام الترويسة الرسمية للجيل الثاني:</b> الملف لا يتضمن البيانات الأساسية (المستوى، الميدان، المقطع، الكفاءة).</li>
              <li><b>غياب الوضعية المشكل الانطلاقية:</b> المذكرة خالية من سياق يحفز التلميذ ويولد التناقض المعرفي.</li>
              <li><b>انعدام سيرورة التقصي والأنشطة:</b> لا توجد وثائق، سندات، أو تعليمات واضحة لعمل الأفواج.</li>
              <li><b>غياب أدوات ومعايير التقويم:</b> لا يوجد تقويم تكويني أو ختامي ولا شبكة معايير.</li>
            </ul>
          </div>
        </div>

        <div style="background:#fff8e6; border:1.5px solid #f0d590; border-radius:14px; padding:14px 18px; display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:1.5rem;">⚠️</span>
          <div style="font-size:0.92rem; color:#8a6d1f; line-height:1.7;">
            <b>توجيه عاجل من المفتش البيداغوجي (Virtual Inspector):</b><br>
            يبدو أنك قمت برفع ملف فارغ أو قالب مسودة غير محرَّر بعد. يُرجى تحرير نص المذكرة وإدراج الترويسة والوضعيات قبل رفعها، أو تصفح <a href="maktaba.html" style="color:#0d9488;font-weight:800;text-decoration:underline;">المكتبة الرقمية</a> لتحميل مذكرات مكتملة وقياسية للتقيد بها!
          </div>
        </div>

        <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:6px;">
          <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
        </div>`
      };
    }

    /* =========================================================================
       الحالة 2: التفكيك والاستخلاص الحقيقي لعناصر المذكرة المرفوعة
       ========================================================================= */

    /* --- أ) الترويسة والمعلومات العامة --- */
    let extLevel = null;
    let extField = null;
    let extSection = null;
    let extCompGlobal = null;
    let extCompTerm = null;

    const lvlMatch = cleanText.match(/المستوى\s*[:：\-]?\s*([^\n\r]{3,50})/);
    if (lvlMatch && lvlMatch[1].trim().length > 2) extLevel = clip(lvlMatch[1].trim(), 50);
    else if (norm.includes('الرابعه متوسط') || norm.includes('4م') || normName.includes('4m')) extLevel = 'السنة الرابعة متوسط (شهادة BEM)';
    else if (norm.includes('الثالثه متوسط') || norm.includes('3م') || normName.includes('3m')) extLevel = 'السنة الثالثة متوسط';
    else if (norm.includes('الثانيه متوسط') || norm.includes('2م') || normName.includes('2m')) extLevel = 'السنة الثانية متوسط';
    else if (norm.includes('الاولي متوسط') || norm.includes('1م') || normName.includes('1am') || normName.includes('1m')) extLevel = 'السنة الأولى متوسط';

    const fldMatch = cleanText.match(/(?:الميدان|المحور)(?:\s*التعلمي)?\s*[:：\-]?\s*([^\n\r]{4,60})/);
    if (fldMatch && fldMatch[1].trim().length > 3) extField = clip(fldMatch[1].trim(), 60);
    else if (hasAny(norm, ['الانسان والصحه'])) extField = 'الإنسان والصحة';
    else if (hasAny(norm, ['الانسان والمحيط'])) extField = 'الإنسان والمحيط الطبيعي';
    else if (hasAny(norm, ['الكرة الارضيه'])) extField = 'الكرة الأرضية والديناميكية الداخلية';
    else if (hasAny(norm, ['تنظيم العالم الحي'])) extField = 'تنظيم العالم الحي وتنوعه';

    const secMatch = cleanText.match(/(?:المقطع|الوحدة|موضوع الحصة|الدرس)(?:\s*التعلمي)?(?:\s*\d+)?\s*[:：\-]\s*([^\n\r]{4,70})/);
    if (secMatch && secMatch[1].trim().length > 3) extSection = clip(secMatch[1].trim(), 70);
    else if (hasAny(norm, ['مستحاث', 'الاستحاثه', 'استحاثه'])) extSection = 'المستحاثات وشروط الاستحاثة والأوساط القديمة';
    else if (hasAny(norm, ['مناعة', 'المناعة', 'بلعمه', 'اجسام مضاده'])) extSection = 'الاستجابة المناعية والخطوط الدفاعية للعضوية';
    else if (hasAny(norm, ['هضم', 'انزيم'])) extSection = 'التحولات الغذائية والهضم الإنزيمي';
    else if (hasAny(norm, ['زلازل', 'زلزال', 'تكتونيه', 'الصفائح'])) extSection = 'الزلازل وحركية الصفائح التكتونية';
    else if (hasAny(norm, ['تركيب ضوئي', 'تغذيه نباتيه', 'النبات الاخضر'])) extSection = 'التغذية عند النبات الأخضر والتركيب الضوئي';
    else if (hasAny(norm, ['اتصال عصبي', 'انعكاس', 'رساله عصبيه'])) extSection = 'الاتصال العصبي والقوس الانعكاسي';
    else if (hasAny(norm, ['تنفس', 'تنفس خلوي'])) extSection = 'التحولات الطاقوية والتنفس الخلوي';
    else if (hasAny(norm, ['وراث', 'مورث', 'صبغي'])) extSection = 'انتقال الصفات الوراثية';
    else if (hasAny(norm, ['نشاط تكوني', 'تكوين البروتين'])) extSection = 'النشاط التكويني وتكوين البروتين';

    const cGlobMatch = cleanText.match(/(?:الكفاءة\s*الشاملة|الكفاءة\s*القاعدية|الهدف\s*الشامل)\s*[:：\-]?\s*([^\n\r]{8,140})/);
    if (cGlobMatch && cGlobMatch[1].trim().length > 7) extCompGlobal = clip(cGlobMatch[1].trim(), 140);
    else if (extLevel && extLevel.includes('الثانية')) extCompGlobal = 'تنمية تعلمات لدى المتعلم تسمح له بفهم الوسط الطبيعي والمساهمة في المحافظة على التوازنات الطبيعية';
    else if (extLevel && (extLevel.includes('الرابعة') || extLevel.includes('الأولى'))) extCompGlobal = 'تنمية تعلمات تسمح للمتعلم بفهم آليات المحافظة على صحة العضوية وسلامتها الوظيفية';
    else if (extLevel && extLevel.includes('الثالثة')) extCompGlobal = 'تنمية تعلمات تسمح للمتعلم بفهم الظواهر الجيولوجية وحماية البيئة من مخاطرها';

    const cTermMatch = cleanText.match(/(?:الكفاءة\s*الختامية|الكفاءة\s*المستهدفة|الكفاءة\s*المقصودة)\s*[:：\-]?\s*([^\n\r]{8,160})/);
    if (cTermMatch && cTermMatch[1].trim().length > 7) extCompTerm = clip(cTermMatch[1].trim(), 160);
    else if (extSection) extCompTerm = 'يوظف موارده المعرفية والمنهجية المكتسبة' + (extField ? ' في ميدان ' + extField : '') + ' لحل وضعيات مشكلة تتعلق بـ (' + extSection + ')';

    /* --- ب) مركبات الكفاءة --- */
    let subCompListHtml = '';
    const compSectionMatch = cleanText.match(/(?:مركبات?\s*الكفاءة|مركبة\s*الكفاءة|أهداف\s*الحصة|الأهداف\s*التعلمية|الكفاءات\s*الفرعية)\s*[:：\-]?\s*([\s\S]{10,450}?)(?=\n\s*(?:الوضعي|النشاط|الموارد|سير\s|المرحل|التعليم|$))/);
    const compFound = !!(compSectionMatch && compSectionMatch[1].trim().length > 15);
    if (compFound) {
      compSectionMatch[1].split(/\n+/).forEach(l => {
        const t = l.trim().replace(/^[-*•◄►\d).\-]+\s*/, '');
        if (t.length > 6 && t.length < 200) subCompListHtml += '<div>◄ ' + esc(t) + '</div>';
      });
    }
    if (!subCompListHtml) {
      const secTxt = extSection ? ' (' + esc(extSection) + ')' : ' المدروس';
      subCompListHtml =
        '<div>◄ التعرّف على المفاهيم والظواهر العلمية المرتبطة بموضوع' + secTxt + '</div>' +
        '<div>◄ إبراز العلاقة بين البنية والوظيفة عبر المراحل المختلفة</div>' +
        '<div>◄ توظيف الموارد المكتسبة في حل وضعيات مشكلة مماثلة من المحيط</div>';
    }

    /* --- ج) الوضعية الانطلاقية والتعليمات --- */
    const probMatch = cleanText.match(/(?:الوضعية\s*(?:الانطلاقية|المشكلة?|الإشكالية|التعلمية|الاندماجية)?|نص\s*الوضعية|السياق)\s*[:：\-]?\s*([\s\S]{25,750}?)(?=\n\s*(?:التعليم|المطلوب|الأسئلة|النشاط|سير\s|المرحل|الموارد|الاسترجاع|مكتسبات|الفرضيات|$))/);
    const probFound = !!(probMatch && probMatch[1].trim().length > 20);
    const extProblemText = probFound
      ? esc(clip(probMatch[1].trim(), 650)).replace(/\n/g, '<br>')
      : null;

    const instrMatch = cleanText.match(/(?:التعليمات?|التعليمة\s*[:：\-]?|المطلوب)\s*[:：\-]?\s*([\s\S]{15,600}?)(?=\n\s*(?:النشاط|سير\s|المرحل|الحوصلة|الموارد|وضعية|$))/);
    const instrFound = !!(instrMatch && instrMatch[1].trim().length > 10);
    let extInstructionsHtml = '';
    if (instrFound) {
      let num = 0;
      instrMatch[1].split(/\n+/).forEach(il => {
        const t = il.trim().replace(/^[-*•◄►\d).\-]+\s*/, '');
        if (t.length > 5 && t.length < 220 && num < 8) { num++; extInstructionsHtml += '<div>' + num + '. ' + esc(t) + '</div>'; }
      });
    }
    if (!extInstructionsHtml) {
      const secTxt = extSection ? esc(extSection) : 'موضوع الدرس';
      extInstructionsHtml =
        '<div>1. حدّد المفاهيم والبنيات العلمية المرتبطة بـ ' + secTxt + '.</div>' +
        '<div>2. بيّن شروط وآليات حدوث الظاهرة المدروسة.</div>' +
        '<div>3. استنتج أهمية المفهوم في الحفاظ على التوازن الصحي أو البيئي.</div>';
    }

    /* --- د) الموارد والوسائل --- */
    const resourcesFound = hasAny(norm, ['الموارد المعرفية', 'المورد المعرفي', 'المصطلحات']);
    const secTxtR = extSection ? esc(extSection) : 'موضوع الدرس';
    const extResourcesHtml =
      (resourcesFound
        ? '<div>◄ <b>المورد المعرفي:</b> حُددت المعارف المستهدفة في المذكرة بناءً على تحليل السندات المرفقة.</div>'
        : '<div>◄ <b>المورد المعرفي:</b> التعرّف على البنيات والخصائص المتعلقة بـ ' + secTxtR + '، وإبراز العلاقة بين البنية والوظيفة.</div>') +
      '<div>◄ <b>المورد المنهجي:</b> استقصاء المعلومات باستغلال الوثائق، المطبوعات، السندات، والأعمال المخبرية.</div>' +
      '<div>◄ <b>المصطلحات المستهدفة:</b> ضبط المصطلحات العلمية المركزية وكتابتها بوضوح للتلميذ.</div>' +
      '<div>◄ <b>الوسائل الديداكتيكية:</b> جهاز العرض، مطبوعات الأفواج، الكتاب المدرسي، وسائل الإيضاح.</div>';

    /* --- هـ) الأنشطة --- */
    let extActivitiesHtml = '';
    let actCount = 0;
    const actRegex = /النشاط\s*(?:الأول|الثاني|الثالث|الرابع|[0-9]+)[^\n:：]{0,40}[:：\-]?\s*([\s\S]{25,600}?)(?=\n\s*(?:النشاط|الحوصلة|الخلاصة|التقويم|الشبكة|وضعية|سير\s|$))/gi;
    let actMatch;
    while ((actMatch = actRegex.exec(cleanText)) !== null && actCount < 3) {
      const body = clip(actMatch[1].trim(), 480);
      if (body.length < 20) continue;
      actCount++;
      extActivitiesHtml +=
        '<div style="margin-bottom:14px; padding:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px;">' +
        '<b style="color:#0a5860;">النشاط المرصود رقم ' + actCount + ':</b><br>' +
        '<div style="font-size:0.92rem; margin-top:4px; line-height:1.7;">' + esc(body).replace(/\n/g, '<br>') + '</div></div>';
    }
    if (!extActivitiesHtml) {
      const secTxtA = extSection ? esc(extSection) : 'موضوع الدرس';
      extActivitiesHtml =
        '<b>النشاط 1: مفهوم واستكشاف الظاهرة (' + secTxtA + ')</b><br>' +
        '• <i>التعليمة:</i> بالاعتماد على الوثائق والملاحظة: ① حدّد مختلف الأشكال والبنيات الملاحظة. ② استنتج تعريفاً علمياً دقيقاً للمفهوم.<br>' +
        '• <i>تقويم تكويني:</i> صنّف العناصر والظواهر المستهدفة في جدول.<br><br>' +
        '<b>النشاط 2: شروط وآليات الحدوث</b><br>' +
        '• <i>التعليمة:</i> ① عبّر عن مراحل سير الظاهرة وتحولاتها. ② استنتج شروط الحدوث والعوامل المؤثرة.<br>' +
        '• <i>تقويم تكويني:</i> رتّب المراحل واشرح العلاقة السببية.<br><br>' +
        '<b>النشاط 3: مكانة المفهوم وتطبيقاته</b><br>' +
        '• <i>التعليمة:</i> ① قارن بين الحالات المدروسة. ② اقترح فرضية تفسيرية. ③ استنتج الأهمية العلمية والتطبيقية.';
    }

    /* --- و) رصد عناصر الديداكتيك (تعتمد على النص الفعلي للملف) --- */
    const hasRecall      = hasAny(norm, ['استرجاع', 'مكتسبات', 'المعرفات السابقه']);
    const hasProblem     = probFound || hasAny(norm, ['اشكاليه', 'الإشكالية', 'المشكل العلمي', 'تساؤلات', 'التساؤل']);
    const hasHypo        = hasAny(norm, ['فرضية', 'فرضيات', 'تصورات', 'تخمين']);
    const hasSynthesis   = hasAny(norm, ['حوصلة', 'خلاصة', 'تلخيص', 'تدوين']);
    const foundOHERIC    = hasAny(norm, ['ملاحظة', 'فرضية', 'تجريب', 'تجربة', 'نتيجة', 'تفسير', 'استنتاج']);
    const foundTP        = hasAny(norm, ['مخبر', 'تجربة', 'tp', 'exao', 'مجهر', 'عينة', 'مجاهر', 'توضيب', 'تحضير عينة']);
    const foundGroups    = hasAny(norm, ['فوج', 'أفواج', 'تعاون', 'عصف ذهني', 'جيكسو', 'مجموعات', 'تعلم تعاوني']);
    const foundCriteria  = hasAny(norm, ['معايير', 'وجاهة', 'أدوات المادة', 'انسجام', 'شبكة التصحيح', 'شبكة التقويم', 'معيار']);
    const foundIntegr    = hasAny(norm, ['إدماج', 'ادماج', 'وضعية إدماجية', 'تقويم ختامي', 'اختبار نهائي', 'وضعية التقويم']);
    const hasTimeShares  = /\b\d{1,2}\s*(?:د|دقيقة|دقائق|min)\b/.test(cleanText) || hasAny(norm, ['المدة', 'الزمن المخصص']);
    const extSubject     = hasAny(norm, ['علوم الطبيعة والحياة', 'علوم طبيعية', 'svt']) ? 'علوم الطبيعة والحياة' : 'علوم الطبيعة والحياة (مفترضة)';

    /* --- ز) حساب التقييم بناءً على الحضور الحقيقي لعناصر المنهاج --- */
    let score = 46;
    if (extLevel) score += 6;
    if (extField) score += 5;
    if (extSection) score += 7;
    if (extCompTerm) score += 4;
    if (compFound) score += 4;
    if (probFound) score += 7;
    if (instrFound) score += 3;
    if (actCount > 0) score += 6;
    if (actCount > 1) score += 2;
    if (foundOHERIC) score += 6;
    if (foundTP) score += 5;
    if (foundGroups) score += 3;
    if (foundCriteria) score += 5;
    if (foundIntegr) score += 4;
    if (hasRecall) score += 3;
    if (hasSynthesis) score += 3;
    if (hasTimeShares) score += 2;
    if (cleanText.length > 2500) score += 2;
    if (score > 96) score = 96;
    if (score < 20) score = 20;

    /* --- ح) الإيجابيات والسلبيات الفعلية حسب محتوى الملـــف --- */
    let posListHtml = '';
    if (extLevel)      posListHtml += '<li><b>تحديد واضح لمستوى ومرجعية المذكرة:</b> ورد في الترويسة (' + esc(extLevel) + (extField ? ' - ' + esc(extField) : '') + ').</li>';
    if (extSection)    posListHtml += '<li><b>تحديد المقطع التعلمي بدقة:</b> موضوع الحصة المرصود هو «' + esc(extSection) + '».</li>';
    if (compFound)     posListHtml += '<li><b>تفكيك الكفاءة إلى مركبات:</b> الأستاذ(ة) جزّأ الهدف الكبير إلى مركبات قابلة للتدريس والتقويم.</li>';
    if (probFound)     posListHtml += '<li><b>حضور نص وضعية انطلاقية مشكلة:</b> تم رصد سياق انطلاقي مكتوب في المذكرة يولد التناقض المعرفي لبناء الإشكالية.</li>';
    if (instrFound)    posListHtml += '<li><b>صياغة تعليمات واضحة مرفقة بالوضعية:</b> التعليمات المرصودة توجه التلميذ نحو بناء المفهوم خطوة بخطوة.</li>';
    if (actCount > 0)  posListHtml += '<li><b>تفكيك الحصة إلى أنشطة ميدانية (' + actCount + ' أنشطة مرصودة):</b> تقسيم المحتوى العلمي إلى خطوات عمل تعتمد على استغلال الوثائق.</li>';
    if (foundOHERIC)   posListHtml += '<li><b>احترام مسار المسعى التجريبي (OHERIC):</b> رصد مصطلحات الملاحظة، الفرضيات، التجريب والاستنتاج في ثنايا المذكرة.</li>';
    if (foundTP)       posListHtml += '<li><b>إرفاق أنشطة مخبرية وتطبيقية (TP):</b> تمكين التلميذ من التعامل مع الوسائل والعينات بشكل ملموس.</li>';
    if (foundGroups)   posListHtml += '<li><b>تنظيم العمل البيداغوجي في أفواج:</b> الإشارة إلى التعلم التعاوني وتقسيم التلاميذ في مجموعات للبحث والمناقشة.</li>';
    if (foundCriteria) posListHtml += '<li><b>توظيف معايير تقويم الجيل الثاني:</b> إدراج شبكة تصحيح تعتمد على الوجاهة، الانسجام، واستعمال أدوات المادة.</li>';
    if (foundIntegr)   posListHtml += '<li><b>وجود وضعية إدماج ختامية:</b> المذكرة تختم بموقف يقيس قدرة التلميذ على توظيف موارده في سياق جديد.</li>';
    if (hasRecall)     posListHtml += '<li><b>الانطلاق من المكتسبات القبلية:</b> تخصيص مرحلة لتنشيط المعارف السابقة للتلاميذ قبل الدرس الجديد.</li>';
    if (hasSynthesis)  posListHtml += '<li><b>تدوين حوصلة وخلاصة للدرس:</b> المذكرة تتضمن مرحلة لتثبيت المفهوم المكتسب وكتابته على الكراس.</li>';
    if (hasTimeShares) posListHtml += '<li><b>إدارة الزمن داخل الحصة:</b> تقدير المدة الزمنية لمراحل الحصة بالدقائق.</li>';
    if (!posListHtml)  posListHtml = '<li><b>تنظيم عام مقبول للمذكرة:</b> وضوح العناوين والفقرات المستخرجة من ملف الـ PDF.</li>';

    let negListHtml = '';
    if (!probFound)      negListHtml += '<li><b>غياب أو ضعف نص الوضعية المشكل الانطلاقية:</b> لم يُرصد سياق انطلاقي مكتوب؛ يُنصح بكتابة سياق محفز مستمد من واقع التلميذ في بداية المذكرة.</li>';
    if (!instrFound)     negListHtml += '<li><b>الوضعية بدون تعليمات مصاغة بوضوح:</b> يُفضل صياغة التعليمات بأفعال إنجاز متدرجة (حدّد ← استنتج ← اقترح).</li>';
    if (!foundOHERIC)    negListHtml += '<li><b>نقص في إبراز مراحل المسعى العلمي (OHERIC):</b> يجب تجنب الإلقاء المباشر وترك التلميذ يقترح الفرضيات ويختبرها.</li>';
    if (!foundTP)        negListHtml += '<li><b>قلّة الأنشطة اليدوية والمخبرية (TP/ExAO):</b> مادة ع.ط.ح تتطلب الملاحظة المجهرية أو التجريب بدلاً من الاكتفاء بالنصوص.</li>';
    if (!foundGroups)    negListHtml += '<li><b>غياب الإشارة لتنظيم الأفواج وتوزيع الأدوار:</b> يُفضل تحديد أدوار (المنسق، المنفذ، المقرر، الميقاتي) داخل الفوج.</li>';
    if (!foundCriteria)  negListHtml += '<li><b>عدم صياغة شبكة تصحيح بالمعايير:</b> يُستحسن ربط كل تعليمة بمعايير (الوجاهة، أدوات المادة، الانسجام) لتجنب التصحيح الانطباعي.</li>';
    if (!foundIntegr)    negListHtml += '<li><b>غياب وضعية إدماج الموارد الختامية:</b> يُفضل ختم الدرس بوضعية إدماجية تقيس قدرة التلميذ على توظيف موارده في موقف جديد.</li>';
    if (!hasRecall)      negListHtml += '<li><b>الانطلاق مباشرة دون تنشيط المكتسبات:</b> يُنصح بتخصيص دقائق لاسترجاع المكتسبات القبلية لربط الدرس بسابقه.</li>';
    if (!hasSynthesis)   negListHtml += '<li><b>غياب مرحلة الحوصلة المكتوبة:</b> يجب تدوين خلاصة علمية دقيقة يكتبها التلاميذ في نهاية الحصة.</li>';
    if (!hasTimeShares)  negListHtml += '<li><b>غياب التقدير الزمني للمراحل:</b> يستحسن تحديد المدة بالدقائق لكل مرحلة (الوضعية، الأنشطة، الحوصلة).</li>';
    if (actCount === 0)  negListHtml += '<li><b>عدم تفكيك الأنشطة داخل نص المذكرة:</b> لم يُرصد تقسيم صريح للأنشطة؛ يُنصح بعنونة كل نشاط (النشاط الأول، الثاني...) لتسهيل التنفيذ والمتابعة.</li>';
    if (!negListHtml)    negListHtml = '<li><b>لم تُرصد سلبيات جوهرية:</b> المذكرة متكاملة العناصر؛ فقط راجع(ي) تدرج التعليمات وتوزيع الزمن بدقة على المحتوى المخطط.</li>';

    /* --- ط) توصية المفتش الافتراضي (مخصصة حسب الملف) --- */
    const advice = [];
    if (!probFound) advice.push('صياغة وضعية انطلاقية مشكلة من واقع التلميذ');
    if (!foundCriteria) advice.push('إدراج شبكة تصحيح بالمعايير الثلاثة');
    if (!foundIntegr) advice.push('إضافة وضعية إدماج ختامية');
    if (!foundGroups) advice.push('توزيع الأدوار داخل الأفواج');
    if (!hasTimeShares) advice.push('ضبط المدة الزمنية لكل مرحلة');
    let customAdvice;
    if (advice.length === 0) {
      customAdvice = 'المذكرة ممتازة في بنيتها وتصلح للتطبيق الميداني الفوري داخل القسم. فقط احرص(ي) على عدم إملاء الحوصلة جاهزة، بل ترك التلميذ يبنيها ويدوّنها بنفسه انطلاقاً من مناقشة السندات.';
    } else {
      customAdvice = 'المذكرة تحمل أساساً جيداً، ولتحويلها إلى مذكرة قياسية ينصح المفتش بـ: ' + advice.slice(0, 3).join('، ') + '. ثم راجع(ي) تدرج التعليمات من الفهم إلى الإبداع قبل الطباعة النهائية.';
    }

    /* --- ي) بناء التقرير الديناميكي الكامل (10 أقسام) --- */
    const good = score >= 80;
    const scoreColor = good ? '#15803d' : (score >= 60 ? '#d97706' : '#dc2626');
    const verdictTxt = good
      ? 'التقييم البيداغوجي العام: مذكرة قياسية قريبة من معايير الجيل الثاني — مع لمسات تحسين طفيفة'
      : (score >= 60
        ? 'التقييم البيداغوجي العام: مذكرة متوسطة تحتاج إثراء ديداكتيكي واستكمال بعض عناصر المنهاج'
        : 'التقييم البيداغوجي العام: مذكرة ناقصة العناصر البيداغوجية الأساسية — تحتاج إعادة إعداد جدية');
    const secNameTxt = extSection ? esc(extSection) : 'غير محدد بوضوح في النص المرفوع';

    const html = `
      <!-- شريط التقييم الكلي -->
      <div style="background:linear-gradient(135deg, #eefaf7, ${good ? '#dcfce7' : (score >= 60 ? '#fef9e7' : '#fdecec')}); border:2px solid ${good ? '#86efac' : (score >= 60 ? '#f0d590' : '#f87171')}; border-radius:18px; padding:18px 22px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="background:${scoreColor}; color:#fff; font-size:1.6rem; font-weight:900; padding:14px 20px; border-radius:16px; box-shadow:0 4px 16px rgba(0,0,0,0.15); white-space:nowrap;">${score}%</div>
        <div style="flex:1; min-width:240px;">
          <div style="font-weight:900; font-size:1.12rem; color:#14532d;">${verdictTxt}</div>
          <div style="font-size:0.9rem; color:#166534; margin-top:4px;">تقرير مولَّد خصيصاً من القراءة الفعلية لنصوص ملف «${esc(fileName)}» — ${actCount > 0 ? actCount + ' أنشطة مرصودة' : 'لم تُرصد أنشطة معنونة'}${probFound ? ' + وضعية انطلاقية مستخرجة' : ''}.</div>
        </div>
      </div>

      <!-- مقدمة التقرير -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:14px 18px; font-size:0.94rem; color:#1e293b; line-height:1.75;">
        📎 <b>تفكيك المذكرة المرفوعة عنصراً عنصراً (بناءً على القراءة الفعلية لنصوص ملفك):</b><br>
        تم فحص الترويسة، تفكيك الكفاءة، رصد الوضعية الانطلاقية وتعليماتها، سير التعلمات، الأنشطة، وشبكة التقويم وفق الوثيقة المرافقة لمنهاج الجيل الثاني.
        ${opts.ocr ? '<br>🔍 <b style="color:#b45309;">ملاحظة:</b> <span style="background:#fef3c7; padding:2px 8px; border-radius:8px; font-size:0.88rem;">مذكرتك عبارة عن صور ممسوحة ضوئياً — تمّ التعرف على نصوصها تلقائياً بتقنية OCR، لذا قد توجد اختلافات إملائية بسيطة في المقتطفات المقتبسة.</span>' : ''}
      </div>

      <!-- 1 الترويسة -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">1</span>
          <span>الترويسة – المعلومات العامة (المستخرجة من مذكرتك)</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:2.0; font-size:0.96rem; color:#0f172a; box-shadow:0 4px 15px rgba(13,148,136,0.06);">
          <b>المستوى المرصود:</b> ${extLevel ? esc(extLevel) : '⚠️ غير محدد بوضوح في الترويسة'}<br>
          <b>المادة:</b> ${esc(extSubject)}<br>
          <b>الميدان التعلمي:</b> ${extField ? esc(extField) : '⚠️ غير محدد في الترويسة'}<br>
          <b>المقطع / موضوع الحصة:</b> ${secNameTxt}<br>
          <b>الكفاءة الشاملة:</b> ${extCompGlobal ? esc(extCompGlobal) : '⚠️ لم تُكتب صراحةً في ترويسة المذكرة'}<br>
          <b>الكفاءة الختامية:</b> ${extCompTerm ? esc(extCompTerm) : '⚠️ لم تُكتب صراحةً في ترويسة المذكرة'}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>من أين جاءت؟</b> هذه العناصر تؤطر عمل الأستاذ الميداني وتنطلق من المنهاج الرسمي ووثيقة دروس الميدان.</div>
        </div>
      </div>

      <!-- 2 مركبات الكفاءة -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">2</span>
          <span>مركّبات الكفاءة – تفكيك الهدف الكبير</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${compFound ? 'المركبات المرصودة حرفياً في نص المذكرة:' : 'لم تُصرَّح مركبات الكفاءة في النص؛ هذا هو التفكيك المقترح بيداغوجياً:'}<br>
          ${subCompListHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ:</b> كل مركّبة تتحوّل لاحقاً إلى نشاط في المذكّرة وتعليمة في التقويم — هكذا يبقى العمل مترابطاً ومنطقياً.</div>
        </div>
      </div>

      <!-- 3 الوضعية الانطلاقية -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">3</span>
          <span>الوضعية الانطلاقية المشكلة – نقطة البداية</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${probFound ? 'نص الوضعية الانطلاقية المرصود حرفياً في ملفك:' : '⚠️ لم يُعثر على نص وضعية انطلاقية مكتوب بوضوح في الملف. قالب مقترح يجب كتابته:'}
          <div style="background:#f1f8f6; padding:14px; border-radius:12px; border-inline-start:4px solid #0d9488; margin:10px 0; font-style:italic;">
            ${probFound ? extProblemText : '«سياق انطلاقي ملموس مستوحى من حياة التلميذ يطرح تناقضاً معرفياً يثير التساؤل حول ' + secNameTxt + '... عزمت على دراسة واستقصاء هذه الظاهرة لفهم سيرورتها وشروطها...»'}
          </div>
          <b>التعليمات / الأسئلة ${instrFound ? 'المرصودة فعلياً مع الوضعية' : 'المقترح صياغتها مع الوضعية'}:</b><br>
          ${extInstructionsHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ ترابط السند مع التعليمات</b> — كلها تمهد وتوجه التلاميذ لصياغة المشكل العلمي بوضوح.</div>
        </div>
      </div>

      <!-- 4 الموارد -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">4</span>
          <span>الموارد والمصطلحات والوسائل – ما سيتعلّمه التلميذ</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${extResourcesHtml}
        </div>
      </div>

      <!-- 5 سير التعلمات -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">5</span>
          <span>سير التعلّمات – قلب المذكّرة (OHERIC)</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:2.0; font-size:0.96rem; color:#0f172a;">
          تنظيم مراحل الحصة ومطابقتها لخطوات المسعى العلمي كما رُصدت فعلياً في ملفك:<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">1. استرجاع المعارف:</span> ${hasRecall ? '✅ تم رصد مرحلة لتنشيط المكتسبات القبلية في بداية الحصة.' : '⚠️ لم تُرصد؛ يُنصح بإضافة محطة قصيرة لاسترجاع المكتسبات القبلية.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">2. وضعية تعلم المورد:</span> ${probFound ? '✅ تقديم وضعية وسند يثيران التساؤل المعرفي حول موضوع الدرس.' : '⚠️ قدّم(ي) وثيقة أو مقالاً قصيراً يثير التساؤل حول الموضوع.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">3. التساؤل (الإشكالية):</span> ${hasProblem ? '✅ تم طرح مشكل علمي محفز وواضح.' : '⚠️ يجب تأكيد كتابة الإشكالية العلمية بوضوح أمام التلاميذ.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">4. التصوّرات والفرضيات:</span> ${hasHypo ? '✅ تم فتح المجال لتخمينات التلاميذ واقتراح الفرضيات قبل البحث.' : '⚠️ يجب إعطاء وقت لتسجيل فرضيات التلاميذ على السبورة قبل الأنشطة.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">5. البحث والتقصّي:</span> ${actCount > 0 ? '✅ أنشطة ميدانية مرصودة (' + actCount + ') لتمكين الأفواج من بناء المفهوم.' : '⚠️ لم تُرصد أنشطة معنونة؛ جزّئي العمل إلى أنشطة على الوثائق والسندات.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">6. الحوصلة (المورد):</span> ${hasSynthesis ? '✅ تم تخصيص مرحلة لتدوين خلاصة علمية للمفهوم المكتسب.' : '⚠️ يجب الحرص على صياغة حوصلة شاملة يدوّنها التلاميذ في نهاية الحصة.'}
        </div>
      </div>

      <!-- 6 الأنشطة -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">6</span>
          <span>النشاطات وتعليماتها – تطبيق مباشر ${actCount > 0 ? '(مستخرجة من ملفك)' : '(نموذج مقترح)'}</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:1.95; font-size:0.96rem; color:#0f172a;">
          ${extActivitiesHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ تدرّج التعليمات في الصعوبة:</b> من «حدّد» (فهم) ⟵ «استنتج» (تحليل) ⟵ «اقترح فرضية» (إبداع).</div>
        </div>
      </div>

      <!-- 7 شبكة التصحيح -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">7</span>
          <span>شبكة التصحيح بالمعايير – التقويم العادل</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; overflow-x:auto;">
          <div style="font-weight:800; margin-bottom:12px; color:#173a3a;">${foundCriteria ? '✅ تم رصد اهتمام بمعايير التقويم في المذكرة. الشبكة المرجعية لضمان تطبيقها:' : '⚠️ لم يُلحظ ذكر شبكة تصحيح بالمعايير في الملف؛ يُنصح بإدراج الشبكة الآتية:'}</div>
          <table style="width:100%; border-collapse:collapse; text-align:right; font-size:0.92rem;">
            <thead>
              <tr style="background:#042f2e; color:#fff;">
                <th style="padding:10px; border:1px solid #14b8a6;">التعليمة</th>
                <th style="padding:10px; border:1px solid #14b8a6;">المعيار الموجه</th>
                <th style="padding:10px; border:1px solid #14b8a6;">سير الإجابة (النموذج الميداني)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">1</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + استعمال أدوات المادة</td>
                <td style="padding:10px;">تحديد المفاهيم والبنيات الخاصة بـ (${secNameTxt}) اعتماداً على السند بدقة</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0; background:#fff; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">2</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + الانسجام</td>
                <td style="padding:10px;">تسلسل المراحل المنطقي وتوضيح الشروط والآليات دون تناقض</td>
              </tr>
              <tr style="background:#f8fafc; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">3</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + الانسجام</td>
                <td style="padding:10px;">المقارنة العلمية، اقتراح الفرضية، واستنتاج الأهمية والتطبيقات</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>هكذا يصبح التصحيح موضوعياً وعادلاً:</b> كل نقطة مرتبطة بمعيار واضح وليس بانطباع الأستاذ.</div>
        </div>
      </div>

      <!-- 8 وضعية الإدماج -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">8</span>
          <span>وضعية إدماج الموارد – الاختبار النهائي</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${foundIntegr
            ? '<b>✅ تم رصد اهتمام بالإدماج في مذكرتك:</b> وُجدت إشارة لوضعية إدماجية تقيس مدى قدرة التلاميذ على توظيف الموارد المكتسبة في موقف جديد مستقل.'
            : '<b>⚠️ توجيه لإدماج الموارد:</b> في نهاية المقطع، ضع(ي) وضعية إدماجية جديدة تدمج كل ما تعلّمه التلميذ حول «' + secNameTxt + '» في سياق من الحياة اليومية، مع تعليمات تجمع الموارد وشبكة تصحيح خاصة.<br><b>الهدف الديداكتيكي:</b> قياس الكفاءة الحقيقية: هل يستطيع التلميذ توظيف معارفه في موقف جديد؟'}
        </div>
      </div>

      <!-- 9 الإيجابيات والسلبيات -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">9</span>
          <span>تقييم المذكّرة: إيجابياتها وسلبياتها (حسب فحص نص ملفك)</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:16px;">
          <div style="background:#f0fdf4; border:2px solid #22c55e; border-radius:18px; padding:18px;">
            <h4 style="color:#15803d; font-size:1.05rem; font-weight:900; margin:0 0 12px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #bbf7d0; padding-bottom:8px;">
              <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
              <span>نقاط القوّة المرصودة في مذكرتك:</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.92rem; line-height:1.85;">
              ${posListHtml}
            </ul>
          </div>
          <div style="background:#fff1f2; border:2px solid #f43f5e; border-radius:18px; padding:18px;">
            <h4 style="color:#be123c; font-size:1.05rem; font-weight:900; margin:0 0 12px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #fecdd3; padding-bottom:8px;">
              <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
              <span>نقاط تحتاج تحسيناً (مرصودة من الملف):</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.92rem; line-height:1.85;">
              ${negListHtml}
            </ul>
          </div>
        </div>
      </div>

      <!-- 10 التوصية والخلاصة -->
      <div style="display:flex; flex-direction:column; gap:14px; margin-top:6px;">
        <div style="background:#fff8e6; border:2px solid #f59e0b; border-radius:18px; padding:18px; display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:1.8rem;">💡</span>
          <div style="font-size:0.96rem; color:#8a6d1f; line-height:1.85;">
            <b style="color:#b45309; font-size:1.08rem;">توصية المفتش البيداغوجي الافتراضي:</b><br>
            ${esc(customAdvice)}
          </div>
        </div>

        <div style="background:#ecfeff; border:2px solid #06b6d4; border-radius:18px; padding:18px; display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:1.8rem;">🎓</span>
          <div style="font-size:0.96rem; color:#0369a1; line-height:1.85;">
            <b style="color:#0284c7; font-size:1.08rem;">الخلاصة المنهجية:</b><br>
            المذكّرة القياسية سلسلة مترابطة: <b>منهاج ⟵ كفاءة ⟵ مركّبات ⟵ وضعية ⟵ موارد ⟵ أنشطة (بتعليمات متدرجة) ⟵ حوصلة ⟵ تقويم بمعايير ⟵ إدماج</b>. قارن(ي) تقريرك بهذا التسلسل لإعداد أي مذكرة باحترافية.
          </div>
        </div>

        <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:10px;">
          <button onclick="window.resetSacMemoFile()" style="background:linear-gradient(135deg, #0d9488, #14b8a6); color:#fff; border:none; padding:12px 28px; border-radius:14px; font-weight:900; font-size:1rem; cursor:pointer; transition:0.25s; box-shadow:0 6px 18px rgba(13,148,136,0.35);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
        </div>
      </div>
    `;

    return {
      html: html,
      score: score,
      meta: {
        level: extLevel, field: extField, section: extSection,
        activities: actCount, problem: probFound, instructions: instrFound,
        oheric: foundOHERIC, tp: foundTP, groups: foundGroups,
        criteria: foundCriteria, integration: foundIntegr,
        recall: hasRecall, synthesis: hasSynthesis, hypothesis: hasHypo,
        compGlobal: extCompGlobal, compTerm: extCompTerm
      }
    };
  };

  /* ------------------------- توليد التقرير وعرضه ------------------------- */
  async function generateDynamicSacMemoReport(file) {
    const reportContainer = document.getElementById('memoAnalysisReport');
    if (!reportContainer || !file) return;

    try {
      const onProgress = (msg) => {
        const el = document.getElementById('memoProgressStepText');
        if (el) el.textContent = msg;
      };
      const { text, ocr } = await extractPdfText(file, onProgress);
      const result = window.__sacMemoTextAnalysis(text, file.name, file.size, { ocr: ocr });
      reportContainer.innerHTML = result.html;
    } catch (err) {
      reportContainer.innerHTML = `
        <div style="background:#fef2f2; border:2px solid #f87171; border-radius:16px; padding:18px 20px; text-align:center;">
          <div style="font-size:1.8rem;">⚠️</div>
          <div style="font-weight:800; color:#991b1b; font-size:1.05rem; margin:8px 0;">تعذّر تحليل هذا الملف</div>
          <p style="font-size:0.9rem; color:#7f1d1d; line-height:1.7; margin:0 0 12px;">
            جرّبنا استخراج النص والقراءة الضوئية OCR دون جدوى. الملف قد يكون محمياً بكلمة سر، أو تالفاً، أو صورته غير واضحة إطلاقاً.<br>
            تأكد من توفر إنترنت (لتحميل مكتبات القراءة) ثم أعد المحاولة بملف آخر.
          </p>
          <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer;">🔄 تجربة ملف آخر</button>
        </div>`;
    }
  }

})();
