/**
 * CYBER MATRIX & INTERACTIVE WEB SHOOTER
 * High-definition digital particle canvas + click-to-shoot holographic spider-webs.
 */

class CyberWebCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.particles = [];
    this.webSplats = [];
    this.mouse = { x: -9999, y: -9999, radius: 160 };

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cyber-canvas';
    this.canvas.className = 'cyber-bg-canvas';
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    const particleCount = Math.min(80, Math.floor((this.width * this.height) / 16000));
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 26, 64, 0.7)',
        glow: Math.random() > 0.5 ? '#00f0ff' : '#ff1a40'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });

    // Click anywhere to fire holographic web splat
    window.addEventListener('click', (e) => {
      // Don't intercept clicks inside buttons, links, inputs, or remote panel
      if (e.target.closest('button, a, input, textarea, select, .chibi-remote-panel, .chibi-character')) {
        return;
      }
      this.createWebSplat(e.clientX, e.clientY);
    });
  }

  createWebSplat(targetX, targetY) {
    if (window.spiderAudio) {
      window.spiderAudio.playThwip();
    }

    // Determine shooter origin: from Chibi Spidey if available, otherwise from screen bottom/cursor
    let startX = targetX;
    let startY = targetY + 60;
    if (window.chibiSpidey && window.chibiSpidey.x) {
      startX = window.chibiSpidey.x + 45;
      startY = window.chibiSpidey.y + 30;
    }

    const splat = {
      targetX,
      targetY,
      startX,
      startY,
      radius: Math.random() * 25 + 40,
      spokes: Math.floor(Math.random() * 3) + 7, // 7-9 web spokes
      rings: Math.floor(Math.random() * 2) + 3,  // 3-4 rings
      opacity: 1.0,
      sparks: [],
      born: Date.now(),
      lifetime: 3200 // 3.2 seconds fade
    };

    // Generate burst sparks
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      splat.sparks.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1.5,
        life: 1.0
      });
    }

    this.webSplats.push(splat);
  }

  drawWebSplat(splat) {
    const elapsed = Date.now() - splat.born;
    const progress = elapsed / splat.lifetime;
    if (progress >= 1) return false;

    const alpha = (1 - progress) * splat.opacity;
    const ctx = this.ctx;

    // 1. Draw web shooting line from Chibi to target (if early in animation)
    if (progress < 0.25) {
      const lineAlpha = (1 - progress / 0.25) * 0.8;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(splat.startX, splat.startY);
      ctx.lineTo(splat.targetX, splat.targetY);
      ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Holographic Geometric Spider-Web
    ctx.save();
    ctx.translate(splat.targetX, splat.targetY);

    // Spokes
    ctx.beginPath();
    for (let i = 0; i < splat.spokes; i++) {
      const angle = (i / splat.spokes) * Math.PI * 2;
      const x = Math.cos(angle) * splat.radius;
      const y = Math.sin(angle) * splat.radius;
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 9;
    ctx.stroke();

    // Concentric web spirals / rings
    for (let r = 1; r <= splat.rings; r++) {
      const currentR = (splat.radius / splat.rings) * r;
      ctx.beginPath();
      for (let i = 0; i <= splat.spokes; i++) {
        const angle = (i / splat.spokes) * Math.PI * 2;
        // slightly curved polygon
        const x = Math.cos(angle) * currentR;
        const y = Math.sin(angle) * currentR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.75})`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    // Center node core
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 26, 64, ${alpha})`;
    ctx.shadowColor = '#ff1a40';
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.restore();

    // 3. Draw sparks
    ctx.save();
    for (let spark of splat.sparks) {
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.94;
      spark.vy *= 0.94;
      spark.life -= 0.03;

      if (spark.life > 0) {
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${spark.life * alpha})`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    }
    ctx.restore();

    return true;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw connecting web nodes
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];

      // Update particle position
      p1.x += p1.vx;
      p1.y += p1.vy;

      if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p1.color;
      this.ctx.fill();

      // Connect to cursor with web line
      const mouseDx = this.mouse.x - p1.x;
      const mouseDy = this.mouse.y - p1.y;
      const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      if (mouseDist < this.mouse.radius) {
        const mouseAlpha = (1 - mouseDist / this.mouse.radius) * 0.7;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(0, 240, 255, ${mouseAlpha})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      }

      // Connect to other particles with web lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    // 2. Render active web splats
    this.webSplats = this.webSplats.filter(splat => this.drawWebSplat(splat));

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  window.cyberCanvas = new CyberWebCanvas();
});
