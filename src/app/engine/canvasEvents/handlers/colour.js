import { ColourInterface, forEachShape } from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";

export const colourMousedown = Scene => {
  if (Scene.selected === "colour") {
    const {
      selectShape,
      getCurrentColour,
      getSelectedShapeIndex,
      setCurrentColour
    } = ColourInterface();
    const currentColour = getCurrentColour();
    const selectedShapeIndex = getSelectedShapeIndex();
    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");
      if (onShape) {
        if (selectedShapeIndex !== idx) {
          selectShape(idx);
          if (currentColour) {
            ShapesController.setProperty(idx, "fillColour", currentColour);
          }
        } else {
          selectShape();
          setCurrentColour();
        }
      }
    }, false);
  }
};
