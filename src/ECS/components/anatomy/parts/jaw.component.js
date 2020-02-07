const componentJaw = (
  params = {
    ifDestroyed: "cannot eat or drink",
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

export default componentJaw;
