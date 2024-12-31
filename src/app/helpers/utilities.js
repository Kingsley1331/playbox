import { Scene } from "../experiments/World";
export const mouseEvents = (canvas, scale, setMousePos) => {
  //   console.log("canvas", canvas);
  const mouse = {
    x: 0,
    y: 0,
    button: 0,
    down: false,
  };

  const mouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    // console.log("rect", rect);
    mouse.x = (e.clientX - rect.left) / scale;
    mouse.y = (e.clientY - rect.top) / scale;
    // setMousePos({ x: mouse.x, y: mouse.y });
    Scene.mousePos = { x: mouse.x, y: mouse.y };
  };

  const mouseDown = (e) => {
    mouse.down = true;
    mouse.button = e.button;
    console.log("mouse down");
  };

  const mouseUp = (e) => {
    mouse.down = false;
  };

  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mouseup", mouseUp);

  return mouse;
};

export const setMode = (mode) => {
  Scene.mode = mode;
};
