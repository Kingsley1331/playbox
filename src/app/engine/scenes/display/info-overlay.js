import ShapesController from "../../shapes/ShapesController";
import { shapeSelection } from "../../shapes/shapes";
import { shapes } from "../../shapes/shapes";
import Scene from "../scene";
import Vector from "../../utils/maths/Vector";
import {
  screenWriter,
  drawLine,
  drawDot,
  drawShape,
  drawArrow
} from "./drawing/drawings";

import displayConfig from "../../scenes/display/config";

const { scene, shape } = displayConfig;

export const displayShapeInfo = (
  shapeIndex,
  bufferCtx,
  centreOfMass,
  vertices
) => {
  const {
    id,
    index,
    collidinSide,
    collisionPoint: collidingPoint,
    boundingRect: rect,
    normal,
    collisionPointVA,
    collisionPointVB,
    showCentreOfMass,
    showCentreOfRotation,
    showBoundingRectCentre
  } = shape;
  const boundingRect = ShapesController.getProperty(shapeIndex, "boundingRect");
  const centreOfRotation = ShapesController.getProperty(
    shapeIndex,
    "centreOfRotation"
  );

  const type = ShapesController.getProperty(shapeIndex, "type");
  var collisionDataB = ShapesController.getProperty(
    shapeIndex,
    "collisionData"
  );

  const collisionPointVelocityA = collisionDataB.collisionPointVelocityA;
  const collisionPointVelocityB = collisionDataB.collisionPointVelocityB;
  const collisionPoint = collisionDataB.collisionPoint;
  const boundingRectCentre = {
    x: boundingRect.centre.x + centreOfMass.x,
    y: boundingRect.centre.y + centreOfMass.y
  };

  // Reference Vectors
  var referenceVectors = ShapesController.getProperty(
    shapeIndex,
    "referenceVectors"
  );
  var referenceUnitNormal = referenceVectors.unitNormal;
  var referenceSideVector = referenceVectors.sideVector;
  //var referenceLocation = referenceVectors.location;
  var referenceLocation = {
    x: referenceVectors.location.x + centreOfMass.x,
    y: referenceVectors.location.y + centreOfMass.y
  };

  const rectVertices = boundingRect.vertices;
  //if(10 < counter && selectedShape === 'play' && vertices[4] && vertices.length === 6) {console.log(vertices[4].isColliding);}
  for (var n = 0; n < vertices.length; n++) {
    if (vertices[n] && vertices[n].isColliding) {
      drawDot(
        bufferCtx,
        10,
        {
          x: centreOfMass.x + vertices[n].x,
          y: centreOfMass.y + vertices[n].y
        },
        "blue"
      );
    }
  }

  if (collisionDataB.collisionPoint) {
    if (collidingPoint) {
      drawDot(
        bufferCtx,
        4,
        {
          x: collisionPoint.x,
          y: collisionPoint.y
        },
        "red"
      );
    }
    if (collidinSide) {
      drawLine(bufferCtx, collisionDataB.side[0], collisionDataB.side[1], {
        strokeStyle: "red",
        lineWidth: 2
      });
    }
  }

  if (type === "circle") {
    drawLine(
      bufferCtx,
      centreOfMass,
      {
        x: centreOfMass.x + vertices[0].x,
        y: centreOfMass.y + vertices[0].y
      },
      { strokeStyle: "black", lineWidth: 0.5 }
    );
  }

  if (rect) {
    drawShape(bufferCtx, rectVertices, centreOfMass, {
      lineWidth: 0.5,
      fillStyle: "transparent"
    });
  }
  if (id) {
    screenWriter(
      bufferCtx,
      Number(ShapesController.getProperty(shapeIndex, "id")),
      {
        x: centreOfMass.x - 4,
        y: centreOfMass.y - 5
      }
    );
  }

  if (index) {
    screenWriter(bufferCtx, Number(shapeIndex), {
      x: centreOfMass.x + 4,
      y: centreOfMass.y + 5
    });
  }

  if (showCentreOfMass) {
    drawDot(bufferCtx, 3, centreOfMass, "black");
  }
  if (showBoundingRectCentre) {
    drawDot(bufferCtx, 3, boundingRectCentre, "red");
  }
  if (showCentreOfRotation) {
    drawDot(bufferCtx, 3, centreOfRotation, "green");
  }

  let unitNormal = collisionDataB.unitNormal;
  const sideVector = collisionDataB.sideVector;
  const arrowHead = shapes.arrowHead;

  if (unitNormal) {
    unitNormal = unitNormal.scalProd
      ? unitNormal.scalProd(50)
      : new Vector({
          x: unitNormal.x,
          y: unitNormal.y
        }).scalProd(50);

    if (normal) {
      drawArrow(
        bufferCtx,
        arrowHead,
        [
          {
            x: collisionDataB.side[0].x + sideVector.x / 2,
            y: collisionDataB.side[0].y + sideVector.y / 2
          },
          unitNormal
        ],
        { fillStyle: "purple", strokeStyle: "purple" },
        30
      );
    }

    if (collisionPointVA) {
      drawArrow(
        bufferCtx,
        arrowHead,
        [collisionPoint, collisionPointVelocityA],
        { fillStyle: "blue", strokeStyle: "blue" },
        30
      );
    }

    if (collisionPointVB) {
      drawArrow(
        bufferCtx,
        arrowHead,
        [collisionPoint, collisionPointVelocityB],
        { fillStyle: "green", strokeStyle: "green" },
        60
      );
    }

    // drawArrow(bufferCtx, arrowHead, [collisionDataB.side[0], sideVector], {fillStyle: 'blue', strokeStyle: 'blue'});
    // drawArrow(bufferCtx, arrowHead, [{x: vertices[0].x + centreOfMass.x, y: vertices[0].y + centreOfMass.y}, referenceSideVector], {fillStyle: 'red', strokeStyle: 'red'});
    // drawArrow(bufferCtx, arrowHead, [referenceLocation, referenceUnitNormal], {fillStyle: 'black', strokeStyle: 'black'}, 30);
  }
};

export const displaySceneInfo = bufferCtx => {
  let mousePos = Scene.mousePos;
  const { time, steps, mousePos: cursorPos } = scene;
  if (shapeSelection[Scene.selected] && !Scene.cursorOnshape) {
    // (hoveringOnShape <= 0) means not hovering on shape
    drawShape(bufferCtx, shapeSelection[Scene.selected], mousePos, {
      globalAlpha: 0.15,
      fillStyle: "blue",
      lineWidth: 0.000001
    });
  }
  //TODO: do this only once rather than in every frame
  if (cursorPos) {
    screenWriter(
      bufferCtx,
      "x:" + Math.round(mousePos.x) + ",  " + "y:" + Math.round(mousePos.y),
      { x: 10, y: 20 }
    );
  }

  if (time) {
    screenWriter(bufferCtx, Math.round(Scene.time / 100) / 10, {
      x: 950,
      y: 20
    });
  }

  if (steps) {
    screenWriter(bufferCtx, Scene.time / Scene.timeStep, {
      x: 900,
      y: 20
    });
  }
};
