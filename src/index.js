import ECS from "./ECS/ECS";
import userInput from "./lib/key-bindings";
import initGame from "./initializers/game.init";

document.addEventListener("keydown", ev => userInput(ev.key));

initGame();

function gameTick() {
  for (let i = 0; i < ECS.systems.length; i++) {
    ECS.systems[i](ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  if (ECS.game.userInput && ECS.game.playerTurn) {
    // console.error("PLAYER TURN");
    gameTick();
    ECS.game.userInput = null;
    ECS.game.playerTurn = false;
  }

  if (!ECS.game.playerTurn) {
    gameTick();
    ECS.game.playerTurn = true;
  }
}

function gameLoop() {
  // console.time("tick");
  update();
  // console.timeEnd("tick");
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
