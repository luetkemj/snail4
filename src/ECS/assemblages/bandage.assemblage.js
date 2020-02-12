import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";
import { setCacheEntityAtLocation } from "../cache";

const bandageAssemblage = (x, y) => {
  const entity = ECS.Entity();
  entity.addComponent("labels", { name: "Bandage" });
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.items,
    char: chars.item,
    color: colors.bandage
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("droppable");
  entity.addComponent("gettable");
  entity.addComponent("hud");
  entity.addComponent("description", {
    text:
      "A surprisingly fresh bandage able to stave off the bleeding on fresh wounds."
  });
  entity.addComponent("type", componentTypes.MISC);

  if (x && y) {
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default bandageAssemblage;
