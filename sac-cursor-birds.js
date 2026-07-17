/* =========================================================================
   👑🏔️🌌 محرك SAC · SVT prof الفخم لخلفيات الطبيعة المرسومة (Vector Nature Landscape)
   (4-Seasons Illustrated Landscape: Mountains, Forests, Seasonal Foliage, Day/Night & Shooting Stars)
   تم تأمين وتجهيز الطبقات (z-index: -99999) لضمان عدم حجب أي كتابة أو عنصر أو شاشة إدارة في كل الصفحات
   ========================================================================= */

(function() {
  if (window._sacThemeEngineInitialized) return;
  window._sacThemeEngineInitialized = true;

  // 1. تحديد وحفظ حالة الثيم (النهار أو الليل) والفصل الحالي (الربيع، الصيف، الخريف، الشتاء)
  window.sacCurrentTheme = localStorage.getItem('sac_theme') || 'light';
  
  const month = new Date().getMonth() + 1; // 1 to 12
  if (month >= 3 && month <= 5) {
    window.sacCurrentSeason = 'spring';   // 🌸 الربيع (أشجار مزهرة وبراعم)
  } else if (month >= 6 && month <= 8) {
    window.sacCurrentSeason = 'summer';   // ☀️ الصيف (أوراق خضراء وشمس دافئة)
  } else if (month >= 9 && month <= 11) {
    window.sacCurrentSeason = 'autumn';   // 🍂 الخريف (أوراق محمرة وغروب دافئ كما في الصورة)
  } else {
    window.sacCurrentSeason = 'winter';   // ❄️ الشتاء (أغصان برك وثلج)
  }

  // 2. إنشاء وتجهيز كانفاس الخلفية الطبيعية الفخمة
  const canvas = document.createElement('canvas');
  canvas.id = 'sacCursorBirdsCanvas';
  canvas.style.cssText = 'position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:-1 !important; pointer-events:none !important; overflow:hidden !important; transition:opacity 0.8s ease !important;';
  
  function attachCanvas() {
    if (document.body) {
      if (document.body.firstChild) {
        document.body.insertBefore(canvas, document.body.firstChild);
      } else {
        document.body.appendChild(canvas);
      }
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
  // 🏔️ أولاً: محرك رسم المشهد الطبيعي الخلفي (Mountains & Seasonal Forests Vector Landscape)
  // =========================================================================
  function drawNatureLandscape(ctx, w, h, season, theme) {
    ctx.save();

    // 1. السماء والأفق (Sky & Atmosphere Gradient)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.75);
    if (theme === 'dark') {
      if (season === 'autumn') {
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.5, '#311042');
        skyGrad.addColorStop(1, '#4c1d95');
      } else if (season === 'winter') {
        skyGrad.addColorStop(0, '#030712');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#1e293b');
      } else if (season === 'spring') {
        skyGrad.addColorStop(0, '#0b111e');
        skyGrad.addColorStop(0.6, '#1e1b4b');
        skyGrad.addColorStop(1, '#312e81');
      } else {
        // الصيف ليلاً
        skyGrad.addColorStop(0, '#0b111e');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#115e59');
      }
    } else {
      if (season === 'autumn') {
        // غروب خريفي محمر ومائل للبنفسجي والبرتقالي (مطابق لصورة الفيسبوك التي أرفقتها الأستاذة)
        skyGrad.addColorStop(0, '#4c1d95');
        skyGrad.addColorStop(0.35, '#be185d');
        skyGrad.addColorStop(0.7, '#ea580c');
        skyGrad.addColorStop(1, '#f59e0b');
      } else if (season === 'winter') {
        // شتاء فضي بارد وناصع
        skyGrad.addColorStop(0, '#cbd5e1');
        skyGrad.addColorStop(0.5, '#e2e8f0');
        skyGrad.addColorStop(1, '#f8fafc');
      } else if (season === 'spring') {
        // ربيع مزهر لطيف
        skyGrad.addColorStop(0, '#bae6fd');
        skyGrad.addColorStop(0.6, '#e0f2fe');
        skyGrad.addColorStop(1, '#fbcfe8');
      } else {
        // صيف أخضر ومشمس دافئ (جوان، جويلية، أوت - الحالي)
        skyGrad.addColorStop(0, '#99f6e4');
        skyGrad.addColorStop(0.5, '#ccfbf1');
        skyGrad.addColorStop(1, '#fef9c3');
      }
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. الشمس في النهار أو القمر في الليل (Sun / Moon)
    ctx.beginPath();
    const orbX = w * 0.5;
    const orbY = h * 0.42;
    const orbRadius = Math.min(w, h) * 0.14;
    ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
    if (theme === 'dark') {
      const moonGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orbRadius);
      moonGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      moonGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
      moonGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = moonGrad;
    } else {
      const sunGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orbRadius);
      if (season === 'autumn') {
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.55)');
        sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      } else {
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.45)');
        sunGrad.addColorStop(1, 'rgba(20, 184, 166, 0)');
      }
      ctx.fillStyle = sunGrad;
    }
    ctx.fill();

    // 3. سلسلة الجبال البعيدة (Back Mountain Range)
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.2, h * 0.45, w * 0.35, h * 0.58, w * 0.55, h * 0.42);
    ctx.bezierCurveTo(w * 0.75, h * 0.28, w * 0.88, h * 0.52, w, h * 0.48);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    let backMtnColor = '#0f766e';
    if (theme === 'dark') {
      backMtnColor = season === 'autumn' ? '#1e1b4b' : '#0f172a';
    } else {
      backMtnColor = season === 'autumn' ? '#7c2d12' : (season === 'winter' ? '#94a3b8' : (season === 'spring' ? '#10b981' : '#0d9488'));
    }
    ctx.fillStyle = backMtnColor;
    ctx.globalAlpha = 0.45;
    ctx.fill();

    // 4. سلسلة الجبال والتلال القريبة (Mid Mountain Hills)
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.bezierCurveTo(w * 0.25, h * 0.55, w * 0.45, h * 0.68, w * 0.7, h * 0.54);
    ctx.bezierCurveTo(w * 0.85, h * 0.45, w * 0.95, h * 0.62, w, h * 0.58);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    let midMtnColor = '#042f2e';
    if (theme === 'dark') {
      midMtnColor = season === 'autumn' ? '#311042' : '#151f32';
    } else {
      midMtnColor = season === 'autumn' ? '#9a3412' : (season === 'winter' ? '#64748b' : (season === 'spring' ? '#059669' : '#0f766e'));
    }
    ctx.fillStyle = midMtnColor;
    ctx.globalAlpha = 0.65;
    ctx.fill();

    // 5. غابة أشجار الصنوبر والأشجار على الجانبين (Foreground Silhouette Pine Forests)
    ctx.globalAlpha = 0.88;
    const treeColor = theme === 'dark' ? '#020617' : (season === 'autumn' ? '#431407' : (season === 'winter' ? '#334155' : '#042f2e'));
    ctx.fillStyle = treeColor;

    function drawPineTree(tx, ty, tSize, isBareWinter = false, isSpringBlossom = false) {
      if (isBareWinter) {
        ctx.strokeStyle = treeColor;
        ctx.lineWidth = Math.max(2, tSize * 0.08);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty - tSize * 1.3);
        ctx.moveTo(tx, ty - tSize * 0.4); ctx.lineTo(tx - tSize * 0.35, ty - tSize * 0.65);
        ctx.moveTo(tx, ty - tSize * 0.5); ctx.lineTo(tx + tSize * 0.35, ty - tSize * 0.75);
        ctx.moveTo(tx, ty - tSize * 0.8); ctx.lineTo(tx - tSize * 0.25, ty - tSize * 1.0);
        ctx.moveTo(tx, ty - tSize * 0.85); ctx.lineTo(tx + tSize * 0.25, ty - tSize * 1.05);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx - tSize * 0.35, ty - tSize * 0.65, tSize * 0.08, 0, Math.PI * 2);
        ctx.arc(tx + tSize * 0.35, ty - tSize * 0.75, tSize * 0.08, 0, Math.PI * 2);
        ctx.arc(tx, ty - tSize * 1.3, tSize * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = treeColor;
      } else {
        ctx.beginPath();
        ctx.moveTo(tx, ty - tSize * 1.4);
        ctx.lineTo(tx + tSize * 0.25, ty - tSize * 1.0); ctx.lineTo(tx + tSize * 0.12, ty - tSize * 1.0);
        ctx.lineTo(tx + tSize * 0.35, ty - tSize * 0.65); ctx.lineTo(tx + tSize * 0.18, ty - tSize * 0.65);
        ctx.lineTo(tx + tSize * 0.48, ty - tSize * 0.25); ctx.lineTo(tx + tSize * 0.12, ty - tSize * 0.25);
        ctx.lineTo(tx + tSize * 0.12, ty);
        ctx.lineTo(tx - tSize * 0.12, ty);
        ctx.lineTo(tx - tSize * 0.12, ty - tSize * 0.25); ctx.lineTo(tx - tSize * 0.48, ty - tSize * 0.25);
        ctx.lineTo(tx - tSize * 0.18, ty - tSize * 0.65); ctx.lineTo(tx - tSize * 0.35, ty - tSize * 0.65);
        ctx.lineTo(tx - tSize * 0.12, ty - tSize * 1.0); ctx.lineTo(tx - tSize * 0.25, ty - tSize * 1.0);
        ctx.closePath();
        ctx.fill();

        if (isSpringBlossom && theme !== 'dark') {
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(tx - tSize * 0.2, ty - tSize * 0.7, tSize * 0.08, 0, Math.PI * 2);
          ctx.arc(tx + tSize * 0.25, ty - tSize * 0.5, tSize * 0.08, 0, Math.PI * 2);
          ctx.arc(tx, ty - tSize * 1.2, tSize * 0.09, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = treeColor;
        }
      }
    }

    const isBare = (season === 'winter');
    const isBlossom = (season === 'spring');

    for (let i = 0; i < 9; i++) {
      const tx = (i * 45) + (Math.sin(i * 1.5) * 15);
      const ty = h - 10 + (i % 2 === 0 ? 15 : -15);
      const tSize = 90 + (i % 3) * 35 - (i * 4);
      drawPineTree(tx, ty, tSize, isBare, isBlossom);
    }

    for (let i = 0; i < 9; i++) {
      const tx = w - (i * 45) - (Math.cos(i * 1.7) * 15);
      const ty = h - 10 + (i % 2 === 0 ? 15 : -15);
      const tSize = 95 + (i % 3) * 35 - (i * 4);
      drawPineTree(tx, ty, tSize, isBare, isBlossom);
    }

    // 6. أرضية الغابة
    ctx.beginPath();
    ctx.moveTo(0, h * 0.88);
    ctx.bezierCurveTo(w * 0.3, h * 0.82, w * 0.7, h * 0.92, w, h * 0.86);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = treeColor;
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // 🍃 ثانياً: محرك أوراق الشجر التفاعلية حسب الفصل (Seasonal Foliage & Particles)
  // =========================================================================
  class SeasonalLeaf {
    constructor() {
      this.reset(true);
    }
    reset(randomStart = false) {
      this.x = Math.random() * width;
      this.y = randomStart ? Math.random() * height : -40 - Math.random() * 80;
      this.size = 10 + Math.random() * 12;
      this.vy = 0.6 + Math.random() * 1.2;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.angle = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.swaySpeed = 0.02 + Math.random() * 0.02;
      this.swayOffset = Math.random() * Math.PI * 2;

      const season = window.sacCurrentSeason;
      if (season === 'autumn') {
        const colors = ['#dc2626', '#ea580c', '#d97706', '#b45309', '#f59e0b', '#991b1b'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'maple';
      } else if (season === 'spring') {
        const colors = ['#34d399', '#10b981', '#f472b6', '#fbcfe8', '#6ee7b7'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'oval';
      } else if (season === 'winter') {
        const colors = ['#ffffff', '#e0f2fe', '#bae6fd', '#38bdf8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = 'snow';
      } else {
        const colors = ['#10b981', '#059669', '#0d9488', '#14b8a6', '#facc15', '#84cc16'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.leafType = Math.random() > 0.3 ? 'oval' : 'sunLeaf';
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
      } else if (this.leafType === 'snow') {
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
      } else {
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.85, -this.size * 0.5, this.size * 0.85, this.size * 0.5, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.85, this.size * 0.5, -this.size * 0.85, -this.size * 0.5, 0, -this.size);
        ctx.closePath();
      }

      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();

      if (this.leafType !== 'snow') {
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.lineTo(0, this.size * 0.8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  const seasonalLeaves = [];
  for (let i = 0; i < 30; i++) {
    seasonalLeaves.push(new SeasonalLeaf());
  }

  // =========================================================================
  // 🌌 ثالثاً: محرك النجوم البراقة والشهب المتحركة في وضع الليل (Shooting Stars)
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
  // 🎨 رابعاً: إدارة الألوان الفصليّة واللوقو وزر تبديل النهار/الليل (Theme Controller)
  // مع ضمان عدم تأثر الكتابة أو إخفاء أي عنصر أو لوحة أدمين نهائياً
  // =========================================================================
  function applyThemeVisuals() {
    if (canvas) {
      canvas.style.opacity = '1';
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
             🌙 وضع الظلام الكوني (SAC Cosmic Dark Mode - High Contrast & Safe Stacking)
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
            background: transparent !important;
            color: #f8fafc !important;
            position: relative !important;
            z-index: 0 !important;
            min-height: 100vh !important;
          }
          #sacAntiOcrWatermark {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          /* جعل الحاويات الكبرى شفافة تماماً لعدم تراكم الطبقات المعتمة */
          main, section, .container, .grid, .table-wrap {
            background: transparent !important;
            position: relative !important;
            z-index: 10 !important;
          }
          /* حماية وضمان ظهور جميع عناصر الصفحة وتأثير الزجاج الضبابي الفاخر لإظهار زخات الشهب والمشهد الطبيعي خلف الإطارات الشفافة */
          .card, .card-box, .intro, .intro-box, .qa-box, .panel-in, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .comment-card, .reply-card, .dlbox, .example, .newbie, .setup-banner, .strat, .tip, .tips, #boardUsers, #boardContent, #boardFiles, #boardComments, #boardOrders, .svc-page-box, .svc-price-card, .srv-form, .srv-package, .spec-box, .price-card, .pkg-card, .unit-box, .sub-unit, .sidebar-toc, .tech-card, .lead-text, .unit-tabs, .tab-btn, .toc-unit-link, .theory-card, .theory-body, .theory-body div.sec, .algo-box, .info-box, .memo, .memo-row, .dish, .dgroup, .docgroup, .qcard, .table-card, .tbl-card, .content-card, .pay-section, .steps, .state, .panel, .sec-divider {
            background: rgba(15, 23, 42, 0.90) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            color: #f8fafc !important;
            border-color: rgba(45, 212, 191, 0.38) !important;
            box-shadow: 0 14px 35px rgba(0, 0, 0, 0.65) !important;
            position: relative !important;
            z-index: 10 !important;
          }
          .hero, .dash-hero {
            background: rgba(11, 17, 30, 0.62) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
          }
          /* إجبار الترويسة العلوية وودجت التاريخ والوقت وشريط الأدمين على البقاء مثبتة دائماً في أعلى الشاشة عند التمرير لجميع الزوار والأساتذة والأدمين */
          header, .header, #header, #sacTopAdminToolbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 99999 !important;
            width: 100% !important;
            background: rgba(15, 23, 42, 0.90) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border-bottom: 1px solid rgba(45, 212, 191, 0.35) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.8) !important;
          }
          
          .sub-unit p, .sub-unit div, .sub-unit li, .lead-text, .tech-card, .theory-body, .theory-body div.sec, .sec {
            color: #f8fafc !important;
          }
          .unit-title, .sub-unit h3, .sidebar-toc h3, .tech-card b, .diagram-box h4, .diagram-summary h4, .theory-body b, .sec b, .theory-card b, .theory-head span {
            color: #38bdf8 !important;
          }
          .theory-head {
            background: linear-gradient(135deg, #042f2e, #0d9488) !important;
            color: #ffffff !important;
            border-bottom: 3px solid #facc15 !important;
          }
          .kw-tag, .kw, .tag, .chip, .pill, .badge, .freebadge, .lock-badge, .lockbadge, .prof-badge, .teacherbadge {
            background: rgba(250, 204, 21, 0.18) !important;
            color: #facc15 !important;
            border: 1px solid #facc15 !important;
            font-weight: 900 !important;
          }
          code.term, code.syntax, span.eng {
            color: #2dd4bf !important;
            background: rgba(13, 148, 136, 0.22) !important;
            border: 1px solid #2dd4bf !important;
            font-weight: 900 !important;
          }
          
          /* الصناديق التي تظل بيضاء (مثل الرسومات البيانية والجداول وصندوق الدفع) يكون نصها أسود ملكي دائماً */
          .diagram-box, .diagram-summary, table, tbody, tr, td, #baridimobBox {
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .diagram-box *, .diagram-summary *, table td, table td *, #baridimobBox *, #baridimobBox div, #baridimobBox span, #baridimobBox b, #baridimobBox p {
            color: #0f172a !important;
          }
          .diagram-box h4, .diagram-summary h4, table th, table td b, #baridimobBox .title-pay {
            color: #0d9488 !important;
            font-weight: 900 !important;
          }
          .diagram-box code.term, .diagram-box code.syntax, .diagram-summary code.term, .diagram-summary code.syntax, table code.term, table code.syntax, #baridimobBox span.ccp-num, #baridimobBox span.rip-num {
            color: #042f2e !important;
            background: #f1f5f9 !important;
            border: 1px solid #cbd5e1 !important;
          }
          .tice-hero {
            background: rgba(13, 148, 136, 0.35) !important;
            border: none !important;
            outline: none !important;
            backdrop-filter: blur(14px) !important;
          }

          #adminGateModal, .modal-bg, .modal, #adminModal, #upgradeModal, #viewerModal {
            z-index: 999999 !important;
          }
          .board-sec[style*="display: block"], .board-sec[style*="display:block"], #adminUsers[style*="display: block"], #adminUsers[style*="display:block"] {
            display: block !important;
          }
          input, select, textarea { background: rgba(15, 23, 42, 0.90) !important; color: #f8fafc !important; border-color: rgba(45, 212, 191, 0.4) !important; }
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
            background: rgba(15, 23, 42, 0.88) !important;
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
        let seasonBgGradient = 'linear-gradient(135deg, rgba(254, 252, 232, 0.93) 0%, rgba(254, 249, 195, 0.93) 45%, rgba(236, 253, 245, 0.93) 100%)'; // ☀️ الصيف
        if (window.sacCurrentSeason === 'spring') {
          seasonBgGradient = 'linear-gradient(135deg, rgba(240, 253, 244, 0.93) 0%, rgba(236, 253, 245, 0.93) 50%, rgba(224, 242, 254, 0.93) 100%)'; // 🌸 الربيع
        } else if (window.sacCurrentSeason === 'autumn') {
          seasonBgGradient = 'linear-gradient(135deg, rgba(255, 251, 235, 0.93) 0%, rgba(254, 243, 199, 0.93) 50%, rgba(253, 230, 138, 0.93) 100%)'; // 🍂 الخريف
        } else if (window.sacCurrentSeason === 'winter') {
          seasonBgGradient = 'linear-gradient(135deg, rgba(248, 250, 252, 0.93) 0%, rgba(241, 245, 249, 0.93) 50%, rgba(226, 232, 240, 0.93) 100%)'; // ❄️ الشتاء
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
          #sacAntiOcrWatermark {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          body, html {
            background: transparent !important;
            color: #0f172a !important;
            position: relative !important;
            z-index: 0 !important;
            min-height: 100vh !important;
          }
          .hero, .dash-hero {
            background: rgba(4, 47, 46, 0.65) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
          }
          main, section, .container, .grid, .table-wrap {
            background: transparent !important;
            position: relative !important;
            z-index: 10 !important;
          }
          .card, .card-box, .intro, .intro-box, .qa-box, .panel-in, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .strat, .tip, .tips, #boardUsers, #boardContent, #boardFiles, #boardComments, #boardOrders, .svc-page-box, .svc-price-card, .srv-form, .srv-package, .spec-box, .price-card, .pkg-card {
            background: rgba(255, 255, 255, 0.70) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1.5px solid rgba(13, 148, 136, 0.3) !important;
            box-shadow: 0 15px 35px rgba(13, 148, 136, 0.12), 0 5px 15px rgba(0, 0, 0, 0.04) !important;
            position: relative !important;
            z-index: 10 !important;
          }
          /* إجبار الترويسة العلوية وودجت التاريخ والوقت وشريط الأدمين على البقاء مثبتة دائماً في أعلى الشاشة عند التمرير لجميع الزوار والأساتذة والأدمين */
          header, .header, #header, #sacTopAdminToolbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 99999 !important;
            width: 100% !important;
            background: rgba(255, 255, 255, 0.90) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border-bottom: 2px solid #0d9488 !important;
            box-shadow: 0 4px 20px rgba(13, 148, 136, 0.12) !important;
          }
          #adminGateModal, .modal-bg, .modal, #adminModal, #upgradeModal, #viewerModal {
            z-index: 999999 !important;
          }
          .board-sec[style*="display: block"], .board-sec[style*="display:block"], #adminUsers[style*="display: block"], #adminUsers[style*="display:block"] {
            display: block !important;
          }
          .card, .card-box, .intro, .intro-box, .qa-box, .panel-in, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .table-wrap, .strat, .tip, .tips, #boardUsers, #boardContent, #boardFiles, #boardComments, #boardOrders, .svc-page-box, .svc-price-card, .srv-form, .srv-package, .spec-box, .price-card, .pkg-card {
            background: rgba(255, 255, 255, 0.76) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1.5px solid rgba(13, 148, 136, 0.22) !important;
            box-shadow: 0 15px 35px rgba(13, 148, 136, 0.08), 0 5px 15px rgba(0, 0, 0, 0.04) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
          }
          .card:hover, .card-box:hover, .strat:hover, .hubcard:hover {
            transform: translateY(-6px) !important;
            box-shadow: 0 20px 45px rgba(13, 148, 136, 0.18) !important;
            border-color: #0d9488 !important;
          }
          input, select, textarea { background: rgba(15, 23, 42, 0.90) !important; color: #f8fafc !important; border-color: rgba(45, 212, 191, 0.4) !important; }
          h1, h2, h3, h4, h5, h6, .sec-title, .card h3, .card-header h3, .qa-q .qtext, .brand span, .logo-box h1, .intro h2, .intro-box h2, .docgroup .gh h3, .struct .head, .def .term, .hubcard .htx b, .c-name {
            color: #042f2e !important;
            font-weight: 800 !important;
          }
          p, .card p, .intro p, .intro-box p, .qa-a-body, .panel-in p, .struct .el .d, .def .body, .hubcard .htx span, .c-text {
            color: #1e293b !important;
            font-weight: 500 !important;
          }
          .theory-card, .unit-box, .sub-unit, .sidebar-toc, .tech-card, .lead-text {
            background: rgba(255, 255, 255, 0.88) !important;
            border-color: rgba(13, 148, 136, 0.28) !important;
            color: #0f172a !important;
          }
          .sub-unit p, .sub-unit div, .sub-unit li, .lead-text, .tech-card, .theory-body, .theory-body div.sec, .sec {
            color: #0f172a !important;
          }
          .unit-title, .sub-unit h3, .sidebar-toc h3, .tech-card b, .diagram-box h4, .diagram-summary h4, .theory-body b, .sec b, .theory-card b {
            color: #042f2e !important;
          }
          .kw-tag, .kw, .tag, .chip, .pill, .badge, .freebadge, .lock-badge, .lockbadge, .prof-badge, .teacherbadge {
            background: rgba(250, 204, 21, 0.22) !important;
            color: #b45309 !important;
            border: 1px solid #f59e0b !important;
            font-weight: 900 !important;
          }
          .hint, .sub, .sec-sub, .dltx span, .card-meta, .c-date, .n, .lbl {
            color: #475569 !important;
          }
          .hero, .dash-hero {
            background: rgba(4, 47, 46, 0.88) !important;
            color: #ffffff !important;
            box-shadow: 0 15px 40px rgba(13, 148, 136, 0.25) !important;
            backdrop-filter: blur(6px) !important;
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

    const wm = document.getElementById('sacAntiOcrWatermark');
    if(wm) wm.remove();

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
    if (!document.getElementById('sacUniversalHeaderFooterStyle')) {
      const st = document.createElement('style');
      st.id = 'sacUniversalHeaderFooterStyle';
      st.innerHTML = `
        footer { background: #042f2e !important; color: #dfeeeb !important; padding: 50px 0 30px !important; margin-top: 70px !important; text-align: right !important; }
        .foot-grid { display: grid !important; grid-template-columns: 2fr 1fr 1fr !important; gap: 40px !important; margin-bottom: 30px !important; max-width: 1380px !important; margin-inline: auto !important; padding: 0 20px !important; }
        .foot-grid h4 { color: #ffffff !important; margin-bottom: 14px !important; font-size: 1.08rem !important; font-weight: 800 !important; }
        .foot-grid a { display: block !important; color: #bcd9d3 !important; margin-bottom: 8px !important; font-size: 0.94rem !important; text-decoration: none !important; transition: all 0.2s !important; }
        .foot-grid a:hover { color: #2dd4bf !important; transform: translateX(-3px) !important; }
        .foot-bottom { border-top: 1px solid rgba(255, 255, 255, 0.14) !important; padding-top: 20px !important; text-align: center !important; font-size: 0.9rem !important; color: #bcd9d3 !important; max-width: 1380px !important; margin-inline: auto !important; }
        header .nav { max-width: 1380px !important; margin: 0 auto !important; padding: 12px 20px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 15px !important; flex-wrap: wrap !important; }
        header .brand { display: flex !important; align-items: center !important; gap: 12px !important; text-decoration: none !important; font-weight: 900 !important; font-size: 1.4rem !important; color: #042f2e !important; }
        header .brand img { width: 44px !important; height: 44px !important; border-radius: 50% !important; object-fit: cover !important; border: 2px solid #0d9488 !important; }
        header .nav-links { display: flex !important; align-items: center !important; gap: 18px !important; flex-wrap: wrap !important; }
        header .nav-links a { font-weight: 800 !important; font-size: 1rem !important; color: #042f2e !important; text-decoration: none !important; padding: 6px 14px !important; border-radius: 12px !important; transition: all 0.2s !important; }
        header .nav-links a:hover { background: rgba(13, 148, 136, 0.15) !important; color: #0d9488 !important; }
        @media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr !important; gap: 24px !important; } header .nav-links { display: none !important; } }
      `;
      document.head.appendChild(st);
    }

    const isTrainingOrServicePage = window.location.pathname.includes('takwin') || 
                                    window.location.pathname.includes('srv-') || 
                                    window.location.pathname.includes('anmat') || 
                                    window.location.pathname.includes('istratijiyat');

    if (!isTrainingOrServicePage && !document.getElementById('sacThemeToggleBtn')) {
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

  
  // =========================================================================
  // 👑 شريط المسؤول الشامل (Universal Top Admin Toolbar Engine)
  // =========================================================================
  window.renderTopAdminToolbar = function() {
    const role = localStorage.getItem("sac_role");
    const sess = localStorage.getItem("sac_session") || localStorage.getItem("sac_user_session");
    let users = {};
    try { users = JSON.parse(localStorage.getItem("sac_users") || "{}"); } catch(e){}
    const isAdmin = (role === "admin" || sess === "admin@sac-svt.dz" || sess === "admin" || (users[sess] && users[sess].type === "admin"));
    
    let existing = document.getElementById("sacTopAdminToolbar");
    if (!isAdmin) {
      if (existing) existing.remove();
      return;
    }
    
    if (!existing) {
      existing = document.createElement("div");
      existing.id = "sacTopAdminToolbar";
      existing.style.cssText = "position:sticky !important; top:0 !important; left:0 !important; right:0 !important; z-index:999999 !important; background:linear-gradient(135deg, #0a3a40, #115860) !important; border-bottom:2px solid #f59e0b !important; padding:8px 16px !important; display:flex !important; flex-wrap:wrap !important; align-items:center !important; justify-content:center !important; gap:8px !important; box-shadow:0 4px 20px rgba(0,0,0,0.3) !important; font-family:Tajawal,sans-serif !important; direction:rtl !important; width:100% !important;";
      document.body.insertBefore(existing, document.body.firstChild);
    }
    
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const isBoard = (currentPath === "admin.html" || currentPath.includes("admin.html"));
    const curTab = window.currentBoardTab || sessionStorage.getItem("sac_admin_tab") || "users";
    
    existing.innerHTML = `
      <span style="color:#f59e0b; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:6px; margin-inline-end:8px;">
        <span>👑 شريط المسؤول الشامل:</span>
      </span>
      <button onclick="goToAdminTab('users')" style="background:${isBoard && curTab==='users'?'#f59e0b':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${isBoard && curTab==='users'?'#f59e0b':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">👥 إدارة المستخدمين</button>
      <button onclick="goToAdminTab('content')" style="background:${isBoard && curTab==='content'?'#f59e0b':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${isBoard && curTab==='content'?'#f59e0b':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">📚 إدارة المحتويات</button>
      <button onclick="goToAdminTab('files')" style="background:${isBoard && curTab==='files'?'#f59e0b':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${isBoard && curTab==='files'?'#f59e0b':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">⬆️ الملفات المرفوعة</button>
      <button onclick="goToAdminTab('comments')" style="background:${isBoard && curTab==='comments'?'#f59e0b':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${isBoard && curTab==='comments'?'#f59e0b':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">💬 إدارة التعليقات والمناقشات</button>
      <button onclick="goToAdminTab('orders')" style="background:${isBoard && curTab==='orders'?'#f59e0b':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${isBoard && curTab==='orders'?'#f59e0b':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">📋 طلبات الخدمات المخصصة</button>
      <button onclick="window.location.href='index.html'" style="background:${!isBoard?'#10b981':'rgba(255,255,255,0.14)'}; color:#fff; border:1px solid ${!isBoard?'#10b981':'rgba(255,255,255,0.25)'}; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">🌐 تصفح المنصة كمسؤول</button>
      <button onclick="adminGlobalLogout()" style="background:#ef4444; color:#fff; border:1px solid #dc2626; padding:6px 13px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; font-family:inherit; transition:0.2s;">🚪 تسجيل الخروج</button>
    `;
  };

  window.goToAdminTab = function(tabName) {
    sessionStorage.setItem("sac_admin_tab", tabName);
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    if (currentPath === "admin.html" || currentPath.includes("admin.html")) {
      if (typeof switchBoard === "function") {
        switchBoard(tabName);
      } else {
        window.location.reload();
      }
    } else {
      window.location.href = "admin.html";
    }
  };

  if (!window.adminGlobalLogout) {
    window.adminGlobalLogout = function() {
      localStorage.removeItem("sac_session");
      localStorage.removeItem("sac_role");
      window.location.href = "index.html";
    };
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applyThemeVisuals();
    injectHeaderWidgets();
    if (typeof window.renderTopAdminToolbar === 'function') window.renderTopAdminToolbar();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      applyThemeVisuals();
      injectHeaderWidgets();
    if (typeof window.renderTopAdminToolbar === 'function') window.renderTopAdminToolbar();
    });
  }

  // =========================================================================
  // 🎬 خامساً: حلقة التنشيط المستمرة (Animation Loop - مشهد الطبيعة + الشهب والأوراق)
  // =========================================================================
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // رسم المشهد الطبيعي المرسوم في الخلفية (Vector Landscape: جبال، تلال، أشجار وصنوبر متغيرة حسب الفصل)
    drawNatureLandscape(ctx, width, height, window.sacCurrentSeason, window.sacCurrentTheme);

    if (window.sacCurrentTheme === 'dark') {
      // 🌌 وضع الظلام الكوني: النجوم والشهب البراقة فوق الجبال (Shooting Stars)
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


  // =========================================================================
  // 🛡️ درع الحماية 7 طبقات الفخم لمنصة SAC · SVT prof (7-Layer Multi-Vector Security Fortress)
  // (Anti-Screenshot, Anti-Snipping Tool, Active DevTools Trap, Right-click block, Watermark)
  // =========================================================================
  function activateUniversalSecurityFortress() {
    if (window._sacUniversalSecurityFortressActive) return;
    window._sacUniversalSecurityFortressActive = true;

    // 1. حقن شاشة التعتيم والإشعار الفوري عند محاولة التقاط الشاشة أو فحص الكود
    function ensureOverlayExists() {
      let overlay = document.getElementById("antiScreenshotOverlay");
      if (!overlay && document.body) {
        overlay = document.createElement("div");
        overlay.id = "antiScreenshotOverlay";
        overlay.innerHTML = `
          <h3 style="font-size:1.8rem; font-weight:900; color:#2dd4bf !important; margin-bottom:16px;">🔒 محتوى بيداغوجي محمي حصري لمنصة SAC · SVT prof</h3>
          <p style="font-size:1.15rem; color:#cbd5e1 !important; max-width:650px; line-height:1.8;">يُمنع التقاط الشاشة أو فحص الشفرة برمجياً أو نسخ المحتوى دون إذن كتابي رسمي من الأستاذة قريمس أماني — جميع محاولات الاختراق تُسجل بالوقت والتاريخ وتفريغ الحافظة.</p>
          <div style="margin-top:28px; background:rgba(13,148,136,0.30); padding:14px 28px; border-radius:18px; border:2px dashed #2dd4bf; color:#facc15 !important; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.35); transition:all 0.25s;">
            💡 لإغلاق شاشة الحماية ومتابعة التصفح: اضغط مرتين متتاليتين بالفأرة أو بأصبعك (Double-Click / Double-Tap) في أي مكان على الشاشة ✕
          </div>
        `;
        overlay.style.cssText = "display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.96); backdrop-filter:blur(25px); -webkit-backdrop-filter:blur(25px); z-index:999999999; flex-direction:column; align-items:center; justify-content:center; color:#f8fafc; text-align:center; padding:30px; border:4px solid #0d9488;";
        document.body.appendChild(overlay);
      } else if (overlay && !overlay.innerHTML.includes("Double-Click")) {
        const banner = document.createElement("div");
        banner.style.cssText = "margin-top:28px; background:rgba(13,148,136,0.30); padding:14px 28px; border-radius:18px; border:2px dashed #2dd4bf; color:#facc15 !important; font-weight:900; font-size:1.1rem; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.35); transition:all 0.25s;";
        banner.innerHTML = "💡 لإغلاق شاشة الحماية ومتابعة التصفح: اضغط مرتين متتاليتين بالفأرة أو بأصبعك (Double-Click / Double-Tap) في أي مكان على الشاشة ✕";
        overlay.appendChild(banner);
      }
      return overlay;
    }

    window.dismissSacSecurityShield = function() {
      window.sacManualOverlayTrigger = false;
      const overlay = document.getElementById("antiScreenshotOverlay");
      const wm = document.getElementById("sacAntiOcrWatermark");
      if (overlay) overlay.style.display = "none";
      if (wm) {
        wm.style.setProperty("display", "none", "important");
        wm.style.setProperty("opacity", "0", "important");
        wm.style.setProperty("visibility", "hidden", "important");
      }
    };

    window.addEventListener("dblclick", function(e) {
      const overlay = document.getElementById("antiScreenshotOverlay");
      if (overlay && overlay.style.display === "flex") {
        window.dismissSacSecurityShield();
      }
    }, true);

    // 2. حقن العلامة المائية الرقمية التعاونية (Collaborative Identity Watermarking)
    function ensureWatermarkExists() {
      if (document.getElementById("sacAntiOcrWatermark") || !document.body) return;
      const wm = document.createElement("div");
      wm.id = "sacAntiOcrWatermark";
      wm.style.cssText = "position:fixed; inset:0; z-index:999998; pointer-events:none; display:none !important; opacity:0 !important; visibility:hidden !important; justify-content:space-around; align-items:center; flex-wrap:wrap; overflow:hidden; font-weight:900; font-size:1.8rem; color:#0d9488; transform:rotate(-25deg); user-select:none;";
      let inner = "";
      for (let i = 0; i < 18; i++) {
        inner += `<span>SAC · SVT prof · قريمس أماني · 2026</span>`;
      }
      wm.innerHTML = inner;
      document.body.appendChild(wm);
    }

    // 3. منع النقر بزر الفأرة الأيمن ومنع تحديد ونسخ النصوص برمجياً
    document.addEventListener("contextmenu", function(e) {
      if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return true;
      e.preventDefault();
      return false;
    }, true);

    ["copy", "cut", "dragstart", "selectstart"].forEach(evt => {
      document.addEventListener(evt, function(e) {
        if (e.target && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return true;
        e.preventDefault();
        return false;
      }, true);
    });

    // 4. منع اختصارات لوحة المفاتيح والتقاط الشاشة (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5, F12)
    function triggerAntiScreenshotAlert() {
      const overlay = ensureOverlayExists();
      if (overlay) {
        window.sacManualOverlayTrigger = true;
        overlay.style.display = "flex";
        const wm = document.getElementById("sacAntiOcrWatermark");
        if (wm) {
          wm.style.setProperty("display", "flex", "important");
          wm.style.setProperty("opacity", "0.08", "important");
          wm.style.setProperty("visibility", "visible", "important");
        }
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText("⚠️ محتوى محمي بحقوق الملكية الفكرية - منصة SAC SVT prof"); } catch(err) {}
        // لا يتم إغلاقه تلقائياً؛ يجب الضغط مرتين (Double-Click) لإغلاقه
      }
    }

    document.addEventListener("keydown", function(e) {
      const k = e.key ? e.key.toLowerCase() : "";
      const isMetaOrCtrl = e.metaKey || e.ctrlKey;
      
      if (e.key === "PrintScreen" || e.keyCode === 44 || (e.altKey && (e.key === "PrintScreen" || e.keyCode === 44))) {
        e.preventDefault(); e.stopPropagation(); triggerAntiScreenshotAlert(); return false;
      }
      if ((isMetaOrCtrl && e.shiftKey && ["s", "3", "4", "5", "c", "i", "j"].includes(k)) || e.key === "F12" || e.keyCode === 123) {
        e.preventDefault(); e.stopPropagation(); triggerAntiScreenshotAlert(); return false;
      }
      if (isMetaOrCtrl && ["c", "x", "s", "p", "u"].includes(k) && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        e.preventDefault(); e.stopPropagation(); return false;
      }
    }, true);

    document.addEventListener("keyup", function(e) {
      if (e.key === "PrintScreen" || e.keyCode === 44 || (e.metaKey && e.shiftKey)) {
        triggerAntiScreenshotAlert();
      }
    }, true);

    // 5. حارس التعتيم الشامل عند تبديل التبويبات أو فتح أداة القص (Anti-Snipping Guard & Visibility Trap)
    function checkSnippingGuard() {
      const overlay = ensureOverlayExists();
      ensureWatermarkExists();
      if (!overlay) return;
      if (document.hidden || !document.hasFocus()) {
        if (document.activeElement && ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
        if (overlay.style.display !== "flex") {
          overlay.style.display = "flex";
        }
      }
      // لا يختفي تلقائياً عند عودة التركيز؛ يجب الضغط مرتين بالفأرة (Double-Click) لإغلاقه
    }
    window.addEventListener("blur", checkSnippingGuard, true);
    window.addEventListener("focus", checkSnippingGuard, true);
    window.addEventListener("pagehide", checkSnippingGuard, true);
    document.addEventListener("visibilitychange", checkSnippingGuard, true);
    setInterval(checkSnippingGuard, 300);

    // 6. كاشف أدوات المطورين ومصيدة التصحيح الدائمة (Active DevTools Trap & Debugger Loop)
    setInterval(function() {
      const widthThreshold = window.outerWidth - window.innerWidth > 170;
      const heightThreshold = window.outerHeight - window.innerHeight > 170;
      if (widthThreshold || heightThreshold) {
        const overlay = ensureOverlayExists();
        if (overlay && overlay.style.display !== "flex") {
          overlay.style.display = "flex";
        }
      }
    }, 800);

    setInterval(function() {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        const overlay = ensureOverlayExists();
        if (overlay) overlay.style.display = "flex";
      }
    }, 1000);
  }


  // =========================================================================
  // 🎁 نظام التكوين المجاني والمميّز: أول درسين مجانيين في كل وحدة تكوينية للجميع
  // (2 Free Lessons per Training Unit & Freemium Unlock Gate)
  // =========================================================================
  function applyFreemiumTrainingAccess() {
    const isTrainingPage = window.location.pathname.includes("takwin-") || 
                           window.location.pathname.includes("anmat") || 
                           window.location.pathname.includes("istratijiyat");
    if (!isTrainingPage) return;

    const isTrainingLogged = localStorage.getItem("sac_session") || 
                             localStorage.getItem("sac_role") === "admin" || 
                             localStorage.getItem("sac_user_session");

    const subUnits = document.querySelectorAll(".sub-unit");
    subUnits.forEach((unit, idx) => {
      const h3 = unit.querySelector("h3");
      if (idx === 0 || idx === 1) {
        // الدرس الأول والثاني: مجانيان للجميع
        if (h3 && !h3.querySelector(".freebadge")) {
          const badge = document.createElement("span");
          badge.className = "freebadge";
          badge.style.cssText = "background:#dcfce7; color:#15803d !important; border:1px solid #22c55e; padding:3px 10px; border-radius:10px; font-size:0.82rem; font-weight:800; margin-inline-start:10px; display:inline-block;";
          badge.innerHTML = "🎁 درس مجاني (متاح للجميع)";
          h3.appendChild(badge);
        }
      } else {
        // الدرس الثالث فما فوق: مميّز للأدمين والمشتركين
        if (h3 && !h3.querySelector(".lock-badge")) {
          const badge = document.createElement("span");
          badge.className = "lock-badge";
          badge.style.cssText = "background:#fef3c7; color:#b45309 !important; border:1px solid #f59e0b; padding:3px 10px; border-radius:10px; font-size:0.82rem; font-weight:800; margin-inline-start:10px; display:inline-block;";
          badge.innerHTML = "👑 درس مميّز (مفتوح للأدمين والمشتركين)";
          h3.appendChild(badge);
        }

        if (!isTrainingLogged) {
          // تغبش المحتوى الداخلي للدرس المحمي وإضافة بطاقة الاشتراك
          Array.from(unit.children).forEach(child => {
            if (child.tagName !== "H3" && !child.classList.contains("sac-unlock-card")) {
              child.style.setProperty("filter", "blur(6px)", "important");
              child.style.setProperty("pointer-events", "none", "important");
              child.style.setProperty("user-select", "none", "important");
              child.style.setProperty("opacity", "0.55", "important");
            }
          });

          if (!unit.querySelector(".sac-unlock-card")) {
            const unlockCard = document.createElement("div");
            unlockCard.className = "sac-unlock-card";
            unlockCard.style.cssText = "margin-top:22px; background:linear-gradient(135deg, #042f2e, #0d9488); border:2px solid #facc15; border-radius:18px; padding:26px 20px; text-align:center; color:#fff !important; box-shadow:0 12px 30px rgba(13,148,136,0.3); pointer-events:auto !important; filter:none !important; opacity:1 !important;";
            unlockCard.innerHTML = `
              <div style="font-size:2.4rem; margin-bottom:8px;">🔒</div>
              <h4 style="color:#facc15 !important; font-size:1.25rem; font-weight:900; margin-bottom:10px;">هذا الدرس مميّز (حصري للأساتذة المشتركين والأدمين)</h4>
              <p style="color:#e2e8f0 !important; font-size:0.98rem; max-width:580px; margin:0 auto 18px; line-height:1.7;">لقد أتممتَ قراءة الدرسين المجانيين المتاحين للجميع في هذه الوحدة التكوينية. لمتابعة قراءة هذا الدرس وكامل المخططات التلخيصية والموسوعة البيداغوجية، يُرجى تسجيل الدخول لحسابك المميّز.</p>
              <a href="login.html" style="display:inline-flex; align-items:center; gap:8px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff !important; font-weight:900; font-size:1rem; padding:12px 28px; border-radius:14px; text-decoration:none; box-shadow:0 6px 18px rgba(245,158,11,0.4); transition:all 0.25s;">🔑 تسجيل الدخول أو الاشتراك الآن ←</a>
            `;
            unit.appendChild(unlockCard);
          }
        } else {
          // إذا كان الأستاذ مسجلاً أو أدمين، فتح المحتوى بالكامل وإزالة بطاقة الإغلاق إن وجدت
          Array.from(unit.children).forEach(child => {
            if (child.tagName !== "H3") {
              child.style.setProperty("filter", "none", "important");
              child.style.setProperty("pointer-events", "auto", "important");
              child.style.setProperty("user-select", "auto", "important");
              child.style.setProperty("opacity", "1", "important");
            }
          });
          const unlockCard = unit.querySelector(".sac-unlock-card");
          if (unlockCard) unlockCard.remove();
        }
      }
    });
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    applyFreemiumTrainingAccess();
  } else {
    window.addEventListener("DOMContentLoaded", applyFreemiumTrainingAccess);
  }


    // 7. درع حماية الهاتف الذكي ضد تصوير الشاشة وتسجيل الفيديو (Mobile Anti-Screenshot & Screen Recorder Shield)
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 960) {
      
      // أ) حارس تغيير أبعاد الشاشة وسحب شريط الإشعارات (Quick Settings / Screen Recorder Trigger Intercept)
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", function() {
          const heightDiff = window.innerHeight - window.visualViewport.height;
          if (heightDiff > 80 && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
            triggerAntiScreenshotAlert();
          }
        }, true);
      }

      // ب) كاشف تسجيل الشاشة فيديو عبر خلل معدل الإطارات (Screen Recording Compositor / FPS Trap)
      let lastFrameTime = performance.now();
      let frameAnomalyCount = 0;
      function checkMobileScreenRecording(now) {
        const delta = now - lastFrameTime;
        if (delta > 140 && !document.hidden && document.hasFocus() && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
          frameAnomalyCount++;
          if (frameAnomalyCount >= 2) {
            const overlay = ensureOverlayExists();
            if (overlay && overlay.style.display !== "flex") {
              triggerAntiScreenshotAlert();
            }
            frameAnomalyCount = 0;
          }
        } else if (delta < 50) {
          frameAnomalyCount = 0;
        }
        lastFrameTime = now;
        requestAnimationFrame(checkMobileScreenRecording);
      }
      requestAnimationFrame(checkMobileScreenRecording);

      // ج) إغلاق شاشة التعتيم بالنقر المزدوج السريع على شاشة اللمس (Mobile Double-Tap Dismissal)
      let lastMobileTap = 0;
      window.addEventListener("touchend", function(e) {
        const overlay = document.getElementById("antiScreenshotOverlay");
        if (overlay && overlay.style.display === "flex") {
          const now = Date.now();
          if (now - lastMobileTap < 380) {
            window.dismissSacSecurityShield();
            e.preventDefault();
          }
          lastMobileTap = now;
        }
      }, true);
    }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    activateUniversalSecurityFortress();
  } else {
    window.addEventListener("DOMContentLoaded", activateUniversalSecurityFortress);
  }
  animate();
})();

