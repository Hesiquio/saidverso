const AudioFX = {
    ctx: new (window.AudioContext || window.webkitAudioContext)(),
    lastErrorTime: 0,
    play(freq, type, duration, vol = 0.03) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + duration);
    },
    collect() { this.play(880, 'sine', 0.1); },
    hit() { this.play(100, 'sine', 0.3, 0.08); },
    win() { this.play(523, 'sine', 0.1); setTimeout(()=>this.play(659,'sine',0.1),100); setTimeout(()=>this.play(783,'sine',0.3),200); },
    correct() { this.play(1000, 'sine', 0.2); },
    wrong() { const now = Date.now(); if(now-this.lastErrorTime > 2000){ this.play(200,'sine',0.1,0.03); this.lastErrorTime=now; } }
};
