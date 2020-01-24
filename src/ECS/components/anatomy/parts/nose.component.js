const componentNose = (
  params = {
    ifDestroyed: "smell-blind",
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

export default componentNose;
