import _ from "lodash";
import { printToLog } from "./gui";
import { sumRolls } from "./dice";
import {
  getEntity,
  getEntityName,
  getEntityCondition,
  getPlayer,
  getTurnNumber
} from "./getters";
// import { abilityScoreMod } from "./character-creation";

const attackLog = (msg, attacker, target) => {
  const player = getPlayer();
  const attackerIsPlayer = player.id === attacker.id;
  const targetIsPlayer = player.id === target.id;
  const playerIsInvolved = attackerIsPlayer || targetIsPlayer;

  if (playerIsInvolved) {
    printToLog(msg);
  }
};

// splits damage across parts in a group based in the type of damage recieved
export const divvyDamage = (group, damage) => {
  const { type, dmg } = damage;

  const dmgTypeSampleSize = {
    pierce: 1,
    bludgeon: 5,
    slash: 2
  };

  const parts = [];
  _.times(dmgTypeSampleSize[type], () => parts.push(_.sample(group.parts)));

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

const damageArmor = (armor, damage, attacker, target) => {
  // todo provide some nuance in how this damage is dealt based on damage type
  armor.components.sdc.current -= damage.dmg;
  const condition = getEntityCondition(armor);

  if (condition === "DESTROYED") {
    armor.components.ar.current = 0;
    attackLog(
      `${getEntityName(target)}'s ${getEntityName(armor)} is destroyed!`,
      attacker,
      target
    );
  } else if (condition === "SEVERLY_DAMAGED") {
    armor.components.ar.current = armor.components.ar.max - 4;
    attackLog(
      `${getEntityName(target)}'s ${getEntityName(armor)} is severly damaged!`,
      attacker,
      target
    );
  } else if (condition === "DAMAGED") {
    armor.components.ar.current = armor.components.ar.max - 2;
    attackLog(
      `${getEntityName(target)}'s ${getEntityName(armor)} is damaged!`,
      attacker,
      target
    );
  }

  if (armor.components.ar.current < 0) {
    armor.components.ar.current = 0;
  }
};

const damageAnatomy = (partsDamage, target) => {
  const anatomy = target.components.anatomy;
  Object.keys(partsDamage).forEach(part => {
    anatomy[part].current -= Math.ceil(partsDamage[part]);

    target.components.bleeding[part] = {
      start: getTurnNumber,
      severity: 0.5
    };

    if (anatomy[part].current <= 0 && anatomy[part].ifDestroyed === "death") {
      target.components.health.current = 0;
    }
  });
};

export const attackTarget = (attacker, target, weapon) => {
  // roll for attack (start with raw rolls - add bonuses later)
  let attackRoll = sumRolls(20, 1);
  const attackerName = getEntityName(attacker);
  const targetName = getEntityName(target);
  const weaponName = getEntityName(weapon);

  const anatomy = target.components.anatomy;

  // todo: calc and add bonuses to attackRoll

  // if less than 5 it's a miss
  if (attackRoll < 5) {
    return attackLog(`${attackerName} misses ${targetName}.`, attacker, target);
  } else {
    // it's a hit!
    // determine anatomy group
    // todo: anatomy groups should have a percentage to hit instead of all the same chance
    const groupName = _.sample(Object.keys(anatomy.groups));
    const partNames = anatomy.groups[groupName];

    // check if there is armor on the hit group
    const armorId = _.get(target, `components.armor.${groupName}`);
    // if there is armor on the hit group
    if (armorId) {
      const armor = getEntity(armorId);
      if (attackRoll > armor.components.ar.current) {
        damageArmor(armor, weapon.components.damage, attacker, target);
        // todo: divvy half the damage cause the armor did some good
        const partsDamage = divvyDamage(
          partNames,
          weapon.components.damage / 2
        );
        damageAnatomy(partsDamage, target);

        if (armor.components.ar > 0) {
          attackLog(
            `${attackerName} hits ${targetName}'s ${groupName} through their ${getEntityName(
              armor
            )}.`,
            attacker,
            target
          );
        } else {
          attackLog(
            `${attackerName} hits ${targetName}'s ${groupName}.`,
            attacker,
            target
          );
        }
      } else {
        // if it did not pierce the armor dump all damage into armor directly
        damageArmor(armor, weapon.components.damage, attacker, target);
      }
    } else {
      // No armor! Just divvy the damage directly
      const partsDamage = divvyDamage(partNames, weapon.components.damage);
      damageAnatomy(partsDamage, target);

      attackLog(
        `${attackerName} hits ${targetName}'s ${groupName}.`,
        attacker,
        target
      );
    }
  }
};
