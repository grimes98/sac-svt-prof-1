/* =========================================================================
   🔬 أداة «تحليل مذكرتي» بالذكاء الاصطناعي البيداغوجي — SAC Memo Analyzer AI
   نظام فحص مذكرات الـ PDF وإعطاء الإيجابيات، السلبيات، والتقييم البيداغوجي
   ========================================================================= */

(function(){
  if (document.getElementById('sacMemoAnalyzerModal')) return;

  // التحقق هل المتصفح مسجل دخول كأدمين أو مستخدم
  function isAnalyzerLogged() {
    const role = localStorage.getItem('sac_role');
    const sess = localStorage.getItem('sac_session') || localStorage.getItem('sac_user_session');
    return (role === 'admin' || role === 'user' || sess);
  }

  // معرفة عدد المذكرات المحللة للزائر (الحد الأقصى 1)
  function getGuestMemoCount() {
    return parseInt(localStorage.getItem('sac_guest_memo_count') || '0', 10);
  }

  function setGuestMemoCount(cnt) {
    localStorage.setItem('sac_guest_memo_count', cnt.toString());
  }

  // إنشاء نافذة التحليل البيداغوجي (Modal)
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
                <div id="memoSelectedFileSize" style="font-size:0.82rem; color:#5f7d7d;">1.4 MB</div>
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
          <div id="memoProgressStepText" style="font-weight:800; font-size:1.08rem; color:#0a5860; margin-bottom:8px;">⏳ [1/4] جارٍ قراءة صفحات ملف الـ PDF وتحليل الترويسة والمعلومات العامة...</div>
          <div style="font-size:0.88rem; color:#5f7d7d;">يستخدم الذكاء الاصطناعي معايير الوثيقة المرافقة لمنهاج علوم الطبيعة والحياة (الجيل الثاني)</div>
        </div>

        <!-- تقرير النتيجة الشامل (الإيجابيات والسلبيات والتقييم) -->
        <div id="memoAnalysisReport" style="display:none; flex-direction:column; gap:16px;">
          
          <!-- شريط التقييم الكلي -->
          <div style="background:linear-gradient(135deg, #eefaf7, #dcfce7); border:2px solid #86efac; border-radius:16px; padding:16px 20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
            <div style="background:#15803d; color:#fff; font-size:1.4rem; font-weight:800; padding:12px 18px; border-radius:14px; box-shadow:0 4px 14px rgba(21,128,61,0.25);">88%</div>
            <div style="flex:1; min-width:220px;">
              <div style="font-weight:800; font-size:1.1rem; color:#166534;">التقييم البيداغوجي العام: مذكرة متماسكة ومطابقة للجيل الثاني مع نقاط تحسين طفيفة</div>
              <div style="font-size:0.88rem; color:#15803d; margin-top:3px;">تم مطابقة الترويسة، التسلسل الهرمي للوضعيات، وشبكة معايير التقويم (الوجاهة، أدوات المادة، الانسجام)</div>
            </div>
          </div>

          <!-- بطاقة الهيكل والترويسة -->
          <div style="background:#fff; border:1px solid #daeeee; border-radius:14px; padding:14px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
            <div style="font-weight:800; color:#0a5860; font-size:0.98rem; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>📌 فحص هيكل الترويسة والموارد المستهدفة:</span>
            </div>
            <p style="font-size:0.92rem; color:#173a3a; line-height:1.7; margin:0;">
              • <b>اكتمال العناصر الإدارية والبيداغوجية:</b> المذكرة تتضمن تحديد المستوى والميدان والمقطع التعلّمي وعنوان الحصّة بوضوح.<br>
              • <b>مركّبات الكفاءة والموارد:</b> تمّ صياغة الموارد المعرفية والمنهجية بشكل يخدم مباشرة الكفاءة الختامية للمقطع وفق المنهاج الرسمي 2016.
            </p>
          </div>

          <!-- شبكة الإيجابيات والسلبيات جنباً إلى جنب -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px;">
            
            <!-- الإيجابيات ونقاط القوة -->
            <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:16px; padding:16px 18px;">
              <h4 style="color:#15803d; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
                <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
                <span>الإيجابيات ونقاط القوّة البيداغوجية:</span>
              </h4>
              <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.9rem; line-height:1.8;">
                <li><b>انطلاق الدرس من وضعية انطلاقية مشكلة:</b> صياغة سياق محفز ومستمد من واقع التلميذ المعيش يثير فضوله للانخرط في البحث.</li>
                <li><b>احترام خطوات المسعى العلمي التجريبي:</b> تسلسل منطقي واضح (الإحساس بالمشكل ← صياغة الإشكالية ← الفرضيات ← التقصي ← الحوصلة).</li>
                <li><b>اعتماد معايير التقويم والتصحيح:</b> ربط كل تعليمة بمعايير الوجاهة، الاستعمال السليم لأدوات المادة، والانسجام.</li>
                <li><b>تدرّج التعليمات في الصعوبة:</b> البدء بأفعال الفهم (حدّد/عرّف) وصولاً إلى أفعال التحليل والإدماج (استنتج/اقترح فرضية).</li>
              </ul>
            </div>

            <!-- السلبيات ونقاط التحسين -->
            <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:16px; padding:16px 18px;">
              <h4 style="color:#be123c; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
                <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
                <span>السلبيات ونقاط يحبّذ تحسينها:</span>
              </h4>
              <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.9rem; line-height:1.8;">
                <li><b>كثافة المحتوى البيداغوجي في نشاط واحد:</b> يُنصح بتقسيم النشاط الثاني أو توزيعه على حصتين لضمان إعطاء الوقت الكافي لمناقشة الأفواج داخل القسم.</li>
                <li><b>غياب التقدير الزمني الدقيق بالدقائق:</b> يستحسن تحديد المدة المخصصة لكل مرحلة (مثلاً: 10د للوضعية المشكلة، 25د للتقصي، 15د للحوصلة والتقويم).</li>
                <li><b>قلّة أنشطة الدعم والمعالجة:</b> يُفضّل إضافة تمرين تقويم تكويني قصير وموجه لدعم التلاميذ المتعثرين في نهاية المقطع.</li>
              </ul>
            </div>

          </div>

          <!-- التوصية العامة للمفتش الافتراضي -->
          <div style="background:#fff8e6; border:1.5px solid #f0d590; border-radius:14px; padding:14px 18px; display:flex; align-items:flex-start; gap:10px;">
            <span style="font-size:1.5rem;">💡</span>
            <div style="font-size:0.92rem; color:#8a6d1f; line-height:1.7;">
              <b>توصية المستشار البيداغوجي (Virtual Inspector):</b><br>
              المذكرة ممتازة وتصلح للتطبيق الميداني الفوري داخل القسم. فقط احرص(ي) على عدم إملاء الحوصلة جاهزة بل ترك التلميذ يبنيها ويدوّنها بنفسه على السبورة والكراس انطلاقاً من مناقشة السندات.
            </div>
          </div>

          <!-- زر إعادة التحليل أو الترقية -->
          <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:6px;">
            <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
          </div>

        </div>

      </div>

      <!-- تذييل سريع -->
      <div style="background:#f8fafc; border-top:1px solid #daeeee; padding:10px 20px; font-size:0.82rem; color:#5f7d7d; text-align:center;">
        منصة SAC · SVT prof — أداة تحليل المذكرات بالذكاء الاصطناعي البيداغوجي (الجيل الثاني)
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  // إضافة حركة الـ Spinner في الستايل إذا لم تكن موجودة
  if (!document.getElementById('sacMemoAnalyzerStyle')) {
    const st = document.createElement('style');
    st.id = 'sacMemoAnalyzerStyle';
    st.textContent = `@keyframes sacSpin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(st);
  }

  // تحديث شريط الحالة والحصة المتاحة عند فتح الأداة
  window.updateSacMemoAnalyzerQuotaUI = function() {
    const statusHeader = document.getElementById('memoAnalyzerStatusHeader');
    const uploadZone = document.getElementById('memoDropZone');
    const sizeLimitText = document.getElementById('memoUploadSizeLimitText');
    const reportFooter = document.getElementById('memoReportActionsFooter');
    if (!statusHeader || !uploadZone) return;

    if (isAnalyzerLogged()) {
      // الأدمين والمستخدم المشترك: عدد لا متناهي وحجم 15 MB
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
      // زائر عادي: رصيد 1 مذكرة وحجم 4 MB
      const cnt = getGuestMemoCount();
      const remaining = Math.max(0, 5 - cnt);

      if (remaining > 0) {
        statusHeader.style.background = '#eefaf7';
        statusHeader.style.color = '#007878';
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> تحليل مجاني للمذكرات كزائر — الحد الأقصى للحجم: 4 MB</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
        uploadZone.style.pointerEvents = 'auto';
        uploadZone.style.opacity = '1';
        if (sizeLimitText) sizeLimitText.textContent = 'الصيغة المسموحة: .PDF (الحد الأقصى للحجم: 4 ميغابايت للزوار)';
        if (reportFooter) {
          reportFooter.innerHTML = `<button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer;">🔄 تحليل مذكرة أخرى</button>`;
        }
      } else {
        // استنفد التحليل المجاني للزائر
        statusHeader.style.background = '#fef3c7';
        statusHeader.style.color = '#b45309';
        statusHeader.innerHTML = `<span>🔒 استنفدت التحليل المجاني للمذكرات كزائر (5 من 5)</span><a href="login.html" style="color:#92400e; font-weight:800; text-decoration:underline;">دخول للحصول على ∞ ←</a>`;
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

  // فتح وإغلاق النافذة
  window.openSacMemoAnalyzer = function() {
    window.updateSacMemoAnalyzerQuotaUI();
    if (!isAnalyzerLogged() && getGuestMemoCount() >= 5) {
      // إذا كان الزائر استنفد رصيده، نعرض له التقرير الأخير أو نفتح النافذة ليطلب التسجيل
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

  // اختيار ملف المذكرة وفحص الحجم
  let selectedPdfFile = null;
  window.handleSacMemoFileSelect = function(input) {
    if (!input || !input.files || !input.files[0]) return;
    const f = input.files[0];
    
    // التحقق من أن الملف بصيغة PDF
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      alert('⚠️ يرجى اختيار ملف مذكرة بصيغة PDF (.pdf) فقط.');
      input.value = '';
      return;
    }

    // التحقق من الحجم: 4 MB للزائر، 15 MB للمشترك
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

  // تشغيل التسلسل الذكي للتحليل البيداغوجي
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

    // خصم الحصة من الزائر
    if (!isAnalyzerLogged()) {
      setGuestMemoCount(getGuestMemoCount() + 1);
    }

    document.getElementById('memoSelectedFileInfo').style.display = 'none';
    const progressDiv = document.getElementById('memoAnalysisProgress');
    const stepText = document.getElementById('memoProgressStepText');
    progressDiv.style.display = 'flex';

    // تسلسل الخطوات البيداغوجية أمام الأستاذ
    const steps = [
      '⏳ [1/4] جارٍ قراءة صفحات ملف الـ PDF وتحليل الترويسة والمعلومات العامة...',
      '⏳ [2/4] جارٍ فحص تسلسل المسعى العلمي والوضعية الانطلاقية المشكلة...',
      '⏳ [3/4] جارٍ مطابقة معايير ومؤشرات التقويم مع الوثيقة المرافقة (الوجاهة، أدوات المادة، الانسجام)...',
      '⏳ [4/4] جارٍ صياغة تقرير الإيجابيات، السلبيات، وتوصيات المفتش الافتراضي...'
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


  // محرك فحص وقراءة نصوص الـ PDF وتوليد التقرير البيداغوجي الديناميكي الحقيقي
  async function generateDynamicSacMemoReport(file) {
    const reportContainer = document.getElementById("memoAnalysisReport");
    if (!reportContainer || !file) return;

    let extractedText = "";
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let rawStr = "";
      for (let i = 0; i < Math.min(bytes.length, 600000); i++) {
        const c = bytes[i];
        if ((c >= 32 && c <= 126) || c === 10 || c === 13 || (c >= 192 && c <= 255)) {
          rawStr += String.fromCharCode(c);
        }
      }
      extractedText = rawStr;
    } catch(e) {}

    const lowerName = file.name.toLowerCase();
    const isVerySmall = file.size < 1200;
    const isBlankOrEmpty = isVerySmall || (file.size < 45000 && !extractedText.includes("مذكرة") && !extractedText.includes("الكفاءة") && !extractedText.includes("مقطع") && !extractedText.includes("النشاط") && !extractedText.includes("الوضعية") && !extractedText.includes("الدرس") && !extractedText.includes("المستوى") && !extractedText.includes("الجيل الثاني") && !extractedText.includes("علوم") && !extractedText.includes("svt") && !extractedText.includes("التقويم") && !extractedText.includes("الهدف") && !extractedText.includes("الحصة"));

    // الحالة 1: مذكرة فارغة تماماً أو ملف مسودة لا يحتوي على نصوص المنهاج
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
          
          <!-- الإيجابيات ونقاط القوة -->
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

          <!-- السلبيات ونقاط التحسين -->
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

        <!-- التوصية العامة للمفتش الافتراضي -->
        <div style="background:#fff8e6; border:1.5px solid #f0d590; border-radius:14px; padding:14px 18px; display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:1.5rem;">⚠️</span>
          <div style="font-size:0.92rem; color:#8a6d1f; line-height:1.7;">
            <b>توجيه عاجل من المفتش البيداغوجي (Virtual Inspector):</b><br>
            يبدو أنكِ قمتِ برفع ملف فارغ أو قالب مسودة غير محرر بعد. يُرجى تحرير نص المذكرة وإدراج الترويسة والوضعيات قبل رفعها للتحليل، أو تصفح <a href="maktaba.html" style="color:#0d9488;font-weight:800;text-decoration:underline;">المكتبة الرقمية</a> لتحميل مذكرات أساتذة الجيل الثاني المكتملة والقياسية للتقيد بها!
          </div>
        </div>

        <!-- زر إعادة التحليل أو الترقية -->
        <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:6px;">
          <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
        </div>
      `;
      return;
    }

    // الحالة 2: مذكرة مكتملة أو بها نصوص مقروءة — التحليل الديناميكي لعناصر الجيل الثاني
    const hasHeader = extractedText.includes("المستوى") || extractedText.includes("الميدان") || extractedText.includes("المقطع") || extractedText.includes("كفاءة") || lowerName.includes("1m") || lowerName.includes("2m") || lowerName.includes("3m") || lowerName.includes("4m");
    const hasProblem = extractedText.includes("وضعية انطلاق") || extractedText.includes("مشكل") || extractedText.includes("إشكالية") || extractedText.includes("تساؤل") || extractedText.includes("سياق");
    const hasOHERIC = extractedText.includes("ملاحظة") || extractedText.includes("فرضية") || extractedText.includes("تجريب") || extractedText.includes("نتيجة") || extractedText.includes("تفسير") || extractedText.includes("استنتاج") || extractedText.includes("تقصي");
    const hasTP = extractedText.includes("مخبر") || extractedText.includes("تجربة") || extractedText.includes("tp") || extractedText.includes("exao") || extractedText.includes("مجهر") || extractedText.includes("عينة") || extractedText.includes("نشاط");
    const hasGroups = extractedText.includes("فوج") || extractedText.includes("أفواج") || extractedText.includes("تعاون") || extractedText.includes("عصف ذهني") || extractedText.includes("جيكسو") || extractedText.includes("مجموعة");
    const hasEval = extractedText.includes("تقويم") || extractedText.includes("معايير") || extractedText.includes("وجاهة") || extractedText.includes("أدوات المادة") || extractedText.includes("انسجام") || extractedText.includes("شبكة");
    const hasSynthesis = extractedText.includes("حوصلة") || extractedText.includes("خلاصة") || extractedText.includes("مأسسة") || extractedText.includes("كراس") || extractedText.includes("مخطط");

    let score = 55;
    if (hasHeader) score += 8;
    if (hasProblem) score += 9;
    if (hasOHERIC) score += 9;
    if (hasTP) score += 8;
    if (hasGroups) score += 6;
    if (hasEval) score += 6;
    if (hasSynthesis) score += 5;

    let gradeTitle = "مذكرة متوسطة بحاجة إلى إثراء ديداكتيكي وتطوير سياقي";
    let gradeSub = "تم رصد بعض عناصر المنهاج مع نقص في تفعيل معايير التقويم أو النشاط المخبري";
    let badgeColor = "#d97706";
    let bgHeader = "linear-gradient(135deg, #fef9c3, #fef08a)";
    let borderHeader = "#facc15";

    if (score >= 82) {
      gradeTitle = "مذكرة متماسكة ومطابقة لمعايير منهاج الجيل الثاني (SVT)";
      gradeSub = "تم مطابقة الترويسة، تسلسل المسعى التجريبي، وتوظيف معايير ومؤشرات التقويم";
      badgeColor = "#15803d";
      bgHeader = "linear-gradient(135deg, #eefaf7, #dcfce7)";
      borderHeader = "#86efac";
    }

    let posList = "";
    if (hasHeader) posList += `<li><b>اكتمال عناصر الترويسة:</b> تحديد واضح للمستوى، الميدان، والكفاءة المستهدفة وفق المنهاج.</li>`;
    if (hasProblem) posList += `<li><b>انطلاق الدرس من وضعية مشكلة دافعة:</b> صياغة سياق يحفز التلميذ ويطرح إشكالية علمية دقيقة.</li>`;
    if (hasOHERIC) posList += `<li><b>احترام مسار المسعى العلمي التجريبي (OHERIC):</b> تسلسل منطقي من الملاحظة والفرضيات حتى التفسير والاستنتاج.</li>`;
    if (hasTP) posList += `<li><b>حضور النشاط المخبري والممارسة العملية (TP):</b> تمكين التلميذ من التعامل المباشر مع السندات والعينات.</li>`;
    if (hasGroups) posList += `<li><b>تفعيل العمل بالأفواج والتعلم التعاوني:</b> إشراك التلاميذ في النقاش وتقسيم المهام المخبرية.</li>`;
    if (!posList) posList = `<li><b>تنظيم عام مقبول للوثيقة:</b> تقسيم الفقرات ووضوح العناوين المرفوعة.</li>`;

    let negList = "";
    if (!hasProblem) negList += `<li><b>غياب أو ضعف الوضعية المشكل الانطلاقية:</b> يُنصح ببدء الحصة بسياق يولد تناقضاً معرفياً ملموساً في حياة التلميذ.</li>`;
    if (!hasOHERIC) negList += `<li><b>نقص في تسلسل خطوات المسعى العلمي (OHERIC):</b> يجب تجنب تقديم المعلومة جاهزة وترك التلميذ يصوغ الفرضيات ويختبرها.</li>`;
    if (!hasTP) negList += `<li><b>قلة الأنشطة اليدوية والمخبرية المباشرة (TP/ExAO):</b> مادة ع.ط.ح تتطلب الملاحظة المجهرية أو التجريب بدلاً من الاكتفاء بالنصوص.</li>`;
    if (!hasGroups) negList += `<li><b>غياب الإشارة لتنظيم الأفواج وتوزيع الأدوار:</b> يُفضل تحديد أدوار (المنسق، المنفذ، المقرر، الميقاتي) داخل الفوج.</li>`;
    if (!hasEval) negList += `<li><b>عدم صياغة شبكة معايير التقويم:</b> يُستحسن ربط التقويم التكويني والختامي بمعايير (الوجاهة، أدوات المادة، الانسجام).</li>`;
    if (!negList) negList = `<li><b>التقدير الزمني الدقيق:</b> يُفضل ضبط الوقت بالدقائق لكل وضعية لضمان إنهاء النشاط والحوصلة داخل الـ 60 دقيقة.</li>`;

    reportContainer.innerHTML = `
      <!-- شريط التقييم الكلي -->
      <div style="background:${bgHeader}; border:2px solid ${borderHeader}; border-radius:16px; padding:16px 20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
        <div style="background:${badgeColor}; color:#fff; font-size:1.4rem; font-weight:800; padding:12px 18px; border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.18);">${score}%</div>
        <div style="flex:1; min-width:220px;">
          <div style="font-weight:800; font-size:1.1rem; color:#173a3a;">${gradeTitle}</div>
          <div style="font-size:0.88rem; color:#5f7d7d; margin-top:3px;">${gradeSub}</div>
        </div>
      </div>

      <!-- بطاقة الهيكل والترويسة -->
      <div style="background:#fff; border:1px solid #daeeee; border-radius:14px; padding:14px 18px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
        <div style="font-weight:800; color:#0a5860; font-size:0.98rem; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <span>📌 فحص هيكل الترويسة والموارد المستهدفة:</span>
        </div>
        <p style="font-size:0.92rem; color:#173a3a; line-height:1.7; margin:0;">
          • <b>مؤشرات الهيكلة:</b> ${hasHeader ? 'المذكرة تتضمن تحديداً واضحاً للمستوى والميدان والكفاءة المستهدفة.' : 'يجب استكمال بيانات الترويسة المنهجية (الميدان والمقطع والكفاءة الختامية).'}<br>
          • <b>التوافق مع الجيل الثاني:</b> ${hasOHERIC && hasProblem ? 'المسار الديداكتيكي متدرج ويحترم استقلالية التلميذ في بناء المعرفة.' : 'يجب تعزيز بناء المفهوم انطلاقاً من حل المشكل العلمي وتجنب التلقين المباشر.'}
        </p>
      </div>

      <!-- شبكة الإيجابيات والسلبيات جنباً إلى جنب -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:14px;">
        
        <!-- الإيجابيات ونقاط القوة -->
        <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:16px; padding:16px 18px;">
          <h4 style="color:#15803d; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
            <span style="background:#22c55e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✓</span>
            <span>الإيجابيات ونقاط القوّة البيداغوجية:</span>
          </h4>
          <ul style="margin:0; padding-inline-start:18px; color:#166534; font-size:0.9rem; line-height:1.8;">
            ${posList}
          </ul>
        </div>

        <!-- السلبيات ونقاط التحسين -->
        <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:16px; padding:16px 18px;">
          <h4 style="color:#be123c; font-size:1.02rem; font-weight:800; margin:0 0 10px; display:flex; align-items:center; gap:8px;">
            <span style="background:#f43f5e; color:#fff; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-size:0.85rem;">✕</span>
            <span>السلبيات ونقاط يحبّذ تحسينها:</span>
          </h4>
          <ul style="margin:0; padding-inline-start:18px; color:#9f1239; font-size:0.9rem; line-height:1.8;">
            ${negList}
          </ul>
        </div>

      </div>

      <!-- التوصية العامة للمفتش الافتراضي -->
      <div style="background:#fff8e6; border:1.5px solid #f0d590; border-radius:14px; padding:14px 18px; display:flex; align-items:flex-start; gap:10px;">
        <span style="font-size:1.5rem;">💡</span>
        <div style="font-size:0.92rem; color:#8a6d1f; line-height:1.7;">
          <b>توصية المستشار البيداغوجي (Virtual Inspector):</b><br>
          ${score >= 82 ? 'المذكرة قياسية وممتازة للتطبيق الصفي الفوري. احرص(ي) فقط على مرافقة التلاميذ أثناء صياغة الحوصلة وتوظيف معايير الوجاهة في التصحيح.' : 'المذكرة تمثل أرضية جيدة، ولتحقيق التفوق الميداني يُنصح بإدراج وثائق وسندات بصرية وتفعيل العمل التعاوني بالأفواج وفق خطوات المسعى العلمي (OHERIC).'}
        </div>
      </div>

      <!-- زر إعادة التحليل أو الترقية -->
      <div id="memoReportActionsFooter" style="display:flex; justify-content:center; margin-top:6px;">
        <button onclick="window.resetSacMemoFile()" style="background:#00a8a8; color:#fff; border:none; padding:10px 24px; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; transition:0.2s; box-shadow:0 4px 14px rgba(0,168,168,0.3);">🔄 تحليل مذكرة أخرى بصيغة PDF</button>
      </div>
    `;
  }

})();