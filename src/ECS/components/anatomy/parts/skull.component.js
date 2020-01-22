const componentAnatomySkull = (
  params = {
    hp: 30,
    ifDestroyed: "death"
  }
) => {
  return {
    hp: params.hp,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentAnatomySkull;
