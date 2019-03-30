class Loading extends Phaser.State {

  init(map) { this.map = map }

  create() {

    this.game.load.onLoadStart.add(() => {});
    this.game.load.onFileComplete.add(() => {});
    this.game.load.onLoadComplete.add(() => {
      this.game.state.start("Playing", true, false, this.map);
    });

    this.game.load.image('backdrop', 'assets/backgrounds/darkPurple.png');
    this.game.load.image('player', 'assets/playerShip1_blue.png');
    this.game.load.image('enemy', 'assets/playerShip1_red.png');
    this.game.load.image('player_bullet', 'assets/lasers/laserBlue03.png');
    this.game.load.image('enemy_bullet', 'assets/lasers/laserRed03.png');

    this.game.load.start();

  }

}