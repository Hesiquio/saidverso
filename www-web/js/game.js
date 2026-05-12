// ============================================================
// SAIDVERSO - Motor de Juego (Versión WEB)
// Diferencias vs móvil: sin D-Pad visual, controles por teclado
// ============================================================

let player, enemy, letters, mazeWalls, countdownText, coinsGroup;
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

    // Limpiar grupos previos
    [mazeWalls, letters, coinsGroup].forEach(g => g && g.clear(true, true));

    mazeWalls  = scene.physics.add.staticGroup();
    letters    = scene.physics.add.group();
    coinsGroup = scene.physics.add.group();

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

    // Personajes
    if (!player) {
        player = scene.physics.add.sprite(freeSpaces[0].x, freeSpaces[0].y, 'robot').setDepth(5);
        enemy  = scene.physics.add.sprite(freeSpaces[freeSpaces.length-1].x, freeSpaces[freeSpaces.length-1].y, 'enemy').setDepth(5);
        player.setCollideWorldBounds(true);
        enemy.setCollideWorldBounds(true);
        player.setBodySize(18, 18);
        scene.physics.add.collider(player, mazeWalls, null, () => State.activePower !== 'ghost');
        scene.physics.add.collider(enemy,  mazeWalls);
        scene.physics.add.overlap(player, enemy, handleEnemyCollision, null, scene);
    } else {
        player.setPosition(freeSpaces[0].x, freeSpaces[0].y);
        enemy.setPosition(freeSpaces[freeSpaces.length-1].x, freeSpaces[freeSpaces.length-1].y);
        enemy.setActive(true).setVisible(true);
        player.setAlpha(1); player.clearTint();
        State.activePower = null;
    }

    // Monedas
    for (let i = 0; i < 5; i++) {
        const p = Phaser.Utils.Array.RemoveRandomElement(freeSpaces);
        if (!p) break;
        const c = scene.add.text(p.x, p.y, '🪙', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        scene.physics.add.existing(c);
        coinsGroup.add(c);
    }
    scene.physics.add.overlap(player, coinsGroup, collectCoin, null, scene);

    // Letras cifradas
    setupLetters(scene, freeSpaces);
    scene.physics.add.overlap(player, letters, collectLetter, null, scene);

    // HUD en canvas
    if (!uiTextWord) {
        uiTextWord = scene.add.text(400, 30, '', { fontSize: '26px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(10);
        uiTextHint = scene.add.text(400, 65, '', { fontSize: '14px', color: '#ff00ff' }).setOrigin(0.5).setDepth(10);
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
    player.setPosition(80, 160);
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
        if (lives === 3) { State.coins += 20; updateCoinsUI(); }
        AudioFX.win();
        showLearningPhase();
    }
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
function updateLivesUI()  { const el = document.getElementById('ui-lives');      if (el) el.innerText = '❤️'.repeat(lives); }
function updateCoinsUI()  { const el = document.getElementById('ui-coins-game'); if (el) el.innerText = `🪙 ${State.coins}`; }
function updateWordDisplay() {
    const shown = collectedWord.split('').join(' ');
    const blanks = '_ '.repeat(currentLevel.word.length - collectedWord.length).trim();
    uiTextWord.setText(`${shown} ${blanks}`.trim());
    uiTextHint.setText(currentLevel.hint);
}

// ---- Punto de entrada ----
window.startGame = function () {
    if (!game || !game.scene.scenes[0]) { setTimeout(window.startGame, 100); return; }
    document.getElementById('dashboard-screen').style.display = 'none';
    document.querySelector('.ui-overlay').style.display = 'flex';
    document.getElementById('pause-btn').style.display  = 'flex';
    document.getElementById('power-btn').style.display  = 'flex';
    // Recargar nivel con datos frescos de Supabase (ya sincronizados en background)
    loadLevel(game.scene.scenes[0]);
    startScanMode();
};
