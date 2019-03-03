window.addEventListener("load", () => {

  const h = window.innerHeight * window.devicePixelRatio;
  const w = h * (16 / 9);
  const s = h / 1775;
  const b = 1;

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let player = null;
  let enemies = null;

  function preload() {

    game.load.image('backdrop', 'assets/backgrounds/darkPurple.png');
    game.load.image('player', 'assets/playerShip1_blue.png');
    game.load.image('enemy', 'assets/playerShip1_red.png');
    game.load.image('bullet', 'assets/lasers/laserBlue03.png');
  
  }
  
  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, w * b, h * b, 'backdrop');
    game.world.setBounds(0, 0, w * b, h * b);

    player = new Ship({ player: true });
    enemies = [];
    enemies.group = game.add.group();

    new Ship({ enemy: true });
    
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

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      player.weapon.fire();
    }

    game.world.wrap(player.sprite, 0, true);
    player.sprite.healthBar.setPosition(player.sprite.x, player.sprite.y + 60);
    player.weapon.fireAngle = player.sprite.angle - 90;

    enemies.forEach(enemy => {
      game.world.wrap(enemy.sprite, 0, true);
      enemy.sprite.healthBar.setPosition(enemy.sprite.x, enemy.sprite.y + 60);
    });

    // game.physics.arcade.overlap(player.sprite, enemies.group, () => "overlap");
    game.physics.arcade.overlap(player.weapon.bullets, enemies.group, (bullet, enemy) => {
      bullet.kill();
      enemy.health -= 10;
      enemy.healthBar.setPercent(enemy.health / enemy.maxHealth * 100);
      if (enemy.health <= 0) {
        enemy.healthBar.kill();
        enemy.kill();
      }
    });

  }


  class Ship {

    constructor({ player, enemy }) {
      if (player) {
        this.sprite = game.add.sprite(0, 0, 'player');
        game.camera.follow(this.sprite);
      } else if (enemy) {
        this.sprite = game.add.sprite(0, 0, 'enemy');
        enemies.group.add(this.sprite);
      }
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(s, s);
      this.sprite.x = w * b * Math.random();
      this.sprite.y = h * b * Math.random();
      this.sprite.health = 100;
      this.sprite.maxHealth = 100;
      this.sprite.healthBar = new HealthBar(game, { x: this.sprite.x, y: this.sprite.y + 60, width: 85, height: 8, bg: { color: '#fff' }, bar: { color: '#2ecc71' } });
      this.speed = 625;
      this.weapon = game.add.weapon(30, 'bullet');
      this.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
      this.weapon.bulletLifespan = 750;
      this.weapon.bulletAngleOffset = 90;
      this.weapon.bulletSpeed = 1000;
      this.weapon.bulletWorldWrap = true;
      this.weapon.trackSprite(this.sprite, 0, 0);
      game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
  }

});