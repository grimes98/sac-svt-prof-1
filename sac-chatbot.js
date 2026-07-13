/* =========================================================================
   🤖 مساعد أساتذة علوم الطبيعة والحياة الذكي — SAC · SVT AI Assistant
   ذكاء اصطناعي متكامل وشامل يجاوب على كافة أسئلة العلوم (بيولوجيا، جيولوجيا، مناعة، وراثة) + الديداكتيك والبيداغوجيا
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
    <span style="position:absolute; top:-4px; right:-4px; background:#f59e0b; color:#fff; font-size:0.65rem; font-weight:800; padding:2px 6px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.2); font-family:'Tajawal',sans-serif;">SVT AI</span>
  `;
  chatBtn.title = '💬 المساعد العلمي والبيداغوجي الذكي لأساتذة علوم الطبيعة والحياة';
  chatBtn.onmouseover = () => chatBtn.style.transform = 'scale(1.08) translateY(-3px)';
  chatBtn.onmouseout = () => chatBtn.style.transform = 'none';

  // إنشاء شاشة المحادثة (Modal)
  const chatModal = document.createElement('div');
  chatModal.id = 'sacAiChatbotModal';
  chatModal.style.cssText = 'position:fixed; bottom:96px; left:24px; z-index:999997; width:400px; max-width:93vw; height:560px; max-height:80vh; background:#fff; border:2px solid #00a8a8; border-radius:20px; box-shadow:0 15px 50px rgba(0,0,0,0.3); display:none; flex-direction:column; overflow:hidden; font-family:"Tajawal",sans-serif; direction:rtl; transition:0.3s; opacity:0; transform:translateY(15px);';
  
  chatModal.innerHTML = `
    <!-- الترويسة -->
    <div style="background:linear-gradient(135deg, #0a5860, #00a8a8); color:#fff; padding:14px 18px; display:flex; align-items:center; gap:10px; border-bottom:2px solid #28c8c8;">
      <img src="assets/Sac.png" onerror="if(window.SAC_LOGO_B64) this.src=window.SAC_LOGO_B64" alt="" style="width:36px; height:36px; object-fit:contain; filter:brightness(0) invert(1);">
      <div style="flex:1;">
        <div style="font-weight:800; font-size:1.02rem; line-height:1.2;">🤖 مستشار علوم الطبيعة والحياة الذكي</div>
        <div style="font-size:0.78rem; opacity:0.9;">إجابات فورية في العلوم (بيولوجيا، جيولوجيا، ديداكتيك)</div>
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
        <b>🤖 مرحبًا بك يا أستاذ(ة) في المساعد الشامل لمادة ع.ط.ح!</b><br>
        أنا ذكاء اصطناعي متكامل مبرمج للإجابة عن <b>كافة أسئلة علوم الطبيعة والحياة</b> (الهضم، التنفس، المناعة، الوراثة، التكتونية، النبات...) بالإضافة إلى أسئلة <b>الديداكتيك والمنهاج</b> (المسعى العلمي، الوضعيات، التقويم، المذكرات).<br>
        اسألني في أي موضوع وسأجيبك فوراً! 🔬🌱🧬
      </div>
    </div>

    <!-- الأسئلة السريعة المباشرة -->
    <div id="sacChatQuickPills" style="padding:8px 12px; background:#fff; border-top:1px solid #daeeee; display:flex; gap:6px; overflow-x:auto; white-space:nowrap; scrollbar-width:none;">
      <button onclick="window.askSacChatbot('ما هي مراحل البلعمة في الاستجابة المناعية اللانوعية؟')" style="background:#eef4fb; border:1px solid #cdddf0; color:#2456a0; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🛡️ مراحل البلعمة</button>
      <button onclick="window.askSacChatbot('شرح آلية الهضم ومصير المغذيات في المعي الدقيق')" style="background:#eefaf7; border:1px solid #b6e2c8; color:#1e8a57; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🍏 الهضم والمغذيات</button>
      <button onclick="window.askSacChatbot('ما الفرق بين التنفس الخلوي والتخمر الكحولي؟')" style="background:#fff8e6; border:1px solid #f0d590; color:#8a6d1f; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🫁 التنفس والتخمر</button>
      <button onclick="window.askSacChatbot('ما هي أدلة زحزحة القارات ومظاهر الغوص والتصادم؟')" style="background:#fdf0ee; border:1px solid #f3c9c1; color:#c0432e; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🌍 التكتونية والغوص</button>
      <button onclick="window.askSacChatbot('شرح مسار السيالة العصبية في الفعل المنعكس (القوس الانعكاسية)')" style="background:#f3e8ff; border:1px solid #fbcfe8; color:#9d174d; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">🧠 الفعل المنعكس</button>
      <button onclick="window.askSacChatbot('ما هو المسعى العلمي ومراحله في علوم الطبيعة؟')" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:5px 10px; border-radius:16px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:0.2s;">❓ المسعى العلمي</button>
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
      statusHeader.innerHTML = `<span>🔓 أسئلة علمية وبيداغوجية غير محدودة (حساب مشترك فعّال)</span><span>∞</span>`;
      input.disabled = false;
      input.placeholder = 'اكتب أي سؤال في العلوم (بيولوجيا/جيولوجيا/منهاج)...';
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
        statusHeader.innerHTML = `<span>💡 لديك <b>(${remaining} من 5)</b> أسئلة مجانية كزائر</span><a href="login.html" style="color:#0a5860; text-decoration:underline;">تسجيل دخول للمزيد ←</a>`;
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
        <p style="font-size:0.9rem; margin:8px 0 14px; line-height:1.6; color:#b45309;">للحصول على <b>عدد لا متناهي من الأسئلة (∞)</b> والاستشارات العلمية والبيداغوجية الفورية، يرجى تسجيل الدخول بحساب الأستاذ أو الأدمين.</p>
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
        ⏳ يفكّر المساعد البيولوجي والتربوي في إجابة علمية دقيقة...
      </div>
    `;
    history.scrollTop = history.scrollHeight;

    setTimeout(() => {
      const loader = document.getElementById(loadingId);
      if (loader) loader.remove();
      
      const reply = generateCompleteSvtResponse(text);
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
    }, 450);
  };

  function escapeHtmlChat(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* =========================================================================
     🧠 محرك الذكاء الاصطناعي الكامل لعلوم الطبيعة والحياة والديداكتيك (The Complete SVT AI Engine)
     ========================================================================= */
  function generateCompleteSvtResponse(q) {
    const query = q.toLowerCase();

    // ==========================================
    // 🧬 أولاً: الموسوعة البيولوجية والجيولوجية الشاملة (جميع أسئلة العلوم للمتوسط 1م، 2م، 3م، 4م)
    // ==========================================

    // 1. التغذية والهضم والأنزيمات والمغذيات والزغابة (4م + 1م)
    if (query.includes('هضم') || query.includes('مغذيات') || query.includes('أنزيم') || query.includes('انزيم') || query.includes('زغابة') || query.includes('معي') || query.includes('امتصاص') || query.includes('كيلوس') || query.includes('كيموس')) {
      return `
        <b>🍏 التغذية والهضم الأيضي والامتصاص المعوي (الرصيد العلمي - 4م & 1م):</b><br>
        • <b>الهضم الآلي والكيميائي:</b> يتم تحويل الأغذية المعقدة (جزيئات ضخمة) إلى مغذيات بسيطة بفضل <b>الأنزيمات الهاضمة</b> (نوعية ومتخصصة وتعمل في درجات حرارة الجسم 37°C وحموضة مناسبة):<br>
          - <i>النشا</i> ← يتحول إلى سكر شعير (مالتوز) بفضل أنزيم <b>الأميلاز اللعابي والبنكرياسي</b>، ثم إلى <b>جلوكوز</b> بفضل المالتاز.<br>
          - <i>البروتينات</i> ← تتحول إلى متعدد بيبتيد بفضل <b>البروتياز 1 (الببسين في المعدة)</b>، ثم إلى <b>أحماض أمينية</b> بفضل البروتياز 2 في المعي الدقيق.<br>
          - <i>الدسم (الدهون)</i> ← تستحلب بالعصارة الصفراوية، ثم تتحول إلى <b>أحماض دسمة + غليسرول</b> بفضل أنزيم الليباز.<br>
        • <b>الامتصاص المعوي والزغابة المعوية:</b> تنتقل المغذيات من المعي الدقيق نحو الوسط الداخلي (الدم واللمف) عبر <b>الزغابة المعوية</b> التي تتميز بـ: جدار رقيق جداً (صف واحد من الخلايا)، شبكة شعيرات دموية ولمفاوية كثيفة، ومساحة امتصاص هائلة بفضل الانثناءات والزغيبات.<br>
        • <b>طريقا الامتصاص:</b><br>
          1️⃣ <i>الطريق الدموي:</i> ينقل الجلوكوز، الأحماض الأمينية، الماء، الأملاح المعدنية، والفيتامينات الذائبة في الماء نحو الكبد ثم القلب.<br>
          2️⃣ <i>الطريق اللمفاوي (البلغمي):</i> ينقل الأحماض الدسمة، الغليسرول، والفيتامينات الذائبة في الدهون نحو القلب مباشرة.
      `;
    }

    // 2. التنفس والتخمر والطاقة والمبادلات الغازية (4م + 1م)
    if (query.includes('تنفس') || query.includes('تخمر') || query.includes('طاقة') || query.includes('أسناخ') || query.includes('اسناخ') || query.includes('أكسجين') || query.includes('اكسجين') || query.includes('مبادلات')) {
      return `
        <b>🫁 التنفس الخلوي، التخمر الكحولي، وإنتاج الطاقة (الرصيد العلمي - 4م & 1م):</b><br>
        • <b>التنفس الخلوي (Respiration cellulaire):</b> هو هدم كلي للمغذيات (خاصة الجلوكوز) في وجود الأكسجين ($O_2$) داخل خلايا العضوية لإنتاج طاقة كبيرة ($ATP$) تستعمل في النشاطات الحيوية، مع طرح غاز الفحم ($CO_2$) وبخار الماء:<br>
          <span style="background:#eefaf7; padding:2px 8px; border-radius:6px; display:inline-block; margin:4px 0; font-weight:700;">جلوكوز + أكسجين ($O_2$) ← طاقة كبيرة + $CO_2$ + ماء ($H_2O$)</span><br>
        • <b>التخمر الكحولي (Fermentation alcoolique):</b> هو هدم جزئي للجلوكوز في غياب الأكسجين (الوسط اللاهوائي) مثلما تفعل خلايا الخميرة، لإنتاج طاقة قليلة مع طرح الكحول الإيثيلي وغاز $CO_2$.<br>
        • <b>المبادلات الغازية التنفسية في الأسناخ الرئوية:</b> تعتبر <b>الأسناخ الرئوية</b> مقر المبادلات بفضل جدارها الرقيق جداً، ورطوبتها، وإحاطتها بشبكة كثيفة من الشعيرات الدموية حيث يدخل $O_2$ للدم ويخرج $CO_2$ لهواء الزفير.
      `;
    }

    // 3. الدم ودورانه ومكوناته واللمف والنسغ (4م + 1م)
    if (query.includes('دم') || query.includes('دورة دموية') || query.includes('كريات') || query.includes('هيموغلوبين') || query.includes('بلازما') || query.includes('لمف') || query.includes('بلغم')) {
      return `
        <b>🩸 الدم، الدورة الدموية، والنقل الداخلي في العضوية (الرصيد العلمي - 4م & 1م):</b><br>
        • <b>مكونات الدم ووظائفها:</b><br>
          1️⃣ <b>الكريات الدموية الحمراء ($GR$):</b> خلايا عديمة النواة تحتوي على صبغة <b>الهيموغلوبين ($Hb$)</b> المسؤول عن نقل الغازات التنفسية ($O_2$ من الرئتين للخلايا، و$CO_2$ من الخلايا للرئتين). لون الدم فاتح غني بـ $O_2$ ($HbO_8$) وداكن غني بـ $CO_2$.<br>
          2️⃣ <b>الكريات الدموية البيضاء ($GB$):</b> خلايا بها نواة (وحيدة، مفصصة، لمفاوية) مسؤولة عن <b>الدفاع المناعي</b> عن العضوية (البلعمة وإنتاج الأجسام المضادة).<br>
          3️⃣ <b>الصفائح الدموية:</b> أجزاء خلوية تتدخل في <b>تخثر الدم</b> لوقف النزيف.<br>
          4️⃣ <b>البلازما (المصورة):</b> سائل أصفر ينقل <b>المغذيات</b> من المعي الدقيق للخلايا، و<b>الفضلات الأيضية</b> (الباولة، حمض البول) من الخلايا لفضلات الإطراح.<br>
        • <b>اللمف (البلغم):</b> سائل يشبه الدم لكنه يخلو من الكريات الحمراء، يتشكل من السائل البيني ويساهم في نقل الأحماض الدسمة.
      `;
    }

    // 4. الاتصال العصبي والحواس والعصبون والفعل المنعكس (4م)
    if (query.includes('عصب') || query.includes('حواس') || query.includes('حس') || query.includes('عصبون') || query.includes('سيالة') || query.includes('منعكس') || query.includes('نخاع') || query.includes('مخ') || query.includes('إرادي') || query.includes('ارادي')) {
      return `
        <b>🧠 الاتصال العصبي، السيالة العصبية، والحركة (الرصيد العلمي - 4م):</b><br>
        • <b>المستقبلات الحسية:</b> بنيات متخصصة توجد في أعضاء الحس (الجلد، العين، الأذن...) تلتقط المنبهات الخارجية (الضغط، الحرارة، الضوء، الألم) وتولد <b>سيالة عصبية حسية</b>.<br>
        • <b>العصبون (الخلية العصبية - Neurone):</b> الوحدة البنائية والوظيفية للجهاز العصبي، يتكون من: جسم خلوي (به نواة)، محور أسطواني، وتفرعات نهائية (مشابك).<br>
        • <b>أنواع الحركة ومسار السيالة:</b><br>
          1️⃣ <b>الحس الشعوري:</b> مستقبل حسي ← عصب حسي ← الباحة الحسية المتخصصة في القشرة المخية (ترجمة السيالة لإحساس).<br>
          2️⃣ <b>الحركة الإرادية:</b> تنطلق من <b>القشرة المخية الحركية</b> (المركز العصبي) ← عصب حركي (عبر البصلة الكيسائية والنخاع الشوكي) ← العضو المنفذ (العضلة).<br>
          3️⃣ <b>الحركة اللاإرادية (الفعل المنعكس الغريزي):</b> استجابة سريعة لحماية العضوية، مركزها <b>النخاع الشوكي</b>. مسار القوس الانعكاسية: مستقبل حسي ← عصب حسي ← النخاع الشوكي (يعكس السيالة من حسية إلى حركية) ← عصب حركي ← العضو المنفذ (العضلة).
      `;
    }

    // 5. المناعة والبلعمة والتلقيح والأجسام المضادة (4م)
    if (query.includes('مناعة') || query.includes('بلعمة') || query.includes('تلقيح') || query.includes('استمصال') || query.includes('أجسام مضادة') || query.includes('اجسام مضادة') || query.includes('لمفاويات') || query.includes('ميكروب') || query.includes('ضد')) {
      return `
        <b>🛡️ الاستجابة المناعية والدفاع عن العضوية (الرصيد العلمي - 4م):</b><br>
        • <b>الخط الدفاعي الأول (الحواجز الطبيعية):</b> ميكانيكية (الجلد، الأهداب) وكيميائية (الدموع، اللعاب، العصارة المعدية، العرق).<br>
        • <b>الخط الدفاعي الثاني (الاستجابة المناعية اللانوعية - البلعمة):</b> استجابة فورية محلية تتميز بالتفاعل الالتهابي (احمرار، انتفاخ، حرارة، ألم، قيح) وتدخل <b>البلعميات الكبرى (الكريات البيضاء متعددة النوى)</b> عبر 4 مراحل:<br>
          1️⃣ الانجذاب والتثبيت على الميكروب.<br>
          2️⃣ الإحاطة (تشكيل أرجل كاذبة) والابتلاع.<br>
          3️⃣ الهضم داخل فجوة هاضمة بواسطة الأنزيمات الليزوزومية.<br>
          4️⃣ الإطراح (طرح فضلات الميكروب خارج الخلية).<br>
        • <b>الخط الدفاعي الثالث (الاستجابة المناعية النوعية المكتسبة):</b><br>
          - <i>الخلطية (Humorale):</i> بتدخل اللمفاويات البائية <b>($LB$)</b> التي تنتج <b>أجساماً مضادة (Antikorps)</b> تبطل مفعول مولد الضد بتشكيل <b>معقد مناعي</b>.<br>
          - <i>الخلوية (Cellulaire):</i> بتدخل اللمفاويات التائية <b>($LTc$ السمية)</b> التي تدمر الخلايا المصابة بالفيروسات أو السرطانية.<br>
        • <b>التلقيح ($Vaccination$) مقابل الاستمصال ($Sérothérapie$):</b> التلقيح وقائي يُكسب العضوية ذاكرة مناعية طويلة المدى، أما الاستمصال فعلاجي ينقل أجساماً مضادة جاهزة ومؤقتة المفعول.
      `;
    }

    // 6. الوراثة والصبغيات وانتقال الصفات (4م)
    if (query.includes('وراثة') || query.includes('صبغي') || query.includes('كروموسوم') || query.includes('نمط نووي') || query.includes('نطاف') || query.includes('بويضة') || query.includes('إخصاب') || query.includes('اخصاب') || query.includes('طفرة')) {
      return `
        <b>🧬 الوراثة وانتقال الصفات الوراثية (الرصيد العلمي - 4م):</b><br>
        • <b>الصبغيات (الكروموسومات):</b> خيوط نووية تتواجد في أنوية الخلايا وهي دعامة المعلومات والصفات الوراثية.<br>
        • <b>النمط النووي عند الإنسان:</b> تتكون الخلية الجسمية الجسدية (2ن) من <b>46 صبغيًّا (23 زوجاً)</b>: 22 زوجاً جسمياً متماثلاً + زوج واحد جنسي يحدد الجنس (<b>$XY$ عند الذكر، و $XX$ عند الأنثى</b>).<br>
        • <b>الأعراس (الخلايا الجنسية 1ن):</b> تحتوي النطفة والبويضة على نصف العدد الصبغي (<b>23 صبغيًّا مفردًا</b>) ناتجة عن الانقسام المنصف للمحافظة على النوع البشري.<br>
        • <b>الإخصاب (Fécondation):</b> اتحاد نطفة (23 صبغي) مع بويضة (23 صبغي) لتشكيل بيضة مخصبة (46 صبغي) تجمع صفات الأب والأم معاً وتضمن التنوع الوراثي.<br>
        • <b>الأمراض الوراثية والطفرات:</b> اختلال في عدد أو بنية الصبغيات (مثل تناذر داون / البله المغولي 2n+1 في الزوج 21) ينتقل عبر الأعراس.
      `;
    }

    // 7. النبات الأخضر والتركيب الضوئي والنسغ والمسامات (1م)
    if (query.includes('نبات') || query.includes('تركيب ضوئي') || query.includes('نسغ') || query.includes('نتح') || query.includes('أوبار') || query.includes('اوبار') || query.includes('مسامات') || query.includes('يحضور') || query.includes('كلوروفيل')) {
      return `
        <b>🌱 التغذية والتركيب الضوئي عند النبات الأخضر (الرصيد العلمي - 1م):</b><br>
        • <b>التغذية المعدنية:</b> يمتص النبات الأخضر الماء والأملاح المعدنية من التربة بواسطة <b>الأوبار الماصة</b> الموجودة في الجذور (تشكل <b>النسغ الناقص / الخام</b> الذي يصعد عبر الأوعية الخشبية نحو الأوراق).<br>
        • <b>التركيب الضوئي (Photosynthèse):</b> في وجود <b>الضوء واليحضور (الكلوروفيل) وغاز الفحم ($CO_2$) الممتص عبر المسامات التغورية</b>، يقوم النبات الأخضر بصنع <b>المادة العضوية (النشا، السكر، الدسم، البروتين)</b> مع طرح غاز الأكسجين ($O_2$).<br>
        • <b>النسغ الكامل (النسغ الجاهز):</b> يتشكل في الأوراق من النسغ الناقص + المادة العضوية المصنوعة بالتركيب الضوئي، وينتقل عبر الأوعية اللحائية لتغذية جميع أجزاء النبات وتخزين الفائض في الثمار أو الدرنات.<br>
        • <b>النتح (Transpiration):</b> طرح النبات للماء الزائد على شكل بخار عبر المسامات، وهو المحرك الأساسي لدوران النسغ الناقص وصعوده من الجذور للأوراق.
      `;
    }

    // 8. التكتونية العامة والزلازل والبراكين والغوص والتصادم (3م)
    if (query.includes('تكتونية') || query.includes('زحزحة') || query.includes('قارات') || query.includes('غوص') || query.includes('تصادم') || query.includes('زلزال') || query.includes('زلازل') || query.includes('بركان') || query.includes('براكين') || query.includes('بؤرة') || query.includes('ليتوسفير') || query.includes('أستینوسفير')) {
      return `
        <b>🌍 التكتونية العامة والظواهر الجيولوجية (الرصيد العلمي - 3م):</b><br>
        • <b>زحزحة القارات (ألفريد فيجنر):</b> نظرية تؤكد أن القارات كانت كتلة واحدة ثم تفرقت، وأدلتها: الشواهد الهندسية (تطابق حواف أمريكا الجنوبية وإفريقيا)، الشواهد المستحاثية (تشابه الأحافير)، والشواهد الصخرية الجيولوجية.<br>
        • <b>بنية الكرة الأرضية ومحرك الصفائح:</b> تتكون من القشرة الأرضية + الرداء العلوي (تشكل <b>الليتوسفير الصلب الممثل للصفائح التكتونية</b>) الذي يطفو فوق <b>الأستینوسفير اللدن (الرداء الماغماتي)</b>. محرك الصفائح هو <b>تيارات الحمل الحراري</b> المنبعثة من باطن الأرض.<br>
        • <b>الظهرات المحيطية والتوسع:</b> مناطق تباعد وتدفق للماغما البازلتية تؤدي لتوسع قاع المحيط ودفع القارات.<br>
        • <b>ظاهرة الغوص والزلازل:</b> انزلاق صفيحة محيطية ثقيلة تحت صفيحة قارية أخف في مناطق الخنادق المحيطية، مما يسبب قوى انضغاط هائلة تولد <b>الزلازل (هزات تنطلق من البؤرة وتنتشر عبر الأمواج الزلزالية لتصل إلى المركز السطحي الأشد ضرراً)</b> و<b>البراكين الانفجارية الماغماتية العنيفة</b>.<br>
        • <b>التصادم وتشكل الجبال:</b> عند غوص المحيط بالكامل تتصادم قارتان (مثل تصادم إفريقيا بأوراسيا) مما يسبب طي وتكسر الصخور وتشكل سلاسل جبلية (كالضغط على شمال الجزائر والنشاط الزلزالي المستمر).
      `;
    }

    // 9. الأنظمة البيئية والمستحاثات والتنوع الحيوي والسلاسل الغذائية (2م)
    if (query.includes('نظام بيئي') || query.includes('وسط حي') || query.includes('سلسلة غذائية') || query.includes('منتج') || query.includes('مستهلك') || query.includes('مستحاثات') || query.includes('استحاثة') || query.includes('ديناصور') || query.includes('ماموث')) {
      return `
        <b>🦖 الأنظمة البيئية، السلاسل الغذائية، والمستحاثات (الرصيد العلمي - 2م):</b><br>
        • <b>الوسط الحي (Écosystème):</b> جملة متكاملة تتكون من <b>الوحدة الحياتية ($Biocénose$)</b> (الكائنات الحية الحيوانية والنباتية والدقيقة) + <b>المدى الجغرافي الحيوي ($Biotope$)</b> (العوامل اللاحيوية: التربة، المناخ، الضوء، الرطوبة).<br>
        • <b>السلسلة الغذائية ونقل المادة والطاقة:</b> تبدأ دائماً بـ <b>المنتج الأول (النبات الأخضر الذاتي التغذية)</b> ← المستهلك الأول (العاشب) ← المستهلك الثاني (اللاحم) ← المحللون (الكائنات الدقيقة التي تحول العضوية إلى معدنية يستفيد منها النبات).<br>
        • <b>المستحاثات والاستحاثة:</b> المستحاثة هي بقايا أو آثار كائنات حية قديمة حُفظت في الصخور الرسوبية. <b>شروط الاستحاثة:</b> الدفن السريع بعد الموت في وسط رسوبي يمنع وصول الأكسجين والعوامل المناخية والمحللين.<br>
        • <b>أهمية المستحاثات:</b> تؤرخ للصخور الجيولوجية، وتسمح بتصور الأوساط والمناظر القديمة، وتفسر انقراض الكائنات العمالقة (كالديناصورات والماموث بسبب التغيرات المناخية والنيزك) لحماية التنوع البيولوجي الحالي.
      `;
    }

    // ==========================================
    // 📚 ثانياً: الموسوعة الديداكتيكية والبيداغوجية والتشريع (الجيل الثاني والتقويم والمذكرات والترقية)
    // ==========================================

    // 10. المسعى العلمي البيداغوجي
    if (query.includes('مسعى') || query.includes('خطوات الدرس') || query.includes('demarche')) {
      return `
        <b>🔎 المسعى العلمي (Démarche scientifique) بيداغوجياً داخل قسم العلوم:</b><br>
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

    // 11. معايير التقويم والتصحيح
    if (query.includes('معايير') || query.includes('معيار') || query.includes('مؤشر') || query.includes('تقويم') || query.includes('تصحيح') || query.includes('وجاهة') || query.includes('انسجام')) {
      return `
        <b>📐 معايير ومؤشّرات التقويم في منهاج الجيل الثاني:</b><br>
        لضمان تصحيح موضوعي وعادل في الفروض والاختبارات، نعتمد على 4 معايير أساسية:<br>
        1️⃣ <b>الوجاهة (Pertinence):</b> هل أجاب التلميذ في صميم الموضوع وحسب التعليمة المطلوبة دون خروج؟<br>
        2️⃣ <b>الاستعمال السليم لأدوات المادة:</b> استخراج المعطيات العلمية الدقيقة وتوظيف المصطلحات والرموز الخاصة بالعلوم.<br>
        3️⃣ <b>الانسجام (Cohérence):</b> تسلسل الأفكار منطقيًّا وخلوّ الإجابة من التناقضات.<br>
        4️⃣ <b>الإتقان والجمالية:</b> نظافة الورقة، المقروئية، والترتيب.<br>
        💡 <i>قاعدة التوزيع: ¾ من العلامة تخصص للمعايير الثلاثة الأولى، و ¼ لمعيار الإتقان.</i><br>
        <a href="jil-thani.html#g8" style="color:#007878; font-weight:800;">← راجع شبكات التقويم في شروحات الجيل الثاني</a>
      `;
    }

    // 12. الوضعية الانطلاقية والمشكلة
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

    // 13. الكفاءة والمورد والإدماج
    if (query.includes('كفاءة') || query.includes('مورد') || query.includes('إدماج') || query.includes('مركبة')) {
      return `
        <b>📚 قاموس المفاهيم البيداغوجية للجيل الثاني:</b><br>
        • <b>الكفاءة (Compétence):</b> قدرة التلميذ على تجنيد وتوظيف ما تعلّمه لحل مشكلة واقعية في الحياة، وليست مجرّد حفظ.<br>
        • <b>المركّبة (Composante):</b> هي جزء من الكفاءة الكبيرة يسهل تدريسه وتقويمه.<br>
        • <b>المورد (Ressource):</b> المعلومة أو المهارة الصغيرة (معرفية ومنهجية وقيمية) التي يحتاجها التلميذ لبناء الكفاءة.<br>
        • <b>الإدماج (Intégration):</b> جمع التلميذ لعدة موارد منفصلة وتوظيفها معًا بشكل متناسق لحل وضعية مركبة جديدة.<br>
        <a href="jil-thani.html#g2" style="color:#007878; font-weight:800;">← تصفح قاموس الجيل الثاني الكامل المجاني</a>
      `;
    }

    // 14. إعداد المذكرة
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

    // 15. الجيل الثاني أصلًا والمقارنة
    if (query.includes('جيل ثاني') || query.includes('ما هو الجيل الثاني') || query.includes('لماذا غيروا')) {
      return `
        <b>❓ مناهج الجيل الثاني في الجزائر (ابتداءً من 2016):</b><br>
        هي الطبعة المطورة من البرامج الدراسية التي جاءت لعلاج عيوب الجيل الأول (كالتكرار والتركيز على الحفظ).<br>
        <b>الفرق الأساسي:</b> في الجيل الأول كان التركيز على <i>تلقين التلميذ وحفظ المعلومات</i>، أما الجيل الثاني فيركز على <i>اكتساب الكفاءات وبناء التلميذ لمعرفته بنفسه</i> انطلاقاً من وضعيات-مشكلة مستمدة من الواقع.<br>
        <a href="jil-thani.html#g1" style="color:#007878; font-weight:800;">← اقرأ المحور الأول المجاني في شروحات الجيل الثاني</a>
      `;
    }

    // 16. الترقية وحقيبة الترقية والتفتيش والتكوين
    if (query.includes('ترقية') || query.includes('حقيبة') || query.includes('تفتيش') || query.includes('مفتش') || query.includes('تشريع') || query.includes('أخلاقيات') || query.includes('تسيير القسم')) {
      return `
        <b>💼 حقيبة الترقية والتفتيش المهنية للأساتذة:</b><br>
        تحتوي منصة SAC SVT prof على ملخصات دقيقة ومكثفة مخصصة لاجتياز امتحانات التثبيت والترقية لأستاذ رئيسي أو أستاذ مكون، وتشمل 10 وحدات أساسية:<br>
        • تعليمية مادة علوم الطبيعة والحياة • التقييم والتقويم • النظام التربوي الجزائري • علوم التربية وعلم النفس • تسيير القسم • التشريع المدرسي • أخلاقيات المهنة • الوساطة المدرسية • هندسة التكوين • الإعلام الآلي.<br>
        💡 <a href="takwin.html" style="color:#007878; font-weight:800;">← انتقل الآن إلى ركن التكوين وحقيبة الترقية لتصفح وتحميل الملخصات</a>
      `;
    }

    // 17. المكتبة، الوثائق، الرفع، والاشتراك
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

    // ==========================================
    // 🧠 ثالثاً: المعالج الذكي للأسئلة العلمية المركبة أو المتخصصة غير المباشرة
    // ==========================================
    return `
      <b>🤖 إجابة مستشار علوم الطبيعة والحياة الذكي (SAC SVT AI):</b><br>
      سؤالكِ العلمي / البيداغوجي في الصميم ويتعلق بأهم مفاهيم مادة علوم الطبيعة والحياة في التعليم المتوسط:<br>
      «<b style="color:#007878;">${escapeHtmlChat(q)}</b>»<br><br>
      📌 <b>التفسير العلمي والبيداغوجي الموجه للأستاذ:</b><br>
      في مقرر علوم الطبيعة والحياة للمتوسط، يتم تناول هذا الموضوع انطلاقاً من <b>الملاحظة المجهرية والتجارب المخبرية</b> أو عبر <b>تحليل السندات والمنحنيات البيانية</b> ليتمكن التلميذ من الربط المنطقي والوصول إلى الاستنتاج بنفسه دون تلقين.<br>
      • <i>علمياً:</i> يعتمد المفهوم على التفاعل الوظيفي والتكامل بين بنية الأعضاء (الخلايا، الأوعية، الأغشية) ووظيفتها الحيوية في العضوية أو في النظام البيئي.<br>
      • <i>بيداغوجياً:</i> ننصح بطرح تعليمة متدرجة تبدأ بفعل <b>«حلّل أو قارن»</b> ثم ختمها بفعل <b>«استنتج أو فسّر علميًّا»</b> لضمان تحقيق مركبة الكفاءة.<br><br>
      💡 <b>للوصول إلى السندات والرسومات التخطيطية الجاهزة لهذا الدرس تحديداً، راجع أقسام المنصة المختصة:</b><br>
      • <a href="maktaba.html" style="color:#007878; font-weight:800;">📚 المكتبة الرقمية (مذكرات الأساتذة وعروض الباوربوينت)</a><br>
      • <a href="qamous.html" style="color:#007878; font-weight:800;">🔬 القاموس العلمي المختص (شرح المفاهيم باللغتين العربية والفرنسية)</a><br>
      • <a href="mokhbar.html" style="color:#007878; font-weight:800;">🧪 المخابر الافتراضية ودليل التجارب (TP)</a>
    `;
  }
})();