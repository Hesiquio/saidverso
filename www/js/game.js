// ============================================================
// SAIDVERSO - Motor de Juego (Versión WEB)
// Diferencias vs móvil: sin D-Pad visual, controles por teclado
// ============================================================

let player, enemy, letters, mazeWalls, countdownText, coinsGroup, chestGroup, animalGroup;
let currentLevel = null;
let collectedWord = "";
let lives = 3;
let uiTextWord, uiTextHint;
let dpad = { up: false, down: false, left: false, right: false };

// Niveles de emergencia (se reemplazan con datos de Supabase)
// Pool de 10 laberintos bien diseñados (10x12)
// 0 = Camino, 1 = Muro
const mazesPool = [
    // 1. El Circuito (Abierto)
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 2. Columnas
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 3. El Zig-Zag
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 4. La Cruz
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 5. Los Pequeños Cuartos
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 6. El Peine
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 7. El Diamante
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 8. Líneas Discontinuas
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 9. El Vacío Central
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // 10. Laberinto de Pasillos
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

// 11. Mapa especial "Campo Abierto" (Cada 5 niveles)
const openMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let lastMazeIndex = -1;

let allLevels = [
    { word: "SAID", hint: "REGLA: +1", shift: 1, learning: { text: "¡Bienvenido! Criptografía básica.", question: "Si A es B, ¿qué es B?", options: ["C", "A", "D"], correct: 0 } },
    { word: "HOLA", hint: "REGLA: +1", shift: 1, learning: { text: "Buen trabajo.", question: "Si H es I, ¿qué es O?", options: ["P", "N", "M"], correct: 0 } },
    { word: "AMIGO", hint: "REGLA: +2", shift: 2, learning: { text: "Avanzas rápido.", question: "Si A (+2) es C, ¿qué es B?", options: ["D", "C", "E"], correct: 0 } },
    { word: "CASA", hint: "REGLA: +1", shift: 1, learning: { text: "Protege tu hogar.", question: "Si C es D, ¿qué es Z?", options: ["A", "B", "Y"], correct: 0 } },
    { word: "PERRO", hint: "REGLA: +3", shift: 3, learning: { text: "Los perros son leales.", question: "Si A (+3) es D, ¿qué es B?", options: ["E", "D", "F"], correct: 0 } }
];

class SaidVersoScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    preload() {
        // Las texturas se generan en create() para evitar errores de contexto
    }

    create() {
        // Generar texturas con Emojis vía Canvas
        const makeEmojiTexture = (key, emoji, size) => {
            const canvas = document.createElement('canvas');
            canvas.width = 32; canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.font = `${size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, 16, 18);
            this.textures.addCanvas(key, canvas);
        };

        makeEmojiTexture('robot', '👨‍🚀', 26);
        makeEmojiTexture('enemy', '👾', 28);
        makeEmojiTexture('chest', '🎁', 24);

        const g = this.make.graphics({ add: false });
        g.fillStyle(0x0d1b4b); g.fillRect(0, 0, 40, 40);
        g.lineStyle(1, 0x00ffff, 0.4); g.strokeRect(1, 1, 38, 38);
        g.generateTexture('wall', 40, 40); g.clear();
        g.destroy();

        // Teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D' });
        this.powerKeys = this.input.keyboard.addKeys({
            star: Phaser.Input.Keyboard.KeyCodes.ONE,
            ghost: Phaser.Input.Keyboard.KeyCodes.TWO,
            speed: Phaser.Input.Keyboard.KeyCodes.THREE,
            life: Phaser.Input.Keyboard.KeyCodes.FOUR,
            key: Phaser.Input.Keyboard.KeyCodes.FIVE,
            invisible: Phaser.Input.Keyboard.KeyCodes.SIX
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
        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.key)) tryActivatePower('key');
        if (Phaser.Input.Keyboard.JustDown(this.powerKeys.invisible)) tryActivatePower('invisible');

        player.setVelocity(0);
        const speed = State.activePower === 'speed' ? 300 : 180;
        const { cursors, wasd } = this;

        if (cursors.left.isDown || wasd.left.isDown || dpad.left) player.setVelocityX(-speed);
        else if (cursors.right.isDown || wasd.right.isDown || dpad.right) player.setVelocityX(speed);

        if (cursors.up.isDown || wasd.up.isDown || dpad.up) player.setVelocityY(-speed);
        else if (cursors.down.isDown || wasd.down.isDown || dpad.down) player.setVelocityY(speed);

        if (enemy.active) {
            if (State.activePower === 'star') {
                enemy.setVelocity(0);
            } else {
                // En el nivel de campo abierto (cada 5), el centinela es más lento para dar oportunidad de esquive
                const eSpeed = (currentLevel.maze === openMaze) ? 60 : 90;
                this.physics.moveToObject(enemy, player, eSpeed);
            }
        }
    }
}

// ---- Carga de nivel ----
function loadLevel(scene) {
    currentLevel = allLevels[State.currentLevelIndex % allLevels.length] || allLevels[0];

    // Lógica de mapas: Cada 5 niveles sale el mapa de "Campo Abierto" (Tipo Serpiente)
    // NOTA: Añadimos index 0 temporalmente para que el usuario lo pruebe de inmediato
    if (State.currentLevelIndex === 0 || (State.currentLevelIndex + 1) % 5 === 0) {
        currentLevel.maze = openMaze;
        lastMazeIndex = -1; // Reset para permitir cualquier mapa en el nivel siguiente
    } else {
        // Asignar un laberinto aleatorio del pool sin repetir el anterior
        let mazeIdx;
        do {
            mazeIdx = Math.floor(Math.random() * mazesPool.length);
        } while (mazeIdx === lastMazeIndex && mazesPool.length > 1);

        lastMazeIndex = mazeIdx;
        currentLevel.maze = mazesPool[mazeIdx];
    }

    collectedWord = "";
    lives = 3;
    window.perfectLevel = true;
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

    if (!animalGroup) animalGroup = scene.physics.add.group();
    else animalGroup.clear(true, true);

    const mazeWidth = currentLevel.maze[0].length * 40;
    const mazeHeight = currentLevel.maze.length * 40;
    const offsetX = (450 - mazeWidth) / 2;
    const offsetY = (800 - mazeHeight) / 2 - 80;

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
        window.enemyStartPos = { x: freeSpaces[freeSpaces.length - 1].x, y: freeSpaces[freeSpaces.length - 1].y };
    }

    const getFarSpace = () => {
        Phaser.Utils.Array.Shuffle(freeSpaces);
        const pStart = window.playerStartPos || { x: 0, y: 0 };
        for (let i = 0; i < freeSpaces.length; i++) {
            if (Phaser.Math.Distance.Between(freeSpaces[i].x, freeSpaces[i].y, pStart.x, pStart.y) > 160) {
                return freeSpaces.splice(i, 1)[0];
            }
        }
        return freeSpaces.pop();
    };

    // Monedas y Cofre
    for (let i = 0; i < 5; i++) {
        const p = Phaser.Utils.Array.RemoveRandomElement(freeSpaces);
        if (!p) break;
        const c = scene.add.text(p.x, p.y, '🪙', { fontSize: '16px' }).setOrigin(0.5).setDepth(4);
        scene.physics.add.existing(c);
        coinsGroup.add(c);
    }

    const cp = getFarSpace();
    if (cp) {
        const chest = scene.physics.add.sprite(cp.x, cp.y, 'chest').setDepth(4);
        chestGroup.add(chest);
    }

    // Animales
    const ap = getFarSpace();
    if (ap) {
        const animalsData = [
            { emoji: '🐕', name: 'Perro Cibernético', fact: 'Los perros tienen un olfato increíble. ¡Como un buen Antivirus detectando malware!' },
            { emoji: '🐈', name: 'Gato Cuántico', fact: 'Los gatos duermen mucho. ¡Como una compu en modo suspensión ahorrando energía!' },
            { emoji: '🦜', name: 'Loro Criptográfico', fact: 'Los loros imitan voces. ¡Cuidado con el Phishing de voz (Vishing)!' },
            { emoji: '🐢', name: 'Tortuga Blindada', fact: 'Las tortugas llevan su escudo a todos lados. ¡Como un Firewall robusto!' }
        ];
        const animalObj = animalsData[Math.floor(Math.random() * animalsData.length)];
        const a = scene.add.text(ap.x, ap.y, animalObj.emoji, { fontSize: '24px' }).setOrigin(0.5).setDepth(4);
        a.setData('animal', animalObj);
        scene.physics.add.existing(a);
        animalGroup.add(a);
    }

    // Letras cifradas
    setupLetters(scene, freeSpaces);

    // Personajes y Reglas Físicas (Solo se declaran una vez)
    if (!player) {
        player = scene.physics.add.sprite(freeSpaces[0].x, freeSpaces[0].y, 'robot').setDepth(5);
        enemy = scene.physics.add.sprite(freeSpaces[freeSpaces.length - 1].x, freeSpaces[freeSpaces.length - 1].y, 'enemy').setDepth(5);
        player.setCollideWorldBounds(true);
        enemy.setCollideWorldBounds(true);
        player.setBodySize(18, 18);

        // Colliders
        scene.physics.add.collider(player, mazeWalls, null, () => State.activePower !== 'ghost');
        scene.physics.add.collider(enemy, mazeWalls);

        // Overlaps
        scene.physics.add.overlap(player, enemy, handleEnemyCollision, null, scene);
        scene.physics.add.overlap(player, coinsGroup, collectCoin, null, scene);
        scene.physics.add.overlap(player, chestGroup, collectChest, null, scene);
        scene.physics.add.overlap(player, animalGroup, collectAnimal, null, scene);
        scene.physics.add.overlap(player, letters, collectLetter, null, scene);
    } else {
        player.setPosition(freeSpaces[0].x, freeSpaces[0].y);
        enemy.setPosition(freeSpaces[freeSpaces.length - 1].x, freeSpaces[freeSpaces.length - 1].y);
        enemy.setActive(true).setVisible(true);
        player.setAlpha(1); player.clearTint();
        State.activePower = null;
    }

    // HUD en canvas (Solo contador central, el resto es HTML unificado)
    if (!countdownText) {
        countdownText = scene.add.text(225, 140, '', {
            fontSize: '24px', color: '#ffff00', fontStyle: 'bold', backgroundColor: '#000000bb', padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setDepth(500).setScrollFactor(0).setVisible(false);
    }
    updateWordDisplay();
    createDPad(scene);
}

// ---- Poderes ----
let powerTimerEvent = null;

window.tryActivatePower = function (type) {
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
            if (type === 'key') player.setTint(0xff8800);
            if (type === 'invisible') player.setAlpha(0.2);
            AudioFX.powerup();

            if (powerTimerEvent) clearInterval(powerTimerEvent);

            let pTime = 10;
            if (countdownText) countdownText.setText(`${type.toUpperCase()}: ${pTime}s`).setVisible(true);

            powerTimerEvent = setInterval(() => {
                if (State.isPaused) return;
                pTime--;

                if (pTime <= 0 || !State.activePower) {
                    clearInterval(powerTimerEvent);
                    State.activePower = null;
                    player.setAlpha(1);
                    player.clearTint();
                    if (countdownText) countdownText.setVisible(false);
                } else {
                    if (countdownText) countdownText.setText(`${type.toUpperCase()}: ${pTime}s`).setVisible(true);
                }
            }, 1000);
        }
    } else {
        AudioFX.wrong();
        const el = document.getElementById('shop-coins-display');
        if (el) { el.innerText = "¡NO TIENES ESE PODER!"; setTimeout(() => el.innerText = `Tus créditos: 🪙 ${State.coins}`, 2000); }
    }
}

// ---- Colisiones ----
function handleEnemyCollision() {
    if (lives <= 0) return; // Evitar múltiples muertes por colisión continua

    if (State.activePower === 'star') {
        AudioFX.win();
        enemy.disableBody(true, true); // Deshabilita física e invisibiliza
        setTimeout(() => {
            if (enemy && enemy.scene) {
                const ex = window.enemyStartPos ? window.enemyStartPos.x : 400;
                const ey = window.enemyStartPos ? window.enemyStartPos.y : 300;
                enemy.enableBody(true, ex, ey, true, true);
            }
        }, 5000); // El centinela revive en 5 segundos en su base
        return;
    }

    window.perfectLevel = false; // Perdió el bono perfecto
    AudioFX.hit(); lives--; State.streak = 0; State.save();
    updateLivesUI();
    const el = document.getElementById('ui-streak');
    if (el) el.innerText = '🔥 0';
    game.scene.scenes[0].cameras.main.shake(300, 0.02);

    if (lives <= 0) {
        game.scene.scenes[0].physics.pause();
        setTimeout(() => {
            alert('¡Misión Fallida!');
            window.location.reload();
        }, 100);
        return;
    }

    // Regresar al inicio del laberinto si aún le quedan vidas
    if (window.playerStartPos) {
        player.setPosition(window.playerStartPos.x, window.playerStartPos.y);
    } else {
        player.setPosition(225, 400);
    }
}

function collectCoin(p, c) {
    AudioFX.coin(); c.destroy();
    State.coins += 10; updateCoinsUI();
}

function collectAnimal(p, a) {
    const data = a.getData('animal');
    a.destroy();
    AudioFX.powerup();
    State.coins += 50;
    updateCoinsUI();
    window.showAnimalFact(data);
}

// ---- Letras ----
function setupLetters(scene, freeSpaces) {
    const { word, shift } = currentLevel;
    word.split('').forEach(char => {
        const code = char.charCodeAt(0) - 65;
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
    let isAllowed = (val === currentLevel.word[collectedWord.length]);
    if (State.activePower === 'key') isAllowed = true;

    if (!isAllowed) {
        AudioFX.wrong(); game.scene.scenes[0].cameras.main.shake(80, 0.004); return;
    }
    AudioFX.collect();
    collectedWord += currentLevel.word[collectedWord.length]; // Automágicamente agrega la correcta
    l.destroy(); updateWordDisplay();
    if (collectedWord === currentLevel.word) {
        AudioFX.win();
        if (window.perfectLevel) {
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

window.startRoulette = function (title, callback = null) {
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
        { id: 'life', icon: '❤️', text: 'VIDA EXTRA: Suma un corazón.' },
        { id: 'key', icon: '🔑', text: 'CRIPTO-LLAVE: Toda letra sirve.' },
        { id: 'invisible', icon: '👁️', text: 'INVISIBLE: Sin rastreo.' }
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

window.showAnimalFact = function (data) {
    game.scene.scenes[0].physics.pause();
    State.isPaused = true;
    document.getElementById('roulette-title').innerText = `¡${data.name.toUpperCase()} RESCATADO!`;
    document.getElementById('roulette-box').innerText = data.emoji;
    document.getElementById('roulette-desc').innerText = `¡Ganaste 50 Créditos!\n\nDato curioso:\n${data.fact}`;

    const actionsDiv = document.getElementById('roulette-actions');
    actionsDiv.style.display = 'flex';
    actionsDiv.innerHTML = `<button onclick="closeRoulette(false)" style="width:80%;">¡INCREÍBLE!</button>`;
    document.getElementById('roulette-modal').style.display = 'flex';
}

// ---- Fase de aprendizaje ----
function showLearningPhase() {
    game.scene.scenes[0].physics.pause();
    State.streak++; State.save();

    document.getElementById('streak-msg').innerText = `🔥 ¡RACHA DE ${State.streak}!`;
    document.getElementById('learn-text').innerText = currentLevel.learning.text;
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
            document.getElementById('intro-sub').style.opacity = 1;
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
    updateInventoryUI(); // Sincronizar la barra unificada
}
function updateCoinsUI() { const el = document.getElementById('ui-coins-game'); if (el) el.innerText = `🪙 ${State.coins}`; }
function updateInventoryUI() {
    const el = document.getElementById('ui-inventory');
    if (el) {
        const i = State.inventory || { star: 0, ghost: 0, speed: 0, life: 0, key: 0, invisible: 0 };
        // El corazón ahora muestra las vidas reales del jugador (lives)
        // El resto muestra el stock de poderes
        el.innerHTML = `
            <span onclick="window.tryActivatePower('life')" style="cursor:pointer; color:#ff3366;" title="Salud Actual (Clic para usar Extra)">❤️${lives}${i.life > 0 ? ' (+' + i.life + ')' : ''}</span> &nbsp;
            <span onclick="window.tryActivatePower('star')" style="cursor:pointer;" title="Estrella">⭐${i.star || 0}</span> &nbsp;
            <span onclick="window.tryActivatePower('ghost')" style="cursor:pointer;" title="Fantasma">👻${i.ghost || 0}</span> &nbsp;
            <span onclick="window.tryActivatePower('speed')" style="cursor:pointer;" title="Velocidad">⚡${i.speed || 0}</span> &nbsp;
            <span onclick="window.tryActivatePower('key')" style="cursor:pointer;" title="Llave">🔑${i.key || 0}</span> &nbsp;
            <span onclick="window.tryActivatePower('invisible')" style="cursor:pointer;" title="Invisible">👁️${i.invisible || 0}</span>
        `;
    }
}
function updateWordDisplay() {
    const shown = collectedWord.split('').join(' ');
    const blanks = ' _ '.repeat(currentLevel.word.length - collectedWord.length).trim();
    const fullText = `${shown} ${blanks}`.trim();

    // Actualizar HTML
    const levelEl = document.getElementById('ui-level-html');
    if (levelEl) levelEl.innerText = `N${State.currentLevelIndex + 1}`;

    const wordEl = document.getElementById('ui-word-html');
    if (wordEl) {
        wordEl.innerText = fullText;
        // Ajuste de fuente dinámico basado en la longitud de la cadena
        if (fullText.length > 20) wordEl.style.fontSize = '11px';
        else if (fullText.length > 14) wordEl.style.fontSize = '13px';
        else wordEl.style.fontSize = '16px';
    }

    let helpMsg = currentLevel.hint;
    if (collectedWord.length < currentLevel.word.length) {
        const nextChar = currentLevel.word[collectedWord.length];
        const code = nextChar.charCodeAt(0) - 65;
        const shifted = ((code + currentLevel.shift) % 26) + 65;
        const nextCiphered = String.fromCharCode(shifted);
        helpMsg += `<br><span style="color:#00ffff;">👉 BUSCA: [ ${nextCiphered} ]</span>`;
    }

    const hintEl = document.getElementById('ui-hint-html');
    if (hintEl) hintEl.innerHTML = helpMsg;

    // Sincronizar canvas por si acaso
    if (uiTextWord) uiTextWord.setText(fullText);
    if (uiTextHint) uiTextHint.setText(helpMsg);
}

// ---- UI Helpers ----
function createDPad(scene) {
    const x = 225, y = 650; 
    const btn = (bx, by, dir, symbol) => {
        // D-Pad mucho más visible y con mayor profundidad
        let b = scene.add.circle(bx, by, 34, 0x00ffff, 0.15).setInteractive().setDepth(2000);
        b.setStrokeStyle(2, 0x00ffff, 0.4);
        let t = scene.add.text(bx, by, symbol, { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setDepth(2001).setAlpha(0.8);
        
        const reset = () => { dpad[dir] = false; b.setAlpha(1); t.setAlpha(0.8); };
        b.on('pointerdown', () => { dpad[dir] = true; b.setAlpha(0.5); t.setAlpha(1); });
        b.on('pointerup', reset); b.on('pointerout', reset); b.on('pointerupoutside', reset);
    };
    btn(x, y - 55, 'up', '▲'); btn(x, y + 55, 'down', '▼');
    btn(x - 55, y, 'left', '◀'); btn(x + 65, y, 'right', '▶');
}

// ---- Punto de entrada ----
window.exitApp = function () {
    if (confirm('¿Seguro que quieres salir de SaidVerso?')) {
        // En Capacitor/Android esto cierra la app realmente
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
            window.Capacitor.Plugins.App.exitApp();
        } else {
            // Fallback: Si no está en modo nativo, simplemente recargamos o cerramos si es posible
            window.location.reload();
        }
    }
};

window.startGame = function () {
    if (!game || !game.scene.scenes[0]) { setTimeout(window.startGame, 100); return; }
    document.getElementById('dashboard-screen').style.display = 'none';
    document.querySelector('.ui-overlay').style.display = 'flex';
    updateInventoryUI();
    // Recargar nivel con datos frescos de Supabase
    loadLevel(game.scene.scenes[0]);
    startScanMode();
};
