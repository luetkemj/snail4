const componentAnatomyClavicalRight = (
  params = {
    ifDestroyed: "dexterity debuff",
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

export default componentAnatomyClavicalRight;
