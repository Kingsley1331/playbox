import { CloneInterface } from "../../../shapes/shapes";
import { drawShape } from "../drawing/drawings";

export default function clone(bufferCtx, Scene) {
  const { selected, mousePos } = Scene;
  if (selected === "clone") {
    const { getClonedShapeVertices } = CloneInterface();
    const clonedVertices = getClonedShapeVertices();

    if (clonedVertices.length) {
      drawShape(bufferCtx, clonedVertices, mousePos, {
        strokeStyle: "black",
        lineWidth: 1,
        globalAlpha: 0.3,
        fillStyle: "blue"
      });
    }
  }
}
