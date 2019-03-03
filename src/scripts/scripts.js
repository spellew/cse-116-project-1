window.addEventListener("load", () => {

  const h = window.innerHeight * window.devicePixelRatio;
  const w = h * (16 / 9);
  const s = h / 1775;
  const b = 1;

  const game = new Phaser.Game(w, h, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });
  let player = null;
  let enemy = null;
  let enemies = null;

  function preload() {

    game.load.image('backdrop', 'assets/backgrounds/darkPurple.png');
    game.load.image('player', 'assets/playerShip1_blue.png');
    game.load.image('enemy', 'assets/playerShip1_red.png');
    game.load.image('player_bullet', 'assets/lasers/laserBlue03.png');
    game.load.image('enemy_bullet', 'assets/lasers/laserRed03.png');
  
  }
  
  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, w * b, h * b, 'backdrop');
    game.world.setBounds(0, 0, w * b, h * b);

    player = new Player();
    enemies = [];
    enemies.group = game.add.group();

    enemy = new Enemy();
    
  }
  
  function update () {

    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;
    player.sprite.body.angularVelocity = 0;

    enemy.sprite.body.velocity.x = 0;
    enemy.sprite.body.velocity.y = 0;
    enemy.sprite.body.angularVelocity = 0;

    if (player.sprite.alive) {

      if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        player.sprite.body.angularVelocity = -400;
      } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        player.sprite.body.angularVelocity = 400;
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        game.physics.arcade.velocityFromAngle(player.sprite.angle - 90, player.sprite.speed, player.sprite.body.velocity);
      } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        game.physics.arcade.velocityFromAngle(player.sprite.angle - 90, -player.sprite.speed, player.sprite.body.velocity);
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.ALT)) {
        player.sprite.weapon.fire();
      }

    }

    if (enemy.sprite.alive) {

      if (game.input.keyboard.isDown(Phaser.Keyboard.J)) {
        enemy.sprite.body.angularVelocity = -400;
      } else if (game.input.keyboard.isDown(Phaser.Keyboard.L)) {
        enemy.sprite.body.angularVelocity = 400;
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.I)) {
        game.physics.arcade.velocityFromAngle(enemy.sprite.angle - 90, enemy.sprite.speed, enemy.sprite.body.velocity);
      } else if (game.input.keyboard.isDown(Phaser.Keyboard.K)) {
        game.physics.arcade.velocityFromAngle(enemy.sprite.angle - 90, -enemy.sprite.speed, enemy.sprite.body.velocity);
      }

      if (game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
        enemy.sprite.weapon.fire();
      }

    }

    game.world.wrap(player.sprite, 0, true);
    player.sprite.healthBar.setPosition(player.sprite.x, player.sprite.y + 60);
    player.sprite.weapon.fireAngle = player.sprite.angle - 90;

    game.physics.arcade.overlap(player.sprite.weapon.bullets, enemies.group, (bullet, enemy) => {
      bullet.kill();
      enemy.health -= 10;
      enemy.healthBar.setPercent(enemy.health / enemy.maxHealth * 100);
      if (enemy.health <= 0) {
        enemy.weapon.bullets.killAll();
        enemy.healthBar.kill();
        enemy.kill();
      }
    });

    enemies.group.forEach(enemy => {
      game.world.wrap(enemy, 0, true);
      enemy.healthBar.setPosition(enemy.x, enemy.y + 60);
      enemy.weapon.fireAngle = enemy.angle - 90;
      game.physics.arcade.overlap(enemy.weapon.bullets, player.sprite, (player, bullet) => {
        bullet.kill();
        player.health -= 10;
        player.healthBar.setPercent(player.health / player.maxHealth * 100);
        if (player.health <= 0) {
          player.weapon.bullets.killAll();
          player.healthBar.kill();
          player.kill();
        }
      });
    });

    // game.physics.arcade.overlap(player.sprite, enemies.group, () => "overlap");

  }


  class Ship {

    constructor({ sprite, weapon }) {
      this.sprite = sprite;
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(s, s);
      this.sprite.x = w * b * Math.random();
      this.sprite.y = h * b * Math.random();
      this.sprite.health = 100;
      this.sprite.maxHealth = 100;
      this.sprite.healthBar = new HealthBar(game, { x: this.sprite.x, y: this.sprite.y + 60, width: 85, height: 8, bg: { color: '#fff' }, bar: { color: '#2ecc71' } });
      this.sprite.speed = 625;
      this.sprite.weapon = weapon;
      this.sprite.weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
      this.sprite.weapon.bulletLifespan = 750;
      this.sprite.weapon.bulletAngleOffset = 90;
      this.sprite.weapon.bulletSpeed = 1000;
      this.sprite.weapon.bulletWorldWrap = true;
      this.sprite.weapon.trackSprite(this.sprite, 0, 0);
      game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    }
    
  }

  class Player extends Ship {

    constructor() {
      super({
        sprite: game.add.sprite(0, 0, 'player'),
        weapon: game.add.weapon(30, 'player_bullet')
      });
      game.camera.follow(this.sprite);
    }

  }

  class Enemy extends Ship {

    constructor() {
      super({
        sprite: game.add.sprite(0, 0, 'enemy'),
        weapon: game.add.weapon(30, 'enemy_bullet')
      });
      enemies.group.add(this.sprite);
    }

  }

});