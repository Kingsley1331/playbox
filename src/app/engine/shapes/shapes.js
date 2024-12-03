"use client";
import Scene from "../scenes/scene";
import Shape from "./Shape";

import ShapesController from "./ShapesController";
import getMousePos from "../utils/position";
import { throwVelocity } from "../utils/throw";
import { calculateBoolean } from "../utils/maths/operators";
import checkEvents from "../utils/checkEvents";
import {
  getObjectValueFromString,
  setObjectValueFromString,
} from "../utils/objects";
import { findMass } from "../physics/mass/mass";
import referenceVectors from "../physics/collisions/referenceVectors";
import { findMomentOfInertiaCOM } from "../physics/mass/momentOfInertia";
import { magnitude } from "../utils/maths/Vector";
import reCentre, { reCentreVertices } from "./reCentre";
import findBoundingRect from "./findBoundingRect";

export const shapeSelection = {
  square: [
    { x: -18, y: -18 },
    { x: 18, y: -18 },
    { x: 18, y: 18 },
    { x: -18, y: 18 },
  ],
  bar: [
    { x: -18, y: -126 },
    { x: 18, y: -126 },
    { x: 18, y: 126 },
    { x: -18, y: 126 },
  ],
  triangle: [
    { x: -40 / 2, y: (Math.sqrt(3) / 6) * 40 },
    { x: 40 / 2, y: (Math.sqrt(3) / 6) * 40 },
    { x: 0, y: ((-2 * Math.sqrt(3)) / 6) * 40 },
  ],
  star: [
    { x: 0, y: -50 },
    {
      x: 19.0983 * Math.sin(2 * Math.PI * (36 / 360)),
      y: -19.0983 * Math.cos(2 * Math.PI * (36 / 360)),
    },
    {
      x: 50 * Math.cos(2 * Math.PI * (18 / 360)),
      y: -50 * Math.sin(2 * Math.PI * (18 / 360)),
    },
    {
      x: 19.0983 * Math.cos(2 * Math.PI * (18 / 360)),
      y: 19.0983 * Math.sin(2 * Math.PI * (18 / 360)),
    },
    {
      x: 50 * Math.sin(2 * Math.PI * (36 / 360)),
      y: 50 * Math.cos(2 * Math.PI * (36 / 360)),
    },
    { x: 0, y: 19.0983 },
    {
      x: -50 * Math.sin(2 * Math.PI * (36 / 360)),
      y: 50 * Math.cos(2 * Math.PI * (36 / 360)),
    },
    {
      x: -19.0983 * Math.cos(2 * Math.PI * (18 / 360)),
      y: 19.0983 * Math.sin(2 * Math.PI * (18 / 360)),
    },
    {
      x: -50 * Math.cos(2 * Math.PI * (18 / 360)),
      y: -50 * Math.sin(2 * Math.PI * (18 / 360)),
    },
    {
      x: -19.0983 * Math.sin(2 * Math.PI * (36 / 360)),
      y: -19.0983 * Math.cos(2 * Math.PI * (36 / 360)),
    },
  ],
  plus: [
    { x: -6, y: -6 },
    { x: -6, y: -30 },
    { x: 6, y: -30 },
    { x: 6, y: -6 },
    { x: 30, y: -6 },
    { x: 30, y: 6 },
    { x: 6, y: 6 },
    { x: 6, y: 30 },
    { x: -6, y: 30 },
    { x: -6, y: 6 },
    { x: -30, y: 6 },
    { x: -30, y: -6 },
  ],
  tShape: [
    { x: 30, y: -6 },
    { x: 30, y: 6 },
    { x: 6, y: 6 },
    { x: 6, y: 54 },
    { x: -6, y: 54 },
    { x: -6, y: 6 },
    { x: -30, y: 6 },
    { x: -30, y: -6 },
  ],
  arrow: [
    { x: 30, y: -6 },
    { x: 30, y: -18 },
    { x: 55, y: 0 },
    { x: 30, y: 18 },
    { x: 30, y: 6 },
    { x: -20, y: 6 },
    { x: -20, y: -6 },
  ],
  pentagon: [
    { x: 0, y: -22 },
    {
      x: 22 * Math.cos(2 * Math.PI * (18 / 360)),
      y: -22 * Math.sin(2 * Math.PI * (18 / 360)),
    },
    {
      x: 22 * Math.sin(2 * Math.PI * (36 / 360)),
      y: 22 * Math.cos(2 * Math.PI * (36 / 360)),
    },
    {
      x: -22 * Math.sin(2 * Math.PI * (36 / 360)),
      y: 22 * Math.cos(2 * Math.PI * (36 / 360)),
    },
    {
      x: -22 * Math.cos(2 * Math.PI * (18 / 360)),
      y: -22 * Math.sin(2 * Math.PI * (18 / 360)),
    },
  ],
  hexagon: [
    {
      x: 22 * Math.sin(2 * Math.PI * (30 / 360)),
      y: -22 * Math.cos(2 * Math.PI * (30 / 360)),
    },
    { x: 22, y: 0 },
    {
      x: 22 * Math.sin(2 * Math.PI * (30 / 360)),
      y: 22 * Math.cos(2 * Math.PI * (30 / 360)),
    },
    {
      x: -22 * Math.sin(2 * Math.PI * (30 / 360)),
      y: 22 * Math.cos(2 * Math.PI * (30 / 360)),
    },
    { x: -22, y: 0 },
    {
      x: -22 * Math.sin(2 * Math.PI * (30 / 360)),
      y: -22 * Math.cos(2 * Math.PI * (30 / 360)),
    },
  ],
  box: [
    { x: 0, y: 54 },
    { x: 0, y: 90 },
    { x: -90, y: 90 },
    { x: -90, y: -90 },
    { x: 90, y: -90 },
    { x: 90, y: 90 },
    { x: 0, y: 90 },
    { x: 0, y: 54 },
    { x: 54, y: 54 },
    { x: 54, y: -54 },
    { x: -54, y: -54 },
    { x: -54, y: 54 },
  ],
  verticalWall: [
    { x: -18, y: -300 },
    { x: 18, y: -300 },
    { x: 18, y: 300 },
    { x: -18, y: 300 },
  ],
  horizontalWall: [
    { x: -500, y: -18 },
    { x: 500, y: -18 },
    { x: 500, y: 18 },
    { x: -500, y: 18 },
  ],
};

