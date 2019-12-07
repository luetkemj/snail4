import ECS from "../ECS";
import { attemptMove, bump, walkDijkstra } from "../../lib/movement";
import { dijkstra } from "../../lib/dijkstra";

import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../cache";

const brainSystem = entities => {
  ECS.cache.movable.forEach(key => {
    const entity = entities[key];

    // process player input
    if (ECS.game.playerTurn) {
      if (entity.components.position && entity.components.playerControlled) {
        if (ECS.game.userInput && ECS.game.userInput.type === "MOVE") {
          const { x, y } = ECS.game.userInput.payload;

          const mx = entity.components.position.x + x;
          const my = entity.components.position.y + y;

          const didMove = attemptMove(entity, mx, my);
          if (didMove) {
            // rebuild dijkstra Maps
            const playerDijkstra = dijkstra([{ x: didMove.x, y: didMove.y }]);
            Object.keys(playerDijkstra).forEach(loc => {
              const eId = ECS.cache.tileLocations[loc];
              ECS.entities[eId].components.dijkstra.player =
                playerDijkstra[loc];
            });
          }
        }
      }
    }

    if (!ECS.game.playerTurn) {
      if (entity.components.moveToPlayer) {
        const entityIds = readCacheEntitiesAtLocation(
          entity.components.position
        );
        const tileId = entityIds.filter(
          eid => entities[eid].components.dijkstra
        );
        const distanceFromPlayer =
          entities[tileId].components.dijkstra.player || 1000000;

        if (entity.components.moveToPlayer.aggro > distanceFromPlayer) {
          const { x, y } = walkDijkstra(entities[key], "player");
          attemptMove(entities[key], x, y);
        }
      }

      if (entity.components.target) {
        const targetId = entity.components.target.id;
        // TODO: check that target is a neighbor before bumping
        bump(entity, targetId);
        entity.removeComponent("target");
      }
    }
  });
};

export default brainSystem;
