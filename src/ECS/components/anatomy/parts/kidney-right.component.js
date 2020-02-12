const componentAnatomyKidneyRight = (
  params = {
    ifDestroyed: "death if both lost - blood filtration",
    max: 20,
    current: 20,
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

export default componentAnatomyKidneyRight;
