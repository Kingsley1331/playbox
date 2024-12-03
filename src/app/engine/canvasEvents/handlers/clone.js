import { CloneInterface } from "../../shapes/shapes";
import { createShape, forEachShape } from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";

export const cloneMousedown = (Scene, evt) => {
  const { selected, mousePos } = Scene;

  if (selected === "clone" && evt.which === 1) {
    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");
      if (onShape) {
        const {
          setClonedShapeId,
          setClonedShapeLinewidth,
          setClonedShapeColour,
          setClonedStrokeStyle,
          setClonedShapeVertices,
          setIsShapeFixed
        } = CloneInterface(idx);
        setClonedShapeId();
        setClonedShapeLinewidth();
        setClonedShapeColour();
        setClonedShapeVertices();
        setClonedStrokeStyle();
        setIsShapeFixed();
      }
    });
    const {
      getClonedShapeId,
      getClonedShapeVertices,
      getClonedShapeColour,
      getClonedShapeLinewidth,
      getClonedStrokeStyle,
      getIsShapeFixed
    } = CloneInterface();
    const cloneShapeId = getClonedShapeId();
    if (cloneShapeId) {
      const onClonedShape = ShapesController.getProperty(
        cloneShapeId,
        "onShape"
      );
      const vertices = getClonedShapeVertices().map(vertex => ({
        x: vertex.x,
        y: vertex.y
      }));

      const fillColour = getClonedShapeColour();
      const strokeStyle = getClonedStrokeStyle();
      const linewidth = getClonedShapeLinewidth();
      const isShapeFixed = getIsShapeFixed();

      if (!onClonedShape) {
        const clone = createShape(mousePos, vertices);
        clone.fillColour = fillColour;
        clone.strokeStyle = strokeStyle;
        clone.linewidth = linewidth;
        clone.freezeShape = isShapeFixed;
      }
    }
  }
};
