import { hexToHSLA } from "./hsla";

export const colors = {
  defaultColor: hexToHSLA("#ff0077"),
  // maps
  wall: hexToHSLA("#AAA"),
  floor: hexToHSLA("#555"),
  cavernFloor: hexToHSLA("#71331E"),
  // player
  player: hexToHSLA("#DAA520"),
  // monsters
  goblin: hexToHSLA("#0C9"),
  rat: hexToHSLA("#F1948A")
};

export const chars = {
  defaultChar: "?",
  // maps
  wall: "#",
  floor: "•",
  cavernFloor: "ʘ",
  // player
  player: "@",
  // monsters
  goblin: "g",
  rat: "r"
};
