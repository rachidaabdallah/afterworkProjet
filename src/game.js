
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
    this.load.image('brick-1', '/assets/images/platform-1brick.png');
    this.load.image('brick-2', '/assets/images/platform-2brick.png');
    this.load.image('brick-3', '/assets/images/platform-3brick.png');
    this.load.image('trashcan', '/assets/images/trashcan.png');
    this.load.image('obstacle-1', '/assets/images/obstacle-1.png');
    this.load.image('obstacle-2', '/assets/images/obstacle-2.png');
    this.load.image('obstacle-3', '/assets/images/obstacle-3.png');
    this.load.image('obstacle-4', '/assets/images/obstacle-4.png');
    this.load.image('trashcan', '/assets/images/trashcan.png');
    this.load.image('win', '/assets/images/win.png');
    this.load.image('mask', '/assets/images/plastic-bottle.png');
    this.load.spritesheet('girl', '/assets/images/girl.png',
        { frameWidth: 72, frameHeight: 95 });
}

function create() {

    this.add.image(500, 400, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(650, 760, 'groundBase').setScale(1).refreshBody();
    //platforms.create(550, 490, 'ground');
    platforms.create(90, 250, 'ground');
    //platforms.create(50, 500, 'brick-1');
    //platforms.create(900, 220, 'ground');
    platforms.create(1100, 220, 'ground');
    //platforms.create(1250, 180, 'obstacle-2');
    platforms.create(220, 700, 'obstacle-1');
    platforms.create(550, 490, 'brick-2');
    platforms.create(750, 290, 'brick-3');
    //platforms.create(100, 600, 'obstacle-3');
    //platforms.create(50, 499, 'obstacle-4');
    platforms.create(600, 720, 'trashcan');




    player = this.physics.add.sprite(200, 420, 'girl');
    player.setBounce(0.1);
    player.setOrigin(0.5, 1);
    player.setScale(1.3);
    player.body.setGravityY(50);
    player.body.setVelocityY(150);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'girl', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl', { start: 5, end: 8 }),
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
        player.setVelocityY(-280);
    }
}


function collectmask(player, mask) {
    mask.disableBody(true, true);
    score += 10;
    scoreText.setText('♻️ points : ' + score);

    if (score == 70) {
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

