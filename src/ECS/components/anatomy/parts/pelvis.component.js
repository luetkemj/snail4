const componentAnatomyPelvis = (
  params = {
    ifDestroyed: "cannot move",
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

export default componentAnatomyPelvis;
