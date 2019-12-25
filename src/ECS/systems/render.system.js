import ECS from "../ECS";
import { compact, groupBy, remove } from "lodash";
import { clearCanvas, drawCell, layers } from "../../lib/canvas";
import { colors } from "../../lib/graphics";
import { updateHSLA } from "../../lib/hsla";
import { getEntity, getEntitiesAtLoc, getPlayer } from "../../lib/getters";
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

const renderInventory = () => {
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
  // const inventoryItemNames = Object.keys(inventory.items);

  // draw selected item details
  if (items.length) {
    const currentSelectedEntity = getEntity(inventory.currentSelected);
    drawText(currentSelectedEntity.components.labels.name, {
      x: ECS.game.grid.menu2.x + 1,
      y: ECS.game.grid.menu2.y + 3
    });

    // draw description
    // drawText(entity.components.description.text, {
    //   x: ECS.game.grid.menu2.x + 1,
    //   y: ECS.game.grid.menu2.y + 3
    // });

    // actions
    let actions = "";

    if (currentSelectedEntity.components.droppable) {
      actions = `${actions}(d)Drop `;
    }

    if (currentSelectedEntity.components.consumable) {
      actions = `${actions}(c)Consume `;
    }

    if (currentSelectedEntity.components.wearable) {
      actions = `${actions}(e)Equip `;
    }

    if (currentSelectedEntity.components.removable) {
      actions = `${actions}(r)Remove `;
    }

    drawText(actions, {
      x: ECS.game.grid.menu2.x + 1,
      y: ECS.game.grid.menu2.y + 5
    });
  }

  let inventoryX = ECS.game.grid.menu.x + 1;
  let inventoryY = ECS.game.grid.menu.y + 1;

  // draw inventory
  drawText("-- INVENTORY --", {
    x: inventoryX,
    y: inventoryY
  });

  inventoryY += 2;

  if (!items.length) {
    drawText("<EMPTY>", {
      x: inventoryX,
      y: inventoryY
    });
  }

  // render equipped items first
  const armorComponent = getPlayer().components.armor;
  const equippedItems = compact(Object.values(armorComponent));
  equippedItems.forEach(eId => {
    const cursor = eId === inventory.currentSelected ? "*" : " ";
    const itemName = getEntity(eId).components.labels.name;
    let slotName;
    Object.keys(armorComponent).forEach(slot => {
      if (armorComponent[slot] === eId) {
        slotName = slot;
      }
    });

    drawText(`${cursor}${itemName} (${slotName})`, {
      x: inventoryX,
      y: inventoryY
    });
    inventoryY += 1;
  });

  if (equippedItems.length) {
    // render divider
    inventoryY += 1;
    drawText(`--`, { x: inventoryX, y: inventoryY });
    inventoryY += 2;
  }

  // render the rest of the inventory
  items
    .filter(eId => !equippedItems.includes(eId))
    .forEach(id => {
      const cursor = id === inventory.currentSelected ? "*" : " ";
      drawText(`${cursor}${getEntity(id).components.labels.name}`, {
        x: inventoryX,
        y: inventoryY
      });
      inventoryY += 1;
    });
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

  drawText("e  Equip", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText("r  Remove", {
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
