const componentConsumable = (params = { effects: [] }) => {
  return {
    effects: params.effects // [{ buff: { component, key, delta } }, ...]
  };
};

export default componentConsumable;
