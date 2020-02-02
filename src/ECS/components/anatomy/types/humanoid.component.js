// head and face
import brain from "../parts/brain.component";
import earLeft from "../parts/ear-left.component";
import earRight from "../parts/ear-right.component";
import eyeLeft from "../parts/eye-left.component";
import eyeRight from "../parts/eye-right.component";
import jaw from "../parts/jaw.component";
import nose from "../parts/nose.component";
import skull from "../parts/skull.component";

// torso
import clavicalLeft from "../parts/clavical-left.component";
import clavicalRight from "../parts/clavical-right.component";
import heart from "../parts/heart.component";
import kidneyLeft from "../parts/kidney-left.component";
import kidneyRight from "../parts/kidney-right.component";
import liver from "../parts/liver.component";
import lungLeft from "../parts/lung-left.component";
import lungRight from "../parts/lung-right.component";
import pelvis from "../parts/pelvis.component";
import spine from "../parts/spine.component";
import sternum from "../parts/sternum.component";
import stomach from "../parts/stomach.component";

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
        },
        torso: {
          parts: [
            "clavicalLeft",
            "clavicalRight",
            "heart",
            "kidneyLeft",
            "kidneyRight",
            "liver",
            "lungLeft",
            "lungRight",
            "pelvis",
            "spine",
            "sternum",
            "stomach"
          ],
          pierce: {
            minor: "torso is pierced",
            major: "torso is pierced to the skull!",
            destroyed: "torso is pierced through entirely!"
          },
          bludgeon: {
            minor: "torso is bruised.",
            major: "torso is battered.",
            destroyed:
              "torso is smashed into the body, leaving only a pulpy mash!"
          },
          slash: {
            minor: "torso is cut.",
            major: "torso is cut deep enough to reveal an ivory skull.",
            destroyed: "torso flies through the air in a bloody arc!"
          }
        }
      },
      // head and face
      brain: brain(),
      earLeft: earLeft(),
      earRight: earRight(),
      eyeLeft: eyeLeft(),
      eyeRight: eyeRight(),
      jaw: jaw(),
      nose: nose(),
      skull: skull(),
      // torso
      clavicalLeft: clavicalLeft(),
      clavicalRight: clavicalRight(),
      heart: heart(),
      kidneyLeft: kidneyLeft(),
      kidneyRight: kidneyRight(),
      liver: liver(),
      lungLeft: lungLeft(),
      lungRight: lungRight(),
      pelvis: pelvis(),
      spine: spine(),
      sternum: sternum(),
      stomach: stomach()
    };
  };

export default componentAnatomyHumanoid;
