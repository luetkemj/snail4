const componentAnatomyEyeLeft = (
  params = {
    ifDestroyed: "blind",
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

export default componentAnatomyEyeLeft;
