import { findIndex } from "lodash";

export const cache = {
  tileLocations: {},
  entityLocations: {},
  entityIds: [],
  movable: [],
  player: [],
  openTiles: []
};

// set single entity id at cache.tileLocations[loc]
export const setCacheTileLocations = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache.tileLocations[loc] = id;
};

// push single entity Id into array at cache.entityLocations[loc]
export const setCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache.entityLocations[loc] = cache.entityLocations[loc] || [];
  cache.entityLocations[loc].push(id);
};

// read all entity Ids at loc in entityLocations
export const readCacheEntitiesAtLocation = position => {
  const loc = `${position.x},${position.y}`;
  return cache.entityLocations[loc] || [];
};

// remove single entity Id from array at loc in entityLocations
export const removeCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  const index = findIndex(cache.entityLocations[loc], x => x === id);
  return cache.entityLocations[loc].splice(index, 1);
};

// add Id to cache[key]
export const setCacheId = (id, key) => cache[key].push(id);

// remove Id from cache[key]
export const deleteCacheId = (id, key) => {
  const index = findIndex(cache[key], x => x === id);
  cache[key].splice(index, 1);
};
