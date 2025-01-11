import { Scene } from "../World";

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

export const setMode = (mode) => {
  Scene.mode = mode;
};

export const attachCanvasEvents = (canvas, handlers, setMousePosUI) => {
  const rect = canvas.getBoundingClientRect(); //TODO: Attach rect to Scene.canvas
  const { mouseMove, mouseDown, mouseUp } = handlers;

  const mouseMoveHandler = (e) => {
    mouseMove(e, rect, setMousePosUI);
  };

  const mouseDownHandler = (e) => {
    mouseDown(e, rect, world);
  };

  const mouseUpHandler = (e) => {
    mouseUp(Scene.world);
  };

  Scene.handlers = {
    mouseMove: mouseMoveHandler,
    mouseDown: mouseDownHandler,
    mouseUp: mouseUpHandler,
  };

  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
};

export const removeCanvasEvents = (canvas, handlers) => {
  const { mouseMove, mouseDown, mouseUp } = handlers;

  canvas.removeEventListener("mousemove", mouseMove);
  canvas.removeEventListener("mousedown", mouseDown);
  canvas.removeEventListener("mouseup", mouseUp);
};
