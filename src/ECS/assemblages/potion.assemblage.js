import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

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
  entity.addComponent("storable");

  entity.addComponent("hud");

  return entity;
};

export default potionAssemblage;
