import { resizeInterface } from "../../../shapes/shapes";
import { drawShape, drawSquare } from "../drawing/drawings";
import ShapesController from "../../../shapes/ShapesController";

export default function resize(bufferCtx, Scene, shapeIndex) {
  const { selected } = Scene;
  if (selected === "resize") {
    const {
      getSelectedShapeIndex,
      getSelectedSideLength,
      getResizeBoundingRect
    } = resizeInterface();
    if (getSelectedShapeIndex() === shapeIndex) {
      const boundingRect = ShapesController.getProperty(
        shapeIndex,
        "boundingRect"
      );
      const centreOfMass = ShapesController.getCentreOfMass(shapeIndex);

      const rectVertices = getResizeBoundingRect(boundingRect.vertices);
      const sideLength = getSelectedSideLength();

      drawShape(bufferCtx, rectVertices, centreOfMass, {
        lineWidth: 0.5,
        fillStyle: "transparent",
        setLineDash: [3, 3]
      });

      /**In clockwise direction */
      // top left
      drawSquare(
        bufferCtx,
        {
          x: rectVertices[0].x + centreOfMass.x,
          y: rectVertices[0].y + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // top middle
      drawSquare(
        bufferCtx,
        {
          x: (rectVertices[0].x + rectVertices[1].x) / 2 + centreOfMass.x,
          y: (rectVertices[0].y + rectVertices[1].y) / 2 + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );

      // top right
      drawSquare(
        bufferCtx,
        {
          x: rectVertices[1].x + centreOfMass.x,
          y: rectVertices[1].y + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // right middle

      drawSquare(
        bufferCtx,
        {
          x: (rectVertices[1].x + rectVertices[2].x) / 2 + centreOfMass.x,
          y: (rectVertices[1].y + rectVertices[2].y) / 2 + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // right bottom
      drawSquare(
        bufferCtx,
        {
          x: rectVertices[2].x + centreOfMass.x,
          y: rectVertices[2].y + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // bottom middle
      drawSquare(
        bufferCtx,
        {
          x: (rectVertices[2].x + rectVertices[3].x) / 2 + centreOfMass.x,
          y: (rectVertices[2].y + rectVertices[3].y) / 2 + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // bottom left
      drawSquare(
        bufferCtx,
        {
          x: rectVertices[3].x + centreOfMass.x,
          y: rectVertices[3].y + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
      // left middle
      drawSquare(
        bufferCtx,
        {
          x: (rectVertices[3].x + rectVertices[0].x) / 2 + centreOfMass.x,
          y: (rectVertices[3].y + rectVertices[0].y) / 2 + centreOfMass.y
        },
        sideLength,
        {
          lineWidth: 0.5,
          fillStyle: "white"
        }
      );
    }
  }
}
