import { PolylineInterface } from "../../../shapes/shapes";
import { drawPolyline, drawDot, drawLine } from "../drawing/drawings";

export default function polylineAndDraw(bufferCtx, Scene) {
  const { selected, mousePos } = Scene;
  const {
    vertices: polyLineVertices,
    isCursorOnFirstPoint,
    isCursorOnLastPoint,
    firstPointRadius,
    lastPointRadius
  } = PolylineInterface();

  const numOfPolyLineVertices = polyLineVertices.length;
  if (selected === "polyline" || selected === "draw") {
    drawDot(bufferCtx, 2, mousePos, "black");
    drawPolyline(
      bufferCtx,
      [...polyLineVertices],
      {
        strokeStyle: "black",
        lineWidth: 1,
        globalAlpha: 0.3,
        fillStyle: "blue"
      },
      true
    );
  }
  if (selected === "polyline") {
    const firstPoint = polyLineVertices[0] || [];
    const lastPoint = polyLineVertices[numOfPolyLineVertices - 1] || [];
    const firstPointColour = isCursorOnFirstPoint ? "red" : "blue";
    const lastPointColour = isCursorOnLastPoint
      ? "green"
      : numOfPolyLineVertices > 1
      ? "black"
      : "blue";

    const firstPointDotSize = isCursorOnFirstPoint ? firstPointRadius : 4;
    const lastPointDotSize = isCursorOnLastPoint ? lastPointRadius : 2;

    for (let v = 0; v < numOfPolyLineVertices; v++) {
      const point = polyLineVertices[v];
      const shouldDisplayPoint = !(
        (v === numOfPolyLineVertices - 1 && isCursorOnLastPoint) ||
        v === 0
      );
      if (shouldDisplayPoint) {
        drawDot(bufferCtx, 2, point, "black");
      }
    }

    drawDot(bufferCtx, 2, mousePos, "black");

    drawLine(bufferCtx, lastPoint, mousePos, {
      lineWidth: 1,
      globalAlpha: 0.5,
      setLineDash: [5, 5]
    });
    drawDot(bufferCtx, firstPointDotSize, firstPoint, firstPointColour);
    drawDot(bufferCtx, lastPointDotSize, lastPoint, lastPointColour);
  }
}
