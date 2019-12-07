import ECS from "../ECS/ECS";
import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";

import { CARDINAL, getNeighbors } from "./grid";

export const bump = (entity, targetId) => {
  console.log(
    `${entity.components.labels.name} bumps into ${ECS.entities[targetId].components.labels.name}`
  );
};

export const attack = (entity, targetId) => {
  const targetEntity = ECS.entities[targetId];

  targetEntity.components.health.health -= 5;

  if (targetEntity.components.health.health <= 0) {
    console.log(`${targetEntity.components.labels.name} is dead.`);
    targetEntity.components.appearance.char = "%";
    targetEntity.removeComponent("moveToPlayer");
    targetEntity.removeComponent("playerControlled");
    targetEntity.removeComponent("blocking");
  }
};

export const drunkenWalk = () => {
  return sample(CARDINAL);
};

export const walkDijkstra = (entity, dMapName) => {
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

export const attemptMove = (entity, x, y) => {
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
