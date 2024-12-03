import Scene from "../scenes/scene";
import { magnitude } from "./maths/Vector";
export default function getMousePos(evt, canvas) {
  var rect = canvas.getBoundingClientRect();

  if (evt.clientX && evt.clientY) {
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
  }
  let mousePos = { x: x, y: y };
  Scene.mousePos = mousePos;
  return mousePos;
}

export const calculateDistanceFromCursor = (point, cursorPos) => {
  const distanceVector = {
    x: point.x - cursorPos.x,
    y: point.y - cursorPos.y
  };
  return magnitude(distanceVector);
};
