/* ─── SPECTRAL SOUND FX & HAPTIC ENGINE (RUINED EDITION) ─── */
const DopamineAudio = (() => {
    let audioCtx = null;
    let sfxEnabled = localStorage.getItem('vibe_sfx') !== 'false';
    let lastHoverTime = 0;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // 1. Spectral Hover (Eerie swoosh)
    function playHover() {
        if (!sfxEnabled) return;
        const now = performance.now();
        if (now - lastHoverTime < 110) return; // Cooldown
        lastHoverTime = now;

        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.15;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, startTime);
            osc.frequency.exponentialRampToValueAtTime(80, startTime + duration);

            gain.gain.setValueAtTime(0.015, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    // 2. Metallic Click (Blade strike)
    function playClick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.1;

            osc.type = 'square';
            osc.frequency.setValueAtTime(800, startTime);
            osc.frequency.exponentialRampToValueAtTime(100, startTime + duration);

            gain.gain.setValueAtTime(0.03, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);

            if (navigator.vibrate) navigator.vibrate(15);
        } catch (e) {}
    }

    // 3. Slider Tick
    function playTick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.02;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, startTime);

            gain.gain.setValueAtTime(0.01, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    function toggleSFX() {
        sfxEnabled = !sfxEnabled;
        localStorage.setItem('vibe_sfx', sfxEnabled);
        if (sfxEnabled) playClick();
        return sfxEnabled;
    }

    function isEnabled() {
        return sfxEnabled;
    }

    function attachGlobalListeners() {
        const unlock = () => {
            getAudioContext();
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('pointerdown', unlock);
        document.addEventListener('keydown', unlock);

        // UPDATED TARGETS: These are the actual classes used in your Ruined King portfolio
        const interactiveSelector = `
            .nav-link, 
            .btn-ruin, 
            .theme-btn, 
            .sfx-btn, 
            .skip-btn, 
            .filter-btn,
            .vibe-controller-toggle,
            .modal-close,
            .stat-card
        `;

        document.querySelectorAll(interactiveSelector).forEach(el => {
            el.addEventListener('mouseenter', () => playHover());
            el.addEventListener('click', () => playClick());
        });

        document.addEventListener('input', (e) => {
            if (e.target.type === 'range') playTick();
        });
    }

    return { playHover, playClick, playTick, toggleSFX, isEnabled, attachGlobalListeners };
})();

document.addEventListener('DOMContentLoaded', () => {
    DopamineAudio.attachGlobalListeners();
});
