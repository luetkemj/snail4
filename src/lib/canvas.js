import ECS from "../ECS/ECS";
const pixelRatio = window.devicePixelRatio || 1;
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
import { updateHSLA } from "./hsla";

const WIDTH = 80;
const HEIGHT = 50;
const FONT_SIZE = 15;
const FONT = "Menlo";

const cellWidth = FONT_SIZE * pixelRatio;
const cellHeight = FONT_SIZE * pixelRatio;
const fontSize = FONT_SIZE * pixelRatio;

canvas.style.cssText = `width: ${FONT_SIZE * WIDTH}; height: ${FONT_SIZE *
  HEIGHT}`;
canvas.width = cellWidth * WIDTH;
canvas.height = cellHeight * HEIGHT;

ctx.font = `normal ${fontSize}px ${FONT}`;
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

const drawCell = (entity, HSLAOptions = { bg: {}, char: {} }) => {
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

export const renderCanvas = entities => {
  Object.keys(entities).forEach(eId => {
    const entity = entities[eId];

    const { appearance, position, revealed, fov } = entity.components;

    if (appearance && position) {
      if (fov.inFov) {
        drawCell(entity);
      }

      if (fov.showIfRevealed && fov.revealed && !fov.inFov) {
        drawCell(entity, { char: { da: -75, ds: 0 } });
      }
    }
  });
};

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
