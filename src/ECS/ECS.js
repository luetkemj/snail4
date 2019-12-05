import TextGrid from "overprint/overprint/text-grid";
import Font from "overprint/overprint/font";
import Entity from "./Entity";
import { cache } from "./cache";

const canvas = document.querySelector("#game");

// components
import appearance from "./components/appearance.component";
import blocking from "./components/blocking.component";
import brain from "./components/brain.component";
import fov from "./components/fov.component";
import labels from "./components/labels.component";
import opaque from "./components/opaque.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";

// systems
import moveSystem from "./systems/move.system";
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
    brain,
    fov,
    labels,
    opaque,
    playerControlled,
    position
  },
  systems: [moveSystem, fovSystem, renderSystem],
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
  console.log(eIds);
  eIds.forEach(id => ECS.entities[id].print());
});

export default ECS;
