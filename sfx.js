/* ─── DOPAMINE PROCEDURAL SOUND FX & HAPTIC ENGINE ─── */
const DopamineAudio = (() => {
    let audioCtx = null;
    let sfxEnabled = localStorage.getItem('vibe_sfx') !== 'false'; // Default ON

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

    // 1. Playful Bubbly Hover Sound (Subtle High-Pitch Sine Blip)
    function playHover() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const startTime = ctx.currentTime;
            const duration = 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(480, startTime);
            osc.frequency.exponentialRampToValueAtTime(780, startTime + duration);

            gain.gain.setValueAtTime(0.04, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    // 2. Snappy Arcade Click Sound (Multi-Tone Dopamine Pop)
    function playClick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const startTime = ctx.currentTime;
            const duration = 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, startTime);
            osc.frequency.exponentialRampToValueAtTime(1400, startTime + 0.03);
            osc.frequency.exponentialRampToValueAtTime(300, startTime + duration);

            gain.gain.setValueAtTime(0.08, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);

            // Optional Native Mobile Haptic Feedback
            if (navigator.vibrate) {
                navigator.vibrate(12);
            }
        } catch (e) {}
    }

    // 3. Slider Step Tick Sound
    function playTick() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const startTime = ctx.currentTime;
            const duration = 0.03;

            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, startTime);

            gain.gain.setValueAtTime(0.02, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        } catch (e) {}
    }

    // 4. Modal Open / Action Swoosh
    function playSwoosh() {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const startTime = ctx.currentTime;
            const duration = 0.15;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(250, startTime);
            osc.frequency.exponentialRampToValueAtTime(950, startTime + duration);

            gain.gain.setValueAtTime(0.07, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

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

    // Auto-attach listeners to interactive elements
    function attachGlobalListeners() {
        // Unlock Web Audio on first gesture anywhere
        const unlock = () => {
            getAudioContext();
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('pointerdown', unlock);
        document.addEventListener('keydown', unlock);

        // Hover & Click sounds on buttons, links, cards, tabs
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
            .modal-close,
            .media-container,
            .game-showcase,
            .system-showcase
        `;

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target && !target.dataset.sfxHoverBound) {
                target.dataset.sfxHoverBound = "true";
                playHover();
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                delete target.dataset.sfxHoverBound;
            }
        });

        document.addEventListener('click', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                playClick();
            }
        });

        // Sliders input tick
        document.addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                playTick();
            }
        });
    }

    return {
        playHover,
        playClick,
        playTick,
        playSwoosh,
        toggleSFX,
        isEnabled,
        attachGlobalListeners
    };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    DopamineAudio.attachGlobalListeners();
});
