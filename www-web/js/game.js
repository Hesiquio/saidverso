// ============================================================
// SAIDVERSO - Motor de Juego (Versión WEB)
// Diferencias vs móvil: sin D-Pad visual, controles por teclado
// ============================================================

let player, enemy, letters, mazeWalls, countdownText, coinsGroup, chestGroup;
let currentLevel = null;
let collectedWord = "";
let lives = 3;
let uiTextWord, uiTextHint;

// Niveles de emergencia (se reemplazan con datos de Supabase)
let allLevels = [{
    word: "SAID",
    hint: "REGLA: +1",
    shift: 1,
    maze: [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
    ],
    learning: {
        text: "¡Bienvenido! En este juego descifrarás palabras usando criptografía.",
        question: "Si la regla es +1, ¿qué letra es 'B' descifrada?",
        options: ["A", "C", "D"],
        correct: 0
    }
}];

class SaidVersoScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    preload() {
        // Las texturas se generan en create() para evitar errores de contexto
    }

    create() {
        // Generar texturas simples con Graphics
        const g = this.make.graphics({ add: false });

        g.fillStyle(0x00ffff); g.fillRect(0, 0, 24, 24);
        g.generateTexture('robot', 24, 24); g.clear();

        g.fillStyle(0xff3333); g.fillCircle(12, 12, 11);
        g.generateTexture('enemy', 24, 24); g.clear();

        g.fillStyle(0x0d1b4b); g.fillRect(0, 0, 40, 40);
        g.lineStyle(1, 0x00ffff, 0.4); g.strokeRect(1, 1, 38, 38);
        g.generateTexture('wall', 40, 40); g.clear();

        g.fillStyle(0x8B4513); g.fillRect(8, 12, 24, 16);
        g.fillStyle(0xFFD700); g.fillRect(18, 18, 4, 4);
        g.generateTexture('chest', 40, 40); g.clear();

        g.destroy();

        // Teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd    = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        this.powerKeys = this.input.keyboard.addKeys({
            star: Phaser.Input.Keyboard.KeyCodes.ONE,
            ghost: Phaser.Input.Keyboard.KeyCodes.TWO,
            speed: Phaser.Input.Keyboard.KeyCodes.THREE,
            life: Phaser.Input.Keyboard.KeyCodes.FOUR
        });

        // Construir nivel
        loadLevel(this);
        this.physics.pause();

        // Intro y sincronización de niveles en paralelo
        runIntro(this);
        this.syncLevels();
    }

    async syncLevels() {
        const data = await Database.fetchLevels();
        if (data && data.length > 0) {
            allLevels = data;
            console.log(`✅ ${allLevels.length} niveles sincronizados`);
        }
    }

    update() {
        if (!player || !player.active || State.isPaused || State.isScanning) return;

        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.star)) tryActivatePower('star');
        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.ghost)) tryActivatePower('ghost');
        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.speed)) tryActivatePower('speed');
        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.life)) tryActivatePower('life');

        player.setVelocity(0);
        const speed = State.activePower === 'speed' ? 300 : 180;
        const { cursors, wasd } = this;

        if (cursors.left.isDown  || wasd.left.isDown)  player.setVelocityX(-speed);
        else if (cursors.right.isDown || wasd.right.isDown) player.setVelocityX(speed);
        if (cursors.up.isDown    || wasd.up.isDown)    player.setVelocityY(-speed);
        else if (cursors.down.isDown  || wasd.down.isDown)  player.setVelocityY(speed);

        if (enemy.active) {
            if (State.activePower === 'star') enemy.setVelocity(0);
            else this.physics.moveToObject(enemy, player, 80);
        }
    }
}

