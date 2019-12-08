const componentFov = (params = {}) => {
  return {
    inFov: params.inFov || false,
    distance: params.distance || 0,
    revealed: params.revealed || false,
    showIfRevealed: params.showIfRevealed || false
  };
};

export default componentFov;
