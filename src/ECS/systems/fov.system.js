import ECS from "../ECS";
import createFOV from "../../lib/fov";

const fovSystem = entities => {
  const playerId = ECS.cache.player[0];
  const {
    game: {
      grid: { width: WIDTH, height: HEIGHT }
    }
  } = ECS;

  const originX = entities[playerId].components.position.x;
  const originY = entities[playerId].components.position.y;

  const FOV = createFOV(WIDTH, HEIGHT, originX, originY, entities, WIDTH);
  console.log(FOV);

  ECS.cache.entityIds.forEach(id => {
    const entity = entities[id];
    const locId = `${entity.components.position.x},${entity.components.position.y}`;
    if (FOV.fov.includes(locId)) {
      entities[id].components.fov.inFov = true;
      entities[id].components.fov.revealed = true;
      entities[id].components.fov.distance = FOV.distance[locId];
    } else {
      entities[id].components.fov.inFov = false;
    }
  });
};

export default fovSystem;
