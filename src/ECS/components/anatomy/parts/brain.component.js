const componentAnatomyBrain = (
  params = {
    ifDestroyed: "death",
    max: 10,
    current: 10,
    bleeds: 10
  }
) => {
  return {
    bleeds: 10,

    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomyBrain;
