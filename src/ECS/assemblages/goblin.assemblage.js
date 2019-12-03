import ECS from "../ECS";
import { setCacheEntityAtLocation } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const goblinAssemblage = (x, y) => {
  const entity = createCreature();
  entity.components.appearance.char = chars.goblin;
  entity.components.appearance.color = colors.goblin;

  entity.components.position.x = x;
  entity.components.position.y = y;

  ECS.entities[entity.id] = entity;
  setCacheEntityAtLocation(entity.id, { x, y });
};

export default goblinAssemblage;
