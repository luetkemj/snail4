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
