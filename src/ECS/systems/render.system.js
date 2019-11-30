import ECS from "../ECS";
import Cell from "overprint/overprint/cell";

const render = function systemRender(entities) {
  ECS.game.grid.clear();

  Object.keys(entities).forEach(key => {
    const entity = entities[key];
    const { components } = entity;
    const { appearance, position } = components;

    if (appearance && position) {
      ECS.game.grid.writeCell(
        position.x,
        position.y,
        Cell(appearance.char, appearance.color)
      );
    }
  });

  ECS.game.grid.render();
};

export default render;
