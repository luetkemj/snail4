import { getEntityName, getTurnNumber } from "../../lib/getters";
import { kill } from "../../lib/death";
import { readCacheKey } from "../cache";

const bleedingSystem = entities => {
  // may need a different cache key for this...
  readCacheKey("movable").forEach(key => {
    const entity = entities[key];

    // deads things don't bleed... for now
    if (entity.components.dead) return;

    const { bleeding, blood, anatomy, health } = entity.components;
    if (bleeding && blood && anatomy && health) {
      Object.keys(bleeding).forEach(part => {
        if (entity.components.dead) return false;

        // todo: calc half-life for blood slowdown and clotting
        blood.current -= anatomy[part].bleeds * bleeding[part].severity;

        // todo: start rolling constitution saves at 40% instead of death at 50%

        // if blood loss is greater than 50% die
        if (blood.current < blood.max / 2) {
          health.current = 0;

          // todo: killing an enity needs to be a lib function! pull code out of movement lib
          kill(entity, {
            deathMsg: `${getEntityName(entity)} bleeds to death!`
          });
        }
      });
    }
  });
};

export default bleedingSystem;
