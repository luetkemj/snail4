const position = function componentPosition(params = {}) {
  const { x = 0, y = 0 } = params;

  return {
    x,
    y
  };
};

export default position;
