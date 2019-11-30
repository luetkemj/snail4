const position = function componentPosition(params = {}) {
  const name = "position";
  const { x = 0, y = 0 } = params;

  return {
    name,
    x,
    y
  };
};

export default position;
