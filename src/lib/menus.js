import _ from "lodash";

import { getEntity, getPlayer } from "../lib/getters";

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
    text += `${section.sectionHead}\n`;
    section.items.forEach(item => {
      if (item.selected) {
        text += `\u00A0*${item.text}\n`;
      } else {
        text += `\u00A0\u00A0${item.text}\n`;
      }
    });
    text += `\n`;
  });

  return text;
};

export const writeItemDescription = eId => {
  let text = ``;
  const entity = getEntity(eId);
  const name = entity.components.labels.name;
  const description = entity.components.description.text;
  let actions = "";

  if (entity.components.droppable) {
    actions = `${actions}(d)Drop `;
  }

  if (entity.components.consumable) {
    actions = `${actions}(c)Consume `;
  }

  if (entity.components.removable) {
    actions = `${actions}(r)Remove `;
  }

  if (entity.components.wieldable && !entity.components.removable) {
    actions = `${actions}(w)Wield `;
  }

  if (entity.components.wearable && !entity.components.wearable.beingWorn) {
    actions = `${actions}(W)Wear `;
  }

  text += `-- ${name} --

${actions}

${description}
`;
  return text;
};
