import _ from "lodash";
import {
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";
import { getEntity, getGettableEntitiesAtLoc } from "./getters";
import ECS from "../ECS/ECS";

export const consume = (actor, consumable, callback = () => {}) => {
  // todo: components for canConsume? no use case yet

  if (
    // ensure consumable is infact consumable
    consumable.components.consumable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure consumable is in actor's inventory
    actor.components.inventory.items.includes(consumable.id)
  ) {
    callback();
    // remove consumable from actor's inventory
    _.pull(actor.components.inventory.items, consumable.id);

    // apply effects
    consumable.components.consumable.effects.forEach(effect => {
      if (effect.buff) {
        if (actor.components[effect.buff.component]) {
          const delta = effect.buff.delta;
          const { current, max } = actor.components[effect.buff.component];

          actor.components[effect.buff.component].current = Math.min(
            current + delta,
            max
          );
        }
      }
    });

    // track inventory total
    actor.components.inventory.total -= 1;

    return {
      OK: true,
      msg: `${actor.components.labels.name} consumes ${consumable.components.labels.name}`
    };
  } else {
    return {
      OK: false,
      msg: `${actor.components.labels.name} can't consume that.`
    };
  }
};

export const drop = (actor, droppable, callback = () => {}) => {
  if (
    // ensure droppable is infact droppable
    droppable.components.droppable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure droppable is in actor's inventory
    actor.components.inventory.items.includes(droppable.id)
  ) {
    callback();
    // remove droppable from inventory
    _.pull(actor.components.inventory.items, droppable.id);

    // track inventory total
    actor.components.inventory.total -= 1;

    // place droppable on map
    droppable.addComponent("position", { ...actor.components.position });
    setCacheEntityAtLocation(droppable.id, droppable.components.position);

    // if item was being wielded, unwield it
    if (actor.components.wielding === droppable.id) {
      actor.components.wielding = "";
    }

    return {
      OK: true,
      msg: `${actor.components.labels.name} drops ${droppable.components.labels.name}.`
    };
  } else {
    return {
      OK: false,
      msg: `${actor.components.labels.name} can't drop that.`
    };
  }
};

export const getFromContainer = (actor, entity) => {
  // ensure actor has inventory
  if (actor.components.inventory) {
    let response = {};

    if (
      actor.components.inventory.total >= actor.components.inventory.capacity
    ) {
      response = {
        OK: false,
        msg: `${actor.components.labels.name} cannot carry any more`
      };
      return response;
    }

    actor.components.inventory.items.push(entity.id);
    // remove gettable entity from map
    removeCacheEntityAtLocation(entity.id, entity.components.position);
    entity.removeComponent("position");
    //  remove from hud
    entity.removeComponent("hud");
    // remove from container
    _.remove(ECS.game.menu.containerMenu.items, x => x === entity.id);

    actor.components.inventory.total += 1;
    response = {
      OK: false,
      msg: `${actor.components.labels.name} picks up ${
        getEntity(entity.id).components.labels.name
      }.`
    };
    return response;
  }
};

export const get = actor => {
  if (
    // ensure actor has inventory
    actor.components.inventory &&
    // ensure actor has position
    actor.components.position
  ) {
    const gettables = getGettableEntitiesAtLoc(
      actor.components.position
    ).filter(entity => entity.id !== actor.id);
    if (!gettables.length) {
      return {
        OK: false,
        msg: `There is nothing to pick up`
      };
    }

    if (gettables.length) {
      const items = {
        allAvailable: [],
        hasInventory: {},
        inInventory: {}
      };

      gettables.forEach(item => {
        items.allAvailable.push(item.id);
        if (item.components.inventory) {
          items.hasInventory[item.id] = item.components.inventory.items;

          item.components.inventory.items.forEach(eId => {
            items.inInventory[eId] = item.id;
            items.allAvailable.push(eId);
          });
        }
      });

      if (items.allAvailable.length === 1) {
        const pickedUp = [];
        let response = {};
        gettables.forEach(item => {
          if (
            actor.components.inventory.total >=
            actor.components.inventory.capacity
          ) {
            // break out of loop
            response = {
              OK: false,
              msg: `${actor.components.labels.name} cannot carry any more`
            };
            return false;
          }
          actor.components.inventory.items.push(item.id);
          // remove gettable entity from map
          removeCacheEntityAtLocation(item.id, item.components.position);
          item.removeComponent("position");
          //  remove from hud
          item.removeComponent("hud");
          pickedUp.push(item.id);
          actor.components.inventory.total += 1;
          response = {
            OK: true,
            msg: `${actor.components.labels.name} picks up ${
              getEntity(item.id).components.labels.name
            }.`
          };
        });
        return response;
      }

      // this is a container and we need to open the UI for grabbing things
      if (items.allAvailable.length > 1) {
        ECS.game.menu.containerMenu.items = items.allAvailable;
        ECS.game.mode = "LOOT_CONTAINER";
        return { msg: "" };
      }
    }
  }
  return {
    OK: false,
    msg: `${actor.components.labels.name} can't get.`
  };
};

export const remove = (actor, removable) => {
  if (
    // ensure removable is infact removable
    removable.components.removable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure removable is in actor's inventory
    actor.components.inventory.items.includes(removable.id)
  ) {
    if (actor.components.wielding === removable.id) {
      // if removable was being wielded
      removable.addComponent("droppable");
      removable.addComponent("wieldable");
      removable.removeComponent("removable");
      actor.components.wielding = "";
    } else {
      // it's a removable item
      removable.addComponent("droppable");
      removable.components.wearable.beingWorn = false;
      removable.removeComponent("removable");
      // actually remove the item from armor
      Object.keys(actor.components.armor).forEach(slot => {
        if (actor.components.armor[slot] === removable.id) {
          actor.components.armor[slot] = "";
        }
      });
    }

    return {
      OK: true,
      msg: `${actor.components.labels.name} removes ${removable.components.labels.name}.`
    };
  }

  return {
    OK: false,
    msg: `${actor.components.labels.name} can't remove that.`
  };
};

export const wear = (actor, wearable) => {
  if (
    // ensure wearable is infact wearable
    wearable.components.wearable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure wearable is in actor's inventory
    actor.components.inventory.items.includes(wearable.id)
  ) {
    // TODO: bug - You can wear and wield the SAME THING!
    // check if it's already being worn
    if (wearable.components.wearable.beingWorn) {
      return {
        OK: false,
        msg: `${actor.components.labels.name} is already wearing that.`
      };
    }
    const slots = wearable.components.wearable.slots;
    const emptySlots = slots.filter(slot => !actor.components.armor[slot]);

    if (emptySlots.length) {
      // if empty slots equip to first available
      actor.components.armor[emptySlots[0]] = wearable.id;

      // You can't drop an equipped item
      wearable.removeComponent("droppable");
      wearable.components.wearable.beingWorn = true;
      // You can now remove it
      wearable.addComponent("removable");

      return {
        OK: true,
        msg: `${actor.components.labels.name} wears ${wearable.components.labels.name}.`
      };
    } else {
      const slotName = getEntity(actor.components.armor[slots[0]]).components
        .labels.name;
      return {
        OK: false,
        msg: `${actor.components.labels.name} must remove ${slotName} first.`
      };
    }
  }

  return {
    OK: false,
    msg: `${actor.components.labels.name} can't wear that.`
  };
};

export const wield = (actor, wieldable) => {
  if (
    // ensure wieldable is infact wieldable
    wieldable.components.wieldable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure wieldable is in actor's inventory
    actor.components.inventory.items.includes(wieldable.id)
  ) {
    // TODO: bug - You can wear and wield the SAME THING!
    const wielding = getEntity(actor.components.wielding);

    if (wielding === wieldable.id) {
      return {
        OK: false,
        msg: `${actor.components.labels.name} already wielding that.`
      };
    }

    // if already wielding somthing - stop it
    if (wielding) {
      wielding.removeComponent("removable");
      wielding.addComponent("wieldable");
    }

    // wield new thing
    wieldable.addComponent("removable");
    wieldable.removeComponent("wieldable");
    // TODO: should check for a canWield component?
    actor.components.wielding = wieldable.id;

    return {
      OK: true,
      msg: `${actor.components.labels.name} wields ${wieldable.components.labels.name}.`
    };
  }
  return {
    OK: false,
    msg: `${actor.components.labels.name} can't wield that.`
  };
};

export default {
  consume,
  drop,
  get,
  getFromContainer,
  remove,
  wear,
  wield
};