export const shapes = {
  arrowHead: [
    { x: -2.5, y: 0 },
    { x: 2.5, y: 0 },
    { x: 0, y: 5 },
  ],
};

//TODO: add settings to Scene object
// export const settings = {
//   display: true,
//   restitution: 0
// };

function circleMaker(radius, n) {
  var circle = [];
  var angle = (2 * Math.PI) / n;
  for (var i = 0; i < n; i++) {
    var point = {};
    point.x = radius * Math.sin(i * angle);
    point.y = radius * Math.cos(i * angle);
    circle.push(point);
  }
  return circle;
}

var circle = circleMaker(20, 30);
shapeSelection.circle = circle;

// export class Shape {
//   constructor(centre, vertices) {
//     const boundingRect = findBoundingRect(vertices);
//     const massData = findMass(centre, vertices, boundingRect);
//     const centreOfMass = massData.centreOfMass;
//     const momentOfInertiaCOM = findMomentOfInertiaCOM(
//       centreOfMass,
//       vertices,
//       boundingRect
//     );
//     const references = referenceVectors(centre, vertices);
//     this.id;
//     this.type = "";
//     this.fillColour = "#6495ED";
//     this.strokeStyle = "black";
//     this.linewidth = 0.7;
//     this.centreOfMass = centreOfMass;
//     this.centreOfRotation = centreOfMass;
//     this.vertices = vertices;
//     this.physics = {
//       density: 1,
//       mass: massData.mass,
//       momentOfInertiaCOM: momentOfInertiaCOM,
//       velocity: { x: 0, y: 0 },
//       acceleration: { x: 0, y: 0 },
//       angularVelocity: 0,
//       angularAcceleration: 0,
//       forcesCOM: [{ x: 0, y: 0 }],
//       torque: 0,
//     };
//     this.touchPoint = [];
//     this.display = [];
//     this.boundingRect = boundingRect;
//     this.collisionData = {};
//     this.referenceVectors = references;
//     this.colliding = false;
//     this.onShape = false;
//     this.dragging = false;
//     this.onClick = false;
//     this.doubleClick = false;
//     // this.onDoubleClick = false;
//     this.selected = false;
//     this.events = {
//       subscribed: true,
//     };
//     this.tags = [];
//     this.checkEvents = checkEvents;
//     this.isShapeFixed = false;
//   }

