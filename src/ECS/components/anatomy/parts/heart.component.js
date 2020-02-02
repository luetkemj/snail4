const componentAnatomyHeart = (
  params = {
    ifDestroyed: "death",
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

export default componentAnatomyHeart;
