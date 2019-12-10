import { colors } from "../../lib/graphics";
import { layers } from "../../lib/canvas";

const componentAppearance = (params = {}) => {
  const {
    color = colors.defaultColor,
    char = "?",
    background = "transparent",
    layer = layers.ground
  } = params;

  return {
    color,
    char,
    background,
    layer
  };
};

export default componentAppearance;
