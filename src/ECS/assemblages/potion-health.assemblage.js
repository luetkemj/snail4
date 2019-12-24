import ECS from "../ECS";
import { setCacheEntityAtLocation } from "../cache";
import createPotion from "./potion.assemblage";

const healthPotionAssemblage = (x, y) => {
  const entity = createPotion();
  entity.components.labels.name = "Potion of Health";

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("description", {
    text: `You see a small vial of swirling red liquid.`
  });

  entity.addComponent("consumable", {
    effects: [{ buff: { component: "health", delta: 10 } }]
  });

  setCacheEntityAtLocation(entity.id, { x, y });
};

export default healthPotionAssemblage;
