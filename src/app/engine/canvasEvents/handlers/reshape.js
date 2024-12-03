import {
  reshapeInterface,
  forEachShape,
  updatePhysicsProperties
} from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";
import { calculateDistanceFromCursor } from "../../utils/position";

export const reshapeMousedown = Scene => {
  if (Scene.selected === "reshape") {
    const {
      selectShape,
      setIsVertexBeingDragged,
      getVertexIndex
    } = reshapeInterface();
    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");
      if (onShape) {
        const shapeId = ShapesController.getProperty(idx, "id");
        selectShape(shapeId);
      }
    });
    if (getVertexIndex() !== null) {
      setIsVertexBeingDragged(true);
    }
  }
};

export const reshapeMousemove = Scene => {
  const { selected, mousePos } = Scene;
  if (selected === "reshape") {
    const {
      getVertexIndex,
      setVertex,
      getSelectedShapeId,
      getIsVertexBeingDragged
    } = reshapeInterface();

    const selectedShapeId = getSelectedShapeId();
    const selectedShape = Scene.shapes.filter(
      shape => shape.id === selectedShapeId
    )[0];
    if (!getIsVertexBeingDragged()) {
      setVertex(null);
    }
    forEachShape(function(idx) {
      if (idx === selectedShapeId) {
        const centreOfMass = selectedShape.centreOfMass;
        const vertices = selectedShape.vertices.map(vertex => ({
          x: vertex.x,
          y: vertex.y
        }));

        const numOfVertices = vertices.length;
        for (let v = 0; v < numOfVertices; v++) {
          const vertex = vertices[v];
          const { x, y } = vertex;
          const distanceFromCursor = calculateDistanceFromCursor(
            {
              x: x + centreOfMass.x,
              y: y + centreOfMass.y
            },
            mousePos
          );

          if (distanceFromCursor < 10) {
            setVertex(v);
          }
        }
        if (getIsVertexBeingDragged()) {
          const vertexIndex = getVertexIndex();
          if (selectedShape.vertices[vertexIndex]) {
            selectedShape.vertices[vertexIndex].x = mousePos.x - centreOfMass.x;
            selectedShape.vertices[vertexIndex].y = mousePos.y - centreOfMass.y;
          }
        }
      }
    }, false);
  }
};

export const reshapeMousUp = Scene => {
  if (Scene.selected === "reshape") {
    const { setIsVertexBeingDragged, getSelectedShapeId } = reshapeInterface();
    setIsVertexBeingDragged(false);
    const selectedShapeId = getSelectedShapeId();
    if (selectedShapeId) {
      updatePhysicsProperties(selectedShapeId);
    }
  }
};
