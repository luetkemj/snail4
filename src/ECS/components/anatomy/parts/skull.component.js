const componentAnatomySkull = (
  params = {
    ifDestroyed: "death",
    max: 30,
    current: 30
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomySkull;
