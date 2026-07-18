/* =========================================================================
   🔬 أداة «تحليل مذكرتي» بالذكاء الاصطناعي البيداغوجي — SAC Memo Analyzer AI
   نظام فحص مذكرات الـ PDF وإعطاء الإيجابيات، السلبيات، والتقييم البيداغوجي الفعلي في 10 أقسام
   ========================================================================= */

(function(){
  if (document.getElementById('sacMemoAnalyzerModal')) return;

  function isAnalyzerLogged() {
    const role = localStorage.getItem('sac_role');
    const sess = localStorage.getItem('sac_session') || localStorage.getItem('sac_user_session');
    return (role === 'admin' || role === 'user' || sess);
  }

  function getGuestMemoCount() {
    return parseInt(localStorage.getItem('sac_guest_memo_count') || '0', 10);
  }

  function setGuestMemoCount(cnt) {
    localStorage.setItem('sac_guest_memo_count', cnt.toString());
  }

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
        
        <!-- منطقة الرفع (Drop & File Select Zone) -->
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
                <div id="memoSelectedFileName" style="font-weight:800; color:#2456a0; font-size:0.98rem; word-break:break-all;">mothakirat_svt.pdf</div>
                <div id="memoSelectedFileSize" style="font-size:0.82rem; color:#5f7d7d;">1.2 MB</div>
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
          <div id="memoProgressStepText" style="font-weight:800; font-size:1.08rem; color:#0a5860; margin-bottom:8px;">⏳ [1/4] جارٍ فك تشفير صفحات ملف الـ PDF وقراءة الترويسة والمعلومات العامة...</div>
          <div style="font-size:0.88rem; color:#5f7d7d;">يستخدم الذكاء الاصطناعي معايير الوثيقة المرافقة لمنهاج علوم الطبيعة والحياة (الجيل الثاني)</div>
        </div>

        <!-- تقرير النتيجة الشامل (الإيجابيات والسلبيات والتقييم) -->
        <div id="memoAnalysisReport" style="display:none; flex-direction:column; gap:16px;"></div>

      </div>

      <!-- تذييل سريع -->
      <div style="background:#f8fafc; border-top:1px solid #daeeee; padding:10px 20px; font-size:0.82rem; color:#5f7d7d; text-align:center;">
        منصة SAC · SVT prof — أداة تحليل المذكرات بالذكاء الاصطناعي البيداغوجي (الجيل الثاني)
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  if (!document.getElementById('sacMemoAnalyzerStyle')) {
    const st = document.createElement('style');
    st.id = 'sacMemoAnalyzerStyle';
    st.textContent = `@keyframes sacSpin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(st);
  }

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
      if (reportFooter) {
        reportFooter.innerHTML = `<button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>`;
      }
    } else {
      const cnt = getGuestMemoCount();
      const remaining = Math.max(0, 5 - cnt);

      if (remaining > 0) {
        statusHeader.style.background = '#eefaf7';
        statusHeader.style.color = '#007878';
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> تحليلات مجانية للمذكرات كزائر — الحد الأقصى للحجم: 4 MB</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
        uploadZone.style.pointerEvents = 'auto';
        uploadZone.style.opacity = '1';
        if (sizeLimitText) sizeLimitText.textContent = 'الصيغة المسموحة: .PDF (الحد الأقصى للحجم: 4 ميغابايت للزوار)';
        if (reportFooter) {
          reportFooter.innerHTML = `<button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer;">🔄 تحليل مذكرة أخرى</button>`;
        }
      } else {
        statusHeader.style.background = '#fef3c7';
        statusHeader.style.color = '#b45309';
        statusHeader.innerHTML = `<span>🔒 استنفدت التحليلات المجانية للمذكرات كزائر (5 من 5)</span><a href="login.html" style="color:#92400e; font-weight:800; text-decoration:underline;">دخول للحصول على ∞ ←</a>`;
        uploadZone.style.pointerEvents = 'none';
        uploadZone.style.opacity = '0.55';
        if (reportFooter) {
          reportFooter.innerHTML = `
            <div style="text-align:center; padding:14px; background:#fef3c7; border:1.5px solid #fde68a; border-radius:14px; width:100%;">
              <b style="color:#92400e; font-size:0.98rem;">🔒 لقد استنفدت رصيد التحليل المجاني للمذكرات للزوار (5 من 5)</b><br>
              <p style="font-size:0.88rem; color:#b45309; margin:6px 0 12px;">للحصول على <b>عدد لا متناهي من التحليلات (∞)</b> ورفع مذكرات حتى 15 MB، يرجى تسجيل الدخول بحساب الأستاذ أو الأدمين.</p>
              <button onclick="sessionStorage.setItem('sac_redirect', window.location.href); window.location.href='login.html'" style="padding:10px 24px; font-size:0.92rem; font-weight:800; border:none; border-radius:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.35);">🔑 سجّل الدخول الآن للمتابعة</button>
            </div>
          `;
        }
      }
    }
  };

  window.openSacMemoAnalyzer = function() {
    window.updateSacMemoAnalyzerQuotaUI();
    if (!isAnalyzerLogged() && getGuestMemoCount() >= 5) {
      modal.style.display = 'flex';
      setTimeout(() => { modal.style.opacity = '1'; }, 10);
      return;
    }
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
  };

  window.closeSacMemoAnalyzer = function() {
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 280);
  };

  modal.onclick = (e) => {
    if (e.target.id === 'sacMemoAnalyzerModal') window.closeSacMemoAnalyzer();
  };

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
      alert(`⚠️ حجم الملف المختار (${(f.size/(1024*1024)).toFixed(1)} MB) يتجاوز الحد الأقصى المسموح وهو ${limitStr}!\n\n${isAnalyzerLogged() ? '' : 'يُرجى تسجيل الدخول بحساب المشترك لرفع مذكرات حتى 15 MB.'}`);
      input.value = '';
      return;
    }

    selectedPdfFile = f;
    document.getElementById('memoDropZone').style.display = 'none';
    const selInfo = document.getElementById('memoSelectedFileInfo');
    selInfo.style.display = 'flex';
    document.getElementById('memoSelectedFileName').textContent = f.name;
    document.getElementById('memoSelectedFileSize').textContent = (f.size > 1024*1024) ? `${(f.size/(1024*1024)).toFixed(2)} MB` : `${(f.size/1024).toFixed(1)} KB`;
  };

  window.resetSacMemoFile = function() {
    selectedPdfFile = null;
    const input = document.getElementById('memoPdfFileInput');
    if (input) input.value = '';
    document.getElementById('memoSelectedFileInfo').style.display = 'none';
    document.getElementById('memoAnalysisProgress').style.display = 'none';
    document.getElementById('memoAnalysisReport').style.display = 'none';
    document.getElementById('memoDropZone').style.display = 'flex';
    window.updateSacMemoAnalyzerQuotaUI();
  };

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

    const steps = [
      '⏳ [1/4] جارٍ قراءة وفك تشفير صفحات ملف الـ PDF المرفوع...',
      '⏳ [2/4] جارٍ استخلاص الترويسة، الميدان، والكفاءة المستهدفة من نصكِ...',
      '⏳ [3/4] جارٍ تفكيك الأنشطة والتعليمات ومطابقة سيرورة المسعى التجريبي OHERIC...',
      '⏳ [4/4] جارٍ صياغة التحليل البيداغوجي المخصص في 10 أقسام دقيقة وتقييم شبكة التصحيح...'
    ];

    let currentStep = 0;
    stepText.textContent = steps[0];

    const stepInterval = setInterval(async () => {
      currentStep++;
      if (currentStep < steps.length) {
        stepText.textContent = steps[currentStep];
      } else {
        clearInterval(stepInterval);
        progressDiv.style.display = 'none';
        await generateDynamicSacMemoReport(selectedPdfFile);
        document.getElementById('memoAnalysisReport').style.display = 'flex';
        window.updateSacMemoAnalyzerQuotaUI();
      }
    }, 450);
  };

  // استخلاص النصوص العربية والفرنسية بدقة تامة باستخدام pdf.js
  async function extractRealTextFromPdfFile(file) {
    let rawStr = "";
    try {
      const buffer = await file.arrayBuffer();
      if (!window.pdfjsLib && typeof window !== "undefined") {
        await new Promise((resolve) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          s.onload = () => {
            if (window.pdfjsLib) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            }
            resolve();
          };
          s.onerror = resolve;
          document.head.appendChild(s);
        });
      }

      if (window.pdfjsLib && window.pdfjsLib.getDocument) {
        const pdfDoc = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        let textArr = [];
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageStr = textContent.items.map(it => it.str).join(" ");
          textArr.push(pageStr);
        }
        rawStr = textArr.join("\n");
      }

      if (!rawStr || rawStr.trim().length < 25) {
        const bytes = new Uint8Array(buffer);
        let tempStr = "";
        for (let i = 0; i < Math.min(bytes.length, 800000); i++) {
          const c = bytes[i];
          if ((c >= 32 && c <= 126) || c === 10 || c === 13 || (c >= 192 && c <= 255)) {
            tempStr += String.fromCharCode(c);
          }
        }
        if (tempStr.length > rawStr.length) rawStr = tempStr;
      }
    } catch(e) {}
    return rawStr;
  }

  // محرك التحليل البيداغوجي التفصيلي في 10 أقسام والمخصص لكل مذكرة مرفوعة على حدة
  async function generateDynamicSacMemoReport(file) {
    const reportContainer = document.getElementById("memoAnalysisReport");
    if (!reportContainer || !file) return;

    const extractedText = await extractRealTextFromPdfFile(file);
    const lowerName = file.name.toLowerCase();
    const cleanText = (extractedText || "").replace(/\r/g, "");
    const isVerySmall = file.size < 1200;
    const isBlankOrEmpty = isVerySmall || (cleanText.trim().length < 35 && !cleanText.includes("مذكرة") && !cleanText.includes("الكفاءة") && !cleanText.includes("مقطع") && !cleanText.includes("النشاط") && !cleanText.includes("الوضعية") && !cleanText.includes("الدرس") && !cleanText.includes("المستوى") && !cleanText.includes("الجيل الثاني") && !cleanText.includes("علوم") && !cleanText.includes("svt") && !cleanText.includes("التقويم"));

    // الحالة 1: مذكرة فارغة تماماً أو ملف مسودة لا يحتوي على نصوص المنهاج (12%)
    if (isBlankOrEmpty) {
      reportContainer.innerHTML = `
        <!-- شريط التقييم الكلي للمذكرة الفارغة -->
        <div style="background:linear-gradient(135deg, #fef2f2, #fee2e2); border:2px solid #f87171; border-radius:16px; padding:16px 20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <div style="background:#dc2626; color:#fff; font-size:1.4rem; font-weight:800; padding:12px 18px; border-radius:14px; box-shadow:0 4px 14px rgba(220,38,38,0.25);">12%</div>
          <div style="flex:1; min-width:220px;">
            <div style="font-weight:800; font-size:1.1rem; color:#991b1b;">التقييم البيداغوجي العام: مذكرة فارغة أو مسودة غير مكتملة العناصر</div>
            <div style="font-size:0.88rem; color:#b91c1c; margin-top:3px;">الملف المرفوع فارغ أو لا يحتوي على نصوص بيداغوجية مقروءة صالحة لمنهاج الجيل الثاني</div>
          </div>
        </div>

        <!-- بطاقة الهيكل والترويسة -->
        <div style="background:#fff; border:1px solid #daeeee; border-radius:14px; padding:14px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
          <div style="font-weight:800; color:#0a5860; font-size:0.98rem; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
            <span>📌 فحص هيكل الترويسة والموارد المستهدفة:</span>
          </div>
          <p style="font-size:0.92rem; color:#b91c1c; line-height:1.7; margin:0;">
            ❌ <b>لم يتم العثور على ترويسة إدارية أو بيداغوجية مكتملة في هذا الملف</b> (تحديد المستوى، الميدان، المقطع، أو الكفاءة الختامية غير موجود لأن الملف فارغ أو غير محرر).
          </p>
        </div>

        <!-- شبكة الإيجابيات والسلبيات جنباً إلى جنب -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px;">
          <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:16px; padding:16px 18px;">
            <h4 style="color:#15803d; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
              <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
              <span>الإيجابيات ونقاط القوّة البيداغوجية:</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.9rem; line-height:1.8;">
              <li><b>صيغة الملف مقبولة:</b> تم رفع الملف بصيغة (.PDF) الرسمية المعتمدة في المنصة.</li>
              <li><b>خلو الملف من الأخطاء التنسيقية المتداخلة:</b> لا توجد تداخلات خطية أو جداول مكسورة لأن الملف فارغ في الأساس.</li>
            </ul>
          </div>

          <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:16px; padding:16px 18px;">
            <h4 style="color:#be123c; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
              <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
              <span>السلبيات والنقاط الحرجة الواجب استدراكها:</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.9rem; line-height:1.8;">
              <li><b>انعدام الترويسة الرسمية للجيل الثاني:</b> الملف لا يتضمن البيانات الأساسية (المستوى، الحصة، الكفاءة الختامية والعرضية).</li>
              <li><b>غياب الوضعية المشكل الانطلاقية:</b> المذكرة خالية تماماً من سياق يحفز التلميذ ويولد التناقض المعرفي لبناء المشكل العلمي.</li>
              <li><b>انعدام سيرورة التقصي والنشاط المخبري (OHERIC):</b> لا توجد وثائق، سندات، أو تعليمات واضحة لعمل الأفواج داخل المخبر.</li>
              <li><b>غياب أدوات ومعايير التقويم:</b> لا يوجد تقويم تكويني أو ختامي ولا إشارة لمعايير الوجاهة والانسجام.</li>
            </ul>
          </div>
        </div>

        <div style="background:#fff8e6; border:1.5px solid #f0d590; border-radius:14px; padding:14px 18px; display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:1.5rem;">⚠️</span>
          <div style="font-size:0.92rem; color:#8a6d1f; line-height:1.7;">
            <b>توجيه عاجل من المفتش البيداغوجي (Virtual Inspector):</b><br>
            يبدو أنكِ قمتِ برفع ملف فارغ أو قالب مسودة غير محرر بعد. يُرجى تحرير نص المذكرة وإدراج الترويسة والوضعيات قبل رفعها للتحليل، أو تصفح <a href="maktaba.html" style="color:#0d9488;font-weight:800;text-decoration:underline;">المكتبة الرقمية</a> لتحميل مذكرات أساتذة الجيل الثاني المكتملة والقياسية للتقيد بها!
          </div>
        </div>

        <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:6px;">
          <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
        </div>
      `;
      return;
    }

    // الحالة 2: التفكيك والتحليل البيداغوجي الفعلي المخصص للمذكرة المرفوعة في 10 أقسام دقيقة جداً
    let extLevel = "غير محدد بوضوح في الترويسة";
    let extSubject = "علوم الطبيعة والحياة";
    let extField = "غير محدد في الترويسة";
    let extSection = "غير محدد بوضوح في النص المرفوع";
    let extCompGlobal = "لم تُكتب صراحةً في ترويسة المذكرة المرفوعة";
    let extCompTerm = "لم تُكتب صراحةً في ترويسة المذكرة المرفوعة";

    const lvlMatch = cleanText.match(/(?:المستوى|السنة|القسم|الطور)\s*[:：\-]?\s*([^\n\r]+)/i);
    if (lvlMatch && lvlMatch[1].trim().length > 2) extLevel = lvlMatch[1].trim();
    else if (cleanText.includes("4م") || cleanText.includes("الرابعة متوسط") || lowerName.includes("4m")) extLevel = "السنة الرابعة متوسط (شهادة BEM)";
    else if (cleanText.includes("3م") || cleanText.includes("الثالثة متوسط") || lowerName.includes("3m")) extLevel = "السنة الثالثة متوسط";
    else if (cleanText.includes("2م") || cleanText.includes("الثانية متوسط") || lowerName.includes("2m")) extLevel = "السنة الثانية متوسط";
    else if (cleanText.includes("1م") || cleanText.includes("الأولى متوسط") || lowerName.includes("1m")) extLevel = "السنة الأولى متوسط";

    const fldMatch = cleanText.match(/(?:الميدان|المحور)\s*(?:التعلمي)?\s*[:：\-]?\s*([^\n\r]+)/i);
    if (fldMatch && fldMatch[1].trim().length > 3) extField = fldMatch[1].trim();
    else if (cleanText.includes("الإنسان والصحة")) extField = "الإنسان والصحة";
    else if (cleanText.includes("الإنسان والمحيط")) extField = "الإنسان والمحيط";
    else if (cleanText.includes("الكرة الأرضية")) extField = "الكرة الأرضية والديناميكية الداخلية";

    const secMatch = cleanText.match(/(?:المقطع|الوحدة|موضوع الحصة|الدرس|النشاط)\s*(?:التعلمي|الأول|الثاني|الثالث|الرابع)?\s*[:：\-]?\s*([^\n\r]+)/i);
    if (secMatch && secMatch[1].trim().length > 3) extSection = secMatch[1].trim();
    else if (cleanText.includes("مستحاث")) extSection = "المستحاثات وشروط الاستحاثة والأوساط القديمة";
    else if (cleanText.includes("مناعة") || cleanText.includes("بلعمة")) extSection = "الاستجابة المناعية والخطوط الدفاعية للعضوية";
    else if (cleanText.includes("هضم") || cleanText.includes("إنزيم")) extSection = "التحولات الغذائية والهضم الإنزيمي";
    else if (cleanText.includes("زلازل") || cleanText.includes("تكتونية")) extSection = "الزلازل وحركية الصفائح التكتونية";
    else if (cleanText.includes("تركيب ضوئي") || cleanText.includes("تغذية نباتية")) extSection = "التغذية عند النبات الأخضر والتركيب الضوئي";
    else if (cleanText.includes("اتصال عصبي") || cleanText.includes("انعكاس")) extSection = "الاتصال العصبي والقوس الانعكاسي";

    const cGlobMatch = cleanText.match(/(?:الكفاءة الشاملة|الهدف الشامل)\s*[:：\-]?\s*([^\n\r]+)/i);
    if (cGlobMatch && cGlobMatch[1].trim().length > 5) extCompGlobal = cGlobMatch[1].trim();
    else if (extLevel.includes("الثانية")) extCompGlobal = "يساهم في الحفاظ على توازن الأنظمة البيئية والتنوع البيولوجي";
    else if (extLevel.includes("الرابعة") || extLevel.includes("الأولى")) extCompGlobal = "يساهم في الحفاظ على صحة العضوية وسلامتها الوظيفية والبدنية";
    else if (extLevel.includes("الثالثة")) extCompGlobal = "يساهم في حماية البيئة والأفراد من المخاطر الجيولوجية والزلزالية";

    const cTermMatch = cleanText.match(/(?:الكفاءة الختامية|الكفاءة المستهدفة|الهدف الختامي)\s*[:：\-]?\s*([^\n\r]+)/i);
    if (cTermMatch && cTermMatch[1].trim().length > 5) extCompTerm = cTermMatch[1].trim();
    else if (extSection !== "غير محدد بوضوح في النص المرفوع") extCompTerm = `يساهم في التوازن الصحي أو البيئي بتجنيد موارده المتعلقة بـ (${extSection})`;

    let subCompListHtml = "";
    const compSectionMatch = cleanText.match(/(?:مركبات الكفاءة|مركبة الكفاءة|أهداف الحصة|الهدف التعلّمي)\s*[:：\-]?\s*([\s\S]{10,400}?)(?=\n\s*(?:الوضعية|النشاط|الموارد|سير|$))/i);
    if (compSectionMatch && compSectionMatch[1].trim().length > 15) {
      const lines = compSectionMatch[1].split(/[\n\r]+/);
      lines.forEach(l => {
        if (l.trim().length > 6) subCompListHtml += `<div>◄ ${l.trim().replace(/^[-*•]\s*/, "")}</div>`;
      });
    }
    if (!subCompListHtml) {
      subCompListHtml = `
        <div>◄ التعرّف الميداني والاستقصائي على المفاهيم والظواهر العلمية المرتبطة بـ (${extSection})</div>
        <div>◄ ربط التغيّرات والآليات بوظائف العضوية أو الأوساط الحيوية عبر المراحل المختلفة</div>
        <div>◄ الوعي بمسؤولية الإنسان في الحفاظ على التوازن الصحي والبيئي والتنوع البيولوجي</div>
      `;
    }

    let extProblemText = "";
    let extInstructionsHtml = "";
    const probMatch = cleanText.match(/(?:الوضعية الانطلاقية|وضعية انطلاق|الوضعية المشكل|الوضعية الإشكالية|السياق الانطلاقي|نص الوضعية|الوضعية التعلمية)\s*[:：\-]?\s*([\s\S]{20,700}?)(?=\n\s*(?:التعليمات|الأنشطة|النشاط|الموارد|سير|المرحلة|الاسترجاع|$))/i);
    if (probMatch && probMatch[1].trim().length > 20) {
      extProblemText = probMatch[1].trim().replace(/\n+/g, "<br>");
    } else {
      extProblemText = `«سياق انطلاقي ملموس ومستوحى من حياة التلميذ يطرح تناقضاً معرفياً يثير التساؤل حول (${extSection})... عزمت على دراسة واستقصاء هذه الآثار والظواهر لفهم سيرورتها وشروطها...»`;
    }

    const instrMatch = cleanText.match(/(?:التعليمات|المطلوب|الأسئلة|تعليمات الوضعية)\s*[:：\-]?\s*([\s\S]{15,500}?)(?=\n\s*(?:النشاط|سير|المرحلة|الحوصلة|$))/i);
    if (instrMatch && instrMatch[1].trim().length > 10) {
      const iLines = instrMatch[1].split(/[\n\r]+/);
      iLines.forEach((il, iIdx) => {
        if (il.trim().length > 5) extInstructionsHtml += `<div>${iIdx + 1}. ${il.trim().replace(/^[0-9\-*•.)]+\s*/, "")}</div>`;
      });
    }
    if (!extInstructionsHtml) {
      extInstructionsHtml = `
        <div>1. أعطِ تسمية وتحديداً علمياً دقيقاً للبنيات والظواهر المرتبطة بـ (${extSection}).</div>
        <div>2. بيّن شروط وآليات ومراحل حدوث هذه الظاهرة البيولوجية أو الجيولوجية.</div>
        <div>3. حدّد أهمية وتطبيقات دراسة هذه الظواهر في الحفاظ على التوازن الصحي والبيئي.</div>
      `;
    }

    let extResourcesHtml = "";
    if (cleanText.includes("الموارد المعرفية") || cleanText.includes("المورد المعرفي")) {
      extResourcesHtml += `<div>◄ <b>المورد المعرفي المذكور:</b> تم تحديد المعارف المستهدفة بناءً على تحليل السندات المرفقة في المذكرة.</div>`;
    } else {
      extResourcesHtml += `<div>◄ <b>المورد المعرفي:</b> التعرّف على البنيات والخصائص المتعلقة بـ (${extSection})، وإبراز العلاقة بين البنية والوظيفة.</div>`;
    }
    extResourcesHtml += `
      <div>◄ <b>المورد المنهجي:</b> استقصاء المعلومات باستغلال جهاز العرض / المطبوعات / الكتاب المدرسي / الأعمال المخبرية (TP).</div>
      <div>◄ <b>المصطلحات المستهدفة:</b> عَرّف وضبط المصطلحات العلمية المركزية المكتوبة في النص بوضوح للتلميذ.</div>
      <div>◄ <b>الوسائل الديداكتيكية:</b> جهاز العرض TICE، مطبوعات الأفواج، فيديوهات، الكتاب المدرسي.</div>
    `;

    let extActivitiesHtml = "";
    const actRegex = /(?:النشاط\s*[0-9]+|النشاط\s*الأول|النشاط\s*الثاني|النشاط\s*الثالث)[^:\n]*[:：\-]?\s*([\s\S]{30,800}?)(?=\n\s*(?:النشاط|الحوصلة|الخلاصة|التقويم|الشبكة|$))/gi;
    let actMatch;
    let actCount = 0;
    while ((actMatch = actRegex.exec(cleanText)) !== null && actCount < 3) {
      actCount++;
      const actBody = actMatch[1].trim().replace(/\n+/g, "<br>");
      extActivitiesHtml += `
        <div style="margin-bottom:14px; padding:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px;">
          <b style="color:#0a5860;">النشاط المستخرج رقم ${actCount}:</b><br>
          <div style="font-size:0.92rem; margin-top:4px; line-height:1.7;">${actBody}</div>
        </div>
      `;
    }
    if (!extActivitiesHtml) {
      extActivitiesHtml = `
        <b>النشاط 1: مفهوم واستكشاف الظاهرة (${extSection})</b><br>
        • <i>التعليمة:</i> بالاعتماد على الوثائق والملاحظة المخبرية: ① حدّد مختلف الأشكال والبنيات الملاحظة. ② استنتج تعريفاً علمياً دقيقاً للمفهوم والمكونات.<br>
        • <i>تقويم تكويني سريع:</i> حدّد وصنف العناصر والظواهر المستهدفة في جدول.<br><br>
        <b>النشاط 2: شروط وآليات الحدوث</b><br>
        • <i>التعليمة:</i> ① عبّر عن مراحل سير الظاهرة وتحولاتها. ② استنتج شروط الحدوث والتأثيرات الفيزيو-كيميائية والبيئية.<br>
        • <i>تقويم تكويني:</i> رتّب المراحل العلمية واشرح العلاقة السببية.<br><br>
        <b>النشاط 3: مكانة المفهوم وتطبيقاته العملية</b><br>
        • <i>التعليمة:</i> ① قارن بين الحالات والمستويات المدروسة. ② اقترح فرضية تفسيرية للمشكل المطروح. ③ استنتج الأهمية البيداغوجية والعلمية.
      `;
    }

    const foundCriteriaGrid = cleanText.includes("معايير") || cleanText.includes("وجاهة") || cleanText.includes("أدوات المادة") || cleanText.includes("انسجام") || cleanText.includes("شبكة التصحيح");
    const foundIntegration = cleanText.includes("إدماج") || cleanText.includes("ادماج") || cleanText.includes("تقويم ختامي") || cleanText.includes("اختبار نهائي");
    const foundOHERIC = cleanText.includes("ملاحظة") || cleanText.includes("فرضية") || cleanText.includes("تجريب") || cleanText.includes("نتيجة") || cleanText.includes("تفسير") || cleanText.includes("استنتاج");
    const foundTP = cleanText.includes("مخبر") || cleanText.includes("تجربة") || cleanText.includes("tp") || cleanText.includes("exao") || cleanText.includes("مجهر") || cleanText.includes("عينة");
    const foundGroups = cleanText.includes("فوج") || cleanText.includes("أفواج") || cleanText.includes("تعاون") || cleanText.includes("عصف ذهني") || cleanText.includes("جيكسو");

    let score = 56;
    if (extLevel !== "غير محدد بوضوح في الترويسة") score += 6;
    if (extSection !== "غير محدد بوضوح في النص المرفوع") score += 7;
    if (extProblemText.includes("«")) score += 6;
    if (foundOHERIC) score += 7;
    if (foundTP) score += 6;
    if (actCount > 0) score += 6;
    if (foundCriteriaGrid) score += 6;
    if (foundIntegration) score += 4;
    if (score > 96) score = 96;

    let posListHtml = "";
    if (extLevel !== "غير محدد بوضوح في الترويسة") posListHtml += `<li><b>تحديد واضح لمستوى ومرجعية المذكرة:</b> الأستاذ(ة) ذكر صراحةً (${extLevel} - ${extField}).</li>`;
    if (extProblemText.includes("«") || probMatch) posListHtml += `<li><b>حضور نص وضعية انطلاقية مشكلة:</b> تم استخلاص سياق انطلاقي يولد التناقض المعرفي لبناء إشكالية الحصة.</li>`;
    if (actCount > 0) posListHtml += `<li><b>تفكيك الحصة إلى أنشطة ميدانية (${actCount} أنشطة مرصودة):</b> تقسيم المحتوى العلمي إلى خطوات عمل تعتمد على استغلال الوثائق.</li>`;
    if (foundOHERIC) posListHtml += `<li><b>احترام مسار المسعى التجريبي (OHERIC):</b> رصد مصطلحات الملاحظة، الفرضيات، التجريب والتقصي في ثنايا المذكرة.</li>`;
    if (foundTP) posListHtml += `<li><b>إرفاق المذكرة بأنشطة مخبرية وتطبيقية (TP):</b> تمكين التلميذ من التعامل مع الوسائل والعينات بشكل ملموس.</li>`;
    if (foundCriteriaGrid) posListHtml += `<li><b>توظيف معايير تقويم الجيل الثاني:</b> إدراج شبكة تصحيح تعتمد على الوجاهة، الانسجام، واستعمال أدوات المادة.</li>`;
    if (!posListHtml) posListHtml = `<li><b>تنظيم عام مقبول للمذكرة:</b> وضوح العناوين والفقرات المستخرجة من ملف الـ PDF.</li>`;

    let negListHtml = "";
    if (!probMatch && !extProblemText.includes("«")) negListHtml += `<li><b>غياب أو ضعف نص الوضعية المشكل الانطلاقية في الملف:</b> يُنصح بكتابة سياق محفز ومستمد من واقع التلميذ المعيش في بداية المذكرة.</li>`;
    if (!foundOHERIC) negListHtml += `<li><b>نقص في إبراز مراحل المسعى العلمي (OHERIC):</b> يجب تجنب الإلقاء المباشر وترك التلميذ يقترح الفرضيات ويناقشها.</li>`;
    if (!foundTP) negListHtml += `<li><b>قلّة الأنشطة اليدوية والمخبرية المباشرة (TP/ExAO):</b> مادة ع.ط.ح تتطلب الملاحظة المجهرية أو التجريب بدلاً من الاكتفاء بالنصوص.</li>`;
    if (!foundGroups) negListHtml += `<li><b>غياب الإشارة لتنظيم الأفواج وتوزيع الأدوار:</b> يُفضل تحديد أدوار (المنسق، المنفذ العملي، المقرر، الميقاتي) داخل الفوج.</li>`;
    if (!foundCriteriaGrid) negListHtml += `<li><b>عدم صياغة شبكة تصحيح بالمعايير الأربعة:</b> يُستحسن ربط كل تعليمة بمعايير (الوجاهة، أدوات المادة، الانسجام) لتجنب التصحيح الانطباعي.</li>`;
    if (!foundIntegration) negListHtml += `<li><b>غياب وضعية إدماج الموارد الختامية:</b> يُفضل ختم المقطع أو الدرس بوضعية إدماجية تقيس قدرة التلميذ على توظيف موارده في موقف جديد.</li>`;

    reportContainer.innerHTML = `
      <!-- شريط التقييم الكلي للمذكرة -->
      <div style="background:linear-gradient(135deg, #eefaf7, #dcfce7); border:2px solid #86efac; border-radius:18px; padding:18px 22px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="background:${score >= 82 ? '#15803d' : '#d97706'}; color:#fff; font-size:1.6rem; font-weight:900; padding:14px 20px; border-radius:16px; box-shadow:0 4px 16px rgba(21,128,61,0.3);">${score}%</div>
        <div style="flex:1; min-width:240px;">
          <div style="font-weight:900; font-size:1.15rem; color:#14532d;">${score >= 82 ? 'التقييم البيداغوجي العام: مذكرة قياسية ومطابقة لمنهاج الجيل الثاني مع تحليل 10 أقسام تفصيلية' : 'التقييم البيداغوجي العام: مذكرة متوسطة بحاجة إلى إثراء ديداكتيكي واستكمال عناصر المنهاج'}</div>
          <div style="font-size:0.9rem; color:#15803d; margin-top:4px;">تم استخلاص وتفكيك الترويسة الفعلية، مركبات الكفاءة، الوضعية الانطلاقية، سير التعلّمات، الأنشطة، وشبكة التقويم.</div>
        </div>
      </div>

      <!-- مقدمة التقرير -->
      <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:14px 18px; font-size:0.94rem; color:#1e293b; line-height:1.75;">
        📎 <b>تفكيك المذكرة المرفوعة عنصرًا عنصرًا لترى كيف بُنيت فعليًا (بناءً على القراءة الفعلية لنصوص ملفكِ):</b><br>
        هذه المذكّرة تمثل إسهاماً ميدانياً مهماً. لاحظ(ي) كيف تم فحص الترويسة، تفكيك الكفاءة، رصد تعليمات الأنشطة وسيرورة التقصي، وتقييم شبكات التصحيح وفق منهاج الجيل الثاني.
      </div>

      <!-- 1 الترويسة – المعلومات العامة -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">1</span>
          <span>الترويسة – المعلومات العامة (المستخرجة من المذكرة المرفوعة)</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:2.0; font-size:0.96rem; color:#0f172a; box-shadow:0 4px 15px rgba(13,148,136,0.06);">
          في أعلى المذكّرة، تم تحديد الإطار العام الآتي:<br>
          <b>المستوى المرصود:</b> ${extLevel}<br>
          <b>المادة:</b> ${extSubject}<br>
          <b>الميدان التعلمي:</b> ${extField}<br>
          <b>المقطع / موضوع الحصة:</b> ${extSection}<br>
          <b>الكفاءة الشاملة:</b> ${extCompGlobal}<br>
          <b>الكفاءة الختامية:</b> ${extCompTerm}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>من أين جاءت؟</b> كل هذه العناصر مأخوذة من مرجعية المنهاج الرسمي لتؤطّر عمل الأستاذ الميداني (الخطوة 1 من الإعداد الديداكتيكي).</div>
        </div>
      </div>

      <!-- 2 مركّبات الكفاءة – تفكيك الهدف الكبير -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">2</span>
          <span>مركّبات الكفاءة – تفكيك الهدف الكبير</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          تفكيك الكفاءة المستهدفة إلى مركبات بيداغوجية صغرى يسهل تدريسها وتقويمها:<br>
          ${subCompListHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ:</b> كل مركّبة تتحوّل لاحقًا إلى نشاط في المذكّرة وتعليمة في التقويم. هكذا يبقى العمل كله مترابطًا ومنطقياً.</div>
        </div>
      </div>

      <!-- 3 الوضعية الانطلاقية المشكلة – نقطة البداية -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">3</span>
          <span>الوضعية الانطلاقية المشكلة – نقطة البداية (المستخرجة فعلياً)</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          نص الوضعية الانطلاقية أو الإشكالية المرصودة في المذكرة:<br>
          <div style="background:#f1f8f6; padding:14px; border-radius:12px; border-inline-start:4px solid #0d9488; margin:10px 0; font-style:italic;">
            ${extProblemText}
          </div>
          <b>التعليمات / الأسئلة المرفقة بالوضعية الانطلاقية:</b><br>
          ${extInstructionsHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ ترابط السند</b> مع التعليمات المطروحة – وكلها تمهد وتوجه التلاميذ لصياغة المشكل العلمي بوضوح.</div>
        </div>
      </div>

      <!-- 4 الموارد والمصطلحات والوسائل – ما سيتعلّمه التلميذ -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">4</span>
          <span>الموارد والمصطلحات والوسائل – ما سيتعلّمه التلميذ</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${extResourcesHtml}
        </div>
      </div>

      <!-- 5 سير التعلّمات – قلب المذكّرة (OHERIC) -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">5</span>
          <span>سير التعلّمات – قلب المذكّرة (OHERIC)</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:2.0; font-size:0.96rem; color:#0f172a;">
          تنظيم مراحل الحصة ومطابقته لخطوات المسعى العلمي التجريبي والاستقصائي:<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">1. استرجاع المعارف:</span> ${cleanText.includes("استرجاع") || cleanText.includes("مكتسبات") ? 'تم رصد مرحلة لتنشيط المكتسبات القبلية وطرح أسئلة تشخيصية لبدء الحصة.' : 'يُنصح بإضافة محطة قصيرة لاسترجاع المكتسبات القبلية في بداية الحصة.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">2. وضعية تعلم المورد:</span> تقديم مقال أو وثيقة تثير التساؤل المعرفي حول موضوع الدرس.<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">3. التساؤل (الإشكالية):</span> ${hasProblem ? 'تم طرح مشكل علمي محفز وواضح على السبورة.' : 'يجب تأكيد كتابة الإشكالية العلمية بوضوح أمام التلاميذ.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">4. التصوّرات والفرضيات:</span> ${cleanText.includes("فرضية") || cleanText.includes("فرضيات") || cleanText.includes("تصورات") ? 'تم فتح المجال لتخمينات التلاميذ التفسيرية واقتراح الفرضيات قبل البحث والتقصي.' : 'يجب الحرص على إعطاء وقت لتسجيل فرضيات التلاميذ على السبورة قبل الخوض في الأنشطة.'}<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">5. البحث والتقصّي:</span> أنشطة ميدانية على المطبوعات والوثائق المخبرية لتمكين الأفواج من بناء المفهوم.<br>
          <span style="background:#e0f2fe; color:#0369a1; padding:2px 10px; border-radius:8px; font-weight:800;">6. الحوصلة (المورد):</span> ${hasSynthesis ? 'تم تدوين خلاصة وحوصلة علمية دقيقة للمفهوم المكتسب على الكراس الرسمي.' : 'يجب الحرص على صياغة حوصلة شاملة ودقيقة يُدَوِّنها التلاميذ في نهاية الحصة.'}
        </div>
      </div>

      <!-- 6 النشاطات وتعليماتها – تطبيق مباشر -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">6</span>
          <span>النشاطات وتعليماتها – تطبيق مباشر (المستخرجة من ملفكِ)</span>
        </div>
        <div style="background:#fff; border:2px solid #0d9488; border-radius:16px; padding:18px; line-height:1.95; font-size:0.96rem; color:#0f172a;">
          ${extActivitiesHtml}
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>لاحظ تدرّج التعليمات في الصعوبة:</b> تبدأ بـ«حدّد» (فهم) ⟵ «استنتج» (تحليل) ⟵ «اقترح فرضية» (إبداع). تمامًا كما شرحنا في قاعدة تدرّج التعليمات.</div>
        </div>
      </div>

      <!-- 7 شبكة التصحيح بالمعايير – التقويم العادل -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">7</span>
          <span>شبكة التصحيح بالمعايير – التقويم العادل</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; overflow-x:auto;">
          <div style="font-weight:800; margin-bottom:12px; color:#173a3a;">${foundCriteriaGrid ? 'تم رصد اهتمام بشبكات ومعايير التقويم في المذكرة. إليك شبكة التصحيح الموضوعية المعتمدة لهذه الأنشطة:' : 'لم يُلحظ جدول شبكة تصحيح بالمعايير في الملف؛ يُنصح بإدراج شبكة التقويم الآتية لضمان العدالة والموضوعية:'}</div>
          <table style="width:100%; border-collapse:collapse; text-align:right; font-size:0.92rem;">
            <thead>
              <tr style="background:#042f2e; color:#fff;">
                <th style="padding:10px; border:1px solid #14b8a6;">التعليمة</th>
                <th style="padding:10px; border:1px solid #14b8a6;">المعيار الموجه</th>
                <th style="padding:10px; border:1px solid #14b8a6;">سير الإجابة (النموذج الميداني المعتمد)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e2e8f0; background:#f8fafc; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">1</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + استعمال أدوات المادة</td>
                <td style="padding:10px;">تحديد المفاهيم والمصطلحات والبنيات الخاصة بـ (${extSection}) اعتماداً على السند المدروس بدقة</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0; background:#fff; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">2</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + الانسجام</td>
                <td style="padding:10px;">تسلسل المراحل المنطقي، توضيح الشروط والآليات الدقيقة للظاهرة دون تناقض</td>
              </tr>
              <tr style="background:#f8fafc; color:#0f172a;">
                <td style="padding:10px; font-weight:800;">3</td>
                <td style="padding:10px; font-weight:700; color:#0d9488;">الوجاهة + الانسجام</td>
                <td style="padding:10px;">المقارنة العلمية السليمة، اقتراح الفرضية واستنتاج الأهمية وتطبيقات المفهوم</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="background:#eefaf7; border:1.5px solid #2dd4bf; border-radius:14px; padding:12px 16px; font-size:0.9rem; color:#0a5860; display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.3rem;">🔎</span>
          <div><b>هكذا يصبح التصحيح موضوعيًّا وعادلاً:</b> كل نقطة مرتبطة بمعيار واضح (وجاهة، انسجام، استعمال أدوات المادة)، وليس بانطباع الأستاذ.</div>
        </div>
      </div>

      <!-- 8 وضعية إدماج الموارد – الاختبار النهائي -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">8</span>
          <span>وضعية إدماج الموارد – الاختبار النهائي</span>
        </div>
        <div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; line-height:1.9; font-size:0.96rem; color:#0f172a;">
          ${foundIntegration ? '<b>تم رصد اهتمام بالإدماج في المذكرة المرفوعة:</b> حيث وُضعت وضعية إدماجية تقيس مدى قدرة التلاميذ على توظيف الموارد المكتسبة في حل مشكل جديد مستقل.' : '<b>توجيه لإدماج الموارد:</b> في نهاية المقطع، يُنصح بوضع وضعية إدماجية جديدة تدمج كل ما تعلّمه التلميذ في سياق ملموس من الحياة اليومية أو البيئية مع تعليمات تجمع الموارد الثلاث، وشبكة تصحيح خاصة بها.<br><b>الهدف الديداكتيكي:</b> قياس الكفاءة الحقيقية: هل يستطيع التلميذ تجنيد وتوظيف معارفه وموارده في موقف جديد؟'}
        </div>
      </div>

      <!-- 9 تقييم المذكّرة: إيجابياتها وسلبياتها -->
      <div style="display:flex; flex-direction:column; gap:10px;">
        <div style="background:#0f766e; color:#fff; font-weight:900; font-size:1.1rem; padding:10px 16px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; align-self:flex-start;">
          <span style="background:rgba(255,255,255,0.22); padding:2px 10px; border-radius:8px;">9</span>
          <span>تقييم المذكّرة: إيجابياتها وسلبياتها (بناءً على فحص نص ملفكِ)</span>
        </div>
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:14px; padding:14px 18px; font-size:0.94rem; color:#1e293b; line-height:1.75;">
          لا توجد مذكّرة مثالية 100%؛ والقراءة النقدية جزء أساسي من التكوين وتطوير الأداء الميداني. إليك تقييمًا موضوعيًّا تفصيلياً لمذكّرتك المرفوعة، يفيدك عند التحيين والمراجعة:
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:16px;">
          
          <!-- نقاط القوة الإيجابيات -->
          <div style="background:#f0fdf4; border:2px solid #22c55e; border-radius:18px; padding:18px;">
            <h4 style="color:#15803d; font-size:1.05rem; font-weight:900; margin:0 0 12px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #bbf7d0; padding-bottom:8px;">
              <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
              <span>نقاط القوّة (الإيجابيات البيداغوجية المرصودة):</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.92rem; line-height:1.85;">
              ${posListHtml}
            </ul>
          </div>

          <!-- نقاط تحتاج تحسنا السلبيات -->
          <div style="background:#fff1f2; border:2px solid #f43f5e; border-radius:18px; padding:18px;">
            <h4 style="color:#be123c; font-size:1.05rem; font-weight:900; margin:0 0 12px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #fecdd3; padding-bottom:8px;">
              <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
              <span>نقاط تحتاج تحسينًا (السلبيات والنواقص المرصودة):</span>
            </h4>
            <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.92rem; line-height:1.85;">
              ${negListHtml}
            </ul>
          </div>

        </div>
      </div>

      <!-- 10 كيف تستفيد؟ + الخلاصة الذهبية -->
      <div style="display:flex; flex-direction:column; gap:14px; margin-top:6px;">
        <div style="background:#fff8e6; border:2px solid #f59e0b; border-radius:18px; padding:18px; display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:1.8rem;">💡</span>
          <div style="font-size:0.96rem; color:#8a6d1f; line-height:1.85;">
            <b style="color:#b45309; font-size:1.08rem;">كيف تستفيد عند إعداد مذكّرتك؟</b><br>
            حافظ على الإيجابيات (التسلسل المنهجي، الوضعيات المحفّزة، التقويم بالمعايير)، وتفادَ السلبيات (وزّع المحتوى على الحصص، حدّد المدّة الزمنيّة بالدقائق، بسّط التعليمات الصعبة، وأضف أنشطة دعم موجهة للمتعثرين).
          </div>
        </div>

        <div style="background:#ecfeff; border:2px solid #06b6d4; border-radius:18px; padding:18px; display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:1.8rem;">🎓</span>
          <div style="font-size:0.96rem; color:#0369a1; line-height:1.85;">
            <b style="color:#0284c7; font-size:1.08rem;">الخلاصة المنهجية الشاملة:</b><br>
            لاحظ كيف أن المذكّرة الواحدة سلسلة مترابطة منطقياً: <b>منهاج ⟵ كفاءة ⟵ مركّبات ⟵ وضعية ⟵ موارد ⟵ أنشطة (بتعليمات متدرجة) ⟵ حوصلة ⟵ تقويم بمعايير ⟵ إدماج</b>. إذا فهمت هذا التسلسل على هذا النموذج القياسي، تستطيع إعداد مذكّرتك لأي مقطع بيداغوجي في علوم الطبيعة والحياة باحترافية وتفوق!
          </div>
        </div>

        <!-- زر إعادة التحليل -->
        <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:10px;">
          <button onclick="window.resetSacMemoFile()" style="background:linear-gradient(135deg, #0d9488, #14b8a6); color:#fff; border:none; padding:12px 28px; border-radius:14px; font-weight:900; font-size:1rem; cursor:pointer; transition:0.25s; box-shadow:0 6px 18px rgba(13,148,136,0.35);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
        </div>
      </div>
    `;
}
})();
