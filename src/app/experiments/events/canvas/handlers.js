import planck, { Vec2 } from "planck";
import { Scene } from "../../World";
import { mousePosition, setMousePos } from "../../helpers/utilities";
import { render } from "../../helpers/rendering";

const pl = planck;
const { scale } = Scene;

const dragShape = (e, rect, world) => {
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
      console.log("===============================>onBody true");
      return false;
    }
    console.log("===============================>onBody false");
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

export const moveShape = (e, rect) => {
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

// export const grabShape = (world) => {
//   console.log("grabShape");
// };

const createPolylineBox = (world, x, y) => {
  const boxSize = 0.5;
  const vertices = [
    new Vec2(-boxSize, -boxSize),
    new Vec2(boxSize, -boxSize),
    new Vec2(boxSize, boxSize),
    new Vec2(-boxSize, boxSize),
  ];

  const body = world.createDynamicBody({
    position: new Vec2(x, y),
    angularDamping: 0.5,
  });

  const polygonShape = new pl.Polygon(vertices);
  const fixture = body.createFixture(polygonShape, {
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });

  return body;
};

const createPolylineShape = (world, points) => {
  if (!world || points.length < 3) return;

  const body = world.createDynamicBody({
    position: new Vec2(0, 0), // TODO: we need to set the position to the center of the polygon
    angularDamping: 0.5,
  });

  const polygonShape = new pl.Polygon(points);

  const fixture = body.createFixture(polygonShape, {
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });
  Scene.polylinePoints = [];
  render(world, { x: 0, y: 0 });
  return body;
};

const createBox = (e, rect, world) => {
  if (Scene.mode !== "box" || !world) return;
  const mousePos = mousePosition(e, rect);
  createPolylineBox(world, mousePos.x, mousePos.y);
  render(world, { x: 0, y: 0 });
};

const createCircle = (e, rect, world) => {
  if (Scene.mode !== "circle" || !world) return;
  const mousePos = mousePosition(e, rect);
  const { x, y } = mousePos;
  // create circle
  const circle = world.createDynamicBody({
    position: new Vec2(x, y),
  });
  const fixture = circle.createFixture(new pl.Circle(0.5), {
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });
  render(world, { x: 0, y: 0 });
};

const renderPolylinePreview = (world) => {
  if (Scene.mode === "polyline") {
    render(world, { x: 0, y: 0 });
  }
};

const createPolyline = (e, rect, world) => {
  if (Scene.mode !== "polyline" || !world) return;
  const mousePos = mousePosition(e, rect);
  const { x, y } = mousePos;
  Scene.polylinePoints = [...Scene.polylinePoints, new Vec2(x, y)];
};

export const click = (e, rect, world) => {
  createBox(e, rect, world);
  createCircle(e, rect, world);
  createPolyline(e, rect, world);
};

export const doubleClick = (world) => {
  createPolylineShape(world, Scene.polylinePoints);
};

export const mouseDown = (e, rect, world) => {
  dragShape(e, rect, world);
};

export const mouseUp = (world) => {
  throwShape(world);
};

export const mouseMove = (e, rect, setMousePosUI) => {
  const mousePos = mousePosition(e, rect);
  renderPolylinePreview(Scene.world);
  setMousePos(mousePos);
  setMousePosUI(mousePos);
  moveShape(e, rect);
};
