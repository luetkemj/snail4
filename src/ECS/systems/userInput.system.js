import ECS from "../ECS";
import { removeCacheEntityAtLocation } from "../cache";
import { getStorablesAtLoc, getPlayer, getEntity } from "../../lib/getters";
import { printToLog } from "../../lib/gui";

function userInput(entities) {
  if (!ECS.game.userInput) return;

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
          return false;
        }

        // initialize pocket if none exists
        player.components.inventory.items[item.components.labels.name] = player
          .components.inventory.items[item.components.labels.name] || {
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
  }

  if (ECS.game.userInput.type === "TOGGLE_OMNISCIENCE") {
    ECS.cheats.omniscience = !ECS.cheats.omniscience;
  }
}

export default userInput;
