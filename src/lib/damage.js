import _ from "lodash";
import { printToLog } from "./gui";
import { sumRolls } from "./dice";
import { getEntityName, getPlayer } from "./getters";
// import { abilityScoreMod } from "./character-creation";

// splits damage across parts in a group based in the type of damage recieved
export const divvyDamage = (group, damage) => {
  const { type, dmg } = damage;

  const dmgTypeSampleSize = {
    pierce: 1,
    bludgeon: 5,
    slash: 2
  };

  const parts = [];
  _.times(dmgTypeSampleSize[type], () => parts.push(_.sample(group)));

  const partsDamage = [];

  const initialDmg = Math.floor(dmg / parts.length) + (dmg % parts.length);
  const otherDmg = Math.floor(dmg / parts.length);

  parts.forEach((part, index) => {
    if (index === 0) {
      partsDamage.push(initialDmg);
    } else {
      partsDamage.push(otherDmg);
    }
  });

  return parts.reduce((acc, val, idx) => {
    acc[val] = (acc[val] || 0) + partsDamage[idx];
    return acc;
  }, {});
};

export const attackTarget = (attacker, target) => {
  // roll for attack (start with raw rolls - add bonuses later)
  let attackRoll = sumRolls(20, 1);
  const attackerName = getEntityName(attacker);
  const targetName = getEntityName(target);
  const player = getPlayer();

  const attackerIsPlayer = player.id === attacker.id;
  const targetIsPlayer = player.id === attacker.id;
  const playerIsInvolved = attackerIsPlayer || targetIsPlayer;

  const anatomy = target.components.anatomy;

  const attackLog = msg => {
    if (playerIsInvolved) {
      printToLog(msg);
    }
  };

  // todo: calc and add bonuses to attackRoll

  // if less than 5 it's a miss
  if (attackRoll < 5) {
    return attackLog(`${attackerName} misses ${targetName}.`);
  } else {
    // it's a hit!
    // determine anatomy group
    // todo: anatomy groups should have a percentage to hit instead of all the same chance
    const groupName = _.sample(Object.keys(anatomy.groups));
    const partNames = anatomy.groups[groupName];

    // check armor and AR for group

    attackLog(`${attackerName} hits ${targetName}'s ${groupName}.`);
  }
};

// Roll for anatomy group that was hit
// Roll for damage (weapon / strength / mods? however that happens)
// If attack roll is less than AR - armor SDC takes all the damage
// If attack roll is more than AR - player and armor split damage within some range

// damageAnatomyRules
// entity must have anatomy
// args: entity, dmg obj
// dmg: { type, amount }
// should deal the damage to entity
// should return a string for logging to console

export const damageAnatomy = (entity, target, weapon) => {
  const { anatomy, health } = target.components;

  const dmg = {
    type: weapon.components.damage.type,
    dmg: weapon.components.damage.dmg
  };

  const groupName = _.sample(Object.keys(anatomy.groups));
  const group = anatomy.groups[groupName];
  const partsDamage = divvyDamage(group.parts, dmg);

  const eName = entity.components.labels.name;
  const tName = target.components.labels.name;
  const wName = weapon.components.labels.name;

  if (dmg.type === "pierce") {
    // printToLog(`${eName} pierces ${tName}'s ${groupName} with a ${wName}.`);
  }

  if (dmg.type === "bludgeon") {
    // printToLog(`${eName} bludgeons ${tName}'s ${groupName} with a ${wName}.`);
  }

  if (dmg.type === "slash") {
    // printToLog(`${eName} slashes ${tName}'s ${groupName} with a ${wName}.`);
  }

  Object.keys(partsDamage).forEach(part => {
    anatomy[part].current -= partsDamage[part];

    if (anatomy[part].current <= 0 && anatomy[part].ifDestroyed !== "death") {
      if (dmg.type === "pierce") {
        // printToLog(`${tName}'s ${part} is pierced through entirely!`);
      }

      if (dmg.type === "bludgeon") {
        // printToLog(`${tName}'s ${part} is mashed to a pulp!`);
      }

      if (dmg.type === "slash") {
        // printToLog(`${tName}'s ${part} is in ribbons!`);
      }
    }

    if (anatomy[part].current <= 0 && anatomy[part].ifDestroyed === "death") {
      // printToLog(
      //   `${target.components.labels.name}'s ${part} is destroyed, killing it!`
      // );
      health.current = 0;
    }
  });

  return { partsDamage, target };
};
