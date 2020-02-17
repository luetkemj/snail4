import _ from "lodash";
import ECS from "../ECS/ECS";
import {
  getEntity,
  getEntityCondition,
  getEntityName,
  getPlayer
} from "./getters";
import { abilityScoreMod } from "./character-creation";
import { getNeighbor } from "./grid";

export const writeNearbyEntitiesList = (eIds, selectedId) => {
  const playerPos = getPlayer().components.position;
  const entities = eIds.map(eId => getEntity(eId));
  const dirMap = { N: "NORTH", E: "EAST", S: "SOUTH", W: "WEST" };
  const directions = ["N", "E", "S", "W"];
  // iterate over directions
  // find entities at each direction and group
  const schema = [];

  const entitiesAtPlayerPosition = entities.filter(
    entity =>
      entity.components.position.x === playerPos.x &&
      entity.components.position.y === playerPos.y
  );

  if (entitiesAtPlayerPosition.length) {
    schema.push({
      sectionHead: "LOCATION",
      items: entitiesAtPlayerPosition.map(x => ({
        id: x.id,
        selected: x.id === selectedId,
        text: `${x.components.labels.name}`
      }))
    });
  }

  directions.forEach(val => {
    const position = getNeighbor(playerPos.x, playerPos.y, val);
    const entitiesAtPosition = entities.filter(
      entity =>
        entity.components.position.x === position.x &&
        entity.components.position.y === position.y
    );

    if (entitiesAtPosition.length) {
      schema.push({
        sectionHead: dirMap[val],
        items: entitiesAtPosition.map(x => ({
          id: x.id,
          selected: x.id === selectedId,
          text: `${x.components.labels.name}`
        }))
      });
    }
  });

  let text = ``;
  schema.forEach(section => {
    text += `- ${section.sectionHead}\n`;
    section.items.forEach(item => {
      if (item.selected) {
        text += `  *${item.text}\n`;
      } else {
        text += `   ${item.text}\n`;
      }
    });
    text += `\n`;
  });

  return text;
};

export const writeItemList = (eIds, selectedId) => {
  const entities = eIds.map(eId => getEntity(eId));
  const groups = _.groupBy(entities, entity => entity.components.type.name);

  // builds the following schema
  // [
  //   {
  //     sectionHead: "! POTIONS",
  //     items: [
  //       {
  //         id: "", //eId or other identifier
  //         selected: true,
  //         text: "Potion of Healing" // some text calculated prior
  //       }
  //     ]
  //   },
  // ];
  const schema = Object.values(groups).map(group => {
    return {
      sectionHead: group[0].components.type.text,
      items: group.map(item => ({
        id: item.id,
        selected: item.id === selectedId,
        text: `${item.components.labels.name}`
      }))
    };
  });

  let text = ``;
  schema.forEach(section => {
    text += `\u00A0${section.sectionHead}\n`;
    section.items.forEach(item => {
      if (item.selected) {
        text += `\u00A0\u00A0*${item.text}\n`;
      } else {
        text += `\u00A0\u00A0\u00A0${item.text}\n`;
      }
    });
    text += `\n`;
  });

  return text;
};

// creates a list like:
//
// - SOME GROUP
//   Some Item (wielding)
//  *Some Selected Item
//   Some Other Item (head)
//
// - ANOTHER GROUP
//   ANOTHER Item
export const writePlayerInventoryList = (eIds, selectedId) => {
  const entities = eIds.map(eId => getEntity(eId));
  const groups = _.groupBy(entities, entity => entity.components.type.name);

  const wieldedItem = getPlayer().components.wielding;
  const equippedItems = _.compact(Object.values(getPlayer().components.armor));
  const equippedSlot = item => {
    if (item.id === wieldedItem) {
      return " (wielding)";
    }

    if (equippedItems.includes(item.id)) {
      let slotName;
      Object.keys(getPlayer().components.armor).forEach(slot => {
        if (getPlayer().components.armor[slot] === item.id) {
          slotName = slot;
        }
      });

      return ` (${slotName})`;
    }

    return "";
  };

  // builds the following schema
  // [
  //   {
  //     sectionHead: "! POTIONS",
  //     items: [
  //       {
  //         id: "", //eId or other identifier
  //         selected: true,
  //         text: "Potion of Healing" // some text calculated prior
  //       }
  //     ]
  //   },
  // ];
  const schema = Object.values(groups).map(group => {
    return {
      sectionHead: group[0].components.type.text,
      items: group.map(item => ({
        id: item.id,
        selected: item.id === selectedId,
        text: `${item.components.labels.name}${equippedSlot(item)}`
      }))
    };
  });

  let text = ``;
  schema.forEach(section => {
    text += `\u00A0${section.sectionHead}\n`;
    section.items.forEach(item => {
      if (item.selected) {
        text += `\u00A0\u00A0*${item.text}\n`;
      } else {
        text += `\u00A0\u00A0\u00A0${item.text}\n`;
      }
    });
    text += `\n`;
  });

  return text;
};

