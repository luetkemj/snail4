import { findIndex } from "lodash";

export const cache = {
  entityLocations: {},
  entityIds: [],
  movable: [],
  player: [],
  openTiles: []
};

export const setCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache.entityLocations[loc] = cache.entityLocations[loc] || [];
  cache.entityLocations[loc].push(id);
};

export const readCacheEntitiesAtLocation = position => {
  const loc = `${position.x},${position.y}`;
  return cache.entityLocations[loc] || [];
};

export const removeCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  const index = findIndex(cache.entityLocations[loc], x => x === id);
  return cache.entityLocations[loc].splice(index, 1);
};

export const setCacheId = (id, key) => cache[key].push(id);

export const deleteCacheId = (id, key) => {
  const index = findIndex(cache[key], x => x === id);
  cache[key].splice(index, 1);
};
