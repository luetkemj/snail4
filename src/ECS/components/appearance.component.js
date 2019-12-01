import { colors } from "../../lib/graphics";

const componentAppearance = (params = {}) => {
  const name = "appearance";
  const { color = color.defaultColor, char = "?" } = params;

  return {
    name,
    color,
    char
  };
};

export default componentAppearance;
