const h = window.innerHeight * window.devicePixelRatio;
const w = h * (16 / 9);
const s = h / 1850;


window.addEventListener("load", () => {

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let manager = null;
  let ship = null;

  function preload() {

    game.load.image('backdrop', 'assets/backdrop.png');
    game.load.image('ship', 'assets/ship.png');
  
  }
  
  function create() {

    const b = 9;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    manager = nipplejs.create({
      zone: document.body,
      color: 'white'
    });

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

    const speed = 85;

    manager.on('move', function (evt, data) {
  
      ship.angle = -(data.angle.degree - 90);
      game.physics.arcade.velocityFromAngle(-data.angle.degree, speed * data.force, ship.body.velocity);

    });

    manager.on('end', function (evt, data) {

      ship.body.velocity.x = 0;
      ship.body.velocity.y = 0;

    });

    game.world.wrap(ship, 0, true);

  }

});