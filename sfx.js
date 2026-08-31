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

    // 1. Spectral Hover (Eerie resonant swoosh)
    function playHover() {
        if (!sfxEnabled) return;
        const now = performance.now();
        if (now - lastHoverTime < 110) return; // Anti-spam cooldown
        lastHoverTime = now;

        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.14;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(160, startTime);
            osc.frequency.exponentialRampToValueAtTime(70, startTime + duration);

            gain.gain.setValueAtTime(0.018, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    // 2. Metallic Click (Blade strike resonance)
    function playClick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.09;

            osc.type = 'square';
            osc.frequency.setValueAtTime(750, startTime);
            osc.frequency.exponentialRampToValueAtTime(120, startTime + duration);

            gain.gain.setValueAtTime(0.035, startTime);
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
            osc.frequency.setValueAtTime(420, startTime);

            gain.gain.setValueAtTime(0.015, startTime);
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

        // Matched interactive selectors across all pages
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
