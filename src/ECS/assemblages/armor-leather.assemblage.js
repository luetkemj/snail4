import { sample } from "lodash";
import { setCacheEntityAtLocation } from "../cache";
import createArmor from "./armor.assemblage";

const slots = [
  {
    name: "Leather Helm",
    slot: "head",
    text: "A crude leather helmet, battered and showing age.",
    dr: 1
  },
  {
    name: "Leather Jerkin",
    slot: "torso",
    text: "A sleeveless leather jerkin.",
    dr: 1
  },
  {
    name: "Leather Pauldrons",
    slot: "shoulders",
    text: "Leather shoulder pads.",
    dr: 1
  },
  {
    name: "Leather Bracers",
    slot: "wrists",
    text: "Ornate engravings decorate these bracers.",
    dr: 1
  },
  {
    name: "Leather gloves",
    slot: "hands",
    text: "Stiff leather gloves - more suitable to a gardener than a warrior.",
    dr: 1
  },
  {
    name: "Leather Pants",
    slot: "legs",
    text: "Rocking leather pants.",
    dr: 1
  },
  {
    name: "Leather Boots",
    slot: "feet",
    text: "A pair of tough leather boots. Just your size!",
    dr: 1
  }
];

const leatherArmorAssemblage = (x, y) => {
  const entity = createArmor();

  const details = sample(slots);

  entity.components.labels.name = details.name;
  entity.addComponent("damageReduction", { dr: details.dr });
  entity.addComponent("wearable", { slots: [details.slot] });
  entity.addComponent("description", { text: details.text });

  if (x && y) {
    entity.components.position.x = x;
    entity.components.position.y = y;
    setCacheEntityAtLocation(entity.id, { x, y });
  }

  return entity;
};

export default leatherArmorAssemblage;
