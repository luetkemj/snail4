import { sample } from "lodash";
import { setCacheEntityAtLocation } from "../cache";
import createWeapon from "./weapon.assemblage";

const slots = [
  {
    name: "Dagger",
    text: "A bit dull.",
    dmg: 10,
    type: "pierce"
  },
  {
    name: "Knife",
    text: "Small but sharp.",
    dmg: 12,
    type: "slash"
  },
  {
    name: "Axe",
    text: "For cutting logs and splitting skulls. And we're all out of logs...",
    dmg: 20,
    type: "slash"
  },
  {
    name: "Sword",
    text: "A large heavy sword for cleaving enemies in twain.",
    dmg: 20,
    type: "slash"
  },
  {
    name: "Club",
    text: "A crudely shaped peice of wood with teeth and bone embedded in it.",
    dmg: 15,
    type: "bludgeon"
  }
];

const randomWeaponAssemblage = (x, y) => {
  const entity = createWeapon();

  const details = sample(slots);

  entity.components.labels.name = details.name;
  entity.addComponent("damage", { dmg: details.dmg, type: details.type });
  entity.addComponent("description", { text: details.text });

  if (x && y) {
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default randomWeaponAssemblage;
