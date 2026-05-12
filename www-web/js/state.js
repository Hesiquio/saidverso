const State = {
    currentLevelIndex: 0,
    streak: 0,
    coins: 0,
    inventory: { star: 0, ghost: 0, speed: 0, life: 0 },
    isPaused: false,
    isScanning: true,
    activePower: null,

    load() {
        this.currentLevelIndex = parseInt(localStorage.getItem('cq_current_level') || 0);
        this.streak = parseInt(localStorage.getItem('cq_streak') || 0);
        this.coins = parseInt(localStorage.getItem('cq_coins') || 0);
        const inv = localStorage.getItem('cq_inventory');
        if (inv) this.inventory = JSON.parse(inv);
    },

    save() {
        localStorage.setItem('cq_current_level', this.currentLevelIndex);
        localStorage.setItem('cq_streak', this.streak);
        localStorage.setItem('cq_coins', this.coins);
        localStorage.setItem('cq_inventory', JSON.stringify(this.inventory));
    }
};
State.load();
