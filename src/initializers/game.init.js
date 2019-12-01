import ECS from "../ECS/ECS";
import { setCacheEntityAtLocation, setCacheId } from "../ECS/cache";

import { generateDungeon } from "../lib/dungeon";
import { colors, chars } from "../lib/graphics";

const initGame = () => {
  // create dungeon level
  const dungeon = generateDungeon({
    x: 0,
    y: 0,
    width: ECS.game.grid.width,
    height: ECS.game.grid.height,
    maxRoomCount: 30,
    minRoomSize: 6,
    maxRoomSize: 12
  });

  Object.keys(dungeon.tiles).forEach(tileId => {
    const entity = ECS.Entity();
    const currTile = dungeon.tiles[tileId];
    let char;
    let color;
    if (currTile.sprite === "FLOOR") {
      char = chars.floor;
      color = colors.floor;
    }
    if (currTile.sprite === "WALL") {
      char = chars.wall;
      color = colors.wall;
    }
    if (currTile.sprite === "CAVERN_FLOOR") {
      char = chars.cavernFloor;
      color = colors.cavernFloor;
    }
    entity.addComponent(ECS.components.appearance({ char, color }));
    entity.addComponent(ECS.components.fov());
    entity.addComponent(
      ECS.components.position({ x: currTile.x, y: currTile.y })
    );

    if (currTile.blocking) {
      entity.addComponent(ECS.components.blocking());
    }

    if (currTile.opaque) {
      entity.addComponent(ECS.components.opaque());
    }

    ECS.entities[entity.id] = entity;
    // add to cache
    setCacheEntityAtLocation(entity);
  });

  // Create player
  const player = ECS.Entity();
  player.addComponent(
    ECS.components.appearance({ char: chars.player, color: colors.player })
  );
  player.addComponent(ECS.components.playerControlled());
  player.addComponent(
    ECS.components.position({ x: dungeon.start.x, y: dungeon.start.y })
  );
  player.addComponent(ECS.components.fov({ inFov: true }));
  ECS.entities[player.id] = player;
  setCacheId(player.id, "movable");
  setCacheId(player.id, "player");
};

export default initGame;
