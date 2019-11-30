import ECS from "./ECS/ECS";

const player = ECS.Entity();
player.addComponent(ECS.components.appearance());
player.addComponent(ECS.components.position());

ECS.entities[player.id] = player;

function gameLoop() {
  for (let i = 0; i < ECS.systems.length; i++) {
    ECS.systems[i](ECS.entities);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
