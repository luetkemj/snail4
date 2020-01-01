import { findIndex, flatten, groupBy } from "lodash";
import ECS from "../ECS/ECS";
import { getPlayer, getEntity } from "./getters";
import { printToLog } from "./gui";
import actions from "./actions";

const sortInventory = () => {
  const player = getPlayer();
  const entities = player.components.inventory.items.map(eId => getEntity(eId));
  const groups = groupBy(entities, entity => entity.components.type.name);
  const sortedInventory = flatten(Object.values(groups)).map(x => x.id);
  player.components.inventory.items = [...sortedInventory];
};

const scrollPaneIfNeeded = dir => {
  const currentPane = ECS.game.menu.currentPane;
  if (dir === "UP") {
    if (ECS.game.menu.paneOffset[currentPane] - 1 < 0) {
      return;
    } else {
      return (ECS.game.menu.paneOffset[currentPane] -= 1);
    }
  }

  if (dir === "DOWN") {
    if (
      ECS.game.menu.contentHeight[currentPane] -
        ECS.game.menu.paneOffset[currentPane] +
        1 <
      ECS.game.menu.visibleHeight[currentPane]
    ) {
      return;
    } else {
      return (ECS.game.menu.paneOffset[currentPane] += 1);
    }
  }
};

const setNextSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;

  if (!items.length) {
    ECS.game.menu.inventoryMenu.currentSelected = "";
    return;
  }

  const index = findIndex(
    items,
    eId => eId === ECS.game.menu.inventoryMenu.currentSelected
  );

  // if we are at the last item set to first
  if (index === items.length - 1) {
    ECS.game.menu.inventoryMenu.currentSelected = items[0];
    // reset the offset so that we scroll back to top
    const currentPane = ECS.game.menu.currentPane;
    ECS.game.menu.paneOffset[currentPane] = 0;
  } else {
    ECS.game.menu.inventoryMenu.currentSelected = items[index + 1];
  }

  ECS.game.menu.paneOffset[1] = 0;
};

const setPreviousSelectedItem = () => {
  const player = getPlayer();
  const { inventory } = player.components;
  const { items } = inventory;

  if (!items.length) {
    ECS.game.menu.inventoryMenu.currentSelected = "";
    return;
  }

  const index = findIndex(
    items,
    eId => eId === ECS.game.menu.inventoryMenu.currentSelected
  );

  // if we are at the first item set to last
  if (index === 0) {
    ECS.game.menu.inventoryMenu.currentSelected = items[items.length - 1];
    // set the offset so that we scroll to the bottom
    const currentPane = ECS.game.menu.currentPane;

    if (ECS.game.menu.contentHeight > ECS.game.menu.visibleHeight) {
      ECS.game.menu.paneOffset[currentPane] =
        ECS.game.menu.contentHeight[currentPane] -
        ECS.game.menu.visibleHeight[currentPane];
    }
  } else {
    ECS.game.menu.inventoryMenu.currentSelected = items[index - 1];
  }

  ECS.game.menu.paneOffset[1] = 0;
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
    ECS.game.menu.inventoryMenu.currentSelected =
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

  if (ECS.game.mode === "INVENTORY" || ECS.game.mode === "LOOT_CONTAINER") {
    const player = getPlayer();
    let entity;

    if (ECS.game.mode === "INVENTORY") {
      entity = getEntity(ECS.game.menu.inventoryMenu.currentSelected);
    }

    if (ECS.game.mode === "LOOT_CONTAINER") {
      entity = getEntity(ECS.game.menu.containerMenu.currentSelected);
    }

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
      const result = actions.wear(getPlayer(), entity);
      return printToLog(result.msg);
    }

    // remove item
    if (ECS.game.userInput.key === "r") {
      const result = actions.remove(getPlayer(), entity);
      return printToLog(result.msg);
    }

    // wield item
    if (ECS.game.userInput.key === "w") {
      const result = actions.wield(getPlayer(), entity);
      return printToLog(result.msg);
    }

    // get from container (for LOOT_CONTAINER)
    if (ECS.game.userInput.key === "g") {
      const result = actions.getFromContainer(getPlayer(), entity);
      return printToLog(result.msg);
    }
  }

  if (ECS.game.mode === "GAME") {
    if (ECS.game.userInput.type === "GET") {
      // check if there is anything to get on current cell

      // ECS.game.mode = "LOOT_CONTAINER";
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
