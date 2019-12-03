const componentFov = (params = {}) => {
  return {
    inFov: params.inFov || false,
    distance: params.distance || 0,
    revealed: params.revealed || false
  };
};

export default componentFov;
