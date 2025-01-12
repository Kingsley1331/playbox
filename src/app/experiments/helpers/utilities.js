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

export const attachCanvasEvents = (
  canvas,
  handlers,
  setMousePosUI,
  canvasRef
) => {
  const rect = canvas.getBoundingClientRect(); //TODO: Attach rect to Scene.canvas
  const { mouseMove, mouseDown, mouseUp, click, doubleClick } = handlers;

  const mouseMoveHandler = (e) => {
    mouseMove(e, rect, setMousePosUI, canvasRef);
  };

  const mouseDownHandler = (e) => {
    mouseDown(e, rect, world);
  };

  const mouseUpHandler = (e) => {
    mouseUp(Scene.world);
  };

  const clickHandler = (e) => {
    click(e, rect, Scene.world, canvasRef);
  };

  const doubleClickHandler = (e) => {
    doubleClick(Scene.world);
  };

  Scene.handlers = {
    mouseMove: mouseMoveHandler,
    mouseDown: mouseDownHandler,
    mouseUp: mouseUpHandler,
    click: clickHandler,
    doubleClick: doubleClickHandler,
  };

  canvas.addEventListener("mousemove", mouseMoveHandler);
  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
  canvas.addEventListener("click", clickHandler);
  canvas.addEventListener("dblclick", doubleClickHandler);
};

export const removeCanvasEvents = (canvas, handlers) => {
  const { mouseMove, mouseDown, mouseUp, click, doubleClick } = handlers;

  canvas.removeEventListener("mousemove", mouseMove);
  canvas.removeEventListener("mousedown", mouseDown);
  canvas.removeEventListener("mouseup", mouseUp);
  canvas.removeEventListener("click", click);
  canvas.removeEventListener("dblclick", doubleClick);
};
