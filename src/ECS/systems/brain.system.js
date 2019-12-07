import ECS from "../ECS";
import { attemptMove, walkDijkstra } from "../../lib/movement";
import { dijkstra } from "../../lib/dijkstra";

import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../cache";

const brainSystem = entities => {
  ECS.cache.movable.forEach(key => {
    const entity = entities[key];

    const {
      components: { brain, moveToPlayer, position, playerControlled }
    } = entity;

    // process player input
    if (ECS.game.playerTurn) {
      if (position && playerControlled) {
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
      if (moveToPlayer) {
        const entityIds = readCacheEntitiesAtLocation(
          entity.components.position
        );
        const tileId = entityIds.filter(
          eid => entities[eid].components.dijkstra
        );
        const distanceFromPlayer =
          entities[tileId].components.dijkstra.player || 1000000;

        if (moveToPlayer.aggro > distanceFromPlayer) {
          const { x, y } = walkDijkstra(entities[key], "player");
          attemptMove(entities[key], x, y);
        }
      }
    }
  });
};

export default brainSystem;
