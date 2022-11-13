import Phaser from 'phaser';
import * as board from '../js/leaderboard';

export default class ScaryScene extends Phaser.Scene {
  constructor() {
    super('ScaryScene');
  }

  preload() {
    
  }

  create() {
    const { width,height} = this.scale;
    let bg = this.add.image(0,0, 'scaryPicture')
    this.cameras.resize(window.innerWidth,window.innerHeight)
    bg.x = game.config.width/2
    bg.y = game.config.height/2
    bg.setScale(Math.max(window.innerWidth/ bg.width, window.innerHeight / bg.height))
    let audio = this.sound.add('scaryMusic', {volume: 1,loop: true})
    audio.play()
  }
}