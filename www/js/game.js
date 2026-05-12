let player, enemy, letters, mazeWalls, countdownText;
let allLevels = [], currentLevelIndex = 0, currentLevel = null;
let collectedWord = "", uiTextWord, uiTextHint, uiTextLevel, lives = 3, streak = 0;
let dpad = { up: false, down: false, left: false, right: false };
let isPaused = false, isScanning = true;

const GameScene = {
    preload() {
        const graphics = this.make.graphics();
        graphics.fillStyle(0x00ffff); graphics.fillRect(2, 2, 20, 20);
        graphics.generateTexture('robot', 24, 24);
        graphics.clear(); graphics.fillStyle(0xff0000); graphics.fillCircle(12, 12, 10);
        graphics.generateTexture('enemy', 24, 24);
        graphics.clear(); graphics.fillStyle(0x1a1a2e); graphics.fillRect(0,0,40,40);
        graphics.lineStyle(2, 0x00ffff, 0.3); graphics.strokeRect(2,2,36,36);
        graphics.generateTexture('wall', 40, 40);
    },

    async create() {
        runIntro();
        try {
            allLevels = await Database.fetchLevels();
        } catch (e) { console.error("Error DB:", e); }
        if (allLevels.length === 0) allLevels = [{ word: "SAID", hint: "REGLA: +1", shift: 1, maze: [[1,1,1],[1,0,1],[1,1,1]], learning: {text:"", question:"", options:[], correct:0} }];
        
        currentLevelIndex = parseInt(localStorage.getItem('cq_current_level') || 0);
        streak = parseInt(localStorage.getItem('cq_streak') || 0);
        
        loadLevel(this);
        this.physics.pause();
    },

    update() {
        if (!player || !player.active || isPaused || isScanning) return;
        player.setVelocity(0); const speed = 180;
        if (this.cursors.left.isDown || dpad.left) player.setVelocityX(-speed);
        else if (this.cursors.right.isDown || dpad.right) player.setVelocityX(speed);
        if (this.cursors.up.isDown || dpad.up) player.setVelocityY(-speed);
        else if (this.cursors.down.isDown || dpad.down) player.setVelocityY(speed);
        if (enemy.active) this.physics.moveToObject(enemy, player, 80);
    }
};

function loadLevel(scene) {
    currentLevel = allLevels[currentLevelIndex];
    collectedWord = ""; lives = 3; updateLivesUI();
    document.getElementById('ui-streak').innerText = `🔥 ${streak}`;
    if (mazeWalls) mazeWalls.clear(true, true);
    if (letters) letters.clear(true, true);
    mazeWalls = scene.physics.add.staticGroup();
    currentLevel.maze.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell === 1) mazeWalls.create(cIdx * 40 + 20, rIdx * 40 + 160, 'wall').setDepth(1);
        });
    });
    if (!player) {
        player = scene.physics.add.sprite(60, 200, 'robot').setDepth(2);
        enemy = scene.physics.add.sprite(380, 200, 'enemy').setDepth(2);
        player.setCollideWorldBounds(true); enemy.setCollideWorldBounds(true);
        player.setBodySize(18, 18);
        scene.physics.add.collider(player, mazeWalls); scene.physics.add.collider(enemy, mazeWalls);
        scene.physics.add.overlap(player, enemy, handleEnemyHit, null, scene);
    } else {
        player.setPosition(60, 200); enemy.setPosition(380, 200);
        scene.physics.add.collider(player, mazeWalls); scene.physics.add.collider(enemy, mazeWalls);
    }
    letters = scene.physics.add.group();
    setupLetters(scene);
    scene.physics.add.overlap(player, letters, collectLetter, null, scene);
    if (!uiTextWord) {
        uiTextWord = scene.add.text(225, 45, "", { fontSize: '24px', color: '#ffffff', fontWeight: 'bold' }).setOrigin(0.5).setDepth(10);
        uiTextHint = scene.add.text(225, 80, "", { fontSize: '13px', color: '#ff00ff' }).setOrigin(0.5).setDepth(10);
        uiTextLevel = scene.add.text(20, 110, "", { fontSize: '12px', color: '#00ffff' }).setDepth(10);
        countdownText = scene.add.text(225, 400, "", { fontSize: '32px', color: '#ffff00', fontWeight: 'bold', backgroundColor: '#000000aa' }).setOrigin(0.5).setDepth(500);
    }
    updateWordDisplay(); updateTask();
    if (!scene.cursors) { createDPad(scene); scene.cursors = scene.input.keyboard.createCursorKeys(); }
}

function handleEnemyHit() {
    AudioFX.hit(); lives--; streak = 0; localStorage.setItem('cq_streak', 0);
    updateLivesUI(); document.getElementById('ui-streak').innerText = `🔥 0`;
    game.scene.scenes[0].cameras.main.shake(300, 0.02); player.setPosition(60, 200); enemy.setPosition(380, 200);
    if (lives <= 0) { alert("¡Misión Fallida!"); window.location.reload(); }
}

function updateLivesUI() { document.getElementById('ui-lives').innerText = "❤️".repeat(lives); }

function updateWordDisplay() {
    let display = collectedWord.split('').join(' ') + " ";
    display += "_ ".repeat(currentLevel.word.length - collectedWord.length);
    uiTextWord.setText(display.trim());
}

function setupLetters(scene) {
    const word = currentLevel.word; const shift = currentLevel.shift;
    let freeSpaces = [];
    currentLevel.maze.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
            if (cell === 0) freeSpaces.push({x: cIdx * 40 + 20, y: rIdx * 40 + 160});
        });
    });
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
        if (collectedWord === currentLevel.word) { AudioFX.win(); showLearningPhase(); }
    } else { AudioFX.wrong(); game.scene.scenes[0].cameras.main.shake(100, 0.005); }
}

function showLearningPhase() {
    game.scene.scenes[0].physics.pause(); streak++;
    localStorage.setItem('cq_streak', streak);
    document.getElementById('learning-modal').style.display = 'flex';
    document.getElementById('streak-msg').innerText = `¡RACHA DE ${streak} NIVELES! 🔥`;
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
        currentLevelIndex++; localStorage.setItem('cq_current_level', currentLevelIndex);
        Database.saveScore(localStorage.getItem('cq_username'), currentLevelIndex, streak);
        if (currentLevelIndex < allLevels.length) UI.showDashboard(currentLevelIndex, streak);
        else { alert("¡Felicidades!"); window.location.reload(); }
    } else { AudioFX.wrong(); alert("¡Analiza de nuevo!"); }
}

function updateTask() {
    const nextChar = currentLevel.word[collectedWord.length]; const shift = currentLevel.shift;
    const cipheredNext = String.fromCharCode(((nextChar.charCodeAt(0) - 65 + shift) % 26) + 65);
    // Nota: El elemento UI se actualiza si existe
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
            log.appendChild(div); AudioFX.play(400 + i*100, 'sine', 0.05, 0.02);
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
                    if (name) UI.showDashboard(currentLevelIndex, streak); 
                    else document.getElementById('login-screen').style.display = 'flex';
                }, 1000);
            }, 1500);
        }
    }, 400);
}
