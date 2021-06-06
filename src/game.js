
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#333333',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        //parent: 'phaser-example',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

var player;
var masks;
var bags;
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
//var dudito;

/*function gameScene() {
    this.score = 0;
    this.gameOver = false;
}*/

function preload() {
    this.load.image('sky', '/assets/images/city.png');
    this.load.image('groundBase', '/assets/images/platform-base.png');
    this.load.image('ground', '/assets/images/platform.png');
    this.load.image('platformAir', '/assets/images/platform-air.png');
    this.load.image('trashcan', '/assets/images/trashcan.png');
    this.load.image('win', '/assets/images/win.png');
    this.load.image('mask1', '/assets/images/mask1.png');
    this.load.image('bags', '/assets/images/plastic-bag.png');
    this.load.image('mask', '/assets/images/mask.png');
    this.load.spritesheet('dude', '/assets/images/dudek1.png',
        { frameWidth: 72, frameHeight: 95 });
}

function create() {

    this.add.image(500, 400, 'sky');

    platforms = this.physics.add.staticGroup();
    platforms.create(650, 780, 'groundBase').setScale(1).refreshBody();
    platforms.create(550, 490, 'ground');
    platforms.create(50, 250, 'ground');
    //platforms.create(50, 500, 'platformAir');
    //platforms.create(900, 220, 'ground');
    platforms.create(900, 220, 'ground');
    platforms.create(750, 720, 'trashcan');

    player = this.physics.add.sprite(200, 420, 'dude');
    player.setBounce(0.2);
    player.setOrigin(0.5, 1);
    player.setScale(1.3);
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
        repeat: 10,
        setXY: { x: 40, y: 0, stepX: 200 }
    });

    masks.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));

    });

    scoreText = this.add.text(16, 16, '♻️ points : 0', { fontSize: '20px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(masks, platforms);
    this.physics.add.overlap(player, masks, collectmask, null, this);

    this.initialTime = 0;
    timerText = this.add.text(16, 48, '⏳ temps : 0 ', { fontSize: '20px', fill: '#000'  });
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    textGameOver = this.add.text(400, 320, 'Game Over!', { fontSize: '48px', fill: '#000' })
    textGameOver.visible = false;
    
    winText = this.add.image(620, 320, 'win')
    winText.visible = false;
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

    if (score == 100) {
        winText.visible = true;
        this.scene.pause();
        this.gameOver = true;
    }

    if (masks.countActive(true) === 0) {
        masks.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var partInSeconds = seconds % 60;
    return `${minutes}:${partInSeconds}`;
}

function onEvent() {
    if (this.initialTime === 0) {
        textGameOver.visible = false;
    }

    this.initialTime += 01;
    timerText.setText('⏳ temps ' + formatTime(this.initialTime));

}

