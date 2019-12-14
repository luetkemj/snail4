import ECS from "./ECS/ECS";
import userInput from "./lib/key-bindings";
import initGame from "./initializers/game.init";
import { playerId } from "./ECS/cache";

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
    if (ECS.game.userInput.type === "TOGGLE_OMNISCIENCE") {
      ECS.cheats.omniscience = !ECS.cheats.omniscience;
    }

    gameTick();
    ECS.game.userInput = null;

    if (ECS.entities[playerId()].components.dead) {
      console.log("GAME OVER");
      return;
    }

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
