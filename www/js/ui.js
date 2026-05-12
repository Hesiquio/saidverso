const phrases = [
    "¡Tu mente es tu mejor herramienta!", "¡SaidVerso te espera!", "¡Eres un gran criptógrafo!", "¡No te rindas!", "¡Explora y aprende!"
];

const healthTips = [
    "🔔 REGLA 20-20-20: Cada 20 minutos, mira algo a 6 metros durante 20 segundos.",
    "🔔 ¡PARPADEA!: Al jugar solemos parpadear menos. ¡Hazlo ahora para hidratar tus ojos!",
    "🔔 DISTANCIA: Mantén tu pantalla al menos a 40cm de tu cara.",
    "🔔 BRILLO: Ajusta el brillo para que no te canse la vista en la oscuridad.",
    "🔔 PAUSA ACTIVA: Levántate y estira tus brazos. ¡Tu cuerpo te lo agradecerá!"
];

let isShopInGame = false;

const UI = {
    showDashboard() {
        let name = localStorage.getItem('cq_username');
        if (!name || name === "EXPLORADOR") {
            name = "EXPLORADOR_" + Math.floor(Math.random()*999);
            localStorage.setItem('cq_username', name);
        }
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        document.getElementById('dash-welcome').innerText = `HOLA, ${name}`;
        document.getElementById('dash-level').innerText = `N${State.currentLevelIndex + 1}`;
        document.getElementById('dash-streak').innerText = `🔥 ${State.streak}`;
        document.getElementById('dash-coins').innerText = `🪙 ${State.coins}`;
        document.getElementById('motivational-phrase').innerText = `"${phrases[Math.floor(Math.random()*phrases.length)]}"`;
        
        Database.saveScore(name, State.currentLevelIndex, State.streak, State.coins);
        if (Math.random() > 0.8) this.showHealthTip();
    },

    openShop(inGame = false) {
        isShopInGame = inGame;
        if (inGame) {
            game.scene.scenes[0].physics.pause();
            State.isPaused = true;
            document.getElementById('shop-title').innerText = "MENÚ TÁCTICO";
            document.getElementById('shop-close-btn').innerText = "VOLVER AL NIVEL";
        } else {
            document.getElementById('shop-title').innerText = "TIENDA DE PODERES";
            document.getElementById('shop-close-btn').innerText = "VOLVER AL PANEL";
        }
        document.getElementById('shop-coins-display').innerText = `Créditos: 🪙 ${State.coins}`;
        document.getElementById('shop-modal').style.display = 'flex';
    },

    closeShop() {
        document.getElementById('shop-modal').style.display = 'none';
        if (isShopInGame) {
            State.isPaused = false;
            if (!State.isScanning) game.scene.scenes[0].physics.resume();
        }
    },

    buyItem(item, price) {
        if (State.coins >= price) {
            State.coins -= price;
            State.inventory[item] = (State.inventory[item] || 0) + 1;
            State.save();
            AudioFX.powerup();
            
            if (isShopInGame) {
                checkAndActivatePower(); 
                this.closeShop();
            } else {
                this.openShop(false);
            }
        } else {
            AudioFX.wrong();
            alert("¡Necesitas más créditos!");
        }
    },

    showHealthTip() {
        document.getElementById('health-tip').innerText = healthTips[Math.floor(Math.random()*healthTips.length)];
        document.getElementById('health-modal').style.display = 'flex';
    },

    closeHealthTip() { document.getElementById('health-modal').style.display = 'none'; },

    async openRanking() {
        document.getElementById('ranking-modal').style.display = 'flex';
        const list = document.getElementById('global-rank-list');
        list.innerHTML = "<p style='color:#00ffff;'>Sincronizando satélites...</p>";
        const data = await Database.getRanking();
        list.innerHTML = data.map((r, i) => {
            const level = Math.floor(r.score / 1000) + 1;
            const s = r.score % 1000;
            let medal = (i === 0) ? "🥇 " : (i === 1) ? "🥈 " : (i === 2) ? "🥉 " : (i+1) + ". ";
            return `<div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(0,255,255,0.1); font-size:13px; color:${i<3?'#ffff00':'#00ffff'}">
                <span>${medal}${r.username}</span>
                <span>NIVEL ${level} | 🔥 ${s}</span>
            </div>`;
        }).join('') || "<p>No hay datos.</p>";
    },

    showFarewell() {
        document.getElementById('dashboard-screen').style.display = 'none';
        let i = 0;
        const interval = setInterval(() => {
            if(i < 3) {
                AudioFX.play(300 - i*50, 'sine', 0.1, 0.02);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => { 
                    document.body.style.background = "#000"; 
                    document.body.innerHTML = "";
                    if (window.Capacitor?.Plugins?.App) window.Capacitor.Plugins.App.exitApp();
                }, 1000);
            }
        }, 800);
    }
};
