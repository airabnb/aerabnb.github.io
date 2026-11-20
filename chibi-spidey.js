/**
 * CHIBI SPIDER-MAN INTERACTIVE ENGINE
 * Autonomous, interactive, animated SVG Chibi Spider-Man companion for Almaira Ayu's website.
 */

class ChibiSpiderMan {
  constructor() {
    this.container = null;
    this.spideyEl = null;
    this.speechEl = null;
    this.webLineEl = null;
    this.spideySenseEl = null;

    // Movement & state variables
    this.x = 80;
    this.y = window.innerHeight - 110;
    this.targetX = this.x;
    this.targetY = this.y;
    this.baseY = window.innerHeight - 110;
    this.speed = 2.2;
    this.direction = 1; // 1 = right, -1 = left
    this.state = 'walk'; // 'walk', 'idle', 'follow', 'swing', 'fall', 'sit', 'flip'
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    
    // Animation frame & timer
    this.stepCounter = 0;
    this.idleTimer = 0;
    this.speechTimer = null;
    this.swingAngle = 0;
    this.swingVelocity = 0.05;
    this.anchorX = 0;
    this.anchorY = 0;

    // Quotes for speech bubble
    this.quotes = [
      "Halo! Selamat datang di website Almaira Ayu! 🕸️",
      "Keren kan websitenya? Almaira jagonya teknologi! 💻",
      "With great power comes great responsibility! ⚡",
      "Coba klik di sembarang layar untuk tembak jaring web! 🎯",
      "Mau lihat aku berayun? Klik tombol 'Berayun' di panel! 🕷️",
      "Sistem Stark Tech aktif! Web ini full interaktif! 🚀",
      "Almaira Ayu: Kreatif, Cerdas, & Penuh Inovasi! ✨",
      "Kamu bisa seret (drag) aku ke mana saja lho! Coba deh! 🖐️",
      "Ganti kostum di panel atas untuk vibes Spider-Verse yang beda! 🎭"
    ];

    this.init();
  }

  init() {
    this.createDOM();
    this.bindEvents();
    this.updatePosition();
    this.startLoop();
    
    // First welcome speech after 1.5 seconds
    setTimeout(() => {
      this.say("Hai! Aku Chibi Spidey, asisten digital Almaira Ayu! 🕷️", 4500);
    }, 1500);
  }

