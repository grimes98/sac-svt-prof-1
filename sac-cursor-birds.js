/* =========================================================================
   🕊️ سرب الطيور الملونة المتحركة مع الكيرسور — SAC Cursor Flocking Birds AI
   نظام تحريك فيزيائي سلس (Boids Physics) لطيور ملونة تطير وتتبع مؤشر الماوس
   ========================================================================= */

(function() {
  // منع التكرار
  if (document.getElementById('sacCursorBirdsCanvas')) return;

  // إنشاء حاوية الكانفاس لتخفيف العبء على المتصفح وعمل حركة 60 FPS فائقة النعومة
  const canvas = document.createElement('canvas');
  canvas.id = 'sacCursorBirdsCanvas';
  canvas.style.cssText = 'position:fixed; inset:0; z-index:999990; pointer-events:none; overflow:hidden; width:100vw; height:100vh; transition:opacity 0.5s ease;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // موقع الكيرسور (الماوس أو اللمس)
  const mouse = {
    x: width / 2,
    y: height / 3,
    targetX: width / 2,
    targetY: height / 3,
    isIdle: false,
    idleTimer: null,
    angle: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isIdle = false;
    clearTimeout(mouse.idleTimer);
    mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 1800);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isIdle = false;
      clearTimeout(mouse.idleTimer);
      mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 1800);
    }
  }, { passive: true });

  // ألوان الطيور الزاهية (زمردي، فيروزي، ذهبي، مرجاني، أزرق ملكي، برتقالي، وردي)
  const BIRD_COLORS = [
    '#00a8a8', '#28c8c8', '#f59e0b', '#ec4899', '#3b82f6', 
    '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#eab308', 
    '#06b6d4', '#6366f1', '#ef4444', '#0d9488'
  ];

  // فئة الطائر (Bird Class) مع فيزياء الطيران والرفرفة
  class Bird {
    constructor(id, color) {
      this.id = id;
      this.color = color;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.size = 13 + Math.random() * 8; // حجم الطائر
      this.maxSpeed = 3.5 + (14 - id) * 0.22; // سرعات متفاوتة للسرب
      this.friction = 0.94 + Math.random() * 0.03;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.15 + Math.random() * 0.12;
      this.lag = 0.035 + (id * 0.006); // تأخر مرن للسرب خلف القائد
    }

    update() {
      // إذا كان الماوس ساكناً، يتحرك السرب في حركة دائرية انسيابية متموجة حوله
      if (mouse.isIdle) {
        mouse.angle += 0.015;
        const radius = 120 + Math.sin(mouse.angle * 2) * 40;
        mouse.x = mouse.targetX + Math.cos(mouse.angle + this.id * 0.4) * radius;
        mouse.y = mouse.targetY + Math.sin(mouse.angle + this.id * 0.4) * (radius * 0.6);
      } else {
        // تدرج الماوس نحو الهدف لتنعيم الطيران
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      // حساب المسافة نحو الهدف (الكيرسور أو الطائر الذي يسبقه)
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 5) {
        this.vx += (dx / dist) * this.maxSpeed * this.lag * 10;
        this.vy += (dy / dist) * this.maxSpeed * this.lag * 10;
      }

      // تنافر بسيط بين الطيور لكي لا تتطابق فوق بعضها
      birds.forEach(other => {
        if (other !== this) {
          const odx = this.x - other.x;
          const ody = this.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < this.size * 2.2 && odist > 0) {
            this.vx += (odx / odist) * 0.4;
            this.vy += (ody / odist) * 0.4;
          }
        }
      });

      // تحديد أقصى سرعة وتطبيق الاحتكاك
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;

      // حركة رفرفة الأجنحة
      this.wingAngle += this.wingSpeed * (Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 0.4 + 0.5);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      // توجيه الطائر نحو اتجاه الطيران
      const flightAngle = Math.atan2(this.vy, this.vx);
      ctx.rotate(flightAngle);

      // رسم جسم الطائر وأجنحته برفرفة حية (SVG Vector Style in Canvas)
      const wingSpan = Math.sin(this.wingAngle) * (this.size * 0.85);

      ctx.beginPath();
      // الرأس والمنقار
      ctx.moveTo(this.size * 0.9, 0);
      // الجناح العلوي
      ctx.quadraticCurveTo(this.size * 0.2, -wingSpan * 1.3, -this.size * 0.4, -wingSpan * 1.1);
      ctx.quadraticCurveTo(-this.size * 0.1, -wingSpan * 0.4, -this.size * 0.6, -this.size * 0.2);
      // الذيل
      ctx.lineTo(-this.size * 0.85, 0);
      // الجناح السفلي
      ctx.lineTo(-this.size * 0.6, this.size * 0.2);
      ctx.quadraticCurveTo(-this.size * 0.1, wingSpan * 0.4, -this.size * 0.4, wingSpan * 1.1);
      ctx.quadraticCurveTo(this.size * 0.2, wingSpan * 1.3, this.size * 0.9, 0);
      ctx.closePath();

      // تلوين الطائر مع توهج حريري
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();

      // رسم العين الصغيرة
      ctx.beginPath();
      ctx.arc(this.size * 0.45, -this.size * 0.12, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 0;
      ctx.fill();

      ctx.restore();
    }
  }

  // إنشاء سرب مكون من 14 طائراً ملوناً
  const birds = [];
  for (let i = 0; i < BIRD_COLORS.length; i++) {
    birds.push(new Bird(i, BIRD_COLORS[i]));
  }

  // حلقة التحريك الرئيسية 60 FPS
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // رسم ذيل حركي خفيف وشفاف لمسار الطيور
    birds.forEach(bird => {
      bird.update();
      bird.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();
})();