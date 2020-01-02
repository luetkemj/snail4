import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";

const chestAssemblage = () => {
  const entity = ECS.Entity();
  entity.addComponent("inventory");
  entity.addComponent("labels", { name: "Chest" });
  entity.addComponent("appearance", {
    char: chars.chest,
    color: colors.chest,
    background: colors.defaultBGColor,
    layer: layers.items
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  // entity.addComponent("health");
  entity.addComponent("droppable");
  entity.addComponent("gettable");
  entity.addComponent("wieldable");
  entity.addComponent("damage", { dmg: 2 });

  entity.addComponent("description", {
    text: `An old wooden chest. Seems sturdy despite it's apparent age.`
  });

  // should make you blind if you wear it!
  entity.addComponent("wearable", { slots: ["head"] });
  entity.addComponent("damageReduction", { dr: 1 });
  entity.addComponent("hud");
  entity.addComponent("type", componentTypes.MISC);

  return entity;
};

export default chestAssemblage;
