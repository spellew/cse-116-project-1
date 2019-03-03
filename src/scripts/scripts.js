window.addEventListener("load", () => {

  const h = window.innerHeight * window.devicePixelRatio;
  const w = h * (16 / 9);
  const s = h / 1775;
  const b = 1;

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let player = null;
  let enemies = null;

  function preload() {

    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.image('ship', 'assets/ship.png');
  
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
      this.sprite = game.add.sprite(0, 0, 'ship');
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(s, s);
      this.sprite.x = w * b * 0.5;
      this.sprite.y = h * b * 0.5;
      this.health = 100;
      this.speed = 600;
      game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
      player ? game.camera.follow(this.sprite) : enemy ? enemies.add(this.sprite) : null;
    }
    
  }

});