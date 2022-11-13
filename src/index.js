import Phaser from 'phaser';

import './assets/style.css';
import config from './Config/config';
import Model from './Model';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import GameScene from './Scenes/GameScene';
import gameOverScene from './Scenes/gameOverScene';
import ScoreBoardScene from './Scenes/ScoreBoardScene';
import ScaryScene from './Scenes/scaryScene'

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null, scaryMusic: null};
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('GameOver', gameOverScene);
    this.scene.add('ScoreBoard', ScoreBoardScene);
    this.scene.add('ScaryScene', ScaryScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();
