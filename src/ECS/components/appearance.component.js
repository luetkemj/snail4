const appearance = function componentAppearance(params = {}) {
  this.name = "appearance";

  const { color = "#ff0077", char = "?" } = params;

  this.color = color;
  this.char = char;

  return this;
};

export default appearance;
