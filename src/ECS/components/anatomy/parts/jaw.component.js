const componentJaw = (
  params = {
    ifDestroyed: "cannot eat or drink",
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

export default componentJaw;
