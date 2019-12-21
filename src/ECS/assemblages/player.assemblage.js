import ECS from "../ECS";
import { setCacheEntityAtLocation, setCacheId } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.components.labels.name = "player";

  entity.components.appearance.char = chars.player;
  entity.components.appearance.color = colors.player;

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("playerControlled");

  entity.addComponent("description", { text: "You" });

  entity.components.health.max = 100;
  entity.components.health.current = 100;

  ECS.entities[entity.id] = entity;
  setCacheId(entity.id, "player");
  setCacheEntityAtLocation(entity.id, { x, y });

  return entity;
};

export default playerAssemblage;
