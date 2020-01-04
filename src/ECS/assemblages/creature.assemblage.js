import ECS from "../ECS";
import { colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";

const creatureAssemblage = () => {
  const entity = ECS.Entity(["movable"]);
  entity.addComponent("inventory");
  entity.addComponent("labels");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.player
  });
  entity.addComponent("wallet", { copperValue: 0 });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("blocking");
  entity.addComponent("health");
  entity.addComponent("trackable");
  entity.addComponent("droppable");

  entity.addComponent("wieldable");
  entity.addComponent("damage", { dmg: 2 });

  entity.addComponent("wearable", { slots: ["head"] });
  entity.addComponent("damageReduction", { dr: 1 });

  entity.addComponent("hud");

  entity.addComponent("type", componentTypes.MISC);

  return entity;
};

export default creatureAssemblage;
