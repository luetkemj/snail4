const componentWearable = (params = { slots: [] }) => {
  return {
    beingWorn: false,
    slots: params.slots
  };
};

export default componentWearable;
