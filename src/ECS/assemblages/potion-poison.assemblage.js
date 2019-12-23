import ECS from "../ECS";
import { setCacheEntityAtLocation } from "../cache";
import createPotion from "./potion.assemblage";

const healthPotionAssemblage = (x, y) => {
  const entity = createPotion();
  entity.components.labels.name = "Potion of Poison";

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("description", {
    text: `You see a small vial of swirling green liquid.`
  });

  entity.addComponent("consumable", {
    effects: [{ buff: { component: "health", delta: -5 } }]
  });

  ECS.entities[entity.id] = entity;
  setCacheEntityAtLocation(entity.id, { x, y });
};

export default healthPotionAssemblage;
