import { colors } from "../../lib/graphics";

const componentAppearance = (params = {}) => {
  const {
    color = colors.defaultColor,
    char = "?",
    background = "transparent"
  } = params;

  return {
    color,
    char,
    background
  };
};

export default componentAppearance;