//   set freezeShape(value) {
//     console.log("Freeze value1", value);
//     if (value === true) {
//       console.log("Freeze value2", value);
//       this.physics.mass = Infinity;
//       this.physics.momentOfInertiaCOM = Infinity;
//       this.isShapeFixed = true;
//     } else {
//       console.log("Freeze value3", value);
//       const boundingRect = findBoundingRect(this.vertices);
//       const { mass } = findMass(this.centreOfMass, this.vertices, boundingRect);
//       const momentOfInertiaCOM = findMomentOfInertiaCOM(
//         this.centreOfMass,
//         this.vertices,
//         boundingRect
//       );

//       this.physics.mass = mass;
//       this.physics.momentOfInertiaCOM = momentOfInertiaCOM;
//       this.isShapeFixed = false;
//     }
//   }
// }

export function createShape(centreOfMass, vertices) {
  let id = Scene.shapes.length;
  let shape = new Shape(centreOfMass, vertices);
  shape.id = id;
  Scene.shapes.push(shape);
  return shape;
}

export const PolylineInterface = () => {
  const { vertices, firstPoint, lastPoint, detectOnLastPoint } = Scene.polyline;

  const numOfVertices = vertices.length;
  const isCursorOnFirstPoint = firstPoint.isCursorOnPoint;
  const isCursorOnLastPoint = lastPoint.isCursorOnPoint;
  const firstPointRadius = firstPoint.radius;
  const lastPointRadius = lastPoint.radius;

  const resetVertices = () => {
    Scene.polyline.vertices = [];
    Scene.polyline.firstPoint.isCursorOnPoint = false;
    Scene.polyline.lastPoint.isCursorOnPoint = false;
    Scene.polyline.detectOnLastPoint = false;
  };

  const addVertex = (vertex) => {
    vertices.push(vertex);
  };
  const removeLastVertex = () => {
    vertices.splice(numOfVertices - 1, 1);
  };
  const setOnFirstPoint = (bool) => {
    firstPoint.isCursorOnPoint = bool;
  };
  const setOnLastPoint = (bool) => {
    lastPoint.isCursorOnPoint = bool;
  };
  const setDetectOnLastPoint = (bool) => {
    Scene.polyline.detectOnLastPoint = bool;
  };

  return {
    vertices,
    isCursorOnFirstPoint,
    isCursorOnLastPoint,
    firstPointRadius,
    lastPointRadius,
    resetVertices,
    addVertex,
    removeLastVertex,
    setOnFirstPoint,
    setOnLastPoint,
    setDetectOnLastPoint,
    detectOnLastPoint,
  };
};

export function createShapeFromPolyline(fromDblclick) {
  const { selected } = Scene;
  const { vertices, resetVertices } = PolylineInterface();
  const numOfVertices = vertices.length;

  if (fromDblclick) {
    vertices.splice(numOfVertices - 1, 1);
  }

  const usingPolylines = selected === "polyline" || selected === "draw";

  if (numOfVertices > 2 && usingPolylines) {
    const boundingRect = findBoundingRect(vertices);
    const mass = findMass({ x: 0, y: 0 }, vertices, boundingRect);
    const centreOfMass = mass.centreOfMass;

    reCentreVertices(vertices, centreOfMass);
    createShape(centreOfMass, vertices);
    resetVertices();
  }
}

export const CloneInterface = (idx) => {
  const { clone } = Scene;

  const vertices = idx
    ? ShapesController.getProperty(idx, "vertices")
    : clone.vertices;

  const strokeStyle = idx
    ? ShapesController.getProperty(idx, "strokeStyle")
    : clone.strokeStyle;

  const linewidth = idx
    ? ShapesController.getProperty(idx, "linewidth")
    : clone.linewidth;

  const fillColour = idx
    ? ShapesController.getProperty(idx, "fillColour")
    : clone.fillColour;

  const isShapeFixed = idx
    ? ShapesController.getProperty(idx, "isShapeFixed")
    : clone.isShapeFixed;

  const setClonedShapeId = () => {
    Scene.clone.clonedShapeId = idx;
  };

  const setClonedShapeVertices = () => {
    Scene.clone.vertices = vertices;
  };

  const setClonedShapeLinewidth = () => {
    Scene.clone.linewidth = linewidth;
  };

  const setClonedShapeColour = () => {
    Scene.clone.fillColour = fillColour;
  };

  const setClonedStrokeStyle = () => {
    Scene.clone.strokeStyle = strokeStyle;
  };

  const setIsShapeFixed = () => {
    Scene.clone.isShapeFixed = isShapeFixed;
  };

  const getClonedShapeId = () => Scene.clone.clonedShapeId;
  const getClonedShapeVertices = () => Scene.clone.vertices;
  const getClonedShapeLinewidth = () => Scene.clone.linewidth;
  const getClonedShapeColour = () => Scene.clone.fillColour;
  const getClonedStrokeStyle = () => Scene.clone.strokeStyle;
  const getIsShapeFixed = () => Scene.clone.isShapeFixed;

  const resetClone = () => {
    Scene.clone = {
      clonedShapeId: "",
      vertices: [],
      strokeStyle: "",
      linewidth: 0,
      fillColour: "",
    };
  };

  return {
    vertices,
    strokeStyle,
    linewidth,
    fillColour,
    setClonedShapeId,
    setClonedShapeVertices,
    setClonedShapeLinewidth,
    setClonedShapeColour,
    setClonedStrokeStyle,
    setIsShapeFixed,
    getClonedShapeId,
    getClonedShapeVertices,
    getClonedShapeLinewidth,
    getClonedShapeColour,
    getClonedStrokeStyle,
    getIsShapeFixed,
    resetClone,
  };
};

