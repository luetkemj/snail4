import ECS from "./ECS/ECS";
import userInput from "./lib/key-bindings";
import initGame from "./initializers/game.init";
import processUserInput from "./lib/process-user-input";
import { playerId } from "./ECS/cache";
import renderSystem from "./ECS/systems/render.system";

document.addEventListener("keydown", ev => userInput(ev.key));

initGame();

function gameTick() {
  if (!ECS.game.paused) {
    for (let i = 0; i < ECS.systems.length; i++) {
      ECS.systems[i](ECS.entities);
    }
  } else {
    renderSystem(ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  if (ECS.entities[playerId()].components.dead) {
    console.log("GAME OVER");
    return;
  }

  if (ECS.game.userInput && ECS.game.playerTurn) {
    processUserInput();
    gameTick();
    ECS.game.userInput = null;
    ECS.game.turn = ECS.game.turn += 1;
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
