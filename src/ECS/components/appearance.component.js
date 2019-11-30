const componentAppearance = (params = {}) => {
  const name = "appearance";
  const { color = "#ff0077", char = "?" } = params;

  return {
    name,
    color,
    char
  };
};

export default componentAppearance;