export const reshapeInterface = () => {
  const setVertex = (vertex) => {
    Scene.reshape.currentVertex = vertex;
  };
  const selectShape = (id) => {
    Scene.reshape.selectedShapeId = id;
  };
  const setIsVertexBeingDragged = (bool) => {
    Scene.reshape.isVertexBeingDragged = bool;
  };

  const getVertexIndex = () => Scene.reshape.currentVertex;
  const getSelectedShapeId = () => Scene.reshape.selectedShapeId;
  const getIsVertexBeingDragged = () => Scene.reshape.isVertexBeingDragged;

  return {
    setVertex,
    getVertexIndex,
    selectShape,
    getSelectedShapeId,
    getIsVertexBeingDragged,
    setIsVertexBeingDragged,
  };
};

export const resizeInterface = () => {
  const selectShape = (idx = null) => {
    Scene.resize.selectedShapeIndex = idx;
  };
  const setResizeBoundingRect = (vertices) => {
    const resizeVertices = vertices.map((vertex) => ({
      x: vertex.x,
      y: vertex.y,
    }));
    Scene.resize.resizeBoundingRect = resizeVertices;
  };

  const setCurrentResizer = (resizer = null) => {
    Scene.resize.currentResizer = resizer;
  };

  const geCurrentResizer = () => Scene.resize.currentResizer;

  const setResizerDraggingState = (state) => {
    Scene.resize.dragging = state;
  };

  const setDraggable = (bool) => {
    Scene.resize.draggable = bool;
  };
  const getDraggable = () => Scene.resize.draggable;

  const setOnResizer = (bool) => {
    Scene.resize.onResizer = bool;
  };
  const getOnResizer = () => Scene.resize.onResizer;

  const setReferenceVertices = (vertices) => {
    Scene.resize.referenceVertices = vertices;
  };
  const getReferenceVertices = () => Scene.resize.referenceVertices;

  const getResizerDraggingState = () => Scene.resize.dragging;
  const getSelectedShapeIndex = () => Scene.resize.selectedShapeIndex;
  const getSelectedSideLength = () => Scene.resize.sideLength;
  const getResizeBoundingRect = () => Scene.resize.resizeBoundingRect;

  return {
    selectShape,
    getSelectedShapeIndex,
    getSelectedSideLength,
    getResizeBoundingRect,
    setResizeBoundingRect,
    setCurrentResizer,
    setResizerDraggingState,
    geCurrentResizer,
    getResizerDraggingState,
    setDraggable,
    getDraggable,
    setOnResizer,
    getOnResizer,
    setReferenceVertices,
    getReferenceVertices,
  };
};

