import ECS from "../ECS";
import { colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

const creatureAssemblage = () => {
  const entity = ECS.Entity(["movable"]);
  entity.addComponent("inventory");
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
  entity.addComponent("droppable");

  entity.addComponent("damage", { dmg: 1 });
  entity.addComponent("wieldable");

  entity.addComponent("hud");

  return entity;
};

export default creatureAssemblage;
