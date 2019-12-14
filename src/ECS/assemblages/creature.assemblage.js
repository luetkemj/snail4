import ECS from "../ECS";
import { colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

const creatureAssemblage = () => {
  const entity = ECS.Entity(["movable"]);
  entity.addComponent("labels");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.player
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("blocking");
  entity.addComponent("health");
  entity.addComponent("trackable");

  entity.addComponent("hud");

  return entity;
};

export default creatureAssemblage;
