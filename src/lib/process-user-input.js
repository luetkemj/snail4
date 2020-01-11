import { findIndex, flatten, groupBy, some } from "lodash";
import ECS from "../ECS/ECS";
import {
  readCacheEntitiesAtLocation,
  setCacheEntityAtLocation,
  setCacheId,
  setCacheAtPath
} from "../ECS/cache";
import { getPlayer, getEntity } from "./getters";
import { printToLog } from "./gui";
import actions from "./actions";
import initDungeonLevel from "../initializers/dungeon-level.init";

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

const setNextSelectedContainerItem = () => {
  const { items } = ECS.game.menu.containerMenu;

  if (!items.length) {
    ECS.game.menu.containerMenu.currentSelected = "";
    return;
  }

  const index = findIndex(
    items,
    eId => eId === ECS.game.menu.containerMenu.currentSelected
  );

  // if we are at the last item set to first
  if (index === items.length - 1) {
    ECS.game.menu.containerMenu.currentSelected = items[0];
    // reset the offset so that we scroll back to top
    const currentPane = ECS.game.menu.currentPane;
    ECS.game.menu.paneOffset[currentPane] = 0;
  } else {
    ECS.game.menu.containerMenu.currentSelected = items[index + 1];
  }

  ECS.game.menu.paneOffset[1] = 0;
};

