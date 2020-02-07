import ECS from "../ECS";
import { readCacheKey } from "../cache";
import { flatten, groupBy, remove } from "lodash";
import { clearCanvas, drawCell, layers } from "../../lib/canvas";
import { colors, chars } from "../../lib/graphics";
import { updateHSLA } from "../../lib/hsla";
import {
  getEntity,
  getEntitiesAtLoc,
  getPlayer,
  getGettableEntitiesAtLoc
} from "../../lib/getters";
import { rectangle } from "../../lib/grid";
import wrapAnsi from "wrap-ansi";
import { humanValue } from "../../lib/coinpurse";

import {
  writeItemList,
  writePlayerInventoryList,
  writeEntityDescription,
  writeEntityName,
  writeAvailableEntityActions,
  writeCharAbilities,
  writeCharInjuries,
  writeEquipped
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
  const lines = wrapAnsi(text, width, { hard: true, trim: options.trim }).split(
    "\n"
  );
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
  let y = ECS.game.grid.hud.y;

  const drawTextHud = msg =>
    drawText(msg, {
      color: colors.hudText,
      background: "transparent",
      x: ECS.game.grid.hud.x,
      y
    });

  entities.forEach((entity, idx) => {
    const {
      components: {
        appearance: { char, color },
        labels: { name }
      }
    } = entity;

    drawTextHud(`${char}: ${name}`, y);
    y += 1;
    if (getPlayer().id === entity.id) {
      const { copperValue } = entity.components.wallet;
      drawTextHud(`${humanValue(copperValue)}`, y);
      y += 1;
    }

    if (entity.components.blood) {
      drawBar(
        ECS.game.grid.hud.width,
        ECS.game.grid.hud.width,
        updateHSLA(colors.healthBar, { a: 15 }),
        y
      );

      drawBar(
        entity.components.blood.current,
        entity.components.blood.max,
        colors.healthBar,
        y
      );

      const status = entity.components.dead ? "Dead" : "Health";
      drawTextHud(status, y);
      y += 2;
    } else {
      y += 1;
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
    const nGettable = getGettableEntitiesAtLoc(getPlayer().components.position)
      .length;
    if (nGettable === 2) {
      return drawTextHud2("You see a couple things on the floor.");
    } else if (nGettable === 3) {
      return drawTextHud2("You see a few things on the floor.");
    } else if (nGettable === 4) {
      return drawTextHud2("You see several things on the floor.");
    } else if (nGettable > 4) {
      return drawTextHud2("You see a large pile of things on the floor.");
    } else {
      return drawTextHud2(
        layerGroups[layers.items][0].components.description.text
      );
    }
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

// Render Container UI for getting from Container
const renderContainer = () => {
  const entities = ECS.game.menu.containerMenu.items.map(eId => getEntity(eId));

  // sort items in container
  const groups = groupBy(entities, entity => entity.components.type.name);
  const sortedInventory = flatten(Object.values(groups)).map(x => x.id);
  ECS.game.menu.containerMenu.items = [...sortedInventory];
  const eIds = [...sortedInventory];

  if (eIds.length && !ECS.game.menu.containerMenu.currentSelected) {
    ECS.game.menu.containerMenu.currentSelected = eIds[0];
  }

  // render masks over non essential UI
  drawRectangle({
    x: 0,
    y: 0,
    width: ECS.game.grid.width,
    height: ECS.game.grid.height,
    color: updateHSLA(colors.defaultBGColor, { a: 60 })
  });

  const drawItemList = () => {
    const itemListText = writeItemList(
      eIds,
      ECS.game.menu.containerMenu.currentSelected
    );
    ECS.game.menu.contentHeight[0] = itemListText.length;

    const color =
      ECS.game.menu.currentPane === 0
        ? colors.hudText
        : updateHSLA(colors.hudText, { l: 60 });

    // draw Inventory list (left pane [0])
    // inventory background
    drawRectangle({
      x: ECS.game.grid.menu.x,
      y: ECS.game.grid.menu.y,
      width: ECS.game.grid.menu.width,
      height: ECS.game.grid.menu.height,
      color: colors.defaultBGColor
    });
    let x = ECS.game.grid.menu.x + 1;
    let y = ECS.game.grid.menu.y + 1;

    drawText(`-- ITEMS TO PICKUP --`, {
      x,
      y,
      color
    });

    y += 2;

    // draw inventory list
    const drawnItemListText = drawScrollableText(
      itemListText,
      ECS.game.grid.menu.width - 2,
      ECS.game.grid.menu.height - 5,
      ECS.game.menu.paneOffset[0],
      {
        x,
        y,
        trim: false,
        color
      }
    );

    ECS.game.menu.contentHeight[0] = drawnItemListText.lines.length;
  };

  const drawSelectedItemDetails = () => {
    // draw selected item details (right pane [1])
    // selected item background
    drawRectangle({
      x: ECS.game.grid.menu2.x,
      y: ECS.game.grid.menu2.y,
      width: ECS.game.grid.menu2.width,
      height: ECS.game.grid.menu2.height,
      color: colors.defaultBGColor
    });

    const color =
      ECS.game.menu.currentPane === 1
        ? colors.hudText
        : updateHSLA(colors.hudText, { l: 60 });
    // draw selected item details
    if (eIds.length) {
      let y = ECS.game.grid.menu2.y + 1;
      let x = ECS.game.grid.menu2.x + 1;

      drawText(writeEntityName(ECS.game.menu.containerMenu.currentSelected), {
        x,
        y,
        color
      });

      y += 2;

      // draw description
      const drawnDescriptionText = drawScrollableText(
        writeEntityDescription(ECS.game.menu.containerMenu.currentSelected),
        ECS.game.grid.menu2.width - 2,
        ECS.game.grid.menu2.height - 5,
        ECS.game.menu.paneOffset[1],
        {
          x,
          y,
          trim: true,
          color
        }
      );

      y += drawnDescriptionText.lines.length + 1;

      ECS.game.menu.contentHeight[1] = drawnDescriptionText.lines.length;

      drawText(
        writeAvailableEntityActions(
          ECS.game.menu.containerMenu.currentSelected
        ),
        {
          x,
          y: Math.min(y, ECS.game.grid.menu3.height - 2),
          color
        }
      );
    }
  };

  drawItemList();
  drawSelectedItemDetails();
};

const renderCharacter = () => {
  // render masks over non essential UI
  drawRectangle({
    x: 0,
    y: 0,
    width: ECS.game.grid.width,
    height: ECS.game.grid.height,
    color: updateHSLA(colors.defaultBGColor, { a: 60 })
  });

  const drawCharStats = () => {
    // (left pane [0])
    // char stats
    drawRectangle({
      x: ECS.game.grid.menu.x,
      y: ECS.game.grid.menu.y,
      width: ECS.game.grid.menu.width,
      height: ECS.game.grid.menu.height,
      color: colors.defaultBGColor
    });
    let x = ECS.game.grid.menu.x + 1;
    let y = ECS.game.grid.menu.y + 1;

    drawText(`-- CHARACTER --`, {
      x,
      y,
      color: colors.hudText
    });

    y += 2;

    // draw characterStats
    drawScrollableText(
      `${writeCharAbilities(getPlayer().id)} 

${writeCharInjuries(getPlayer().id)}`,
      ECS.game.grid.menu.width - 2,
      ECS.game.grid.menu.height - 5,
      ECS.game.menu.paneOffset[0],
      {
        x,
        y,
        trim: false,
        color: colors.hudText
      }
    );
  };

  const drawCharEquipment = () => {
    // draw char equipment
    // equipped
    drawRectangle({
      x: ECS.game.grid.menu2.x,
      y: ECS.game.grid.menu2.y,
      width: ECS.game.grid.menu2.width,
      height: ECS.game.grid.menu2.height,
      color: colors.defaultBGColor
    });
    let x = ECS.game.grid.menu2.x + 1;
    let y = ECS.game.grid.menu2.y + 3;

    // draw characterStats
    drawScrollableText(
      writeEquipped(getPlayer().id),
      ECS.game.grid.menu2.width - 2,
      ECS.game.grid.menu2.height - 5,
      ECS.game.menu.paneOffset[0],
      {
        x,
        y,
        trim: false,
        color: colors.hudText
      }
    );
  };

  drawCharStats();
  drawCharEquipment();
};

const renderInventory = () => {
  // render masks over non essential UI
  drawRectangle({
    x: 0,
    y: 0,
    width: ECS.game.grid.width,
    height: ECS.game.grid.height,
    color: updateHSLA(colors.defaultBGColor, { a: 60 })
  });

  const drawInventoryList = () => {
    const inventoryListText = writePlayerInventoryList(
      getPlayer().components.inventory.items,
      ECS.game.menu.inventoryMenu.currentSelected
    );
    ECS.game.menu.contentHeight[0] = inventoryListText.length;

    const color =
      ECS.game.menu.currentPane === 0
        ? colors.hudText
        : updateHSLA(colors.hudText, { l: 60 });

    // draw Inventory list (left pane [0])
    // inventory background
    drawRectangle({
      x: ECS.game.grid.menu.x,
      y: ECS.game.grid.menu.y,
      width: ECS.game.grid.menu.width,
      height: ECS.game.grid.menu.height,
      color: colors.defaultBGColor
    });
    let x = ECS.game.grid.menu.x + 1;
    let y = ECS.game.grid.menu.y + 1;

    drawText(`-- INVENTORY --`, {
      x,
      y,
      color
    });

    y += 2;

    // draw inventory list
    const drawnInventoryListText = drawScrollableText(
      inventoryListText,
      ECS.game.grid.menu.width - 2,
      ECS.game.grid.menu.height - 5,
      ECS.game.menu.paneOffset[0],
      {
        x,
        y,
        trim: false,
        color
      }
    );

    ECS.game.menu.contentHeight[0] = drawnInventoryListText.lines.length;
  };

  const drawSelectedItemDetails = () => {
    // draw selected item details (right pane [1])
    // selected item background
    drawRectangle({
      x: ECS.game.grid.menu2.x,
      y: ECS.game.grid.menu2.y,
      width: ECS.game.grid.menu2.width,
      height: ECS.game.grid.menu2.height,
      color: colors.defaultBGColor
    });

    const color =
      ECS.game.menu.currentPane === 1
        ? colors.hudText
        : updateHSLA(colors.hudText, { l: 60 });
    const inventory = getPlayer().components.inventory;
    const { items } = inventory;
    // draw selected item details
    if (items.length) {
      let y = ECS.game.grid.menu2.y + 1;
      let x = ECS.game.grid.menu2.x + 1;

      drawText(writeEntityName(ECS.game.menu.inventoryMenu.currentSelected), {
        x,
        y,
        color
      });

      y += 2;

      // draw description
      const drawnDescriptionText = drawScrollableText(
        writeEntityDescription(ECS.game.menu.inventoryMenu.currentSelected),
        ECS.game.grid.menu2.width - 2,
        ECS.game.grid.menu2.height - 5,
        ECS.game.menu.paneOffset[1],
        {
          x,
          y,
          trim: true,
          color
        }
      );

      y += drawnDescriptionText.lines.length + 1;

      ECS.game.menu.contentHeight[1] = drawnDescriptionText.lines.length;

      drawText(
        writeAvailableEntityActions(
          ECS.game.menu.inventoryMenu.currentSelected
        ),
        {
          x,
          y: Math.min(y, ECS.game.grid.menu3.height - 2),
          color
        }
      );
    }
  };

  drawInventoryList();
  drawSelectedItemDetails();
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

  drawText("<  Ascend stairs", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });
  helpY += 1;

  drawText(">  Decend stairs", {
    x: ECS.game.grid.menu3.x + 10,
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

  drawText("B  Toggle berserker", {
    x: ECS.game.grid.menu3.x + 10,
    y: helpY
  });

  helpY += 1;

  drawText("I  Toggle invincibility", {
    x: ECS.game.grid.menu3.x + 10,
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
  const entities = readCacheKey("entityIds").reduce((acc, val) => {
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
            if (getPlayer().id === entity.components.track.eId) {
              da = 100;
            }

            return drawCell(entity, { char: { da: -da } });
          }

          if (
            getGettableEntitiesAtLoc(position).length > 1 &&
            entity.components.gettable
          ) {
            return drawCell({
              components: {
                appearance: {
                  char: chars.multipleItems,
                  color: colors.multipleItems,
                  background: colors.defaultBGColor
                },
                position
              }
            });
          }

          return drawCell(entity);
        }

        if (fov.showIfRevealed && fov.revealed && !fov.inFov) {
          drawCell(entity, { char: { da: -75, ds: 0 } });
        }
      }
    });
  });

  // put player at top of hud entities array
  const player = remove(hudEntities, x => x.id === getPlayer().id);

  renderLog();
  renderHud([...player, ...hudEntities]);
  renderHud2();
  if (ECS.game.mode === "INVENTORY") {
    renderInventory();
  }

  if (ECS.game.mode === "CHARACTER") {
    renderCharacter();
  }

  if (ECS.game.mode === "LOOT_CONTAINER") {
    renderContainer();
  }

  if (ECS.game.mode === "HELP") {
    renderHelp();
  }
}

export default render;
