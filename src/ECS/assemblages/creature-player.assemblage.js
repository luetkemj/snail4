import { setCacheEntityAtLocation, setPlayerCacheId } from "../cache";
import createCreature from "./creature.assemblage";
import { chars, colors } from "../../lib/graphics";

import { createCharacter } from "../../lib/character-creation";

const charStats = createCharacter();

const playerAssemblage = (x, y) => {
  const entity = createCreature();

  entity.components.labels.name = "player";

  entity.components.abilityScores = charStats.abilityScores;
  entity.components.race = charStats.race;

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

  setPlayerCacheId(entity.id);
  setCacheEntityAtLocation(entity.id, { x, y });

  return entity;
};

export default playerAssemblage;
