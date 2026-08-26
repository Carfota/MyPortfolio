/* ─── DOPAMINE PROCEDURAL SOUND FX & HAPTIC ENGINE (FIXED & DEBOUNCED) ─── */
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

    // 1. Playful Bubbly Hover Sound (Anti-Spam Debounced)
    function playHover() {
        if (!sfxEnabled) return;
        const now = performance.now();
        if (now - lastHoverTime < 110) return; // Strict cooldown to kill looping/repeating
        lastHoverTime = now;

        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.04;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, startTime);
            osc.frequency.exponentialRampToValueAtTime(800, startTime + duration);

            gain.gain.setValueAtTime(0.025, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    // 2. Snappy Click Sound
    function playClick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = ctx.currentTime;
            const duration = 0.07;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(850, startTime);
            osc.frequency.exponentialRampToValueAtTime(1400, startTime + 0.025);
            osc.frequency.exponentialRampToValueAtTime(280, startTime + duration);

            gain.gain.setValueAtTime(0.06, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);

            if (navigator.vibrate) navigator.vibrate(10);
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

            osc.type = 'square';
            osc.frequency.setValueAtTime(1100, startTime);

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

        // Targeted buttons & links only (no big wrapper cards)
        const interactiveSelector = `
            .nav-link, 
            .btn-action, 
            .btn-dopamine, 
            .btn-order, 
            .filter-btn, 
            .preset-btn, 
            .inline-pill-link, 
            .skill-pill, 
            .vibe-controller-toggle,
            .modal-close
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
