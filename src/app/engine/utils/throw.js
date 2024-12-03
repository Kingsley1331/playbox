import Scene from "../scenes/scene";

export function makeThrowArray() {
  let mousePos = Scene.mousePos;
  var length = Scene.throwArray.length;
  var arraySize = 5;
  if (length >= arraySize) {
    Scene.throwArray = Scene.throwArray.splice(length - arraySize);
  }
  // console.log('mousePos', mousePos);
  Scene.throwArray.push({ x: mousePos.x, y: mousePos.y });
}

export function throwVelocity() {
  let throwArray = Scene.throwArray;
  var velocityArray = [];
  var velocity = { x: 0, y: 0 };
  var length = throwArray.length;
  for (var i = 1; i < length; i++) {
    velocityArray.push({
      x: throwArray[i].x - throwArray[i - 1].x,
      y: throwArray[i].y - throwArray[i - 1].y
    });
  }
  var length2 = velocityArray.length;
  for (var j = 0; j < length2; j++) {
    velocity.x += velocityArray[j].x;
    velocity.y += velocityArray[j].y;
  }
  if (length2 > 0) {
    velocity.x /= length2 * 10;
    velocity.y /= length2 * 10;
  }
  console.log(
    "8888888888888888888888888888888888888888888888888888888888888888",
    velocity
  );
  return { x: velocity.x, y: velocity.y };
}
