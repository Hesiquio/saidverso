const phrases = [
    "¡Tu mente es tu mejor herramienta!",
    "¡Eres un gran criptógrafo!",
    "¡No te rindas, explorador!",
    "¡Explora y aprende!"
];

const healthTips = [
    "🔔 REGLA 20-20-20: Cada 20 minutos, mira algo a 6 metros durante 20 segundos.",
    "🔔 ¡PARPADEA! Al jugar solemos parpadear menos. ¡Hazlo ahora!",
    "🔔 DISTANCIA: Mantén tu pantalla al menos a 40cm de tu cara.",
    "🔔 PAUSA ACTIVA: Levántate y estira los brazos. ¡Tu cuerpo te lo agradecerá!"
];

let isShopInGame = false;
let isInitialSync = true; // Para cargar desde Supabase solo la primera vez

const UI = {
    async showDashboard() {
        let name = localStorage.getItem('cq_username');
        if (!name) {
            document.getElementById('dashboard-screen').style.display = 'none';
            document.getElementById('login-screen').style.display = 'flex';
            return;
        }

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        document.getElementById('motivational-phrase').innerText = `"${phrases[Math.floor(Math.random()*phrases.length)]}"`;

        if (isInitialSync) {
            isInitialSync = false;
            document.getElementById('dash-welcome').innerText = `SINCRONIZANDO...`;
            const remoteProfile = await Database.loadProfile(name);
            if (remoteProfile) {
                // Restauramos el estado desde Supabase
                State.currentLevelIndex = remoteProfile.level || 0;
                State.streak = remoteProfile.streak || 0;
                State.coins = remoteProfile.coins || 0;
                if (remoteProfile.inventory) State.inventory = remoteProfile.inventory;
                State.save(); // Actualizamos el caché local
            }
        }

        document.getElementById('dash-welcome').innerText = `HOLA, ${name}`;
        document.getElementById('dash-level').innerText  = `N${State.currentLevelIndex + 1}`;
        document.getElementById('dash-streak').innerText = `🔥 ${State.streak}`;
        document.getElementById('dash-coins').innerText  = `🪙 ${State.coins}`;
        
        const inv = State.inventory || { star: 0, ghost: 0, speed: 0, life: 0, key: 0, invisible: 0 };
        const elStar = document.getElementById('dash-inv-star');
        if (elStar) {
            elStar.innerText = inv.star || 0;
            document.getElementById('dash-inv-ghost').innerText = inv.ghost || 0;
            document.getElementById('dash-inv-speed').innerText = inv.speed || 0;
            document.getElementById('dash-inv-life').innerText  = inv.life || 0;
            const elKey = document.getElementById('dash-inv-key');
            if (elKey) elKey.innerText = inv.key || 0;
            const elInv = document.getElementById('dash-inv-invisible');
            if (elInv) elInv.innerText = inv.invisible || 0;
        }
        
        // Guardar progreso actual a Supabase siempre que pasamos por el dashboard
        Database.saveProfile(name, State);
        
        if (Math.random() > 0.75) this.showHealthTip();
    },

    openShop(inGame = false) {
        isShopInGame = inGame;
        if (inGame) {
            game.scene.scenes[0].physics.pause();
            State.isPaused = true;
            document.getElementById('shop-title').innerText = "MENÚ TÁCTICO ⚡";
            document.getElementById('shop-close-btn').innerText = "VOLVER AL NIVEL";
        } else {
            document.getElementById('shop-title').innerText = "TIENDA DE PODERES";
            document.getElementById('shop-close-btn').innerText = "VOLVER";
        }
        document.getElementById('shop-coins-display').innerText = `Tus créditos: 🪙 ${State.coins}`;
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
        if (State.coins < price) { AudioFX.wrong(); alert("¡Necesitas más créditos!"); return; }
        State.coins -= price;
        State.inventory[item] = (State.inventory[item] || 0) + 1;
        State.save();
        
        // Sincronizar compra con Supabase
        const name = localStorage.getItem('cq_username');
        if (name) Database.saveProfile(name, State);

        AudioFX.powerup();
        if (isShopInGame) { window.tryActivatePower(item); this.closeShop(); }
        else { document.getElementById('shop-coins-display').innerText = `Tus créditos: 🪙 ${State.coins}`; }
    },

    showHealthTip() {
        document.getElementById('health-tip').innerText = healthTips[Math.floor(Math.random()*healthTips.length)];
        document.getElementById('health-modal').style.display = 'flex';
    },
    closeHealthTip() { document.getElementById('health-modal').style.display = 'none'; },

    async openRanking() {
        document.getElementById('ranking-modal').style.display = 'flex';
        const list = document.getElementById('global-rank-list');
        list.innerHTML = "<p style='color:#00ffff;'>Cargando...</p>";
        const data = await Database.getRanking();
        if (!data.length) { list.innerHTML = "<p>Sin datos aún. ¡Sé el primero!</p>"; return; }
        const currentUser = localStorage.getItem('cq_username');
        const userIndex = data.findIndex(r => r.username === currentUser);
        
        const top5 = data.slice(0, 5);
        let html = top5.map((r, i) => {
            const level = (r.level || 0) + 1;
            const streak = r.streak || 0;
            const medal = ['🥇','🥈','🥉'][i] || `${i+1}.`;
            return `<div style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid rgba(0,255,255,0.1);color:${i<3?'#ffff00':'#00ffff'}">
                <span>${medal} ${r.username}</span><span>N${level} | 🔥 ${streak}</span>
            </div>`;
        }).join('');

        if (userIndex >= 5) {
            const r = data[userIndex];
            const level = (r.level || 0) + 1;
            const streak = r.streak || 0;
            html += `<div style="text-align:center; color:#00ffff; font-weight:bold; margin: 4px 0;">...</div>`;
            html += `<div style="display:flex;justify-content:space-between;padding:12px;background:rgba(255,255,0,0.1);border:1px solid #ffff00;color:#ffff00;border-radius:8px;">
                <span>${userIndex + 1}. ${r.username} (Tú)</span><span>N${level} | 🔥 ${streak}</span>
            </div>`;
        }
        
        list.innerHTML = html;
    }
};
