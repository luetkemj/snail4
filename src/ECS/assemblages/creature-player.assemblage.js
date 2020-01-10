import { setCacheEntityAtLocation, setPlayerCacheId } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.components.labels.name = "player";

  entity.components.appearance.char = chars.player;
  entity.components.appearance.color = colors.player;

  entity.components.position.x = x;
  entity.components.position.y = y;

  entity.addComponent("playerControlled");

  entity.addComponent("description", { text: "You" });
  entity.addComponent("armor", {
    head: "",
    torso: "",
    shoulders: "",
    wrists: "",
    hands: "",
    legs: "",
    feet: ""
  });

  // entity.components.health.max = 500;
  // entity.components.health.current = 500;

  setPlayerCacheId(entity.id);
  setCacheEntityAtLocation(entity.id, { x, y });

  return entity;
};

export default playerAssemblage;
