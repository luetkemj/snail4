const componentBrain = (params = {}) => {
  const name = "brain";
  return {
    name,
    goalStack: [],
    desires: {
      bored: 0,
      thirst: 0,
      hunger: 0,
      anger: 0
    }
  };
};

export default componentBrain;
