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

const UI = {
    showDashboard(level, streak) {
        const name = localStorage.getItem('cq_username') || "EXPLORADOR";
        const coins = parseInt(localStorage.getItem('cq_coins') || 0);
        
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        document.getElementById('dash-welcome').innerText = `HOLA, ${name}`;
        document.getElementById('dash-level').innerText = `N${level + 1}`;
        document.getElementById('dash-streak').innerText = `🔥 ${streak}`;
        document.getElementById('dash-coins').innerText = `🪙 ${coins}`;
        document.getElementById('motivational-phrase').innerText = `"${phrases[Math.floor(Math.random()*phrases.length)]}"`;
        
        const badges = document.getElementById('dash-badges');
        badges.innerHTML = "";
        if (level >= 0) badges.innerHTML += '<span class="badge">🎖️ NOVATO</span>';
        if (level >= 10) badges.innerHTML += '<span class="badge">🚀 EXPERTO</span>';
        if (level >= 50) badges.innerHTML += '<span class="badge">🔮 MAESTRO</span>';

        // Probabilidad de mostrar consejo de salud al entrar
        if (Math.random() > 0.7) this.showHealthTip();
    },

    openShop() {
        const coins = localStorage.getItem('cq_coins') || 0;
        document.getElementById('shop-coins-display').innerText = `Tus créditos: 🪙 ${coins}`;
        document.getElementById('shop-modal').style.display = 'flex';
    },

    closeShop() { document.getElementById('shop-modal').style.display = 'none'; },

    buyItem(item, price) {
        let coins = parseInt(localStorage.getItem('cq_coins') || 0);
        if (coins >= price) {
            coins -= price;
            localStorage.setItem('cq_coins', coins);
            let inventory = JSON.parse(localStorage.getItem('cq_inventory') || "{}");
            inventory[item] = (inventory[item] || 0) + 1;
            localStorage.setItem('cq_inventory', JSON.stringify(inventory));
            AudioFX.powerup();
            this.openShop();
            alert("¡Poder adquirido! Se activará en tu próxima misión.");
        } else {
            AudioFX.wrong();
            alert("¡Necesitas más créditos! Explora más niveles.");
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
        const name = localStorage.getItem('cq_username') || "EXPLORADOR";
        document.getElementById('dashboard-screen').style.display = 'none';
        document.getElementById('farewell-screen').style.display = 'flex';
        document.getElementById('farewell-text').innerText = "¡Sistemas apagados! Descansa tus ojos, Said.";
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
