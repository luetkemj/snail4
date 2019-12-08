import ECS from "../ECS";
import { colors } from "../../lib/graphics";

const creatureAssemblage = () => {
  const entity = ECS.Entity(["movable"]);
  entity.addComponent("labels");
  entity.addComponent("appearance", { background: colors.defaultBGColor });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("blocking");
  entity.addComponent("health");
  entity.addComponent("trackable");

  return entity;
};

export default creatureAssemblage;
