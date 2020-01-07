import {
  deleteCacheId,
  removeCacheEntityAtLocation,
  readCacheKey
} from "../cache";

function garbage(entities) {
  readCacheKey("entityIds").forEach(id => {
    const entity = entities[id];
    const { garbage, position } = entity.components;
    if (garbage) {
      if (position) {
        removeCacheEntityAtLocation(entity.id, {
          x: position.x,
          y: position.y
        });
      }
      // todo: need to probably store caches on each entity for deletion later
      // will need to loop over cache keys on entity before removal
      deleteCacheId(entity.id, "entityIds");
    }
  });
}

export default garbage;
