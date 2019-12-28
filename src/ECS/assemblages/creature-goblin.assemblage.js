import { setCacheEntityAtLocation } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const goblinAssemblage = (x, y) => {
  const entity = createCreature();
  entity.components.labels.name = "goblin";
  entity.components.appearance.char = chars.goblin;
  entity.components.appearance.color = colors.goblin;
  entity.addComponent("moveToPlayer", { aggro: 10 });
  entity.addComponent("description", {
    text: `You see a greedy little goblin bent on cruel revenge.`
  });
  entity.addComponent("armor");

  if (x && y) {
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default goblinAssemblage;
