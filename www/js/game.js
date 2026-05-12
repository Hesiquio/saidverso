let player, enemy, letters, mazeWalls, countdownText, coinsGroup, animalsGroup;
let allLevels = [{ word: "SAID", hint: "REGLA: +1", shift: 1, maze: [[1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1],[1,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]], learning: {text:"¡Bienvenido!", question:"¿Qué es 1+1?", options:["2","3"], correct:0} }];
let currentLevel = null;
let collectedWord = "", uiTextWord, uiTextHint, uiTextLevel, lives = 3;
let dpad = { up: false, down: false, left: false, right: false };
let isPaused = false, isScanning = true;
let activePower = null, powerTimer = 0;

const GameScene = {
    preload() {
        const graphics = this.make.graphics();
        graphics.fillStyle(0x00ffff); graphics.fillRect(0, 0, 24, 24);
        graphics.generateTexture('robot', 24, 24);
        graphics.clear(); graphics.fillStyle(0xff0000); graphics.fillCircle(12, 12, 10);
        graphics.generateTexture('enemy', 24, 24);
        graphics.clear(); graphics.fillStyle(0x1a1a3e); graphics.fillRect(0,0,40,40); // Azul oscuro para visibilidad
        graphics.lineStyle(2, 0x00ffff, 0.8); graphics.strokeRect(2,2,36,36);
        graphics.generateTexture('wall', 40, 40);
    },

    create() {
        this.cameras.main.setBackgroundColor('#050515'); // Fondo azul muy oscuro
        loadLevel(this);
        this.physics.pause();
        runIntro();
        this.loadOnlineLevels();
    },

    async loadOnlineLevels() {
        try {
            const data = await Database.fetchLevels();
            if (data && data.length > 0) {
                allLevels = data;
                console.log("Niveles cargados:", allLevels.length);
            }
        } catch (e) { console.error("Error DB:", e); }
    },

    update() {
        if (!player || !player.active || isPaused || isScanning) return;
        player.setVelocity(0); 
        let speed = (activePower === 'speed') ? 300 : 180;
        const cursors = this.cursors; const wasd = this.wasd;
        if (cursors.left.isDown || wasd.A.isDown || dpad.left) player.setVelocityX(-speed);
        else if (cursors.right.isDown || wasd.D.isDown || dpad.right) player.setVelocityX(speed);
        if (cursors.up.isDown || wasd.W.isDown || dpad.up) player.setVelocityY(-speed);
        else if (cursors.down.isDown || wasd.S.isDown || dpad.down) player.setVelocityY(speed);
        if (enemy.active && activePower !== 'star') this.physics.moveToObject(enemy, player, 80);
        else if (activePower === 'star') enemy.setVelocity(0);
    }
};

function loadLevel(scene) {
    if (!scene) return;
    currentLevel = allLevels[State.currentLevelIndex] || allLevels[0];
    collectedWord = ""; lives = 3; updateLivesUI();
    
    if (mazeWalls) mazeWalls.clear(true, true);
    if (letters) letters.clear(true, true);
    if (coinsGroup) coinsGroup.clear(true, true);
    if (animalsGroup) animalsGroup.clear(true, true);

    mazeWalls = scene.physics.add.staticGroup();
    let freeSpaces = [];
    currentLevel.maze.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell === 1) mazeWalls.create(cIdx * 40 + 20, rIdx * 40 + 160, 'wall').setDepth(1);
            else freeSpaces.push({x: cIdx * 40 + 20, y: rIdx * 40 + 160});
        });
    });

    if (!player) {
        player = scene.physics.add.sprite(60, 220, 'robot').setDepth(5);
        enemy = scene.physics.add.sprite(380, 220, 'enemy').setDepth(5);
        player.setCollideWorldBounds(true); enemy.setCollideWorldBounds(true);
        player.setBodySize(18, 18);
        scene.physics.add.collider(player, mazeWalls, null, () => activePower !== 'ghost');
        scene.physics.add.collider(enemy, mazeWalls);
        scene.physics.add.overlap(player, enemy, handleEnemyCollision, null, scene);
    } else {
        player.setPosition(60, 220); enemy.setPosition(380, 220); enemy.setActive(true).setVisible(true);
        player.setAlpha(1); player.clearTint();
    }

    checkAndActivatePower();

    coinsGroup = scene.physics.add.group();
    animalsGroup = scene.physics.add.group();
    for(let i=0; i<5; i++) {
        let p = Phaser.Utils.Array.RemoveRandomElement(freeSpaces);
        if(p) {
            let c = scene.add.text(p.x, p.y, "🪙", { fontSize: '18px' }).setOrigin(0.5).setDepth(4);
            scene.physics.add.existing(c); coinsGroup.add(c);
        }
    }
    
    letters = scene.physics.add.group();
    setupLetters(scene, freeSpaces);
    scene.physics.add.overlap(player, letters, collectLetter, null, scene);

    if (!uiTextWord) {
        uiTextWord = scene.add.text(225, 45, "", { fontSize: '24px', color: '#ffffff', fontWeight: 'bold' }).setOrigin(0.5).setDepth(10);
        uiTextHint = scene.add.text(225, 80, "", { fontSize: '13px', color: '#ff00ff' }).setOrigin(0.5).setDepth(10);
        countdownText = scene.add.text(225, 400, "", { fontSize: '32px', color: '#ffff00', fontWeight: 'bold', backgroundColor: '#000000aa' }).setOrigin(0.5).setDepth(500);
    }
    updateWordDisplay();
    if (!scene.cursors) { 
        createDPad(scene); 
        scene.cursors = scene.input.keyboard.createCursorKeys(); 
        scene.wasd = scene.input.keyboard.addKeys('W,A,S,D');
    }
    
    // Forzar foco de cámara
    scene.cameras.main.centerOn(225, 400);
}

