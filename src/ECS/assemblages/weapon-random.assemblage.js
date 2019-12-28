import { sample } from "lodash";
import { setCacheEntityAtLocation } from "../cache";
import createWeapon from "./weapon.assemblage";

const slots = [
  {
    name: "Dagger",
    text: "A bit dull.",
    dmg: 1
  },
  {
    name: "Knife",
    text: "Small but sharp.",
    dmg: 2
  },
  {
    name: "Axe",
    text: "For cutting logs and splitting skulls. And we're all out of logs...",
    dmg: 5
  },
  {
    name: "Sword",
    text: "A large heavy sword for cleaving enemies in twain.",
    dmg: 5
  }
];

const randomWeaponAssemblage = (x, y) => {
  const entity = createWeapon();

  const details = sample(slots);

  entity.components.labels.name = details.name;
  entity.addComponent("damage", { dmg: details.dmg });
  entity.addComponent("description", { text: details.text });

  if (x && y) {
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default randomWeaponAssemblage;
