const componentApply = (params = {}) => {
  const noop = () => {};

  const required = params.required || {};
  const func = params.func || noop;
  const uses = params.uses || 1;

  return {
    required,
    func,
    uses
  };
  // const {
  //   color = colors.defaultColor,
  //   char = "?",
  //   background = "transparent",
  //   layer = layers.ground
  // } = params;

  // return {
  //   color,
  //   char,
  //   background,
  //   layer
  // };
};

export default componentApply;
