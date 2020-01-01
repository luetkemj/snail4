import { hexToHSLA } from "./hsla";

export const colors = {
  defaultColor: hexToHSLA("#ff0077"),
  defaultBGColor: hexToHSLA("#000"),

  inventoryHighlight: hexToHSLA("#A9CCE3"),

  // items:
  armor: hexToHSLA("#DAA520"),
  potion: hexToHSLA("#DAA520"),
  weapon: hexToHSLA("#DAA520"),
  // log
  hudText: hexToHSLA("#fff"),
  healthBar: hexToHSLA("#B91906"),
  // maps
  wall: hexToHSLA("#AAA"),
  floor: hexToHSLA("#555"),
  cavernFloor: hexToHSLA("#71331E"),
  // player
  player: hexToHSLA("#FFF"),
  // monsters
  goblin: hexToHSLA("#0C9"),
  rat: hexToHSLA("#F1948A")
};

export const chars = {
  defaultChar: "?",
  // equipment
  armor: "[",
  weapon: ")",
  // items
  potion: "!",
  // maps
  wall: "#",
  floor: "•",
  cavernFloor: "•",
  // tracks
  track: "•",
  // player
  player: "@",
  // monsters
  goblin: "g",
  rat: "r"
};
