const componentJaw = (
  params = {
    hp: 10,
    ifDestroyed: "death"
  }
) => {
  return {
    hp: params.hp,
    ifDestroyed: params.ifDestroyed
  };
};

export default componentJaw;
