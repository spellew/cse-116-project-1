window.addEventListener("load", () => {

  const height = window.innerHeight * window.devicePixelRatio;
  const width = height * (16 / 9);
  const scale = height / 1775;
  const bounds = 1;

  const map = {
    player: null,
    enemy: null,
    enemies: null,
    meta: { width: width, height: height, bounds: bounds, scale: scale }
  }
  
  class Game extends Phaser.Game {

    constructor() {

      super({
        width,
        height,
        renderer: Phaser.AUTO,
        transparent: true,
      });
    
      this.state.add("Boot", Boot);
      this.state.add("Menu", Menu);
      this.state.add("Loading", Loading);
      this.state.add("Playing", Playing);
      this.state.add("GameOver", GameOver);
      this.state.start("Boot", true, false, map);
      
    }
  
  }

  new Game();
  
});