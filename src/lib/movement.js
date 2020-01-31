import { sample, times } from "lodash";
import ECS from "../ECS/ECS";
import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation,
  readCacheKeyAtId
} from "../ECS/cache";
import { printToLog } from "./gui";
import { layers } from "../lib/canvas";
import { attackTarget, damageAnatomy } from "../lib/damage";

import createTrack from "../ECS/assemblages/track.assemblage";

import { CARDINAL, getNeighbors } from "./grid";
import { getPlayer } from "./getters";

export const bump = (entity, targetId) => {
  // only print player bumps
  if (getPlayer().id === entity.id) {
    printToLog(
      `${entity.components.labels.name} bumps into ${ECS.entities[targetId].components.labels.name}`
    );
  }
};

export const attack = (entity, targetId) => {
  const targetEntity = ECS.entities[targetId];

  // if entity is wielding a weapon add the weapon damage to damage
  const weapon = ECS.entities[entity.components.wielding] || {
    components: {
      damage: {
        dmg: 2,
        type: "slash"
      },
      labels: {
        name: "claws"
      }
    }
  };

  attackTarget(entity, targetEntity, weapon);

  // if player is target and invincible cheat is on take no damage
  if (getPlayer().id === targetEntity.id && ECS.cheats.invincible) {
    targetEntity.components.health.current = targetEntity.components.health.max;
  }

  // if player is entity and berzerk mode is on instakill target
  if (getPlayer().id === entity.id && ECS.cheats.berserk) {
    targetEntity.components.health.current = 0;
  }

  if (targetEntity.components.health.current <= 0) {
    // only print deaths if the player is involved
    // if (getPlayer().id === entity.id || getPlayer().id === targetId) {
    printToLog(`${targetEntity.components.labels.name} is dead.`);
    // }

    targetEntity.addComponent("dead", { timeOfDeath: ECS.game.turn });
    targetEntity.components.labels.name =
      targetEntity.components.labels.name + " corpse";

    if (targetEntity.components.description) {
      targetEntity.components.description.text = `You see a crumpled ${targetEntity.components.labels.name} on the floor.`;
    }

    targetEntity.addComponent("gettable");
    targetEntity.components.appearance.layer = layers.items;
    targetEntity.components.appearance.char = "%";
    targetEntity.removeComponent("moveToPlayer");
    targetEntity.removeComponent("playerControlled");
    targetEntity.removeComponent("blocking");
  }
};

export const drunkenWalk = entity => {
  const { position } = entity.components;
  const dir = sample(CARDINAL);

  const mx = position.x + dir.x;
  const my = position.y + dir.y;

  return { x: mx, y: my };
};

export const walkDijkstra = (entity, dMapName) => {
  const { position } = entity.components;
  const neighbors = getNeighbors(position.x, position.y);

  let score = 1000000;
  let nextPosition = {};
  neighbors.forEach(n => {
    const eId = readCacheKeyAtId(`${n.x},${n.y}`, "tileLocations");
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

  // check for blocking entities in target location
  const entitiesAtGoalIds = readCacheEntitiesAtLocation({ x: mx, y: my });
  const blockers = entitiesAtGoalIds.filter(
    id => ECS.entities[id].components.blocking
  );

  // set blocking entity as target
  // and do not move
  if (blockers.length) {
    blockers.forEach(id => entity.addComponent("target", { id }));
    return false;
  }

  removeCacheEntityAtLocation(entity.id, { x: position.x, y: position.y });
  setCacheEntityAtLocation(entity.id, { x: mx, y: my });
  createTrack({ position: { x, y }, eId: entity.id });

  position.x = mx;
  position.y = my;

  return { x: mx, y: my };
};
