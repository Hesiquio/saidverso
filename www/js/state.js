// Almacén central de variables compartidas
const State = {
    currentLevelIndex: 0,
    streak: 0,
    coins: 0,
    inventory: {},
    
    load() {
        this.currentLevelIndex = parseInt(localStorage.getItem('cq_current_level') || 0);
        this.streak = parseInt(localStorage.getItem('cq_streak') || 0);
        this.coins = parseInt(localStorage.getItem('cq_coins') || 0);
        this.inventory = JSON.parse(localStorage.getItem('cq_inventory') || "{}");
    },
    
    save() {
        localStorage.setItem('cq_current_level', this.currentLevelIndex);
        localStorage.setItem('cq_streak', this.streak);
        localStorage.setItem('cq_coins', this.coins);
        localStorage.setItem('cq_inventory', JSON.stringify(this.inventory));
    }
};

// Cargar estado inicial
State.load();
