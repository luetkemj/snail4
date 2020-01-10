import ECS from "../ECS";
import { readCacheKey } from "../cache";
import createFOV from "../../lib/fov";
import { getPlayer } from "../../lib/getters";

const fovSystem = entities => {
  const {
    game: {
      grid: { width: WIDTH, height: HEIGHT }
    }
  } = ECS;

  const originX = getPlayer().components.position.x;
  const originY = getPlayer().components.position.y;

  const FOV = createFOV(WIDTH, HEIGHT, originX, originY, 8);

  readCacheKey("entityIds").forEach(id => {
    const entity = ECS.entities[id];
    if (!entity.components.position) return;

    const locId = `${entity.components.position.x},${entity.components.position.y}`;
    if (ECS.cheats.omniscience || FOV.fov.includes(locId)) {
      entities[id].components.fov.inFov = true;
      entities[id].components.fov.revealed = true;
      entities[id].components.fov.distance = FOV.distance[locId];
    } else {
      entities[id].components.fov.inFov = false;
    }
  });
};

export default fovSystem;
