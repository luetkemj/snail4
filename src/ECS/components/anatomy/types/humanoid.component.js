import brain from "../parts/brain.component";
import earLeft from "../parts/ear-left.component";
import earRight from "../parts/ear-right.component";
import eyeLeft from "../parts/eye-left.component";
import eyeRight from "../parts/eye-right.component";
import jaw from "../parts/jaw.component";
import nose from "../parts/nose.component";
import skull from "../parts/skull.component";

const componentAnatomyHumanoid = () =>
  // params for making some stronger than other
  {
    return {
      groups: {
        face: {
          parts: ["eyeLeft", "eyeRight", "jaw", "nose", "skull"],
          pierce: {
            minor: "face is pierced",
            major: "face is pierced to the bone!",
            destroyed: "face is pierced through entirely!"
          },
          bludgeon: {
            minor: "face is bruised.",
            major: "face is battered.",
            destroyed: "face is smashed to an unrecognizable pulp!"
          },
          slash: {
            minor: "face is cut.",
            major: "face is cut deeply.",
            destroyed: "face is slashed to ribbons!"
          }
        },
        head: {
          parts: ["brain", "earLeft", "earRight", "skull"],
          pierce: {
            minor: "head is pierced",
            major: "head is pierced to the skull!",
            destroyed: "head is pierced through entirely!"
          },
          bludgeon: {
            minor: "head is bruised.",
            major: "head is battered.",
            destroyed:
              "head is smashed into the body, leaving only a pulpy mash!"
          },
          slash: {
            minor: "head is cut.",
            major: "head is cut deep enough to reveal an ivory skull.",
            destroyed: "head flies through the air in a bloody arc!"
          }
        }
      },
      brain: brain(),
      earLeft: earLeft(),
      earRight: earRight(),
      eyeLeft: eyeLeft(),
      eyeRight: eyeRight(),
      jaw: jaw(),
      nose: nose(),
      skull: skull()
    };
  };

export default componentAnatomyHumanoid;
