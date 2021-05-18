
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var masks;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;


var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', '/assets/images/sky.png');
    this.load.image('ground', '/assets/images/platform.png');
    this.load.image('mask', '/assets/images/mask.png');
    this.load.spritesheet('dude', '/assets/images/dude.png',
        { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);

    player.body.setGravityY(100)

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

    scoreText = this.add.text(16, 16, '♻️ points : 0', { fontSize: '30px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(masks, platforms);
    this.physics.add.overlap(player, masks, collectmask, null, this);

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
    scoreText.setText('♻️ points: ' + score);

    if (masks.countActive(true) === 0) {
        masks.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    }
}











