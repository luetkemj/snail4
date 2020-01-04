const coinPurse = require("scribe-rpg-coin-purse");

const config = {
  denominations: [
    {
      name: "copper",
      abrv: "CP",
      copperValue: 1
    },
    {
      name: "silver",
      abrv: "SP",
      copperValue: 10
    },
    {
      name: "gold",
      abrv: "GP",
      copperValue: 100
    }
  ]
};

export const copperValue = string => coinPurse.copperValue(string, config);
export const parser = exp => coinPurse.parser(exp, config);
export const subUnits = coppers => coinPurse.subUnits(coppers, config);
export const total = values => coinPurse.total(values, config);

export const humanValue = coppers => {
  const obj = subUnits(coppers);
  return `${obj.GP}gp ${obj.SP}sp ${obj.CP}cp`;
};
