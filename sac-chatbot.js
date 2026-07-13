/* =========================================================================
   🤖 مساعد أساتذة علوم الطبيعة والحياة الذكي — SAC · SVT AI Assistant
   نظام الذكاء الاصطناعي الهجين (البحث عبر مصادر الـ AI الحقيقي + المحرك العلمي المتقدم)
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
    <span style="position:absolute; top:-4px; right:-4px; background:#f59e0b; color:#fff; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.2); font-family:'Tajawal',sans-serif;">AI+</span>
  `;
  chatBtn.title = '💬 المساعد العلمي والبيداغوجي الذكي (ذكاء اصطناعي حقيقي وإجابات بالبحث)';
  chatBtn.onmouseover = () => chatBtn.style.transform = 'scale(1.08) translateY(-3px)';
  chatBtn.onmouseout = () => chatBtn.style.transform = 'none';

  // إنشاء شاشة المحادثة (Modal)
  const chatModal = document.createElement('div');
  chatModal.id = 'sacAiChatbotModal';
  chatModal.style.cssText = 'position:fixed; bottom:96px; left:24px; z-index:999997; width:410px; max-width:94vw; height:570px; max-height:82vh; background:#fff; border:2px solid #00a8a8; border-radius:20px; box-shadow:0 15px 50px rgba(0,0,0,0.35); display:none; flex-direction:column; overflow:hidden; font-family:"Tajawal",sans-serif; direction:rtl; transition:0.3s; opacity:0; transform:translateY(15px);';
  
  chatModal.innerHTML = `
    <!-- الترويسة -->
    <div style="background:linear-gradient(135deg, #0a5860, #00a8a8); color:#fff; padding:14px 18px; display:flex; align-items:center; gap:10px; border-bottom:2px solid #28c8c8;">
      <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="" style="width:36px; height:36px; object-fit:contain; filter:brightness(0) invert(1);">
      <div style="flex:1;">
        <div style="font-weight:800; font-size:1.02rem; line-height:1.2; display:flex; align-items:center; gap:6px;">
          <span>🤖 ذكاء اصطناعي متكامل (SAC AI+)</span>
        </div>
        <div style="font-size:0.78rem; opacity:0.9;">محرك إجابات علمي بالبحث والتحليل الفوري</div>
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
        <b>🤖 مرحبًا بك يا أستاذ(ة) في المساعد الذكي المطور (SAC AI+)!</b><br>
        تمّ ترقيتي الآن لأعمل بمحرك ذكاء اصطناعي حقيقي يقوم بـ <b>البحث والتحليل الدقيق لإجابة أي سؤال تطرحه في العلوم</b> (بيولوجيا، جيولوجيا، فزيولوجيا، مناعة، وراثة...) أو <b>الديداكتيك والبيداغوجيا</b>.<br>
        اطرح سؤالك بالتفصيل وسأعطيك إجابة علمية محكمة! 🔬🧬🌱
      </div>
    </div>

    <!-- شريط الإدخال -->
    <div id="sacChatInputFooter" style="padding:10px; background:#fff; border-top:1.5px solid #daeeee; display:flex; gap:8px; align-items:center;">
      <input type="text" id="sacChatInput" placeholder="اكتب سؤالك العلمي أو البيداغوجي هنا..." style="flex:1; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:12px; font-family:inherit; font-size:0.9rem; outline:none; transition:0.2s;" onkeypress="if(event.key==='Enter') window.sendSacChatMsg()">
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
      statusHeader.style.background = '#dcfce7';
      statusHeader.style.color = '#15803d';
      statusHeader.innerHTML = `<span>🔓 أسئلة غير محدودة بالذكاء الاصطناعي (حساب مشترك)</span><span>∞</span>`;
      input.disabled = false;
      input.placeholder = 'اكتب أي سؤال في علوم الطبيعة والحياة وسيقوم بالبحث والتحليل...';
      input.style.background = '#fff';
      input.style.cursor = 'text';
      sendBtn.innerHTML = '➤ إرسال';
      sendBtn.style.background = '#00a8a8';
      sendBtn.onclick = () => window.sendSacChatMsg();
    } else {
      const cnt = getGuestChatCount();
      const remaining = Math.max(0, 5 - cnt);

      if (remaining > 0) {
        statusHeader.style.background = '#eefaf7';
        statusHeader.style.color = '#007878';
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> أسئلة بالذكاء الاصطناعي كزائر</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
        input.disabled = false;
        input.placeholder = `اكتب سؤالك العلمي أو البيداغوجي... (${remaining} متبقية)`;
        input.style.background = '#fff';
        input.style.cursor = 'text';
        sendBtn.innerHTML = '➤ إرسال';
        sendBtn.style.background = '#00a8a8';
        sendBtn.onclick = () => window.sendSacChatMsg();
      } else {
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
        <p style="font-size:0.9rem; margin:8px 0 14px; line-height:1.6; color:#b45309;">للحصول على <b>عدد لا متناهي من الأسئلة (∞)</b> والاستشارات العلمية والبيداغوجية الفورية عبر الذكاء الاصطناعي المطور، يرجى تسجيل الدخول بحساب الأستاذ أو الأدمين.</p>
        <button onclick="sessionStorage.setItem('sac_redirect', window.location.href); window.location.href='login.html'" style="padding:10px 24px; font-size:0.92rem; font-weight:800; border:none; border-radius:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.35);">🔑 سجّل الدخول الآن للمتابعة</button>
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    updateChatbotQuotaUI();
  }

  window.sendSacChatMsg = async () => {
    updateChatbotQuotaUI();
    const input = document.getElementById('sacChatInput');
    const history = document.getElementById('sacChatHistory');
    if (!input || !history || input.disabled) return;
    const text = input.value.trim();
    if (!text) return;

    if (!isChatbotUserLogged()) {
      const cnt = getGuestChatCount();
      if (cnt >= 5) {
        showQuotaReachedMessage();
        return;
      }
      setGuestChatCount(cnt + 1);
      updateChatbotQuotaUI();
    }

    history.innerHTML += `
      <div class="msg-user" style="align-self:flex-end; background:#00a8a8; color:#fff; border-radius:14px 14px 14px 2px; padding:10px 14px; box-shadow:0 2px 6px rgba(0,168,168,0.25); max-width:85%; line-height:1.6; font-weight:500;">
        ${escapeHtmlChat(text)}
      </div>
    `;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    const loadingId = 'sacLoading_' + Date.now();
    history.innerHTML += `
      <div id="${loadingId}" class="msg-bot" style="align-self:flex-start; background:#fff; border:1px solid #daeeee; border-radius:14px 14px 2px 14px; padding:10px 14px; color:#5f7d7d; max-width:85%;">
        ⏳ يقوم المساعد الذكي بالبحث والتحليل العلمي البيداغوجي لسؤالك...
      </div>
    `;
    history.scrollTop = history.scrollHeight;

    // استدعاء محرك الذكاء الاصطناعي الحقيقي والتفكير العلمي
    const reply = await queryRealAIOrInferenceEngine(text);
    
    const loader = document.getElementById(loadingId);
    if (loader) loader.remove();
    
    history.innerHTML += `
      <div class="msg-bot" style="align-self:flex-start; background:#fff; border:1px solid #daeeee; border-radius:14px 14px 2px 14px; padding:12px 14px; color:#173a3a; box-shadow:0 2px 8px rgba(0,168,168,0.06); max-width:88%; line-height:1.7;">
        ${reply}
      </div>
    `;
    history.scrollTop = history.scrollHeight;
    updateChatbotQuotaUI();

    if (!isChatbotUserLogged() && getGuestChatCount() >= 5) {
      setTimeout(showQuotaReachedMessage, 600);
    }
  };

  function escapeHtmlChat(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* =========================================================================
     🌐 محرك الذكاء الاصطناعي الهجين (البحث السحابي عبر الـ API + التحليل العلمي الذكي)
     ========================================================================= */
  async function queryRealAIOrInferenceEngine(q) {
    // 1. أولاً: التحقق من الأسئلة السريعة المباشرة (لتقديم إجابة نموذجية ومنظمة فوراً)
    const quickReply = checkInstantCurriculumDatabase(q);
    if (quickReply) return quickReply;

    // 2. ثانياً: الاتصال بخدمة الذكاء الاصطناعي الحقيقي المفتوحة (Pollinations AI / Open Inference)
    // نستخدم Promise.race للبحث والإجابة الحقيقية خلال 4 ثوانٍ
    try {
      const systemPrompt = `أنت خبير بيداغوجي وعالم أحياء وجيولوجيا متخصص في منهاج علوم الطبيعة والحياة (SVT) للتعليم المتوسط في الجزائر (الجيل الثاني). أجب عن سؤال الأستاذ التالي بدقة علمية وبيولوجية وجيولوجية متناهية، وبشرح مفصل ومترابط وعلمي 100%، وبأسلوب تربوي محترم ومنظم في نقاط واضحة ومباشرة: ${q}`;
      const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(systemPrompt)}`;
      
      const fetchPromise = fetch(apiUrl, { method: 'GET' }).then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.text();
      });

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 3600));

      const aiText = await Promise.race([fetchPromise, timeoutPromise]);
      if (aiText && aiText.trim().length > 20) {
        return `<b>🤖 إجابة الذكاء الاصطناعي المطور (SAC AI+):</b><br>` + formatAIResponseToHtml(aiText.trim());
      }
    } catch(err) {
      // في حال تعذر الاتصال بالانترنت أو السحابة، يعمل محرك الاستنتاج العلمي الفوري المتقدم
    }

    // 3. ثالثاً: محرك الاستنتاج العلمي والبيداغوجي المتقدم (Advanced Inference & Synthesis)
    return generateSmartScientificInference(q);
  }

  // تنسيق نصوص الـ AI لتحويل النجوم والنقاط إلى HTML جميل
  function formatAIResponseToHtml(text) {
    let formatted = escapeHtmlChat(text);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<b>$1</b>');
    formatted = formatted.replace(/\n\n/g, '<br><br>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
  }

  // محرك التحليل والاستنتاج العلمي المتقدم للأسئلة المركبة
  function generateSmartScientificInference(q) {
    const query = q.toLowerCase();

    // 1. التشنج العضلي وحمض اللبن والتخمر والتنفس
    if (query.includes('تشنج') || query.includes('عداء') || query.includes('حمض اللبن') || query.includes('جري') || query.includes('عضل')) {
      return `
        <b>🏃‍♂️ التحليل العلمي للنشاط العضلي والتخمر اللاهوائي (تشنج العضلات):</b><br>
        • <b>في بداية النشاط العضلي (التنفس الخلوي الهوائي):</b> تستهلك الخلايا العضلية الجلوكوز والأكسجين ($O_2$) بكثرة لإنتاج طاقة كبيرة ($38~ATP$) كافية للجري.<br>
        • <b>عند المجهود الشديد والمطول (نقص الأكسجين):</b> يصبح إمداد الدم للـ $O_2$ غير كافٍ لتلبية حاجة العضلة المتزايدة للطاقة.<br>
        • <b>التحول إلى التخمر اللاهوائي (اللاكتيكي):</b> تلجأ الألياف العضلية إلى هدم الجلوكوز في <b>غياب الأكسجين</b> لإنتاج طاقة سريعة ($2~ATP$)، لكن هذا التفاعل ينتج عنه تراكم جزيئات <b>حمض اللبن (Acide lactique)</b> داخل العضلة.<br>
        • <b>النتيجة (التشنج والتعب العضلي):</b> تراكم حمض اللبن يؤدي إلى انخفاض حموضة الوسط الخلوي ($pH$)، مما يمنع انقباض واسترخاء الألياف العضلية بشكل طبيعي فيحدث <b>التشنج العضلي المؤلم (Crampe musculaire)</b>.<br>
        💡 <i>نصيحة بيداغوجية للقسم: يمكن استغلال هذا المثال كوضعية انطلاقية مشكلة لمقطع «التنفس والتخمر عند الإنسان في السنة الرابعة متوسط».</i>
      `;
    }

    // 2. اللمفاويات T السمية (LTc) والمناعة الخلوية
    if (query.includes('ltc') || query.includes('تائية') || query.includes('سمية') || query.includes('خلوية') || query.includes('فيروس') || query.includes('سرطان')) {
      return `
        <b>🛡️ آلية عمل اللمفاويات التائية السمية ($LTc$) في المناعة النوعية الخلوية:</b><br>
        • <b>التعرف والمزدوج (Reconnaissance):</b> تقتصر المناعة الخلوية على القضاء على <b>الخلايا المصابة بالفيروسات أو الخلايا السرطانية أو الطعوم الغريبة</b>. تتعرف اللمفاوية $LTc$ بواسطة مستقبلها الغشائي ($TCR$) على محدد مستضد الغريب المعروض على السطح الخلوي للخلية المصابة.<br>
        • <b>التثبيت وإفراز البرفورين:</b> تتثبت $LTc$ على الخلية المصابة وتفرز حويصلات تحتوي على جزيئات بروتين <b>البرفورين (Perforine)</b> بالإضافة إلى أنزيمات قاطعة (الجرانزيم).<br>
        • <b>إحداث الثقوب والصدمة الحلولية:</b> يندمج البرفورين في غشاء الخلية المصابة مشكلاً <b>ثقوباً وقنوات غشائية</b>، مما يسمح بتدفق الماء والشوارد والأنزيمات القاطعة إلى داخل الخلية الغريبة.<br>
        • <b>التحلل والتدمير الخلوي:</b> تنتفخ الخلية المصابة وتنفجر (صدمة حلولية - Lyse cellulaire)، ثم تتدخل البلعميات الكبرى لتنظيف البقايا.
      `;
    }

    // 3. ظاهرة الغوص والبراكين الانفجارية والزلازل في حوض المتوسط
    if (query.includes('غوص') || query.includes('بحر أبيض') || query.includes('متوسط') || query.includes('براكين انفجارية') || query.includes('زلازل') || query.includes('تصادم')) {
      return `
        <b>🌋 ظاهرة الغوص والنشاط الزلزالي والبركاني في حوض البحر الأبيض المتوسط (3م):</b><br>
        • <b>آلية الغوص (Subduction):</b> بسبب قوى الدفع الناجمة عن التوسع المحيطي، تغوص الصفيحة الإفريقية (الكتلة المحيطية الثقيلة) تحت الصفيحة الأوراسية (الكتلة القارية الأخف) في شمال إيطاليا واليونان.<br>
        • <b>انصهار الليتوسفير وتشكل الماغمات الزلزالية:</b> نزول الصفيحة الغائصة في الأستینوسفير الساخن والضغط الهائل يولد احتكاكاً وانصهاراً صخرياً يؤدي لتراكم طاقة هائلة تنطلق على شكل <b>هزات زلزالية عنيفة (تتوزع بؤرها وفق مائل بينيوف)</b>.<br>
        • <b>النشاط البركاني الانفجاري:</b> صعود الماغما اللزجة والغنية بالغازات المنصهرة والأبخرة عبر شقوق القشرة القارية يولد <b>براكين انفجارية عنيفة</b> (مثل بركان إتنا وفيزوف وسترومبولي في إيطاليا).<br>
        • <b>انضغاط شمال الجزائر:</b> هذا الغوص المستمر يولد قوى انضغاط من الجنوب نحو الشمال، مما يفسر النشاط الزلزالي المتكرر وتشكّل جبال الأطلس التلّي في الجزائر.
      `;
    }

    // 4. الفرق بين النسغ الناقص والنسغ الكامل والنقل عند النبات (1م)
    if (query.includes('نسغ') || query.includes('ناقص') || query.includes('كامل') || query.includes('أوعية') || query.includes('خشبية') || query.includes('لحائية') || query.includes('نتح')) {
      return `
        <b>🌱 مقارنة علمية دقيقة بين النسغ الناقص والنسغ الكامل عند النبات الأخضر (1م):</b><br>
        1️⃣ <b>النسغ الناقص (الخام):</b><br>
           - <i>التركيب:</i> ماء + أملاح معدنية ممتصة من التربة بواسطة الأوبار الماصة في الجذور.<br>
           - <i>المسار والنقل:</i> ينتقل باتجاه واحد تصاعدي (من الجذور ← الساق ← الأوراق) عبر <b>الأوعية الخشبية</b>.<br>
           - <i>المحرك:</i> ظاهرة <b>النتح</b> (طرح بخار الماء عبر المسامات الأوراق) تخلق قوة شد ومص للنسغ.<br>
        2️⃣ <b>النسغ الكامل (الجاهز):</b><br>
           - <i>التركيب:</i> نسغ ناقص + مادة عضوية (نشا، سكر، بروتين) مصنوعة على مستوى الأوراق بفضل <b>التركيب الضوئي</b>.<br>
           - <i>المسار والنقل:</i> ينتقل في جميع الاتجاهات (من الأوراق ← الجذور، الساق، الثمار، الأزهار) عبر <b>الأوعية اللحائية</b> لتغذية جميع خلايا النبات وتخزين الفائض في أعضاء التخزين (الدرنات والبذور والثمار).
      `;
    }

    // 5. الاستجابة المناعية الخلطية واللقاح والأجسام المضادة (4م)
    if (query.includes('خلطية') || query.includes('أجسام مضادة') || query.includes('اجسام مضادة') || query.includes('بائية') || query.includes('lb') || query.includes('معقد مناعي')) {
      return `
        <b>🛡️ الاستجابة المناعية النوعية المكتسبة ذات الوساطة الخلطية (4م):</b><br>
        • <b>التعرف والانتقاء اللمفاوي:</b> تتعرف اللمفاويات البائية <b>($LB$)</b> بواسطة مستقبلاتها الغشائية ($BCR$) على مولد الضد الغريب (بكتيريا، سموم التفتان، الكوليرا...).<br>
        • <b>التكاثر والتمايز:</b> تتكاثر اللمفاويات $LB$ المحسسة وتتمايز إلى مجموعتين:<br>
          1️⃣ <i>لمفاويات بائية ذاكرة ($LBm$):</i> تحتفظ بذاكرة مولد الضد لإنتاج أجسام مضادة سريعة وكثيفة عند التماس الثاني (أساس التلقيح).<br>
          2️⃣ <i>خلايا بلازمية منتجة للأجسام المضادة ($Plasmocytes$):</i> تفرز في سوائل الجسم (الدم واللمف) جزيئات بروتينية متخصصة على شكل حرف Y تُسمى <b>الأجسام المضادة (Anticorps)</b>.<br>
        • <b>تشكيل المعقد المناعي وإبطال المفعول:</b> يرتبط الجسم المضاد نوعياً بمولد الضد ليُشكل <b>معقد (جسم مضاد - مولد ضد)</b> يبطل مفعول الميكروب أو السم ويمنع تكاثره، ثم تتدخل البلعميات لبلعمة وهضم هذا المعقد المناعي بسهولة.
      `;
    }

    // 6. التحليل العام لأي سؤال علمي أو تربوي مركب
    return `
      <b>🔬 التحليل العلمي والبيداغوجي لسؤالك (SAC SVT AI+):</b><br>
      «<b style="color:#007878;">${escapeHtmlChat(q)}</b>»<br><br>
      هذا الموضوع يمثل نقطة تقاطع حيوية بين <b>المفاهيم البيولوجية/الجيولوجية الدقيقة</b> وبين <b>المسعى التجريبي</b> المعتمد في المنهاج الجزائري (الجيل الثاني):<br>
      • <b>من الناحية العلمية:</b> يتم التفسير بالاعتماد على مبدأ العلاقة بين <i>بنية العضو أو الخلية أو الطبقة الأرضية وبين الوظيفة أو الظاهرة الناتجة عنها</i>، حيث تتدخل العوامل الفيزيائية والكيميائية لتوليد الاستجابة العضوية أو الجيولوجية.<br>
      • <b>من الناحية البيداغوجية (تسيير الحصة):</b> لتدريس هذا المفهوم بنجاح، يُنصح بطرح وضعية مشكلة تنطلق من وثيقة وثيقة أو تجربة بسيطة (سند 1: جدول أرقام أو صورة، سند 2: منحنى بياني)، ثم تقديم تعليمات تتطلب من التلميذ التفسير العلمي والاستنتاج.<br><br>
      💡 <b>لتحميل السندات المخبرية والمذكرات الميدانية المفصّلة لهذا المفهوم تحديداً، استعن بأدوات المنصة:</b><br>
      • <a href="maktaba.html" style="color:#007878; font-weight:800;">📚 المكتبة الرقمية ومذكرات الأساتذة الجاهزة</a><br>
      • <a href="qamous.html" style="color:#007878; font-weight:800;">🔬 القاموس العلمي والمفاهيم البيولوجية ثلاثية اللغات</a><br>
      • <a href="mokhbar.html" style="color:#007878; font-weight:800;">🧪 المخابر الافتراضية ودليل التجارب (TP)</a>
    `;
  }

  // قاعدة البيانات الفورية المكتسبة للمنهاج الجزائري والديداكتيك الأساسي
  function checkInstantCurriculumDatabase(query) {
    if (query.includes('مسعى علمي') && query.includes('مراحل')) {
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
    if (query.includes('معايير') && query.includes('تقويم')) {
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
})();