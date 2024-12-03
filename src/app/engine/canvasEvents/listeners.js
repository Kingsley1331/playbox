import getMousePos from "../utils/position";
import { makeThrowArray } from "../utils/throw";
import {
  detectShape,
  createShape,
  shapeSelection,
  forEachShape,
  prepareToMoveShape,
  releaseShape,
  createShapeFromPolyline,
} from "../shapes/shapes";
import ShapesController from "../shapes/ShapesController";
import Scene from "../scenes/scene";
import { applyMotion } from "../physics/motion";
import applyForces from "../physics/forces/applyForces";
import collisionDetector from "../physics/collisions/collisionDetector";
import { retrieveLocalRules } from "../utils/eventRules";

import {
  polylineMousedown,
  polylineMousemove,
  polylineRightClick,
} from "../canvasEvents/handlers/polyline";
import { cloneMousedown } from "../canvasEvents/handlers/clone";
import {
  reshapeMousedown,
  reshapeMousemove,
  reshapeMousUp,
} from "../canvasEvents/handlers/reshape";
import {
  resizeMousedown,
  resizeMousemove,
  resizeMouseMouseup,
} from "../canvasEvents/handlers/resize";
import {
  rotateMousedown,
  rotateMousemove,
  rotateMouseup,
} from "../canvasEvents/handlers/rotate";
import { colourMousedown } from "../canvasEvents/handlers/colour";
import { manageShapeMousedown } from "../canvasEvents/handlers/manageShape";

const timeStep = Scene.timeStep;
export const click = (element) => {
  element.addEventListener(
    "click",
    (evt) => {
      let clickedShapeIndex;
      forEachShape(function (i) {
        clickedShapeIndex = detectShape(i);
        if (clickedShapeIndex) {
          Scene.currentEvents.click.state = true;
          Scene.shapes[clickedShapeIndex].onClick = true;
          Scene.currentEvents.click.ids.push(clickedShapeIndex);
        }
      }, false);
    },
    false
  );
};

export const doubleClick = (element, selectShape, addRules, selectedEvent) => {
  element?.addEventListener(
    "dblclick",
    (evt) => {
      let selectShapeIndex;

      forEachShape(function (i) {
        selectShapeIndex = detectShape(i);
        // Scene.currentEvents.doubleClick.id = selectShapeIndex;
        if (selectShapeIndex) {
          Scene.currentEvents.doubleClick.state = true;
          Scene.shapes[selectShapeIndex].doubleClick = true;
          Scene.currentEvents.doubleClick.ids.push(selectShapeIndex);
        }
        if (selectShapeIndex /*&& selectedEvent*/) {
          const selectedShapeId = Scene.shapes[selectShapeIndex].id;

          Scene.selectedShape = selectedShapeId;
          selectShape(selectedShapeId);
        }
      }, false);
      createShapeFromPolyline(true);
    },
    false
  );
};

export const mouseDown = (element, setManagedShapeIndex) => {
  element.addEventListener(
    "mousedown",
    (evt) => {
      // Scene.currentEvents.click.state = true;
      if (Scene.selected === "step") {
        Scene.time += timeStep;
        forEachShape(function (i) {
          applyMotion(i, timeStep);
          applyForces(i);
        });
        collisionDetector();
      }

      let mousePos = getMousePos(evt, element);
      forEachShape(function (i) {
        prepareToMoveShape(i);
        if (Scene.selected === "_delete") {
          ShapesController.deleteShape(i);
        }
      });

      if (
        typeof shapeSelection[Scene.selected] === "object" &&
        !Scene.cursorOnshape
      ) {
        const uniqueShapeVertices = shapeSelection[Scene.selected].map(
          (vertex) => ({
            x: vertex.x,
            y: vertex.y,
          })
        );

        const shape = createShape(mousePos, uniqueShapeVertices);
        if (Scene.selected === "circle") {
          shape.type = "circle";
        }
      }
      if (Scene.selected === "draw" && !Scene.cursorOnshape) {
        Scene.isDrawing = true;
      }

      polylineMousedown(Scene);
      cloneMousedown(Scene, evt);
      reshapeMousedown(Scene);
      resizeMousedown(Scene);
      rotateMousedown(Scene);
      colourMousedown(Scene);
      manageShapeMousedown(Scene, setManagedShapeIndex);
    },
    false
  );
};

export const mouseMove = (element) => {
  element.addEventListener(
    "mousemove",
    function (evt) {
      const { selected, shapes } = Scene;

      getMousePos(evt, element);
      if (selected === "play") {
        makeThrowArray();
      }
      forEachShape(function (i) {
        detectShape(i);
      }, false);

      const cursorOnshape = shapes.some((shape) => shape.onShape);
      Scene.cursorOnshape = cursorOnshape;
      polylineMousemove(Scene, cursorOnshape);
      reshapeMousemove(Scene);
      resizeMousemove(Scene);
      rotateMousemove(Scene);
    },
    false
  );
};

export const mouseUp = (element) => {
  element.addEventListener(
    "mouseup",
    function (evt) {
      forEachShape(function (i) {
        releaseShape(i);
      });
      Scene.throwArray = [];
      if (Scene.selected === "draw") {
        Scene.isDrawing = false;
        createShapeFromPolyline();
      }
      reshapeMousUp(Scene);
      resizeMouseMouseup(Scene);
      rotateMouseup(Scene);
    },
    false
  );
};

export const rightClick = (element) => {
  element.addEventListener(
    "contextmenu",
    function (evt) {
      polylineRightClick(Scene, evt);
    },
    false
  );
};
