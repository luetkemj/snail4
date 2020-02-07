import Entity from "./Entity";
import { cache } from "./cache";
import { grid, pxToCell } from "../lib/canvas";

// components
import anatomy from "./components/anatomy/anatomy.component";
import appearance from "./components/appearance.component";
import armor from "./components/armor.component";
import ar from "./components/armor-rating.component";
import ascend from "./components/ascend.component";
import bleeding from "./components/bleeding.component";
import blocking from "./components/blocking.component";
import blood from "./components/blood.component";
import consumable from "./components/consumable.component";
import abilityScores from "./components/ability-scores.component";
import currency from "./components/currency.component";
import damage from "./components/damage.component";
import damageReduction from "./components/damage-reduction.component";
import dead from "./components/dead.component";
import descend from "./components/descend.component";
import description from "./components/description.component";
import dijkstra from "./components/dijkstra.component";
import droppable from "./components/droppable.component";
import fov from "./components/fov.component";
import garbage from "./components/garbage.component";
import gettable from "./components/gettable.component";
import health from "./components/health.component";
import hud from "./components/hud.component";
import inventory from "./components/inventory.component";
import labels from "./components/labels.component";
import moveToPlayer from "./components/moveToPlayer.component";
import opaque from "./components/opaque.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";
import race from "./components/race.component";
import removable from "./components/removable.component";
import sdc from "./components/structural-damage-capacity.component";
import target from "./components/target.component";
import track from "./components/track.component";
import trackable from "./components/trackable.component";
import trackableLoc from "./components/trackable-loc.component";
import type from "./components/type.component";
import wallet from "./components/wallet.component";
import wearable from "./components/wearable.component";
import wieldable from "./components/wieldable.component";
import wielding from "./components/wielding.component";

// systems
import brainSystem from "./systems/brain.system";
import bleedingSystem from "./systems/bleeding.system";
import fovSystem from "./systems/fov.system";
import garbageSystem from "./systems/garbage.system";
import renderSystem from "./systems/render.system";

const ECS = {
  cheats: {
    omniscience: false,
    invincible: false,
    berserk: false
  },
  entities: {},
  components: {
    anatomy,
    appearance,
    armor,
    ar,
    ascend,
    bleeding,
    blocking,
    blood,
    consumable,
    abilityScores,
    currency,
    damage,
    damageReduction,
    dead,
    descend,
    description,
    dijkstra,
    droppable,
    fov,
    garbage,
    gettable,
    health,
    hud,
    inventory,
    labels,
    moveToPlayer,
    opaque,
    playerControlled,
    position,
    race,
    removable,
    sdc,
    target,
    track,
    trackable,
    trackableLoc,
    type,
    wallet,
    wearable,
    wieldable,
    wielding
  },
  systems: [
    garbageSystem,
    bleedingSystem,
    brainSystem,
    fovSystem,
    renderSystem
  ],
  game: {
    mode: "GAME", // [GAME | INVENTORY | HELP]
    paused: false,
    turn: 0,
    userInput: null,
    playerTurn: true,
    grid,
    depth: -1,
    menu: {
      currentPane: 0,
      paneOffset: [0, 0],
      contentHeight: [0, 0],
      visibleHeight: [27, 27],
      inventoryMenu: {
        currentSelected: ""
      },
      containerMenu: {
        currentSelected: "",
        items: []
      }
    }
  },
  log: [
    "Welcome, adventurer, to the Dungeons of Doom!",
    "Delve to the 26th floor and return with the Amulet of Yendor.",
    "You cannot escape without it - if it even exists - for you are DOOMED!"
  ],
  Entity,
  cache
};

const canvas = document.querySelector("#canvas");

canvas.onclick = e => {
  const depth = ECS.game.depth;
  const [x, y] = pxToCell(e);
  const locId = `${x},${y}`;
  const eIds = ECS.cache[depth].entityLocations[locId];
  eIds.forEach(id => ECS.entities[id].print());
};

export default ECS;
