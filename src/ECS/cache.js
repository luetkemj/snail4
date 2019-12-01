import { findIndex } from "lodash";

export const cache = {
  entityLocations: {},
  entityIds: [],
  movable: [],
  player: []
};

export const setCacheEntityAtLocation = (entity, position) => {
  let loc;
  if (position) {
    loc = `${position.x},${position.y}`;
  } else {
    loc = `${entity.components.position.x},${entity.components.position.y}`;
  }
  cache.entityLocations[loc] = [] || cache.entityLocations[loc];
  cache.entityLocations[loc].push(entity);
};

export const readCacheEntitiesAtLocation = (position, entity) => {
  let loc;
  if (position) {
    loc = `${position.x},${position.y}`;
  } else {
    loc = `${entity.components.position.x},${entity.components.position.y}`;
  }
  return cache.entityLocations[loc] || [];
};

export const setCacheId = (id, key) => cache[key].push(id);

export const deleteCacheId = (id, key) => {
  const index = findIndex(cache[key], x => x === id);
  cache[key].splice(index, 1);
};
