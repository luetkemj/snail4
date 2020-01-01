import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";

const weaponAssemblage = () => {
  const entity = ECS.Entity();
  entity.addComponent("labels");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    layer: layers.items,
    char: chars.weapon,
    color: colors.weapon
  });
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("droppable");
  entity.addComponent("gettable");
  entity.addComponent("hud");
  entity.addComponent("damage", { dmg: 3 });
  entity.addComponent("wieldable");
  entity.addComponent("description", { text: "weapon" });
  entity.addComponent("type", componentTypes.WEAPON);

  return entity;
};

export default weaponAssemblage;
