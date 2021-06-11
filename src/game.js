            window.onload = function () {
                var config = {
                    type: Phaser.AUTO,
                    width: 1000,
                    height: 600,
                    physics: {
                        default: 'arcade',
                        arcade: {
                            gravity: { y: 300 },
                            debug: false
                        }
                    },
                        scale: {
                        mode: Phaser.Scale.FIT,
                        autoCenter: Phaser.Scale.CENTER_BOTH
                    },
                    scene: [selectWorld, niveau1, niveau2, niveau3]
                };

                var game = new Phaser.Game(config);
                game.scene.start("selectWorld");
            }

            // Game
            var door1;
            var trumps;
            var player;
            var bottles;
            var cursors;
            var platforms;
            var score = 0;
            var winText;
            var scoreText;
            var levelText;
            var gameOver = false;

            var music;
            var jump;
            var mouve;
            var attrap;
            var enemie;


            class selectWorld extends Phaser.Scene {

                constructor() {
                    super({ key: 'selectWorld' });
                }

                preload() {
                    this.load.image('endGame', 'assets/images/game-over-trump.png');
                    this.load.image('sky', 'assets/images/city.png');
                    this.load.image('ground', 'assets/images/platform.png');
                    this.load.image('bottle', 'assets/images/bottle.png');
                    this.load.spritesheet('girl', 'assets/images/girl.png', { frameWidth: 72, frameHeight: 95 });
                    this.load.spritesheet('trump', 'assets/images/trump-sprites.png', { frameWidth: 60, frameHeight: 85 });
                    this.load.image('door1', 'assets/images/door1.png');

                    this.load.audio("music", "assets/sounds/bggame.mp3");
                    this.load.audio("jumping", "assets/sounds/jumpp.mp3");
                    this.load.audio("catching", "assets/sounds/tresor.mp3");
                    this.load.audio("openDoor", "assets/sounds/doorsong.mp3");
                    this.load.audio("win", "assets/sounds/levelWin.mp3");
                    this.load.audio("enemie", "assets/sounds/loose.mp3");

                }

                create() {
                    //son start de jeu
                    this.music = this.sound.add("music");
                    var musicConfig = {
                        mute: false,
                        loop: false,
                        volume: 1,
                        delay: 0
                    };
                    this.music.play(musicConfig);

                  
                    this.add.image(450, 223, 'sky');
                    platforms = this.physics.add.staticGroup();
                    platforms.create(500, 600, 'ground').setScale(2).refreshBody();
                    platforms.create(600, 400, 'ground');
                    platforms.create(50, 250, 'ground');
                    platforms.create(875, 220, 'ground');

                    door1 = this.add.sprite(751, 508, 'door1');
                    door1.visible = false;

                    player = this.physics.add.sprite(100, 450, 'girl');
                    player.setBounce(0.2);
                    player.setCollideWorldBounds(true);

                    this.physics.add.collider(player, platforms);

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

                    bottles = this.physics.add.group({
                        key: 'bottle',
                        repeat: 12,
                        setXY: { x: 82, y: 0, stepX: 70 }
                    });

                    bottles.children.iterate(function (child) {

                        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));

                    });

                    trumps = this.physics.add.group();

                    this.physics.add.collider(bottles, platforms);
                    this.physics.add.collider(trumps, platforms);

                    this.physics.add.overlap(player, bottles, collectBottle, null, this);

                    this.physics.add.collider(player, trumps, hitTrump, null, this);

                    scoreText = this.add.text(16, 16, "♻️ points : 0", {
                        fontSize: "20px",
                        fill: "#000"
                      });
                    
                    levelText = this.add.text(16, 56, 'level: 1', { fontSize: '32px', fill: '#000' });
                }

                update() {
                    if (gameOver) {
                        this.add.image(500, 300, 'endGame');
                    
                        //son pour perdre
                        this.enemie = this.sound.add("enemie");
                        var enemieConfig = {
                        mute: false,
                        loop: false,
                        volume: 2,
                        delay: 0
                        };
                        this.enemie.play(enemieConfig);
                        textGameOver.visible = true;
                        this.music.pause();
                        this.scene.pause();

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

                    if (cursors.space.isDown && player.body.touching.down) {
                        player.setVelocityY(-330);

                        //son pour sauter
                        this.jumping = this.sound.add("jumping");

                        var jumpingConfig = {
                            mute: false,
                            loop: false,
                            volume: 1,
                            delay: 0
                        };
                        this.jumping.play(jumpingConfig);
                    }

                    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                        if (checkOverlap(player, door1)) {
                            this.scene.start("niveau1");

                            //son pour la porte
                            this.openDoor = this.sound.add("openDoor");

                            var openDoorConfig = {
                                mute: false,
                                loop: false,
                                volume: 2,
                                delay: 0
                            };
                            this.openDoor.play(openDoorConfig);
                        }
                    }
                }
            }

            class niveau1 extends Phaser.Scene {

                constructor() {
                    super({ key: 'niveau1' });
                }
                
                preload() {
                    this.load.image('endGame', 'assets/images/game-over-trump.png');
                    this.load.image('sky2', 'assets/images/city.png');
                    this.load.image('ground', 'assets/images/platform.png');
                    this.load.image('bottle', 'assets/images/bottle.png');
                    this.load.spritesheet('trump', 'assets/images/trump-sprites.png', { frameWidth: 60, frameHeight: 85 });
                    this.load.spritesheet('girl', 'assets/images/girl.png', { frameWidth: 72, frameHeight: 95 });
                    this.load.image('door1', 'assets/images/door1.png');

                    this.load.audio("win", "assets/sounds/levelWin.mp3");
                    this.load.audio("enemie", "assets/sounds/loose.mp3");
                }

                create() {
                   
                    this.add.image(450, 223, 'sky2');

                    
                    platforms = this.physics.add.staticGroup();

                   
                    platforms.create(500, 600, 'ground').setScale(2).refreshBody();

                    
                    platforms.create(600, 400, 'ground');
                    platforms.create(50, 250, 'ground');
                    platforms.create(875, 220, 'ground');

                    door1 = this.add.sprite(751, 508, 'door1');
                    door1.visible = false;

                    player = this.physics.add.sprite(100, 450, 'girl');

                    player.setBounce(0.2);
                    player.setCollideWorldBounds(true);

                    this.physics.add.collider(player, platforms);

                    cursors = this.input.keyboard.createCursorKeys();

                    bottles = this.physics.add.group({
                        key: 'bottle',
                        repeat: 12,
                        setXY: { x: 82, y: 0, stepX: 70 }
                    });

                    bottles.children.iterate(function (child) {

                        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));

                    });

                    trumps = this.physics.add.group();

                    this.physics.add.collider(bottles, platforms);
                    this.physics.add.collider(trumps, platforms);

                    this.physics.add.overlap(player, bottles, collectBottle, null, this);

                    this.physics.add.collider(player, trumps, hitTrump, null, this);

                    //  The score
                    scoreText = this.add.text(16, 16, "♻️ points : 0", {
                        fontSize: "20px",
                        fill: "#000"
                      });

                    levelText = this.add.text(16, 56, 'level: 2', { fontSize: '22px', fill: '#000' });
                }

                update() {
                    if (gameOver) {
                        this.add.image(500, 300, 'endGame');
                        //son pour enemie trump
                        this.enemie = this.sound.add('enemie');
                        var enemieConfig = {
                            mute: false,
                            loop:false,
                            volume:1,
                            delay:0

                        }
                        this.enemie.play(enemieConfig);
                        textGameOver.visible = true;
                        this.music.pause();
                        this.scen.pause();

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

                    if (cursors.space.isDown && player.body.touching.down) {
                        player.setVelocityY(-330);

                        //son pour sauter
                        this.jumping = this.sound.add("jumping");

                        var jumpingConfig = {
                            mute: false,
                            loop: false,
                            volume: 1,
                            delay: 0
                        };
                        this.jumping.play(jumpingConfig);
                    }

                    if (Phaser.Input.Keyboard.JustDown(cursors.up) && checkOverlap(player, door1)) {
                        this.scene.start("niveau2");

                        //son pour la porte
                        this.openDoor = this.sound.add("openDoor");

                        var openDoorConfig = {
                            mute: false,
                            loop: false,
                            volume: 2,
                            delay: 0
                        };
                        this.openDoor.play(openDoorConfig);
                    }
                }
            }

            class niveau2 extends Phaser.Scene {

                constructor() {
                    super({ key: 'niveau2' });
                }

                preload() {
                    this.load.image('endGame', 'assets/images/game-over-trump.png');
                    this.load.image('sky3', 'assets/images/city.png');
                    this.load.image('ground', 'assets/images/platform.png');
                    this.load.image('bottle', 'assets/images/bottle.png');
                    this.load.spritesheet('trump', 'assets/images/trump-sprites.png', { frameWidth: 60, frameHeight: 85 });
                    this.load.spritesheet('girl', 'assets/images/girl.png', { frameWidth: 72, frameHeight: 95 });
                    this.load.image('door1', 'assets/images/door1.png');

                    this.load.audio("enemie", "assets/sounds/loose.mp3");
                    this.load.audio("win", "assets/sounds/levelWin.mp3");


                }

                create() {
                    this.add.image(450, 223, 'sky3');

                    platforms = this.physics.add.staticGroup();

                    platforms.create(500, 600, 'ground').setScale(2).refreshBody();

                    platforms.create(600, 400, 'ground');
                    platforms.create(50, 250, 'ground');
                    platforms.create(875, 220, 'ground');

                    door1 = this.add.sprite(751, 508, 'door1');
                    door1.visible = false;

                    player = this.physics.add.sprite(100, 450, 'girl');

                    player.setBounce(0.2);
                    player.setCollideWorldBounds(true);

                    this.physics.add.collider(player, platforms);

                    cursors = this.input.keyboard.createCursorKeys();

                    bottles = this.physics.add.group({
                        key: 'bottle',
                        repeat: 12,
                        setXY: { x: 82, y: 0, stepX: 70 }
                    });

                    bottles.children.iterate(function (child) {

                        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));

                    });

                    trumps = this.physics.add.group();

                    this.physics.add.collider(bottles, platforms);
                    this.physics.add.collider(trumps, platforms);

                    this.physics.add.overlap(player, bottles, collectBottle, null, this);

                    this.physics.add.collider(player, trumps, hitTrump, null, this);

                    //  The score
                    score = 0;
                    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

                    // The level
                    levelText = this.add.text(16, 56, 'level: 3', { fontSize: '32px', fill: '#000' });
                }

                update() {
                    if (gameOver) {
                        this.add.image(500, 300, 'endGame');
                        //son pour enemie trump

                         this.enemie = this.sound.add('enemie');
                         var enemieConfig = {
                             mute: false,
                             loop:false,
                             volume:1,
                             delay:0

                         }
                         this.enemie.play(enemieConfig);
                         textGameOver.visible = true;

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

                    if (cursors.space.isDown && player.body.touching.down) {
                        player.setVelocityY(-330);

                        //son pour sauter
                        this.jumping = this.sound.add("jumping");

                        var jumpingConfig = {
                            mute: false,
                            loop: false,
                            volume: 1,
                            delay: 0
                        };
                        this.jumping.play(jumpingConfig);
                    }

                    if (Phaser.Input.Keyboard.JustDown(cursors.up) && checkOverlap(player, door1)) {
                        this.scene.start("niveau3");

                        //son pour la porte
                        this.openDoor = this.sound.add("openDoor");

                        var openDoorConfig = {
                            mute: false,
                            loop: false,
                            volume: 2,
                            delay: 0
                        };
                        this.openDoor.play(openDoorConfig);
                    }
                }
            }

            class niveau3 extends Phaser.Scene {

                constructor() {
                    super({ key: 'niveau3' });
                }

                preload() {
                    this.load.image('sky4', 'assets/images/sky-orange2.png');
                    this.load.image('ground', 'assets/images/platform.png');
                    this.load.spritesheet('girl', 'assets/images/girl.png', { frameWidth: 72, frameHeight: 95 });
                    
                    this.load.audio("enemie", "assets/sounds/loose.mp3");
                    this.load.audio("win", "assets/sounds/levelWin.mp3");
                }

                create() {
                    //son start de jeu
                    this.music = this.sound.add("bggame");
                    var musicConfig = {
                        mute: false,
                        loop: false,
                        volume: 2,
                        delay: 1
                    };
                    this.music.play(musicConfig);

                    this.add.image(450, 307, 'sky4');
                    platforms = this.physics.add.staticGroup();
                    platforms.create(500, 600, 'ground').setScale(2).refreshBody();
                    player = this.physics.add.sprite(100, 450, 'girl');
                    player.setBounce(0.2);
                    player.setCollideWorldBounds(true);

                    this.physics.add.collider(player, platforms);
                    cursors = this.input.keyboard.createCursorKeys();
                    winText = this.add.text(50, 50, 'Félicitations, vous avez sauvé la planète !', { fontSize: '35px', fill: '#000' });
                }

                update() {
                    if (gameOver) {
                        this.add.image(500, 300, 'endGame');

                        //son pour enemie trump
                         this.enemie = this.sound.add('enemie');
                         var enemieConfig = {
                             mute: false,
                             loop:false,
                             volume:1,
                             delay:0

                         }
                         this.enemie.play(enemieConfig);
                        textGameOver.visible = true;
                        this.music.pause();
                        this.scene.pause();

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

                    if (cursors.space.isDown && player.body.touching.down) {
                        player.setVelocityY(-330);
                    }
                }
            }

            function checkOverlap(spriteA, spriteB) {
                var boundsA = spriteA.getBounds();
                var boundsB = spriteB.getBounds();
                var result = Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);
                return (result.width != 0 || result.height != 0)
            }

            function collectBottle(player, bottle) {
                bottle.disableBody(true, true);

                scoreText = this.add.text(16, 16, "♻️ points : 0", {
                    fontSize: "20px",
                    fill: "#000"
                  });
                
                    this.attrap = this.sound.add("catching");
                    var attrapConfig = {
                        mute: false,
                        loop: false,
                        volume: 1,
                        delay: 0
                    };
                    this.attrap.play(attrapConfig);

                if (bottles.countActive(true) === 0) {
                    door1.visible = true;

                    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                    var trump = trumps.create(x, 16, 'trump');
                    trump.setBounce(1);
                    trump.setCollideWorldBounds(true);
                    trump.setVelocity(Phaser.Math.Between(-200, 200), 20);
                    trump.allowGravity = false;
                }
            }

            function hitTrump(player, trump) {
                this.physics.pause();
  
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
                this.add.image(500, 300, 'endGame');
                textGameOver.visible = true;
                this.music.pause();
                this.scene.pause();
            }