export const writeAvailableEntityActions = eId => {
  const entity = getEntity(eId);
  let text = "";

  if (entity.components.apply) {
    text = `${text}(a)Apply `;
  }

  if (entity.components.droppable) {
    text = `${text}(d)Drop `;
  }

  if (entity.components.consumable) {
    text = `${text}(c)Consume `;
  }

  if (entity.components.removable) {
    text = `${text}(r)Remove `;
  }

  if (entity.components.wieldable && !entity.components.removable) {
    text = `${text}(w)Wield `;
  }

  if (entity.components.wearable && !entity.components.wearable.beingWorn) {
    text = `${text}(W)Wear `;
  }

  if (entity.components.gettable && ECS.game.mode === "LOOT_CONTAINER") {
    text = `${text}(g)Get `;
  }

  return text;
};

export const writeEntityName = eId => {
  const entity = getEntity(eId);
  return `-- ${entity.components.labels.name} --`;
};

export const writeEntityCondition = eId => {
  let text = ``;
  const entity = getEntity(eId);

  const { ar, sdc } = entity.components;

  if (ar) {
    text += `AR:${ar.current < 0 ? 0 : ar.current} `;
  }

  if (sdc) {
    text += `SDC:${sdc.current < 0 ? 0 : sdc.current} `;

    const condition = getEntityCondition(entity);

    if (condition) text += `[${condition.replace("_", " ")}]`;
  }

  return text ? `${text}\n\n` : "";
};

export const writeEntityDescription = eId => {
  let text = ``;
  const entity = getEntity(eId);

  text += writeEntityCondition(eId);

  const description = entity.components.description.text;
  text += `${description}`;
  return text;
};

export const writeCharAbilities = eId => {
  const entity = getEntity(eId);
  let text = "";

  if (entity.components.abilityScores && entity.components.race) {
    const {
      abilityScores: {
        charisma,
        constitution,
        dexterity,
        intelligence,
        strength,
        wisdom
      },
      race
    } = entity.components;

    const writeMod = score => {
      const modifier = abilityScoreMod(score);
      if (modifier < 0) {
        return `${modifier}`;
      } else {
        return `+${modifier}`;
      }
    };

    const writeScore = score => {
      if (score < 10) {
        return ` ${score}`;
      } else {
        return score;
      }
    };

    text = `Level 1 ${race}

CHA: ${writeScore(charisma)}  ${writeMod(charisma)}
CON: ${writeScore(constitution)}  ${writeMod(constitution)}
DEX: ${writeScore(dexterity)}  ${writeMod(dexterity)}
INT: ${writeScore(intelligence)}  ${writeMod(intelligence)}
STR: ${writeScore(strength)}  ${writeMod(strength)}
WIS: ${writeScore(wisdom)}  ${writeMod(wisdom)}
`;
  }

  return text;
};

export const writeCharInjuries = eId => {
  const entity = getEntity(eId);
  const { anatomy } = entity.components;

  let text = "Injuries\n\n";
  let uninjured = true;

  Object.keys(anatomy).forEach(x => {
    if ("max" in anatomy[x] && "current" in anatomy[x]) {
      if (anatomy[x].max !== anatomy[x].current) {
        text += `${x} is injured.\n`;

        uninjured = false;
      }
    }
  });

  if (uninjured) {
    text += "None";
  }

  return text;
};

export const writeEquipped = eId => {
  const entity = getEntity(eId);
  let text = "Equipped Armor\n\n";

  const { armor, wielding } = entity.components;

  const getArmorName = armorId => {
    return getEntityName(getEntity(armorId));
  };

  if (armor) {
    const length = Math.max(Object.keys(armor).map(x => x.length));

    Object.keys(armor).forEach(key => {
      const armorEntity = getEntity(armor[key]);
      const armorCondition = armorEntity
        ? `[${getEntityCondition(armorEntity).replace("_", " ")}]`
        : "";

      text += `${_.padStart(key, length)}: ${getArmorName(
        armor[key]
      )} ${armorCondition}\n`;
    });
  }

  return text;
};
