/**
 * ALMAIRA AYU // Interactive Cyber Hacker Terminal
 * Full CLI interface with commands, command history, matrix rain effect & auto-scroll.
 */

class CyberTerminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.runBtn = document.getElementById('terminal-run-btn');
        this.body = document.getElementById('terminal-body');
        
        this.history = [];
        this.historyIndex = -1;

        this.commands = {
            help: () => this.cmdHelp(),
            about: () => this.cmdAbout(),
            skills: () => this.cmdSkills(),
            projects: () => this.cmdProjects(),
            matrix: () => this.cmdMatrix(),
            contact: () => this.cmdContact(),
            clear: () => this.cmdClear(),
            date: () => this.cmdDate(),
            ping: () => this.cmdPing(),
            whoami: () => this.cmdWhoami(),
            sudo: () => this.cmdSudo()
        };

        this.init();
    }

    init() {
        if (!this.input || !this.output) return;

        // Enter key to run
        this.input.addEventListener('keydown', (e) => {
            if (window.cyberAudio) window.cyberAudio.playKey();

            if (e.key === 'Enter') {
                this.execute(this.input.value);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });

        // Run button
        if (this.runBtn) {
            this.runBtn.addEventListener('click', () => {
                this.execute(this.input.value);
            });
        }

        // Quick shortcut pills
        document.querySelectorAll('.cmd-pill').forEach((pill) => {
            pill.addEventListener('click', () => {
                const cmd = pill.getAttribute('data-cmd');
                this.input.value = cmd;
                this.execute(cmd);
            });
        });
    }

    navigateHistory(direction) {
        if (!this.history.length) return;
        this.historyIndex += direction;

        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.history[this.historyIndex];
    }

    execute(rawCmd) {
        const cmd = rawCmd.trim();
        if (!cmd) return;

        // Push to history
        this.history.push(cmd);
        this.historyIndex = this.history.length;
        this.input.value = '';

        // Print command prompt line
        this.printLine(`<span class="neon-green">almaira@nexus</span>:<span class="neon-cyan">~</span>$ <span class="term-line cmd-echo">${this.escapeHTML(cmd)}</span>`);

        const parts = cmd.toLowerCase().split(' ');
        const mainCmd = parts[0];

        if (window.cyberAudio) window.cyberAudio.playClick();

        if (this.commands[mainCmd]) {
            this.commands[mainCmd](parts.slice(1));
        } else {
            this.printLine(`<span class="term-line error-msg">Perintah tidak dikenal: '${this.escapeHTML(cmd)}'. Ketik <span class="neon-cyan font-bold">help</span> untuk daftar perintah.</span>`);
        }

        this.scrollToBottom();
    }

    printLine(htmlContent) {
        const p = document.createElement('p');
        p.className = 'term-line';
        p.innerHTML = htmlContent;
        this.output.appendChild(p);
    }

    scrollToBottom() {
        if (this.body) {
            this.body.scrollTop = this.body.scrollHeight;
        }
    }

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Command implementations
    cmdHelp() {
        this.printLine(`<span class="neon-cyan font-bold">DAFTAR PERINTAH SISTEM ALMAIRA.OS:</span>`);
        this.printLine(`  <span class="neon-green">about</span>    - Informasi identitas & profil pengembang`);
        this.printLine(`  <span class="neon-green">skills</span>   - Ringkasan keahlian & stack teknologi`);
        this.printLine(`  <span class="neon-green">projects</span> - Daftar misi & proyek yang telah dideploy`);
        this.printLine(`  <span class="neon-green">contact</span>  - Saluran transmisi & kontak resmi`);
        this.printLine(`  <span class="neon-green">matrix</span>   - Simulasi digital matrix data rain`);
        this.printLine(`  <span class="neon-green">ping</span>     - Uji latensi transmisi jaringan`);
        this.printLine(`  <span class="neon-green">date</span>     - Tampilkan waktu & timestamp lokal`);
        this.printLine(`  <span class="neon-green">whoami</span>   - Status pengguna sesi aktif`);
        this.printLine(`  <span class="neon-green">clear</span>    - Bersihkan layar konsol terminal`);
    }

    cmdAbout() {
        this.printLine(`<span class="neon-cyan font-bold">// DOSSIER IDENTITAS ALMAIRA AYU</span>`);
        this.printLine(`Peran: Full-Stack Architect & Creative Technologist`);
        this.printLine(`Status: Siap menerima proyek inovatif & kolaborasi tim`);
        this.printLine(`Misi: Menggabungkan animasi grafis tingkat tinggi dengan kecepatan dan stabilitas arsitektur kode modern.`);
    }

    cmdSkills() {
        this.printLine(`<span class="neon-cyan font-bold">// MATRIX KEAHLIAN INTI</span>`);
        this.printLine(`[====================] 98% HTML5 & Web Semantics`);
        this.printLine(`[=================== ] 95% Modern CSS3 / Glassmorphism`);
        this.printLine(`[=================== ] 94% Vanilla JavaScript & Web APIs`);
        this.printLine(`[==================  ] 90% React.js & Next.js Framework`);
        this.printLine(`[=================   ] 88% Node.js & RESTful APIs`);
        this.printLine(`[=================   ] 86% PostgreSQL / MongoDB`);
        this.printLine(`[==================  ] 92% Git & Automated CI/CD`);
    }

    cmdProjects() {
        this.printLine(`<span class="neon-cyan font-bold">// ARSIP PROYEK UNGGULAN</span>`);
        this.printLine(`1. <span class="neon-cyan">Nexus AI Intelligence Hub</span> - Analytics Dashboard & Real-time WebGL`);
        this.printLine(`2. <span class="neon-green">Aegis Crypto Telemetry</span> - Secure Vault & Market Intelligence`);
        this.printLine(`3. <span class="neon-purple">Resonance Web Synthesizer</span> - In-browser Sound Studio with Web Audio API`);
        this.printLine(`Gunakan UI section MISSIONS untuk inspeksi visual lengkap!`);
    }

    cmdContact() {
        this.printLine(`<span class="neon-cyan font-bold">// SALURAN TRANSMISI RESMI</span>`);
        this.printLine(`Email: <span class="neon-cyan">almaira.ayu@example.com</span>`);
        this.printLine(`GitHub: <span class="neon-cyan">https://github.com/almaira-ayu</span>`);
        this.printLine(`LinkedIn: <span class="neon-cyan">https://linkedin.com/in/almaira-ayu</span>`);
        this.printLine(`Lokasi: Jakarta, Indonesia // Global Remote`);
    }

    cmdMatrix() {
        this.printLine(`<span class="neon-green">Menginisialisasi aliran Matrix Stream...</span>`);
        const chars = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';
        let count = 0;
        const interval = setInterval(() => {
            let row = '';
            for (let i = 0; i < 35; i++) {
                row += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
            }
            this.printLine(`<span style="color: #00ff9d; font-size: 0.75rem;">${row}</span>`);
            this.scrollToBottom();
            count++;
            if (count > 6) {
                clearInterval(interval);
                this.printLine(`<span class="neon-cyan font-bold">Aliran Matrix stabil. Transmisi ditutup.</span>`);
                this.scrollToBottom();
            }
        }, 80);
    }

    cmdPing() {
        this.printLine(`PING nexus-cloud.net (192.168.1.1): 56 data bytes`);
        setTimeout(() => {
            this.printLine(`64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=16.4 ms`);
            this.printLine(`64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=18.1 ms`);
            this.printLine(`<span class="neon-green">2 packets transmitted, 2 received, 0% packet loss. Transmisi Optimal!</span>`);
            this.scrollToBottom();
        }, 200);
    }

    cmdDate() {
        const now = new Date();
        this.printLine(`TIMESTAMP LOKAL: <span class="neon-cyan">${now.toUTCString()}</span>`);
    }

    cmdWhoami() {
        this.printLine(`<span class="neon-green font-bold">almaira</span> (Root Access / Architect of the Nexus)`);
    }

    cmdSudo() {
        this.printLine(`<span class="neon-pink">Akses ditolak: Anda sudah memegang kredensial Superuser Root!</span>`);
    }

    cmdClear() {
        this.output.innerHTML = '';
        this.printLine(`<span class="term-line system-msg">Layar konsol dibersihkan. Ketik 'help' untuk daftar perintah.</span>`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.terminalInstance = new CyberTerminal();
});