  createDOM() {
    // Main container
    this.container = document.createElement('div');
    this.container.id = 'chibi-spidey-container';
    this.container.className = 'chibi-spidey-container';

    // SVG Web Swing Line
    this.webLineEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.webLineEl.setAttribute('id', 'chibi-web-line');
    this.webLineEl.setAttribute('class', 'chibi-web-line');
    this.webLineEl.innerHTML = `<line x1="0" y1="0" x2="0" y2="0" stroke="rgba(255,255,255,0.9)" stroke-width="2.5" stroke-dasharray="3,2" filter="drop-shadow(0 0 5px #00f0ff)" />`;

    // Spider-Sense lightning icon
    this.spideySenseEl = document.createElement('div');
    this.spideySenseEl.className = 'spidey-sense-indicator';
    this.spideySenseEl.innerHTML = `
      <svg viewBox="0 0 100 40" class="sense-svg">
        <path d="M10 35 L20 15 L28 25 L38 5" stroke="#ffe600" stroke-width="3" fill="none" filter="drop-shadow(0 0 4px #ff0055)" />
        <path d="M90 35 L80 15 L72 25 L62 5" stroke="#ffe600" stroke-width="3" fill="none" filter="drop-shadow(0 0 4px #ff0055)" />
        <path d="M35 15 L45 0 L55 0 L65 15" stroke="#00f0ff" stroke-width="2.5" fill="none" />
      </svg>
    `;

    // Speech bubble
    this.speechEl = document.createElement('div');
    this.speechEl.className = 'chibi-speech-bubble';
    this.speechEl.innerHTML = `<span class="bubble-text">Hai!</span><div class="bubble-arrow"></div>`;

    // Chibi Character SVG Element
    this.spideyEl = document.createElement('div');
    this.spideyEl.className = 'chibi-character';
    this.spideyEl.innerHTML = `
      <div class="chibi-body-wrapper">
        <svg viewBox="0 0 120 150" class="chibi-svg">
          <defs>
            <linearGradient id="suitRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff1a40" />
              <stop offset="100%" stop-color="#b80024" />
            </linearGradient>
            <linearGradient id="suitBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00a8ff" />
              <stop offset="100%" stop-color="#0044aa" />
            </linearGradient>
            <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#e0f7fa" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Shadow underneath -->
          <ellipse cx="60" cy="144" rx="34" ry="6" fill="rgba(0,0,0,0.4)" class="chibi-shadow" />

          <!-- Left Leg & Boot -->
          <g class="leg left-leg">
            <path d="M46 95 L40 122 L32 138 L48 138 L50 122 Z" fill="url(#suitBlue)" />
            <!-- Boot -->
            <path d="M30 126 L48 126 L48 140 L28 140 Z" fill="url(#suitRed)" stroke="#111" stroke-width="1.5" />
            <!-- Web line on boot -->
            <line x1="39" y1="126" x2="39" y2="140" stroke="#111" stroke-width="1" />
          </g>

          <!-- Right Leg & Boot -->
          <g class="leg right-leg">
            <path d="M74 95 L80 122 L88 138 L72 138 L70 122 Z" fill="url(#suitBlue)" />
            <!-- Boot -->
            <path d="M70 126 L88 126 L90 140 L70 140 Z" fill="url(#suitRed)" stroke="#111" stroke-width="1.5" />
            <!-- Web line on boot -->
            <line x1="79" y1="126" x2="79" y2="140" stroke="#111" stroke-width="1" />
          </g>

          <!-- Torso & Belt -->
          <g class="torso">
            <!-- Blue Sides -->
            <path d="M38 78 L82 78 L80 102 L40 102 Z" fill="url(#suitBlue)" />
            <!-- Red Chest Center -->
            <path d="M48 78 L72 78 L68 102 L52 102 Z" fill="url(#suitRed)" stroke="#111" stroke-width="1.2" />
            <!-- Web Lines on Chest -->
            <line x1="60" y1="78" x2="60" y2="102" stroke="#222" stroke-width="1" />
            <line x1="50" y1="88" x2="70" y2="88" stroke="#222" stroke-width="1" />
            <!-- Spider Chest Emblem -->
            <ellipse cx="60" cy="90" rx="3.5" ry="4.5" fill="#111" />
            <!-- Spider legs -->
            <path d="M57 88 Q50 82 46 84 M57 91 Q49 91 46 94 M63 88 Q70 82 74 84 M63 91 Q71 91 74 94" stroke="#111" stroke-width="1.5" fill="none" />
            <path d="M58 93 Q52 98 48 102 M62 93 Q68 98 72 102" stroke="#111" stroke-width="1.5" fill="none" />
            <!-- Red Belt -->
            <rect x="42" y="99" width="36" height="5" rx="1" fill="url(#suitRed)" stroke="#111" stroke-width="1" />
          </g>

          <!-- Left Arm & Hand -->
          <g class="arm left-arm">
            <path d="M40 80 L22 96 L28 102 L44 86 Z" fill="url(#suitBlue)" />
            <!-- Red Glove -->
            <circle cx="21" cy="99" r="7.5" fill="url(#suitRed)" stroke="#111" stroke-width="1.5" />
            <!-- Web Shooter Gauntlet dot -->
            <circle cx="21" cy="99" r="2" fill="#00f0ff" filter="url(#neonGlow)" />
          </g>

          <!-- Right Arm & Hand -->
          <g class="arm right-arm">
            <path d="M80 80 L98 96 L92 102 L76 86 Z" fill="url(#suitBlue)" />
            <!-- Red Glove -->
            <circle cx="99" cy="99" r="7.5" fill="url(#suitRed)" stroke="#111" stroke-width="1.5" />
            <!-- Web Shooter Gauntlet dot -->
            <circle cx="99" cy="99" r="2" fill="#00f0ff" filter="url(#neonGlow)" />
          </g>

          <!-- Big Cute Chibi Head -->
          <g class="head">
            <!-- Mask Base Shape -->
            <path d="M60 12 C28 12 20 38 20 56 C20 78 40 85 60 85 C80 85 100 78 100 56 C100 38 92 12 60 12 Z" 
                  fill="url(#suitRed)" stroke="#1a0005" stroke-width="2.5" />

            <!-- Mask Webbing Patterns -->
            <!-- Radial Web Lines from Center -->
            <line x1="60" y1="52" x2="60" y2="14" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="32" y2="24" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="88" y2="24" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="22" y2="52" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="98" y2="52" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="30" y2="76" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="90" y2="76" stroke="#4a000d" stroke-width="1.3" />
            <line x1="60" y1="52" x2="60" y2="84" stroke="#4a000d" stroke-width="1.3" />

            <!-- Concentric Web Arcs -->
            <path d="M46 32 Q60 26 74 32" stroke="#4a000d" stroke-width="1.2" fill="none" />
            <path d="M38 42 Q60 36 82 42" stroke="#4a000d" stroke-width="1.2" fill="none" />
            <path d="M32 58 Q60 52 88 58" stroke="#4a000d" stroke-width="1.2" fill="none" />
            <path d="M40 70 Q60 76 80 70" stroke="#4a000d" stroke-width="1.2" fill="none" />

            <!-- Expressive Eyes -->
            <!-- Left Eye Outer Frame -->
            <path class="eye-outer left-eye-outer" d="M32 46 C35 34 50 36 53 54 C53 62 44 64 34 60 C30 58 30 52 32 46 Z" 
                  fill="#0c0c14" stroke="#111" stroke-width="2" />
            <!-- Left Eye Inner (Glows!) -->
            <path class="eye-inner left-eye-inner" d="M34 46 C37 38 48 39 50 53 C50 59 43 60 36 57 C33 55 33 51 34 46 Z" 
                  fill="url(#eyeGlow)" filter="url(#neonGlow)" />
            <!-- Left Eye Reflection -->
            <ellipse cx="44" cy="46" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.9" />

            <!-- Right Eye Outer Frame -->
            <path class="eye-outer right-eye-outer" d="M88 46 C85 34 70 36 67 54 C67 62 76 64 86 60 C90 58 90 52 88 46 Z" 
                  fill="#0c0c14" stroke="#111" stroke-width="2" />
            <!-- Right Eye Inner (Glows!) -->
            <path class="eye-inner right-eye-inner" d="M86 46 C83 38 72 39 70 53 C70 59 77 60 84 57 C87 55 87 51 86 46 Z" 
                  fill="url(#eyeGlow)" filter="url(#neonGlow)" />
            <!-- Right Eye Reflection -->
            <ellipse cx="76" cy="46" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.9" />
          </g>
        </svg>
      </div>
    `;

    // Append all parts to container
    this.container.appendChild(this.spideySenseEl);
    this.container.appendChild(this.speechEl);
    this.container.appendChild(this.spideyEl);
    document.body.appendChild(this.webLineEl);
    document.body.appendChild(this.container);

    // Build Floating Action Controller
    this.createControlPanel();
  }

  createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'chibi-remote-panel';
    panel.innerHTML = `
      <div class="remote-header">
        <span class="remote-badge"><i class="spider-icon">🕷️</i> CHIBI SPIDEY CONTROLLER</span>
        <button class="remote-collapse-btn" id="remote-collapse-btn" title="Minimalkan Panel">−</button>
      </div>
      <div class="remote-body" id="remote-body">
        <div class="remote-btn-grid">
          <button class="remote-btn active" data-action="walk">🚶 Jalan Santai</button>
          <button class="remote-btn" data-action="follow">🎯 Ikuti Kursor</button>
          <button class="remote-btn" data-action="swing">🕸️ Ayunan Web</button>
          <button class="remote-btn" data-action="flip">🤸 Backflip</button>
          <button class="remote-btn" data-action="sense">⚡ Spidey Sense</button>
          <button class="remote-btn" data-action="say">💬 Ngobrol</button>
        </div>
        <div class="remote-status">
          <span class="status-dot"></span> Mode: <strong id="chibi-current-mode">Jalan Santai</strong>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Panel collapse toggle
    const collapseBtn = panel.querySelector('#remote-collapse-btn');
    const remoteBody = panel.querySelector('#remote-body');
    collapseBtn.addEventListener('click', () => {
      remoteBody.classList.toggle('hidden');
      collapseBtn.textContent = remoteBody.classList.contains('hidden') ? '+' : '−';
    });

    // Panel actions
    panel.querySelectorAll('.remote-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        panel.querySelectorAll('.remote-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const action = btn.getAttribute('data-action');
        this.triggerAction(action);
      });
    });
  }

  triggerAction(action) {
    if (window.spiderAudio) window.spiderAudio.playBlip(900, 0.05);

    const modeLabel = document.getElementById('chibi-current-mode');

    switch (action) {
      case 'walk':
        this.state = 'walk';
        this.y = this.baseY;
        this.hideWebLine();
        if (modeLabel) modeLabel.textContent = 'Jalan Santai';
        this.say("Ayo keliling bareng aku! 🚶‍♂️", 3000);
        break;

      case 'follow':
        this.state = 'follow';
        this.y = this.baseY;
        this.hideWebLine();
        if (modeLabel) modeLabel.textContent = 'Ikuti Kursor';
        this.say("Gerakkan kursor kamu, aku ikuti ya! 🎯", 3500);
        break;

      case 'swing':
        this.startSwing();
        if (modeLabel) modeLabel.textContent = 'Ayunan Web';
        break;

      case 'flip':
        this.doFlip();
        if (modeLabel) modeLabel.textContent = 'Heroic Flip';
        break;

      case 'sense':
        this.triggerSpideySense();
        if (modeLabel) modeLabel.textContent = 'Spidey Sense!';
        break;

      case 'say':
        this.speakRandomQuote();
        break;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.baseY = window.innerHeight - 110;
      if (this.state === 'walk') {
        this.y = this.baseY;
      }
    });

    // Track cursor for 'follow' mode
    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      if (this.state === 'follow') {
        // slightly offset so he doesn't stand directly underneath pointer
        this.targetX = e.clientX - 45;
      }
    });

    // Drag and drop chibi
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.chibi-speech-bubble')) return;
      this.isDragging = true;
      this.dragOffsetX = e.clientX - this.x;
      this.dragOffsetY = e.clientY - this.y;
      this.state = 'drag';
      this.hideWebLine();
      this.container.classList.add('dragging');
      this.say("Waaa! Aku melayang! 🚀", 2000);
      if (window.spiderAudio) window.spiderAudio.playJump();
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.x = e.clientX - this.dragOffsetX;
        this.y = e.clientY - this.dragOffsetY;
        this.updatePosition();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.container.classList.remove('dragging');
        // fall back down with gravity
        this.state = 'fall';
        if (window.spiderAudio) window.spiderAudio.playJump();
      }
    });

    // Touch support for mobile
    this.container.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.isDragging = true;
      this.dragOffsetX = touch.clientX - this.x;
      this.dragOffsetY = touch.clientY - this.y;
      this.state = 'drag';
      this.hideWebLine();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        const touch = e.touches[0];
        this.x = touch.clientX - this.dragOffsetX;
        this.y = touch.clientY - this.dragOffsetY;
        this.updatePosition();
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.state = 'fall';
      }
    });

    // Clicking chibi directly triggers flip or speech!
    this.spideyEl.addEventListener('click', () => {
      if (!this.isDragging) {
        if (Math.random() > 0.5) {
          this.doFlip();
        } else {
          this.speakRandomQuote();
        }
      }
    });
  }

  say(text, duration = 3500) {
    if (!this.speechEl) return;
    const textSpan = this.speechEl.querySelector('.bubble-text');
    if (textSpan) textSpan.innerHTML = text;
    this.speechEl.classList.add('visible');

    if (this.speechTimer) clearTimeout(this.speechTimer);
    this.speechTimer = setTimeout(() => {
      this.speechEl.classList.remove('visible');
    }, duration);
  }

  speakRandomQuote() {
    const q = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    this.say(q, 4500);
    this.triggerBlink();
    if (window.spiderAudio) window.spiderAudio.playBlip(750, 0.08);
  }

  triggerBlink() {
    this.container.classList.add('blink');
    setTimeout(() => {
      this.container.classList.remove('blink');
    }, 280);
  }

  triggerSpideySense() {
    if (window.spiderAudio) window.spiderAudio.playSpideySense();
    this.spideySenseEl.classList.add('active');
    this.container.classList.add('sense-shiver');
    this.say("⚡ Spidey Sense Bergetar! Ada ide hebat dari Almaira!", 3500);

    setTimeout(() => {
      this.spideySenseEl.classList.remove('active');
      this.container.classList.remove('sense-shiver');
    }, 2500);
  }

  doFlip() {
    if (window.spiderAudio) window.spiderAudio.playJump();
    this.container.classList.add('do-flip');
    this.say("Wuhuuu! Superhero Backflip! 🕷️✨", 2500);

    setTimeout(() => {
      this.container.classList.remove('do-flip');
      // superhero landing pose
      this.container.classList.add('hero-landing');
      setTimeout(() => {
        this.container.classList.remove('hero-landing');
      }, 800);
    }, 850);
  }

  startSwing() {
    this.state = 'swing';
    this.anchorX = this.x + (this.direction > 0 ? 120 : -120);
    this.anchorY = 0; // top ceiling
    this.swingAngle = this.direction > 0 ? -Math.PI / 4 : Math.PI / 4;
    this.swingVelocity = this.direction > 0 ? 0.035 : -0.035;
    
    if (window.spiderAudio) window.spiderAudio.playThwip();
    this.say("Thwip! Mengayun di angkasa digital! 🕸️💨", 3000);
  }

  hideWebLine() {
    if (this.webLineEl) {
      this.webLineEl.style.display = 'none';
    }
  }

  updateWebLine(x1, y1, x2, y2) {
    if (!this.webLineEl) return;
    this.webLineEl.style.display = 'block';
    const line = this.webLineEl.querySelector('line');
    if (line) {
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
    }
  }

  updatePosition() {
    this.container.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
  }

  startLoop() {
    const loop = () => {
      this.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update() {
    if (this.isDragging) return;

    const screenWidth = window.innerWidth;

    // --- State: WALK (Autonomous Patrol) ---
    if (this.state === 'walk') {
      this.x += this.speed * this.direction;
      this.stepCounter += 0.2;

      // Animate walk cycle with class
      this.container.classList.add('walking');
      this.container.classList.remove('swinging', 'falling', 'sitting');

      // Check boundaries
      if (this.direction > 0 && this.x > screenWidth - 140) {
        this.direction = -1;
        this.pauseAndTurn();
      } else if (this.direction < 0 && this.x < 30) {
        this.direction = 1;
        this.pauseAndTurn();
      }

      // Flip orientation
      this.spideyEl.style.transform = `scaleX(${this.direction})`;
    }

    // --- State: FOLLOW (Follow Cursor) ---
    else if (this.state === 'follow') {
      const dx = this.targetX - this.x;
      const dist = Math.abs(dx);

      if (dist > 15) {
        this.direction = dx > 0 ? 1 : -1;
        this.x += (dx > 0 ? this.speed * 1.5 : -this.speed * 1.5);
        this.container.classList.add('walking');
        this.spideyEl.style.transform = `scaleX(${this.direction})`;
      } else {
        this.container.classList.remove('walking');
      }
    }

    // --- State: SWING (Pendulum Web Arc) ---
    else if (this.state === 'swing') {
      this.container.classList.remove('walking');
      this.container.classList.add('swinging');

      // Physics pendulum
      const ropeLength = Math.max(180, this.baseY - 50);
      const gravity = 0.0016;

      const angularAccel = (-gravity / ropeLength) * 1000 * Math.sin(this.swingAngle);
      this.swingVelocity += angularAccel;
      this.swingVelocity *= 0.995; // damping
      this.swingAngle += this.swingVelocity;

      this.x = this.anchorX + Math.sin(this.swingAngle) * ropeLength;
      this.y = this.anchorY + Math.cos(this.swingAngle) * ropeLength;

      // Update SVG web line
      this.updateWebLine(this.anchorX, this.anchorY, this.x + 45, this.y + 40);

      // Facing orientation based on velocity
      if (this.swingVelocity > 0.005) {
        this.spideyEl.style.transform = `scaleX(1) rotate(${this.swingAngle * 25}deg)`;
      } else if (this.swingVelocity < -0.005) {
        this.spideyEl.style.transform = `scaleX(-1) rotate(${-this.swingAngle * 25}deg)`;
      }

      // If swing dampens out or hits floor, detach web and land
      if (this.y >= this.baseY - 10 && Math.abs(this.swingVelocity) < 0.02) {
        this.hideWebLine();
        this.y = this.baseY;
        this.state = 'walk';
        this.doFlip();
      }
    }

    // --- State: FALL (Gravity Drop after Drag) ---
    else if (this.state === 'fall') {
      this.container.classList.remove('walking', 'swinging');
      this.container.classList.add('falling');

      this.y += 14; // fall speed
      if (this.y >= this.baseY) {
        this.y = this.baseY;
        this.state = 'walk';
        this.container.classList.remove('falling');
        this.container.classList.add('hero-landing');
        if (window.spiderAudio) window.spiderAudio.playJump();
        setTimeout(() => {
          this.container.classList.remove('hero-landing');
        }, 700);
      }
    }

    // --- Random Eye Blinking ---
    if (Math.random() < 0.006 && !this.container.classList.contains('blink')) {
      this.triggerBlink();
    }

    this.updatePosition();
  }

  pauseAndTurn() {
    this.state = 'idle';
    this.container.classList.remove('walking');
    
    // Look around
    setTimeout(() => {
      this.triggerBlink();
      // Resume walking
      setTimeout(() => {
        this.state = 'walk';
      }, 800);
    }, 600);
  }
}

// Instantiate Chibi Spidey once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.chibiSpidey = new ChibiSpiderMan();
});
