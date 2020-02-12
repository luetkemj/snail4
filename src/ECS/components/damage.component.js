// todo: manage damage types in here too?
const componentDamage = (params = { dmg: 0, type: "slash" }) => {
  const { dmg, type } = params;
  return { dmg, type };
};

export default componentDamage;
