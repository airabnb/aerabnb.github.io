/**
 * ALMAIRA AYU // Web Audio API Procedural Sound Synthesizer
 * Generates futuristic UI SFX dynamically without requiring external audio files.
 */

class CyberAudio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initStorage();
    }

    initStorage() {
        const stored = localStorage.getItem('almaira_sfx_enabled') || localStorage.getItem('aira_sfx_enabled');
        if (stored !== null) {
            this.enabled = stored === 'true';
        }
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('almaira_sfx_enabled', this.enabled);
        if (this.enabled) {
            this.ensureContext();
            this.playSuccess();
        }
        return this.enabled;
    }

    /**
     * Subtle futuristic hover chirp
     */
    playHover() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

            gain.gain.setValueAtTime(0.015, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) {
            // Audio policy handling
        }
    }

    /**
     * Futuristic UI click confirmation
     */
    playClick() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            const now = this.ctx.currentTime;
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {
            // Audio policy handling
        }
    }

    /**
     * Keystroke chirp for terminal
     */
    playKey() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const now = this.ctx.currentTime;
            const freq = 600 + Math.random() * 400;
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.015, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.025);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.025);
        } catch (e) {
            // Audio policy handling
        }
    }

    /**
     * Cyber Success Tri-Tone Chime
     */
    playSuccess() {
        if (!this.enabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            const now = this.ctx.currentTime;

            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                const startTime = now + idx * 0.06;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.03, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.2);
            });
        } catch (e) {
            // Audio policy handling
        }
    }
}

// Global instance
window.cyberAudio = new CyberAudio();
