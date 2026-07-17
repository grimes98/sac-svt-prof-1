/* =========================================================================
   🤖 SAC · SVT prof Omniscient AI Assistant (Dual-Engine Hybrid AI + Advanced Inference)
   المساعد الذكي البيداغوجي المطور لأساتذة علوم الطبيعة والحياة للتعليم المتوسط
   ========================================================================= */

(function() {
  if (window._sacChatbotInitialized) return;
  window._sacChatbotInitialized = true;

  const SESS_KEY = 'sac_session';
  const ROLE_KEY = 'sac_role';
  const GUEST_COUNT_KEY = 'sac_guest_chat_count';
  const GUEST_LIMIT = 5;

  function isChatbotUserLogged() {
    const s = localStorage.getItem(SESS_KEY);
    const r = localStorage.getItem(ROLE_KEY);
    return Boolean(s || (r === 'user' || r === 'admin'));
  }

  function getGuestChatCount() {
    return parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10);
  }

  function setGuestChatCount(count) {
    localStorage.setItem(GUEST_COUNT_KEY, String(count));
  }

  // 1. حقن أنماط وعناصر المساعد الذكي
  function injectChatbotUI() {
    if (document.getElementById('sacChatWidget')) return;

    const style = document.createElement('style');
    style.innerHTML = `
      #sacChatWidget {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 999999;
        font-family: 'Tajawal', 'Amiri', sans-serif;
      }
      #sacChatIcon {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0d9488, #14b8a6);
        box-shadow: 0 8px 25px rgba(13, 148, 136, 0.5);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 3px solid #ffffff;
        position: relative;
      }
      #sacChatIcon:hover {
        transform: scale(1.08) rotate(-5deg);
        box-shadow: 0 12px 30px rgba(45, 212, 191, 0.7);
      }
      #sacChatIcon img {
        width: 42px;
        height: 42px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      }
      #sacChatIcon .badge-ai {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #facc15;
        color: #0f172a;
        font-size: 0.7rem;
        font-weight: 800;
        padding: 2px 6px;
        border-radius: 10px;
        border: 1.5px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      }
      #sacChatModal {
        display: none;
        position: fixed;
        bottom: 102px;
        left: 24px;
        width: 390px;
        max-width: calc(100vw - 48px);
        height: 560px;
        max-height: calc(100vh - 130px);
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        border: 2px solid #daeeee;
        flex-direction: column;
        overflow: hidden;
        z-index: 999999;
        animation: chatSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes chatSlideUp {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      #sacChatHeader {
        background: linear-gradient(135deg, #0d9488, #14b8a6);
        color: #ffffff;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #2dd4bf;
      }
      #sacChatHeader .title-box {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      #sacChatHeader .title-box img {
        width: 36px;
        height: 36px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      }
      #sacChatHeader h4 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 800;
        color: #ffffff;
      }
      #sacChatHeader span {
        font-size: 0.78rem;
        color: #e0f2fe;
        display: block;
      }
      #sacChatClose {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #ffffff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.2s;
      }
      #sacChatClose:hover {
        background: #ef4444;
        transform: rotate(90deg);
      }
      #sacChatMessages {
        flex: 1;
        padding: 18px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: #f8fafc;
        font-size: 0.94rem;
      }
      .msg-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #0d9488, #14b8a6);
        color: #ffffff !important;
        border-radius: 18px 18px 4px 18px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
        max-width: 86%;
        line-height: 1.65;
        font-weight: 600;
      }
      .msg-bot {
        align-self: flex-start;
        background: #ffffff;
        border: 1.5px solid #e2e8f0;
        border-radius: 18px 18px 18px 4px;
        padding: 16px 18px;
        color: #1e293b;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
        max-width: 92%;
        line-height: 1.85;
      }
      #sacChatFooter {
        padding: 14px;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #sacChatInputBox {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      #sacChatInput {
        flex: 1;
        padding: 12px 16px;
        border-radius: 14px;
        border: 1.5px solid #cbd5e1;
        font-size: 0.94rem;
        font-family: inherit;
        outline: none;
        transition: 0.2s;
        background: #ffffff;
        color: #1e293b;
      }
      #sacChatInput:focus {
        border-color: #0d9488;
        box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
      }
      #sacChatSendBtn {
        background: linear-gradient(135deg, #0d9488, #14b8a6);
        color: #ffffff;
        border: none;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: 0.2s;
        box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
      }
      #sacChatSendBtn:hover {
        transform: scale(1.05);
        background: #0f766e;
      }
      #sacChatQuotaNotice {
        font-size: 0.78rem;
        color: #64748b;
        text-align: center;
      }
      /* حماية ووضوح الألوان في الوضع الليلي الكوني (Cosmic Dark Mode overrides) */
      #sacDarkThemeStyles ~ #sacChatWidget #sacChatModal,
      body[style*="background: #0b111e"] #sacChatModal,
      html[style*="background: #0b111e"] #sacChatModal {
        background: #151f32 !important;
        border-color: #2dd4bf !important;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8) !important;
      }
      #sacDarkThemeStyles ~ #sacChatWidget #sacChatMessages,
      body[style*="background: #0b111e"] #sacChatMessages,
      html[style*="background: #0b111e"] #sacChatMessages {
        background: #0b111e !important;
      }
      #sacDarkThemeStyles ~ #sacChatWidget .msg-bot,
      body[style*="background: #0b111e"] .msg-bot,
      html[style*="background: #0b111e"] .msg-bot {
        background: #1e293b !important;
        color: #f8fafc !important;
        border-color: rgba(45, 212, 191, 0.3) !important;
      }
      #sacDarkThemeStyles ~ #sacChatWidget #sacChatFooter,
      body[style*="background: #0b111e"] #sacChatFooter,
      html[style*="background: #0b111e"] #sacChatFooter {
        background: #151f32 !important;
        border-color: rgba(45, 212, 191, 0.25) !important;
      }
      #sacDarkThemeStyles ~ #sacChatWidget #sacChatInput,
      body[style*="background: #0b111e"] #sacChatInput,
      html[style*="background: #0b111e"] #sacChatInput {
        background: #0f172a !important;
        color: #f8fafc !important;
        border-color: rgba(45, 212, 191, 0.4) !important;
      }
      #sacDarkThemeStyles ~ #sacChatWidget #sacChatQuotaNotice,
      body[style*="background: #0b111e"] #sacChatQuotaNotice,
      html[style*="background: #0b111e"] #sacChatQuotaNotice {
        color: #cbd5e1 !important;
      }
    `;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'sacChatWidget';
    widget.innerHTML = `
      <div id="sacChatIcon" onclick="sacOpenChat()" title="المساعد الذكي لأستاذ العلوم (SAC AI+)">
        <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="AI">
        <span class="badge-ai">+AI</span>
      </div>

      <div id="sacChatModal">
        <div id="sacChatHeader">
          <div class="title-box">
            <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="SAC">
            <div>
              <h4>المساعد الذكي لعلوم الطبيعة</h4>
              <span>SAC AI+ · الجيل الثاني (SVT المتوسط)</span>
            </div>
          </div>
          <button id="sacChatClose" onclick="sacCloseChat()" title="إغلاق النافذة">✕</button>
        </div>

        <div id="sacChatMessages">
          <div class="msg-bot">
            <b>👋 أهلاً بك أستاذنا الفاضل في فضاء الذكاء الاصطناعي SAC AI+!</b><br><br>
            أنا مساعدك البيداغوجي والعلمي المتخصص في منهاج <b>علوم الطبيعة والحياة (SVT)</b> للتعليم المتوسط في الجزائر.<br>
            اسألني عن: إعداد المذكرات، الوضعيات المشكلة، المسعى العلمي، أو التفسير الدقيق لأي ظاهرة بيولوجية وجيولوجية.
          </div>
        </div>

        <div id="sacChatFooter">
          <div id="sacChatInputBox">
            <input type="text" id="sacChatInput" placeholder="اكتب سؤالك العلمي أو البيداغوجي هنا..." onkeypress="if(event.key==='Enter') sacSendMessage()">
            <button id="sacChatSendBtn" onclick="sacSendMessage()" title="إرسال">🚀</button>
          </div>
          <div id="sacChatQuotaNotice"></div>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    updateChatbotQuotaUI();
  }

  function updateChatbotQuotaUI() {
    const notice = document.getElementById('sacChatQuotaNotice');
    const input = document.getElementById('sacChatInput');
    const btn = document.getElementById('sacChatSendBtn');
    if (!notice || !input || !btn) return;

    if (isChatbotUserLogged()) {
      notice.innerHTML = `<span style="color:#10b981; font-weight:700;">👑 عضوية نشطة: أسئلة واستشارات غير محدودة (∞)</span>`;
      input.disabled = false;
      btn.disabled = false;
      input.placeholder = "اكتب سؤالك العلمي أو البيداغوجي هنا...";
    } else {
      const count = getGuestChatCount();
      const left = Math.max(0, GUEST_LIMIT - count);
      if (left > 0) {
        notice.innerHTML = `💬 وضع الزائر: لديك <b>${left} من أصل ${GUEST_LIMIT}</b> أسئلة مجانية. <a href="login.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">سجل دخولك لفتح ∞</a>`;
        input.disabled = false;
        btn.disabled = false;
      } else {
        notice.innerHTML = `<span style="color:#ef4444; font-weight:800;">🔒 انتهت المحاولات المجانية (5/5)</span> — <a href="login.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">سجل دخولك للوصول غير المحدود ✨</a>`;
        input.disabled = true;
        btn.disabled = true;
        input.placeholder = "سجل دخولك لمتابعة الاستشارة الذكية...";
      }
    }
  }

  function showQuotaReachedMessage() {
    const history = document.getElementById('sacChatMessages');
    if (!history) return;
    history.innerHTML += `
      <div class="msg-bot" style="border-color:#f59e0b; background:#fef3c7; color:#92400e;">
        <b>⚠️ انتهت المحاولات المجانية للزوار (5/5 أسئلة):</b><br><br>
        أستاذنا الكريم، لضمان جودة وسرعة الخدمة، يحصل الزوار على 5 تحليلات مجانية.<br>
        <b>لتفعيل المساعد الذكي بلا حدود (∞) واسترجاع سجل استشاراتك كاملة، يرجى تسجيل الدخول بحساب الأستاذ.</b><br><br>
        <a href="login.html" style="display:inline-block; padding:8px 18px; background:linear-gradient(135deg,#0d9488,#14b8a6); color:#fff; border-radius:10px; font-weight:800; text-decoration:none;">تسجيل الدخول الآن ←</a>
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    updateChatbotQuotaUI();
  }

  window.sacOpenChat = function() {
    const modal = document.getElementById('sacChatModal');
    if (modal) {
      modal.style.display = 'flex';
      const input = document.getElementById('sacChatInput');
      if (input && !input.disabled) input.focus();
    }
  };

  window.sacCloseChat = function() {
    const modal = document.getElementById('sacChatModal');
    if (modal) modal.style.display = 'none';
  };

  window.sacSendMessage = async function() {
    const input = document.getElementById('sacChatInput');
    const history = document.getElementById('sacChatMessages');
    if (!input || !history) return;

    const text = input.value.trim();
    if (!text) return;

    if (!isChatbotUserLogged()) {
      const cnt = getGuestChatCount();
      if (cnt >= GUEST_LIMIT) {
        showQuotaReachedMessage();
        return;
      }
      setGuestChatCount(cnt + 1);
      updateChatbotQuotaUI();
    }

    history.innerHTML += `
      <div class="msg-user">
        ${escapeHtmlChat(text)}
      </div>
    `;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    const loadingId = 'sacLoading_' + Date.now();
    history.innerHTML += `
      <div id="${loadingId}" class="msg-bot" style="color:#64748b;">
        ⏳ يقوم المساعد الذكي بالبحث والتحليل البيداغوجي الدقيق لسؤالك...
      </div>
    `;
    history.scrollTop = history.scrollHeight;

    const aiReply = await queryRealAIOrInferenceEngine(text);
    const loadEl = document.getElementById(loadingId);
    if (loadEl) {
      loadEl.outerHTML = `
        <div class="msg-bot">
          ${aiReply}
        </div>
      `;
    } else {
      history.innerHTML += `
        <div class="msg-bot">
          ${aiReply}
        </div>
      `;
    }
    history.scrollTop = history.scrollHeight;
    updateChatbotQuotaUI();

    if (!isChatbotUserLogged() && getGuestChatCount() >= GUEST_LIMIT) {
      setTimeout(showQuotaReachedMessage, 600);
    }
  };

  function escapeHtmlChat(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // محرك الذكاء الاصطناعي الهجين الدقيق والمباشر
  async function queryRealAIOrInferenceEngine(q) {
    // 1. أولاً: التحقق من قاعدة المعرفة المحلية المباشرة (لتقديم إجابة فورية ونظيفة 100%)
    const quickReply = checkInstantCurriculumDatabase(q);
    if (quickReply) return quickReply;

    // 2. ثانياً: الاتصال السحابي الهجين المطور (سريع ودقيق ومباشر)
    try {
      const systemPrompt = `أنت خبير بيداغوجي وعالم أحياء وجيولوجيا متخصص في منهاج علوم الطبيعة والحياة (SVT) للتعليم المتوسط في الجزائر (الجيل الثاني).
أجب عن سؤال الأستاذ التالي باللغة العربية الفصحى الواضحة والمبسطة وبدقة علمية وديدكتيكية متناهية.
تنبيهات هامة جداً للتنسيق:
1. تجنب تماماً كتابة الرموز الرياضية المعقدة أو رموز اللاتك ($O_2$ أو $ATP$ أو $pH$) واكتبها بصيغة نصية واضحة ومباشرة (O₂، ATP، pH).
2. اجعل الإجابة مباشرة، منظمة في نقاط محددة (استخدم • أو 1️⃣ 2️⃣ 3️⃣)، وتجنب الحشو أو الكلام المكرر.
3. لا تكتب رموز ماركدوان خام مثل # أو ### في الإجابة واجعلها نصوصاً واضحة.
سؤال الأستاذ هو: ${q}`;
      
      if (window.location.protocol !== 'file:') {
        try {
          const proxyReq = await Promise.race([
            fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q, systemPrompt: systemPrompt })
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Proxy timeout')), 3500))
          ]);
          if (proxyReq && proxyReq.ok) {
            const proxyData = await proxyReq.json();
            if (proxyData && proxyData.reply && proxyData.reply.trim().length > 15) {
              return `<b>🤖 إجابة المساعد الذكي المطور (SAC AI+ · ${proxyData.source.includes('arena') ? 'Arena Multi-Model' : 'Cloud'}):</b><br><br>` + formatAIResponseToHtml(proxyData.reply.trim());
            }
          }
        } catch(eProxy) {}
      }

      const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}`;
      const fetchPromise = fetch(apiUrl, { method: 'GET' }).then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.text();
      });

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 3600));
      const aiText = await Promise.race([fetchPromise, timeoutPromise]);
      if (aiText && aiText.trim().length > 20) {
        return `<b>🤖 إجابة الذكاء الاصطناعي المطور (SAC AI+):</b><br><br>` + formatAIResponseToHtml(aiText.trim());
      }
    } catch(err) {}

    // 3. ثالثاً: محرك الاستنتاج العلمي المباشر (20 موضوع منهاجي)
    return generateSmartScientificInference(q);
  }

  // تنسيق نصوص الـ AI بدقة عالية وتحويل الماركدوان واللاتك إلى HTML نظيف ومباشر
  function formatAIResponseToHtml(text) {
    let formatted = text.replace(/\\n/g, '\n').trim();
    formatted = formatted.replace(/\$([^\$]+)\$/g, '$1');
    formatted = formatted.replace(/`([^`]+)`/g, '<b>$1</b>');
    formatted = formatted.replace(/^###\s*(.+)$/gm, '<div style="color:#0d9488;font-weight:800;font-size:1.08rem;margin-top:12px;margin-bottom:6px;">$1</div>');
    formatted = formatted.replace(/^##\s*(.+)$/gm, '<div style="color:#0d9488;font-weight:800;font-size:1.12rem;margin-top:14px;margin-bottom:8px;">$1</div>');
    formatted = formatted.replace(/^#\s*(.+)$/gm, '<div style="color:#0d9488;font-weight:800;font-size:1.15rem;margin-top:14px;margin-bottom:8px;">$1</div>');
    formatted = formatted.replace(/^[\s]*[-*•]\s+(.+)$/gm, '<div style="margin-inline-start:12px;margin-bottom:6px;line-height:1.75;">• $1</div>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b style="color:#0d9488;">$1</b>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<b>$1</b>');
    formatted = formatted.replace(/\n\n/g, '<br><br>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  // محرك التحليل والاستنتاج العلمي المباشر لأسئلة المنهج الجزائري
  function generateSmartScientificInference(q) {
    const query = q.toLowerCase().trim();

    // 1. التحليل المباشر للكلمات المفتاحية من موسوعة المنهج (أكثر من 50 موضوع)
    const instantReply = checkInstantCurriculumDatabase(q);
    if (instantReply) return instantReply;

    // 2. التحليل الذكي التكيّفي للأسئلة المخصصة والنادرة (Smart Adaptive Diagnostic Inference)
    let domain = "مفهوم علمي وديداكتيكي في علوم الطبيعة والحياة";
    let advice = `• <b>التوصية البيداغوجية الميدانية:</b> لمعالجة هذا السؤال مع تلاميذ التعليم المتوسط بنجاح، يُنصح ببناء <b>وضعية استقصائية دافعة</b> تنطلق من تناقض ملموس في حياة التلميذ اليومية، ثم توجيه الأفواج المخبرية لاستغلال الوثائق والسندات للوصول إلى التفسير السليم وفق المسعى العلمي (OHERIC).`;

    if (query.includes("كيف") || query.includes("خطوات") || query.includes("طريقة") || query.includes("استراتيجية")) {
      domain = "الطرائق والاستراتيجيات الديداكتيكية الميدانية";
      advice = `• <b>الخطوات الإجرائية المقترحة:</b><br>
        1️⃣ <i>التحضير والتخطيط:</i> تحديد الكفاءة الختامية بدقة واختيار السندات الملائمة لأنماط المتعلمين (بصري، سمعي، حركي).<br>
        2️⃣ <i>التنشيط الصفي:</i> تقسيم القسم إلى أفواج تعاونية مع تحديد أدوار واضحة (المنسق، المنفذ العملي، المقرر، الميقاتي).<br>
        3️⃣ <i>التقويم الفوري:</i> مراقبة عمل الأفواج وتدخل الأستاذ كـ "ميسّر وموجه" وتصحيح التصورات الخاطئة أثناء الممارسة.`;
    } else if (query.includes("تقويم") || query.includes("معايير") || query.includes("تصحيح") || query.includes("نقاط") || query.includes("علامة")) {
      domain = "التقويم البيداغوجي وشبكات القياس والتحليل";
      advice = `• <b>تطبيق شبكة معايير الجيل الثاني:</b> يُشترط تقييم إجابة التلميذ بناءً على 4 معايير موضوعية:<br>
        - <b>الوجاهة (Pertinence):</b> الرد في صميم المطلوب وبناءً على التعليمة (تخصيص 3/4 العلامة للمعاايير الثلاثة الأولى).<br>
        - <b>الاستعمال السليم لأدوات المادة:</b> توظف المصطلحات وقراءة الأرقام الدقيقة من الوثيقة.<br>
        - <b>الانسجام (Cohérence):</b> تسلسل الأفكار منطقياً دون تناقض.<br>
        - <b>الإتقان (Perfection):</b> تنظيم الورقة ونظافتها (1/4 العلامة).`;
    } else if (query.includes("مشكل") || query.includes("صعوبة") || query.includes("تعثر") || query.includes("شغب") || query.includes("تلاميذ")) {
      domain = "إدارة القسم والمعالجة البيداغوجية الميدانية";
      advice = `• <b>استراتيجية التدخل والتصحيح:</b> إن ظهور الصعوبات أو الشغب الصفي غالباً ما ينتج عن غياب الدافعية أو تكرار الدروس النظرية الصامتة. يُنصح بإشراك التلاميذ المتعثرين والمفرطين في الحركة في <b>مهام يدوية ومخبرية مباشرة (TP)</b> وتوظيف البيداغوجيا الفارقية لإعطاء كل تلميذ مهمة تناسب نمط تعلمه.`;
    }

    return `
      <b>🤖 التحليل الاستشاري البيداغوجي المباشر (SAC Omniscient AI):</b><br>
      «<b style="color:#0d9488;">${escapeHtmlChat(q)}</b>»<br><br>
      • <b>المجال المصنف:</b> <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-weight:800;">${domain}</span><br><br>
      ${advice}<br><br>
      💡 <b>للوصول المباشر إلى المذكرات، السندات، والوثائق الرسمية الخاصة بموضوع سؤالك:</b><br>
      • <a href="maktaba.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">📚 المكتبة الرقمية (مذكرات الأساتذة الجاهزة للتحميل المباشر)</a><br>
      • <a href="qamous.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">🔬 القاموس العلمي (شرح المفاهيم البيولوجية والجيولوجية ثلاثي اللغات)</a><br>
      • <a href="mokhbar.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">🧪 دليل المخبر والتجارب (بروتوكولات الأعمال المخبرية ومحاكاة PhET)</a><br>
      • <a href="takwin.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">🎓 التكوين البيداغوجي الشامل (12 وحدة تكوينية للأساتذة والمتربصين)</a>
    `;
  }

  function checkInstantCurriculumDatabase(q) {
    const query = q.toLowerCase().trim();

    // ==========================================
    // المحور 1: التكوين والديداكتيك وتسيير القسم
    // ==========================================
    if (query.includes('مذكرة') || query.includes('تخطيط') || query.includes('addie') || query.includes('تحضير درس')) {
      return `
        <b>📑 صياغة المذكرة البيداغوجية وتخطيط الدرس في الجيل الثاني:</b><br>
        تُعد المذكرة البيداغوجية خريطة الطريق الميدانية للأستاذ، وتتكون هيكلتها الرسمية في منهاج علوم الطبيعة والحياة من العناصر الآتية:<br>
        1️⃣ <b>الترويسة الإدارية والبيداغوجية:</b> تحديد المستوى، الميدان، المقطع التعلّمي، الحصة، الكفاءة الختامية المستهدفة، والكفاءات العرضية والقيم.<br>
        2️⃣ <b>الموارد المعرفية والمنهجية:</b> تحديد المعارف العلمية والمهارات التي سيكتسبها التلميذ في الحصة.<br>
        3️⃣ <b>سيرورة الحصة البيداغوجية (OHERIC):</b><br>
           • <i>وضعية الانطلاق (10 د):</i> وضع التلميذ أمام سياق مشكل يولد تناقضاً معرفياً ويدفعه لصياغة الإشكالية.<br>
           • <i>مرحلة التقصي والنشاط المخبري (35 د):</i> عمل الأفواج لاستغلال السندات وإنجاز التجارب المخبرية أو المحاكاة.<br>
           • <i>مرحلة الهيكلة والتقويم (15 د):</i> صياغة الحوصلة وبناء المفهوم العلمي في الكراس مع تقويم تكويني سريع.
      `;
    }

    if (query.includes('وضعية انطلاقية') || query.includes('وضعية مشكل') || query.includes('وضعية ادماجية') || query.includes('إدماجية') || query.includes('ادماجية')) {
      return `
        <b>🎯 الفرق المنهجي بين الوضعية المشكل والوضعية الإدماجية (الديداكتيك):</b><br>
        • <b>الوضعية المشكل الانطلاقية (Situation Problème):</b> تُطرح في <b>بداية الدرس أو المقطع</b> لتوليد حاجة معرفية عند التلميذ. تتميز بسياق محفز يحتوي على عائق أو تناقض منطقي يدفع التلميذ لطرح التساؤل والفرضيات.<br>
        • <b>الوضعية الإدماجية التقويمية (Situation d'Intégration):</b> تُطرح في <b>نهاية المقطع أو الفصل</b> لتقييم مدى تملك التلميذ للكفاءة. تتكون وجوباً من 3 عناصر:<br>
          1️⃣ <i>السياق (Contexte):</i> وصف دقيق وموجز للمشكل المستوحى من الحياة الواقعية (مثل مرض أو تلوث).<br>
          2️⃣ <i>السندات (Supports):</i> 2 إلى 4 وثائق (جداول بيانية، صور مجهرية، نصوص علمية) تحمل معطيات الحل.<br>
          3️⃣ <i>التعليمات (Consignes):</i> 3 أسئلة دقيقة ومستقلة تبدأ بأفعال أداء واضحة (فسّر، حدّد، اقترح حلولاً).
      `;
    }

    if (query.includes('بيداغوجيا فارقية') || query.includes('فارقية') || query.includes('فروق فردية') || query.includes('تفريد')) {
      return `
        <b>🎯 البيداغوجيا الفارقية ومراعاة الفروق الفردية في قسم علوم الطبيعة والحياة:</b><br>
        البيداغوجيا الفارقية هي المقاربة التربوية التي تعترف بالفروق الفردية بين التلاميذ (في سرعة الفهم، أنماط الاستيعاب، والذكاءات المتعددة)، وتعمل على تنويع المسارات لبلوغ نفس الكفاءة الختامية عبر 3 أبعاد:<br>
        • <b>تنويع السندات والوسائل:</b> تقديم الوثيقة العلمية في آن واحد كـ (مخطط مرئي للبصري، شرح شفهي ونقاش للسمعي، وعينة مخبرية ملموسة للحركي).<br>
        • <b>تنويع تنظيم الأفواج:</b> دمج تلاميذ ذوي مستويات وأنماط مختلفة داخل نفس الفوج المخبري ليتبادلوا الأدوار والخبرات.<br>
        • <b>تنويع المهام والمعالجة:</b> إعطاء أنشطة داعمة ومبسطة للمتعثرين، وأنشطة إثرائية واستقصائية عليا للمتفوقين.
      `;
    }

    if (query.includes('أنماط التعلم') || query.includes('انماط') || query.includes('بصري') || query.includes('سمعي') || query.includes('حركي') || query.includes('vak')) {
      return `
        <b>🧠 أنماط المتعلمين (VAK Model) واستراتيجيات التعامل معها في ع.ط.ح:</b><br>
        يصنف نموذج فليمنغ (VAK) التلاميذ حسب الحاسة الأكثر سيطرة عند اكتساب المفاهيم العلمية:<br>
        1️⃣ <b>المتعلم البصري (Visual — 65%):</b> يفهم بالصور والمخططات والتنظيم الهيكلي للسبورة بالألوان الأربعة (أسود، أزرق، أحمر، أخضر). يُنصح معه بالخرائط المفاهيمية والمحاكاة الرقمية 3D.<br>
        2️⃣ <b>المتعلم السمعي (Auditory — 20%):</b> يكتسب بالحوار والمناقشة ونبرة الصوت. يُنصح معه بالحوار الصقراطي الموجه، التلخيص الشفوي الجماعي، والعصف الذهني.<br>
        3️⃣ <b>المتعلم الحسّي الحركي (Kinesthetic — 15%):</b> يتعلم بأصابعه وحركته والممارسة اليدوية والمجهر. يُنصح معه بالتجريب المخبري المباشر (TP)، التشريح، وبناء المجسمات العلمية ثلاثية الأبعاد.
      `;
    }

    if (query.includes('عصف ذهني') || query.includes('زوبعة') || query.includes('جيكسو') || query.includes('jigsaw') || query.includes('صف معكوس') || query.includes('مشاريع') || query.includes('خريطة مفاهيمية')) {
      return `
        <b>🎯 استراتيجيات التدريس النشط الحديثة وخطوات تطبيقها في حصص ع.ط.ح:</b><br>
        • <b>العصف الذهني (Brainstorming):</b> استمطار أكبر عدد من الأفكار والفرضيات التفسيرية عند انطلاق الحصة، وفق 4 قواعد: (تأجيل النقد والسخرية، التركيز على الكم، البناء على أفكار الزملاء، والفرز والتصنيف العلمي في النهاية).<br>
        • <b>استراتيجية جيكسو (Jigsaw / قطع الأحجية):</b> لتدريس الدروس المركبة عبر تشكيل (أفواج أصلية) وتوزيع المهام (أ، ب، ج، د)، ثم تشكيل (أفواج الخبراء) ليتدارس كل تخصص جزئيته، ثم العودة للأفواج الأصلية ليشرح كل خبير لزملائه ما تعلمه.<br>
        • <b>الصف المعكوس (Flipped Classroom):</b> إرسال شرح نظري قصير (فيديو/منصة) للتلميذ في المنزل قبل الحصة، لتحرير كامل وقت المخبر (60 دقيقة) للتجريب العملي (TP) وحل الوضعيات المشكل.
      `;
    }

    if (query.includes('مسعى علمي') || query.includes('مراحل المسعى') || query.includes('oheric') || query.includes('استقصاء') || query.includes('تقصي')) {
      return `
        <b>🔬 المسعى العلمي التجريبي (OHERIC) واستراتيجية التقصي في علوم الطبيعة والحياة:</b><br>
        هو الطريقة العلمية الدقيقة لبناء المفهوم عند التلميذ، ويمر بالخطوات الست الشهيرة:<br>
        1️⃣ <b>O — الملاحظة (Observation):</b> التقاط الظاهرة أو دراسة الوثيقة لإبراز التناقض وصياغة السؤال العلمي المشكل.<br>
        2️⃣ <b>H — الفرضية (Hypothèse):</b> صياغة تفسير أولي مؤقت ومنطقي يجيب عن المشكل المطروح.<br>
        3️⃣ <b>E — التجريب (Expérimentation):</b> إنجاز بروتوكول تجريبي مخبري (TP) أو النمذجة لاختبار صحة الفرضية.<br>
        4️⃣ <b>R — النتيجة (Résultat):</b> تسجيل القياسات والملاحظات في جدول أو منحنى بياني بموضوعية تامة.<br>
        5️⃣ <b>I — التفسير (Interprétation):</b> ربط النتيجة بالأسباب العلمية الحقيقية والمصادقة على الفرضية الصحيحة.<br>
        6️⃣ <b>C — الاستنتاج (Conclusion):</b> بناء الخلاصة والمفهوم العلمي المكتسب وتدوينه في الكراس.
      `;
    }

    if (query.includes('إدارة القسم') || query.includes('ادارة القسم') || query.includes('شغب') || query.includes('انضباط') || query.includes('إدارة صفية') || query.includes('اتصال تربوي')) {
      return `
        <b>🏛️ الإدارة الصفية ومواجهة مشكلات الشغب والاتصال التربوي الفعال:</b><br>
        • <b>الوقاية المسبقة من الشغب:</b> الشغب غالباً تذمر من الملل أو غياب النشاط؛ الحل هو التحضير البيداغوجي الممتاز وإشغال جميع التلاميذ بمهام مخبرية وتوزيع الأدوار (المنسق، المنفذ، المقرر، الميقاتي).<br>
        • <b>التدخل العلاجي الهادئ:</b> استخدام الإشارات غير اللفظية (التواصل البصري الحازم، الاقتراب الجسدي من التلميذ الشارد)، والتنبيه الفردي بعد الحصة دون إهانة أمام الأقران.<br>
        • <b>أركان الاتصال التربوي الفعال:</b> (المرسل: الأستاذ/التلميذ ← الرسالة العلمية الواضحة ← القناة/الوسيط: الصوت أو جهاز العرض TICE ← المستقبل ← <b>التغذية الراجعة Feedback</b> لتأكيد الفهم وتصحيح المسار).
      `;
    }

    if (query.includes('تقويم') || query.includes('معايير') || query.includes('وجاهة') || query.includes('معالجة بيداغوجية') || query.includes('بيداغوجيا الخطأ')) {
      return `
        <b>📊 التقويم والمعالجة البيداغوجية وشبكة معايير الجيل الثاني:</b><br>
        • <b>أنواع التقويم:</b> (القياس: التقدير الكمي بالدرجات) vs (التقييم: الحكم على المستوى) vs (<b>التقويم: القرار العلاجي وتصحيح الأخطاء</b> وهو تشخيصي في البداية، تكويني أثناء الدرس، وختامي في النهاية).<br>
        • <b>شبكة معايير تصحيح الوضعية الإدماجية (4 معايير):</b><br>
          1️⃣ <i>الوجاهة (Pertinence):</i> الإجابة في صميم المطلوب واحترام التعليمة.<br>
          2️⃣ <i>الاستعمال السليم لأدوات المادة:</i> استخراج الأرقام والدلائل من السندات وتوظيف المصطلحات العلمية.<br>
          3️⃣ <i>الانسجام (Cohérence):</i> تسلسل الأفكار منطقياً دون تناقض (يُخصص 3/4 العلامة للمعايير الثلاثة الأولى).<br>
          4️⃣ <i>الإتقان (Perfection):</i> نظافة الورقة وتنظيم البيانات (يُخصص 1/4 العلامة).<br>
        • <b>المعالجة البيداغوجية وبيداغوجيا الخطأ:</b> اعتبار الخطأ عائقاً معرفياً طبيعياً ونقطة انطلاق لإعادة البناء، وتخصيص حصص دعم دقيقة للمتعثرين دون توبيخ.
      `;
    }

    if (query.includes('مثلث ديداكتيكي') || query.includes('نقل ديداكتيكي') || query.includes('تصورات') || query.includes('أخطاء شائعة')) {
      return `
        <b>📐 المثلث الديداكتيكي والنقل التحويلي للمعرفة والتصورات المسبقة:</b><br>
        • <b>أقطاب المثلث الديداكتيكي:</b> يربط بين 3 أقطاب (<b>الأستاذ</b> و<b>التلميذ</b> و<b>المعرفة العلمية</b>). العقد الديداكتيكي يحدد حقوق وواجبات كل طرف أثناء الحصة.<br>
        • <b>النقل أو التحويل الديداكتيكي (Transposition Didactique):</b> هو تحويل المعرفة العالمة الأكاديمية الخام (Savoir Savant) إلى معرفة معدة للتدريس (Savoir à Enseigner) ثم إلى معرفة ملقنة ومكتسبة عند التلميذ (Savoir Enseigné)، مع مراعاة قدرات الفئة العمرية والمنهاج.<br>
        • <b>تصحيح التصورات المسبقة:</b> رصد أخطاء التلاميذ (التمثل والتصور) وإحداث صراع سوسيو-معرفي يفكك التصور القديم الخاطئ ويبني المفهوم العلمي السليم.
      `;
    }

    if (query.includes('تشريع') || query.includes('قانون توجيهي') || query.includes('رتب') || query.includes('ترقية') || query.includes('مجالس') || query.includes('مجلس التعليم') || query.includes('مجلس القسم') || query.includes('مجلس التأديب') || query.includes('عقوبات') || query.includes('سر مهني')) {
      return `
        <b>📜 التشريع المدرسي الجزائري وأخلاقيات المهنة ورتب الأساتذة:</b><br>
        • <b>المرجعية القانونية:</b> القانون التوجيهي للتربية <b>08-04</b> والأمر <b>06-03</b> المتضمن القانون الأساسي العام للوظيفة العمومية.<br>
        • <b>رتب ومسار أستاذ التعليم المتوسط (SVT):</b> (أستاذ التعليم المتوسط PEM ← أستاذ رئيسي PEMP ← أستاذ مكون PEMF ← الأستاذ المميز).<br>
        • <b>المجالس المدرسية الرسمية:</b><br>
          - <i>مجلس التعليم:</i> يجمع أساتذة المادة لمناقشة التنسيق البيداغوجي والوسائل.<br>
          - <i>مجلس القسم:</i> يناقش نتائج وسلوكيات تلاميذ القسم في نهاية كل فصل.<br>
          - <i>مجلس التأديب:</i> للنظر في المخالفات الجسيمة وتطبيق العقوبات وفق 4 درجات (الإنذار ← التوبيخ ← النقل ← الفصل مع حفظ حق الدفاع).<br>
        • <b>أخلاقيات المهنة:</b> الالتزام بالسر المهني، الحياد والموضوعية، تجنب العنف الجسدي أو اللفظي، وحسن المعاملة مع الإدارة وأولياء التلاميذ.
      `;
    }

    // ==========================================
    // المحور 2: السنة الأولى متوسط (1م)
    // ==========================================
    if (query.includes('راتب غذائي') || query.includes('كواشف') || query.includes('نشاء') || query.includes('بروتين') || query.includes('سوء التغذية') || query.includes('كواشيوركور') || query.includes('إسقرابوط') || query.includes('اسقرابوط')) {
      return `
        <b>🍎 التغذية عند الإنسان والرواتب الغذائية والكواشف الكيميائية (1م):</b><br>
        • <b>تصنيف الأغذية حسب المصدر والتركيب:</b> أغذية عضوية (نباتية وحيوانية تحترق وتحتوي على الكربون C) وأغذية معدنية (ماء وأملاح لا تحترق). الأغذية البسيطة هي (الغلوسيدات، البروتينات، الدسم، الماء، الأملاح، والفيتامينات).<br>
        • <b>أهم الكواشف الكيميائية في المخبر:</b><br>
          - <i>النشاء:</i> يكشف عنه بـ <b>ماء اليود</b> ← ظهور لون <b>أزرق بنفسجي</b>.<br>
          - <i>السكريات البسيطة:</i> يكشف عنها بـ <b>محلول فهلينغ + تسخين</b> ← راسب <b>أحمر أجري</b>.<br>
          - <i>البروتين:</i> يكشف عنه بـ <b>حمض الآزوت</b> ← لون <b>أصفر</b>.<br>
          - <i>أملاح الكلورور:</i> يكشف عنها بـ <b>نترات الفضة</b> ← راسب أبيض يسوّد بالضوء.<br>
        • <b>الرواتب الغذائية:</b> كمية الغذاء اللازمة لتلبية حاجات الفرد خلال 24 ساعة (راتب النمو للطفل، راتب العمل للعامل، راتب الصيانة للبالغ المستريح).<br>
        • <b>أمراض سوء التغذية:</b> الكواشيوركور (نقص بروتين حيواني ← انتفاخ البطن)، الإسقرابوط (نقص فيتامين C ← نزيف اللثة)، وتضخم الغدة الدرقية (نقص اليود).
      `;
    }

    if (query.includes('تغذية نباتية') || query.includes('محلول معدني') || query.includes('نسغ ناقص') || query.includes('نسغ كامل') || query.includes('تركيب ضوئي') || query.includes('نتح') || query.includes('أوبار ماصة')) {
      return `
        <b>🌱 التغذية عند النبات الأخضر والتركيب الضوئي والنتح (1م):</b><br>
        • <b>الامتصاص الجذري:</b> يمتص النبات الأخضر المحلول المعدني (ماء + أملاح معدنية NPK مثل محلول كنوب) بواسطة <b>الأوبار الماصة</b> الموجودة في المنطقة الوبرية للجذر.<br>
        • <b>النسغ الناقص (الخام):</b> المحلول المعدني الممتص ينتقل باتجاه واحد تصاعدي عبر <b>الأوعية الخشبية</b> من الجذور نحو الأوراق.<br>
        • <b>التركيب الضوئي (Photosynthèse):</b> في وجود الضوء واليخضور (الكلوروفيل)، يمتص النبات غاز CO₂ عبر مسامات الأوراق ويركب المادة العضوية (نشا، سكر، بروتين) ويطرح غاز O₂.<br>
        • <b>النسغ الكامل (الجاهز):</b> نسغ ناقص + مادة عضوية مركبة، ينتقل في جميع الاتجاهات عبر <b>الأوعية اللحائية</b> لتغذية الخلايا وتخزين الفائض في الدرنات والثمار.<br>
        • <b>ظاهرة النتح:</b> طرح النبات لبخار الماء الزائد عبر المسامات، وهو المحرك الأساسي الذي يخلق قوة مص وشد لضمان صعود النسغ الناقص من الجذور.
      `;
    }

    if (query.includes('تنفس خلوي') || query.includes('تخمر كحولي') || query.includes('خميرة') || query.includes('مبادلات تنفسية')) {
      return `
        <b>🫁 التنفس والتخمر عند الكائنات الحية والمبادلات الغازية (1م):</b><br>
        • <b>المبادلات الغازية التنفسية عند الإنسان:</b> امتصاص غاز الأكسجين (O₂) وطرح غاز ثاني أكسيد الكربون (CO₂) وبخار الماء، وتتم على مستوى <b>الأسناخ الرئوية</b> ذات الجدار الرقيق والغني بالشعيرات الدموية.<br>
        • <b>التنفس الخلوي الهوائي:</b> هدم كلي للجلوكوز في وجود O₂ داخل الخلية لإنتاج طاقة كبيرة مع طرح CO₂ وبخار الماء.<br>
        • <b>التخمر الكحولي عند الخميرة (في غياب O₂):</b> هدم جزئي للجلوكوز في غياب الأكسجين لإنتاج طاقة قليلة ضرورية لنشاط الخميرة، مع انطلاق غاز CO₂ وتشكل كحول الإيثانول (أساس صناعة الخبز).
      `;
    }

    if (query.includes('إطراح') || query.includes('اطراح') || query.includes('بول') || query.includes('كلية') || query.includes('تعرق') || query.includes('عرق')) {
      return `
        <b>💧 الإطراح والجهاز البولي والجلدي عند الإنسان (1م):</b><br>
        • <b>مفهوم الإطراح:</b> هو تخلص العضوية من الفضلات السامة الناتجة عن نشاط الخلايا (البول والعرق) للحفاظ على ثبات توازن الدم وسوائل الجسم.<br>
        • <b>الجهاز البولي ودور الكلية:</b> الكليتان هما مصفاة الدم؛ تصفيان الدم من الفضلات الأزوتية السامة (المركب الأزوتي، البولة/اليوريا، وحمض البول) لطرحها على شكل <b>بول</b> عبر الحالبين والمثانة والإحليل.<br>
        • <b>التعرق (الغدد العرقية):</b> العرق هو بول مخفف تفرزه الغدد العرقية في الجلد للتخلص من الفضلات والمساعدة في تنظيم درجة حرارة الجسم.
      `;
    }

    if (query.includes('تكاثر خضري') || query.includes('تكاثر زهري') || query.includes('فسائل') || query.includes('ترقيد') || query.includes('تطعيم')) {
      return `
        <b>🌼 التكاثر والنمو عند النباتات الخضراء (1م):</b><br>
        • <b>التكاثر الجنسي (الزهري):</b> يتم بواسطة الأزهار عبر اتحاد حبوب اللقاح (عنصر ذكري) مع البويضة (عنصر أنثوي) في المبيض لإعطاء بذور داخل الثمار.<br>
        • <b>التكاثر اللاجنسي (الخضري):</b> إنتاج نباتات جديدة دون الحاجة للبذور انطلاقاً من أجزاء خضرية للنبات الأم (الساق، الأوراق، الجذور)، ومن أهم طرقه:<br>
          1️⃣ <i>الافتسال (الفسائل):</i> فصل نمو جانبي من النبات الأم وغرسه (مثل النخيل والموز).<br>
          2️⃣ <i>الترقيد:</i> ثني غصن نحو التربة وردمه حتى يخرج جذوراً ثم فصله (مثل العنب والياسمين).<br>
          3️⃣ <i>التطعيم:</i> تركيب جزء من نبات (طعم) على نبات آخر قوي الجذور (حامل الطعم) لتحسين جودة وسرعة الإنتاج (مثل الحمضيات).
      `;
    }

    // ==========================================
    // المحور 3: السنة الثانية متوسط (2م)
    // ==========================================
    if (query.includes('وسط حيوي') || query.includes('لاحية') || query.includes('علاقات حيوية') || query.includes('سلسلة غذائية') || query.includes('كتلة حية')) {
      return `
        <b>🌳 الوسط الحيوي وعناصره والسلاسل الغذائية والكتلة الحية (2م):</b><br>
        • <b>مكونات الوسط الحيوي (Écosystème):</b> يتكون من قسمين متكاملين:<br>
          1️⃣ <i>الوحدة الحياتية (Biocénose):</i> الكائنات الحية (المنتجون: النبات الأخضر، المستهلكون: الحيوانات والإنسان، والمحللون: البكتيريا والفطريات).<br>
          2️⃣ <i>المدى الجغرافي الحيوي (Biotope):</i> العناصر اللاحية الفيزيائية والكيميائية (التربة، الماء، الإضاءة، والحرارة).<br>
        • <b>العلاقات بين الكائنات الحية:</b> (التغذية وهي أهم علاقة، الافتراس، التطفل، التعايش والتكافل، التنافس، والدفاع).<br>
        • <b>السلسلة الغذائية وهرم الكتلة الحية:</b> انتقال المادة والطاقة من المنتج (النبات الأخضر) إلى المستهلك 1 ثم المستهلك 2. عند انتقال المادة عبر مستويات السلسلة الغذائية، يحدث <b>ضياع وتناقص في الكتلة الحية</b> بسبب الفضلات والتنفس والحرارة (هرم الكتلة الحية).
      `;
    }

    if (query.includes('عوامل مناخية') || query.includes('تربة') || query.includes('نفاذية') || query.includes('احتفاظ بالماء') || query.includes('إضاءة') || query.includes('سبات') || query.includes('هجرة')) {
      return `
        <b>🌍 تأثير العوامل المناخية وخصائص التربة على توزع الكائنات الحية (2م):</b><br>
        • <b>الخصائص الفيزيائية للتربة:</b> تختلف التربة حسب نفاذيتها للماء وقدرتها على الاحتفاظ به:<br>
          - <i>التربة الرملية:</i> نفاذية عالية جداً واحتفاظ ضعيف بالماء (توزع نباتي فقير وشائك).<br>
          - <i>التربة الغضارية (الطينية):</i> نفاذية ضعيفة جداً واحتفاظ شديد بالماء (تختنق فيها الجذور).<br>
          - <i>التربة الدبالية (الزراعية):</i> نفاذية واحتفاظ متوازنان ومثاليان لنمو وكثافة النباتات.<br>
        • <b>تكيّف الحيوانات مع الظروف الشتوية القاسية:</b><br>
          1️⃣ <i>السبات الشتوي (Hibernation):</i> الدخول في نوم عميق وخفض درجة الحرارة ونبض القلب لتقليل استهلاك الطاقة (مثل الدب والقنفذ والسلحفاة).<br>
          2️⃣ <i>الهجرة (Migration):</i> الانتقال الجغرافي الجماعي نحو مناطق أدفأ وأغنى بالغذاء (مثل الطيور واللقلق).
      `;
    }

    if (query.includes('أعضاء تنفسية') || query.includes('غصمي') || query.includes('رئوي') || query.includes('جلدي') || query.includes('قصبات') || query.includes('أنماط التنقل')) {
      return `
        <b>🫁 التنفس والتنقل عند الحيوانات واحتلال الأوساط (2م):</b><br>
        • <b>أنماط التنفس عند الحيوانات حسب الوسط:</b><br>
          - <i>التنفس الرئوي:</i> عند الثدييات، الطيور، والزواحف في الوسط الجوي الهوائي.<br>
          - <i>التنفس الغصمي:</i> عند الأسماك في الوسط المائي (امتصاص O₂ المنحل في الماء عبر الغلاصم).<br>
          - <i>التنفس الجلدي/الرئوي:</i> عند البرمائيات (الضفدع والديدان) عبر الجلد الرطب والبرّاق.<br>
          - <i>التنفس القصبي:</i> عند الحشرات (الجراد والنحل) عبر ثغور وقصبات هوائية متفرعة تنقل الهواء مباشرة للخلايا دون تدخل الدم.<br>
        • <b>أنماط التنقل والتكيف المورفولوجي:</b> المشي والركض (أطراف قوية وسطح إسناد)، القفز (أطراف خلفية طويلة ومطوية مثل الأرنب والجراد)، السباحة (شكل انسيابي وزعانف وأغشية مجدفة)، والطيران (أجنحة وأكياس هوائية وخفة العظام).
      `;
    }

    if (query.includes('استراتيجيات التكاثر') || query.includes('إلقاح داخلي') || query.includes('إلقاح خارجي') || query.includes('إعمار الأوساط')) {
      return `
        <b>🐾 استراتيجيات التكاثر وإعمار الأوساط عند الحيوانات والنباتات (2م):</b><br>
        • <b>استراتيجيات التكاثر الحيواني للحفاظ على النوع:</b><br>
          1️⃣ <i>استراتيجية الكم (العدد الكبير - r-strategy):</i> إنتاج آلاف البيوض أو الأفراد دفعة واحدة دون رعاية الأبوين لتعويض نسبة الضياع العالية (مثل الأسماك والحشرات والضفادع).<br>
          2️⃣ <i>استراتيجية الكيف (العدد القليل - K-strategy):</i> إنتاج عدد قليل من الصغار مع رعاية وحماية مكثفة من الأبوين (مثل الثدييات والطيور).<br>
        • <b>أنماط الإلقاح:</b> (الإلقاح الداخلي داخل المجاري التناسلية للأنثى عند الثدييات والطيور) vs (الإلقاح الخارجي في الوسط المائي عند الأسماك والبرمائيات).
      `;
    }

    if (query.includes('مستحاثة') || query.includes('استحاثة') || query.includes('صخور رسوبية') || query.includes('جغرافيا قديمة')) {
      return `
        <b>🐚 المستحاثات وشروط الاستحاثة وتاريخ الأرض (2م):</b><br>
        • <b>تعريف المستحاثة (Fossile):</b> هي بقايا أو آثار كائنات حية (حيوانية أو نباتية) عاشت في الأزمنة الجيولوجية القديمة وحُفظت بشكل طبيعي داخل <b>الصخور الرسوبية</b>.<br>
        • <b>شروط ومراحل الاستحاثة (Fossilisation):</b> الدفن الفوري والسريع للكائن الميت بعد موته مباشرة في رسوبيات ناعمة (طين/رمل) بمعزل عن الأكسجين لمنع تفككه وعمل المحللين، ثم تمعدن الهيكل الصلب (العظام، الأصداف، القواقع) بمرور ملايين السنين.<br>
        • <b>أهمية دراسة المستحاثات:</b> تسمح بإعادة تصور الجغرافيا والمناخات القديمة للأرض، وتحديد أوساط العيش السابقة (مثلاً وجود مستحاثات الأمونيت وأصداف بحرية في جبال الأطلس يدل على أن تلك المنطقة كانت مغطاة ببحر قديم).
      `;
    }

    // ==========================================
    // المحور 4: السنة الثالثة متوسط (3م)
    // ==========================================
    if (query.includes('زلزال') || query.includes('بؤرة') || query.includes('مركز سطحي') || query.includes('أمواج زلزالية') || query.includes('سيسموغراف') || query.includes('توسع محيطي') || query.includes('زحزحة القارات')) {
      return `
        <b>🌋 الزلازل وحركية الصفائح التكتونية والتوسع المحيطي (3م):</b><br>
        • <b>آلية حدوث الزلزال:</b> انكسار مباغت للصخور الصلبة في باطن الأرض عند <b>البؤرة (Foyer)</b> نتيجة تراكم قوى الانضغاط والتمدد، فتتحرر طاقة هائلة تنتشر على شكل <b>أمواج زلزالية</b> في جميع الاتجاهات لتصل أولاً إلى <b>المركز السطحي (Épicentre)</b> الذي يسجل أكبر خسائر.<br>
        • <b>مسجل الزلازل (السيسموغراف):</b> يرسم تسجيلات سيسموغرامية تُقاس قوتها بسلم ريشتر (الطاقة المحررة) وشدتها بسلم MSK (الخسائر الميدانية).<br>
        • <b>زحزحة القارات والتوسع المحيطي:</b> الصخور الساخنة المتصاعدة على مستوى <b>الظهرة المحيطية (Dorsale océanique)</b> تتصلب مشكلة بازلت جديد يدفع الصخور القديمة، مما يؤدي لتوسع قاع المحيط وزحزحة القارات وتباعد إفريقيا عن أمريكا الجنوبية.
      `;
    }

    if (query.includes('غوص') || query.includes('بحر أبيض') || query.includes('متوسط') || query.includes('براكين انفجارية') || query.includes('تصادم صفائح') || query.includes('أطلس تلي')) {
      return `
        <b>🌋 ظاهرة الغوص والنشاط الزلزالي والبركاني في حوض المتوسط (3م):</b><br>
        • <b>آلية الغوص:</b> بسبب قوى الدفع الناجمة عن التوسع المحيطي، تغوص الصفيحة المحيطية الكثيفة والثقيلة تحت الصفيحة القارية الأقل كثافة على مستوى الخنادق المحيطية.<br>
        • <b>مائل بينيوف وتشكل الماغمات الزلزالية:</b> نزول الصفيحة الغائصة في الأستینوسفير يولد انصهاراً واحتكاكاً ينطلق على شكل هزات زلزالية عنيفة تتوزع بؤرها وفق <b>مائل بينيوف</b>.<br>
        • <b>البراكين الانفجارية العنيفة:</b> صعود الماغما اللزجة والغنية بالغازات المنصهرة عبر شقوق القشرة القارية يولد براكين انفجارية عنيفة (مثل بركان إتنا وفيزوف في إيطاليا).<br>
        • <b>انضغاط شمال الجزائر:</b> غوص الصفيحة الإفريقية تحت الأوراسية يولد قوى انضغاط مستمرة نحو الشمال، مما يفسر النشاط الزلزالي المتكرر وتشكّل سلسلة جبال الأطلس التلّي.
      `;
    }

    if (query.includes('صخور') || query.includes('غرانيت') || query.includes('كلس') || query.includes('حمض كلور الماء') || query.includes('غضار') || query.includes('جيولوجيا')) {
      return `
        <b>🪨 الصخور وخصائصها الفيزيائية والكيميائية في الجزائر (3م):</b><br>
        • <b>تصنيف الصخور حسب النشأة:</b> رسوبية (الكلس، الغضار، الرمل)، مغماتية ناريه (الغرانيت، البازلت)، ومتحولة (الرخام، الغنيس).<br>
        • <b>الخصائص المميزة لأهم الصخور الميدانية:</b><br>
          1️⃣ <i>الغرانيت:</i> صخر مغماتي جوفي، صلب جداً، متماسك البلورات، <b>كتوم للماء (لا ينفذ الماء)</b>، ولا يتأثر بحمض كلور الماء HCl.<br>
          2️⃣ <i>الكلس (الحجر الجيري):</i> صخر رسوبي، متوسط الصلابة، نفوذ للماء عبر الشقوق، و<b>يحدث فوراناً شديداً عند إضافة حمض كلور الماء HCl</b> لانطلاق غاز CO₂.<br>
          3️⃣ <i>الغضار (الطين):</i> صخر رسوبي، فتيّ ولين عندما يكون مبللاً، <b>كتوم للماء (يحجز الماء ويشكل بركاً)</b>، ولا يحدث فوراناً مع HCl.
      `;
    }

    if (query.includes('بترول') || query.includes('مياه جوفية') || query.includes('تصحر') || query.includes('انجراف التربة') || query.includes('تشجير')) {
      return `
        <b>🛢️ الموارد الطبيعية والتربة والمحافظة عليها في الجزائر (3م):</b><br>
        • <b>تشكل البترول والغاز الطبيعي:</b> يتشكل البترول في أحواض رسوبية بحرية مغلقة نتيجة دفن وتحلل العوالق البحرية الدقيقة (البﻻنكتون) بمعزل عن الأكسجين تحت ضغط وحرارة شديدين عبر ملايين السنين داخل <b>صخر الأم</b>، ثم يهاجر ليحتجز داخل <b>صخر خزان مسامي</b> تحت صخر غطاء كتوم.<br>
        • <b>المياه الجوفية والجيب المائي:</b> تتسرب مياه الأمطار عبر الصخور النفوذة لتتجمع فوق طبقة صخرية كتومة (غضارية) مشكلة جيباً مائياً ومياه جوفية تُستغل بالآبار والتنقيب.<br>
        • <b>حماية التربة ومكافحة التصحر والانجراف:</b> التربة ثروة هشة تتطلب عقوداً لتتشكل؛ تتم حمايتها من الانجراف المائي والريحي بـ <b>التشجير والمصدات الخضراء (مثل السد الأخضر في الجزائر)</b>، بناء المدرجات الجبلية، والدورة الزراعية.
      `;
    }

    // ==========================================
    // المحور 5: السنة الرابعة متوسط (4م — شهادة BEM)
    // ==========================================
    if (query.includes('تشنج') || query.includes('عداء') || query.includes('حمض اللبن') || query.includes('جري') || query.includes('عضل')) {
      return `
        <b>🏃‍♂️ التحليل العلمي للنشاط العضلي والتخمر اللاهوائي (تشنج العضلات - 4م):</b><br>
        • <b>في بداية النشاط العضلي (التنفس الخلوي الهوائي):</b> تستهلك الخلايا العضلية الجلوكوز والأكسجين (O₂) بكثرة لإنتاج طاقة كبيرة (38 ATP) كافية للجري.<br>
        • <b>عند المجهود الشديد والمطول (نقص الأكسجين):</b> يصبح إمداد الدم للـ O₂ غير كافٍ لتلبية حاجة العضلة المتزايدة للطاقة.<br>
        • <b>التحول إلى التخمر اللاهوائي (اللاكتيكي):</b> تلجأ الألياف العضلية إلى هدم الجلوكوز في <b>غياب الأكسجين</b> لإنتاج طاقة سريعة (2 ATP)، لكن هذا التفاعل ينتج عنه تراكم جزيئات <b>حمض اللبن (Acide lactique)</b> داخل العضلة.<br>
        • <b>النتيجة (التشنج والتعب العضلي):</b> تراكم حمض اللبن يؤدي إلى انخفاض حموضة الوسط الخلوي (pH)، مما يمنع انقباض واسترخاء الألياف العضلية بشكل طبيعي فيحدث <b>التشنج العضلي المؤلم</b>.
      `;
    }

    if (query.includes('ltc') || query.includes('تائية') || query.includes('سمية') || query.includes('خلوية') || query.includes('فيروس') || query.includes('سرطان')) {
      return `
        <b>🛡️ آلية عمل اللمفاويات التائية السمية (LTc) في المناعة النوعية الخلوية (4م):</b><br>
        • <b>التعرف والمزدوج:</b> تقتصر المناعة الخلوية على القضاء على <b>الخلايا المصابة بالفيروسات أو الخلايا السرطانية أو الطعوم الغريبة</b>. تتعرف اللمفاوية LTc بواسطة مستقبلها الغشائي على محدد مستضد الغريب المعروض على السطح الخلوي للخلية المصابة.<br>
        • <b>التثبيت وإفراز البرفورين:</b> تتثبت LTc على الخلية المصابة وتفرز حويصلات تحتوي على جزيئات بروتين <b>البرفورين (Perforine)</b> بالإضافة إلى أنزيمات قاطعة.<br>
        • <b>إحداث الثقوب والصدمة الحلولية:</b> يندمج البرفورين في غشاء الخلية المصابة مشكلاً <b>ثقوباً وقنوات غشائية</b>، مما يسمح بتدفق الماء والشوارد والأنزيمات القاطعة إلى داخل الخلية الغريبة.<br>
        • <b>التحلل والتدمير الخلوي:</b> تنتفخ الخلية المصابة وتنفجر (صدمة حلولية)، ثم تتدخل البلعميات الكبرى لتنظيف البقايا.
      `;
    }

    if (query.includes('خلطية') || query.includes('أجسام مضادة') || query.includes('اجسام مضادة') || query.includes('بائية') || query.includes('lb') || query.includes('معقد مناعي')) {
      return `
        <b>🛡️ الاستجابة المناعية النوعية المكتسبة ذات الوساطة الخلطية (4م):</b><br>
        • <b>التعرف والانتقاء اللمفاوي:</b> تتعرف اللمفاويات البائية (LB) بواسطة مستقبلاتها الغشائية على مولد الضد الغريب (بكتيريا، سموم...).<br>
        • <b>التكاثر والتمايز:</b> تتكاثر اللمفاويات LB المحسسة وتتمايز إلى مجموعتين:<br>
          1️⃣ <i>لمفاويات بائية ذاكرة (LBm):</i> تحتفظ بذاكرة مولد الضد لإنتاج أجسام مضادة سريعة وكثيفة عند التماس الثاني (أساس التلقيح).<br>
          2️⃣ <i>خلايا بلازمية منتجة للأجسام المضادة (Plasmocytes):</i> تفرز في سوائل الجسم جزيئات بروتينية متخصصة على شكل حرف Y تُسمى <b>الأجسام المضادة</b>.<br>
        • <b>تشكيل المعقد المناعي وإبطال المفعول:</b> يرتبط الجسم المضاد نوعياً بمولد الضد ليُشكل <b>معقد (جسم مضاد - مولد ضد)</b> يبطل مفعول الميكروب أو السم ويمنع تكاثره، ثم تتدخل البلعميات لبلعمة وهضم هذا المعقد المناعي بسهولة.
      `;
    }

    if (query.includes('هضم') || query.includes('إنزيم') || query.includes('انزيم') || query.includes('نشاء') || query.includes('بروتين') || query.includes('دسم') || query.includes('معدة')) {
      return `
        <b>🧪 تحولات الأغذية في الأنبوب الهضمي والهضم الإنزيمي (1م و 4م):</b><br>
        • <b>الهضم الآلي (الميكانيكي):</b> يتم بالأسنان واللسان والتقلصات العضلية للمعدة والأمعاء لتقطيع وطحن الطعام.<br>
        • <b>الهضم الكيميائي (الإنزيمي):</b> تبسيط الجزيئات الغذائية المعقدة إلى مغذيات بسيطة بواسطة الإنزيمات المتخصصة:<br>
          1️⃣ <i>النشاء (السكريات المعقدة):</i> يتبسط في الفم أولاً بواسطة إنزيم <b>الأميلاز اللعابي</b> إلى سكر شعير (مالتوز)، ثم في المعي الدقيق بواسطة الأميلاز والمالتاز إلى <b>جلوكوز</b>.<br>
          2️⃣ <i>البروتينات:</i> تتبسط في المعدة بواسطة <b>البروتياز 1 (البيپسين)</b> إلى متعدد بيپتيد، ثم في المعي الدقيق بواسطة البروتياز 2 إلى <b>أحماض أمينية</b>.<br>
          3️⃣ <i>الدسم (الدهون):</i> تستحلب أولاً بواسطة العصارة الصفراوية، ثم تتبسط في المعي الدقيق بواسطة إنزيم <b>الليباز</b> إلى <b>أحماض دسمة + جليسيرول</b>.
      `;
    }

    if (query.includes('زغابة') || query.includes('امتصاص') || query.includes('بلغمي') || query.includes('دموي') || query.includes('معي دقيق')) {
      return `
        <b>🔬 الزغابة المعوية وطريقي الامتصاص الدموي والبلغمي (4م):</b><br>
        • <b>مقر الامتصاص المعوي:</b> المعي الدقيق هو مقر امتصاص المغذيات بفضل بنيته الداخلية المتميزة بوجود طيات جدارية تحمل ملايين <b>الزغابات المعوية (Villosités intestinales)</b> ذات الجدار الرقيق جداً والغنية بالشعيرات الدموية واللمفاوية، مما يوفر سطح تماس هائل مع المغذيات.<br>
        • <b>طريقا النقل والامتصاص:</b><br>
          1️⃣ <i>الطريق الدموي:</i> تمر عبره المغذيات البسيطة المنحلة في الماء: <b>الجلوكوز، الأحماض الأمينية، الماء، الأملاح المعدنية، والفيتامينات المنحلة في الماء</b>، متجهة نحو الكبد عبر الوريد الباب الكبدي لتنظيم نسبة السكر في الدم.<br>
          2️⃣ <i>الطريق اللمفاوي (البلغمي):</i> تمر عبره المغذيات الدهنية: <b>الأحماض الدسمة، الجليسيرول، والفيتامينات الذائبة في الدهون</b>، متجهة مباشرة إلى الوريد تحت الترقوي الأيسر ثم القلب دون المرور بالكبد.
      `;
    }

    if (query.includes('قوس') || query.includes('انعكاس') || query.includes('لاإرادي') || query.includes('لا ارادي') || query.includes('نخاع شوكي') || query.includes('عصبي')) {
      return `
        <b>⚡ القوس الانعكاسي والأعضاء الفاعلة في الفعل اللاإرادي (المنعكس الفطري - 4م):</b><br>
        الفعل اللاإرادي (المنعكس الشوكي) هو استجابة سريعة، متماثلة، وتلقائية لحماية الجسم من المخاطر، ويتطلب حدوثه تدخل 5 أعضاء تشكل <b>القوس الانعكاسي (Arc réflexe)</b> بالترتيب الحتمي الآتي:<br>
        1️⃣ <b>مستقبل حسّي (الجلد أو العضو الحاس):</b> يلتقط التنبيه الفعال (الحرارة، الوخز، الضغط) وتتولد فيه رسالة عصبية حسية.<br>
        2️⃣ <b>ناقل حسّي (عصب حسي):</b> ينقل الرسالة العصبية الحسية في الاتجاه الجابذ نحو المركز العصبي.<br>
        3️⃣ <b>المركز العصبي (النخاع الشوكي):</b> يستقبل الرسالة الحسية ويترجمها ويحولها إلى رسالة عصبية حركية بفضل عصبون جامع في المادة الرمادية.<br>
        4️⃣ <b>ناقل حركي (عصب حركي):</b> ينقل الرسالة العصبية الحركية في الاتجاه النابذ من النخاع الشوكي نحو العضو المنفذ.<br>
        5️⃣ <b>عضو منفذ (العضلة):</b> يستقبل الأمر العصبي ويستجيب بالتقلص أو التمدد لتنفيذ الحركة وحماية الجسم.
      `;
    }

    if (query.includes('وراثة') || query.includes('صبغي') || query.includes('أمشاج') || query.includes('امشاج') || query.includes('نمط نووي') || query.includes('إلقاح') || query.includes('القاح') || query.includes('داون')) {
      return `
        <b>🧬 الوراثة والصبغيات وتشكيل الأمشاج والنمط النووي (4م):</b><br>
        • <b>مقر الدعامة الوراثية:</b> تقع المعلومات الوراثية التي تحدد الصفات الموروثة داخل <b>نواة الخلية</b> متوضعة على خيوط تسمى <b>الصبغيات (الكروموسومات - Chromosomes)</b>.<br>
        • <b>النمط النووي الإنساني (Caryotype):</b> تحتوي الخلايا الجسمية العادية على <b>46 صبغياً (2n = 23 شفعاً أو زوجاً)</b> متماثلة ومصنفة حسب الحجم وطول الذراعين. الشفع 23 هو الشفع الجنسي (XX عند الأنثى، XY عند الذكر).<br>
        • <b>تشكيل الأمشاج (الانقسام المنصف):</b> تتشكل النطاف والبويضات بعملية انقسام اختزالي ينتج عنها خلايا جنسية (أمشاج) تحتوي على <b>نصف عدد الصبغيات (n = 23 صبغياً فرداً)</b>.<br>
        • <b>الإلقاح واستعادة الصيغة الثنائية:</b> اتحاد نطفة (23 صبغياً) مع بويضة (23 صبغياً) يُعيد تشكيل بيضة مخصبة ثنائية الصيغة الصبغية (2n = 46 صبغياً) تحمل صفات وراثية مزدوجة من الأب والأم.
      `;
    }

    if (query.includes('دم') || query.includes('بلغم') || query.includes('لمف') || query.includes('كريات حمراء') || query.includes('هيموغلوبين') || query.includes('كريات بيضاء') || query.includes('بلازما')) {
      return `
        <b>🩸 مكونات الدم ودوره في النقل التنفسي والغذائي (4م):</b><br>
        • <b>تركيب الدم وسوائل العضوية:</b> الدم نسيج سائل ينفصل بالتثفيل إلى: <b>البلازما (54%)، الكريات الحمراء (45%)، الكريات البيضاء والصفائح الدموية (1%)</b>. (البلغم/اللمف هو سائل يشبه الدم خالي من الكريات الحمراء، والسائل البيني يحيط بالخلايا).<br>
        • <b>الكريات الحمراء (Hématies):</b> خلايا قرصية مقعرة الوجهين، عديمة النواة، غنية ببروتين <b>الهيموغلوبين (Hb - خضاب الدم)</b> المتخصص في نقل الغازات التنفسية:<br>
          - <i>نقل O₂:</i> يرتبط الأكسجين بالهيموغلوبين على مستوى الأسناخ الرئوية مشكلاً أكسي هيموغلوبين أحمر قاني (Hb + 4O₂ ← Hb(O₂)₄).<br>
          - <i>نقل CO₂:</i> يرتبط CO₂ بالهيموغلوبين على مستوى الخلايا مشكلاً كاربامينو هيموغلوبين أحمر قاتم.<br>
        • <b>البلازما (المصوّرة):</b> تنقل المغذيات البسيطة نحو الخلايا، وتنقل الفضلات (البولة وحمض البول وجزء من CO₂) نحو أعضاء الإطراح.<br>
        • <b>الكريات البيضاء والصفائح:</b> الكريات البيضاء للدفاع المناعي (بلعمة ولمفاويات)، والصفائح لتخثر الدم وسد الجروح.
      `;
    }

    if (query.includes('مناعة طبيعية') || query.includes('بلعمة') || query.includes('خط دفاعي أول') || query.includes('التهاب') || query.includes('تفاعل التهابي')) {
      return `
        <b>🛡️ المناعة الطبيعية اللانوعية (الخط الدفاعي الأول والثاني - التفاعل الالتهابي والبلعمة - 4م):</b><br>
        • <b>الخط الدفاعي الأول (الحواجز الطبيعية):</b> حواجز ميكانيكية (الجلد، الأهداب، المخاط) وحواجز كيميائية (الدموع، اللعاب، العرق، حمض المعدة HCl) تمنع دخول الميكروبات.<br>
        • <b>الخط الدفاعي الثاني (التفاعل الالتهابي اللانوعي):</b> عند اختراق الحواجز (وخزة شوكة)، تظهر أعراض موضعية: (الاحمرار والحرارة لتوسع الشعيرات الدموية، الانتفاخ لخروج البلازما وانسلال الكريات البيضاء، والألم لضغط النهايات العصبية الحسية).<br>
        • <b>مراحل البلعمة (Phagocytose):</b> تتدخل البلعميات (الكريات البيضاء متعددة النوى) للقضاء على الميكروب دون تمييز عبر 4 مراحل متسلسلة: (1- الانجذاب والتثبيت ← 2- الإحاطة بالأرجل الكاذبة والابتلاع ← 3- الهضم بالإنزيمات الحالّة الليزوزومات ← 4- الإطراح وطرح الفضلات).
      `;
    }

    if (query.includes('تلقيح') || query.includes('لقاح') || query.includes('استمصال') || query.includes('مصل') || query.includes('ذاكرة مناعية')) {
      return `
        <b>💉 المقارنة العلمية بين التلقيح (Vaccination) والاستمصال (Sérothérapie - 4م):</b><br>
        1️⃣ <b>التلقيح (الوقاية والمناعة المكتسبة الدائمة):</b><br>
           • <i>المبدأ:</i> حقن العضوية بميكروب ميت أو مضعف (أناتوكسين غير ممرض) لحثها على إنتاج أجسام مضادة وتشكيل خلايا ذاكرة (LBm / LTm).<br>
           • <i>الخصائص:</i> مناعة <b>مكتسبة، نشطة (الجسم يبنيها بنفسه)، نوعية، بطيئة المفعول في البداية لكنها طويلة المدى ودائمة</b> للوقاية المستقبليّة.<br>
        2️⃣ <b>الاستمصال (العلاج الفوري والإنقاذ العاجل):</b><br>
           • <i>المبدأ:</i> حقن التلميذ أو المريض بمصل محضر يحمل <b>أجساماً مضادة نوعية جاهزة ومحسسة</b> ضد المستضد أو السم الخطير.<br>
           • <i>الخصائص:</i> مناعة <b>منقولة وجاهزة، سلبية (العضوية تتلقاها جاهزة)، نوعية، سريعة المفعول فوراً لكنها مؤقتة وقصيرة المدى</b> تستخدم للعلاج والإنقاذ الطارئ (مثل مصل الكزاز أو لدغة الأفاعي).
      `;
    }

    return null;
  }
})();
