const phrases = [
    "¡Tu mente es tu mejor herramienta!", "¡SaidVerso te espera!", "¡Eres un gran criptógrafo!", "¡No te rindas!", "¡Explora y aprende!"
];

const farewellPhrases = [
    "¡Buen trabajo hoy!", "¡Sesión guardada!", "¡Vuelve pronto!", "¡Sistemas apagados!", "¡Adiós, Said!"
];

const UI = {
    showDashboard(level, streak) {
        const name = localStorage.getItem('cq_username') || "EXPLORADOR";
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        document.getElementById('dash-welcome').innerText = `HOLA, ${name}`;
        document.getElementById('dash-level').innerText = `N${level + 1}`;
        document.getElementById('dash-streak').innerText = `🔥 ${streak}`;
        document.getElementById('motivational-phrase').innerText = `"${phrases[Math.floor(Math.random()*phrases.length)]}"`;
        
        const badges = document.getElementById('dash-badges');
        badges.innerHTML = "";
        if (level >= 0) badges.innerHTML += '<span class="badge">🎖️ NOVATO</span>';
        if (level >= 10) badges.innerHTML += '<span class="badge">🚀 EXPERTO</span>';
        if (level >= 50) badges.innerHTML += '<span class="badge">🔮 MAESTRO</span>';
    },

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
        document.getElementById('farewell-text').innerText = farewellPhrases[Math.floor(Math.random()*farewellPhrases.length)];
        let logs = ["> GUARDANDO NIVEL...", "> CERRANDO CONEXIÓN...", "> ADIÓS, " + name];
        let i = 0;
        const interval = setInterval(() => {
            if(i < logs.length) {
                document.getElementById('shutdown-log').innerText = logs[i];
                AudioFX.play(300 - i*50, 'sine', 0.1, 0.02);
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => { 
                    document.body.style.background = "#000"; 
                    document.body.innerHTML = "<h1 style='color:white; font-family:sans-serif; text-align:center; margin-top:50%;'>SISTEMA APAGADO</h1>";
                    if (window.Capacitor?.Plugins?.App) window.Capacitor.Plugins.App.exitApp();
                }, 1000);
            }
        }, 800);
    }
};
