import _ from "lodash";

// roll a single 'd' sided die
// return number
export const roll = d => _.random(1, d);

// roll a single 'd' sided die 'n' times
// return array of rolls
export const rolls = (d, n) => Array.from(Array(n), () => roll(d));

export const sumRolls = (d, n) => {
  const dRolls = rolls(d, n);
  return _.sum(dRolls);
};
