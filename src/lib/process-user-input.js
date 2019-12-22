import { findIndex, pull } from "lodash";
import ECS from "../ECS/ECS";
import {
  removeCacheEntityAtLocation,
  setCacheEntityAtLocation
} from "../ECS/cache";
import { getStorablesAtLoc, getPlayer, getEntity } from "./getters";
import { printToLog } from "./gui";

const tidyInventoryKeys = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const itemNames = Object.keys(inventory.items);
  // clean up any item keys with 0 items in them
  itemNames.forEach(name => {
    if (!inventory.items[name].eIds.length) {
      delete inventory.items[name];
    }
  });
};

const setNextSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const itemNames = Object.keys(inventory.items);

  if (!itemNames.length) {
    inventory.currentSelected = "";
    return;
  }

  const index = findIndex(
    itemNames,
    name => name === inventory.currentSelected
  );

  // if we are at the last item set to first
  if (index === itemNames.length - 1) {
    inventory.currentSelected = itemNames[0];
  } else {
    inventory.currentSelected = itemNames[index + 1];
  }
};

const setPreviousSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const itemNames = Object.keys(inventory.items);

  if (!itemNames.length) {
    inventory.currentSelected = "";
    return;
  }

  const index = findIndex(
    itemNames,
    name => name === inventory.currentSelected
  );

  // if we are at the first item set to last
  if (index === 0) {
    inventory.currentSelected = itemNames[itemNames.length - 1];
  } else {
    inventory.currentSelected = itemNames[index - 1];
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

    const player = getPlayer();
    player.components.inventory.currentSelected =
      Object.keys(player.components.inventory.items)[0] || "";

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
    const itemNames = Object.keys(inventory.items);

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

    // drop item
    if (ECS.game.userInput.key === "d") {
      if (!itemNames.length) {
        return;
      }

      const currentSelected = inventory.items[inventory.currentSelected];
      const eId = currentSelected.eIds[0];
      const entity = ECS.entities[eId];

      if (entity.components.droppable) {
        // remove inventory item
        pull(inventory.items[inventory.currentSelected].eIds, eId);

        if (!inventory.items[inventory.currentSelected].eIds.length) {
          setNextSelectedItem();
          tidyInventoryKeys();
        }

        // place item on map
        player.components.inventory.total -= 1;
        entity.addComponent("position", { ...player.components.position });
        setCacheEntityAtLocation(entity.id, entity.components.position);

        printToLog(`You drop a ${getEntity(eId).components.labels.name}.`);
      }

      return;
    }

    // drop item
    if (ECS.game.userInput.key === "c") {
      if (!itemNames.length) {
        return;
      }

      const currentSelected = inventory.items[inventory.currentSelected];
      const eId = currentSelected.eIds[0];
      const entity = ECS.entities[eId];

      if (entity.components.consumable) {
        // remove inventory item
        pull(inventory.items[inventory.currentSelected].eIds, eId);

        if (!inventory.items[inventory.currentSelected].eIds.length) {
          setNextSelectedItem();
          tidyInventoryKeys();
        }

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

        printToLog(`You consume a ${getEntity(eId).components.labels.name}.`);
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

          // initialize pocket if none exists
          player.components.inventory.items[
            item.components.labels.name
          ] = player.components.inventory.items[
            item.components.labels.name
          ] || {
            eIds: []
          };

          player.components.inventory.items[
            item.components.labels.name
          ].eIds.push(item.id);

          // remove storable entity from map
          removeCacheEntityAtLocation(item.id, item.components.position);
          item.removeComponent("position");
          //  remove from hud
          item.removeComponent("hud");

          pickedUp.push(item.id);

          player.components.inventory.total += 1;
        });

        pickedUp.forEach(eId =>
          printToLog(`You pick up a ${getEntity(eId).components.labels.name}.`)
        );
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
