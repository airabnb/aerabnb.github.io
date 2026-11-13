/**
 * ALMAIRA AYU // Main Interactive Engine
 * Handles Custom Cursor, Text Scrambler, 3D Card Tilt, Stat Counters,
 * Skill Filters, Modals, Uptime Telemetry & Transmission Form.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. System Uptime Timer & Ping Telemetry
    initUptimeAndPing();

    // 2. Custom Cyber Cursor
    initCyberCursor();

    // 3. Text Scramble & Role Cycler
    initTextScrambler();

    // 4. 3D Interactive Card Tilt
    initCardTilt();

    // 5. Telemetry Number Counters
    initCounters();

    // 6. Skill Category Filters
    initSkillFilters();

    // 7. Audio SFX Button & Sound Triggers
    initAudioTriggers();

    // 8. Project Inspector Modal
    initProjectModal();

    // 9. Contact Transmission Form
    initContactForm();

    // 10. Navigation & Mobile Menu
    initNavigation();

    // 11. Footer Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ==================== 1. UPTIME & PING ==================== */
function initUptimeAndPing() {
    const uptimeEl = document.getElementById('system-uptime');
    const pingEl = document.getElementById('ping-val');
    let seconds = 0;

    setInterval(() => {
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        if (uptimeEl) uptimeEl.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);

    // Subtle random ping fluctuation
    setInterval(() => {
        if (pingEl) {
            const ping = Math.floor(Math.random() * 8) + 16;
            pingEl.textContent = `${ping}ms`;
        }
    }, 4500);
}

/* ==================== 2. CUSTOM CYBER CURSOR ==================== */
function initCyberCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Smooth trailing ring loop
    function updateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(updateRing);
    }
    updateRing();

    // Hover state on links & interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .tilt-card, .cmd-pill');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
}

/* ==================== 3. TEXT SCRAMBLE / DECODER ==================== */
class TextScrambler {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="neon-cyan">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

function initTextScrambler() {
    const el = document.getElementById('role-cycler');
    if (!el) return;

    const phrases = JSON.parse(el.getAttribute('data-phrases') || '[]');
    if (!phrases.length) return;

    const scrambler = new TextScrambler(el);
    let counter = 0;

    const next = () => {
        scrambler.setText(phrases[counter]).then(() => {
            setTimeout(next, 3200);
        });
        counter = (counter + 1) % phrases.length;
    };

    next();
}

/* ==================== 4. 3D CARD TILT ==================== */
function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

/* ==================== 5. TELEMETRY STATS COUNTERS ==================== */
function initCounters() {
    const counters = document.querySelectorAll('.telemetry-num');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '0', 10);
                let current = 0;
                const stepTime = Math.max(10, Math.floor(1500 / target));

                const timer = setInterval(() => {
                    current++;
                    el.textContent = current;
                    if (current >= target) {
                        clearInterval(timer);
                    }
                }, stepTime);

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
}

/* ==================== 6. SKILL FILTERS ==================== */
function initSkillFilters() {
    const tabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach((card) => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}

/* ==================== 7. AUDIO TRIGGERS ==================== */
function initAudioTriggers() {
    const sfxBtn = document.getElementById('sfx-toggle');
    const sfxText = sfxBtn ? sfxBtn.querySelector('.sfx-text') : null;
    const sfxIcon = sfxBtn ? sfxBtn.querySelector('.sfx-icon') : null;

    if (sfxBtn && window.cyberAudio) {
        // Set initial label
        updateBtnState();

        sfxBtn.addEventListener('click', () => {
            const enabled = window.cyberAudio.toggle();
            updateBtnState();
        });
    }

    function updateBtnState() {
        if (!sfxBtn || !window.cyberAudio) return;
        const isOn = window.cyberAudio.enabled;
        if (sfxText) sfxText.textContent = isOn ? 'AUDIO: ON' : 'AUDIO: MUTED';
        if (sfxIcon) sfxIcon.textContent = isOn ? '🔊' : '🔇';
        sfxBtn.style.borderColor = isOn ? 'var(--neon-cyan)' : 'var(--text-muted)';
    }

    // Attach hover & click sound listeners
    document.querySelectorAll('[data-sound="hover"]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (window.cyberAudio) window.cyberAudio.playHover();
        });
    });

    document.querySelectorAll('[data-sound="click"]').forEach((el) => {
        el.addEventListener('click', () => {
            if (window.cyberAudio) window.cyberAudio.playClick();
        });
    });
}

