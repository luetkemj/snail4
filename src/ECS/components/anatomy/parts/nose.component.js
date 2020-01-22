const componentNose = (
  params = {
    hp: 10,
    ifDestroyed: "smell-blind"
  }
) => {
  return {
    hp: params.hp,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentNose;