export const rotateInterface = () => {
  const getIsDefault = () => Scene.rotate.default.state;
  const setIsDefault = (state) => {
    Scene.rotate.default.state = state;
  };
  const resetDefault = (state) => {
    Scene.rotate.default.lever = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: -50 },
    };
  };

  const selectShape = (idx = null) => {
    Scene.rotate.selectedShapeIndex = idx;
  };

  const getSelectedShapeIndex = () => Scene.rotate.selectedShapeIndex;

  const getReferenceVertices = () => Scene.rotate.referenceVertices;

  const getReferenceCentreOfMass = () => Scene.rotate.referenceCentreOfMass;

  const setReferenceCentreOfMass = (centre) => {
    Scene.rotate.referenceCentreOfMass = centre;
  };

  const setReferenceVertices = (vertices) => {
    Scene.rotate.referenceVertices = vertices;
  };

  const getCentreOfRotation = () => Scene.rotate.centreOfRotation;

  const setDraggingState = (state) => {
    Scene.rotate.dragging = state;
  };

  const setLeverLength = (length) => {
    Scene.rotate.leverLength = length;
  };

  const getOnhandle = () => Scene.rotate.handle.onHandle;
  const setOnhandle = (state) => {
    Scene.rotate.handle.onHandle = state;
  };

  const getLever = () => Scene.rotate.lever;
  const setLever = (
    { start, end } = { start: { x: 0, y: 0 }, end: { x: 0, y: -50 } }
  ) => {
    Scene.rotate.lever = { start, end };
  };

  const getHandleRadius = () => Scene.rotate.handle.radius;

  const getDraggingState = () => Scene.rotate.dragging;

  const getDefaultLength = () => Scene.rotate.defaultLength;
  const getReferenceBoundingRect = () => Scene.rotate.referenceBoundingRect;
  const setReferenceBoundingRect = (vertices) => {
    Scene.rotate.referenceBoundingRect = vertices;
  };
  const getRotateBoundingRect = () => Scene.rotate.rotateBoundingRect;
  const setRotateBoundingRect = (vertices) => {
    Scene.rotate.rotateBoundingRect = vertices;
  };

  const getReferenceLeverVectors = () => Scene.rotate.referenceLeverVectors;
  const setReferenceLeverVectors = (vectors) => {
    Scene.rotate.referenceLeverVectors = vectors;
  };

  return {
    getIsDefault,
    setIsDefault,
    selectShape,
    setDraggingState,
    setLeverLength,
    setLever,
    setReferenceCentreOfMass,
    setOnhandle,
    getSelectedShapeIndex,
    getDraggingState,
    getHandleRadius,
    getOnhandle,
    getLever,
    resetDefault,
    getReferenceVertices,
    setReferenceVertices,
    getReferenceCentreOfMass,
    getCentreOfRotation,
    getDefaultLength,
    getReferenceBoundingRect,
    setReferenceBoundingRect,
    getRotateBoundingRect,
    setRotateBoundingRect,
    setReferenceLeverVectors,
    getReferenceLeverVectors,
  };
};

export const ColourInterface = () => {
  const setCurrentColour = (colour = null) => {
    Scene.colour.currentColour = colour;
  };

  const getCurrentColour = () => Scene.colour.currentColour;

  const selectShape = (idx = null) => {
    Scene.colour.selectedShapeIndex = idx;
  };

  const getSelectedShapeIndex = () => Scene.colour.selectedShapeIndex;

  return {
    getCurrentColour,
    setCurrentColour,
    selectShape,
    getSelectedShapeIndex,
  };
};

export const ShapeManagerInterface = () => {
  const selectShape = (idx = null) => {
    Scene.manageShape.selectedShapeIndex = idx;
  };

  const getSelectedShapeIndex = () => Scene.manageShape.selectedShapeIndex;
  const getSelectedShapeId = () => Scene.manageShape.selectedShapeId;

  return {
    selectShape,
    getSelectedShapeIndex,
    getSelectedShapeId,
  };
};

// order=true => FORWARD, order=false => REVERSE
export function forEachShape(callback, order) {
  var shapes = Scene.shapes;
  var length = shapes.length;
  if (!order) {
    for (var i = 0; i < length; i++) {
      var shape = shapes[i];
      if (shape) {
        callback(i);
      }
    }
  } else if (order) {
    for (var i = length - 1; i >= 0; i--) {
      var shape = shapes[i];
      if (shape) {
        callback(i);
      }
    }
  }
}

export function detectShape(i) {
  let shapeIndex;
  var centreOfMass = ShapesController.getCentreOfMass(i);
  var vertices = ShapesController.getProperty(i, "vertices");
  var pointInShape = isPointInShape(centreOfMass, vertices, Scene.mousePos);
  if (pointInShape) {
    shapeIndex = i;
    if (!Scene.cursorOnshape) {
      ShapesController.setProperty(i, "onShape", true);
      Scene.cursorOnshape = true;
    }
    if (!ShapesController.getProperty(i, "onShape")) {
      Scene.shapes.forEach((shape, index) => {
        ShapesController.setProperty(index, "onShape", false);
      });
      ShapesController.setProperty(i, "onShape", true);
    }
  } else {
    ShapesController.setProperty(i, "onShape", false);
  }
  if (ShapesController.getProperty(i, "dragging")) {
    dragShape(i);
  }
  return shapeIndex;
}

