const componentAnatomySternum = (
  params = {
    ifDestroyed: "pain",
    max: 25,
    current: 25
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomySternum;
