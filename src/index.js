import ECS from "./ECS/ECS";

const player = new ECS.Entity();
player.addComponent(new ECS.components.appearance());
player.addComponent(new ECS.components.position());

ECS.entities[player.id] = player;

function gameLoop() {
  for (let i = 0; i < ECS.systems.length; i++) {
    ECS.systems[i](ECS.entities);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
