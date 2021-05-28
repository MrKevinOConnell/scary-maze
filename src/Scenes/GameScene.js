import Phaser from 'phaser';
import gameOptions from '../Config/gameOptions';
import helpers from '../helpers';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.gameOptions = gameOptions;
  }

  create() {
    this.secondsElapsed = 0;
    this.secondsRemaining = 60;
    this.score = 0;
    this.playerJumps = this.gameOptions.jumps;
    this.coinGroup = this.add.group();
    this.collectedCoinGroup = this.add.group();
    this.physics.resume();
    this.anims.resumeAll();
    this.events.once('gameOver', () => {
      this.gameOver();
    });

    this.sky = this.add.tileSprite(400, 150, null, null, 'sky').setScale(2);

    this.timeDisplay = this.add.text(70, 20, `${this.secondsRemaining}`, {
      color: 'rgb(0, 255, 0)',
      fontSize: '44px',
      fontWeight: 'bold',
      border: '1px solid grey',
      background: 'rgba(200, 200, 200, 0.8)',
    });

    this.timeIcon = this.add.sprite(
      this.timeDisplay.x - 30,
      this.timeDisplay.y + 20,
      'stopwatch',
    ).setDisplaySize(40, 40).setTintFill(0x999999);

    this.goldDisplay = this.add.text(70, 67, `${this.score}`, {
      color: 'gold',
      fontSize: '50px',
      fontWeight: 'bold',
    });

    this.goldIcon = this.add.sprite(40, 90, 'coin').setDisplaySize(50, 50);

    this.mountains = this.add
      .tileSprite(400, 250, null, null, 'mountain')
      .setTilePosition(200, 128)
      .setScale(1.2);

      this.distantPines = this.add
      .tileSprite(400, 325, 800, null, 'pines')
      .setTilePosition(200, 0)
      .setScale(1.2);

      this.pines = this.add
      .tileSprite(400, 410, 800, null, 'distantPines')
      .setTilePosition(200, 200)
      .setScale(1.2);

    this.ground = this.add.tileSprite(
      this.game.config.width / 2,
      this.game.config.height - 40,
      this.game.config.width,
      80,
      'ground',
    );

    this.grass = this.add
      .tileSprite(
        this.game.config.width / 2,
        this.game.config.height - 70,
        this.game.config.width,
        30,
        'grass',
      )
      .setTileScale(3.5, 4);

    this.grass = this.physics.add.existing(this.grass, true);

    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });
    this.addPlatform(150, this.game.config.width + 150);

    this.player = this.physics.add
      .sprite(
        this.gameOptions.playerStartPosition,
        this.grass.y - 200,
        'player',
      )
      .setScale(2);

      this.player.setGravityY(this.gameOptions.playerGravity);
    this.player.setBodySize(6, 36);
    this.player.jumping = false;

    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers('player', { start: 9, end: 13 }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'jumping',
      frames: this.anims.generateFrameNumbers('player', { start: 15, end: 22 }),
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: 'revolving coin',
      frames: this.anims.generateFrameNumbers('coin'),
      frameRate: 20,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platformGroup, () => {
      if (this.player.body.touching.down) {
        this.player.jumping = false;
        this.playerJumps = 3;
      }
    });

    this.physics.add.collider(this.player, this.grass, () => {
      if (this.player.body.touching.down) {
        this.player.jumping = false;
        this.playerJumps = 3;
      }
    });

    this.input.keyboard.on('keydown-SPACE', this.jump, this);

    this.time.addEvent({
      startAt: 0,
      delay: 1000,
      loop: true,
      callback: () => {
        this.secondsElapsed += 1;
        this.secondsRemaining -= 1;
      },
    });
  }

  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.setPosition(posX, this.nextPlatformHeight);
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      this.nextPlatformHeight = helpers.calculateNextPlatformHeight(
        platform,
        this.player,
        this.game,
      );
    } else {
      platform = this.physics.add.sprite(
        posX,
        this.nextPlatformHeight,
        helpers.getPlatformImage(platformWidth),
      );

      platform.setDisplaySize(platformWidth, 25);
      platform.setImmovable(true);
      platform.setVelocityX(this.gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
      this.nextPlatformHeight = helpers.calculateNextPlatformHeight(platform);
    }

    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      this.gameOptions.spawnRange[0],
      this.gameOptions.spawnRange[1],
    );

    if (this.platformGroup.getChildren().length > 1) {
      this.addCoin(platform);
    }
  }

  addCoin(platform) {
    const topQuarter = this.game.config.height / 4;
    const topHalf = topQuarter * 2;

    if (platform) {
      if (platform.y < topQuarter) {
        platform.numberOfCoins = Phaser.Math.Between(3, 4);
      } else if (platform.y < topHalf) {
        platform.numberOfCoins = Phaser.Math.Between(2, 3);
      } else {
        platform.numberOfCoins = 1;
      }
    }

    const leftmostPoint = platform.x - platform.displayWidth / 2;
    const rightmostPoint = platform.x + platform.displayWidth / 2;

    for (let i = 0; i < platform.numberOfCoins; i += 1) {
      const coinPosition = Phaser.Math.FloatBetween(
        leftmostPoint,
        rightmostPoint,
      );
      const coin = this.physics.add
        .sprite(coinPosition, platform.y - platform.displayHeight * 2, 'coin')
        .setScale(2)
        .setGravityY(1000)
        .setVelocityX(this.gameOptions.platformStartSpeed * -1);

      this.physics.add.collider(this.platformGroup, coin, () => coin.setVelocityX(0));

      coin.collectionAnimation = () => {
        const collectedCoin = this.physics.add
          .sprite(coin.x, coin.y - 50, 'coin')
          .setVelocityX(-gameOptions.platformStartSpeed)
          .setVelocityY(-50)
          .setGravityY(49);
        this.collectedCoinGroup.add(collectedCoin);
        setTimeout(() => {
          this.collectedCoinGroup.killAndHide(collectedCoin);
          this.collectedCoinGroup.remove(collectedCoin);
        }, 400);
      };

      if (this.player) {
        this.physics.add.overlap(this.player, coin, () => {
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
          this.collectCoin(coin);
          coin.collectionAnimation();
          this.sound.play('coin1', { volume: 0.5, detune: 0.5, rate: 1.3 });
        });
      }

      this.coinGroup.add(coin);
    }
  }

  jump() {
    if (this.playerJumps > 0) {
      this.player.jumping = true;
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps -= 1;
      this.player.anims.play('jumping', false);
      helpers.playJumpSound(this);
    }
  }

  collectCoin(coin) {
    coin.disableBody(true, true);
    this.score += 1;
  }

  update() {
    if (this.secondsRemaining >= 0) {
      this.player.x = this.gameOptions.playerStartPosition;

      let minDistance = this.game.config.width;
      this.platformGroup.getChildren().forEach(platform => {
        const platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
        minDistance = Math.min(minDistance, platformDistance);
        if (platform.x < -platform.displayWidth / 2) {
          this.platformGroup.killAndHide(platform);
          this.platformGroup.remove(platform);
        }
      }, this);

      if (minDistance > this.nextPlatformDistance) {
        const nextPlatformWidth = Phaser.Math.Between(
          this.gameOptions.platformSizeRange[0],
          this.gameOptions.platformSizeRange[1],
        );
        this.addPlatform(
          nextPlatformWidth,
          this.game.config.width + nextPlatformWidth / 2,
        );
      }

      if (this.player.body.touching.down) {
        this.player.anims.play('running', true);
      } else if (!this.player.jumping) {
        this.player.anims.play('jumping', false, 7);
      }

      this.coinGroup.getChildren().forEach(coin => {
        if (coin.x + coin.width / 2 < 0) {
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
        } else {
          coin.anims.play('revolving coin', true);
        }
      });

      this.collectedCoinGroup.getChildren().forEach(collectedCoin => {
        collectedCoin.anims.play('revolving coin', true);
        collectedCoin.anims.setTimeScale(5);
      });

      this.moveBackground();
      this.updateDisplays();
    } else {
      this.events.emit('gameOver');
    }
  }

  gameOver() {
    this.physics.pause();
    this.anims.pauseAll();
    helpers.submitScore(localStorage.getItem('username'), this.score);

    this.gameOverDisplay = this.add.text(0, 0, 'Time\'s Up!', {
      fontSize: '64px',
      fill: '#000',
    });