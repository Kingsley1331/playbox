import planck, { Vec2 } from "planck";
import { Scene } from "../../World";
import { mousePosition, setMousePos } from "../../helpers/utilities";
import { render } from "../../helpers/rendering";

const pl = planck;

export const isStaticBody = (body) => {
  if (body) {
    return body.m_type === "static";
  }
  return false;
};

const dragShape = (e, rect, world) => {
  if (Scene.mode === "playing") {
    const groundBody = world.createBody();
    const { x, y } = mousePosition(e, rect);

    const aabb = new pl.AABB(
      new Vec2(x - 0.01, y - 0.01),
      new Vec2(x + 0.01, y + 0.01)
    );

    let selectedBody = null;
    world.queryAABB(aabb, (fixture) => {
      selectedBody = fixture.getBody();
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
  }
};

export const moveShape = (e, rect) => {
  if (Scene.dragAndThrow.mouseJoint) {
    const { x, y } = mousePosition(e, rect);
    Scene.dragAndThrow.mouseJoint.setTarget(new Vec2(x, y));
  }
};

const relocateShape = (x, y, world) => {
  const body = Scene.dragAndDrop.selectedBody;
  if (Scene.dragAndDrop.dragging && Scene.mode === "") {
    if (body) {
      body.setPosition(new Vec2(x, y));

      if (isStaticBody(body)) {
        // Store the body's properties
        let fixtures = body.getFixtureList();
        const userData = body.getUserData();
        const angle = body.getAngle();

        // Destroy old body
        world.destroyBody(body);

        // Create new body at new position
        const newBody = world.createBody({
          type: "static",
          position: { x, y },
          angle,
        });

        // Transfer fixtures and data
        while (fixtures) {
          newBody.createFixture(fixtures.getShape(), fixtures.getDensity());
          fixtures = fixtures.getNext();
        }
        newBody.setUserData(userData);
        Scene.dragAndDrop.selectedBody = newBody;
      } else {
        // For non-static bodies, normal position setting works
        body.setPosition({ x, y });
        body.setAwake(true);
      }
    }
    render(world, { x: 0, y: 0 });
  }
};

const releaseShape = () => {
  Scene.dragAndDrop.dragging = false;
  // Scene.dragAndDrop.selectedBody = null;
};

const throwShape = (world) => {
  if (Scene.dragAndThrow.mouseJoint) {
    world.destroyJoint(Scene.dragAndThrow.mouseJoint);
    Scene.dragAndThrow = { selectedBody: null, mouseJoint: null };
  }
};

export const grabShape = (e, rect, world) => {
  if (Scene.mode === "") {
    const { x, y } = mousePosition(e, rect);
    const aabb = new pl.AABB(
      new Vec2(x - 0.01, y - 0.01),
      new Vec2(x + 0.01, y + 0.01)
    );
    let selectedBody = null;
    world.queryAABB(aabb, (fixture) => {
      selectedBody = fixture.getBody();
      Scene.dragAndDrop.selectedBody = selectedBody;
      Scene.dragAndDrop.dragging = true;
    });
    render(world, { x: 0, y: 0 });
  }
};

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
  const numPoints = points.length;
  let centerOfMass = points.reduce(
    (sum, point) => sum.add(point),
    new Vec2(0, 0)
  );
  centerOfMass = new Vec2(
    centerOfMass.x / numPoints,
    centerOfMass.y / numPoints
  );

  const reCenteredPoints = points.map((point) => point.sub(centerOfMass));

  const body = world.createDynamicBody({
    position: centerOfMass,
    angularDamping: 0.5,
  });

  const polygonShape = new pl.Polygon(reCenteredPoints);

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
  const { x, y } = mousePosition(e, rect);
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
  const { x, y } = mousePosition(e, rect);
  Scene.polylinePoints = [...Scene.polylinePoints, new Vec2(x, y)];
};

export const click = (e, rect, world) => {
  if (Scene.rotationMode) {
    return;
  }
  createBox(e, rect, world);
  createCircle(e, rect, world);
  createPolyline(e, rect, world);
};

export const doubleClick = (world) => {
  createPolylineShape(world, Scene.polylinePoints);
};

function isPointInCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}

export function mouseDown(e) {
  const rect = Scene.canvas.element.getBoundingClientRect();
  const { x, y } = mousePosition(e, rect);

  dragShape(e, rect, Scene.world);
  grabShape(e, rect, Scene.world);

  if (Scene.dragAndDrop.selectedBody?.rotationHandle) {
    const handle = Scene.dragAndDrop.selectedBody.rotationHandle;
    if (isPointInCircle(x, y, handle.x, handle.y, handle.radius)) {
      Scene.rotationMode = {
        body: Scene.dragAndDrop.selectedBody,
        center: Scene.dragAndDrop.selectedBody.getPosition(),
        startAngle: Math.atan2(
          y - Scene.dragAndDrop.selectedBody.getPosition().y,
          x - Scene.dragAndDrop.selectedBody.getPosition().x
        ),
      };
      return;
    }
  }
}

export function mouseMove(e) {
  const rect = Scene.canvas.element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / Scene.scale;
  const y = -(e.clientY - rect.top) / Scene.scale;

  if (Scene.rotationMode) {
    const currentAngle = Math.atan2(
      y - Scene.rotationMode.center.y,
      x - Scene.rotationMode.center.x
    );
    const deltaAngle = currentAngle - Scene.rotationMode.startAngle;
    Scene.rotationMode.body.setAngle(
      Scene.rotationMode.body.getAngle() + deltaAngle
    );
    Scene.rotationMode.startAngle = currentAngle;
    Scene.rotationMode.deltaAngle = deltaAngle;
    render(Scene.world, { x: 0, y: 0 });
  }

  renderPolylinePreview(Scene.world);
  setMousePos(new Vec2(x, y));
  moveShape(e, rect);
  relocateShape(x, y, Scene.world);
}

export function mouseUp(e) {
  throwShape(Scene.world);
  releaseShape();
  Scene.rotationMode = null;
}
