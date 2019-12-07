const componentTrack = (params = {}) => {
  const { eId = "", createdAt = 0 } = params;
  return {
    eId,
    createdAt
  };
};

export default componentTrack;