function dragShape(i) {
  var touchPoint = ShapesController.getTouchPoint(i);
  let mousePos = Scene.mousePos;
  var centre = {
    x: mousePos.x - touchPoint.x,
    y: mousePos.y - touchPoint.y,
  };
  ShapesController.setProperty(i, "centreOfMass", centre);
}

export function releaseShape(i) {
  if (Scene.selected === "play") {
    var velocity = throwVelocity();
    if (
      Scene.throwArray.length > 0 &&
      ShapesController.getProperty(i, "dragging")
    ) {
      ShapesController.setProperty(
        i,
        "velocity",
        { x: velocity.x, y: velocity.y },
        true
      );
    }
  }
  ShapesController.setProperty(i, "dragging", false);
}

export function isPointInShape(centreOfMass, vertices, point) {
  {
    /*Start Gamecraft */
  }
  const bufferCanvas = document.createElement("canvas");
  const bufferCtx1 = bufferCanvas.getContext("2d");
  let width = bufferCtx1.canvas.width;
  let height = bufferCtx1.canvas.height;
  bufferCtx1.fillStyle = Scene.backgroundColour;
  bufferCtx1.fillRect(0, 0, width, height);
  Scene.context.buffer = bufferCtx1;
  {
    /*End Gamecraft */
  }
  var x0 = centreOfMass.x + vertices[0].x;
  var y0 = centreOfMass.y + vertices[0].y;
  const bufferCtx = Scene.context.buffer;
  bufferCtx.beginPath();
  bufferCtx.moveTo(x0, y0);
  for (var m = 1; m < vertices.length; m++) {
    var x = centreOfMass.x + vertices[m].x;
    var y = centreOfMass.y + vertices[m].y;
    bufferCtx.lineTo(x, y);
  }
  if (bufferCtx.isPointInPath(point.x, point.y)) {
    return true;
  } else {
    return false;
  }
}

export function prepareToMoveShape(i) {
  const { getVertexIndex } = reshapeInterface();
  const { getOnResizer } = resizeInterface();
  const { getOnhandle } = rotateInterface();

  const isShapeMovable =
    getVertexIndex() === null && !getOnResizer() && !getOnhandle();

  if (ShapesController.getProperty(i, "onShape") && isShapeMovable) {
    let mousePos = Scene.mousePos;
    if (Scene.selected === "play") {
      ShapesController.setProperty(i, "velocity", { x: 0, y: 0 }, true);
    }
    var centreOfMass = ShapesController.getCentreOfMass(i);
    ShapesController.setProperty(i, "dragging", true);
    var distanceX = mousePos.x - centreOfMass.x;
    var distanceY = mousePos.y - centreOfMass.y;
    ShapesController.setProperty(i, "touchPoint", {
      x: distanceX,
      y: distanceY,
    });
  }
}

export function clearShapes() {
  Scene.shapes = [];
}

export const updatePhysicsProperties = (shapeId) => {
  const selectedShape = Scene.shapes.filter((shape) => shape.id === shapeId)[0];
  const { vertices, centreOfMass, isShapeFixed } = selectedShape;
  let boundingRect = findBoundingRect(vertices);
  const massData = findMass(centreOfMass, vertices, boundingRect);
  const { mass, centreOfMass: newCentreOfMass } = massData;
  const centreOfMassShift = {
    x: newCentreOfMass.x - centreOfMass.x,
    y: newCentreOfMass.y - centreOfMass.y,
  };
  const shiftedVertices = vertices.map((vertex) => ({
    x: vertex.x - centreOfMassShift.x,
    y: vertex.y - centreOfMassShift.y,
  }));
  boundingRect = findBoundingRect(shiftedVertices);

  const momentOfInertiaCOM = findMomentOfInertiaCOM(
    newCentreOfMass,
    shiftedVertices,
    boundingRect
  );
  selectedShape.vertices = shiftedVertices;
  selectedShape.boundingRect = boundingRect;
  selectedShape.centreOfMass = newCentreOfMass;
  selectedShape.centreOfRotation = newCentreOfMass;
  selectedShape.physics.mass = mass;
  selectedShape.physics.momentOfInertiaCOM = momentOfInertiaCOM;
  selectedShape.freezeShape = isShapeFixed;
};
