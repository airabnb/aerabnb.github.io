/**
 * MAIN CONTROLLER & STARK HUD LOGIC
 * Portfolio interactions, theme switcher, telemetry, tilt effects, and terminal communication.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initAudioToggle();
  initTelemetryClock();
  initScrollAnimations();
  initCard3DTilt();
  initContactTerminal();
  initRadarScanner();
  initQuickWebShootBtn();
  initSoundOnInteractions();
});

// --- 1. Theme Switcher ---
function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.suit-pill');
  const body = document.body;

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const suit = btn.getAttribute('data-suit');
      body.setAttribute('data-theme', suit);

      if (window.spiderAudio) {
        window.spiderAudio.playThemeSurge();
      }

      // Chibi comment
      if (window.chibiSpidey) {
        const suitNames = {
          classic: "Classic Red & Blue! Kostum legendaris Peter Parker! 🕷️",
          miles: "Miles Morales Cyber Glitch! Vibe neon masa depan! ⚡",
          iron: "Iron Spider Nanotech! Armor berteknologi Stark Industries! 🤖",
          gwen: "Spider-Gwen Cyber! Gaya synthwave penuh energi! 🌸"
        };
        window.chibiSpidey.say(suitNames[suit] || "Kostum baru terpasang!", 3500);
      }
    });
  });
}

// --- 2. Audio Toggle ---
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!window.spiderAudio) return;
    const isMuted = window.spiderAudio.toggleMute();
    audioBtn.classList.toggle('muted', isMuted);
    audioBtn.innerHTML = isMuted 
      ? `<span class="audio-icon">🔇</span> <span class="audio-text">Audio: OFF</span>`
      : `<span class="audio-icon">🔊</span> <span class="audio-text">Audio: ON</span>`;
    
    if (!isMuted) {
      window.spiderAudio.playBlip(1000, 0.1);
    }
  });
}

// --- 3. Telemetry Digital Clock & Status ---
function initTelemetryClock() {
  const clockEl = document.getElementById('hud-time');
  const dateEl = document.getElementById('hud-date');

  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${hours}:${minutes}:${seconds} UTC+7`;

    if (dateEl) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
      dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

// --- 4. Scroll Animations & Progress Bars ---
function initScrollAnimations() {
  const progressBars = document.querySelectorAll('.skill-progress-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetPercent = bar.getAttribute('data-percent') || '85%';
        bar.style.width = targetPercent;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => observer.observe(bar));

  // Fade-in HUD panels
  const hudSections = document.querySelectorAll('.hud-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  hudSections.forEach(sec => sectionObserver.observe(sec));
}

// --- 5. 3D Tilt Effect on Cards ---
function initCard3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// --- 6. Stark Contact Terminal ---
function initContactTerminal() {
  const form = document.getElementById('terminal-form');
  const outputBox = document.getElementById('terminal-output');
  if (!form || !outputBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('term-name').value.trim();
    const contact = document.getElementById('term-contact').value.trim();
    const msg = document.getElementById('term-msg').value.trim();

    if (!name || !msg) {
      appendTerminalLine(`> [ERROR]: Mohon lengkapi nama dan pesan digital Anda.`, 'err');
      if (window.spiderAudio) window.spiderAudio.playBlip(300, 0.2);
      return;
    }

    appendTerminalLine(`> [TRANSMITTING] Mengirim sinyal ke Almaira Ayu...`, 'info');
    if (window.spiderAudio) window.spiderAudio.playThwip();

    setTimeout(() => {
      appendTerminalLine(`> [SUCCESS]: Pesan dari "${name}" berhasil terenkripsi & tersimpan!`, 'success');
      appendTerminalLine(`> [STARK PROTOCOL]: "Terima kasih telah berkunjung ke markas web Almaira Ayu!"`, 'quote');
      
      if (window.spiderAudio) window.spiderAudio.playThemeSurge();
      if (window.chibiSpidey) {
        window.chibiSpidey.doFlip();
        window.chibiSpidey.say(`Pesan dari Kak ${name} sudah diterima Almaira! Keren! 💌🕸️`, 4000);
      }

      form.reset();
    }, 1000);
  });

  function appendTerminalLine(text, type = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    outputBox.appendChild(line);
    outputBox.scrollTop = outputBox.scrollHeight;
  }
}

// --- 7. Live Radar Scanner Graphic ---
function initRadarScanner() {
  const radarCanvas = document.getElementById('radar-canvas');
  if (!radarCanvas) return;
  const ctx = radarCanvas.getContext('2d');
  let angle = 0;

  function drawRadar() {
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = cx - 4;

    ctx.clearRect(0, 0, w, h);

    // Outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner concentric circles
    [0.35, 0.7].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * factor, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, 4);
    ctx.lineTo(cx, h - 4);
    ctx.moveTo(4, cy);
    ctx.lineTo(w - 4, cy);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.stroke();

    // Rotating sweep
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, 0, Math.PI * 0.28);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    // Leading sweep line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(Math.PI * 0.28) * radius, Math.sin(Math.PI * 0.28) * radius);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.restore();

    // Center Spidey blip
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff1a40';
    ctx.fill();

    angle += 0.04;
    requestAnimationFrame(drawRadar);
  }

  drawRadar();
}

// --- 8. Quick Web Shoot CTA Button ---
function initQuickWebShootBtn() {
  const shootBtn = document.getElementById('quick-shoot-btn');
  if (!shootBtn) return;

  shootBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const centerX = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
    const centerY = window.innerHeight / 2 + (Math.random() - 0.5) * 200;

    if (window.cyberCanvas) {
      window.cyberCanvas.createWebSplat(centerX, centerY);
    }
    if (window.chibiSpidey) {
      window.chibiSpidey.say("THWIP! Jaring laser digital dilepaskan! 💥", 2500);
    }
  });
}

// --- 9. Sound Effects on Clicks and Hovers ---
function initSoundOnInteractions() {
  document.querySelectorAll('a, button, .suit-pill, .portfolio-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.spiderAudio) window.spiderAudio.playBlip(1200, 0.03);
    });
  });
}
