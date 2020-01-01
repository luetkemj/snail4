import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";

const armorAssemblage = () => {
  const entity = ECS.Entity();
  entity.addComponent("labels");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.items,
    char: chars.armor,
    color: colors.armor
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("droppable");
  entity.addComponent("gettable");
  entity.addComponent("hud");
  entity.addComponent("damageReduction", { dr: 1 });
  entity.addComponent("wearable", { slots: ["torso"] });
  entity.addComponent("description", { text: "armor" });
  entity.addComponent("type", componentTypes.ARMOR);

  return entity;
};

export default armorAssemblage;
