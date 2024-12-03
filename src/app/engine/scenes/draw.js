import {
  forEachShape,
  ColourInterface,
  ShapeManagerInterface,
} from "../shapes/shapes";
import Scene from "./scene";
import ShapesController from "../shapes/ShapesController";
import { drawShape, shadow } from "./display/drawing/drawings";
import { displayShapeInfo, displaySceneInfo } from "./display/info-overlay";
import polylineAndDraw from "../scenes/display/uiControllers/polylineAndDraw";
import clone from "../scenes/display/uiControllers/clone";
import reshape from "../scenes/display/uiControllers/reshape";
import resize from "../scenes/display/uiControllers/resize";
import rotate from "../scenes/display/uiControllers/rotate";

export const draw = (canvas) => {
  const {
    backgroundColour,
    settings: { display },
  } = Scene;

  const context = canvas.getContext("2d");
  /** TODO: store buffer canvas globally in Scene to make it less expensive **/
  const bufferCanvas = document.createElement("canvas");
  const bufferCtx = bufferCanvas.getContext("2d");
  let width = (bufferCtx.canvas.width = context.canvas.width);
  let height = (bufferCtx.canvas.height = context.canvas.height);
  bufferCtx.fillStyle = backgroundColour;
  bufferCtx.fillRect(0, 0, width, height);

  forEachShape((i) => {
    const onShape = ShapesController.getProperty(i, "onShape");
    const fillColour = ShapesController.getProperty(i, "fillColour");
    const strokeStyle = ShapesController.getProperty(i, "strokeStyle");
    const lineWidth = ShapesController.getProperty(i, "linewidth");
    const centreOfMass = ShapesController.getCentreOfMass(i);
    const vertices = ShapesController.getProperty(i, "vertices");

    let config = {
      fillStyle: fillColour,
      strokeStyle: strokeStyle,
      lineWidth: lineWidth,
    };

    if (onShape) {
      config = { ...config, ...shadow };
    }

    const managerInterface =
      Scene.selected === "colour"
        ? ColourInterface
        : Scene.selected === "manageShape"
        ? ShapeManagerInterface
        : false;

    if (managerInterface) {
      const { getSelectedShapeIndex } = managerInterface();
      const selectedShapeIndex = getSelectedShapeIndex();
      if (selectedShapeIndex === i) {
        config = { ...config, ...shadow };
      }
    }

    drawShape(bufferCtx, vertices, centreOfMass, config, () => {
      reshape(vertices, bufferCtx, Scene, centreOfMass, i);
    });

    resize(bufferCtx, Scene, i);
    rotate(bufferCtx, Scene, i);

    if (display) {
      displayShapeInfo(i, bufferCtx, centreOfMass, vertices);
    }
  });

  polylineAndDraw(bufferCtx, Scene);
  clone(bufferCtx, Scene);

  displaySceneInfo(bufferCtx);
  Scene.context.buffer = bufferCtx;
  context.drawImage(bufferCanvas, 0, 0, width, height);
};
