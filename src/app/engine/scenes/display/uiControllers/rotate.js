import { rotateInterface } from "../../../shapes/shapes";
import { drawShape, drawLine, drawCircle } from "../drawing/drawings";
import ShapesController from "../../../shapes/ShapesController";

export default function rotate(bufferCtx, Scene, shapeIndex) {
  const { selected } = Scene;

  if (selected === "rotate") {
    const {
      getReferenceVertices,
      getReferenceCentreOfMass
    } = rotateInterface();
    const initialVertices = getReferenceVertices();
    const referenceCentreOfMass = getReferenceCentreOfMass();

    if (initialVertices.length) {
      drawShape(bufferCtx, initialVertices, referenceCentreOfMass, {
        strokeStyle: "black",
        lineWidth: 0.1,
        globalAlpha: 0.1,
        fillStyle: "grey"
      });
    }

    const {
      getSelectedShapeIndex,
      getHandleRadius,
      getOnhandle,
      getLever,
      getRotateBoundingRect
    } = rotateInterface();

    if (getSelectedShapeIndex() === shapeIndex) {
      const centreOfMass = ShapesController.getCentreOfMass(shapeIndex);
      const handleRadius = getHandleRadius();
      const { start, end } = getLever();

      const handleColour = getOnhandle() ? "lightgreen" : "white";
      const leverStart = {
        x: centreOfMass.x + start.x,
        y: centreOfMass.y + start.y
      };

      const leverEnd = {
        x: centreOfMass.x + end.x,
        y: centreOfMass.y + end.y
      };

      const handleCentre = { x: leverEnd.x, y: leverEnd.y };

      drawLine(bufferCtx, leverStart, leverEnd, {
        lineWidth: 0.4
      });

      const rotateBoundingRect = getRotateBoundingRect();
      if (rotateBoundingRect.length) {
        drawShape(bufferCtx, rotateBoundingRect, centreOfMass, {
          strokeStyle: "black",
          lineWidth: 1,
          fillStyle: "transparent",
          globalAlpha: 0.5,
          setLineDash: [5, 5]
        });
      }
      drawCircle(bufferCtx, handleRadius, handleCentre, {
        lineWidth: 0.5,
        fillStyle: handleColour
      });
    }
  }
}
