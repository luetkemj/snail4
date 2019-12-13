import ECS from "../ECS";
import { groupBy } from "lodash";
import { clearCanvas, drawCell } from "../../lib/canvas";
import { colors } from "../../lib/graphics";

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

  const logs = ECS.log.slice(ECS.log.length - 3);
  logs.forEach((entry, entryIdx) => {
    entry.split("").forEach((char, charIdx) => {
      const charEntity = {
        components: {
          appearance: {
            char,
            color: colors.player,
            background: colors.defaultBGColor
          },
          position: {
            x: charIdx + ECS.game.grid.log.x,
            y: entryIdx + ECS.game.grid.log.y
          }
        }
      };
      const opacity = entryIdx * 75 || 50;
      drawCell(charEntity, { char: { a: opacity } });
    });
  });
}

export default render;
