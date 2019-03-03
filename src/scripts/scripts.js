const h = window.innerHeight * window.devicePixelRatio;
const w = h * (16 / 9);
const s = h / 1775;


window.addEventListener("load", () => {

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let ship = null;

  function preload() {

    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.image('ship', 'assets/ship.png');
  
  }
  
  function create() {

    const b = 9;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, w * b, h * b, 'backdrop');
    game.world.setBounds(0, 0, w * b, h * b);

    ship = game.add.sprite(0, 0, 'ship');
    ship.anchor.setTo(0.5, 0.5);
    ship.scale.set(s, s);
    ship.x = w * b * 0.5;
    ship.y = h * b * 0.5;
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    game.camera.follow(ship);
    
  }
  
  function update () {

    const speed = 800;

    ship.body.velocity.x = 0;
    ship.body.velocity.y = 0;
    ship.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      ship.body.angularVelocity = -400;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      ship.body.angularVelocity = 400;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      game.physics.arcade.velocityFromAngle(ship.angle - 90, speed, ship.body.velocity);
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      game.physics.arcade.velocityFromAngle(ship.angle - 90, -speed, ship.body.velocity);
    }

    game.world.wrap(ship, 0, true);

  }

});