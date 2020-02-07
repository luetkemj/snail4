import _ from "lodash";
import ECS from "../ECS/ECS";
import { playerId, readCacheEntitiesAtLocation } from "../ECS/cache";

export const getTurnNumber = () => {
  return ECS.game.turn;
};

export const getPlayer = () => {
  return ECS.entities[playerId()];
};

export const getEntity = eId => ECS.entities[eId];

export const getEntitiesAtLoc = ({ x, y }) =>
  readCacheEntitiesAtLocation({ x, y }).map(eId => ECS.entities[eId]);

// @todo
export const getStorablesAtLoc = ({ x, y }) =>
  getEntitiesAtLoc({ x, y }).filter(entity => entity.components.storable);

export const getGettableEntitiesAtLoc = ({ x, y }) => {
  const entities = getEntitiesAtLoc({ x, y }).filter(
    entity => entity.components.gettable
  );

  return entities;
};

export const getEntityName = entity =>
  _.get(entity, "components.labels.name", "");

export const getEntityCondition = entity => {
  if (entity.components.sdc) {
    const halfSDC = Math.floor(entity.components.sdc.max / 2);
    const quarterSDC = Math.floor(entity.components.sdc.max / 4);

    if (entity.components.sdc.current < 1) {
      return "DESTROYED";
    }

    if (entity.components.sdc.current < quarterSDC) {
      return "SEVERELY_DAMAGED";
    }

    if (entity.components.sdc.current < halfSDC) {
      return "DAMAGED";
    }

    if (entity.components.sdc.current < entity.components.sdc.max) {
      return "GOOD";
    }

    if (entity.components.sdc.current === entity.components.sdc.max) {
      return "PERFECT";
    }
  }
};
