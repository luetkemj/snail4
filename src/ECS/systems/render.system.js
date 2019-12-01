import ECS from "../ECS";
import Cell from "overprint/overprint/cell";

const render = entities => {
  ECS.game.grid.clear();

  ECS.cache.entityIds.forEach(key => {
    const {
      components: { appearance, position }
    } = entities[key];

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
