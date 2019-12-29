import Entity from "./Entity";
import { cache } from "./cache";
import { grid, pxToCell } from "../lib/canvas";

// components
import appearance from "./components/appearance.component";
import armor from "./components/armor.component";
import blocking from "./components/blocking.component";
import consumable from "./components/consumable.component";
import damage from "./components/damage.component";
import damageReduction from "./components/damage-reduction.component";
import dead from "./components/dead.component";
import description from "./components/description.component";
import dijkstra from "./components/dijkstra.component";
import droppable from "./components/droppable.component";
import fov from "./components/fov.component";
import garbage from "./components/garbage.component";
import health from "./components/health.component";
import hud from "./components/hud.component";
import inventory from "./components/inventory.component";
import labels from "./components/labels.component";
import moveToPlayer from "./components/moveToPlayer.component";
import opaque from "./components/opaque.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";
import removable from "./components/removable.component";
import gettable from "./components/gettable.component";
import target from "./components/target.component";
import track from "./components/track.component";
import trackable from "./components/trackable.component";
import trackableLoc from "./components/trackable-loc.component";
import wearable from "./components/wearable.component";
import wieldable from "./components/wieldable.component";
import wielding from "./components/wielding.component";

// systems
import brainSystem from "./systems/brain.system";
import fovSystem from "./systems/fov.system";
import garbageSystem from "./systems/garbage.system";
import renderSystem from "./systems/render.system";

const ECS = {
  cheats: {
    omniscience: false
  },
  entities: {},
  components: {
    appearance,
    armor,
    blocking,
    consumable,
    damage,
    damageReduction,
    dead,
    description,
    dijkstra,
    droppable,
    fov,
    garbage,
    health,
    hud,
    inventory,
    labels,
    moveToPlayer,
    opaque,
    playerControlled,
    position,
    removable,
    gettable,
    target,
    track,
    trackable,
    trackableLoc,
    wearable,
    wieldable,
    wielding
  },
  systems: [garbageSystem, brainSystem, fovSystem, renderSystem],
  game: {
    mode: "GAME", // [GAME | INVENTORY | HELP]
    paused: false,
    turn: 0,
    userInput: null,
    playerTurn: true,
    grid
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
  const [x, y] = pxToCell(e);
  const locId = `${x},${y}`;
  const eIds = ECS.cache.entityLocations[locId];
  eIds.forEach(id => ECS.entities[id].print());
};

export default ECS;
