import { Scene } from "../World";
import { mouseDown, mouseUp, mouseMove } from "../events/canvas/handlers";

let { scale, world } = Scene;

export const mousePosition = (e, rect) => {
  return {
    x: (e.clientX - rect.left) / scale,
    y: (e.clientY - rect.top) / -scale,
  };
};

export const setMousePos = (mousePos) => {
  Scene.mousePos = mousePos;
};

export const canvasMouseEvents = (canvas, setMousePosUI) => {
  const rect = canvas.getBoundingClientRect(); //TODO: Attach rect to Scene.canvas

  const mouseMove1 = (e) => {
    mouseMove(e, rect, setMousePosUI);
  };

  const mouseDown1 = (e) => {
    mouseDown(e, rect, world);
  };

  const mouseUp1 = (e) => {
    mouseUp(Scene.world);
  };

  canvas.addEventListener("mousemove", mouseMove1);
  canvas.addEventListener("mousedown", mouseDown1);
  canvas.addEventListener("mouseup", mouseUp1);

  //TODO: Clean up event listeners
};

export const setMode = (mode) => {
  Scene.mode = mode;
};

export const attachCanvasEvents = (canvas, events) => {
  const rect = canvas.getBoundingClientRect(); //TODO: Attach rect to Scene.canvas
  const { mousemove, mousedown, mouseup } = events;

  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mousedown", mousedown);
  canvas.addEventListener("mouseup", mouseup);
};

export const removeCanvasEvents = (canvas, events) => {
  const { mousemove, mousedown, mouseup } = events;

  canvas.removeEventListener("mousemove", mousemove);
  canvas.removeEventListener("mousedown", mousedown);
  canvas.removeEventListener("mouseup", mouseup);
};
