import { random, sample, times } from "lodash";
import ECS from "../ECS/ECS";
import { setCacheEntityAtLocation, setCacheId } from "../ECS/cache";

import createPlayer from "../ECS/assemblages/player.assemblage";
import createGoblin from "../ECS/assemblages/goblin.assemblage";
import createRat from "../ECS/assemblages/rat.assemblage";

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
      entity.addComponent("labels", { name: "floor" });
    }
    if (currTile.sprite === "WALL") {
      char = chars.wall;
      color = colors.wall;
      entity.addComponent("labels", { name: "wall" });
    }
    if (currTile.sprite === "CAVERN_FLOOR") {
      char = chars.cavernFloor;
      color = colors.cavernFloor;
      entity.addComponent("labels", { name: "cavern floor" });
    }
    entity.addComponent("appearance", { char, color });
    entity.addComponent("fov");
    entity.addComponent("position", { x: currTile.x, y: currTile.y });

    if (currTile.blocking) {
      entity.addComponent("blocking");
    }

    if (currTile.opaque) {
      entity.addComponent("opaque");
    }

    ECS.entities[entity.id] = entity;
    // add to cache
    setCacheEntityAtLocation(entity.id, entity.components.position);
    if (!currTile.blocking) {
      setCacheId(entity.id, "openTiles");
    }
  });

  // add monsters!
  times(10, () => {
    const id = sample(ECS.cache.openTiles);
    const { position } = ECS.entities[id].components;

    const type = random(0, 1) ? "rat" : "goblin";
    if (type === "rat") createRat(position.x, position.y);
    if (type === "goblin") createGoblin(position.x, position.y);
  });

  // Create player
  createPlayer(dungeon.start.x, dungeon.start.y);
};

export default initGame;