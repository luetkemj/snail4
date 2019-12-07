import ECS from "../ECS";
import { sample } from "lodash";
import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../cache";
import { CARDINAL, getNeighbors } from "../../lib/grid";
import { dijkstra } from "../../lib/dijkstra";

const drunkenWalk = () => {
  return sample(CARDINAL);
};

const walkDijkstra = (entity, dMapName) => {
  const { position } = entity.components;
  const neighbors = getNeighbors(position.x, position.y);

  let score = 1000000;
  let nextPosition = {};
  neighbors.forEach(n => {
    const eId = ECS.cache.tileLocations[`${n.x},${n.y}`];
    if (ECS.entities[eId].components.dijkstra[dMapName] < score) {
      score = ECS.entities[eId].components.dijkstra[dMapName];
      nextPosition = n;
    }
  });
  return nextPosition;
};

const attemptMove = (entity, x, y) => {
  const {
    components: { position }
  } = entity;

  const {
    game: {
      grid: { width, height }
    }
  } = ECS;

  // observe map boundaries
  const mx = Math.min(width - 1, Math.max(0, x));
  const my = Math.min(height - 1, Math.max(0, y));

  // check for blocking entities in taget location
  const entitiesAtGoalIds = readCacheEntitiesAtLocation({ x: mx, y: my });
  const blockers = entitiesAtGoalIds.filter(
    id => ECS.entities[id].components.blocking
  );

  blockers.forEach(id => ECS.entities[id].print());
  // set blocking entity as target
  if (blockers.length) {
    blockers.forEach(id => entity.addComponent("target", { id }));
    return false;
  }
  removeCacheEntityAtLocation(entity.id, { x: position.x, y: position.y });
  setCacheEntityAtLocation(entity.id, { x: mx, y: my });

  position.x = mx;
  position.y = my;

  return { x: mx, y: my };
};

const move = entities => {
  ECS.cache.movable.forEach(key => {
    const {
      components: { brain, position, playerControlled }
    } = entities[key];

    if (ECS.game.playerTurn && position && playerControlled) {
      if (ECS.game.userInput && ECS.game.userInput.type === "MOVE") {
        const { x, y } = ECS.game.userInput.payload;

        const mx = entities[key].components.position.x + x;
        const my = entities[key].components.position.y + y;

        const didMove = attemptMove(entities[key], mx, my);
        if (didMove) {
          // build dijkstra Maps
          const playerDijkstra = dijkstra([{ x: didMove.x, y: didMove.y }]);
          Object.keys(playerDijkstra).forEach(loc => {
            const eId = ECS.cache.tileLocations[loc];
            ECS.entities[eId].components.dijkstra.player = playerDijkstra[loc];
          });
        }
      }
    }

    if (!ECS.game.playerTurn && position && brain) {
      const { x, y } = walkDijkstra(entities[key], "player");
      attemptMove(entities[key], x, y);
    }
  });
};

export default move;
