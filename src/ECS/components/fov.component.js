const componentFov = (params = {}) => {
  const name = "fov";

  return {
    name,
    inFov: params.inFov || false,
    distance: params.distance || 0,
    revealed: params.revealed || false
  };
};

export default componentFov;
