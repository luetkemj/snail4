import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";

const potionAssemblage = () => {
  const entity = ECS.Entity();
  entity.addComponent("labels");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.items,
    char: chars.potion,
    color: colors.potion
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("droppable");
  entity.addComponent("gettable");

  entity.addComponent("hud");

  entity.addComponent("type", componentTypes.POTION);

  return entity;
};

export default potionAssemblage;
