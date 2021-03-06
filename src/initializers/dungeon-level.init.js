import { random, sample, times } from "lodash";
import ECS from "../ECS/ECS";
import {
  readCacheKey,
  readCacheKeyAtId,
  setCacheEntityAtLocation,
  setCacheId,
  setCacheTileLocations,
  setCacheAtPath
} from "../ECS/cache";

import { layers } from "../lib/canvas";

import createGoblin from "../ECS/assemblages/creature-goblin.assemblage";
import createRat from "../ECS/assemblages/creature-rat.assemblage";
import createHealthPotion from "../ECS/assemblages/potion-health.assemblage";
import createPoisonPotion from "../ECS/assemblages/potion-poison.assemblage";
import createLeatherArmor from "../ECS/assemblages/armor-leather.assemblage";
import createRandomWeapon from "../ECS/assemblages/weapon-random.assemblage";
import createChest from "../ECS/assemblages/chest.assemblage";
import createCoins from "../ECS/assemblages/coins.assemblage";
import createStairs from "../ECS/assemblages/stairs.assemblage";
import createBandage from "../ECS/assemblages/bandage.assemblage";

import { generateDungeon } from "../lib/dungeon";
import { dijkstra } from "../lib/dijkstra";
import { colors, chars } from "../lib/graphics";
import actions from "../lib/actions";

const initDungeonLevel = () => {
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
      entity.addComponent("description", {
        text: `You see a solid stone wall. Cold and unmoving.`
      });
    }
    if (currTile.sprite === "FLOOR") {
      char = chars.floor;
      color = colors.floor;
      entity.addComponent("labels", { name: "floor" });
      entity.addComponent("description", {
        text: `The flagstone floor is worn with age.`
      });
    }
    if (currTile.sprite === "CAVERN_FLOOR") {
      char = chars.cavernFloor;
      color = colors.cavernFloor;
      entity.addComponent("labels", { name: "cavern floor" });
      entity.addComponent("description", {
        text: `The cavern floor is scarred by unknown tools of some bygone age.`
      });
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
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    const type = random(0, 1) ? "rat" : "goblin";
    if (type === "rat") {
      createRat(position.x, position.y);
    }
    if (type === "goblin") {
      const goblin = createGoblin(position.x, position.y);
      const armor = createLeatherArmor();
      const weapon = createRandomWeapon();

      goblin.components.inventory.items.push(armor.id);
      goblin.components.inventory.items.push(weapon.id);

      actions.wield(goblin, weapon);
      actions.wear(goblin, armor);
    }
  });

  times(5, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    const type = random(0, 1) ? "poison" : "health";
    if (type === "poison") createPoisonPotion(position.x, position.y);
    if (type === "health") createHealthPotion(position.x, position.y);
  });

  // drop armor
  times(2, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    createLeatherArmor(position.x, position.y);
  });

  // drop weapons
  times(2, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    createRandomWeapon(position.x, position.y);
  });

  // drop bandages
  times(3, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;
    createBandage(position.x, position.y);
  });

  // drop chest
  times(2, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    const armor = createLeatherArmor();
    const weapon = createRandomWeapon();
    const bandage = createBandage();
    const chest = createChest();
    chest.components.position = { ...position };
    chest.components.inventory.items.push(armor.id, bandage.id, weapon.id);

    setCacheEntityAtLocation(chest.id, position);
  });

  // drop coins
  times(2, () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;
    createCoins(position.x, position.y);
  });

  // generate stairs location
  const generateOpenLocation = () => {
    const id = sample(readCacheKey("openTiles"));
    const { position } = ECS.entities[id].components;

    return position;
  };

  const buildStairs = () => {
    let stairsUpPosition = generateOpenLocation();
    let stairsDownPosition = generateOpenLocation();

    // make sure stairsUp and stairsDown are in different locations
    while (
      `${stairsUpPosition.x},${stairsUpPosition.y}` ===
      `${stairsDownPosition.x},${stairsDownPosition.y}`
    ) {
      stairsDownPosition = generateOpenLocation();
    }

    createStairs({ direction: "up", position: stairsUpPosition });
    createStairs({ direction: "down", position: stairsDownPosition });

    return {
      stairsUpPosition,
      stairsDownPosition
    };
  };

  const { stairsUpPosition, stairsDownPosition } = buildStairs();

  // build dijkstra Maps
  const playerDijkstra = dijkstra([
    { x: stairsDownPosition.x, y: stairsDownPosition.y }
  ]);
  Object.keys(playerDijkstra).forEach(loc => {
    const eId = readCacheKeyAtId(loc, "tileLocations");
    ECS.entities[eId].components.dijkstra.player = playerDijkstra[loc];
  });

  setCacheAtPath(
    `${ECS.game.depth}.playerSpawnLocs.stairsDown`,
    stairsDownPosition
  );
  setCacheAtPath(
    `${ECS.game.depth}.playerSpawnLocs.stairsUp`,
    stairsUpPosition
  );

  return {
    stairsDownPosition,
    stairsUpPosition
  };
};

export default initDungeonLevel;
