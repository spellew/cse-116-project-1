class GameOver extends Phaser.State {

  constructor() {
    super();
    this.playGame = this.playGame.bind(this);
  }

  init(map) { this.map = map }

  create() {

    this.game.add.tileSprite(0, 0, this.map.meta.width * this.map.meta.bounds, this.map.meta.height * this.map.meta.bounds, 'backdrop');
    // this.loadGame();

    this.text = this.game.add.text(this.map.meta.width * 0.5, this.map.meta.height * 0.5, "GAME OVER", {
      // font: "bold 92pt kenvector_future",
      font: "bold 92pt arial",
      fill: "#fff"
    });

    this.text.anchor.setTo(0.5, 0.5);

    this.text.inputEnabled = true;
    this.text.events.onInputDown.add(this.playGame, this);

  }

  update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))) {
      this.playGame()
    }
  }

  playGame() {
    this.game.state.start("Menu", true, false, this.map);
  }

}