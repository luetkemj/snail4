import { findIndex } from "lodash";

const depth = "-1";

export const cache = {
  [depth]: {
    tileLocations: {},
    entityLocations: {},
    entityIds: [],
    movable: [],
    openTiles: [],
    player: []
  }
};

export const playerId = () => cache[depth].player[0];

// set single entity id at cache.tileLocations[loc]
export const setCacheTileLocations = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache[depth].tileLocations[loc] = id;
};

// push single entity Id into array at cache.entityLocations[loc]
export const setCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache[depth].entityLocations[loc] = cache[depth].entityLocations[loc] || [];
  cache[depth].entityLocations[loc].push(id);
};

// read all entity Ids at loc in entityLocations
export const readCacheEntitiesAtLocation = position => {
  const loc = `${position.x},${position.y}`;
  return cache[depth].entityLocations[loc] || [];
};

// remove single entity Id from array at loc in entityLocations
export const removeCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  const index = findIndex(cache[depth].entityLocations[loc], x => x === id);
  return cache[depth].entityLocations[loc].splice(index, 1);
};

// add Id to cache[key]
export const setCacheId = (id, key) => cache[depth][key].push(id);

// read from cache at key
export const readCacheKey = key => cache[depth][key];

// read from cache at key at Id
export const readCacheKeyAtId = (id, key) => cache[depth][key][id];

// remove Id from cache[key]
export const deleteCacheId = (id, key) => {
  const index = findIndex(cache[depth][key], x => x === id);
  cache[depth][key].splice(index, 1);
};
