var config = {
    type: Phaser.AUTO,
    backgroundColor: "#333333",
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 300
        },
        debug: false
      }
    },
    //     scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    //   },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  var player;
  var bottles;
  var enemie;
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
  var gameStarted;
  var finishedGame;

  var music;
  var trump;
  var jump;
  var mouve;
  var attrap;
  var winner;

  var game = new Phaser.Game(config);

  function preload() {
    this
      .load
      .audio("music", "assets/sounds/bggame.mp3");
    this
      .load
      .audio("jumping", "assets/sounds/jumpp.mp3");
    this
      .load
      .audio("mouve", "assets/sounds/jump.mp3");
    this
      .load
      .audio("catching", "assets/sounds/tresor.mp3");
    this
      .load
      .audio("win", "assets/sounds/levelWin.mp3");
    this
      .load
      .audio("trump", "assets/sounds/tubaTrump.mp3");

    this
      .load
      .image('sky', 'assets/images/city.png');
    this
      .load
      .image('ground', 'assets/images/platform.png');
    this
      .load
      .image('bottle', 'assets/images/bottle.png');
    this
      .load
      .image('trumpGuy', 'assets/images/trump.png');
    this
      .load
      .image("trashcan", "/assets/images/trashcan.png");
    this
      .load
      .image("win", "/assets/images/win.png");

    this
      .load
      .spritesheet('girl', 'assets/images/girl.png', {
        frameWidth: 72,
        frameHeight: 95
      });
  }

  function create() {

    //son start de jeu
    this.music = this
      .sound
      .add("music");
    var musicConfig = {
      mute: true,
      loop: true,
      volume: 1,
      delay: 2
    };
    this
      .music
      .play(musicConfig);

    this
      .add
      .image(300, 200, 'sky');
    platforms = this
      .physics
      .add
      .staticGroup();
    platforms
      .create(400, 568, 'ground')
      .setScale(2)
      .refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(600, 720, "trashcan");

    // The player
    player = this
      .physics
      .add
      .sprite(100, 450, 'girl');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this
      .anims
      .create({
        key: 'left',
        frames: this
          .anims
          .generateFrameNumbers('girl', {
            bottlet: 0,
            end: 3
          }),
        frameRate: 10,
        repeat: -1
      });

    this
      .anims
      .create({
        key: 'turn',
        frames: [
          {
            key: 'girl',
            frame: 4
          }
        ],
        frameRate: 20
      });

    this
      .anims
      .create({
        key: 'right',
        frames: this
          .anims
          .generateFrameNumbers('girl', {
            bottlet: 5,
            end: 8
          }),
        frameRate: 10,
        repeat: -1
      });

    cursors = this
      .input
      .keyboard
      .createCursorKeys();

    //  Some bottles to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    bottles = this
      .physics
      .add
      .group({
        key: 'bottle',
        repeat: 9,
        setXY: {
          x: 12,
          y: 0,
          stepX: 70
        }
      });

    bottles
      .children
      .iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

    scoreText = this
      .add
      .text(16, 16, "♻️ points : 0", {
        fontSize: "20px",
        fill: "#000"
      });

    enemie = this
      .physics
      .add
      .group();

    this
      .physics
      .add
      .collider(player, platforms);
    this
      .physics
      .add
      .collider(bottles, platforms);
    this
      .physics
      .add
      .collider(enemie, platforms);
    this
      .physics
      .add
      .overlap(player, bottles, collectbottle, null, this);
    this
      .physics
      .add
      .collider(player, enemie, hittrumpGuy, null, this);

    this.initialTime = 0;
    timerText = this
      .add
      .text(16, 48, "⏳ temps : 0 ", {
        fontSize: "20px",
        fill: "#000"
      });
    timedEvent = this
      .time
      .addEvent({delay: 1000, callback: onEvent, callbackScope: this, loop: true});

    textGameOver = this
      .add
      .text(400, 320, "Game Over!", {
        fontSize: "48px",
        fill: "#000"
      });
    textGameOver.visible = false;
    winText = this
      .add
      .image(620, 320, "win");
    winText.visible = false;
  }

  function update() {
    if (gameOver) {
      return;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player
        .anims
        .play('left', true);

      //son pour bouger
      this.mouve = this
        .sound
        .add('mouve');

      var mouveConfig = {
        mute: true,
        loop: false,
        volume: 1,
        delay: 0
      }
      this
        .mouve
        .play(mouveConfig);

    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player
        .anims
        .play('right', true);
    } else {
      player.setVelocityX(0);

      player
        .anims
        .play('turn');
    }

    if (cursors.space.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
      //son pour sauter
      this.jumping = this
        .sound
        .add("jumping");

      var jumpingConfig = {
        mute: true,
        loop: false,
        volume: 1,
        delay: 0
      };
      this
        .jumping
        .play(jumpingConfig);
    }

  }

  function collectbottle(player, bottle) {
    bottle.disableBody(true, true);

    score += 10;
    scoreText.setText("♻️ points : " + score);

    //son pour attraper des objet
    this.attrap = this
      .sound
      .add("catching");
    var attrapConfig = {
      mute: true,
      loop: false,
      volume: 1,
      delay: 0
    };
    this
      .attrap
      .play(attrapConfig);
  }

  if (bottles.countActive(true) === 0) {
    bottles
      .children
      .iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

      });

    var x = (player.x < 400)
      ? Phaser
        .Math
        .Between(400, 800)
      : Phaser
        .Math
        .Between(0, 400);

    var trumpGuy = enemie.create(x, 16, 'trumpGuy');
    trumpGuy.setBounce(1);
    trumpGuy.setCollideWorldBounds(true);
    trumpGuy.setVelocity(Phaser.Math.Between(-200, 200), 20);
    trumpGuy.allowGravity = false;

  }

  function hittrumpGuy(player, trumpGuy) {
    this
      .physics
      .pause();

    player.setTint(0xff0000);

    player
      .anims
      .play('turn');

    gameOver = true;
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
    timerText.setText("⏳ temps " + formatTime(this.initialTime));
  }