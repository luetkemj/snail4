import TextGrid from "overprint/overprint/text-grid";
import Font from "overprint/overprint/font";
import Entity from "./Entity";

const canvas = document.querySelector("#game");

// components
import appearance from "./components/appearance.component";
import playerControlled from "./components/player-controlled.component";
import position from "./components/position.component";

// systems
import move from "./systems/move.system";
import render from "./systems/render.system";

const WIDTH = 80;
const HEIGHT = 50;
const FONT_SIZE = 15;

const ECS = {
  entities: {},
  components: { appearance, playerControlled, position },
  systems: [move, render],
  game: {
    userInput: null,
    playerTurn: true,
    grid: new TextGrid(canvas, {
      width: WIDTH,
      height: HEIGHT,
      font: Font("Menlo", false, FONT_SIZE)
    })
  },
  Entity
};

export default ECS;
