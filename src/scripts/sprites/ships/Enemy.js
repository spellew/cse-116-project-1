class Enemy extends Ship {

  constructor({ game, map }) {
    super({
      game,
      meta: map.meta,
      sprite: game.add.sprite(0, 0, 'enemy'),
      weapon: game.add.weapon(30, 'enemy_bullet')
    });
    map.enemies.group.add(this.sprite);
  }

}