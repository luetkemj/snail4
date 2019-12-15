import ECS from "../ECS/ECS";
import { playerId, readCacheEntitiesAtLocation } from "../ECS/cache";

export const getPlayer = () => {
  return ECS.entities[playerId()];
};

export const getEntity = eId => ECS.entities[eId];

export const getEntitiesAtLoc = ({ x, y }) =>
  readCacheEntitiesAtLocation({ x, y }).map(eId => ECS.entities[eId]);

export const getStorablesAtLoc = ({ x, y }) =>
  getEntitiesAtLoc({ x, y }).filter(entity => entity.components.storable);
