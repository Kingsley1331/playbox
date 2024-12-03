"use client";
let Scene = {
  name: "",
  backgroundColour: "#E0E0E0",
  imagUrl: "",
  created: "",
  lastModified: "",
  shapes: [],
  mousePos: {},
  context: { buffer: {} },
  cursorOnshape: false,
  selected: "none",
  throwArray: [],
  polyline: {
    vertices: [],
    firstPoint: { radius: 5, isCursorOnPoint: false },
    lastPoint: { radius: 5, isCursorOnPoint: false },
    detectOnLastPoint: false,
  },
  clone: {
    clonedShapeId: "",
    vertices: [],
    strokeStyle: "",
    linewidth: 0,
    fillColour: "",
  },
  reshape: {
    currentVertex: null,
    selectedShapeId: "",
    isVertexBeingDragged: false,
  },
  resize: {
    selectedShapeIndex: null,
    currentResizer: null,
    dragging: false,
    draggable: false,
    onResizer: false,
    sideLength: 10,
    resizeBoundingRect: [],
    referenceVertices: [],
  },
  rotate: {
    default: {
      state: true,
      lever: { start: { x: 0, y: 0 }, end: { x: 0, y: -50 } },
    },
    defaultLength: 50,
    selectedShapeIndex: null,
    dragging: false,
    handleColour: "white",
    handle: { radius: 10, onHandle: false },
    lever: { start: { x: 0, y: 0 }, end: { x: 0, y: -50 } },
    referenceLeverVectors: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    referenceVertices: [],
    referenceBoundingRect: [],
    rotateBoundingRect: [],
    referenceCentreOfMass: {},
    centreOfRotation: {},
  },
  colour: {
    currentColour: null,
    selectedShapeIndex: null,
  },
  manageShape: {
    selectedShapeIndex: null,
    selectedShapeId: null,
  },
  isDrawing: false,
  timeStep: 16,
  time: 0,
  settings: {
    display: true,
    restitution: 0.8,
  },
  propertyValueCache: {},
  currentEvents: {
    /**Change name from currentEvents to eventTypes */
    click: { state: false, ids: [] },
    doubleClick: { state: false, ids: [] },
    collision: { state: false, ids: [], pairs: [] },
    hover: { state: false, ids: [] },
    drag: { state: false, ids: [] },
  },
  rules: [],
  matches: {},
};

export function updateSelected(state, Scene) {
  let selectedShape;
  const buttons = state.buttons;
  Scene.selected = "";
  for (let button in buttons) {
    if (buttons[button]) {
      selectedShape = button;
      Scene.selected = button;
    }
  }
}

export default Scene;
