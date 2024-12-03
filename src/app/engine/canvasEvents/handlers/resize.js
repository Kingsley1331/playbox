import {
  resizeInterface,
  forEachShape,
  updatePhysicsProperties
} from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";

export const resizeMousedown = Scene => {
  if (Scene.selected === "resize") {
    const {
      selectShape,
      setResizeBoundingRect,
      setResizerDraggingState,
      geCurrentResizer,
      getSelectedShapeIndex,
      setDraggable,
      getOnResizer,
      setReferenceVertices
    } = resizeInterface();

    const referenceVertices = getSelectedShapeIndex()
      ? ShapesController.getProperty(getSelectedShapeIndex(), "vertices").map(
          vertex => ({
            x: vertex.x,
            y: vertex.y
          })
        )
      : [];

    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");

      if (onShape) {
        selectShape(idx);
        const boundingRect = ShapesController.getProperty(idx, "boundingRect");
        setResizeBoundingRect(boundingRect.vertices);
      }
      const currentResizer = geCurrentResizer();

      if (currentResizer && getSelectedShapeIndex() === idx) {
        setResizerDraggingState(true);
        setReferenceVertices(referenceVertices);
        if (getOnResizer()) {
          setDraggable(true);
        }
      }
    });
  }
};

export const resizeMousemove = Scene => {
  const { selected, mousePos } = Scene;
  if (selected === "resize") {
    const {
      getSelectedShapeIndex,
      getSelectedSideLength,
      setCurrentResizer,
      geCurrentResizer,
      getResizeBoundingRect,
      setResizeBoundingRect,
      getResizerDraggingState,
      getDraggable,
      setOnResizer,
      getReferenceVertices
    } = resizeInterface();
    const selectedShapeIndex = getSelectedShapeIndex();
    if (selectedShapeIndex) {
      const boundingRect = ShapesController.getProperty(
        selectedShapeIndex,
        "boundingRect"
      );

      const referenceVertices = getReferenceVertices();

      const { vertices } = boundingRect;

      const resizeBoundingRect = getResizeBoundingRect();
      const centreOfMass = ShapesController.getCentreOfMass(selectedShapeIndex);

      const boundingRectCentre = {
        x: (vertices[0].x + vertices[1].x) / 2 + centreOfMass.x,
        y: (vertices[1].y + vertices[2].y) / 2 + centreOfMass.y
      };

      const boundingRectSize = {
        x: Math.abs(vertices[0].x - vertices[1].x) / 2,
        y: Math.abs(vertices[1].y - vertices[2].y) / 2
      };

      const halfLength = getSelectedSideLength() / 2;
      const resizers = {
        topLeft: {
          x: resizeBoundingRect[0].x + centreOfMass.x,
          y: resizeBoundingRect[0].y + centreOfMass.y
        },
        topMiddle: {
          x:
            (resizeBoundingRect[0].x + resizeBoundingRect[1].x) / 2 +
            centreOfMass.x,
          y:
            (resizeBoundingRect[0].y + resizeBoundingRect[1].y) / 2 +
            centreOfMass.y
        },
        topRight: {
          x: resizeBoundingRect[1].x + centreOfMass.x,
          y: resizeBoundingRect[1].y + centreOfMass.y
        },
        rightMiddle: {
          x:
            (resizeBoundingRect[1].x + resizeBoundingRect[2].x) / 2 +
            centreOfMass.x,
          y:
            (resizeBoundingRect[1].y + resizeBoundingRect[2].y) / 2 +
            centreOfMass.y
        },
        rightBottom: {
          x: resizeBoundingRect[2].x + centreOfMass.x,
          y: resizeBoundingRect[2].y + centreOfMass.y
        },
        bottomMiddle: {
          x:
            (resizeBoundingRect[2].x + resizeBoundingRect[3].x) / 2 +
            centreOfMass.x,
          y:
            (resizeBoundingRect[2].y + resizeBoundingRect[3].y) / 2 +
            centreOfMass.y
        },
        bottomLeft: {
          x: resizeBoundingRect[3].x + centreOfMass.x,
          y: resizeBoundingRect[3].y + centreOfMass.y
        },
        leftMiddle: {
          x:
            (resizeBoundingRect[3].x + resizeBoundingRect[0].x) / 2 +
            centreOfMass.x,
          y:
            (resizeBoundingRect[3].y + resizeBoundingRect[0].y) / 2 +
            centreOfMass.y
        }
      };

      const checkIfCursorIsOnResizer = resizer =>
        mousePos.x >= resizers[resizer].x - halfLength &&
        mousePos.x <= resizers[resizer].x + halfLength &&
        mousePos.y >= resizers[resizer].y - halfLength &&
        mousePos.y <= resizers[resizer].y + halfLength;

      const topLeft = checkIfCursorIsOnResizer("topLeft");
      const topMiddle = checkIfCursorIsOnResizer("topMiddle");
      const topRight = checkIfCursorIsOnResizer("topRight");
      const rightMiddle = checkIfCursorIsOnResizer("rightMiddle");
      const rightBottom = checkIfCursorIsOnResizer("rightBottom");
      const bottomMiddle = checkIfCursorIsOnResizer("bottomMiddle");
      const bottomLeft = checkIfCursorIsOnResizer("bottomLeft");
      const leftMiddle = checkIfCursorIsOnResizer("leftMiddle");

      const expand = axis => {
        const { x, y } = boundingRectCentre;

        const resizerDistanceFromCentre = {
          x: mousePos.x - x,
          y: mousePos.y - y
        };

        const expansionRatio = {
          x: resizerDistanceFromCentre.x / boundingRectSize.x,
          y: resizerDistanceFromCentre.y / boundingRectSize.y
        };

        const expansionRatioX = Math.abs(expansionRatio.x);
        const expansionRatioY = Math.abs(expansionRatio.y);

        const newResizeBoundingRect = vertices.map(vertex => ({
          x: vertex.x * (axis === "y" ? 1 : expansionRatioX),
          y:
            vertex.y *
            (axis === "x"
              ? 1
              : axis === "y"
              ? expansionRatioY
              : expansionRatioX)
        }));

        /**NOTE:Repeated code same as above */
        const expandedVertices = referenceVertices.map(vertex => ({
          x: vertex.x * (axis === "y" ? 1 : expansionRatioX),
          y:
            vertex.y *
            (axis === "x"
              ? 1
              : axis === "y"
              ? expansionRatioY
              : expansionRatioX)
        }));

        ShapesController.setProperty(
          selectedShapeIndex,
          "vertices",
          expandedVertices
        );
        setResizeBoundingRect(newResizeBoundingRect);
      };

      setOnResizer(false);

      if (topLeft) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("topLeft");
        }
        setOnResizer(true);
      }

      if (getResizerDraggingState() && geCurrentResizer() === "topLeft") {
        if (getDraggable()) {
          expand();
        }
      }

      if (topMiddle) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("topMiddle");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "topMiddle") {
        if (getDraggable()) {
          expand("y");
        }
      }

      if (topRight) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("topRight");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "topRight") {
        if (getDraggable()) {
          expand();
        }
      }
      if (rightMiddle) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("rightMiddle");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "rightMiddle") {
        if (getDraggable()) {
          expand("x");
        }
      }
      if (rightBottom) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("rightBottom");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "rightBottom") {
        if (getDraggable()) {
          expand();
        }
      }
      if (bottomMiddle) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("bottomMiddle");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "bottomMiddle") {
        if (getDraggable()) {
          expand("y");
        }
      }
      if (bottomLeft) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("bottomLeft");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "bottomLeft") {
        if (getDraggable()) {
          expand();
        }
      }
      if (leftMiddle) {
        if (!getResizerDraggingState()) {
          setCurrentResizer("leftMiddle");
        }
        setOnResizer(true);
      }
      if (getResizerDraggingState() && geCurrentResizer() === "leftMiddle") {
        if (getDraggable()) {
          expand("x");
        }
      }
    }
  }
};

export const resizeMouseMouseup = Scene => {
  if (Scene.selected === "resize") {
    const {
      setResizerDraggingState,
      setCurrentResizer,
      setDraggable,
      getSelectedShapeIndex
    } = resizeInterface();

    const selectedShapeIndex = getSelectedShapeIndex();

    if (selectedShapeIndex !== null) {
      const selectedShapeId = ShapesController.getProperty(
        selectedShapeIndex,
        "id"
      );

      updatePhysicsProperties(selectedShapeId);
    }

    setResizerDraggingState(false);
    setCurrentResizer();
    setDraggable(false);
  }
};