/* ==================== 8. PROJECT MODAL ==================== */
const projectData = [
    {
        title: 'Nexus AI Intelligence Hub',
        badge: 'CORE PROJECT #01 // DEPLOYED',
        desc: 'Sistem analitik berbasis neural network yang menampilkan aliran data performa tinggi, visualisasi metrik 3D real-time dengan WebGL, dan integrasi kontrol suara web native.',
        tech: ['JavaScript ES6+', 'WebGL / Three.js', 'WebSockets', 'CSS Grid & Animations', 'Express.js Backend'],
        highlights: [
            'Pemrosesan stream 10,000+ data telemetry per detik tanpa frame drops.',
            'Visualisasi matriks 3D interaktif yang dapat dimanipulasi dengan mouse/touch.',
            'Desain antarmuka Glassmorphism terkalibrasi dengan arsitektur WebGL shader custom.'
        ],
        liveUrl: '#',
        repoUrl: 'https://github.com'
    },
    {
        title: 'Aegis Crypto Telemetry Vault',
        badge: 'CORE PROJECT #02 // ACTIVE',
        desc: 'Dashboard pemantauan portofolio blockchain multichain tingkat lanjut dengan enkripsi zero-knowledge di sisi browser dan detektor anomali transaksi otomatis.',
        tech: ['React.js', 'Chart.js', 'Tailwind CSS', 'Web3 APIs', 'Node.js Security Proxy'],
        highlights: [
            'Audit visual smart contract otomatis dan kalkulasi gas real-time.',
            'Arsitektur keamanan browser-only tanpa penyimpanan secret key di cloud server.',
            'Dukungan ekspor laporan terenkripsi dalam format PDF dan JSON.'
        ],
        liveUrl: '#',
        repoUrl: 'https://github.com'
    },
    {
        title: 'Resonance Web Synthesizer',
        badge: 'CORE PROJECT #03 // EXPERIMENTAL',
        desc: 'Aplikasi synthesizer digital interaktif dibangun murni dengan Web Audio API native, menyediakan osilator analog, visualisator frekuensi Fourier Transform (FFT), dan arpeggiator otomatis.',
        tech: ['Web Audio API', 'Canvas 2D API', 'Vanilla JavaScript', 'SVG Custom Knobs'],
        highlights: [
            'Dukungan multi-voice polyphony dengan kontrol Attack, Decay, Sustain, dan Release (ADSR).',
            'Visualizer gelombang audio real-time dengan rendering 60 FPS pada HTML5 Canvas.',
            'Tanpa library eksternal berukuran besar—seluruh audio diproses langsung oleh DSP browser.'
        ],
        liveUrl: '#',
        repoUrl: 'https://github.com'
    }
];

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    if (!modal || !modalBody) return;

    document.querySelectorAll('.project-modal-trigger').forEach((btn) => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-project') || '0', 10);
            const data = projectData[index];
            if (!data) return;

            modalBody.innerHTML = `
                <div class="modal-detail-head">
                    <span class="chip neon-cyan">${data.badge}</span>
                    <h2 class="neon-cyan" style="font-size: 1.8rem; margin: 0.8rem 0 0.4rem 0;">${data.title}</h2>
                    <p style="color: var(--text-secondary); line-height: 1.6;">${data.desc}</p>
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <h4 class="neon-green" style="font-size: 0.95rem; margin-bottom: 0.5rem; letter-spacing: 1px;">FITUR & INOVASI UTAMA:</h4>
                    <ul style="padding-left: 1.2rem; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.7;">
                        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-bottom: 1.8rem;">
                    <h4 class="neon-purple" style="font-size: 0.95rem; margin-bottom: 0.5rem; letter-spacing: 1px;">STACK TEKNOLOGI:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                        ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="${data.repoUrl}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-primary cyber-btn-sm" data-sound="click">
                        <span>LIHAT REPOSITORY GITHUB »</span>
                    </a>
                    <button class="cyber-btn cyber-btn-ghost cyber-btn-sm" onclick="document.getElementById('modal-close').click()">
                        <span>TUTUP INSPEKTOR</span>
                    </button>
                </div>
            `;

            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            if (window.cyberAudio) window.cyberAudio.playSuccess();
        });
    });

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (window.cyberAudio) window.cyberAudio.playClick();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

/* ==================== 9. CONTACT TRANSMISSION FORM ==================== */
function initContactForm() {
    const form = document.getElementById('cyber-contact-form');
    const feedback = document.getElementById('form-feedback');
    const btnText = document.getElementById('btn-text-content');
    const submitBtn = document.getElementById('submit-btn');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();

        if (!name || !email || !message) {
            feedback.className = 'form-feedback error';
            feedback.innerHTML = '⚠️ KESALAHAN VALIDASI: Harap isi semua field bertanda bintang (*) sebelum transmisi.';
            if (window.cyberAudio) window.cyberAudio.playClick();
            return;
        }

        // Email basic format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            feedback.className = 'form-feedback error';
            feedback.innerHTML = '⚠️ ALAMAT EMAIL TIDAK VALID: Format protokol surel salah.';
            return;
        }

        // Simulating packet encryption & transmission
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'MENGENKRIPSI PAKET...';
        feedback.className = 'form-feedback';
        feedback.innerHTML = '<span class="neon-cyan">Mengamankan paket dengan SHA-256... [35%]</span>';

        setTimeout(() => {
            feedback.innerHTML = '<span class="neon-cyan">Mengirimkan gelombang data ke node pusat... [75%]</span>';
        }, 600);

        setTimeout(() => {
            feedback.className = 'form-feedback success';
            feedback.innerHTML = `✓ TRANSMISI BERHASIL! Terima kasih, <strong>${name}</strong>. Sinyal telah diterima di server Almaira Ayu. Balasan akan dikirim ke <strong>${email}</strong> segera.`;
            if (btnText) btnText.textContent = 'TRANSMISI SELESAI';
            if (window.cyberAudio) window.cyberAudio.playSuccess();
            form.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'TRANSMISIKAN PESAN';
            }, 5000);
        }, 1400);
    });
}

/* ==================== 10. NAVIGATION & MOBILE MENU ==================== */
function initNavigation() {
    const header = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('cyber-nav');
    const navLinks = document.querySelectorAll('.nav-item');

    // Scrolled header glass background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile burger toggle
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            if (window.cyberAudio) window.cyberAudio.playClick();
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    });
}
