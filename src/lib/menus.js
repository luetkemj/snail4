import _ from "lodash";
import ECS from "../ECS/ECS";
import { getEntity, getPlayer } from "../lib/getters";
import { abilityScoreMod } from "../lib/character-creation";

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

export const writeEntityDescription = eId => {
  let text = ``;
  const entity = getEntity(eId);
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

    console.log(text);
  }

  return text;
};

export const writeEquipped = eId => {
  const entity = getEntity(eId);
  let text;

  const { armor, wielding } = entity.components;

  const getArmorName = armorId => {
    const armorEntity = getEntity(armorId) || {};

    if (armorEntity.components) {
      console.log(armorEntity);
      return armorEntity.components.labels.name;
    }

    return "";
  };

  if (armor) {
    text = `
        head: ${getArmorName(armor.head)}
   shoulders: ${getArmorName(armor.shoulders)}
       torso: ${getArmorName(armor.torso)}
      wrists: ${getArmorName(armor.wrists)}
       hands: ${getArmorName(armor.hands)}
        legs: ${getArmorName(armor.legs)}
        feet: ${getArmorName(armor.feet)}
`;
  }

  console.log(text);

  return text;
};
