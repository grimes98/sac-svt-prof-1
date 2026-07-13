/* =========================================================================
   🕊️ سرب الطيور المهاجرة الملونة في الخلفية — SAC Background Migrating Birds AI
   نظام طيران فيزيائي هادئ جداً (Boids Murmuration & V-Formation Physics)
   ========================================================================= */

(function() {
  if (document.getElementById('sacCursorBirdsCanvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'sacCursorBirdsCanvas';
  // وضع الكانفاس في الخلفية (z-index: 1) مع شفافية ناعمة جداً (opacity: 0.33) حتى لا تشوش على القراءة
  canvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; overflow:hidden; opacity:0.33; transition:opacity 0.8s ease;';
  
  function attachCanvas() {
    if (document.body) {
      document.body.appendChild(canvas);
    } else {
      setTimeout(attachCanvas, 50);
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
    targetX: width / 2,
    targetY: height / 2,
    isIdle: true, // يبدأ كل طائر بالطيران الحر في جهته الخاصة
    idleTimer: null,
    angle: 0,
    formationMode: 0 // 0: Swarm, 1: V-Formation المهاجر
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isIdle = false;
    // التبديل بين الدوران الحلزوني وشكل حرف V المهاجر أثناء حركة الكيرسور
    mouse.formationMode = (e.clientX + e.clientY) % 2 === 0 ? 1 : 0;
    clearTimeout(mouse.idleTimer);
    mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 2200);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isIdle = false;
      clearTimeout(mouse.idleTimer);
      mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 2200);
    }
  }, { passive: true });

  // ألوان باستيل هادئة وراقية مناسبة للخلفية (زمردي هادئ، فيروزي ناعم، مرجاني باهت، أزرق سماوي، ذهبي هادئ)
  const BIRD_COLORS = [
    '#00a8a8', '#28c8c8', '#f59e0b', '#ec4899', '#3b82f6', 
    '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#06b6d4'
  ];

  class Bird {
    constructor(id, color) {
      this.id = id;
      this.color = color;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      // سرعات ابتدائية هادئة وفي جهات مختلفة تماماً
      const randomAngle = Math.random() * Math.PI * 2;
      const initialSpeed = 1.2 + Math.random() * 0.8;
      this.vx = Math.cos(randomAngle) * initialSpeed;
      this.vy = Math.sin(randomAngle) * initialSpeed;
      this.size = 14 + Math.random() * 6; // حجم ناعم ومتناسق
      this.maxSpeed = 1.6 + (id % 4) * 0.18; // سرعة هادئة جداً ومريحة للعين (سماء هادئة)
      this.friction = 0.96 + Math.random() * 0.02;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.08 + Math.random() * 0.06; // رفرفة أجنحة بطيئة وطبيعية
      this.lag = 0.015 + (id * 0.003);
      // إحداثيات خاصة بتشكيل حرف V للطيور المهاجرة
      const side = id % 2 === 0 ? 1 : -1;
      const row = Math.floor(id / 2) + 1;
      this.vOffsetX = -row * 28;
      this.vOffsetY = side * row * 24;
    }

    update() {
      // 1. حالة السكون (الماوس لا يتحرك): كل طائر يطير في جهته الخاصة بحرية تامة في السماء
      if (mouse.isIdle) {
        // طيران انسيابي حر مع تجول هادئ في أنحاء الشاشة
        this.vx += (Math.random() - 0.5) * 0.15;
        this.vy += (Math.random() - 0.5) * 0.15;

        // الارتداد الناعم عند وصول حدود الشاشة ليبقى الطائر يحلق في الأفق
        if (this.x < -40) this.x = width + 40;
        if (this.x > width + 40) this.x = -40;
        if (this.y < -40) this.y = height + 40;
        if (this.y > height + 40) this.y = -40;
      } else {
        // 2. حالة حركة الكيرسور: الطيور تتجمع حول الماوس وتتخذ أشكال الطيور المهاجرة
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        let targetX = mouse.x;
        let targetY = mouse.y;

        // تشكيل حرف V الشهير للطيور المهاجرة خلف مؤشر الماوس
        if (mouse.formationMode === 1 && this.id > 0) {
          const leaderAngle = Math.atan2(mouse.targetY - mouse.y, mouse.targetX - mouse.x);
          targetX = mouse.x + Math.cos(leaderAngle) * this.vOffsetX - Math.sin(leaderAngle) * this.vOffsetY;
          targetY = mouse.y + Math.sin(leaderAngle) * this.vOffsetX + Math.cos(leaderAngle) * this.vOffsetY;
        } else if (this.id > 0) {
          // دوران حلزوني متناغم (Murmuration Swirl) حول الكيرسور
          const orbitRadius = 60 + (this.id * 12);
          targetX = mouse.x + Math.cos(Date.now() * 0.0015 + this.id * 0.5) * orbitRadius;
          targetY = mouse.y + Math.sin(Date.now() * 0.0015 + this.id * 0.5) * (orbitRadius * 0.65);
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
          this.vx += (dx / dist) * this.maxSpeed * this.lag * 5;
          this.vy += (dy / dist) * this.maxSpeed * this.lag * 5;
        }
      }

      // تنافر فيزيائي ناعم (Separation) لكي لا تصطدم الطيور ببعضها
      birds.forEach(other => {
        if (other !== this) {
          const odx = this.x - other.x;
          const ody = this.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < this.size * 2.8 && odist > 0) {
            this.vx += (odx / odist) * 0.18;
            this.vy += (ody / odist) * 0.18;
          }
        }
      });

      // تحديد السرعة القصوى الهادئة وتطبيق الاحتكاك اللطيف
      const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (currentSpeed > this.maxSpeed) {
        this.vx = (this.vx / currentSpeed) * this.maxSpeed;
        this.vy = (this.vy / currentSpeed) * this.maxSpeed;
      }

      this.x += this.vx;
      this.y += this.vy;

      // رفرفة أجنحة طبيعية وناعمة
      this.wingAngle += this.wingSpeed * (currentSpeed * 0.4 + 0.6);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const flightAngle = Math.atan2(this.vy, this.vx);
      ctx.rotate(flightAngle);

      const wingSpan = Math.sin(this.wingAngle) * (this.size * 0.85);

      ctx.beginPath();
      // الرأس والمنقار الانسيابي
      ctx.moveTo(this.size, 0);
      // الجناح العلوي
      ctx.quadraticCurveTo(this.size * 0.3, -wingSpan * 1.35, -this.size * 0.4, -wingSpan * 1.15);
      ctx.quadraticCurveTo(-this.size * 0.1, -wingSpan * 0.35, -this.size * 0.6, -this.size * 0.22);
      // الذيل
      ctx.lineTo(-this.size * 0.9, 0);
      // الجناح السفلي
      ctx.lineTo(-this.size * 0.6, this.size * 0.22);
      ctx.quadraticCurveTo(-this.size * 0.1, wingSpan * 0.35, -this.size * 0.4, wingSpan * 1.15);
      ctx.quadraticCurveTo(this.size * 0.3, wingSpan * 1.35, this.size, 0);
      ctx.closePath();

      // تلوين الطائر بلون باستيل راقٍ وناعم
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.restore();
    }
  }

  // إنشاء سرب مكون من 12 طائراً هادئاً
  const birds = [];
  for (let i = 0; i < 12; i++) {
    birds.push(new Bird(i, BIRD_COLORS[i % BIRD_COLORS.length]));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    birds.forEach(bird => {
      bird.update();
      bird.draw(ctx);
    });
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    animate();
  } else {
    window.addEventListener('DOMContentLoaded', animate);
  }
})();