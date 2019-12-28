import { setCacheEntityAtLocation } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const ratAssemblage = (x, y) => {
  const entity = createCreature();
  entity.components.labels.name = "rat";

  entity.components.appearance.char = chars.rat;
  entity.components.appearance.color = colors.rat;

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("moveToPlayer", { aggro: 5 });

  entity.addComponent("description", {
    text: `You see a filthy rat with matted fur and carnage in it's beady little eyes.`
  });

  setCacheEntityAtLocation(entity.id, { x, y });
};

export default ratAssemblage;
