import ECS from "./ECS";
import { findIndex, get, set } from "lodash";

const depth = () => get(ECS, "game.depth", -1);

export const cache = {
  player: [],
  [depth()]: {
    tileLocations: {},
    entityLocations: {},
    entityIds: [],
    movable: [],
    openTiles: [],
    playerSpawnLocs: {
      stairsUp: {},
      stairsDown: {}
    }
  }
};

export const playerId = () => cache.player[0];

// set single entity id at cache.tileLocations[loc]
export const setCacheTileLocations = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache[depth()].tileLocations[loc] = id;
};

// push single entity Id into array at cache.entityLocations[loc]
export const setCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  cache[depth()].entityLocations[loc] =
    cache[depth()].entityLocations[loc] || [];
  cache[depth()].entityLocations[loc].push(id);
};

// read all entity Ids at loc in entityLocations
export const readCacheEntitiesAtLocation = position => {
  const loc = `${position.x},${position.y}`;
  return cache[depth()].entityLocations[loc] || [];
};

// remove single entity Id from array at loc in entityLocations
export const removeCacheEntityAtLocation = (id, position) => {
  const loc = `${position.x},${position.y}`;
  const index = findIndex(cache[depth()].entityLocations[loc], x => x === id);
  return cache[depth()].entityLocations[loc].splice(index, 1);
};

// add Id to cache[key]
export const setCacheId = (id, key) => cache[depth()][key].push(id);
export const setPlayerCacheId = id => (cache.player[0] = id);

// read from cache at key
export const readCacheKey = key => cache[depth()][key];

// read from cache at key at Id
export const readCacheKeyAtId = (id, key) => cache[depth()][key][id];

// remove Id from cache[key]
export const deleteCacheId = (id, key) => {
  const index = findIndex(cache[depth()][key], x => x === id);
  cache[depth()][key].splice(index, 1);
};

export const setCacheAtPath = (path, value) => set(cache, path, value);
export const readCacheAtPath = path => get(cache, path);
