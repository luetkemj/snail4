const componentAnatomyLiver = (
  params = {
    ifDestroyed: "metabolism, death",
    max: 20,
    current: 20
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomyLiver;
