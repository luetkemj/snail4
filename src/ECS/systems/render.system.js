import ECS from "../ECS";
import { groupBy, remove } from "lodash";
import { clearCanvas, drawCell, layers } from "../../lib/canvas";
import { colors } from "../../lib/graphics";
import { updateHSLA } from "../../lib/hsla";
import { getEntitiesAtLoc, getPlayer } from "../../lib/getters";

const renderLog = () => {
  const logs = ECS.log.slice(ECS.log.length - 3);
  logs.forEach((entry, entryIdx) => {
    entry.split("").forEach((char, charIdx) => {
      const charEntity = {
        components: {
          appearance: {
            char,
            color: colors.hudText,
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
};

// render hud
const renderHudText = (msg, y) => {
  msg.split("").forEach((char, charIdx) => {
    const charEntity = {
      components: {
        appearance: {
          char,
          color: colors.hudText,
          background: "transparent"
        },
        position: {
          x: charIdx + ECS.game.grid.hud.x,
          y: y + ECS.game.grid.hud.y
        }
      }
    };
    drawCell(charEntity);
  });
};

const renderHud2Text = (msg, y = 0) => {
  msg.split("").forEach((char, charIdx) => {
    const charEntity = {
      components: {
        appearance: {
          char,
          color: colors.hudText,
          background: "transparent"
        },
        position: {
          x: charIdx + ECS.game.grid.hud2.x,
          y: y + ECS.game.grid.hud2.y
        }
      }
    };
    drawCell(charEntity);
  });
};

// const renderHealth
const renderBar = (current, max, color, y) => {
  const curr = current > -1 ? current : 0;
  const width = ECS.game.grid.hud.width;
  const percent = (curr / max) * width;
  const bars = Math.ceil(percent);
  const remainder = percent % 1;

  if (!bars) {
    return;
  }

  Array(bars)
    .fill(0)
    .forEach((bar, idx) => {
      const charEntity = {
        components: {
          appearance: {
            char: "",
            color: "transparent",
            background: color
          },
          position: {
            x: idx + ECS.game.grid.hud.x,
            y: y + ECS.game.grid.hud.y
          }
        }
      };
      drawCell(charEntity);
    });

  if (remainder) {
    const charEntity = {
      components: {
        appearance: {
          char: "",
          color: "transparent",
          background: color
        },
        position: {
          x: bars.length + ECS.game.grid.hud.x,
          y: y + ECS.game.grid.hud.y
        }
      }
    };
    drawCell(charEntity);
  }
};

const renderHud2 = () => {
  // get entities at player loc
  const entities = getEntitiesAtLoc(getPlayer().components.position);
  // sort by layer
  const layerGroups = groupBy(entities, "components.appearance.layer");

  // print item descriptions
  if (layerGroups[layers.items]) {
    return renderHud2Text(
      layerGroups[layers.items][0].components.description.text
    );
  }

  // print track descriptions
  if (layerGroups[layers.tracks]) {
    // filter out the player tracks
    const nonPlayerTracks = layerGroups[layers.tracks].filter(
      entity => entity.components.track.eId !== getPlayer().id
    );
    if (nonPlayerTracks.length) {
      return renderHud2Text(nonPlayerTracks[0].components.description.text);
    }
  }

  // print ground descriptions
  if (layerGroups[layers.ground]) {
    return renderHud2Text(
      layerGroups[layers.ground][0].components.description.text
    );
  }
};

const renderHud = entities => {
  entities.forEach((entity, idx) => {
    const {
      components: {
        appearance: { char, color },
        labels: { name }
      }
    } = entity;

    renderHudText(`${char}: ${name}`, idx * 3);

    renderBar(
      ECS.game.grid.hud.width,
      ECS.game.grid.hud.width,
      updateHSLA(colors.healthBar, { a: 15 }),
      idx * 3 + 1
    );

    renderBar(
      entity.components.health.current,
      entity.components.health.max,
      colors.healthBar,
      idx * 3 + 1
    );

    const status = entity.components.dead ? "Dead" : "Health";
    renderHudText(status, idx * 3 + 1);
  });
};

function render() {
  clearCanvas();

  // render map
  const entities = ECS.cache.entityIds.reduce((acc, val) => {
    acc[val] = ECS.entities[val];
    return acc;
  }, {});

  const layerGroups = groupBy(entities, "components.appearance.layer");
  const layerCake = Object.keys(layerGroups);
  const hudEntities = [];

  layerCake.forEach(layer => {
    Object.values(layerGroups[layer]).forEach(entity => {
      if (entity.components.hud && entity.components.fov.inFov) {
        hudEntities.push(entity);
      }
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

  // put player at top of hud entities array
  const player = remove(hudEntities, x => x.id === ECS.cache.player[0]);

  renderLog();
  renderHud([...player, ...hudEntities]);
  renderHud2();
}

export default render;
