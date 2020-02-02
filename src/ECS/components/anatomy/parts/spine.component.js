const componentAnatomySpine = (
  params = {
    ifDestroyed: "paralyzed from injury down",
    max: 25,
    current: 25
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomySpine;
