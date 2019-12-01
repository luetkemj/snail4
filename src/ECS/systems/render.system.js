import ECS from "../ECS";
import Cell from "overprint/overprint/cell";
import { updateHSLA } from "../../lib/hsla";

const render = entities => {
  ECS.game.grid.clear();

  ECS.cache.entityIds.forEach(key => {
    const {
      components: { appearance, position, fov, playerControlled }
    } = entities[key];

    if (appearance && position && fov) {
      // If it's in the Field Of Vision
      if (fov.inFov) {
        const dl = 50 - fov.distance * 12;

        ECS.game.grid.writeCell(
          position.x,
          position.y,
          Cell(appearance.char, appearance.color.hsla)
        );
      }

      // If it's been revealed but not in the current fov
      if (fov.revealed && !fov.inFov) {
        ECS.game.grid.writeCell(
          position.x,
          position.y,
          Cell(
            appearance.char,
            updateHSLA(appearance.color, { da: -75, ds: 0 }).hsla
          )
        );
      }
    }
  });

  ECS.game.grid.render();
};

export default render;
