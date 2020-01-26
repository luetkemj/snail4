const componentAnatomyEarLeft = (
  params = {
    ifDestroyed: "deaf",
    max: 10,
    current: 10
  }
) => {
  return {
    max: params.max,
    current: params.current,
    ifDestroyed: params.ifDestroyed,
    pierce: {
      minor: "ear is pierced.",
      major: "ear is cruelly pierced!",
      destroyed: "ear is pierced to pieces!"
    },
    bludgeon: {
      minor: "ear is bruised.",
      major: "ear is battered.",
      destroyed: "ear is smashed to a bloody pulp!"
    },
    slash: {
      minor: "ear is cut.",
      major: "ear is cut deeply.",
      destroyed: "ear is slashed to ribbons!"
    }
  };
};

export default componentAnatomyEarLeft;
