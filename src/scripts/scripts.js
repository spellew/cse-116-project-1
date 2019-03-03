window.addEventListener("load", () => {

  const h = window.innerHeight * window.devicePixelRatio;
  const w = h * (16 / 9);
  const s = h / 1775;
  const b = 2;

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let player = null;
  let enemies = null;

  function preload() {

    game.load.image('backdrop', 'assets/backgrounds/darkPurple.png');
    game.load.image('player', 'assets/playerShip1_blue.png');
    game.load.image('enemy', 'assets/playerShip1_red.png');
  
  }
  
  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, w * b, h * b, 'backdrop');
    game.world.setBounds(0, 0, w * b, h * b);

    player = new Ship({ player: true });
    enemies = game.add.group();
    
  }
  
  function update () {

    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;
    player.sprite.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      player.sprite.body.angularVelocity = -400;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      player.sprite.body.angularVelocity = 400;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      game.physics.arcade.velocityFromAngle(player.sprite.angle - 90, player.speed, player.sprite.body.velocity);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      game.physics.arcade.velocityFromAngle(player.sprite.angle - 90, -player.speed, player.sprite.body.velocity);
    }

    game.world.wrap(player.sprite, 0, true);
    enemies.children.forEach(enemy => game.world.wrap(enemy, 0, true));

    // game.physics.arcade.collide(player.sprite, enemies, () => "overlap");

  }


  class Ship {

    constructor({ player, enemy }) {
      if (player) {
        this.sprite = game.add.sprite(0, 0, 'player');
        game.camera.follow(this.sprite);
      } else if (enemy) {
        this.sprite = game.add.sprite(0, 0, 'enemy');
        enemies.add(this.sprite);
      }
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(s, s);
      this.sprite.x = w * b * Math.random();
      this.sprite.y = h * b * Math.random();
      this.health = 100;
      this.speed = 600;
      game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
  }

});