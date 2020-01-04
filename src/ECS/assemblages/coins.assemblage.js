import ECS from "../ECS";
import { setCacheEntityAtLocation } from "../cache";
import { chars, colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";
import { componentTypes } from "../../lib/dictionary";
import { random } from "lodash";

const coinsAssemblage = (x, y) => {
  const entity = ECS.Entity();

  entity.addComponent("hud");
  entity.addComponent("fov");
  entity.addComponent("type", componentTypes.MISC);
  entity.addComponent("labels", { name: "A pile of coins" }),
    entity.addComponent("description", {
      text: `You see a pile of coins scattered on the floor.`
    });

  entity.addComponent("currency", { copperValue: random(1, 1000) });
  entity.addComponent("gettable");
  entity.addComponent("appearance", {
    background: colors.defaultBGColor,
    char: chars.currency,
    color: colors.currency,
    layer: layers.items
  });

  if (x && y) {
    entity.addComponent("position");
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default coinsAssemblage;