function checkAndActivatePower() {
    if (!player) return;
    if (State.inventory.star > 0) { activePower = 'star'; State.inventory.star--; player.setTint(0xffff00); }
    else if (State.inventory.ghost > 0) { activePower = 'ghost'; State.inventory.ghost--; player.setAlpha(0.5); }
    else if (State.inventory.speed > 0) { activePower = 'speed'; State.inventory.speed--; player.setTint(0x00ff00); }
    else if (State.inventory.life > 0) { lives++; State.inventory.life--; updateLivesUI(); }
    else { activePower = null; player.setAlpha(1); player.clearTint(); }
    State.save();
    if (activePower) AudioFX.powerup();
}

function handleEnemyCollision() {
    if (activePower === 'star') { AudioFX.win(); enemy.setActive(false).setVisible(false); return; }
    AudioFX.hit(); lives--; State.streak = 0; State.save();
    updateLivesUI(); if(document.getElementById('ui-streak')) document.getElementById('ui-streak').innerText = `🔥 0`;
    game.scene.scenes[0].cameras.main.shake(300, 0.02); player.setPosition(60, 220);
    if (lives <= 0) { alert("¡Misión Fallida!"); window.location.reload(); }
}

function collectCoin(p, c) { AudioFX.coin(); c.destroy(); State.coins += 10; if(document.getElementById('ui-coins-game')) document.getElementById('ui-coins-game').innerText = `🪙 ${State.coins}`; }
function collectAnimal(p, a) { AudioFX.win(); a.destroy(); State.coins += 50; if(document.getElementById('ui-coins-game')) document.getElementById('ui-coins-game').innerText = `🪙 ${State.coins}`; alert("¡Animal Rescatado! +50 créditos."); }
function updateLivesUI() { if(document.getElementById('ui-lives')) document.getElementById('ui-lives').innerText = "❤️".repeat(lives); }
function updateWordDisplay() {
    let display = collectedWord.split('').join(' ') + " ";
    display += "_ ".repeat(currentLevel.word.length - collectedWord.length);
    uiTextWord.setText(display.trim());
}

function setupLetters(scene, freeSpaces) {
    const word = currentLevel.word; const shift = currentLevel.shift;
    word.split('').forEach((char) => {
        const ciphered = String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
        let pos = Phaser.Utils.Array.RemoveRandomElement(freeSpaces) || {x:225, y:400};
        let l = scene.add.text(pos.x, pos.y, ciphered, { fontSize: '22px', color: '#ffff00', fontWeight: 'bold' }).setOrigin(0.5).setDepth(3);
        scene.physics.add.existing(l); l.setData('val', char); letters.add(l);
    });
}

function collectLetter(p, l) {
    const val = l.getData('val');
    if (val === currentLevel.word[collectedWord.length]) {
        AudioFX.collect(); collectedWord += val; l.destroy(); updateWordDisplay();
        if (collectedWord === currentLevel.word) { 
            if(lives === 3) { State.coins += 20; alert("¡NIVEL PERFECTO! +20 créditos."); }
            AudioFX.win(); showLearningPhase(); 
        }
    } else { AudioFX.wrong(); game.scene.scenes[0].cameras.main.shake(100, 0.005); }
}

