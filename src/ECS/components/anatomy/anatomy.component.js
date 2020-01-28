import humanoid from "./types/humanoid.component";

const types = { humanoid };

const componentAnatomy = (params = { type: "humanoid" }) => {
  return {
    ...types[params.type](),
    armorSlots: Object.keys(types[params.type]().groups).reduce((acc, val) => {
      acc[val] = "";
      return acc;
    }, {})
  };
};

export default componentAnatomy;
