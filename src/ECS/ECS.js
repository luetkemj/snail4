import TextGrid from "overprint/overprint/text-grid";
import Font from "overprint/overprint/font";
import Entity from "./Entity";
import { cache } from "./cache";

const canvas = document.querySelector("#game");

// components
import appearance from "./components/appearance.component";
import blocking from "./components/blocking.component";
import fov from "./components/fov.component";
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
  components: { appearance, blocking, fov, opaque, playerControlled, position },
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

export default ECS;
