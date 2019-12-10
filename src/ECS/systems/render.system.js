import ECS from "../ECS";
import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";

function render() {
  clearCanvas();

  const entities = ECS.cache.entityIds.reduce((acc, val) => {
    acc[val] = ECS.entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      const { appearance, position, fov } = entity.components;
      if (appearance && position) {
        if (fov.inFov) {
          if (entity.components.track) {
            const trackAge = ECS.game.turn - entity.components.track.createdAt;
            if (trackAge > 20) {
              entity.addComponent("garbage");
            }

            let da = trackAge * 5;
            if (ECS.cache.player[0] === entity.components.track.eId) {
              da = 100;
            }

            drawCell(entity, { char: { da: -da } });
          } else {
            drawCell(entity);
          }
        }

        if (fov.showIfRevealed && fov.revealed && !fov.inFov) {
          drawCell(entity, { char: { da: -75, ds: 0 } });
        }
      }
    });
  });
}

export default render;
