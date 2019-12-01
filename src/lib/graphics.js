import { hexToHSLA } from "./hsla";

const wall = hexToHSLA("#AAA");
const floor = hexToHSLA("#555");
const cavernFloor = hexToHSLA("#71331E");

export const colors = {
  wall: wall.hsla,
  floor: floor.hsla,
  cavernFloor: cavernFloor.hsla
};
