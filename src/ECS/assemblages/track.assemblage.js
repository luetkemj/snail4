import ECS from "../ECS";
import { layers } from "../../lib/canvas";
import { setCacheEntityAtLocation } from "../cache";
import { chars } from "../../lib/graphics";

const trackAssemblage = ({ position, eId }) => {
  const entity = ECS.Entity();

  const color = ECS.entities[eId].components.appearance.color;

  entity.addComponent("appearance", {
    layer: layers.track,
    color: color,
    char: chars.track
  });
  entity.addComponent("position", position);
  entity.addComponent("track", { eId, createdAt: ECS.game.turn });
  entity.addComponent("fov");

  ECS.entities[entity.id] = entity;
  setCacheEntityAtLocation(entity.id, position);
};

export default trackAssemblage;
