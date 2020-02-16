import { get } from "lodash";
import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";
import { setCacheEntityAtLocation } from "../cache";
import { getEntityName } from "../../lib/getters";

const bandageAssemblage = (x, y) => {
  const entity = ECS.Entity();
  entity.addComponent("apply", {
    required: ["bleeding"],
    func: (target, path = "") => {
      console.log("apply func target:", target);
      target.components.bleeding = {};
      // delete target.components.bleeding[path];
      return `${getEntityName(target)}'s wounds are no longer bleeding.`;
    }
    // selectFrom: "bleeding",
    // ops: [
    //   {
    //     op: "delete property",
    //     to: "selection",
    //     msg: target => `${target} has stopped bleeding.`
    //   }
    // ]
  });
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
