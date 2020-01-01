import ECS from "../ECS";
import { compact, groupBy, remove } from "lodash";
import { clearCanvas, drawCell, layers } from "../../lib/canvas";
import { colors } from "../../lib/graphics";
import { updateHSLA } from "../../lib/hsla";
import { getEntity, getEntitiesAtLoc, getPlayer } from "../../lib/getters";
import { rectangle } from "../../lib/grid";
import wrapAnsi from "wrap-ansi";

import {
  writePlayerInventoryList,
  writeItemDescription
} from "../../lib/menus";

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

export const drawScrollableText = (text, width, height, offset, options) => {
  // split string into wrapped lines
  const lines = wrapAnsi(text, width, { hard: true, trim: false }).split("\n");
  // get visible portion of lines based on current scroll
  const visible = lines.slice(offset, offset + height);
  // draw visible to canvas
  visible.forEach((line, index) => {
    const opt = { ...options };
    opt.y = options.y + index;
    drawText(line, opt);
  });

  return { lines, visible };
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

    if (entity.components.health) {
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
    }
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
  drawText(`(?)Help (i)Inventory`, {
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

// items comes from payload - tile id instead? then I can just get the entities there and deal with that
const renderContainer = locId => {
  // get entities at locId
  const entities = getEntitiesAtLoc(getPlayer().components.position);
  // iterate over entities and add all with a gettable to floor.
  console.log(entities);

  // look for any that have an inventory. If they do:
  // need to be able to remove item from entity inventory (so build some data structire that will faciliate that)
  // items: {
  //   floor: []
  //   entityId: [] // id of entity whose inventory item belongs to
  //   ...
  // }
  // lists all items
  // store current selected item
  // on get
  // remove from floor or inventory
  // add to player inventory
  // all this needs to somehow be able to work for monsters npcs to do this without a UI...
};

const renderInventory = () => {
  const inventoryListText = writePlayerInventoryList(
    getPlayer().components.inventory.items,
    getPlayer().components.inventory.currentSelected
  );
  ECS.game.menu.contentHeight[0] = inventoryListText.length;

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
  const { items } = inventory;
  // draw selected item details
  if (items.length) {
    let descY = ECS.game.grid.menu2.y + 1;
    // draw description
    const drawnDescriptionText = drawScrollableText(
      writeItemDescription(inventory.currentSelected),
      ECS.game.grid.menu2.width - 2,
      ECS.game.grid.menu2.height - 5,
      ECS.game.menu.paneOffset[1],
      {
        x: ECS.game.grid.menu2.x + 1,
        y: descY
      }
    );

    ECS.game.menu.contentHeight[1] = drawnDescriptionText.lines.length;
  }

  let inventoryX = ECS.game.grid.menu.x + 1;
  let inventoryY = ECS.game.grid.menu.y + 1;

  // draw inventory list
  const drawnInventoryListText = drawScrollableText(
    inventoryListText,
    ECS.game.grid.menu.width - 2,
    ECS.game.grid.menu.height - 3,
    ECS.game.menu.paneOffset[0],
    {
      x: inventoryX,
      y: inventoryY
    }
  );

  ECS.game.menu.contentHeight[0] = drawnInventoryListText.lines.length;
};

const renderHelp = () => {
  let helpY = ECS.game.grid.menu3.y;

  drawRectangle({
    x: ECS.game.grid.menu3.x,
    y: helpY,
    width: ECS.game.grid.menu3.width,
    height: ECS.game.grid.menu3.height,
    color: colors.defaultBGColor
  });

  helpY += 1;

  drawText("-- COMMANDS --", {
    x: ECS.game.grid.menu3.x + 7,
    y: helpY
  });

  helpY += 2;

  drawText("- GAME", {
    x: ECS.game.grid.menu3.x + 8,
    y: helpY
  });

  helpY += 1;

  drawText("Arrow keys  Move or attack", {
    x: ECS.game.grid.menu3.x + 1,
    y: helpY
  });
  helpY += 1;

  drawText("g  Pick up item", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("z  Rest for 1 turn", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 2;

  drawText("- INVENTORY", {
    x: ECS.game.grid.menu3.x + 8,
    y: helpY
  });

  helpY += 1;

  drawText("Arrow keys  Select Item", {
    x: ECS.game.grid.menu3.x + 1,
    y: helpY
  });
  helpY += 1;

  drawText("c  Consume", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("d  Drop", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("r  Remove", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("w  Wield", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("W  Wear", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });

  helpY += 2;

  drawText("- GLOBAL", {
    x: ECS.game.grid.menu3.x + 8,
    y: helpY
  });

  helpY += 1;

  drawText("?  Help", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("i  Inventory", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("esc  Return to game", {
    x: ECS.game.grid.menu3.x + 8,
    y: helpY
  });

  helpY += 2;

  drawText("- CHEATS", {
    x: ECS.game.grid.menu3.x + 8,
    y: helpY
  });

  helpY += 1;

  drawText("O  Toggle omniscience", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
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

  if (ECS.game.mode === "HELP") {
    renderHelp();
  }
}

export default render;
