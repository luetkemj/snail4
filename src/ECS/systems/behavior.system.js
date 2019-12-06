import { random, sample } from "lodash";
import ECS from "../ECS";

const behaviorSystem = entities => {
  ECS.cache.entityIds.forEach(id => {
    const entity = entities[id];
    if (entity.components.target) {
      const targetId = entity.components.target.id;
      const entityName = entity.components.labels.name;
      const targetName = entities[targetId].components.labels.name;

      // monsters should pick a need to satisfy
      if (entity.components.brain) {
        const need = sample(entity.components.brain.needs);
        let satisfier = "";

        switch (need) {
          case "bored":
            satisfier = "hug";
            break;
          case "thirsty":
            satisfier = "drink";
            break;
          case "hungry":
            satisfier = "eat";
            break;
          case "angry":
            satisfier = "attack";
            break;
          default:
            satisfier = "";
        }

        if (targetName === "player") {
          console.log(`${entityName} is ${need}.`);
          console.log(`${entityName} attempts to ${satisfier} ${targetName}.`);
        }

        const success = random(0, 1);

        if (success) {
          // success!
          // clear out the need!
          entity.components.brain.needs = entity.components.brain.needs.filter(
            n => n !== need
          );
          if (targetName === "player") {
            console.log(`${entityName} succeeds!`);
          }
        } else {
          // fail!
          // add more of need! frustration builds!
          entity.components.brain.needs.push(need);
          if (targetName === "player") {
            console.log(`${entityName} fails!`);
          }
        }
      }

      // player bumps or other action...
      if (entity.components.playerControlled) {
        if (entities[targetId].components.brain) {
          console.log(
            `You bump into a ${targetName}, it looks ${sample(
              entities[targetId].components.brain.needs
            )}.`
          );
        } else {
          console.log(`You bump into a ${targetName}!`);
        }
      }

      // remove target
      entity.removeComponent("target");
    }
  });
};

export default behaviorSystem;
