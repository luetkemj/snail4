import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { setCacheEntityAtLocation } from "../cache";

const stairsAssemblage = ({ direction, position }) => {
  const entity = ECS.Entity();
  entity.addComponent("hud");
  entity.addComponent("fov");

  if (direction === "up") {
    entity.addComponent("labels", { name: "Stairs up" });
    entity.addComponent("description", {
      text: `A set of stairs leading up`
    });
    entity.addComponent("appearance", {
      background: colors.defaultBGColor,
      char: chars.stairsUp,
      color: colors.stairsUp,
      layer: layers.player
    });
    entity.addComponent("ascend");
  }

  if (direction === "down") {
    entity.addComponent("labels", { name: "Stairs down" });
    entity.addComponent("description", {
      text: `A set of stairs leading down in to the depths...`
    });
    entity.addComponent("appearance", {
      background: colors.defaultBGColor,
      char: chars.stairsDown,
      color: colors.stairsDown,
      layer: layers.player
    });
    entity.addComponent("descend");
  }

  entity.addComponent("position", { ...position });
  setCacheEntityAtLocation(entity.id, { ...position });

  return entity;
};

export default stairsAssemblage;
