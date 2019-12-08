const pixelRatio = window.devicePixelRatio || 1;
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
import { updateHSLA } from "./hsla";

const cellWidth = 14 * pixelRatio;
const cellHeight = 14 * pixelRatio;
const fontSize = 14 * pixelRatio;

ctx.font = `normal ${fontSize}px Menlo`;

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
