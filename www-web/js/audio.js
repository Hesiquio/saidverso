const AudioFX = {
    ctx: null,
    getCtx() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        return this.ctx;
    },
    play(freq, type, duration, vol = 0.03) {
        try {
            const ctx = this.getCtx();
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + duration);
        } catch(e) {}
    },
    collect() { this.play(880, 'sine', 0.1); },
    coin()    { this.play(1320, 'sine', 0.1, 0.02); },
    powerup() { this.play(440, 'sawtooth', 0.2, 0.02); setTimeout(()=>this.play(880,'sawtooth',0.4,0.02),100); },
    hit()     { this.play(100, 'sine', 0.3, 0.08); },
    win()     { this.play(523,'sine',0.1); setTimeout(()=>this.play(659,'sine',0.1),100); setTimeout(()=>this.play(783,'sine',0.3),200); },
    correct() { this.play(1000, 'sine', 0.2); },
    wrong()   { this.play(200, 'sine', 0.1, 0.03); }
};
