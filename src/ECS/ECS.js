import Entity from "./Entity";
import { cache } from "./cache";
import { grid, pxToCell } from "../lib/canvas";

// components
import appearance from "./components/appearance.component";
import blocking from "./components/blocking.component";
import dead from "./components/dead.component";
import dijkstra from "./components/dijkstra.component";
import fov from "./components/fov.component";
import garbage from "./components/garbage.component";
import health from "./components/health.component";
import labels from "./components/labels.component";
import opaque from "./components/opaque.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";
import target from "./components/target.component";

import track from "./components/track.component";
import trackable from "./components/trackable.component";
import trackableLoc from "./components/trackable-loc.component";

import moveToPlayer from "./components/moveToPlayer.component";

// systems
import brainSystem from "./systems/brain.system";
import fovSystem from "./systems/fov.system";
import garbageSystem from "./systems/garbage.system";
import renderSystem from "./systems/render.system";

const ECS = {
  entities: {},
  components: {
    appearance,
    blocking,
    dead,
    dijkstra,
    fov,
    garbage,
    health,
    labels,
    moveToPlayer,
    opaque,
    playerControlled,
    position,
    target,
    track,
    trackable,
    trackableLoc
  },
  systems: [garbageSystem, brainSystem, fovSystem, renderSystem],
  game: {
    turn: 0,
    userInput: null,
    playerTurn: true,
    grid
  },
  Entity,
  cache
};

const canvas = document.querySelector("#map");

canvas.onclick = e => {
  const [x, y] = pxToCell(e);
  const locId = `${x},${y}`;
  const eIds = ECS.cache.entityLocations[locId];
  eIds.forEach(id => ECS.entities[id].print());
};

export default ECS;
