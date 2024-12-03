import {
  rotateInterface,
  forEachShape,
  updatePhysicsProperties
} from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";
import Vector, {
  magnitude,
  rotateVector,
  rotateShape,
  rotateShapeGeneral
} from "../../utils/maths/Vector";

export const rotateMousedown = Scene => {
  if (Scene.selected === "rotate") {
    const {
      selectShape,
      getSelectedShapeIndex,
      getOnhandle,
      setDraggingState,
      setLever,
      getIsDefault,
      setIsDefault,
      setReferenceVertices,
      setReferenceCentreOfMass,
      getDefaultLength,
      setReferenceBoundingRect,
      setRotateBoundingRect
    } = rotateInterface();

    const selectedShapeIndex = getSelectedShapeIndex();
    const defaultLength = getDefaultLength();
    const referenceVertices = selectedShapeIndex
      ? ShapesController.getProperty(selectedShapeIndex, "vertices").map(
          vertex => ({
            x: vertex.x,
            y: vertex.y
          })
        )
      : [];

    forEachShape(function(idx) {
      const onShape = ShapesController.getProperty(idx, "onShape");
      const centreOfMass = ShapesController.getCentreOfMass(idx);
      const boundingRect = ShapesController.getProperty(idx, "boundingRect");

      const boundingRectCentre = boundingRect.centre;

      const minY = boundingRect.minY;

      if (onShape) {
        selectShape(idx);
        if (getIsDefault()) {
          if (selectedShapeIndex !== idx) {
            setLever({
              start: { x: boundingRectCentre.x, y: minY },
              end: {
                x: boundingRectCentre.x,
                y: minY - defaultLength
              }
            });
          }

          setIsDefault(false);
        }
        if (selectedShapeIndex !== idx) {
          setReferenceBoundingRect(
            boundingRect.vertices.map(vertex => ({
              x: vertex.x,
              y: vertex.y
            }))
          );
          setRotateBoundingRect(
            boundingRect.vertices.map(vertex => ({
              x: vertex.x,
              y: vertex.y
            }))
          );
        }
      }
      if (getOnhandle()) {
        setDraggingState(true);
        if (getSelectedShapeIndex() === idx) {
          setReferenceVertices(referenceVertices);
          setReferenceCentreOfMass({ ...centreOfMass });
        }
      }
    });
  }
};

export const rotateMousemove = Scene => {
  const { selected, mousePos } = Scene;
  if (selected === "rotate") {
    const {
      getSelectedShapeIndex,
      getLever,
      setLever,
      getHandleRadius,
      setOnhandle,
      getDraggingState,
      getReferenceVertices,
      getDefaultLength,
      setIsDefault,
      getReferenceBoundingRect,
      setRotateBoundingRect,
      getReferenceLeverVectors
    } = rotateInterface();
    setOnhandle(false);
    const selectedShapeIndex = getSelectedShapeIndex();
    if (selectedShapeIndex) {
      const centreOfMass = ShapesController.getCentreOfMass(selectedShapeIndex);
      const boundingRect = ShapesController.getProperty(
        selectedShapeIndex,
        "boundingRect"
      );
      const { radius } = boundingRect;
      const referenceVertices = getReferenceVertices();
      const defaultLength = getDefaultLength();
      const { end } = getLever();
      const handleRadius = getHandleRadius();
      const leverEnd = {
        x: centreOfMass.x + end.x,
        y: centreOfMass.y + end.y
      };
      const handleCentre = { x: leverEnd.x, y: leverEnd.y };
      const distanceVector = {
        x: handleCentre.x - mousePos.x,
        y: handleCentre.y - mousePos.y
      };
      const cursorDistanceFromHandle = magnitude(distanceVector);
      if (getDraggingState()) {
        const {
          start: leverStartReferenceVector,
          end: leverEndReferenceVector
        } = getReferenceLeverVectors();
        const centreToCursorVector = new Vector({
          x: mousePos.x - centreOfMass.x,
          y: mousePos.y - centreOfMass.y
        });
        const angle = leverEndReferenceVector.findAngle(centreToCursorVector);
        const rotatedLeverStartVector = rotateVector(
          angle,
          leverStartReferenceVector
        );
        const rotatedLeverEndVector = rotateVector(
          angle,
          leverEndReferenceVector
        );
        setLever({
          start: rotatedLeverStartVector,
          end: rotatedLeverEndVector
        });
        setRotateBoundingRect(
          rotateShapeGeneral(getReferenceBoundingRect(), angle)
        );
        rotateShape(centreOfMass, angle, selectedShapeIndex, referenceVertices);
      } else {
        if (centreOfMass.y < radius + defaultLength + handleRadius) {
          setIsDefault(false);
        } else {
          setIsDefault(true);
        }
      }
      if (cursorDistanceFromHandle <= handleRadius) {
        setOnhandle(true);
      }
    }
  }
};

export const rotateMouseup = Scene => {
  if (Scene.selected === "rotate") {
    const {
      setDraggingState,
      getSelectedShapeIndex,
      setIsDefault,
      setReferenceVertices,
      setReferenceCentreOfMass,
      getLever,
      setReferenceLeverVectors,
      getRotateBoundingRect,
      setReferenceBoundingRect
    } = rotateInterface();
    setDraggingState(false);

    const selectedShapeIndex = getSelectedShapeIndex();

    if (selectedShapeIndex !== null) {
      const selectedShapeId = ShapesController.getProperty(
        selectedShapeIndex,
        "id"
      );

      if (selectedShapeId) {
        updatePhysicsProperties(selectedShapeId);
      }

      const { start, end } = getLever();
      const startVector = new Vector({ ...start });
      const endVector = new Vector({ ...end });
      setReferenceLeverVectors({ start: startVector, end: endVector });
      const boundingRect = getRotateBoundingRect();
      setReferenceBoundingRect([...boundingRect]);
      setIsDefault(true);
      setReferenceVertices([]);
      setReferenceCentreOfMass({});
    }
  }
};
