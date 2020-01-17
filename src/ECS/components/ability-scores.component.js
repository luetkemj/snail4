const componentAbilityScores = (
  params = {
    charisma: 0,
    constitution: 0,
    dexterity: 0,
    intelligence: 0,
    strength: 0,
    wisdom: 0
  }
) => {
  return {
    charisma: params.charisma,
    constitution: params.constitution,
    dexterity: params.dexterity,
    intelligence: params.intelligence,
    strength: params.strength,
    wisdom: params.wisdom
  };
};

export default componentAbilityScores;
