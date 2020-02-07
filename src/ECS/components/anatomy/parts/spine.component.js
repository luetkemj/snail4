const componentAnatomySpine = (
  params = {
    ifDestroyed: "paralyzed from injury down",
    max: 25,
    current: 25,
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

export default componentAnatomySpine;
