import ECS from "../ECS";
import { layers } from "../../lib/canvas";
import { setCacheEntityAtLocation } from "../cache";
import { chars } from "../../lib/graphics";
import { getEntity } from "../../lib/getters";

const trackAssemblage = ({ position, eId }) => {
  const entity = ECS.Entity();

  const color = ECS.entities[eId].components.appearance.color;

  entity.addComponent("appearance", {
    layer: layers.tracks,
    color: color,
    char: chars.track
  });
  entity.addComponent("position", position);
  entity.addComponent("track", { eId, createdAt: ECS.game.turn });
  entity.addComponent("fov");

  entity.addComponent("description", {
    text: `You spot ${getEntity(eId).components.labels.name} tracks!`
  });

  setCacheEntityAtLocation(entity.id, position);
};

export default trackAssemblage;
