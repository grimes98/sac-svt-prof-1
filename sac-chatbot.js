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
    const query = q.toLowerCase();

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

    if (query.includes('غوص') || query.includes('بحر أبيض') || query.includes('متوسط') || query.includes('براكين انفجارية') || query.includes('زلازل') || query.includes('تصادم')) {
      return `
        <b>🌋 ظاهرة الغوص والنشاط الزلزالي والبركاني في حوض البحر الأبيض المتوسط (3م):</b><br>
        • <b>آلية الغوص:</b> بسبب قوى الدفع الناجمة عن التوسع المحيطي، تغوص الصفيحة الإفريقية تحت الصفيحة الأوراسية في شمال إيطاليا واليونان.<br>
        • <b>انصهار الليتوسفير وتشكل الماغمات الزلزالية:</b> نزول الصفيحة الغائصة في الأستینوسفير الساخن يولد احتكاكاً وانصهاراً صخرياً يؤدي لتراكم طاقة هائلة تنطلق على شكل <b>هزات زلزالية عنيفة تتوزع بؤرها وفق مائل بينيوف</b>.<br>
        • <b>النشاط البركاني الانفجاري:</b> صعود الماغما اللزجة والغنية بالغازات المنصهرة والأبخرة عبر شقوق القشرة القارية يولد <b>براكين انفجارية عنيفة</b> (مثل بركان إتنا وفيزوف في إيطاليا).<br>
        • <b>انضغاط شمال الجزائر:</b> هذا الغوص المستمر يولد قوى انضغاط من الجنوب نحو الشمال، مما يفسر النشاط الزلزالي المتكرر وتشكّل جبال الأطلس التلّي في الجزائر.
      `;
    }

    if (query.includes('نسغ') || query.includes('ناقص') || query.includes('كامل') || query.includes('أوعية') || query.includes('خشبية') || query.includes('لحائية') || query.includes('نتح')) {
      return `
        <b>🌱 مقارنة علمية دقيقة بين النسغ الناقص والنسغ الكامل عند النبات الأخضر (1م):</b><br>
        1️⃣ <b>النسغ الناقص (الخام):</b><br>
           • <i>التركيب:</i> ماء + أملاح معدنية ممتصة من التربة بواسطة الأوبار الماصة في الجذور.<br>
           • <i>المسار والنقل:</i> ينتقل باتجاه واحد تصاعدي (من الجذور ← الساق ← الأوراق) عبر <b>الأوعية الخشبية</b>.<br>
           • <i>المحرك:</i> ظاهرة <b>النتح</b> (طرح بخار الماء عبر المسامات الأوراق) تخلق قوة شد ومص للنسغ.<br>
        2️⃣ <b>النسغ الكامل (الجاهز):</b><br>
           • <i>التركيب:</i> نسغ ناقص + مادة عضوية (نشا، سكر، بروتين) مصنوعة على مستوى الأوراق بفضل <b>التركيب الضوئي</b>.<br>
           • <i>المسار والنقل:</i> ينتقل في جميع الاتجاهات عبر <b>الأوعية اللحائية</b> لتغذية جميع خلايا النبات وتخزين الفائض في الدرنات والبذور والثمار.
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

    if (query.includes('وراثة') || query.includes('صبغي') || query.includes('أمشاج') || query.includes('امشاج') || query.includes('نمط نووي') || query.includes('إلقاح') || query.includes('القاح')) {
      return `
        <b>🧬 الوراثة والصبغيات وتشكيل الأمشاج والنمط النووي (4م):</b><br>
        • <b>مقر الدعامة الوراثية:</b> تقع المعلومات الوراثية التي تحدد الصفات الموروثة داخل <b>نواة الخلية</b> متوضعة على خيوط تسمى <b>الصبغيات (الكروموسومات - Chromosomes)</b>.<br>
        • <b>النمط النووي الإنساني (Caryotype):</b> تحتوي الخلايا الجسمية العادية على <b>46 صبغياً (2n = 23 شفعاً أو زوجاً)</b> متماثلة ومصنفة حسب الحجم وطول الذراعين. الشفع 23 هو الشفع الجنسي (XX عند الأنثى، XY عند الذكر).<br>
        • <b>تشكيل الأمشاج (الانقسام المنصف):</b> تتشكل النطاف والبويضات بعملية انقسام اختزالي ينتج عنها خلايا جنسية (أمشاج) تحتوي على <b>نصف عدد الصبغيات (n = 23 صبغياً فرداً)</b>.<br>
        • <b>الإلقاح واستعادة الصيغة الثنائية:</b> اتحاد نطفة (23 صبغياً) مع بويضة (23 صبغياً) يُعيد تشكيل بيضة مخصبة ثنائية الصيغة الصبغية (2n = 46 صبغياً) تحمل صفات وراثية مزدوجة من الأب والأم.
      `;
    }

    // التحليل العام الصافي والمباشر لأي سؤال آخر
    return `
      <b>🔬 التحليل العلمي والديدكتيكي الصافي لسؤالك (SAC SVT AI+):</b><br>
      «<b style="color:#0d9488;">${escapeHtmlChat(q)}</b>»<br><br>
      يتناول هذا السؤال موضوعاً محورياً في <b>منهاج علوم الطبيعة والحياة للتعليم المتوسط في الجزائر (الجيل الثاني)</b>:<br>
      • <b>من الناحية البيداغوجية والصفية:</b> لتدريس هذا المفهوم بنجاح وإقناع التلاميذ، يُنصح بالانطلاق من <b>وضعية مشكلة ملموسة مستوحاة من الواقع أو تجربة مخبرية</b>، ثم تقديم سندات (صور ملونة، جداول، منحنيات بيانية) مع تعليمات دقيقة تطلب من التلميذ الملاحظة والتحليل والاستنتاج.<br>
      • <b>من ناحية التقويم والمعايير:</b> تأكد من صياغة شبكة تقويم تعتمد على الوجاهة، الاستعمال السليم لأدوات المادة، والانسجام المنطقي في التفسير.<br><br>
      💡 <b>للحصول على المذكرات الجاهزة والسندات التفصيلية الخاصة بهذا الدرس تحديداً، تصفح أقسام المنصة:</b><br>
      • <a href="maktaba.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">📚 المكتبة الرقمية ومذكرات الأساتذة الجاهزة للتحميل</a><br>
      • <a href="qamous.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">🔬 القاموس العلمي والمصطلحات البيولوجية ثلاثية اللغات</a><br>
      • <a href="mokhbar.html" style="color:#0d9488; font-weight:800; text-decoration:underline;">🧪 دليل الأعمال المخبرية والتجارب والوسائل التعليمية (TP)</a>
    `;
  }

  function checkInstantCurriculumDatabase(query) {
    if (query.includes('مسعى علمي') || query.includes('مراحل المسعى')) {
      return `
        <b>❓ المسعى العلمي (Démarche scientifique) في علوم الطبيعة والحياة:</b><br>
        هو طريقة تفكير العالِم التي ندرّب عليها التلميذ داخل الحصة، ويمرّ بـ 6 خطوات أساسية بالترتيب:<br>
        1️⃣ <b>الإحساس بالمشكل:</b> وضع التلميذ أمام وضعية محفزة تثير فضوله للتساؤل.<br>
        2️⃣ <b>صياغة الإشكالية:</b> تحويل المشكل إلى سؤال علمي دقيق.<br>
        3️⃣ <b>اقتراح الفرضيات:</b> تقديم تفسيرات مؤقتة منطقية وقابلة للاختبار.<br>
        4️⃣ <b>التصميم والتقصّي:</b> دراسة السندات والتجارب والوثائق لاختبار الفرضيات.<br>
        5️⃣ <b>التحليل ومناقشة النتائج:</b> استخلاص المعطيات من التجارب.<br>
        6️⃣ <b>الخلاصة والاستنتاج:</b> تدوين النتيجة العلمية المبنية على الكراس (الحوصلة).
      `;
    }
    if (query.includes('معايير') || query.includes('تقويم')) {
      return `
        <b>📐 معايير ومؤشّرات التقويم في منهاج الجيل الثاني:</b><br>
        لضمان تصحيح موضوعي وعادل في الفروض والاختبارات، نعتمد على 4 معايير أساسية:<br>
        1️⃣ <b>الوجاهة (Pertinence):</b> هل أجاب التلميذ في صميم الموضوع وحسب التعليمة المطلوبة دون خروج؟<br>
        2️⃣ <b>الاستعمال السليم لأدوات المادة:</b> استخراج المعطيات العلمية الدقيقة وتوظيف المصطلحات الخاصة بالعلوم.<br>
        3️⃣ <b>الانسجام (Cohérence):</b> تسلسل الأفكار منطقيًّا وخلوّ الإجابة من التناقضات.<br>
        4️⃣ <b>الإتقان والجمالية:</b> نظافة الورقة، المقروئية، والترتيب.<br>
        💡 <i>قاعدة التوزيع: ¾ من العلامة تخصص للمعايير الثلاثة الأولى، و ¼ لمعيار الإتقان.</i>
      `;
    }
    return null;
  }

  // تهيئة وتشغيل واجهة المساعد الذكي عند اكتمال تحميل الصفحة
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectChatbotUI();
  } else {
    window.addEventListener('DOMContentLoaded', injectChatbotUI);
  }
})();
