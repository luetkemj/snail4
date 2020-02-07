import { printToLog } from "./gui";
import { getEntity, getTurnNumber } from "./getters";
import { layers } from "./canvas";

export const kill = (target, options = { deathMsg: "" }) => {
  let entity = target;

  if (typeof entity === "string") {
    // entity is an id. we need to get the entity itself
    entity = getEntity(entity);
  }

  printToLog(options.deathMsg || `${entity.components.labels.name} is dead.`);

  entity.addComponent("dead", { timeOfDeath: getTurnNumber() });
  entity.components.labels.name = entity.components.labels.name + " corpse";

  if (entity.components.description) {
    entity.components.description.text = `You see a crumpled ${entity.components.labels.name} on the floor.`;
  }

  entity.addComponent("gettable");
  entity.components.appearance.layer = layers.items;
  entity.components.appearance.char = "%";
  entity.removeComponent("moveToPlayer");
  entity.removeComponent("playerControlled");
  entity.removeComponent("blocking");
};
