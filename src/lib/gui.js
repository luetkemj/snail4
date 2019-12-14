import ECS from "../ECS/ECS";

export const printToLog = msg => {
  ECS.log.push(msg);
};
