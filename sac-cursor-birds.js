/* =========================================================================
   👑🌌📅 محرك SAC · SVT prof الفخم للمؤثرات البصرية، الفصول الأربعة، والتاريخ والوقت
   (Day Mode: 4-Seasons Botanical Leaves & Maple Animation | Night Mode: Cosmic Shooting Stars)
   تم برمجة تساقط وتطاير أوراق الشجر حسب الفصول (الخريف، الصيف، الربيع، الشتاء) بدقة عالية
   ========================================================================= */

(function() {
  if (window._sacThemeEngineInitialized) return;
  window._sacThemeEngineInitialized = true;

  // 1. تحديد وحفظ حالة الثيم (النهار أو الليل) والفصل الحالي (الربيع، الصيف، الخريف، الشتاء)
  window.sacCurrentTheme = localStorage.getItem('sac_theme') || 'light';
  
  const month = new Date().getMonth() + 1; // 1 to 12
  if (month >= 3 && month <= 5) {
    window.sacCurrentSeason = 'spring';   // 🌸 الربيع (مارس، أفريل، ماي)
  } else if (month >= 6 && month <= 8) {
    window.sacCurrentSeason = 'summer';   // ☀️ الصيف (جوان، جويلية، أوت)
  } else if (month >= 9 && month <= 11) {
    window.sacCurrentSeason = 'autumn';   // 🍂 الخريف (سبتمبر، أكتوبر، نوفمبر)
  } else {
    window.sacCurrentSeason = 'winter';   // ❄️ الشتاء (ديسمبر، جانفي، فيفري)
  }

  // 2. إنشاء وتجهيز كانفاس الخلفية
  const canvas = document.createElement('canvas');
  canvas.id = 'sacCursorBirdsCanvas';
  canvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; overflow:hidden; transition:opacity 0.8s ease;';
  
  function attachCanvas() {
    if (document.body) {
      document.body.appendChild(canvas);
      applyThemeVisuals();
    } else {
      setTimeout(attachCanvas, 30);
    }
  }
  attachCanvas();

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth || 1000;
  let height = canvas.height = window.innerHeight || 800;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth || 1000;
    height = canvas.height = window.innerHeight || 800;
  });

  const mouse = {
    x: width / 2,
    y: height / 2,
    isIdle: true,
    lastMove: Date.now()
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isIdle = false;
    mouse.lastMove = Date.now();
  }, { passive: true });

  setInterval(() => {
    if (Date.now() - mouse.lastMove > 1800) {
      mouse.isIdle = true;
    }
  }, 300);

  // =========================================================================
  // 🍃 أولاً: محرك أوراق الشجر الطبيعية التفاعلية (الفصول الأربعة — 4-Seasons Leaf Engine)
  // (أوراق خريفية قيقبية ذهبية، أوراق صيفية خضراء وذهبية، بتلات ربيع، وبلورات شتاء)
  // =========================================================================
  class SeasonalLeaf {
    constructor() {
      this.reset(true);
    }
    reset(randomStart = false) {
      this.x = Math.random() * width;
      this.y = randomStart ? Math.random() * height : -40 - Math.random() * 80;
      this.size = 11 + Math.random() * 13;
      this.vy = 0.7 + Math.random() * 1.3;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.swaySpeed = 0.02 + Math.random() * 0.02;
      this.swayOffset = Math.random() * Math.PI * 2;

      const season = window.sacCurrentSeason;
      if (season === 'autumn') {
        const colors = ['#f59e0b', '#d97706', '#b45309', '#ea580c', '#fbbf24', '#c2410c'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'maple';
      } else if (season === 'spring') {
        const colors = ['#34d399', '#10b981', '#6ee7b7', '#f472b6', '#fbcfe8', '#059669'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'oval';
      } else if (season === 'winter') {
        const colors = ['#38bdf8', '#7dd3fc', '#bae6fd', '#e2e8f0', '#94a3b8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'crystal';
      } else {
        // الصيف (جوان، جويلية، أوت - الحالي)
        const colors = ['#14b8a6', '#0d9488', '#2dd4bf', '#facc15', '#eab308', '#84cc16'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = Math.random() > 0.4 ? 'oval' : 'sunLeaf';
      }
    }

    update() {
      this.y += this.vy;
      this.x += Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * 0.7 + this.vx;
      this.angle += this.rotationSpeed;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        this.x -= (dx / dist) * 2.2;
        this.y -= (dy / dist) * 1.5;
      }

      if (this.y > height + 50 || this.x < -80 || this.x > width + 80) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.beginPath();
      if (this.leafType === 'maple') {
        // ورقة قيقبية خريفية مجزأة ومميزة (Maple Leaf - مثل فيديو الفيسبوك الريلز)
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.4, -this.size * 0.4);
        ctx.lineTo(this.size, -this.size * 0.3);
        ctx.lineTo(this.size * 0.5, this.size * 0.2);
        ctx.lineTo(this.size * 0.7, this.size * 0.9);
        ctx.lineTo(0, this.size * 0.5);
        ctx.lineTo(-this.size * 0.7, this.size * 0.9);
        ctx.lineTo(-this.size * 0.5, this.size * 0.2);
        ctx.lineTo(-this.size, -this.size * 0.3);
        ctx.lineTo(-this.size * 0.4, -this.size * 0.4);
        ctx.closePath();
      } else if (this.leafType === 'crystal') {
        // بلورة شتوية
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.5, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.5, 0);
        ctx.closePath();
      } else {
        // ورقة نباتية بيضاوية انسيابية (Botanical Oval Leaf)
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.85, -this.size * 0.5, this.size * 0.85, this.size * 0.5, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.85, this.size * 0.5, -this.size * 0.85, -this.size * 0.5, 0, -this.size);
        ctx.closePath();
      }

      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = 0.78;
      ctx.fill();

      // العصب الوسطي لورقة الشجر (Leaf Vein Detail)
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.8);
      ctx.lineTo(0, this.size * 0.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.restore();
    }
  }

  const seasonalLeaves = [];
  for (let i = 0; i < 30; i++) {
    seasonalLeaves.push(new SeasonalLeaf());
  }

  // =========================================================================
  // 🌌 ثانياً: محرك النجوم البراقة والشهب المتحركة (الليل — Shooting Stars)
  // =========================================================================
  class Star {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = 0.8 + Math.random() * 1.6;
      this.baseAlpha = 0.2 + Math.random() * 0.6;
      this.twinkleSpeed = 0.015 + Math.random() * 0.03;
      this.twinkleOffset = Math.random() * Math.PI * 2;
    }
    update() {
      this.alpha = this.baseAlpha + Math.sin(Date.now() * this.twinkleSpeed + this.twinkleOffset) * 0.25;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 1) this.alpha = 1;
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset(true);
    }
    reset(randomStart = false) {
      if (randomStart) {
        this.x = Math.random() * (width + 300);
        this.y = Math.random() * height * 0.6 - 150;
      } else {
        this.x = Math.random() * width * 0.8 + width * 0.3;
        this.y = -50 - Math.random() * 100;
      }
      const speed = 7 + Math.random() * 9;
      const angle = (140 + (Math.random() - 0.5) * 15) * (Math.PI / 180);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.tailLength = 60 + Math.random() * 90;
      this.size = 2.2 + Math.random() * 1.8;
      this.color = Math.random() > 0.3 ? '#2dd4bf' : '#38bdf8';
      this.alpha = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -200 || this.y > height + 200) {
        this.reset();
      }
    }
    draw(ctx) {
      ctx.save();
      const tailX = this.x - (this.vx / Math.hypot(this.vx, this.vy)) * this.tailLength;
      const tailY = this.y - (this.vy / Math.hypot(this.vx, this.vy)) * this.tailLength;

      const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, this.color);
      grad.addColorStop(0.3, 'rgba(45, 212, 191, 0.6)');
      grad.addColorStop(1, 'rgba(13, 148, 136, 0)');

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.fill();

      ctx.restore();
    }
  }

  const stars = [];
  for (let i = 0; i < 65; i++) {
    stars.push(new Star());
  }
  const shootingStars = [];
  for (let i = 0; i < 7; i++) {
    shootingStars.push(new ShootingStar());
  }

  // =========================================================================
  // 🎨 ثالثاً: إدارة الألوان الفصليّة واللوقو وزر تبديل النهار/الليل (Theme Controller)
  // =========================================================================
  function applyThemeVisuals() {
    if (canvas) {
      canvas.style.opacity = window.sacCurrentTheme === 'dark' ? '0.88' : '0.52';
    }

    let darkStyle = document.getElementById('sacDarkThemeStyles');
    let dayStyle = document.getElementById('sacDayThemeStyles');

    if (window.sacCurrentTheme === 'dark') {
      if (dayStyle) dayStyle.remove();
      if (!darkStyle) {
        darkStyle = document.createElement('style');
        darkStyle.id = 'sacDarkThemeStyles';
        darkStyle.innerHTML = `
          /* =========================================================================
             🌙 وضع الظلام الكوني (SAC Cosmic Dark Mode - High Contrast & Legibility)
             ========================================================================= */
          :root {
            --green: #2dd4bf !important;
            --green-d: #38bdf8 !important;
            --green-l: #5eead4 !important;
            --gold: #facc15 !important;
            --bg: #0b111e !important;
            --card: #151f32 !important;
            --ink: #f8fafc !important;
            --muted: #cbd5e1 !important;
            --line: rgba(45, 212, 191, 0.3) !important;
            --shadow: 0 12px 35px rgba(0, 0, 0, 0.75) !important;
          }
          body, html {
            background: #0b111e !important;
            color: #f8fafc !important;
          }
          header, .header, #header {
            background: rgba(15, 23, 42, 0.96) !important;
            border-bottom: 1px solid rgba(45, 212, 191, 0.35) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8) !important;
          }
          .card, .card-box, .intro, .intro-box, .qa-box, .panel, .panel-in, .acc-item, .modal, #authLogin, #authReg, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .table-wrap, table, th, td, .comment-card, .reply-card, .dlbox, .example, .newbie, .setup-banner, .strat, .tip, .tips {
            background: #151f32 !important;
            color: #f8fafc !important;
            border-color: rgba(45, 212, 191, 0.3) !important;
          }
          h1, h2, h3, h4, h5, h6, .sec-title, .card h3, .card-header h3, .qa-q .qtext, .brand span, .logo-box h1, .intro h2, .intro-box h2, .docgroup .gh h3, .struct .head, .def .term, .hubcard .htx b, .c-name {
            color: #38bdf8 !important;
          }
          p, span, div, li, td, th, label, .card p, .intro p, .intro-box p, .qa-a-body, .panel-in p, .struct .el .d, .def .body, .hubcard .htx span, .c-text, .dltx b {
            color: #f8fafc !important;
          }
          .hint, .sub, .sec-sub, .dltx span, .card-meta, .c-date, .n, .lbl {
            color: #cbd5e1 !important;
          }
          a, .go, .back, .arrow, .btn-nav, .nav-links a {
            color: #2dd4bf !important;
          }
          .nav-links a:hover, .btn-nav:hover, .back:hover {
            background: rgba(45, 212, 191, 0.2) !important;
            color: #f8fafc !important;
          }
          .btn, .btn.gold, .acc-btn, .nav-free, .qnum, .card-header-ic, .dlic, .gic {
            color: #ffffff !important;
          }
          .badge, .hero-tag, .newbie b, .why b, .example b, .note b {
            color: #facc15 !important;
          }
          .btn.ghost, .hero .cta .btn.ghost {
            background: rgba(15, 23, 42, 0.88) !important;
            color: #38bdf8 !important;
            border: 2px solid #38bdf8 !important;
          }
          .btn.ghost:hover {
            background: #38bdf8 !important;
            color: #0b111e !important;
          }
          .hero .cta .btn.gold, .btn.gold {
            background: linear-gradient(135deg, #facc15, #ca8a04) !important;
            color: #0f172a !important;
            font-weight: 800 !important;
            border: none !important;
          }
          .tag, .lock-badge, [style*="background:#fde9d6"], [style*="background: #fde9d6"], [style*="background:#fef3c7"], [style*="background: #fef3c7"], [style*="background:#fef08a"], [style*="background: #fef08a"], [style*="background:#fff1f2"], [style*="background: #fff1f2"] {
            background: rgba(250, 204, 21, 0.18) !important;
            color: #facc15 !important;
            border: 1px solid #facc15 !important;
          }
          [style*="background:#d9f5e7"], [style*="background: #d9f5e7"], [style*="background:#dcfce7"], [style*="background: #dcfce7"], [style*="background:#e0f2fe"], [style*="background: #e0f2fe"], [style*="background:#f0fdf4"], [style*="background: #f0fdf4"] {
            background: rgba(45, 212, 191, 0.18) !important;
            color: #2dd4bf !important;
            border: 1px solid #2dd4bf !important;
          }
          .panel-in div[style*="background:#fef3c7"], div[style*="background:#fef3c7"], div[style*="background: #fef3c7"] {
            background: #1e293b !important;
            border: 2px solid #facc15 !important;
            color: #f8fafc !important;
          }
          .panel-in div[style*="background:#fef3c7"] h3, div[style*="background:#fef3c7"] h3 {
            color: #facc15 !important;
          }
          .panel-in div[style*="background:#fef3c7"] p, div[style*="background:#fef3c7"] p {
            color: #cbd5e1 !important;
          }
          .search-wrap input, #globalSearch {
            background: #1e293b !important;
            color: #f8fafc !important;
            border: 2px solid #38bdf8 !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.65) !important;
          }
          .search-wrap .ico {
            color: #38bdf8 !important;
            opacity: 1 !important;
          }
          [style*="color:#173a3a"], [style*="color: #173a3a"], [style*="color:#0a5860"], [style*="color: #0a5860"], [style*="color:#007878"], [style*="color: #007878"], [style*="color:#00a8a8"], [style*="color: #00a8a8"], [style*="color:#5f7d7d"], [style*="color: #5f7d7d"], [style*="color:#333"], [style*="color:#000"] {
            color: #f8fafc !important;
          }
          [style*="color:#8fded4"], [style*="color: #8fded4"], [style*="color:#25D366"] {
            color: #2dd4bf !important;
          }
          input, textarea, select {
            background: #0f172a !important;
            color: #f8fafc !important;
            border-color: rgba(45, 212, 191, 0.4) !important;
          }
          input::placeholder, textarea::placeholder {
            color: #94a3b8 !important;
          }
          .hero, .dash-hero, .dash-hero h2, .hero h1, .hero p, .hero span {
            background: linear-gradient(135deg, #042f2e 0%, #0f172a 60%, #115e59 100%) !important;
            color: #ffffff !important;
          }
          .hero h1, .dash-hero h2 {
            color: #38bdf8 !important;
          }
          #sacDateTimeWidget {
            background: rgba(15, 23, 42, 0.85) !important;
            border-color: rgba(45, 212, 191, 0.45) !important;
            color: #f8fafc !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;
          }
          #sacDateTimeWidget span {
            color: #f8fafc !important;
          }
          #sacDateTimeWidget .sac-clock-badge {
            background: rgba(45, 212, 191, 0.2) !important;
            border-color: #2dd4bf !important;
            color: #38bdf8 !important;
          }
        `;
        document.head.appendChild(darkStyle);
      }
    } else {
      if (darkStyle) darkStyle.remove();
      if (!dayStyle) {
        let seasonBgGradient = 'linear-gradient(135deg, #fefce8 0%, #fef9c3 45%, #ecfdf5 100%)'; // ☀️ الصيف (افتراضي في جويلية)
        if (window.sacCurrentSeason === 'spring') {
          seasonBgGradient = 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #e0f2fe 100%)'; // 🌸 الربيع
        } else if (window.sacCurrentSeason === 'autumn') {
          seasonBgGradient = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)'; // 🍂 الخريف
        } else if (window.sacCurrentSeason === 'winter') {
          seasonBgGradient = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'; // ❄️ الشتاء
        }

        dayStyle = document.createElement('style');
        dayStyle.id = 'sacDayThemeStyles';
        dayStyle.innerHTML = `
          /* =========================================================================
             ☀️ واجهة النهار الفصول الأربعة الفخمة (SAC Royal Seasonal Day Mode)
             ========================================================================= */
          :root {
            --green: #0d9488 !important;
            --green-d: #042f2e !important;
            --green-l: #14b8a6 !important;
            --gold: #d97706 !important;
            --bg: #f8fafc !important;
            --card: #ffffff !important;
            --ink: #0f172a !important;
            --muted: #475569 !important;
            --line: rgba(13, 148, 136, 0.22) !important;
            --shadow: 0 15px 35px rgba(13, 148, 136, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04) !important;
          }
          body, html {
            background: ${seasonBgGradient} !important;
            color: #0f172a !important;
          }
          header, .header, #header {
            background: rgba(255, 255, 255, 0.95) !important;
            border-bottom: 2px solid #0d9488 !important;
            box-shadow: 0 4px 20px rgba(13, 148, 136, 0.12) !important;
          }
          .card, .card-box, .intro, .intro-box, .qa-box, .panel, .panel-in, .acc-item, .modal, #authLogin, #authReg, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .table-wrap, .strat, .tip, .tips {
            background: #ffffff !important;
            border: 1.5px solid rgba(13, 148, 136, 0.22) !important;
            box-shadow: 0 15px 35px rgba(13, 148, 136, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
          }
          .card:hover, .card-box:hover, .strat:hover, .hubcard:hover {
            transform: translateY(-6px) !important;
            box-shadow: 0 20px 45px rgba(13, 148, 136, 0.18) !important;
            border-color: #0d9488 !important;
          }
          h1, h2, h3, h4, h5, h6, .sec-title, .card h3, .card-header h3, .qa-q .qtext, .brand span, .logo-box h1, .intro h2, .intro-box h2, .docgroup .gh h3, .struct .head, .def .term, .hubcard .htx b, .c-name {
            color: #042f2e !important;
            font-weight: 800 !important;
          }
          p, .card p, .intro p, .intro-box p, .qa-a-body, .panel-in p, .struct .el .d, .def .body, .hubcard .htx span, .c-text {
            color: #1e293b !important;
            font-weight: 500 !important;
          }
          .hint, .sub, .sec-sub, .dltx span, .card-meta, .c-date, .n, .lbl {
            color: #475569 !important;
          }
          .hero, .dash-hero {
            background: linear-gradient(135deg, #042f2e 0%, #0d9488 50%, #14b8a6 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 15px 40px rgba(13, 148, 136, 0.25) !important;
          }
          .hero h1, .dash-hero h2, .hero p, .hero span {
            color: #ffffff !important;
          }
          .badge, .hero-tag {
            background: rgba(250, 204, 21, 0.2) !important;
            color: #facc15 !important;
            border: 1px solid #facc15 !important;
          }
          .btn, .acc-btn, .nav-free, .qnum, .card-header-ic, .dlic, .gic {
            background: linear-gradient(135deg, #0d9488, #14b8a6) !important;
            color: #ffffff !important;
            box-shadow: 0 6px 18px rgba(13, 148, 136, 0.3) !important;
          }
          .btn.gold, .hero .cta .btn.gold {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: #ffffff !important;
            box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35) !important;
          }
          .search-wrap input, #globalSearch {
            background: #ffffff !important;
            color: #0f172a !important;
            border: 2px solid #0d9488 !important;
            box-shadow: 0 12px 35px rgba(13, 148, 136, 0.15) !important;
          }
          #sacDateTimeWidget {
            background: rgba(255, 255, 255, 0.75) !important;
            border-color: rgba(13, 148, 136, 0.35) !important;
            color: #1e293b !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
          }
          #sacDateTimeWidget span {
            color: #1e293b !important;
          }
          #sacDateTimeWidget .sac-clock-badge {
            background: rgba(13, 148, 136, 0.12) !important;
            border-color: #0d9488 !important;
            color: #0f766e !important;
          }
        `;
        document.head.appendChild(dayStyle);
      }
    }

    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (src.includes('Sac.png') || src.includes('Sac-dark.png') || src.includes('Sac%20(3)') || img.classList.contains('hero-logo')) {
        if (window.sacCurrentTheme === 'dark') {
          img.setAttribute('src', 'assets/Sac-dark.png');
        } else {
          img.setAttribute('src', 'assets/Sac.png');
        }
      }
    });

    updateToggleButtonUI();
  }

  window.sacToggleTheme = function() {
    window.sacCurrentTheme = (window.sacCurrentTheme === 'light') ? 'dark' : 'light';
    localStorage.setItem('sac_theme', window.sacCurrentTheme);
    applyThemeVisuals();
  };

  function updateToggleButtonUI() {
    const btn = document.getElementById('sacThemeToggleBtn');
    if (!btn) return;
    if (window.sacCurrentTheme === 'dark') {
      btn.innerHTML = `<span style="font-size:1.15rem">☀️</span> <span style="font-weight:800;font-size:0.9rem">النهار</span>`;
      btn.title = "تبديل إلى وضع النهار (Light Mode)";
      btn.style.background = "linear-gradient(135deg, #1e293b, #334155)";
      btn.style.color = "#facc15";
      btn.style.borderColor = "#facc15";
    } else {
      btn.innerHTML = `<span style="font-size:1.15rem">🌙</span> <span style="font-weight:800;font-size:0.9rem">الليل</span>`;
      btn.title = "تبديل إلى وضع الظلام (Dark Mode)";
      btn.style.background = "linear-gradient(135deg, #0d9488, #14b8a6)";
      btn.style.color = "#ffffff";
      btn.style.borderColor = "#0d9488";
    }
  }

  // =========================================================================
  // 📅 رابعاً: حقن ودجت التاريخ والوقت (Glassmorphism Date/Time Clock Widget)
  // =========================================================================
  function updateDateTimeWidget() {
    const el = document.getElementById('sacDateTimeContent');
    if (!el) return;

    const now = new Date();
    const optionsGregorian = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Algiers' };
    const gregorianStr = new Intl.DateTimeFormat('ar-DZ', optionsGregorian).format(now);

    let hijriStr = '2 صفر 1448 هـ';
    try {
      const optionsHijri = { day: 'numeric', month: 'long', year: 'numeric', calendar: 'islamic-umalqura', timeZone: 'Africa/Algiers' };
      hijriStr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', optionsHijri).format(now);
      if (!hijriStr.includes('هـ')) hijriStr += ' هـ';
    } catch(e) {}

    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Algiers' };
    const timeStr = new Intl.DateTimeFormat('en-GB', optionsTime).format(now);

    const seasonEmoji = window.sacCurrentSeason === 'spring' ? '🌸' : (window.sacCurrentSeason === 'summer' ? '☀️' : (window.sacCurrentSeason === 'autumn' ? '🍂' : '❄️'));
    const seasonName = window.sacCurrentSeason === 'spring' ? 'الربيع' : (window.sacCurrentSeason === 'summer' ? 'الصيف' : (window.sacCurrentSeason === 'autumn' ? 'الخريف' : 'الشتاء'));

    el.innerHTML = `
      <span style="font-weight:700;">${seasonEmoji} ${seasonName} | 📅 ${gregorianStr}</span>
      <span style="color:#0d9488; font-weight:800; margin:0 4px;">•</span>
      <span style="font-weight:700;">☪ ${hijriStr}</span>
      <span class="sac-clock-badge" style="display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:10px; border:1px solid #0d9488; font-family:monospace; font-weight:800; font-size:0.85rem; letter-spacing:0.5px;">⏰ ${timeStr} GMT+1</span>
    `;
  }

  function injectHeaderWidgets() {
    if (!document.getElementById('sacThemeToggleBtn')) {
      const btn = document.createElement('button');
      btn.id = 'sacThemeToggleBtn';
      btn.onclick = window.sacToggleTheme;
      btn.style.cssText = 'display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; border:1.5px solid #0d9488; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,0.25); transition:all 0.25s ease; font-family:inherit; z-index:10001; margin-inline-start:10px;';
      
      const nav = document.querySelector('.nav') || document.querySelector('header .container') || document.querySelector('.nav-actions');
      if (nav) {
        const back = nav.querySelector('.back') || nav.querySelector('.nav-links');
        if (back) {
          nav.insertBefore(btn, back);
        } else {
          nav.appendChild(btn);
        }
      } else if (document.body) {
        btn.style.position = 'fixed';
        btn.style.top = '14px';
        btn.style.left = '16px';
        document.body.appendChild(btn);
      }
      updateToggleButtonUI();
    }

    if (!document.getElementById('sacDateTimeWidget')) {
      const widget = document.createElement('div');
      widget.id = 'sacDateTimeWidget';
      widget.style.cssText = 'display:inline-flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:8px; background:rgba(255,255,255,0.75); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1.5px solid rgba(13,148,136,0.35); padding:6px 16px; border-radius:20px; font-size:0.82rem; font-weight:600; color:#1e293b; box-shadow:0 4px 15px rgba(0,0,0,0.06); transition:all 0.3s ease; margin: 4px auto 0; max-width:98%; text-align:center; z-index:10000;';
      widget.innerHTML = `<div id="sacDateTimeContent" style="display:flex; align-items:center; flex-wrap:wrap; justify-content:center; gap:6px;"></div>`;

      const header = document.querySelector('header');
      if (header) {
        header.appendChild(widget);
      } else if (document.body) {
        widget.style.position = 'fixed';
        widget.style.top = '72px';
        widget.style.left = '50%';
        widget.style.transform = 'translateX(-50%)';
        document.body.appendChild(widget);
      }

      updateDateTimeWidget();
      setInterval(updateDateTimeWidget, 1000);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applyThemeVisuals();
    injectHeaderWidgets();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      applyThemeVisuals();
      injectHeaderWidgets();
    });
  }

  // =========================================================================
  // 🎬 خامساً: حلقة التنشيط المستمرة (Animation Loop - شهب الليل وأوراق الفصول للنهار)
  // =========================================================================
  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (window.sacCurrentTheme === 'dark') {
      // 🌌 وضع الظلام الكوني: النجوم والشهب البراقة (Shooting Stars)
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      shootingStars.forEach(sStar => {
        sStar.update();
        sStar.draw(ctx);
      });
    } else {
      // 🍃 وضع النهار الفصلي الفخم: أوراق الشجر التفاعلية (Autumn Maple Leaves, Summer Sun Leaves, Spring Petals, Winter Crystals)
      seasonalLeaves.forEach(leaf => {
        leaf.update();
        leaf.draw(ctx);
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
