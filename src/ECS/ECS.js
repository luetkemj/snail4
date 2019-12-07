import TextGrid from "overprint/overprint/text-grid";
import Font from "overprint/overprint/font";
import Entity from "./Entity";
import { cache } from "./cache";

const canvas = document.querySelector("#game");

// components
import appearance from "./components/appearance.component";
import blocking from "./components/blocking.component";
import dead from "./components/dead.component";
import dijkstra from "./components/dijkstra.component";
import fov from "./components/fov.component";
import health from "./components/health.component";
import labels from "./components/labels.component";
import opaque from "./components/opaque.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";
import target from "./components/target.component";
import moveToPlayer from "./components/moveToPlayer.component";

// systems
import brainSystem from "./systems/brain.system";
import fovSystem from "./systems/fov.system";
import renderSystem from "./systems/render.system";

const WIDTH = 80;
const HEIGHT = 50;
const FONT_SIZE = 15;

const ECS = {
  entities: {},
  components: {
    appearance,
    blocking,
    dead,
    dijkstra,
    fov,
    health,
    labels,
    moveToPlayer,
    opaque,
    playerControlled,
    position,
    target
  },
  systems: [brainSystem, fovSystem, renderSystem],
  game: {
    userInput: null,
    playerTurn: true,
    grid: new TextGrid(canvas, {
      width: WIDTH,
      height: HEIGHT,
      font: Font("Menlo", false, FONT_SIZE)
    })
  },
  Entity,
  cache
};

ECS.game.grid.onClick((x, y) => {
  const locId = `${x},${y}`;
  const eIds = ECS.cache.entityLocations[locId];
  eIds.forEach(id => ECS.entities[id].print());
});

export default ECS;
