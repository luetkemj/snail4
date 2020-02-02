const componentAnatomyLungLeft = (
  params = {
    ifDestroyed: "death if both lungs lost",
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

export default componentAnatomyLungLeft;
