import ECS from "../ECS";

const needsSystem = entities => {
  ECS.cache.entityIds.forEach(id => {
    const entity = entities[id];

    if (entity.components.brain) {
      entity.components.brain.needs.push("bored");
      entity.components.brain.needs.push("thirsty");
      entity.components.brain.needs.push("hungry");
      entity.components.brain.needs.push("angry");
    }
  });
};

export default needsSystem;
