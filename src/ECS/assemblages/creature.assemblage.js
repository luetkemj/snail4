import ECS from "../ECS";

const creatureAssemblage = () => {
  const entity = ECS.Entity(["movable"]);
  entity.addComponent("labels");
  entity.addComponent("appearance");
  entity.addComponent("position");
  entity.addComponent("fov");
  entity.addComponent("blocking");

  return entity;
};

export default creatureAssemblage;
