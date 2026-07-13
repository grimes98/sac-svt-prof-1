/* =========================================================================
   🤖 مساعد أساتذة علوم الطبيعة والحياة الذكي — SAC · SVT AI Assistant
   نظام المحادثة المدمج لكافة صفحات المنصة الـ 25 (مع نظام الأسئلة المجانية للزوار واللامحدودة للمشتركين)
   ========================================================================= */

(function(){
  if (document.getElementById('sacAiChatbotBtn')) return;

  // التحقق هل المتصفح مسجل دخول كأدمين أو مستخدم
  function isChatbotUserLogged() {
    const role = localStorage.getItem('sac_role');
    const sess = localStorage.getItem('sac_session') || localStorage.getItem('sac_user_session');
    return (role === 'admin' || role === 'user' || sess);
  }

  // معرفة عدد الأسئلة المستهلكة للزائر
  function getGuestChatCount() {
    return parseInt(localStorage.getItem('sac_guest_chat_count') || '0', 10);
  }

  function setGuestChatCount(cnt) {
    localStorage.setItem('sac_guest_chat_count', cnt.toString());
  }

  // إنشاء زر الشات بوت العائم
  const chatBtn = document.createElement('div');
  chatBtn.id = 'sacAiChatbotBtn';
  chatBtn.style.cssText = 'position:fixed; bottom:24px; left:24px; z-index:999996; width:62px; height:62px; border-radius:50%; background:#fff; border:3px solid #00a8a8; box-shadow:0 6px 25px rgba(0,168,168,0.45); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:0.3s; user-select:none;';
  chatBtn.innerHTML = `
    <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="🤖" style="width:46px; height:46px; object-fit:contain; transition:0.3s;">
    <span style="position:absolute; top:-4px; right:-4px; background:#f59e0b; color:#fff; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.2); font-family:'Tajawal',sans-serif;">AI</span>
  `;
  chatBtn.title = '💬 المساعد الذكي لأساتذة علوم الطبيعة والحياة (اضغط للسؤال)';
  chatBtn.onmouseover = () => chatBtn.style.transform = 'scale(1.08) translateY(-3px)';
  chatBtn.onmouseout = () => chatBtn.style.transform = 'none';

  // إنشاء شاشة المحادثة (Modal)
  const chatModal = document.createElement('div');
  chatModal.id = 'sacAiChatbotModal';
  chatModal.style.cssText = 'position:fixed; bottom:96px; left:24px; z-index:999997; width:380px; max-width:92vw; height:540px; max-height:78vh; background:#fff; border:2px solid #00a8a8; border-radius:20px; box-shadow:0 15px 50px rgba(0,0,0,0.3); display:none; flex-direction:column; overflow:hidden; font-family:"Tajawal",sans-serif; direction:rtl; transition:0.3s; opacity:0; transform:translateY(15px);';
  
  chatModal.innerHTML = `
    <!-- الترويسة -->
    <div style="background:linear-gradient(135deg, #0a5860, #00a8a8); color:#fff; padding:14px 18px; display:flex; align-items:center; gap:10px; border-bottom:2px solid #28c8c8;">
      <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="" style="width:36px; height:36px; object-fit:contain; filter:brightness(0) invert(1);">
      <div style="flex:1;">
        <div style="font-weight:800; font-size:1.02rem; line-height:1.2;">🤖 مساعد أساتذة ع.ط.ح الذكي</div>
        <div style="font-size:0.78rem; opacity:0.9;">مستشار بيداغوجي وعلمي فوري (SAC AI)</div>
      </div>
      <button onclick="window.closeSacChatbot()" style="background:rgba(255,255,255,0.2); color:#fff; border:none; width:28px; height:28px; border-radius:50%; font-size:0.9rem; font-weight:800; cursor:pointer; transition:0.2s;">✕</button>
    </div>

    <!-- شريط حالة الرصيد للأسئلة -->
    <div id="sacChatStatusHeader" style="background:#eefaf7; border-bottom:1px solid #daeeee; padding:6px 14px; font-size:0.82rem; font-weight:700; color:#007878; display:flex; align-items:center; justify-content:space-between;">
      <span>💡 جاري فحص رصيد الأسئلة...</span>
    </div>

    <!-- سجل المحادثة -->
    <div id="sacChatHistory" style="flex:1; padding:14px; overflow-y:auto; background:#f2fafa; display:flex; flex-direction:column; gap:10px; font-size:0.92rem;">
      <div class="msg-bot" style="align-self:flex-start; background:#fff; border:1px solid #daeeee; border-radius:14px 14px 2px 14px; padding:12px 14px; color:#173a3a; box-shadow:0 2px 8px rgba(0,168,168,0.06); max-width:88%; line-height:1.7;">
        <b>🤖 مرحبًا بك يا أستاذ(ة) في فضاء المساعد الذكي!</b><br>
        أنا هنا لمساعدتك في كل ما يخصّ منهاج علوم الطبيعة والحياة، صياغة الوضعيات، معايير التقويم، أو أي مفهوم بيداغوجي وعلمي. كيف يمكنني إفادتك اليوم؟ 📗🔬
      </div>
    </div>

    <!-- الأسئلة السريعة المباشرة -->
    <div id="sacChatQuickPills" style="padding:8px 12px; background:#fff; border-top:1px solid #daeeee; display:flex; gap:6px; overflow-x:auto; white-space:nowrap; scrollbar-width:none;">
      <button onclick="window.askSacChatbot('ما هو المسعى العلمي ومراحله؟')" style="background:#eef4fb; border:1px solid #cdddf0; color:#2456a0; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">❓ ما هو المسعى العلمي؟</button>
      <button onclick="window.askSacChatbot('ما هي معايير التقويم ومؤشراته؟')" style="background:#eefaf7; border:1px solid #b6e2c8; color:#1e8a57; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">📐 معايير التقويم</button>
      <button onclick="window.askSacChatbot('كيف أصوغ وضعية انطلاقية مشكلة جيدة؟')" style="background:#fff8e6; border:1px solid #f0d590; color:#8a6d1f; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🧩 الوضعية الانطلاقية</button>
      <button onclick="window.askSacChatbot('ما هي خطوات إعداد مذكرة بيداغوجية؟')" style="background:#fdf0ee; border:1px solid #f3c9c1; color:#c0432e; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">📝 إعداد المذكرة</button>
    </div>

    <!-- شريط الإدخال -->
    <div id="sacChatInputFooter" style="padding:10px; background:#fff; border-top:1.5px solid #daeeee; display:flex; gap:8px; align-items:center;">
      <input type="text" id="sacChatInput" placeholder="اكتب سؤالك البيداغوجي أو العلمي هنا..." style="flex:1; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:0.9rem; outline:none; transition:0.2s;" onkeypress="if(event.key==='Enter') window.sendSacChatMsg()">
      <button id="sacChatSendBtn" onclick="window.sendSacChatMsg()" style="background:#00a8a8; color:#fff; border:none; padding:10px 16px; border-radius:12px; font-weight:800; font-size:0.9rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:4px;">➤ إرسال</button>
    </div>
  `;

  document.body.appendChild(chatBtn);
  document.body.appendChild(chatModal);

  // تحديث حالة الخانة والأزرار حسب تسجيل الدخول ورصيد الـ 5 أسئلة للزائر
  function updateChatbotQuotaUI() {
    const statusHeader = document.getElementById('sacChatStatusHeader');
    const input = document.getElementById('sacChatInput');
    const sendBtn = document.getElementById('sacChatSendBtn');
    if (!statusHeader || !input || !sendBtn) return;

    if (isChatbotUserLogged()) {
      // الأدمين أو المستخدم المشترك: عدد لا متناهي من الأسئلة
      statusHeader.style.background = '#dcfce7';
      statusHeader.style.color = '#15803d';
      statusHeader.innerHTML = `<span>🔓 أسئلة غير محدودة (حساب مشترك فعّال)</span><span>∞</span>`;
      input.disabled = false;
      input.placeholder = 'اكتب سؤالك البيداغوجي أو العلمي هنا (بدون حدود)...';
      input.style.background = '#fff';
      input.style.cursor = 'text';
      sendBtn.innerHTML = '➤ إرسال';
      sendBtn.style.background = '#00a8a8';
      sendBtn.onclick = () => window.sendSacChatMsg();
    } else {
      // زائر عادي: رصيد 5 أسئلة مجانية
      const cnt = getGuestChatCount();
      const remaining = Math.max(0, 5 - cnt);

      if (remaining > 0) {
        statusHeader.style.background = '#eefaf7';
        statusHeader.style.color = '#007878';
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> أسئلة مجانية كزائر</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
        input.disabled = false;
        input.placeholder = `اكتب سؤالك البيداغوجي أو العلمي هنا... (${remaining} متبقية)`;
        input.style.background = '#fff';
        input.style.cursor = 'text';
        sendBtn.innerHTML = '➤ إرسال';
        sendBtn.style.background = '#00a8a8';
        sendBtn.onclick = () => window.sendSacChatMsg();
      } else {
        // استنفد 5 أسئلة للزائر: إغلاق الخانة وطلب تسجيل الدخول
        statusHeader.style.background = '#fef3c7';
        statusHeader.style.color = '#b45309';
        statusHeader.innerHTML = `<span>🔒 استنفدت الأسئلة المجانية للزوار (5/5)</span><a href="login.html" style="color:#92400e; font-weight:800; text-decoration:underline;">دخول للحصول على ∞ ←</a>`;
        input.disabled = true;
        input.placeholder = '🔒 الخانة مغلقة — سجّل الدخول لطرح أسئلة غير محدودة';
        input.style.background = '#f1f5f9';
        input.style.cursor = 'not-allowed';
        sendBtn.innerHTML = '🔑 سجّل الدخول';
        sendBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        sendBtn.onclick = () => {
          sessionStorage.setItem('sac_redirect', window.location.href);
          window.location.href = 'login.html';
        };
      }
    }
  }

  // التحكم في فتح وإغلاق الشات بوت
  chatBtn.onclick = () => {
    if (chatModal.style.display === 'none' || !chatModal.style.display) {
      updateChatbotQuotaUI();
      chatModal.style.display = 'flex';
      setTimeout(() => {
        chatModal.style.opacity = '1';
        chatModal.style.transform = 'translateY(0)';
        const input = document.getElementById('sacChatInput');
        if (input && !input.disabled) input.focus();
      }, 10);
    } else {
      window.closeSacChatbot();
    }
  };

  window.closeSacChatbot = () => {
    chatModal.style.opacity = '0';
    chatModal.style.transform = 'translateY(15px)';
    setTimeout(() => { chatModal.style.display = 'none'; }, 280);
  };

  window.askSacChatbot = (question) => {
    updateChatbotQuotaUI();
    if (!isChatbotUserLogged() && getGuestChatCount() >= 5) {
      showQuotaReachedMessage();
      return;
    }
    const input = document.getElementById('sacChatInput');
    if (input && !input.disabled) {
      input.value = question;
      window.sendSacChatMsg();
    }
  };

  function showQuotaReachedMessage() {
    const history = document.getElementById('sacChatHistory');
    if (!history) return;
    history.innerHTML += `
      <div class="msg-bot" style="align-self:center; background:#fef3c7; border:2px solid #fde68a; border-radius:14px; padding:16px; color:#b45309; text-align:center; box-shadow:0 4px 15px rgba(245,158,11,0.2); max-width:92%;">
        <div style="font-size:2.2rem; margin-bottom:8px;">🔒</div>
        <b style="font-size:1.05rem; color:#92400e;">لقد استنفدت رصيد الأسئلة المجانية للزوار (5 من 5)</b><br>
        <p style="font-size:0.9rem; margin:8px 0 14px; line-height:1.6; color:#b45309;">للحصول على <b>عدد لا متناهي من الأسئلة (∞)</b> والاستشارات البيداغوجية الفورية، يرجى تسجيل الدخول بحساب الأستاذ أو الأدمين.</p>
        <button onclick="sessionStorage.setItem('sac_redirect', window.location.href); window.location.href='login.html'" style="padding:10px 24px; font-size:0.92rem; font-weight:800; border:none; border-radius:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.35);">🔑 سجّل الدخول الآن للمتابعة</button>
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    updateChatbotQuotaUI();
  }

  window.sendSacChatMsg = () => {
    updateChatbotQuotaUI();
    const input = document.getElementById('sacChatInput');
    const history = document.getElementById('sacChatHistory');
    if (!input || !history || input.disabled) return;
    const text = input.value.trim();
    if (!text) return;

    // التحقق من حصة الزائر
    if (!isChatbotUserLogged()) {
      const cnt = getGuestChatCount();
      if (cnt >= 5) {
        showQuotaReachedMessage();
        return;
      }
      setGuestChatCount(cnt + 1);
      updateChatbotQuotaUI();
    }

    // إضافة رسالة المستخدم
    history.innerHTML += `
      <div class="msg-user" style="align-self:flex-end; background:#00a8a8; color:#fff; border-radius:14px 14px 14px 2px; padding:10px 14px; box-shadow:0 2px 6px rgba(0,168,168,0.25); max-width:85%; line-height:1.6; font-weight:500;">
        ${escapeHtmlChat(text)}
      </div>
    `;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // إضافة مؤشر التفكير
    const loadingId = 'sacLoading_' + Date.now();
    history.innerHTML += `
      <div id="${loadingId}" class="msg-bot" style="align-self:flex-start; background:#fff; border:1px solid #daeeee; border-radius:14px 14px 2px 14px; padding:10px 14px; color:#5f7d7d; max-width:85%;">
        ⏳ يفكّر المساعد الذكي في إجابة دقيقة...
      </div>
    `;
    history.scrollTop = history.scrollHeight;

    // توليد الإجابة البيداغوجية أو العلمية
    setTimeout(() => {
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      
      const reply = generatePedagogicalResponse(text);
      history.innerHTML += `
        <div class="msg-bot" style="align-self:flex-start; background:#fff; border:1px solid #daeeee; border-radius:14px 14px 2px 14px; padding:12px 14px; color:#173a3a; box-shadow:0 2px 8px rgba(0,168,168,0.06); max-width:88%; line-height:1.7;">
          ${reply}
        </div>
      `;
      history.scrollTop = history.scrollHeight;
      updateChatbotQuotaUI();

      // إذا وصل الزائر للسؤال الخامس للتو، نظهر له رسالة انتهاء الرصيد بعد الإجابة
      if (!isChatbotUserLogged() && getGuestChatCount() >= 5) {
        setTimeout(showQuotaReachedMessage, 600);
      }
    }, 450);
  };

  function escapeHtmlChat(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* =========================================================================
     🧠 محرك المعرفة التربوية والعلمية المدمج (The SAC AI Knowledge Engine)
     ========================================================================= */
  function generatePedagogicalResponse(q) {
    const query = q.toLowerCase();

    // 1. المسعى العلمي
    if (query.includes('مسعى') || query.includes('علمي') || query.includes('خطوات الدرس') || query.includes('demarche')) {
      return `
        <b>🔎 المسعى العلمي (Démarche scientifique) في علوم الطبيعة والحياة:</b><br>
        هو طريقة تفكير العالِم التي ندرّب عليها التلميذ داخل الحصة، ويمرّ بـ 6 خطوات أساسية بالترتيب:<br>
        1️⃣ <b>الإحساس بالمشكل:</b> وضع التلميذ أمام وضعية محفزة تثير فضوله للتساؤل.<br>
        2️⃣ <b>صياغة الإشكالية:</b> تحويل المشكل إلى سؤال علمي دقيق.<br>
        3️⃣ <b>اقتراح الفرضيات:</b> تقديم تفسيرات مؤقتة منطقية وقابلة للاختبار.<br>
        4️⃣ <b>التصميم والتقصّي:</b> دراسة السندات والتجارب والوثائق لاختبار الفرضيات.<br>
        5️⃣ <b>التحليل ومناقشة النتائج:</b> استخلاص المعطيات من التجارب.<br>
        6️⃣ <b>الخلاصة والاستنتاج:</b> تدوين النتيجة العلمية المبنية على الكراس (الحوصلة).<br>
        💡 <a href="jil-thani.html#g6" style="color:#007878; font-weight:800;">← راجع شرح المسعى العلمي بالتفصيل في شروحات الجيل الثاني</a>
      `;
    }

    // 2. معايير التقويم والتصحيح
    if (query.includes('معايير') || query.includes('معيار') || query.includes('مؤشر') || query.includes('تقويم') || query.includes('تصحيح') || query.includes('وجاهة')) {
      return `
        <b>📐 معايير ومؤشّرات التقويم في منهاج الجيل الثاني:</b><br>
        لضمان تصحيح موضوعي وعادل في الفروض والاختبارات، نعتمد على 4 معايير أساسية:<br>
        1️⃣ <b>الوجاهة (Pertinence):</b> هل أجاب التلميذ في صميم الموضوع وحسب التعليمة المطلوبة دون خروج؟<br>
        2️⃣ <b>الاستعمال السليم لأدوات المادة:</b> استخراج المعطيات العلمية الدقيقة وتوظيف المصطلحات الخاصة بالعلوم.<br>
        3️⃣ <b>الانسجام (Cohérence):</b> تسلسل الأفكار منطقيًّا وخلوّ الإجابة من التناقضات.<br>
        4️⃣ <b>الإتقان والجمالية:</b> نظافة الورقة، المقروئية، والترتيب.<br>
        💡 <i>قاعدة التوزيع: ¾ من العلامة تخصص للمعايير الثلاثة الأولى، و ¼ لمعيار الإتقان.</i><br>
        <a href="jil-thani.html#g8" style="color:#007878; font-weight:800;">← راجع شبكات التقويم في شروحات الجيل الثاني</a>
      `;
    }

    // 3. الوضعية الانطلاقية والمشكلة
    if (query.includes('وضعية') || query.includes('انطلاقية') || query.includes('مشكل') || query.includes('سياق')) {
      return `
        <b>🧩 الوضعية الانطلاقية المشكلة (Situation-Problème):</b><br>
        هي قلب الجيل الثاني والقاعدة الذهبية: <i>«لا كفاءة بدون وضعية»</i>.<br>
        <b>أنواع الوضعيات:</b><br>
        • <b>وضعية الميدان:</b> تُطرح مرة واحدة في بداية الميدان وتغطيه بالكامل.<br>
        • <b>وضعية المقطع التعلّمي:</b> تفتح المقطع وتثير إشكاليته الدقيقة.<br>
        • <b>وضعية تعلّم المورد:</b> موقف يكتشف عبره التلميذ معلومة أو مهارة واحدة.<br>
        • <b>وضعية الإدماج:</b> يُجنّد فيها التلميذ كل الموارد التي بناها لحل مشكل جديد مركّب.<br>
        ✍️ <b>شروط الصياغة الجيدة:</b> سياق واقعي محفز + سندات واضحة + تعليمات متدرّجة تبدأ بفعل أمر.<br>
        <a href="jil-thani.html#g5" style="color:#007878; font-weight:800;">← تصفح أمثلة الوضعيات في شروحات الجيل الثاني</a>
      `;
    }

    // 4. الكفاءة والمورد والإدماج
    if (query.includes('كفاءة') || query.includes('مورد') || query.includes('إدماج') || query.includes('مركبة')) {
      return `
        <b>📚 قاموس المفاهيم الأساسية للجيل الثاني:</b><br>
        • <b>الكفاءة (Compétence):</b> قدرة التلميذ على تجنيد وتوظيف ما تعلّمه لحل مشكلة واقعية في الحياة، وليست مجرّد حفظ.<br>
        • <b>المركّبة (Composante):</b> هي جزء من الكفاءة الكبيرة يسهل تدريسه وتقويمه.<br>
        • <b>المورد (Ressource):</b> المعلومة أو المهارة الصغيرة (معرفية ومنهجية وقيمية) التي يحتاجها التلميذ لبناء الكفاءة.<br>
        • <b>الإدماج (Intégration):</b> جمع التلميذ لعدة موارد منفصلة وتوظيفها معًا بشكل متناسق لحل وضعية مركبة جديدة.<br>
        <a href="jil-thani.html#g2" style="color:#007878; font-weight:800;">← تصفح قاموس الجيل الثاني الكامل المجاني</a>
      `;
    }

    // 5. إعداد المذكرة
    if (query.includes('مذكرة') || query.includes('تحضير') || query.includes('كيف أعد') || query.includes('بطاقة فنية')) {
      return `
        <b>📝 خطوات إعداد مذكّرة بيداغوجية احترافية:</b><br>
        1️⃣ <b>الترويسة:</b> تحديد المستوى، الميدان، المقطع، رقم المذكرة، الأستاذ، والمدة.<br>
        2️⃣ <b>الأهداف:</b> نقل مركّبات الكفاءة والموارد المستهدفة (معرفية ومنهجية) من المنهاج.<br>
        3️⃣ <b>معايير التقويم:</b> تحديد ما تقيسه وكيفية تحققه من الوثيقة المرافقة.<br>
        4️⃣ <b>سير الحصة:</b> تقويم تشخيصي ← وضعية انطلاقية ← الإشكالية والفرضيات ← تقصي الأنشطة والمناقشة ← إرساء المورد (الحوصلة) ← تقويم تكويني وتحصيلي.<br>
        💡 <a href="maktaba.html" style="color:#007878; font-weight:800;">← يمكنك تحميل نماذج مذكرات جاهزة بصيغة Word و PDF من المكتبة الرقمية</a>
      `;
    }

    // 6. الجيل الثاني أصلًا والمقارنة
    if (query.includes('جيل ثاني') || query.includes('ما هو الجيل الثاني') || query.includes('لماذا غيروا')) {
      return `
        <b>❓ مناهج الجيل الثاني في الجزائر (ابتداءً من 2016):</b><br>
        هي الطبعة المطورة من البرامج الدراسية التي جاءت لعلاج عيوب الجيل الأول (كالتكرار والتركيز على الحفظ).<br>
        <b>الفرق الأساسي:</b> في الجيل الأول كان التركيز على <i>تلقين التلميذ وحفظ المعلومات</i>، أما الجيل الثاني فيركز على <i>اكتساب الكفاءات وبناء التلميذ لمعرفته بنفسه</i> انطلاقاً من وضعيات-مشكلة مستمدة من الواقع.<br>
        <a href="jil-thani.html#g1" style="color:#007878; font-weight:800;">← اقرأ المحور الأول المجاني في شروحات الجيل الثاني</a>
      `;
    }

    // 7. مادة العلوم والدروس (التغذية، المستحاثات، التكتونية...)
    if (query.includes('تغذية') || query.includes('غذاء') || query.includes('1-2-4') || query.includes('مستحاثات') || query.includes('استحاثة') || query.includes('تكتونية') || query.includes('بيولوجيا') || query.includes('جيولوجيا')) {
      return `
        <b>🔬 مادة علوم الطبيعة والحياة (SVT) في التعليم المتوسط:</b><br>
        تهدف المادة لتكوين تلميذ يفهم جسمه وصحته ويحافظ عليها، ويهتم بحماية البيئة والمحيط، ويتقن التفكير التجريبي والمسعى العلمي.<br>
        • <b>قاعدة الوجبة المتوازنة (1-2-4):</b> 4 أغذية بناء ونمو + 2 طاقة + 1 وظيفي.<br>
        • <b>المستحاثات:</b> آثار أو بقايا كائنات حية قديمة حُفظت في الصخور الرسوبية بفضل الدفن السريع.<br>
        💡 <a href="qamous.html" style="color:#007878; font-weight:800;">← ابحث عن أي مصطلح عربي أو فرنسي في القاموس العلمي المختص</a> أو <a href="mokhbar.html" style="color:#007878; font-weight:800;">← جرب محاكاة التجارب في المخابر الافتراضية</a>
      `;
    }

    // 8. الترقية وحقيبة الترقية والتفتيش والتكوين
    if (query.includes('ترقية') || query.includes('حقيبة') || query.includes('تفتيش') || query.includes('مفتش') || query.includes('تشريع') || query.includes('أخلاقيات') || query.includes('تسيير القسم')) {
      return `
        <b>💼 حقيبة الترقية والتفتيش المهنية للأساتذة:</b><br>
        تحتوي منصة SAC SVT prof على ملخصات دقيقة ومكثفة مخصصة لاجتياز امتحانات التثبيت والترقية لأستاذ رئيسي أو أستاذ مكون، وتشمل 10 وحدات أساسية:<br>
        • تعليمية مادة علوم الطبيعة والحياة • التقييم والتقويم • النظام التربوي الجزائري • علوم التربية وعلم النفس • تسيير القسم • التشريع المدرسي • أخلاقيات المهنة • الوساطة المدرسية • هندسة التكوين • الإعلام الآلي.<br>
        💡 <a href="takwin.html" style="color:#007878; font-weight:800;">← انتقل الآن إلى ركن التكوين وحقيبة الترقية لتصفح وتحميل الملخصات</a>
      `;
    }

    // 9. المكتبة، الوثائق، الرفع، والاشتراك
    if (query.includes('مكتبة') || query.includes('وثائق') || query.includes('رفع') || query.includes('اشتراك') || query.includes('دخول') || query.includes('تسجيل')) {
      return `
        <b>📂 إرشادات استخدام المنصة:</b><br>
        • <b>المكتبة الرقمية (` + "`maktaba.html`" + `):</b> تضم مذكرات الأساتذة، الفروض والاختبارات، والعروض التقديمية.<br>
        • <b>وثائق الأستاذ (` + "`wathaiq.html`" + `):</b> التدرجات السنوية، البطاقات الفنية، والوثائق المرافقة للمنهاج.<br>
        • <b>رفع الملفات:</b> يمكن لكل أستاذ مسجل المساهمة برفع مذكراته من زر «➕ رفع ملف أستاذ جديد» في المكتبة لتظهر مجاناً لزملائه.<br>
        • <b>تسجيل الدخول:</b> يتم عبر زر الدخول العلوي أو عبر الرابط المباشر ` + "`login.html`" + `.<br>
        • <b>تطبيق الموبايل:</b> اضغط على زر «📲 تثبيت تطبيق SAC · SVT prof على هاتفك» ليتم تثبيت المنصة على شاشة هاتفك الرئيسية.
      `;
    }

    // الإجابة العامة الذكية عند طرح سؤال متنوع
    return `
      <b>🤖 إجابة المساعد البيداغوجي الذكي (SAC AI):</b><br>
      سؤالك رائع ومهم جداً في الممارسة الميدانية للأستاذ:<br>
      «<i>${escapeHtmlChat(q)}</i>»<br><br>
      في منهاج علوم الطبيعة والحياة (الجيل الثاني)، يُنصح دائماً بربط أي مفهوم بالمسعى التجريبي أو بوضعية انطلاقية مشكلة مستمدة من واقع التلميذ، مع مراعاة معايير التقويم (الوجاهة، أدوات المادة، والانسجام).<br><br>
      💡 <b>لتعميق إجابتك، أدعوكِ للاطلاع على هذه الأقسام المختصة بالمنصة:</b><br>
      • <a href="jil-thani.html" style="color:#007878; font-weight:800;">📗 شروحات الجيل الثاني (دليل الأستاذ المبتدئ)</a><br>
      • <a href="maktaba.html" style="color:#007878; font-weight:800;">📚 المكتبة الرقمية ومذكرات الأساتذة</a><br>
      • <a href="qamous.html" style="color:#007878; font-weight:800;">🔬 القاموس العلمي والمفاهيم البيولوجية</a>
    `;
  }
})();