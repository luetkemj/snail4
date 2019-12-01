import ECS from "./ECS/ECS";
import userInput from "./ECS/key-bindings";

const player = ECS.Entity();
player.addComponent(ECS.components.appearance({ char: "@", color: "#daa520" }));
player.addComponent(ECS.components.playerControlled());
player.addComponent(ECS.components.position());

player.print();

ECS.entities[player.id] = player;

document.addEventListener("keydown", ev => userInput(ev.key));

function gameTick() {
  for (let i = 0; i < ECS.systems.length; i++) {
    ECS.systems[i](ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  if (ECS.game.userInput && ECS.game.playerTurn) {
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
  update();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
