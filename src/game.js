
var config = {
    type: Phaser.AUTO,
    //backgroundColor: '#f1faee',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};
var game = new Phaser.Game(config);

var player;
var masks;
var platforms;
var cursors;
var score = 0;
var gameOver;
var scoreText;
var timerText;
var winText;
var timedEvent;
var textGameOver;
var timedEvent;
var gameStarted;
var finishedGame;
var dudito;

/*function gameScene() {
    this.score = 0;
    this.gameOver = false;
}*/

function preload() {
    this.load.image('sky', '/assets/images/sky1.png');
    this.load.image('groundBase', '/assets/images/platform-base.png');
    this.load.image('ground', '/assets/images/platform.png');
    this.load.image('platformAir', '/assets/images/platform-air.png');
    this.load.image('mushroomRed', '/assets/images/mushroom_red.png');
    this.load.image('mushroomBrown', '/assets/images/mushroom_brown.png');
    this.load.image('pitillo', '/assets/images/pitillo.png');
    this.load.image('mask1', '/assets/images/mask1.png');
    this.load.image('sac', '/assets/images/sac.png');
    this.load.image('mask', '/assets/images/mask.png');
    this.load.spritesheet('dude', '/assets/images/dude.png',
        { frameWidth: 32, frameHeight: 48 });
}

function create() {

    this.add.image(500, 400, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(700, 810, 'groundBase').setScale(1).refreshBody();
    platforms.create(550, 490, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(50, 500, 'platformAir');
    platforms.create(900, 220, 'ground');
    platforms.create(900, 220, 'ground');
    platforms.create(150, 680, 'mushroomRed');


    player = this.physics.add.sprite(200, 400, 'dude');
    player.setBounce(0.2);
    player.setOrigin(0.5, 1);
    player.setScale(1.5);
    //player.play('idle');

    
    //player.displayOriginX = 0;
    //player.displayOriginY = 0;
    //player.displayWidth = 42;
    //player.displayHeight = 58;
    //player.x = 0;
    //player.y = 0
    player.body.setGravityY(100);

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    cursors = this.input.keyboard.createCursorKeys();

    masks = this.physics.add.group({
        key: 'mask',
        repeat: 11,
        setXY: { x: 20, y: 0, stepX: 80 }
    });

    masks.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));

    });

    //player.health = 20;

    //bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, '♻️ points : 0', { fontSize: '20px', fill: '#14213d' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(masks, platforms);
    this.physics.add.overlap(player, masks, collectmask, null, this);

    this.initialTime = 0;
    timerText = this.add.text(16, 48, '⏳ temps : 0 ', { fontSize: '20px', fill: '#14213d' });
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    //textGameOver = this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
    textGameOver = this.add.text(400, 320, 'Game Over!', { fontSize: '48px', fill: '#14213d' })
    //this.textGameOver.setOrigin(0.5)
    textGameOver.visible = false;

    //textGameOver.setDepth(1);

    winText = this.add.text(400, 320, 'You Win!', { fontSize: '48px', fill: '#14213d' })
    winText.visible = false;
    //winText.setDepth(1);
//  Event handler for when the animation completes on our sprite

this.physics.world.setBounds(0, 0, 4000, 1000);

this.cameras.main.startFollow(player);

this.cameras.main.setBounds(0, 0, 2000, 600);

}

function update() {

    if (gameOver) {
        return "Game Over!";
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}


function collectmask(player, mask) {
    mask.disableBody(true, true);

    score += 10;
    scoreText.setText('♻️ points : ' + score);

    if (score == 120) {
        //this.textGameOver.visible = true;
        //scene.scene.stop();
        winText.visible = true;
        this.scene.pause();

        //scoreText.visible = false;
        //timerText.visible = false;
        //player.setTint(0xff0000);
        //player.anims.play('turn');
        this.gameOver = true;
    }

    if (masks.countActive(true) === 0) {
        masks.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}

function startGame() {
    //introText.visible = false;
    scoreText.visible = true;
    //hitPointsText.visible = true;
    gameStarted = true;
    finishedGame = false;
}

// End the game
function killGame() {
    finishedGame = true;
    //player.setVelocity(0, 0);
    //introText.visible = true;

    //scoreText.visible = false;
    //hitPointsText.visible = false;
}

function onEvent() {

}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var partInSeconds = seconds % 60;
    return `${minutes}:${partInSeconds}`;
}


function onEvent() {
    if (this.initialTime === 0) {
        //timer.paused = false;
        textGameOver.visible = false;
    }

    this.initialTime += 01;
    timerText.setText('⏳ temps ' + formatTime(this.initialTime));

}

