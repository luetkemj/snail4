import ECS from "../ECS";
import { colors, chars } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

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
  entity.addComponent("storable");
  entity.addComponent("hud");
  entity.addComponent("damage", { dmg: 3 });
  entity.addComponent("wieldable");
  entity.addComponent("description", { text: "weapon" });

  return entity;
};

export default weaponAssemblage;
