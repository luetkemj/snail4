import { random, findIndex, sample, sum } from "lodash";

// roll a single 'd' sided die
// return number
const roll = d => random(1, d);

// roll a single 'd' sided die 'n' times
// return array
export const rolls = (d, n) => Array.from(Array(n), () => roll(d));

// remvove the first occurence of the lowest value in an array
// return array
export const removeLowest = rolls => {
  const min = Math.min(...rolls);

  const minIndex = findIndex(rolls, x => x === min);

  rolls.splice(minIndex, 1);

  return rolls;
};

export const abilityScores = () => ({
  charisma: sum(removeLowest(rolls(6, 4))),
  constitution: sum(removeLowest(rolls(6, 4))),
  dexterity: sum(removeLowest(rolls(6, 4))),
  intelligence: sum(removeLowest(rolls(6, 4))),
  strength: sum(removeLowest(rolls(6, 4))),
  wisdom: sum(removeLowest(rolls(6, 4)))
});

const races = [
  {
    name: "Dwarf",
    racialBonus: {
      charisma: -2,
      constitution: 2,
      dexterity: 0,
      intelligence: 0,
      strength: 0,
      wisdom: 2
    }
  },
  {
    name: "Elf",
    racialBonus: {
      charisma: 0,
      constitution: -2,
      dexterity: 2,
      intelligence: 2,
      strength: 0,
      wisdom: 0
    }
  },
  {
    name: "Gnome",
    racialBonus: {
      charisma: 2,
      constitution: 2,
      dexterity: 0,
      intelligence: 0,
      strength: -2,
      wisdom: 0
    }
  },
  {
    name: "Halfling",
    racialBonus: {
      charisma: 2,
      constitution: 0,
      dexterity: 2,
      intelligence: 0,
      strength: -2,
      wisdom: 0
    }
  },
  {
    name: "Human",
    racialBonus: {
      charisma: 0,
      constitution: 0,
      dexterity: 0,
      intelligence: 0,
      strength: 0,
      wisdom: 0
    }
  }
];

const addRacialBonus = (scores, race) => {
  const { racialBonus } = race;

  const abilityScores = Object.keys(scores).reduce((acc, val) => {
    acc[val] = scores[val] + racialBonus[val];

    return acc;
  }, {});

  return abilityScores;
};

export const abilityScoreMod = score => Math.floor((score - 10) / 2);

export const createCharacter = () => {
  const baseAbilityScores = abilityScores();
  const race = sample(races);

  return {
    abilityScores: addRacialBonus(baseAbilityScores, race),
    baseAbilityScores,
    race: race.name,
    racialBonus: race.racialBonus
  };
};
