import ECS from "../ECS/ECS";

export const printToLog = msg => {
  if (msg) {
    ECS.log.push(msg);
  }
};
