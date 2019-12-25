import { compact, difference, findIndex, pull, sortBy } from "lodash";
import ECS from "../ECS/ECS";
import {
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";
import { getStorablesAtLoc, getPlayer, getEntity } from "./getters";
import { printToLog } from "./gui";

const sortInventory = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;
  const equippedItems = compact(Object.values(player.components.armor));
  const unequippedItems = difference(items, equippedItems);

  player.components.inventory.items = equippedItems.concat(unequippedItems);
};

const setNextSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;

  if (!items.length) {
    inventory.currentSelected = "";
    return;
  }

  const index = findIndex(items, eId => eId === inventory.currentSelected);

  // if we are at the last item set to first
  if (index === items.length - 1) {
    inventory.currentSelected = items[0];
  } else {
    inventory.currentSelected = items[index + 1];
  }
};

const setPreviousSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;

  if (!items.length) {
    inventory.currentSelected = "";
    return;
  }

  const index = findIndex(items, eId => eId === inventory.currentSelected);

  // if we are at the first item set to last
  if (index === 0) {
    inventory.currentSelected = items[items.length - 1];
  } else {
    inventory.currentSelected = items[index - 1];
  }
};

function processUserInput() {
  if (!ECS.game.userInput) {
    return;
  }

  // return to game
  if (ECS.game.userInput.key === "Escape") {
    if (ECS.game.mode !== "GAME") {
      ECS.game.paused = false;
      ECS.game.mode = "GAME";
      ECS.game.playerTurn = true;
      ECS.game.userInput = null;

      return;
    }
  }

  // open inventory
  if (ECS.game.userInput.key === "i" && ECS.game.mode !== "INVENTORY") {
    ECS.game.paused = true;
    ECS.game.mode = ECS.game.mode === "INVENTORY" ? "GAME" : "INVENTORY";
    ECS.game.playerTurn = true;
    ECS.game.userInput = null;

    sortInventory();

    const player = getPlayer();
    player.components.inventory.currentSelected =
      player.components.inventory.items[0] || "";

    return;
  }

  // open help
  if (ECS.game.userInput.key === "?" && ECS.game.mode !== "HELP") {
    ECS.game.paused = true;
    ECS.game.mode = ECS.game.mode === "HELP" ? "GAME" : "HELP";
    ECS.game.playerTurn = true;
    ECS.game.userInput = null;

    return;
  }

  if (ECS.game.mode === "INVENTORY") {
    const player = getPlayer();
    const { inventory } = player.components;

    // select next item
    if (ECS.game.userInput.key === "ArrowDown") {
      setNextSelectedItem();
      return;
    }

    // select previous item
    if (ECS.game.userInput.key === "ArrowUp") {
      setPreviousSelectedItem();
      return;
    }

    // consume item
    if (ECS.game.userInput.key === "c") {
      if (!inventory.items.length) {
        return;
      }

      const entity = getEntity(inventory.currentSelected);

      if (entity.components.consumable) {
        // remove inventory item
        setNextSelectedItem();
        pull(inventory.items, entity.id);

        // consume item and take it's effects
        entity.components.consumable.effects.forEach(effect => {
          if (effect.buff) {
            if (player.components[effect.buff.component]) {
              const delta = effect.buff.delta;
              const { current, max } = player.components[effect.buff.component];

              player.components[effect.buff.component].current = Math.min(
                current + delta,
                max
              );
            }
          }
        });
        player.components.inventory.total -= 1;

        printToLog(
          `You consume a ${getEntity(entity.id).components.labels.name}.`
        );
      }

      return;
    }

    // drop item
    if (ECS.game.userInput.key === "d") {
      if (!inventory.items.length) {
        return;
      }

      const entity = getEntity(inventory.currentSelected);

      if (entity.components.droppable) {
        // remove inventory item
        pull(inventory.items, entity.id);
        setNextSelectedItem();

        // place item on map
        player.components.inventory.total -= 1;
        entity.addComponent("position", { ...player.components.position });
        setCacheEntityAtLocation(entity.id, entity.components.position);

        printToLog(
          `You drop a ${getEntity(entity.id).components.labels.name}.`
        );
      }

      return;
    }

    // equip item
    if (ECS.game.userInput.key === "e") {
      if (!inventory.items.length) {
        return;
      }

      const entity = getEntity(inventory.currentSelected);

      if (entity.components.wearable) {
        const slots = entity.components.wearable.slots;
        const emptySlots = slots.filter(slot => !player.components.armor[slot]);

        // if empty slots equip to first available
        if (emptySlots.length) {
          player.components.armor[emptySlots[0]] = entity.id;
        } else {
          const slotName = getEntity(player.components.armor[slots[0]])
            .components.labels.name;

          return printToLog(`You have to remove your ${slotName} first.`);
        }

        // you can't dropped equipped armor - you must remove it first!
        entity.removeComponent("droppable");
        entity.removeComponent("wearable");

        entity.addComponent("removable");

        const equippedItems = compact(
          Object.values(getPlayer().components.armor)
        );
        inventory.items = sortBy(inventory.items, eId =>
          equippedItems.includes(eId)
        );

        sortInventory();
        printToLog(
          `You equip a ${getEntity(entity.id).components.labels.name}.`
        );
      }

      return;
    }

    // remove item
    if (ECS.game.userInput.key === "r") {
      if (!inventory.items.length) {
        return;
      }

      const entity = getEntity(inventory.currentSelected);

      if (entity.components.removable) {
        // assume it should have these components
        entity.addComponent("droppable");
        entity.addComponent("wearable");

        entity.removeComponent("removable");

        // actually remove the item from armor
        Object.keys(player.components.armor).forEach(slot => {
          if (player.components.armor[slot] === entity.id) {
            player.components.armor[slot] = "";
          }
        });

        sortInventory();
        printToLog(`You remove your ${entity.components.labels.name}.`);
      }

      return;
    }
  }

  if (ECS.game.mode === "GAME") {
    if (ECS.game.userInput.type === "GET") {
      // check if there is anything to get on current cell
      const player = getPlayer();
      const storables = getStorablesAtLoc(player.components.position).filter(
        entity => entity.id !== player.id
      );

      if (!storables.length) {
        printToLog(`There is nothing to pick up`);
        return;
      }

      if (storables.length) {
        const pickedUp = [];

        storables.forEach(item => {
          if (
            player.components.inventory.total >=
            player.components.inventory.capacity
          ) {
            printToLog(`You cannot carry any more`);
            // break out of loop
            return;
          }

          player.components.inventory.items.push(item.id);

          // remove storable entity from map
          removeCacheEntityAtLocation(item.id, item.components.position);
          item.removeComponent("position");
          //  remove from hud
          item.removeComponent("hud");

          pickedUp.push(item.id);

          player.components.inventory.total += 1;

          printToLog(
            `You pick up a ${getEntity(item.id).components.labels.name}.`
          );
        });
      }

      return;
    }

    if (ECS.game.userInput.type === "TOGGLE_OMNISCIENCE") {
      ECS.cheats.omniscience = !ECS.cheats.omniscience;
      return;
    }
  }

  return;
}

export default processUserInput;
