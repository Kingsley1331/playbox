import { Scene } from "../World";
import planck, { Vec2 } from "planck";
const { scale } = Scene;

const pl = planck;

const dragShape = (e, rect, world) => {
  console.log("dragShape");
  const groundBody = world.createBody();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / -scale;

  const aabb = new pl.AABB(
    new Vec2(x - 0.01, y - 0.01),
    new Vec2(x + 0.01, y + 0.01)
  );

  let selectedBody = null;
  world.queryAABB(aabb, (fixture) => {
    if (fixture.getBody().isDynamic()) {
      selectedBody = fixture.getBody();
      return false;
    }
    return true;
  });

  // Update the mouse joint definition
  const md = {
    maxForce: 10000.0,
    frequencyHz: 5.0,
    dampingRatio: 0.9,
  };

  if (selectedBody) {
    Scene.dragAndThrow.selectedBody = selectedBody;
    const mouseJoint = world.createJoint(
      new pl.MouseJoint(md, groundBody, selectedBody, new Vec2(x, y))
    );
    Scene.dragAndThrow.mouseJoint = mouseJoint;
  }
};

const moveShape = (e, rect) => {
  if (Scene.dragAndThrow.mouseJoint) {
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / -scale;
    Scene.dragAndThrow.mouseJoint.setTarget(new Vec2(x, y));
  }
};

const throwShape = (world) => {
  if (Scene.dragAndThrow.mouseJoint) {
    world.destroyJoint(Scene.dragAndThrow.mouseJoint);
    Scene.dragAndThrow = { selectedBody: null, mouseJoint: null };
  }
};

export const canvasMouseEvents = (canvas, setMousePosUI) => {
  //   console.log("canvas", canvas);
  const mouse = {
    x: 0,
    y: 0,
  };

  const mouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    // console.log("rect", rect);
    mouse.x = (e.clientX - rect.left) / scale;
    mouse.y = (e.clientY - rect.top) / scale;
    setMousePosUI({ x: mouse.x, y: mouse.y });
    Scene.mousePos = { x: mouse.x, y: mouse.y };

    moveShape(e, rect);
  };

  const mouseDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    dragShape(e, rect, Scene.world);
  };

  const mouseUp = (e) => {
    // mouse.down = false;
    throwShape(Scene.world);
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
