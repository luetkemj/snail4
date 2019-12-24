import { compact, sample } from "lodash";
import ECS from "../ECS/ECS";
import {
  readCacheEntitiesAtLocation,
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";
import { printToLog } from "./gui";
import { layers } from "../lib/canvas";

import createTrack from "../ECS/assemblages/track.assemblage";

import { CARDINAL, getNeighbors } from "./grid";

export const bump = (entity, targetId) => {
  // only print player bumps
  if (ECS.cache.player[0] === entity.id) {
    printToLog(
      `${entity.components.labels.name} bumps into ${ECS.entities[targetId].components.labels.name}`
    );
  }
};

export const attack = (entity, targetId) => {
  const targetEntity = ECS.entities[targetId];

  // todo: move this whole thing (attack and damage dealing) into a library
  // calculateDamage
  let damage = 3;
  if (targetEntity.components.armor) {
    compact(Object.values(targetEntity.components.armor)).forEach(eId => {
      console.log("armor:", ECS.entities[eId]);
      if (ECS.entities[eId].components.damageReduction) {
        if (damage - ECS.entities[eId].components.damageReduction.dr < 0) {
          damage = 0;
        } else {
          damage = damage - ECS.entities[eId].components.damageReduction.dr;
        }
      }
    });
  }
  targetEntity.components.health.current -= damage;

  // only print attacks if the player is involved
  if (ECS.cache.player[0] === entity.id || ECS.cache.player[0] === targetId) {
    printToLog(
      `${entity.components.labels.name} attacks ${targetEntity.components.labels.name} for ${damage} damage.`
    );
  }

  if (targetEntity.components.health.current <= 0) {
    // only print deaths if the player is involved
    if (ECS.cache.player[0] === entity.id || ECS.cache.player[0] === targetId) {
      printToLog(`${targetEntity.components.labels.name} is dead.`);
    }

    targetEntity.addComponent("dead", { timeOfDeath: ECS.game.turn });
    targetEntity.components.labels.name =
      targetEntity.components.labels.name + " corpse";

    if (targetEntity.components.description) {
      targetEntity.components.description.text = `You see a crumpled ${targetEntity.components.labels.name} on the floor.`;
    }

    targetEntity.addComponent("storable");
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

  createTrack({ position: { x, y }, eId: entity.id });

  position.x = mx;
  position.y = my;

  return { x: mx, y: my };
};
