
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#fff',
    //width: 1280,
    //height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scale: {
        // Fit to window
        //mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        //autoCenter: Phaser.Scale.CENTER_BOTH
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
var gameOver = false;
var scoreText;
var timerText;
var winText;
var timedEvent;
var textGameOver;
var timedEvent;



function preload() {
    this.load.image('sky', '/assets/images/sky.png');
    this.load.image('ground', '/assets/images/platform.png');
    this.load.image('mask', '/assets/images/mask.png');
    this.load.spritesheet('dude', '/assets/images/dude.png',
        { frameWidth: 32, frameHeight: 48 });
}

function create() {

    this.add.image(500, 400, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(100, 700, 'ground').setScale(1).refreshBody();
    platforms.create(700, 700, 'ground').setScale(1).refreshBody();
    platforms.create(220, 700, 'ground').setScale(1).refreshBody();
    platforms.create(760, 700, 'ground').setScale(1).refreshBody();


    platforms.create(550, 490, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(900, 220, 'ground');

    player = this.physics.add.sprite(200, 400, 'dude');
    player.setBounce(0.2);
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

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, '♻️ points : 0', { fontSize: '20px', fill: '#14213d' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(masks, platforms);
    this.physics.add.overlap(player, masks, collectmask, null, this);

    this.initialTime = 5;
    timerText = this.add.text(16, 48, '⏳ temps : 0 ', { fontSize: '20px', fill: '#14213d' });
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    textGameOver = this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
    textGameOver.setDepth(1);

    winText = this.add.text(game.config.width / 2, game.config.height / 2, 'You Win!', { fontSize: '32px', fill: '#fff' });
    winText.setDepth(1);

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

    //timerText.setText('⏳ temps : ' + timedEvent.getProgress().toString().substr(2, 2));

    if (score == 20) {
        winText.Text.visible = true;
        scoreText.Text.visible = false;
        timerText.Text.visible = false;
        textGameOver.Text.visible = false;
    }

}


function collectmask(player, mask) {
    mask.disableBody(true, true);

    score += 10;
    scoreText.setText('♻️ points : ' + score);

    if (masks.countActive(true) === 0) {
        masks.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
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
        return "Game Over";
    }

    this.initialTime -= 1;
    timerText.setText('⏳ temps ' + formatTime(this.initialTime));


}

