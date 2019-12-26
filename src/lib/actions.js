import { pull } from "lodash";
import { getEntity } from "./getters";
import {
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";

export const consume = (actor, consumable) => {
  // todo: components for canConsume? no use case yet

  if (
    // ensure consumable is infact consumable
    consumable.components.consumable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure consumable is in actor's inventory
    actor.components.inventory.items.includes(consumable.id)
  ) {
    // remove consumable from actor's inventory
    pull(actor.components.inventory.items, consumable.id);

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

export const drop = (actor, droppable) => {
  if (
    // ensure droppable is infact droppable
    droppable.components.droppable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure droppable is in actor's inventory
    actor.components.inventory.items.includes(droppable.id)
  ) {
    // remove droppable from inventory
    pull(actor.components.inventory.items, droppable.id);

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

export const equip = (actor, wearable) => {
  if (
    // ensure wearable is infact wearable
    wearable.components.wearable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure wearable is in actor's inventory
    actor.components.inventory.items.includes(wearable.id)
  ) {
    // check if it's already being worn
    if (wearable.components.wearable.beingWorn) {
      return {
        OK: false,
        msg: `${actor.components.labels.name} is already equipped.`
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
        msg: `${actor.components.labels.name} equips ${wearable.components.labels.name}.`
      };
    } else {
      const slotName = getEntity(actor.components.armor[slots[0]]).components
        .labels.name;
      return {
        OK: false,
        msg: `${actor.components.labels.name} have to remove your ${slotName} first.`
      };
    }
  }

  return {
    OK: false,
    msg: `${actor.components.labels.name} can't equip that.`
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

export const wield = (actor, wieldable) => {
  if (
    // ensure wieldable is infact wieldable
    wieldable.components.wieldable &&
    // ensure actor has an inventory
    actor.components.inventory &&
    // ensure wieldable is in actor's inventory
    actor.components.inventory.items.includes(wieldable.id)
  ) {
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
    actor.components.wielding = wieldable.id;

    return {
      OK: true,
      msg: `${actor.components.labels.name} wields ${wieldable.components.labels.name}.`
    };
  }
  return {
    OK: true,
    msg: `${actor.components.labels.name} can't wield that.`
  };
};

export default {
  consume,
  drop,
  equip,
  remove,
  wield
};