import ECS from "../ECS";
import { readCacheEntitiesAtLocation } from "../cache";
import Cell from "overprint/overprint/cell";
import { updateHSLA } from "../../lib/hsla";

function render(entities) {
  ECS.game.grid.clear();

  ECS.cache.entityIds.forEach(key => {
    const entity = entities[key];
    const {
      components: { appearance, position, fov, playerControlled, brain }
    } = entity;

    if (appearance && position && fov) {
      // If it's in the Field Of Vision
      if (fov.inFov) {
        ECS.game.grid.writeCell(
          position.x,
          position.y,
          Cell(appearance.char, appearance.color.hsla)
        );
      }

      // if it's got a brain it is some sort of living entity
      // and should only render if in fov.
      if (brain) return;

      // If it's been revealed but not in the current fov
      if (fov.revealed && !fov.inFov) {
        ECS.game.grid.writeCell(
          position.x,
          position.y,
          Cell(
            appearance.char,
            updateHSLA(appearance.color, { da: -75, ds: 0 }).hsla
          )
        );
      }
    }

    // generate tracks
    if (position) {
      const eIdsAtLoc = readCacheEntitiesAtLocation(position);
      // if has track - calc and render color
      // todo - calc based on time... render on top of existing... layer multiple tracks...
      eIdsAtLoc.forEach(eId => {
        const track = entities[eId].components.track;
        if (track) {
          // console.log(track.eId);
          const trackColor = entities[track.eId].components.appearance.color;

          const trackAge = ECS.game.turn - track.createdAt;
          let trackAlpha = trackAge * 5;
          if (trackAlpha < 0) trackAlpha = 0;
          entity.components.appearance.color = updateHSLA(trackColor, {
            da: -trackAlpha
          });
        }
      });

      // trackable entities
      const trackableIds = eIdsAtLoc.filter(
        eid => entities[eid].components.trackable
      );
      const trackableLocs = eIdsAtLoc.filter(
        eid => entities[eid].components.trackableLoc
      );

      // if there is are trackable entities and the location supports tracks - leave a tracks
      if (trackableIds.length && trackableLocs.length) {
        trackableLocs.forEach(eId => {
          const tLocEntity = entities[eId];

          trackableIds.forEach(tId => {
            tLocEntity.addComponent("track", {
              eId: tId,
              createdAt: ECS.game.turn
            });
          });
        });
      }
    }
  });

  ECS.game.grid.render();
}

export default render;
