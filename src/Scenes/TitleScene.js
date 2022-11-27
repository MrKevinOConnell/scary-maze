import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';
function openTwitter()
{

    var url = 'https://github.com/udberg/Maze-Runner' 

    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}

function openGithub()
{

    var url = 'https://twitter.com/kw0ETH' 

    var s = window.open(url, '_blank');

    if (s && s.focus)
    {
        s.focus();
    }
    else if (!s)
    {
        window.location.href = url;
    }
}
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

 
  
  create() {
    // Game
    this.gameButton = new Button(
      this,
      config.width / 2,
      config.height / 2 - 100,
      'blueButton1',
      'blueButton2',
      'Play',
      'GameScene',
    );

    // Options
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options',
    );

    // Credits
    this.twitter = this.add.text((game.config.width -175) / 2,
    game.config.height / 2 + 100,'Follow me on Twitter', {
      fontSize: 20,
      fontFamily: 'Arial',
      color: "#add8e6"
    }).setInteractive()

    // Credits
    this.github = this.add.text((config.width - 85)/ 2,
    config.height / 2 + 200,'Based off:', {
      fontSize: 20,
      fontFamily: 'Arial',
      color: "#add8e6"
    }).setInteractive()

  this.twitter.on('pointerup', openTwitter, this);

   this.github.on('pointerup', openGithub, this);
   

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height,
      ),
    );
  }


  centerButtonText(gameText, gameButton) {
    this.Display.Align.In.Center(gameText, gameButton);
  }
  
}
