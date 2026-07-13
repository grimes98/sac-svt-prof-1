/* =========================================================================
   🕊️ سرب الطيور الملونة المتحركة مع الكيرسور — SAC Cursor Flocking Birds AI
   نظام تحريك فيزيائي سلس (Boids Physics) لطيور ملونة تطير وتتبع مؤشر الماوس
   ========================================================================= */

(function() {
  if (document.getElementById('sacCursorBirdsCanvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'sacCursorBirdsCanvas';
  canvas.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:999991; pointer-events:none; overflow:hidden;';
  
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

  // موقع الكيرسور (يبدأ في الطيران الدائري فوراً)
  const mouse = {
    x: width / 2,
    y: height / 3,
    targetX: width / 2,
    targetY: height / 3,
    isIdle: true, // يبدأ في الدوران الانسيابي فور فتح الصفحة
    idleTimer: null,
    angle: 0
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isIdle = false;
    clearTimeout(mouse.idleTimer);
    mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 1400);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.isIdle = false;
      clearTimeout(mouse.idleTimer);
      mouse.idleTimer = setTimeout(() => { mouse.isIdle = true; }, 1400);
    }
  }, { passive: true });

  // ألوان الطيور الزاهية (زمردي، فيروزي، ذهبي، مرجاني، أزرق ملكي، برتقالي، وردي)
  const BIRD_COLORS = [
    '#00a8a8', '#28c8c8', '#f59e0b', '#ec4899', '#3b82f6', 
    '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#eab308', 
    '#06b6d4', '#6366f1', '#ef4444', '#0d9488'
  ];

  class Bird {
    constructor(id, color) {
      this.id = id;
      this.color = color;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 5;
      this.vy = (Math.random() - 0.5) * 5;
      this.size = 16 + Math.random() * 10; // زيادة حجم الطائر ليكون بارزاً ومبهجاً
      this.maxSpeed = 4.2 + (14 - id) * 0.25;
      this.friction = 0.93 + Math.random() * 0.03;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.18 + Math.random() * 0.14;
      this.lag = 0.04 + (id * 0.007);
    }

    update() {
      if (mouse.isIdle) {
        mouse.angle += 0.016;
        const radius = 160 + Math.sin(mouse.angle * 1.5) * 60;
        mouse.x = mouse.targetX + Math.cos(mouse.angle + this.id * 0.35) * radius;
        mouse.y = mouse.targetY + Math.sin(mouse.angle + this.id * 0.35) * (radius * 0.75);
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      }

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        this.vx += (dx / dist) * this.maxSpeed * this.lag * 12;
        this.vy += (dy / dist) * this.maxSpeed * this.lag * 12;
      }

      // تنافر حتى لا تتطابق
      birds.forEach(other => {
        if (other !== this) {
          const odx = this.x - other.x;
          const ody = this.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < this.size * 2.5 && odist > 0) {
            this.vx += (odx / odist) * 0.55;
            this.vy += (ody / odist) * 0.55;
          }
        }
      });

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.x += this.vx;
      this.y += this.vy;

      this.wingAngle += this.wingSpeed * (Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 0.35 + 0.6);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const flightAngle = Math.atan2(this.vy, this.vx);
      ctx.rotate(flightAngle);

      const wingSpan = Math.sin(this.wingAngle) * (this.size * 0.9);

      ctx.beginPath();
      ctx.moveTo(this.size, 0);
      ctx.quadraticCurveTo(this.size * 0.25, -wingSpan * 1.4, -this.size * 0.45, -wingSpan * 1.2);
      ctx.quadraticCurveTo(-this.size * 0.1, -wingSpan * 0.4, -this.size * 0.65, -this.size * 0.25);
      ctx.lineTo(-this.size * 0.95, 0);
      ctx.lineTo(-this.size * 0.65, this.size * 0.25);
      ctx.quadraticCurveTo(-this.size * 0.1, wingSpan * 0.4, -this.size * 0.45, wingSpan * 1.2);
      ctx.quadraticCurveTo(this.size * 0.25, wingSpan * 1.4, this.size, 0);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.fill();

      // عين الطائر
      ctx.beginPath();
      ctx.arc(this.size * 0.5, -this.size * 0.14, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 0;
      ctx.fill();

      ctx.restore();
    }
  }

  const birds = [];
  for (let i = 0; i < BIRD_COLORS.length; i++) {
    birds.push(new Bird(i, BIRD_COLORS[i]));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    birds.forEach(bird => {
      bird.update();
      bird.draw(ctx);
    });
    requestAnimationFrame(animate);
  }

  // التأكد من تشغيل التحريك حتى عند التحميل المتأخر
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    animate();
  } else {
    window.addEventListener('DOMContentLoaded', animate);
  }
})();