// ---- Carga de nivel ----
function loadLevel(scene) {
    currentLevel = allLevels[State.currentLevelIndex] || allLevels[0];
    collectedWord = "";
    lives = 3;
    updateLivesUI();
    updateCoinsUI();
    updateInventoryUI();

    // Crear o reutilizar grupos (CRÍTICO para que los colliders no se pierdan)
    if (!mazeWalls) mazeWalls = scene.physics.add.staticGroup();
    else mazeWalls.clear(true, true);

    if (!letters) letters = scene.physics.add.group();
    else letters.clear(true, true);

    if (!coinsGroup) coinsGroup = scene.physics.add.group();
    else coinsGroup.clear(true, true);

    if (!chestGroup) chestGroup = scene.physics.add.group();
    else chestGroup.clear(true, true);

    const mazeWidth = currentLevel.maze[0].length * 40;
    const mazeHeight = currentLevel.maze.length * 40;
    const offsetX = (800 - mazeWidth) / 2;
    const offsetY = (600 - mazeHeight) / 2 + 20;

    const freeSpaces = [];
    currentLevel.maze.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            const x = cIdx * 40 + 20 + offsetX;
            const y = rIdx * 40 + 20 + offsetY;
            if (cell === 1) mazeWalls.create(x, y, 'wall').setDepth(1);
            else freeSpaces.push({ x, y });
        });
    });

    if (freeSpaces.length > 0) {
        window.playerStartPos = { x: freeSpaces[0].x, y: freeSpaces[0].y };
    }

    // Monedas y Cofre
    for (let i = 0; i < 5; i++) {
        const p = Phaser.Utils.Array.RemoveRandomElement(freeSpaces);
        if (!p) break;
        const c = scene.add.text(p.x, p.y, '🪙', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        scene.physics.add.existing(c);
        coinsGroup.add(c);
    }

    const cp = Phaser.Utils.Array.RemoveRandomElement(freeSpaces);
    if (cp) {
        const chest = scene.physics.add.sprite(cp.x, cp.y, 'chest').setDepth(4);
        chestGroup.add(chest);
    }

    // Letras cifradas
    setupLetters(scene, freeSpaces);

    // Personajes y Reglas Físicas (Solo se declaran una vez)
    if (!player) {
        player = scene.physics.add.sprite(freeSpaces[0].x, freeSpaces[0].y, 'robot').setDepth(5);
        enemy  = scene.physics.add.sprite(freeSpaces[freeSpaces.length-1].x, freeSpaces[freeSpaces.length-1].y, 'enemy').setDepth(5);
        player.setCollideWorldBounds(true);
        enemy.setCollideWorldBounds(true);
        player.setBodySize(18, 18);
        
        // Colliders
        scene.physics.add.collider(player, mazeWalls, null, () => State.activePower !== 'ghost');
        scene.physics.add.collider(enemy,  mazeWalls);
        
        // Overlaps
        scene.physics.add.overlap(player, enemy, handleEnemyCollision, null, scene);
        scene.physics.add.overlap(player, coinsGroup, collectCoin, null, scene);
        scene.physics.add.overlap(player, chestGroup, collectChest, null, scene);
        scene.physics.add.overlap(player, letters, collectLetter, null, scene);
    } else {
        player.setPosition(freeSpaces[0].x, freeSpaces[0].y);
        enemy.setPosition(freeSpaces[freeSpaces.length-1].x, freeSpaces[freeSpaces.length-1].y);
        enemy.setActive(true).setVisible(true);
        player.setAlpha(1); player.clearTint();
        State.activePower = null;
    }

    // HUD en canvas
    if (!uiTextWord) {
        uiTextWord = scene.add.text(400, 25, '', { 
            fontSize: '32px', color: '#00ffff', fontStyle: 'bold', padding: { bottom: 10 } 
        }).setOrigin(0.5).setDepth(10);
        
        uiTextHint = scene.add.text(400, 65, '', { 
            fontSize: '16px', color: '#ff00ff', fontStyle: 'bold', backgroundColor: '#00000088', padding: { x: 10, y: 5 } 
        }).setOrigin(0.5).setDepth(10);
        
        countdownText = scene.add.text(400, 300, '', {
            fontSize: '36px', color: '#ffff00', fontStyle: 'bold', backgroundColor: '#000000bb', padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setDepth(500).setVisible(false);
    }
    updateWordDisplay();
}

// ---- Poderes ----
let powerTimerEvent = null;

window.tryActivatePower = function(type) {
    if (!player || State.activePower === type) return;
    
    if (State.inventory[type] > 0) {
        State.inventory[type]--;
        State.save();
        const username = localStorage.getItem('cq_username');
        if (username) Database.saveProfile(username, State);

        if (type === 'life') {
            if (lives >= 100) {
                AudioFX.wrong();
                State.inventory[type]++; // Devolver el poder, no se puede usar
                return;
            }
            lives++;
            updateLivesUI();
            AudioFX.powerup();
        } else {
            State.activePower = type;
            player.setAlpha(1); player.clearTint();
            if (type === 'star') player.setTint(0xffff00);
            if (type === 'ghost') player.setAlpha(0.4);
            if (type === 'speed') player.setTint(0x00ff99);
            AudioFX.powerup();
            
            if (powerTimerEvent) powerTimerEvent.remove(false);
            
            powerTimerEvent = game.scene.scenes[0].time.delayedCall(10000, () => {
                if (State.activePower === type) {
                    State.activePower = null;
                    player.setAlpha(1);
                    player.clearTint();
                }
            });
        }
    } else {
        AudioFX.wrong();
        const el = document.getElementById('shop-coins-display');
        if (el) { el.innerText = "¡NO TIENES ESE PODER!"; setTimeout(()=> el.innerText = `Tus créditos: 🪙 ${State.coins}`, 2000); }
    }
}

// ---- Colisiones ----
function handleEnemyCollision() {
    if (State.activePower === 'star') { AudioFX.win(); enemy.setActive(false).setVisible(false); return; }
    AudioFX.hit(); lives--; State.streak = 0; State.save();
    updateLivesUI();
    const el = document.getElementById('ui-streak');
    if (el) el.innerText = '🔥 0';
    game.scene.scenes[0].cameras.main.shake(300, 0.02);
    
    // Regresar al inicio del laberinto, no a una posición fija
    if (window.playerStartPos) {
        player.setPosition(window.playerStartPos.x, window.playerStartPos.y);
    } else {
        player.setPosition(400, 300);
    }
    
    if (lives <= 0) { alert('¡Misión Fallida!'); window.location.reload(); }
}

function collectCoin(p, c) {
    AudioFX.coin(); c.destroy();
    State.coins += 10; updateCoinsUI();
}

// ---- Letras ----
function setupLetters(scene, freeSpaces) {
    const { word, shift } = currentLevel;
    word.split('').forEach(char => {
        const code    = char.charCodeAt(0) - 65;
        const shifted = ((code + shift) % 26) + 65;
        const ciphered = String.fromCharCode(shifted);
        const pos = Phaser.Utils.Array.RemoveRandomElement(freeSpaces) || { x: 225, y: 300 };
        const l = scene.add.text(pos.x, pos.y, ciphered, { fontSize: '22px', color: '#ffff00', fontStyle: 'bold' })
            .setOrigin(0.5).setDepth(3);
        scene.physics.add.existing(l);
        l.setData('val', char);
        letters.add(l);
    });
}

function collectLetter(p, l) {
    const val = l.getData('val');
    if (val !== currentLevel.word[collectedWord.length]) {
        AudioFX.wrong(); game.scene.scenes[0].cameras.main.shake(80, 0.004); return;
    }
    AudioFX.collect();
    collectedWord += val; l.destroy(); updateWordDisplay();
    if (collectedWord === currentLevel.word) {
        AudioFX.win();
        if (lives === 3) { 
            State.coins += 20; updateCoinsUI(); 
            window.startRoulette("¡BONO DE NIVEL PERFECTO!", showLearningPhase);
        } else {
            showLearningPhase();
        }
    }
}

// ---- Cofres y Ruleta ----
function collectChest(p, chest) {
    AudioFX.powerup(); chest.destroy();
    window.startRoulette("¡COFRE ENCONTRADO!");
}

window.startRoulette = function(title, callback = null) {
    game.scene.scenes[0].physics.pause();
    State.isPaused = true;
    window.rouletteCallback = callback;
    window.lastRolledPower = null;
    
    document.getElementById('roulette-title').innerText = title;
    document.getElementById('roulette-modal').style.display = 'flex';
    document.getElementById('roulette-actions').style.display = 'none';
    const box = document.getElementById('roulette-box');
    const desc = document.getElementById('roulette-desc');
    desc.innerText = "Girando...";
    
    const powers = [
        { id: 'star', icon: '⭐', text: 'ESTRELLA: Neutraliza al centinela.' },
        { id: 'ghost', icon: '👻', text: 'FANTASMA: Atraviesa paredes.' },
        { id: 'speed', icon: '⚡', text: 'VELOCIDAD: Corre más rápido.' },
        { id: 'life', icon: '❤️', text: 'VIDA EXTRA: Suma un corazón.' }
    ];
    
    let spins = 0;
    AudioFX.play(600, 'square', 0.1, 0.5);
    
    const interval = setInterval(() => {
        box.innerText = powers[spins % powers.length].icon;
        AudioFX.play(800 + (spins * 20), 'sine', 0.02, 0.05);
        spins++;
        if (spins > 20) {
            clearInterval(interval);
            const finalPower = powers[Math.floor(Math.random() * powers.length)];
            box.innerText = finalPower.icon;
            desc.innerText = `¡Obtuviste ${finalPower.icon}!\n${finalPower.text}`;
            window.lastRolledPower = finalPower.id;
            
            const actionsDiv = document.getElementById('roulette-actions');
            actionsDiv.style.display = 'flex';
            if (callback) {
                // Es un bono post-nivel, no se puede usar ahora
                actionsDiv.innerHTML = `<button onclick="closeRoulette(false)" style="width:80%;">CONTINUAR</button>`;
            } else {
                // Cofre en medio del nivel
                actionsDiv.innerHTML = `
                    <button onclick="closeRoulette(false)" style="width:80%;">GUARDAR EN INVENTARIO</button>
                    <button class="btn-secondary" onclick="closeRoulette(true)" style="width:80%;">USAR AHORA</button>
                `;
            }
            
            AudioFX.powerup();
            State.inventory[finalPower.id]++;
            State.save();
            const username = localStorage.getItem('cq_username');
            if (username) Database.saveProfile(username, State);
            updateInventoryUI();
        }
    }, 100);
}

// ---- Fase de aprendizaje ----
function showLearningPhase() {
    game.scene.scenes[0].physics.pause();
    State.streak++; State.save();

    document.getElementById('streak-msg').innerText  = `🔥 ¡RACHA DE ${State.streak}!`;
    document.getElementById('learn-text').innerText  = currentLevel.learning.text;
    document.getElementById('quiz-question').innerText = currentLevel.learning.question;

    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';
    currentLevel.learning.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option'; btn.innerText = opt;
        btn.onclick = () => checkQuiz(idx, currentLevel.learning.correct);
        opts.appendChild(btn);
    });

    document.getElementById('learning-modal').style.display = 'flex';
}

