const position = function componentPosition(params = {}) {
  this.name = "position";

  const { x = 0, y = 0 } = params;

  this.x = x;
  this.y = y;

  return this;
};

export default position;
