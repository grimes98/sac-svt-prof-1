/* =========================================================================
   🕊️🌌 محرك SAC · SVT prof الموحد للثيم الكوني والمؤثرات البصرية
   (Day Mode: Small Emerald Phoenix Birds | Night Mode: Cosmic Shooting Stars & High-Contrast Typography)
   ========================================================================= */

(function() {
  if (window._sacThemeEngineInitialized) return;
  window._sacThemeEngineInitialized = true;

  // 1. تحديد وحفظ حالة الثيم (النهار أو الليل)
  window.sacCurrentTheme = localStorage.getItem('sac_theme') || 'light';

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

  // موقع الكيرسور وحالة التحليق
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
  // ☀️ أولاً: محرك طيور العنقاء الزمردية الصغيرة (النهار — Small Emerald Phoenixes)
  // =========================================================================
  const PHOENIX_COLORS = [
    '#2dd4bf', '#14b8a6', '#0d9488', '#5eead4', '#99f6e4',
    '#a7f3d0', '#6ee7b7', '#34d399', '#38bdf8', '#7dd3fc'
  ];

  class PhoenixBird {
    constructor(index, color) {
      this.index = index;
      this.color = color;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.8;
      this.vy = (Math.random() - 0.5) * 1.8;
      this.size = 11 + Math.random() * 5; // طيور عنقاء صغيرة وأنيقة
      this.angle = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.08 + Math.random() * 0.05;
      this.wingAngle = Math.random() * Math.PI;
    }

    update(birds) {
      this.wingAngle += this.wingSpeed;

      let targetX = mouse.x;
      let targetY = mouse.y;

      if (mouse.isIdle) {
        const orbitRadius = 130 + (this.index % 4) * 45;
        const orbitSpeed = 0.0006 + (this.index % 3) * 0.0002;
        const time = Date.now() * orbitSpeed;
        const offsetAngle = (this.index / 12) * Math.PI * 2;
        targetX = mouse.x + Math.cos(time + offsetAngle) * orbitRadius;
        targetY = mouse.y + Math.sin(time * 1.3 + offsetAngle) * (orbitRadius * 0.65);
      } else {
        const row = Math.floor(this.index / 2);
        const side = (this.index % 2 === 0) ? -1 : 1;
        const spacingX = 40;
        const spacingY = 34;
        const dirAngle = Math.atan2(mouse.y - height / 2, mouse.x - width / 2) || 0;
        const perpAngle = dirAngle + Math.PI / 2;
        
        targetX = mouse.x - Math.cos(dirAngle) * (row * spacingY) + Math.cos(perpAngle) * (side * row * spacingX);
        targetY = mouse.y - Math.sin(dirAngle) * (row * spacingY) + Math.sin(perpAngle) * (side * row * spacingX);
      }

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      this.vx += dx * 0.0008;
      this.vy += dy * 0.0008;

      birds.forEach(other => {
        if (other !== this) {
          const dist = Math.hypot(other.x - this.x, other.y - this.y);
          if (dist < 36) {
            this.vx -= (other.x - this.x) * 0.003;
            this.vy -= (other.y - this.y) * 0.003;
          }
        }
      });

      this.vx *= 0.96;
      this.vy *= 0.96;

      const speed = Math.hypot(this.vx, this.vy);
      const maxSpeed = mouse.isIdle ? 1.7 : 2.4;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }

      this.x += this.vx;
      this.y += this.vy;
      this.angle = Math.atan2(this.vy, this.vx);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      const wingSpread = Math.sin(this.wingAngle) * (this.size * 0.75);

      // رسم أجنحة وجسد طائر العنقاء الصغير (Articulated Phoenix Wings & Tail)
      ctx.beginPath();
      ctx.moveTo(this.size * 1.2, 0);
      ctx.bezierCurveTo(this.size * 0.5, -wingSpread * 0.8, -this.size * 0.3, -wingSpread * 1.5, -this.size * 0.7, -wingSpread * 1.2);
      ctx.bezierCurveTo(-this.size * 0.5, -wingSpread * 0.5, -this.size * 0.9, -this.size * 0.2, -this.size * 1.4, -this.size * 0.3);
      ctx.lineTo(-this.size * 1.6, 0);
      ctx.lineTo(-this.size * 1.4, this.size * 0.3);
      ctx.bezierCurveTo(-this.size * 0.9, this.size * 0.2, -this.size * 0.5, wingSpread * 0.5, -this.size * 0.7, wingSpread * 1.2);
      ctx.bezierCurveTo(-this.size * 0.3, wingSpread * 1.5, this.size * 0.5, wingSpread * 0.8, this.size * 1.2, 0);
      ctx.closePath();

      const grad = ctx.createLinearGradient(-this.size * 1.6, 0, this.size * 1.2, 0);
      grad.addColorStop(0, '#0d9488');
      grad.addColorStop(0.6, this.color);
      grad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = grad;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();

      // تاج العنقاء الصغير على الرأس
      ctx.beginPath();
      ctx.arc(this.size * 0.9, 0, this.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();

      ctx.restore();
    }
  }

  const birds = [];
  for (let i = 0; i < 12; i++) {
    birds.push(new PhoenixBird(i, PHOENIX_COLORS[i % PHOENIX_COLORS.length]));
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
  // 🎨 ثالثاً: إدارة الألوان واللوقو وزر تبديل النهار/الليل (Theme Controller)
  // =========================================================================
  function applyThemeVisuals() {
    if (canvas) {
      canvas.style.opacity = window.sacCurrentTheme === 'dark' ? '0.88' : '0.35';
    }

    let darkStyle = document.getElementById('sacDarkThemeStyles');
    if (window.sacCurrentTheme === 'dark') {
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
          .card, .card-box, .intro, .intro-box, .qa-box, .panel, .panel-in, .acc-item, .modal, #authLogin, #authReg, .svc, .stat, .def, .struct, .hubcard, .user-card, .doc-card, .table-wrap, table, th, td, .comment-card, .reply-card, .dlbox, .example, .newbie, .setup-banner {
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
        `;
        document.head.appendChild(darkStyle);
      }
    } else {
      if (darkStyle) darkStyle.remove();
    }

    // تبديل شعار المنصة (اللوقو) بين النهار والليل في كافة أنحاء الصفحة
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

  function injectThemeToggleBtn() {
    if (document.getElementById('sacThemeToggleBtn')) return;
    
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

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applyThemeVisuals();
    injectThemeToggleBtn();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      applyThemeVisuals();
      injectThemeToggleBtn();
    });
  }

  // =========================================================================
  // 🎬 رابعاً: حلقة التنشيط المستمرة (Animation Loop)
  // =========================================================================
  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (window.sacCurrentTheme === 'dark') {
      // 🌌 وضع الظلام: النجوم والشهب البراقة (Shooting Stars)
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });
      shootingStars.forEach(sStar => {
        sStar.update();
        sStar.draw(ctx);
      });
    } else {
      // ☀️ وضع النهار: طيور العنقاء الزمردية الصغيرة (Small Emerald Phoenixes)
      birds.forEach(bird => {
        bird.update(birds);
        bird.draw(ctx);
      });
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
