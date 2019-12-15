import { updateHSLA } from "./hsla";
const pixelRatio = window.devicePixelRatio || 1;
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

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

  map: {
    width: 79,
    height: 29,
    x: 21,
    y: 3
  },

  log: {
    width: 79,
    height: 3,
    x: 21,
    y: 0
  },

  hud: {
    width: 20,
    height: 34,
    x: 0,
    y: 0
  },

  hud2: {
    width: 79,
    height: 2,
    x: 21,
    y: 32
  },

  font: "Menlo",
  fontSize: 15,
  lineHeight: 1.2
};

const cellWidth = grid.fontSize * pixelRatio;
const cellHeight = grid.fontSize * grid.lineHeight * pixelRatio;
const fontSize = grid.fontSize * pixelRatio;

canvas.style.cssText = `width: ${grid.fontSize *
  grid.width}; height: ${grid.fontSize * grid.lineHeight * grid.height}`;
canvas.width = cellWidth * grid.width;
canvas.height = cellHeight * grid.height;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

export const pxToCell = ev => {
  const bounds = canvas.getBoundingClientRect();
  const relativeX = ev.clientX - bounds.left;
  const relativeY = ev.clientY - bounds.top;
  const colPos = Math.trunc((relativeX / cellWidth) * pixelRatio);
  const rowPos = Math.trunc((relativeY / cellHeight) * pixelRatio);

  return [colPos, rowPos];
};

export const onClick = handler => {
  canvas.addEventListener("click", ev => {
    const cell = pxToCell(ev);
    handler(cell[0], cell[1]);
  });
};

export const onMouseMove = handler => {
  canvas.addEventListener("mousemove", ev => {
    const cell = pxToCell(ev);
    handler(cell[0], cell[1]);
  });
};
