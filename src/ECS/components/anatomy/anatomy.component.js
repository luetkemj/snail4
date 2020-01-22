import humanoid from "./types/humanoid.component";

const types = { humanoid };

const componentAnatomy = (params = { type: "humanoid" }) => {
  return {
    ...types[params.type]()
  };
};

export default componentAnatomy;