const setNextSelectedInventoryItem = () => {
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

const setPreviousSelectedInventoryItem = () => {
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

const setPreviousSelectedContainerItem = () => {
  const { items } = ECS.game.menu.containerMenu;

  if (!items.length) {
    ECS.game.menu.containerMenu.currentSelected = "";
    return;
  }

  const index = findIndex(
    items,
    eId => eId === ECS.game.menu.containerMenu.currentSelected
  );

  // if we are at the first item set to last
  if (index === 0) {
    ECS.game.menu.containerMenu.currentSelected = items[items.length - 1];
    // set the offset so that we scroll to the bottom
    const currentPane = ECS.game.menu.currentPane;

    if (ECS.game.menu.contentHeight > ECS.game.menu.visibleHeight) {
      ECS.game.menu.paneOffset[currentPane] =
        ECS.game.menu.contentHeight[currentPane] -
        ECS.game.menu.visibleHeight[currentPane];
    }
  } else {
    ECS.game.menu.containerMenu.currentSelected = items[index - 1];
  }

  ECS.game.menu.paneOffset[1] = 0;
};

const setNextSelectedItem = () => {
  if (ECS.game.mode === "INVENTORY") {
    return setNextSelectedInventoryItem();
  }

  if (ECS.game.mode === "LOOT_CONTAINER") {
    return setNextSelectedContainerItem();
  }
};

const setPreviousSelectedItem = () => {
  if (ECS.game.mode === "INVENTORY") {
    return setPreviousSelectedInventoryItem();
  }

  if (ECS.game.mode === "LOOT_CONTAINER") {
    return setPreviousSelectedContainerItem();
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
    let entity;

    if (ECS.game.mode === "INVENTORY") {
      entity = getEntity(ECS.game.menu.inventoryMenu.currentSelected);
    }

    if (ECS.game.mode === "LOOT_CONTAINER") {
      entity = getEntity(ECS.game.menu.containerMenu.currentSelected);
    }

    // switch active pane
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
    if (ECS.game.userInput.key === "g" && ECS.game.mode === "LOOT_CONTAINER") {
      const result = actions.getFromContainer(getPlayer(), entity, () => {
        setNextSelectedItem();
      });
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

    // TODO: DRY this up!
    if (ECS.game.userInput.type === "ASCEND") {
      // return if playert is NOT on stairs up
      const eIds = readCacheEntitiesAtLocation(getPlayer().components.position);
      if (!some(eIds, eId => getEntity(eId).components.ascend)) return;

      ECS.game.depth = ECS.game.depth + 1;
      if (!ECS.cache[ECS.game.depth]) {
        ECS.cache[ECS.game.depth] = {
          tileLocations: {},
          entityLocations: {},
          entityIds: [],
          movable: [],
          openTiles: []
        };
        const { stairsDownPosition, stairsUpPosition } = initDungeonLevel();
        getPlayer().components.position = { ...stairsDownPosition };
        setCacheEntityAtLocation(getPlayer().id, stairsDownPosition);
        setCacheId(getPlayer().id, "movable");
        setCacheId(getPlayer().id, "entityIds");

        setCacheAtPath(
          `${ECS.game.depth}.playerSpawnLocs.stairsDown`,
          stairsDownPosition
        );
        setCacheAtPath(
          `${ECS.game.depth}.playerSpawnLocs.stairsUp`,
          stairsUpPosition
        );
      } else {
        const { stairsDown } = ECS.cache[ECS.game.depth].playerSpawnLocs;
        getPlayer().components.position = { ...stairsDown };
      }

      if (ECS.game.depth === 0) {
        return printToLog(`You ascend to the surface.`);
      }

      if (ECS.game.depth > 0) {
        return printToLog(`You ascend to height ${ECS.game.depth}`);
      }

      if (ECS.game.depth < 0) {
        return printToLog(`You ascend to depth ${Math.abs(ECS.game.depth)}`);
      }
    }

    if (ECS.game.userInput.type === "DESCEND") {
      // return if playert is NOT on stairs down
      const eIds = readCacheEntitiesAtLocation(getPlayer().components.position);
      if (!some(eIds, eId => getEntity(eId).components.descend)) return;

      ECS.game.depth = ECS.game.depth - 1;
      if (!ECS.cache[ECS.game.depth]) {
        ECS.cache[ECS.game.depth] = {
          tileLocations: {},
          entityLocations: {},
          entityIds: [],
          movable: [],
          openTiles: []
        };
        const { stairsDownPosition, stairsUpPosition } = initDungeonLevel();
        getPlayer().components.position = { ...stairsUpPosition };
        setCacheEntityAtLocation(getPlayer().id, stairsUpPosition);
        setCacheId(getPlayer().id, "movable");
        setCacheId(getPlayer().id, "entityIds");

        setCacheAtPath(
          `${ECS.game.depth}.playerSpawnLocs.stairsDown`,
          stairsDownPosition
        );
        setCacheAtPath(
          `${ECS.game.depth}.playerSpawnLocs.stairsUp`,
          stairsUpPosition
        );
      } else {
        // set player postition to existing stairs on level
        // need to know level we are going to
        // need to know where stairs are on each level...
        const { stairsUp } = ECS.cache[ECS.game.depth].playerSpawnLocs;
        getPlayer().components.position = { ...stairsUp };
      }

      if (ECS.game.depth === 0) {
        return printToLog(`You descend to the surface.`);
      }

      if (ECS.game.depth > 0) {
        return printToLog(`You descend to height ${ECS.game.depth}`);
      }

      if (ECS.game.depth < 0) {
        return printToLog(`You descend to depth ${Math.abs(ECS.game.depth)}`);
      }
    }

    if (ECS.game.userInput.type === "TOGGLE_OMNISCIENCE") {
      ECS.cheats.omniscience = !ECS.cheats.omniscience;
      return printToLog(
        ECS.cheats.omniscience
          ? `Cheat ON: Omniscience`
          : `Cheat OFF: Omniscience`
      );
    }
    if (ECS.game.userInput.type === "TOGGLE_INVINCIBLE") {
      ECS.cheats.invincible = !ECS.cheats.invincible;
      return printToLog(
        ECS.cheats.invincible
          ? `Cheat ON: Invincibility`
          : `Cheat OFF: Invincibility`
      );
    }
    if (ECS.game.userInput.type === "TOGGLE_BERSERK") {
      ECS.cheats.berserk = !ECS.cheats.berserk;
      return printToLog(
        ECS.cheats.berserk ? `Cheat ON: Berserker` : `Cheat OFF: Berserker`
      );
    }
  }

  return;
}

export default processUserInput;
