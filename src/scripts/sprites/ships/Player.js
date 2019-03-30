class Player extends Ship {

  constructor({ game, map }) {
    super({
      game,
      meta: map.meta,
      sprite: game.add.sprite(0, 0, 'player'),
      weapon: game.add.weapon(30, 'player_bullet')
    });
    game.camera.follow(this.sprite);
  }

}