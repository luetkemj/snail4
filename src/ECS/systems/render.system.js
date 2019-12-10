import { clearCanvas, renderCanvas } from "../../lib/canvas";

function render(entities) {
  clearCanvas();
  renderCanvas(entities);
}

export default render;
