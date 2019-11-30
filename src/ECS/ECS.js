import TextGrid from "overprint/overprint/text-grid";
import Font from "overprint/overprint/font";
import Entity from "./Entity";

const canvas = document.querySelector("#game");

// components
import appearance from "./components/appearance.component";
import position from "./components/position.component";

// systems
import render from "./systems/render.system";

const WIDTH = 80;
const HEIGHT = 50;
const FONT_SIZE = 15;

const ECS = {
  entities: {},
  components: { appearance, position },
  systems: [render],
  game: {
    grid: new TextGrid(canvas, {
      width: WIDTH,
      height: HEIGHT,
      font: Font("Menlo", false, FONT_SIZE)
    })
  },
  Entity
};

export default ECS;
