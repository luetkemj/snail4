import ECS from "../ECS";
import { groupBy, remove } from "lodash";
import { clearCanvas, drawCell, layers } from "../../lib/canvas";
import { colors } from "../../lib/graphics";
import { updateHSLA } from "../../lib/hsla";
import { getEntitiesAtLoc, getPlayer } from "../../lib/getters";
import { rectangle } from "../../lib/grid";

const buildCharEntity = ({
  char,
  color = colors.hudText,
  background = colors.defaultBGColor,
  x,
  y
}) => ({
  components: {
    appearance: {
      char,
      color,
      background
    },
    position: {
      x,
      y
    }
  }
});

const drawText = (
  text,
  { color = colors.hudText, background = "transparent", x, y, charAlpha = 100 }
) => {
  text.split("").forEach((char, charIdx) => {
    const charEntity = buildCharEntity({
      char,
      color,
      background,
      x: charIdx + x,
      y: y
    });
    drawCell(charEntity, { char: { a: charAlpha } });
  });
};

// const renderHealth
const drawBar = (current, max, color, y) => {
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
      const charEntity = buildCharEntity({
        char: "",
        color: "transparent",
        background: color,
        x: idx + ECS.game.grid.hud.x,
        y: y + ECS.game.grid.hud.y
      });
      drawCell(charEntity);
    });

  if (remainder) {
    const charEntity = buildCharEntity({
      char: "",
      color: "transparent",
      background: color,
      x: bars.length + ECS.game.grid.hud.x,
      y: y + ECS.game.grid.hud.y
    });
    drawCell(charEntity);
  }
};

const drawRectangle = ({ x, y, width, height, color }) => {
  const rect = rectangle({ x, y, width, height });

  Object.values(rect.tiles).forEach(position => {
    const charEntity = buildCharEntity({
      char: "",
      color: "transparent",
      background: color,
      ...position
    });
    drawCell(charEntity);
  });
};

const renderLog = () => {
  const logs = ECS.log.slice(ECS.log.length - 3);
  logs.forEach((entry, entryIdx) => {
    drawText(entry, {
      color: colors.hudText,
      background: colors.defaultBGColor,
      x: ECS.game.grid.log.x,
      y: entryIdx + ECS.game.grid.log.y,
      charAlpha: entryIdx * 75 || 50
    });
  });
};

const renderHud = entities => {
  const drawTextHud = (msg, y) =>
    drawText(msg, {
      color: colors.hudText,
      background: "transparent",
      x: ECS.game.grid.hud.x,
      y: y + ECS.game.grid.hud.y
    });

  entities.forEach((entity, idx) => {
    const {
      components: {
        appearance: { char, color },
        labels: { name }
      }
    } = entity;

    drawTextHud(`${char}: ${name}`, idx * 3);

    drawBar(
      ECS.game.grid.hud.width,
      ECS.game.grid.hud.width,
      updateHSLA(colors.healthBar, { a: 15 }),
      idx * 3 + 1
    );

    drawBar(
      entity.components.health.current,
      entity.components.health.max,
      colors.healthBar,
      idx * 3 + 1
    );

    const status = entity.components.dead ? "Dead" : "Health";
    drawTextHud(status, idx * 3 + 1);
  });
};

const renderHud2 = () => {
  // get entities at player loc
  const entities = getEntitiesAtLoc(getPlayer().components.position);
  // sort by layer
  const layerGroups = groupBy(entities, "components.appearance.layer");

  const drawTextHud2 = msg =>
    drawText(msg, {
      color: colors.hudText,
      background: "transparent",
      x: ECS.game.grid.hud2.x,
      y: ECS.game.grid.hud2.y
    });

  // draw menu
  drawText(`(i)Inventory`, {
    color: updateHSLA(colors.hudText, { l: 50 }),
    background: "transparent",
    x: ECS.game.grid.hud2.x,
    y: ECS.game.grid.hud2.y + 1
  });

  // print item descriptions
  if (layerGroups[layers.items]) {
    return drawTextHud2(
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
      return drawTextHud2(nonPlayerTracks[0].components.description.text);
    }
  }

  // print ground descriptions
  if (layerGroups[layers.ground]) {
    return drawTextHud2(
      layerGroups[layers.ground][0].components.description.text
    );
  }
};

export const renderInventory = () => {
  // inventory background
  drawRectangle({
    x: ECS.game.grid.menu.x,
    y: ECS.game.grid.menu.y,
    width: ECS.game.grid.menu.width,
    height: ECS.game.grid.menu.height,
    color: colors.defaultBGColor
  });

  // selected item background
  drawRectangle({
    x: ECS.game.grid.menu2.x,
    y: ECS.game.grid.menu2.y,
    width: ECS.game.grid.menu2.width,
    height: ECS.game.grid.menu2.height,
    color: colors.defaultBGColor
  });

  const inventory = getPlayer().components.inventory;
  const inventoryItemNames = Object.keys(inventory.items);

  // draw selected item details
  if (inventoryItemNames.length) {
    drawText(inventory.currentSelected, {
      x: ECS.game.grid.menu2.x + 1,
      y: ECS.game.grid.menu2.y + 3
    });

    const eId = inventory.items[inventory.currentSelected].eIds[0];
    if (eId) {
      const entity = ECS.entities[eId];

      // draw description
      // drawText(entity.components.description.text, {
      //   x: ECS.game.grid.menu2.x + 1,
      //   y: ECS.game.grid.menu2.y + 3
      // });

      // actions
      let actions = "";

      if (entity.components.droppable) {
        actions = "(d)Drop ";
      }

      drawText(actions, {
        x: ECS.game.grid.menu2.x + 1,
        y: ECS.game.grid.menu2.y + 5
      });
    }
  }

  // draw inventory
  drawText("INVENTORY", {
    x: ECS.game.grid.menu.x + 1,
    y: ECS.game.grid.menu.y + 1
  });
  inventoryItemNames.forEach((name, idx) => {
    const cursor = name === inventory.currentSelected ? "*" : " ";
    drawText(`${cursor}${inventory.items[name].eIds.length} ${name}`, {
      x: ECS.game.grid.menu.x + 1,
      y: ECS.game.grid.menu.y + 3 + idx
    });
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
  if (ECS.game.mode === "INVENTORY") {
    renderInventory();
  }
}

export default render;
