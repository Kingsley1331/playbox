import { reshapeInterface } from "../../../shapes/shapes";
import ShapesController from "../../../shapes/ShapesController";
import { drawDot, screenWriter } from "../drawing/drawings";

export default function reshape(
  vertices,
  bufferCtx,
  Scene,
  centreOfMass,
  shapeIndex
) {
  const { selected } = Scene;
  const shapeId = ShapesController.getProperty(shapeIndex, "id");

  if (selected === "reshape") {
    const { getVertexIndex, getSelectedShapeId } = reshapeInterface();
    const selectedShapeId = getSelectedShapeId();
    if (selectedShapeId && selectedShapeId === shapeId) {
      const numOfVertices = vertices.length;
      for (let v = 0; v < numOfVertices; v++) {
        let dotSize = 2;
        const x = vertices[v].x + centreOfMass.x;
        const y = vertices[v].y + centreOfMass.y;
        const vertex = getVertexIndex();
        if (vertex === v) {
          dotSize = 4;
        }
        drawDot(bufferCtx, dotSize, { x, y }, "black");
        screenWriter(bufferCtx, v, {
          x: x + 4,
          y: y - 4
        });
      }
    }
  }
}
