import { sample } from "lodash";
import { setCacheEntityAtLocation } from "../cache";
import createArmor from "./armor.assemblage";

const slots = [
  {
    name: "Leather Helm",
    slot: "head",
    text: "A crude leather helmet, battered and showing age.",
    dr: 1,
    arMax: 10,
    arCurrent: 10,
    sdcMax: 20,
    sdcCurrent: 20
  },
  {
    name: "Leather Mask",
    slot: "face",
    text: "A rough leather mask, complete with molded scowl and fangs.",
    dr: 1,
    arMax: 10,
    arCurrent: 10,
    sdcMax: 20,
    sdcCurrent: 20
  },
  {
    name: "Leather Jerkin",
    slot: "torso",
    text: "A sleeveless leather jerkin.",
    dr: 1,
    arMax: 10,
    arCurrent: 10,
    sdcMax: 20,
    sdcCurrent: 20
  }
  // {
  //   name: "Leather Pauldrons",
  //   slot: "shoulders",
  //   text: "Leather shoulder pads.",
  //   dr: 1,
  //   ar: 10
  // },
  // {
  //   name: "Leather Bracers",
  //   slot: "wrists",
  //   text: "Ornate engravings decorate these bracers.",
  //   dr: 1,
  //   ar: 10
  // },
  // {
  //   name: "Leather gloves",
  //   slot: "hands",
  //   text: "Stiff leather gloves - more suitable to a gardener than a warrior.",
  //   dr: 1,
  //   ar: 10
  // },
  // {
  //   name: "Leather Pants",
  //   slot: "legs",
  //   text: "Rocking leather pants.",
  //   dr: 1,
  //   ar: 10
  // },
  // {
  //   name: "Leather Boots",
  //   slot: "feet",
  //   text: "A pair of tough leather boots. Just your size!",
  //   dr: 1,
  //   ar: 10
  // }
];

const leatherArmorAssemblage = (x, y) => {
  const entity = createArmor();

  const details = sample(slots);

  entity.components.labels.name = details.name;

  entity.components.ar = {
    max: details.arMax,
    current: details.arCurrent
  };

  entity.components.sdc = {
    max: details.sdcMax,
    current: details.sdcCurrent
  };

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
