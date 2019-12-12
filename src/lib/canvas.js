const pixelRatio = window.devicePixelRatio || 1;
const canvasMap = document.querySelector("#map");
const ctx = canvasMap.getContext("2d");
import { updateHSLA } from "./hsla";

export const layers = {
  ground: 100,
  tracks: 200,
  items: 300,
  player: 400,
  abovePlayer: 500,
  sky: 600
};

export const grid = {
  width: 100,
  height: 34,

  mapWidth: 79,
  mapHeight: 29,

  hudWidth: 21,
  hudHeight: 34,

  hud2Height: 2,
  hud2Width: 79,

  logHeight: 79,
  logWidth: 79,

  font: "Menlo",
  fontSize: 15,
  lineHeight: 1.2
};

const cellWidth = grid.fontSize * pixelRatio;
const cellHeight = grid.fontSize * grid.lineHeight * pixelRatio;
const fontSize = grid.fontSize * pixelRatio;

canvasMap.style.cssText = `width: ${grid.fontSize *
  grid.width}; height: ${grid.fontSize * grid.lineHeight * grid.height}`;
canvasMap.width = cellWidth * grid.width;
canvasMap.height = cellHeight * grid.height;

ctx.font = `normal ${fontSize}px ${grid.font}`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

const drawBackground = (color, position) => {
  if (color === "transparent") return;

  ctx.fillStyle = color.hsla;
  ctx.fillRect(
    position.x * cellWidth,
    position.y * cellHeight,
    cellWidth,
    cellHeight
  );
};

const drawChar = (char, color, position) => {
  ctx.fillStyle = color.hsla;
  ctx.fillText(
    char,
    position.x * cellWidth + cellWidth / 2,
    position.y * cellHeight + cellHeight / 2
  );
};

export const drawCell = (entity, HSLAOptions = { bg: {}, char: {} }) => {
  const {
    components: {
      appearance: { char, color, background },
      position
    }
  } = entity;

  const bgColor =
    background === "transparent"
      ? "transparent"
      : updateHSLA(background, HSLAOptions.bg || {});
  const charColor = updateHSLA(color, HSLAOptions.char || {});

  drawBackground(bgColor, position);
  drawChar(char, charColor, position);
};

export const clearCanvas = () =>
  ctx.clearRect(0, 0, canvasMap.width, canvasMap.height);

export const pxToCell = ev => {
  const bounds = canvasMap.getBoundingClientRect();
  const relativeX = ev.clientX - bounds.left;
  const relativeY = ev.clientY - bounds.top;
  const colPos = Math.trunc((relativeX / cellWidth) * pixelRatio);
  const rowPos = Math.trunc((relativeY / cellHeight) * pixelRatio);

  return [colPos, rowPos];
};

export const onClick = handler => {
  canvasMap.addEventListener("click", ev => {
    const cell = pxToCell(ev);
    handler(cell[0], cell[1]);
  });
};

export const onMouseMove = handler => {
  canvasMap.addEventListener("mousemove", ev => {
    const cell = pxToCell(ev);
    handler(cell[0], cell[1]);
  });
};