function showLearningPhase() {
    game.scene.scenes[0].physics.pause(); State.streak++; State.save();
    document.getElementById('learning-modal').style.display = 'flex';
    if(document.getElementById('streak-msg')) document.getElementById('streak-msg').innerText = `¡RACHA DE ${State.streak} NIVELES! 🔥`;
    const info = currentLevel.learning;
    document.getElementById('learn-text').innerText = info.text;
    document.getElementById('quiz-question').innerText = info.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = "";
    info.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option'; btn.innerText = opt;
        btn.onclick = () => checkQuiz(idx, info.correct); optionsDiv.appendChild(btn);
    });
}

function checkQuiz(selected, correct) {
    if (selected === correct) {
        AudioFX.correct(); document.getElementById('learning-modal').style.display = 'none';
        State.currentLevelIndex++; State.save();
        Database.saveScore(localStorage.getItem('cq_username'), State.currentLevelIndex, State.streak, State.coins);
        if (State.currentLevelIndex < allLevels.length) UI.showDashboard();
        else { alert("¡Felicidades!"); window.location.reload(); }
    } else { AudioFX.wrong(); alert("¡Analiza de nuevo!"); }
}

function createDPad(scene) {
    const x = 320, y = 650;
    const btn = (bx, by, dir, symbol) => {
        let b = scene.add.circle(bx, by, 40, 0x00ffff, 0.1).setInteractive().setDepth(100);
        b.setStrokeStyle(2, 0x00ffff);
        scene.add.text(bx, by, symbol, { fontSize: '28px', color: '#00ffff' }).setOrigin(0.5).setDepth(101);
        const reset = () => { dpad[dir] = false; b.setAlpha(1); };
        b.on('pointerdown', () => { dpad[dir] = true; b.setAlpha(0.5); });
        b.on('pointerup', reset); b.on('pointerout', reset); b.on('pointerupoutside', reset);
    };
    btn(x, y-60, 'up', '▲'); btn(x, y+60, 'down', '▼');
    btn(x-60, y, 'left', '◀'); btn(x+70, y, 'right', '▶');
}

function startScanMode() {
    isScanning = true; const scene = game.scene.scenes[0]; scene.physics.pause();
    let count = 3; countdownText.setText(`ESCANEANDO... ${count}`).setColor('#ffff00').setVisible(true);
    scene.time.addEvent({
        delay: 1000, repeat: 3,
        callback: () => {
            count--;
            if (count > 0) countdownText.setText(`ESCANEANDO... ${count}`);
            else if (count === 0) countdownText.setText("¡EXPLORA!").setColor('#00ff00');
            else { countdownText.setVisible(false); isScanning = false; if (!isPaused) scene.physics.resume(); }
        }
    });
}

function runIntro() {
    const log = document.getElementById('boot-log');
    const lines = ["> CONECTANDO...", "> CARGANDO MUNDOS...", "> SISTEMA LISTO."];
    let i = 0;
    const interval = setInterval(() => {
        if(i < lines.length) {
            const div = document.createElement('div');
            div.className = 'boot-line'; div.innerText = lines[i];
            if(log) log.appendChild(div); AudioFX.play(400 + i*100, 'sine', 0.05, 0.02);
            i++;
        } else {
            clearInterval(interval);
            document.getElementById('intro-logo').style.opacity = 1;
            document.getElementById('intro-sub').style.opacity = 1;
            setTimeout(() => {
                document.getElementById('intro-screen').style.opacity = 0;
                setTimeout(() => { 
                    document.getElementById('intro-screen').style.display = 'none'; 
                    const name = localStorage.getItem('cq_username');
                    if (name) UI.showDashboard(); 
                    else document.getElementById('login-screen').style.display = 'flex';
                }, 1000);
            }, 1500);
        }
    }, 400);
}

window.startGame = function() {
    if (!game || !game.scene.scenes[0]) {
        setTimeout(window.startGame, 100);
        return;
    }
    document.getElementById('dashboard-screen').style.display = 'none';
    const overlay = document.querySelector('.ui-overlay');
    if (overlay) overlay.style.display = 'flex';
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) pauseBtn.style.display = 'flex';
    const powerBtn = document.getElementById('power-btn');
    if (powerBtn) powerBtn.style.display = 'flex';
    startScanMode();
};
