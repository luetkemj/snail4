import { compact, difference, findIndex, pull, sortBy } from "lodash";
import ECS from "../ECS/ECS";
import { getPlayer, getEntity } from "./getters";
import { printToLog } from "./gui";
import actions from "./actions";

const sortInventory = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;
  const wieldedItem = player.components.wielding;
  const equippedItems = compact(Object.values(player.components.armor));
  const unequippedItems = difference(items, equippedItems);
  // remove wieldedItem
  pull(unequippedItems, wieldedItem);

  console.log({ wieldedItem, ...equippedItems, ...unequippedItems });

  player.components.inventory.items = compact([
    wieldedItem,
    ...equippedItems,
    ...unequippedItems
  ]);
};

const scrollPaneIfNeeded = dir => {
  const currentPane = ECS.game.menu.currentPane;
  const paneOffset = ECS.game.menu.paneOffset[currentPane];
  const paneLines = ECS.game.menu.paneLines[currentPane];

  if (dir === "UP") {
    ECS.game.menu.paneOffset[currentPane] -= 1;
    if (ECS.game.menu.paneOffset[currentPane] < 0) {
      ECS.game.menu.paneOffset[currentPane] = 0;
    }
  }

  if (dir === "DOWN") {
    ECS.game.menu.paneOffset[currentPane] += 1;
    // if (ECS.game.menu.paneOffsec[currentPane] < 0) {
    //   ECS.game.menu.paneOffsec[currentPane] = 0;
    // }
  }
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

    // switch active pane
    // some how track the number of available panes? not sure how yet
    if (
      ECS.game.userInput.key === "ArrowLeft" ||
      ECS.game.userInput.key === "ArrowRight"
    ) {
      ECS.game.menu.currentPane += 1;
      if (ECS.game.menu.currentPane > 1) ECS.game.menu.currentPane = 0;
      return;
    }

    // select next item
    if (ECS.game.userInput.key === "ArrowDown") {
      scrollPaneIfNeeded("DOWN");

      if (ECS.game.menu.currentPane === 0) {
        setNextSelectedItem();
        return;
      }
    }

    // select previous item
    if (ECS.game.userInput.key === "ArrowUp") {
      scrollPaneIfNeeded("UP");

      if (ECS.game.menu.currentPane === 0) {
        setPreviousSelectedItem();
        return;
      }
    }

    // consume item
    if (ECS.game.userInput.key === "c") {
      const entity = getEntity(inventory.currentSelected);
      // using a callback to do the result OK things here
      // this is because the item is removed from inventory
      // which buggers with the order of things...
      // maybe do all of them like this?
      const result = actions.consume(getPlayer(), entity, () => {
        setNextSelectedItem();
        sortInventory();
      });
      return printToLog(result.msg);
    }

    // drop item
    if (ECS.game.userInput.key === "d") {
      const entity = getEntity(inventory.currentSelected);
      // using a callback to do the result OK things here
      // this is because the item is removed from inventory
      // which buggers with the order of things...
      // maybe do all of them like this?
      const result = actions.drop(getPlayer(), entity, () => {
        setNextSelectedItem();
        sortInventory();
      });
      return printToLog(result.msg);
    }

    // wear item
    if (ECS.game.userInput.key === "W") {
      const entity = getEntity(inventory.currentSelected);
      const result = actions.wear(getPlayer(), entity);
      if (result.OK) {
        setNextSelectedItem();
        sortInventory();
      }

      return printToLog(result.msg);
    }

    // remove item
    if (ECS.game.userInput.key === "r") {
      const entity = getEntity(inventory.currentSelected);
      const result = actions.remove(getPlayer(), entity);
      if (result.OK) {
        setNextSelectedItem();
        sortInventory();
      }
      return printToLog(result.msg);
    }

    // wield item
    if (ECS.game.userInput.key === "w") {
      const entity = getEntity(inventory.currentSelected);
      const result = actions.wield(getPlayer(), entity);
      if (result.OK) {
        setNextSelectedItem();
        sortInventory();
      }
      return printToLog(result.msg);
    }
  }

  if (ECS.game.mode === "GAME") {
    if (ECS.game.userInput.type === "GET") {
      // check if there is anything to get on current cell
      const result = actions.get(getPlayer());
      if (result.OK) {
        sortInventory();
      }
      return printToLog(result.msg);
    }

    if (ECS.game.userInput.type === "TOGGLE_OMNISCIENCE") {
      ECS.cheats.omniscience = !ECS.cheats.omniscience;
      return;
    }
  }

  return;
}

export default processUserInput;
