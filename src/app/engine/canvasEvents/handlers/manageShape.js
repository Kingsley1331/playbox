import { forEachShape, ShapeManagerInterface } from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";

export const manageShapeMousedown = (Scene, setManagedShapeIndex) => {
  if (Scene.selected === "manageShape") {
    const { getSelectedShapeIndex } = ShapeManagerInterface();
    const selectedShapeIndex = getSelectedShapeIndex();
    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");
      if (onShape) {
        setManagedShapeIndex(idx);
        if (selectedShapeIndex === idx) {
          setManagedShapeIndex();
        }
      }
    }, false);
  }
};
