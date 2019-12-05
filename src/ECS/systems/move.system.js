import ECS from "../ECS";
import { some, sample } from "lodash";
import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../cache";
import { CARDINAL } from "../../lib/grid";

const drunkenWalk = () => {
  return sample(CARDINAL);
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
  const mx = Math.min(width - 1, Math.max(0, position.x + x));
  const my = Math.min(height - 1, Math.max(0, position.y + y));

  const entitiesAtGoalIds = readCacheEntitiesAtLocation({ x: mx, y: my });
  const blockers = entitiesAtGoalIds.filter(
    id => ECS.entities[id].components.blocking
  );
  if (blockers.length) {
    blockers.forEach(id => {
      if (entity.components.playerControlled) {
        console.log(
          `There is a ${ECS.entities[id].components.labels.name} there!`
        );
      }
    });
    return;
  }
  removeCacheEntityAtLocation(entity.id, { x: position.x, y: position.y });
  setCacheEntityAtLocation(entity.id, { x: mx, y: my });

  position.x = mx;
  position.y = my;
};

const move = entities => {
  ECS.cache.movable.forEach(key => {
    const {
      components: { brain, position, playerControlled }
    } = entities[key];

    if (ECS.game.playerTurn && position && playerControlled) {
      if (ECS.game.userInput && ECS.game.userInput.type === "MOVE") {
        const { x, y } = ECS.game.userInput.payload;
        attemptMove(entities[key], x, y);
      }
    }

    if (!ECS.game.playerTurn && position && brain) {
      const { x, y } = drunkenWalk();
      attemptMove(entities[key], x, y);
    }
  });
};

export default move;