function checkQuiz(selected, correct) {
    if (selected !== correct) { AudioFX.wrong(); alert('¡Piénsalo de nuevo!'); return; }
    AudioFX.correct();
    document.getElementById('learning-modal').style.display = 'none';
    State.currentLevelIndex++; State.save();
    
    const username = localStorage.getItem('cq_username');
    if (username) Database.saveProfile(username, State);

    if (State.currentLevelIndex < allLevels.length) UI.showDashboard();
    else { alert('¡Felicidades, completaste todos los niveles!'); window.location.reload(); }
}

// ---- Modo Escaneo (cuenta regresiva) ----
function startScanMode() {
    State.isScanning = true;
    const scene = game.scene.scenes[0];
    scene.physics.pause();
    let count = 3;
    countdownText.setText(`ESCANEANDO... ${count}`).setColor('#ffff00').setVisible(true);
    scene.time.addEvent({
        delay: 1000, repeat: 3,
        callback: () => {
            count--;
            if (count > 0) { countdownText.setText(`ESCANEANDO... ${count}`); }
            else if (count === 0) { countdownText.setText('¡EXPLORA!').setColor('#00ff99'); }
            else {
                countdownText.setVisible(false);
                State.isScanning = false;
                if (!State.isPaused) scene.physics.resume();
            }
        }
    });
}

