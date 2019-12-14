import { random, sample, times } from "lodash";
import ECS from "../ECS/ECS";
import {
  setCacheEntityAtLocation,
  setCacheId,
  setCacheTileLocations
} from "../ECS/cache";

import createPlayer from "../ECS/assemblages/player.assemblage";
import createGoblin from "../ECS/assemblages/goblin.assemblage";
import createRat from "../ECS/assemblages/rat.assemblage";

import { generateDungeon } from "../lib/dungeon";
import { dijkstra } from "../lib/dijkstra";
import { colors, chars } from "../lib/graphics";

const initGame = () => {
  // create dungeon level
  const dungeon = generateDungeon({
    x: ECS.game.grid.map.x,
    y: ECS.game.grid.map.y,
    width: ECS.game.grid.map.width,
    height: ECS.game.grid.map.height,
    maxRoomCount: 30,
    minRoomSize: 6,
    maxRoomSize: 12
  });

  Object.keys(dungeon.tiles).forEach(tileId => {
    const entity = ECS.Entity();
    const currTile = dungeon.tiles[tileId];
    let char;
    let color;

    entity.addComponent("trackableLoc");

    if (currTile.sprite === "WALL") {
      char = chars.wall;
      color = colors.wall;
      entity.addComponent("labels", { name: "wall" });
      entity.removeComponent("trackableLoc");
    }
    if (currTile.sprite === "FLOOR") {
      char = chars.floor;
      color = colors.floor;
      entity.addComponent("labels", { name: "floor" });
    }
    if (currTile.sprite === "CAVERN_FLOOR") {
      char = chars.cavernFloor;
      color = colors.cavernFloor;
      entity.addComponent("labels", { name: "cavern floor" });
    }
    entity.addComponent("appearance", { char, color });
    entity.addComponent("fov", { showIfRevealed: true });
    entity.addComponent("position", { x: currTile.x, y: currTile.y });
    entity.addComponent("dijkstra");

    if (currTile.blocking) {
      entity.addComponent("blocking");
    }

    if (currTile.opaque) {
      entity.addComponent("opaque");
    }

    ECS.entities[entity.id] = entity;
    // add to cache
    setCacheTileLocations(entity.id, entity.components.position);
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

  // build dijkstra Maps
  const playerDijkstra = dijkstra([{ x: dungeon.start.x, y: dungeon.start.y }]);
  Object.keys(playerDijkstra).forEach(loc => {
    const eId = ECS.cache.tileLocations[loc];
    ECS.entities[eId].components.dijkstra.player = playerDijkstra[loc];
  });
};

export default initGame;
