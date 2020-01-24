const componentAnatomyBrain = (
  params = {
    ifDestroyed: "death",
    max: 10,
    current: 10
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomyBrain;