// ---- Intro ----
function runIntro(scene) {
    const log = document.getElementById('boot-log');
    const lines = ['> INICIANDO SAIDVERSO...', '> CARGANDO MUNDOS...', '> SISTEMA LISTO.'];
    let i = 0;
    const iv = setInterval(() => {
        if (i < lines.length) {
            const div = document.createElement('div');
            div.className = 'boot-line'; div.innerText = lines[i];
            if (log) log.appendChild(div);
            AudioFX.play(400 + i * 100, 'sine', 0.05, 0.02);
            i++;
        } else {
            clearInterval(iv);
            document.getElementById('intro-logo').style.opacity = 1;
            document.getElementById('intro-sub').style.opacity  = 1;
            setTimeout(() => {
                document.getElementById('intro-screen').style.opacity = 0;
                setTimeout(() => {
                    document.getElementById('intro-screen').style.display = 'none';
                    UI.showDashboard();
                }, 900);
            }, 1400);
        }
    }, 400);
}

// ---- UI Helpers ----
function updateLivesUI() {
    const el = document.getElementById('ui-lives');
    if (el) {
        if (lives <= 3) el.innerText = '❤️'.repeat(lives);
        else el.innerText = `❤️ x${lives}`;
    }
}
function updateCoinsUI()  { const el = document.getElementById('ui-coins-game'); if (el) el.innerText = `🪙 ${State.coins}`; }
function updateInventoryUI() {
    const el = document.getElementById('ui-inventory');
    if (el) {
        const i = State.inventory || { star:0, ghost:0, speed:0, life:0 };
        el.innerText = `⭐${i.star}  👻${i.ghost}  ⚡${i.speed}  ❤️${i.life}`;
    }
}
function updateWordDisplay() {
    const shown = collectedWord.split('').join(' ');
    // Se usan espacios adicionales para hacer el guión mucho más ancho y visible
    const blanks = ' _ '.repeat(currentLevel.word.length - collectedWord.length).trim();
    uiTextWord.setText(`${shown} ${blanks}`.trim());
    
    let helpMsg = currentLevel.hint;
    if (collectedWord.length < currentLevel.word.length) {
        const nextChar = currentLevel.word[collectedWord.length];
        const code = nextChar.charCodeAt(0) - 65;
        const shifted = ((code + currentLevel.shift) % 26) + 65;
        const nextCiphered = String.fromCharCode(shifted);
        helpMsg += `   👉 Busca la [ ${nextCiphered} ]`;
    }
    
    uiTextHint.setText(helpMsg);
}

// ---- Punto de entrada ----
window.startGame = function () {
    if (!game || !game.scene.scenes[0]) { setTimeout(window.startGame, 100); return; }
    document.getElementById('dashboard-screen').style.display = 'none';
    document.querySelector('.ui-overlay').style.display = 'flex';
    document.getElementById('pause-btn').style.display  = 'flex';
    document.getElementById('power-btn').style.display  = 'flex';
    updateInventoryUI();
    // Recargar nivel con datos frescos de Supabase (ya sincronizados en background)
    loadLevel(game.scene.scenes[0]);
    startScanMode();
};
