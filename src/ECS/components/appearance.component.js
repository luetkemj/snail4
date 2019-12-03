import { colors } from "../../lib/graphics";

const componentAppearance = (params = {}) => {
  const { color = colors.defaultColor, char = "?" } = params;

  return {
    color,
    char
  };
};

export default componentAppearance;
