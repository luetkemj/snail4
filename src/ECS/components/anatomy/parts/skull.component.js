const componentAnatomySkull = (
  params = {
    ifDestroyed: "death",
    max: 30,
    current: 30,
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

export default componentAnatomySkull;
