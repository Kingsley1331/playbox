import { Scene } from "../World";
import { dragShape, moveShape, throwShape } from "../events/canvas/handlers";

let { scale, world, mousePos } = Scene;

export const canvasMouseEvents = (canvas, setMousePosUI) => {
  //   console.log("canvas", canvas);
  const mouse = {
    x: 0,
    y: 0,
  };

  const mouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / scale;
    mouse.y = (e.clientY - rect.top) / scale;
    setMousePosUI({ x: mouse.x, y: mouse.y });
    mousePos = { x: mouse.x, y: mouse.y };

    moveShape(e, rect);
  };

  const mouseDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    dragShape(e, rect, world);
  };

  const mouseUp = (e) => {
    throwShape(world);
  };

  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);

  //TODO: Clean up event listeners

  return mouse;
};

export const setMode = (mode) => {
  Scene.mode = mode;
};
