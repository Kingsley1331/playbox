import planck, { Vec2 } from "planck";
import _ from "lodash";
import { Scene } from "../../World";
import { mousePosition, setMousePos } from "../../helpers/utilities";
import { render, getBodyAABB, getFixtureAABB } from "../../helpers/rendering";

const pl = planck;

const BOX_VERTICES = [
  new Vec2(-0.5, -0.5),
  new Vec2(0.5, -0.5),
  new Vec2(0.5, 0.5),
  new Vec2(-0.5, 0.5),
];

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

const makeNsidedPolygon = (world, n, radius) => {
  const vertices = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    vertices.push(new Vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
  }
  return createPolylineShape(world, vertices);
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
    if (body && !Scene.dragAndDrop.selectedFixture) {
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
    if (body && Scene.dragAndDrop.selectedFixture) {
      const bodyPos = body.getPosition();
      const bodyAngle = -body.getAngle();

      // Convert mouse position to body's local coordinates
      const mouseOffset = new Vec2(x - bodyPos.x, y - bodyPos.y);
      const localMousePos = rotateVector(mouseOffset, bodyAngle);

      const shape = Scene.dragAndDrop.selectedFixture.getShape();

      if (shape.getType() === "circle") {
        shape.m_p.set(localMousePos.x, localMousePos.y);
      } else if (shape.getType() === "polygon") {
        // Calculate the center of the fixture
        const vertices = shape.m_vertices;
        const center = vertices
          .reduce((sum, v) => sum.add(v), new Vec2(0, 0))
          .mul(1 / vertices.length);

        // Calculate the translation needed
        const dx = localMousePos.x - center.x;
        const dy = localMousePos.y - center.y;

        // Move all vertices
        for (let i = 0; i < vertices.length; i++) {
          vertices[i].x += dx;
          vertices[i].y += dy;
        }
      }

      // Update mass properties
      body.resetMassData();
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
const addFixtureToBody = (body, fixture) => {
  body.createFixture(fixture.getShape(), fixture.getDensity());
};

const removeFixtureFromBody = (body, fixture) => {
  body.destroyFixture(fixture);
};

const rotateVector = (vector, angle) => {
  return new Vec2(
    vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
  );
};

const createFixtureAndAddToBody = (
  body,
  vertices,
  center,
  isCustomPolyline = false
) => {
  const bodyPos = body.getPosition();
  const bodyAngle = -body.getAngle();
  const { x, y } = isCustomPolyline ? center : Scene.mousePos; // center of fixture as defined by vertices
  const offset = new Vec2(x - bodyPos.x, y - bodyPos.y);

  const offsetVertices = vertices.map((v) => {
    return new Vec2(v.x + offset.x, v.y + offset.y);
  });

  const rotatedOffsetVertices = offsetVertices.map((v) => {
    return rotateVector(v, bodyAngle);
  });

  const polygonShape = new pl.Polygon(
    Scene.isAddingFixture ? rotatedOffsetVertices : vertices
  );
  const fixture = body.createFixture(polygonShape, {
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });
  return fixture;
};

const createPolylineShape = (world, points, isCustomPolyline = false) => {
  if (!world || points.length < 3) return;
  const mousePos = Scene.mousePos;
  const numPoints = points.length;
  let center = points.reduce((sum, point) => sum.add(point), new Vec2(0, 0));
  center = new Vec2(center.x / numPoints, center.y / numPoints);
  const reCalculatedPoints = isCustomPolyline
    ? points.map((point) => point.sub(center))
    : points;
  const body = world.createDynamicBody({
    position: isCustomPolyline ? center : mousePos,
    angularDamping: 0.5,
  });
  createFixtureAndAddToBody(
    Scene.isAddingFixture ? Scene.dragAndDrop.selectedBody : body,
    reCalculatedPoints,
    center,
    isCustomPolyline
  );

  Scene.polylinePoints = [];
  render(world, { x: 0, y: 0 });
  return body;
};

const createPolygon = (e, rect, world) => {
  if (Scene.mode !== "polygon" || !world) return;
  makeNsidedPolygon(world, Scene.polygonSides, 2);
  render(world, { x: 0, y: 0 });
};

const createCircle = (e, rect, world) => {
  if (Scene.mode !== "circle" || !world) return;
  const { x, y } = mousePosition(e, rect);

  let body;
  let rotatedOffset = new Vec2(0, 0);

  if (Scene.isAddingFixture) {
    body = Scene.dragAndDrop.selectedBody;
    const bodyPos = body.getPosition();
    const bodyAngle = -body.getAngle();

    const offset = new Vec2(x - bodyPos.x, y - bodyPos.y);
    rotatedOffset = new Vec2(
      offset.x * Math.cos(bodyAngle) - offset.y * Math.sin(bodyAngle),
      offset.x * Math.sin(bodyAngle) + offset.y * Math.cos(bodyAngle)
    );
  } else {
    body = world.createDynamicBody({
      position: new Vec2(x, y),
    });
  }

  // Create the circle shape first
  const circleShape = new pl.Circle(0.5);
  circleShape.m_p.set(rotatedOffset.x, rotatedOffset.y); // Set the local position

  // Create the fixture with the shape
  const fixture = body.createFixture({
    shape: circleShape,
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });

  render(world, { x: 0, y: 0 });
};

const createBox = (world) => {
  if (Scene.mode !== "box" || !world) return;
  createPolylineShape(world, BOX_VERTICES);
  render(world, { x: 0, y: 0 });
};

const createRectangle = (e, rect, world) => {
  if (Scene.mode !== "rectangle" || !world) return;
  const { x, y } = mousePosition(e, rect);
  Scene.rectangle.startPoint = { x, y };
  createPolylineShape(world, [
    new Vec2(
      x - Scene.rectangle.startPoint.x,
      y - Scene.rectangle.startPoint.y
    ),
    new Vec2(x - Scene.rectangle.startPoint.x, y - Scene.rectangle.endPoint.y),
    new Vec2(x - Scene.rectangle.endPoint.x, y - Scene.rectangle.endPoint.y),
    new Vec2(x - Scene.rectangle.endPoint.x, y - Scene.rectangle.startPoint.y),
  ]);

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

const changeBodyType = (e, rect, world, action) => {
  if (Scene.mode === "makeStatic" || Scene.mode === "makeDynamic") {
    const { x, y } = mousePosition(e, rect);
    const aabb = new pl.AABB(
      new Vec2(x - 0.01, y - 0.01),
      new Vec2(x + 0.01, y + 0.01)
    );

    world.queryAABB(aabb, (fixture) => {
      const body = fixture.getBody();
      let fixtures = body.getFixtureList();
      const userData = body.getUserData();
      const position = body.getPosition();
      const angle = body.getAngle();

      // Destroy old body
      world.destroyBody(body);

      // Create new static body with same properties
      const newBody = world.createBody({
        type: action === "makeStatic" ? "static" : "dynamic",
        position: position,
        angle: angle,
      });

      // Transfer fixtures and data
      while (fixtures) {
        newBody.createFixture(fixtures.getShape(), fixtures.getDensity());
        fixtures = fixtures.getNext();
      }
      newBody.setUserData(userData);
      return false;
    });
    render(world, { x: 0, y: 0 });
    return;
  }
};

const cloneBody = (e, rect, world) => {
  if (Scene.mode !== "clone" || !world) return;
  if (!Scene.clone.body && Scene.dragAndDrop.selectedBody) {
    Scene.clone.body = Scene.dragAndDrop.selectedBody;
  } else {
    const { x, y } = mousePosition(e, rect);
    const body = Scene.clone.body;
    if (!body) return;

    // Create new body with same type and position
    const newBody = world.createBody({
      type: body.getType(),
      position: new Vec2(x, y),
      angle: body.getAngle(),
    });

    // Copy all fixtures
    let fixture = body.getFixtureList();

    while (fixture) {
      const shape = _.cloneDeep(fixture.getShape());
      const density = _.cloneDeep(fixture.getDensity());
      const friction = _.cloneDeep(fixture.getFriction());
      const restitution = _.cloneDeep(fixture.getRestitution());

      newBody.createFixture(shape, {
        density,
        friction,
        restitution,
      });
      fixture = fixture.getNext();
    }

    // Copy other properties

    const linearVelocity = _.cloneDeep(body.getLinearVelocity());
    const angularVelocity = _.cloneDeep(body.getAngularVelocity());
    const userData = _.cloneDeep(body.getUserData());

    newBody.setLinearVelocity(linearVelocity);
    newBody.setAngularVelocity(angularVelocity);
    newBody.setUserData(userData);
    Scene.clone.body = null;
    render(world, { x: 0, y: 0 });
  }
  // Scene.clone = null;
};

const cloneFixture = (e, rect, world, body) => {
  if (Scene.mode !== "clone" || !world) return;
  if (!Scene.clone.fixture && Scene.dragAndDrop.selectedFixture) {
    Scene.clone.fixture = Scene.dragAndDrop.selectedFixture;
  } else {
    const { x, y } = mousePosition(e, rect);

    const localMousePoint = getLocalPoint(x, y, body);

    const fixture = Scene.clone.fixture;

    if (!fixture) return;

    const fixtureCenter = getFixtureCenter(fixture);

    const offset = new Vec2(
      localMousePoint.x - fixtureCenter.x,
      localMousePoint.y - fixtureCenter.y
    );
    // shift fixture position by offset vector
    const shape = { ...fixture.getShape() };
    const density = fixture.getDensity();
    const friction = fixture.getFriction();
    const restitution = fixture.getRestitution();

    if (shape.m_type === "circle") {
      const circleShape = new pl.Circle(shape.m_radius);
      const circlePosition = new Vec2(
        shape.m_p.x + offset.x,
        shape.m_p.y + offset.y
      );
      circleShape.m_p.set(circlePosition.x, circlePosition.y);

      body.createFixture({
        shape: circleShape,
        density,
        friction,
        restitution,
      });
    } else if (shape.m_type === "polygon") {
      const polygonShape = new pl.Polygon(
        shape.m_vertices.map((v) => {
          return new Vec2(v.x + offset.x, v.y + offset.y);
        })
      );
      body.createFixture(polygonShape, {
        density,
        friction,
        restitution,
      });
    }
    Scene.clone.fixture = null;
    render(world, { x: 0, y: 0 });
  }
};

export const click = (e, rect, world) => {
  if (Scene.rotationMode.status) {
    return;
  }

  // Add this new condition for static mode
  if (Scene.mode === "makeStatic") {
    changeBodyType(e, rect, world, "makeStatic");
  } else if (Scene.mode === "makeDynamic") {
    changeBodyType(e, rect, world, "makeDynamic");
  }

  if (
    Scene.mode === "clone" &&
    Scene.dragAndDrop.selectedBody &&
    !Scene.dragAndDrop.selectedFixture
  ) {
    cloneBody(e, rect, world);
  }
  if (Scene.mode === "clone" && Scene.dragAndDrop.selectedFixture) {
    cloneFixture(e, rect, world, Scene.dragAndDrop.selectedBody);
  }

  createBox(world);
  createCircle(e, rect, world);
  createPolygon(e, rect, world);
  createPolyline(e, rect, world);
  createRectangle(e, rect, world);
};

export const doubleClick = (e, rect, world) => {
  createPolylineShape(world, Scene.polylinePoints, true);
  const { x, y } = mousePosition(e, rect);

  if (!Scene.dragAndDrop.selectedFixture) {
    let selectedFixtureType;
    let selectedFixture;
    const point = new Vec2(x, y);
    const aabb = new pl.AABB(
      new Vec2(x - 0.01, y - 0.01),
      new Vec2(x + 0.01, y + 0.01)
    );

    world.queryAABB(aabb, (fixture) => {
      if (fixture.testPoint(point)) {
        Scene.dragAndDrop.selectedFixture = fixture;
        Scene.dragAndDrop.startMousePos = { x, y };
        selectedFixtureType = fixture.getShape().getType();
        selectedFixture = fixture;
        render(world, { x: 0, y: 0 });
        return true;
      }
      return false;
    });
    /* the fixtures are updated to correctly calculate their boundin rect
     this is due to a bug in planck.js that causes the body's bounding rect to be calculted instead */
    const selectedBody = Scene.dragAndDrop.selectedBody;
    if (selectedFixtureType === "polygon") {
      updateFixtureVertices(
        selectedBody,
        selectedFixture,
        selectedFixture.getShape().m_vertices
      );
    } else if (selectedFixtureType === "circle") {
      updateCircleFixture(
        selectedBody,
        selectedFixture,
        selectedFixture.getShape().m_radius,
        selectedFixture.getShape().m_p
      );
    }
    render(world, { x: 0, y: 0 });
    return;
  }

  if (Scene.dragAndDrop.selectedFixture) {
    Scene.dragAndDrop.selectedFixture = null;
    Scene.dragAndDrop.startMousePos = null; // Clear stored position
  }
  render(world, { x: 0, y: 0 });
};

function isPointInCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function isPointInRect(px, py, rx, ry, size) {
  const halfSize = size / 2;
  return (
    px >= rx - halfSize &&
    px <= rx + halfSize &&
    py >= ry - halfSize &&
    py <= ry + halfSize
  );
}

function scaleBody(body, originalFixtures, scale) {
  let fixture = body.getFixtureList();
  let fixtureIndex = 0;

  while (fixture) {
    const shape = fixture.getShape();
    const isCircle = shape.getType() === "circle";
    const isPolygon = shape.getType() === "polygon";
    let circleShapeX = 0;
    let circleShapeY = 0;
    const originalShape = originalFixtures[fixtureIndex];
    if (isCircle) {
      circleShapeX = shape.m_p.x;
      circleShapeY = shape.m_p.y;
    }

    if (isPolygon) {
      const vertices = shape.m_vertices;
      const originalVertices = originalShape.vertices;

      vertices.forEach((v, i) => {
        v.set(originalVertices[i].x * scale, originalVertices[i].y * scale);
      });
    } else if (isCircle) {
      shape.m_radius = originalShape.radius * scale;
      shape.m_p.x = originalShape.x * scale;
      shape.m_p.y = originalShape.y * scale;
    }

    fixture = fixture.getNext();
    fixtureIndex++;
  }
  body.resetMassData();
  render(Scene.world, { x: 0, y: 0 });
}

const scaleFixture = (fixture, body, scale) => {
  const shape = fixture.getShape();
  const isCircle = shape.getType() === "circle";
  const isPolygon = shape.getType() === "polygon";
  let selectedFixture = Scene.resizeMode.selectedFixture;

  // const selectedFixture = Scene.dragAndDrop.selectedFixtur

  const bodyPosition = body.getPosition();
  let offset = new Vec2(0, 0);

  if (isPolygon) {
    offset = new Vec2(
      selectedFixture.center.x - body.getPosition().x,
      selectedFixture.center.y - body.getPosition().y
    );
  }

  if (isCircle) {
    const selectedFixtureCenter = selectedFixture.center;
    const selectedFixtureRadius = selectedFixture.radius;

    updateCircleFixture(
      body,
      fixture,
      selectedFixtureRadius * scale,
      selectedFixtureCenter
    );
  } else if (isPolygon) {
    const referenceVertices = Scene.resizeMode.selectedFixture.vertices;

    const resizedVertices = referenceVertices
      .map((v) => {
        return new Vec2((v.x - offset.x) * scale, (v.y - offset.y) * scale);
      })
      .map((v) => {
        return new Vec2(v.x + offset.x, v.y + offset.y);
      });

    updateFixtureVertices(body, fixture, resizedVertices);
  }
  return fixture;
};

function isPointNearVertex(px, py, vx, vy, threshold = 0.2) {
  const dx = px - vx;
  const dy = py - vy;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

function getLocalPoint(worldX, worldY, body) {
  // Convert world point to local body coordinates
  const bodyPosition = body.getPosition();
  const bodyAngle = body.getAngle();
  const cos = Math.cos(-bodyAngle);
  const sin = Math.sin(-bodyAngle);

  const dx = worldX - bodyPosition.x;
  const dy = worldY - bodyPosition.y;

  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}

function getWorldPoint(localX, localY, body) {
  // Convert local body coordinates to world point
  const bodyPosition = body.getPosition();
  const bodyAngle = body.getAngle();
  const cos = Math.cos(bodyAngle);
  const sin = Math.sin(bodyAngle);

  return {
    x: localX * cos - localY * sin + bodyPosition.x,
    y: localX * sin + localY * cos + bodyPosition.y,
  };
}

export function mouseDown(e) {
  let fixtureCount = 0;
  const rect = Scene.canvas.element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / Scene.scale;
  const y = -(e.clientY - rect.top) / Scene.scale;

  if (Scene.dragAndDrop.selectedBody) {
    fixtureCount = getFixtureCount(Scene.dragAndDrop.selectedBody);
  }

  // Check if clicking a vertex of the selected body
  if (Scene.dragAndDrop.selectedBody) {
    const localPoint = getLocalPoint(x, y, Scene.dragAndDrop.selectedBody);

    let fixture = Scene.dragAndDrop.selectedBody.getFixtureList();
    let fixtureIndex = 0;

    while (fixture) {
      const shape = fixture.getShape();
      if (shape.getType() === "polygon") {
        const vertices = shape.m_vertices;
        for (let i = 0; i < vertices.length; i++) {
          if (
            isPointNearVertex(
              localPoint.x,
              localPoint.y,
              vertices[i].x,
              vertices[i].y
            )
          ) {
            Scene.vertexDragMode = {
              body: Scene.dragAndDrop.selectedBody,
              fixture,
              vertexIndex: i,
              originalVertices: vertices.map((v) => ({ x: v.x, y: v.y })),
            };
            return;
          }
        }
      }
      fixture = fixture.getNext();
      fixtureIndex++;
    }
  }

  // Check if clicking rotation handle
  if (Scene.dragAndDrop.selectedBody?.rotationHandle) {
    const handle = Scene.dragAndDrop.selectedBody.rotationHandle;
    const bodyPosition = Scene.dragAndDrop.selectedBody.getPosition();
    let localCenterOfFixture = new Vec2(0, 0);
    let centerOfFixture = new Vec2(0, 0);

    if (Scene.dragAndDrop.selectedFixture) {
      localCenterOfFixture = getFixtureCenter(
        Scene.dragAndDrop.selectedFixture
      );

      centerOfFixture = new Vec2(
        localCenterOfFixture.x + bodyPosition.x,
        localCenterOfFixture.y + bodyPosition.y
      );
      Scene.rotationMode.center = centerOfFixture;
    }
    const centerOfRotation = Scene.dragAndDrop.selectedFixture
      ? centerOfFixture
      : bodyPosition;

    if (isPointInCircle(x, y, handle.x, handle.y, handle.radius)) {
      Scene.rotationMode = {
        status: true,
        body: Scene.dragAndDrop.selectedBody,
        center: centerOfRotation,
        startAngle: Math.atan2(
          y - centerOfRotation?.y,
          x - centerOfRotation?.x
        ),
      };
    }
  }

  // Check if clicking resize handles
  if (Scene.dragAndDrop.selectedBody?.resizeHandles) {
    const hasSelectedFixture = !!Scene.dragAndDrop.selectedFixture;
    for (const [position, handle] of Object.entries(
      Scene.dragAndDrop.selectedBody.resizeHandles
    )) {
      if (isPointInRect(x, y, handle.x, handle.y, handle.size)) {
        // Store original fixture data
        const originalFixtures = [];
        let fixture = Scene.dragAndDrop.selectedBody.getFixtureList();

        while (fixture) {
          const shape = fixture.getShape();
          if (shape.getType() === "polygon") {
            originalFixtures.push({
              type: "polygon",
              vertices: shape.m_vertices.map((v) => ({ x: v.x, y: v.y })),
            });
          } else if (shape.getType() === "circle") {
            originalFixtures.push({
              type: "circle",
              radius: shape.m_radius,
              x: shape.m_p.x,
              y: shape.m_p.y,
            });
          }
          fixture = fixture.getNext();
        }
        const selectedFixtureShape = hasSelectedFixture
          ? Scene.dragAndDrop.selectedFixture.getShape()
          : null;

        const selectedFixtureType = hasSelectedFixture
          ? selectedFixtureShape.getType()
          : null;

        const selectedFixtureVertices =
          hasSelectedFixture && selectedFixtureType === "polygon"
            ? [
                ...selectedFixtureShape.m_vertices.map((v) => {
                  return { x: v.x, y: v.y };
                }),
              ]
            : null;

        const selectedFixtureCenter =
          hasSelectedFixture && selectedFixtureType === "polygon"
            ? getFixtureCenter(Scene.dragAndDrop.selectedFixture).add(
                Scene.dragAndDrop.selectedBody.getPosition()
              )
            : null;

        const selectedFixtureRadius =
          hasSelectedFixture && selectedFixtureType === "circle"
            ? selectedFixtureShape?.m_radius
            : null;

        const selectedFixtureCircleCenter =
          hasSelectedFixture && selectedFixtureType === "circle"
            ? selectedFixtureShape?.m_p
            : null;

        Scene.resizeMode = {
          body: Scene.dragAndDrop.selectedBody,
          handle: position,
          startPoint: { x, y },
          originalFixtures,
          selectedFixture: {
            type: selectedFixtureType,
            vertices: selectedFixtureVertices,
            radius: selectedFixtureRadius,
            center:
              selectedFixtureType === "polygon"
                ? selectedFixtureCenter
                : selectedFixtureCircleCenter,
          },
          originalAABB: hasSelectedFixture
            ? getFixtureAABB(Scene.dragAndDrop.selectedFixture)
            : getBodyAABB(Scene.dragAndDrop.selectedBody),
        };
        render(Scene.world, { x: 0, y: 0 });
      }
    }
  }
  if (Scene.dragAndDrop.selectedFixture) {
    Scene.dragAndDrop.startMousePos = { x, y };
  }
  if (Scene.mode === "rectangle") {
    Scene.rectangle.startPoint = { x, y };
    Scene.rectangle.status = true;
    return;
  }
  if (Scene.mode === "delete") {
    deleteSelected(
      Scene.dragAndDrop.selectedBody,
      Scene.dragAndDrop.selectedFixture
    );
  }

  dragShape(e, rect, Scene.world);
  grabShape(e, rect, Scene.world);
}

const deleteSelected = (body, fixture) => {
  if (Scene.mode === "delete") {
    if (fixture) {
      const fixtureCount = getFixtureCount(body);

      body.destroyFixture(fixture);

      if (fixtureCount === 1) {
        Scene.world.destroyBody(body);
        Scene.dragAndDrop.selectedBody = null;
        Scene.dragAndDrop.selectedFixture = null;
      }

      render(Scene.world, { x: 0, y: 0 });
    } else if (body && !fixture) {
      Scene.world.destroyBody(body);
      Scene.dragAndDrop.selectedBody = null;
      Scene.dragAndDrop.selectedFixture = null;
    }
    render(Scene.world, { x: 0, y: 0 });
  }
};

const updateFixtureVertices = (body, fixture, newVertices) => {
  const fixtureProperties = {
    density: fixture.getDensity(),
    friction: fixture.getFriction(),
    restitution: fixture.getRestitution(),
  };
  body.destroyFixture(fixture);
  Scene.dragAndDrop.selectedFixture = null;

  const newFixture = body.createFixture(new pl.Polygon(newVertices), {
    ...fixtureProperties,
  });
  Scene.dragAndDrop.selectedFixture = newFixture;
};

const updateCircleFixture = (body, fixture, newRadius, newCenter) => {
  const fixtureProperties = {
    density: fixture.getDensity(),
    friction: fixture.getFriction(),
    restitution: fixture.getRestitution(),
  };
  body.destroyFixture(fixture);
  Scene.dragAndDrop.selectedFixture = null;

  const newFixture = body.createFixture(new pl.Circle(newRadius), {
    ...fixtureProperties,
  });
  newFixture.getShape().m_p.set(newCenter.x, newCenter.y);

  Scene.dragAndDrop.selectedFixture = newFixture;
};

const getFixtureCenter = (fixture) => {
  const isCircle = fixture.getShape().getType() === "circle";
  if (isCircle) {
    return fixture.getShape().m_p;
  }
  const shape = fixture.getShape();
  const vertices = shape.m_vertices;
  return vertices
    .reduce((sum, v) => sum.add(v), new Vec2(0, 0))
    .mul(1 / vertices.length);
};

export function mouseMove(e, setMousePosUI) {
  const rect = Scene.canvas.element.getBoundingClientRect();
  const { x, y } = mousePosition(e, rect);
  setMousePosUI({ x, y });

  if (Scene.vertexDragMode) {
    const localPoint = getLocalPoint(x, y, Scene.vertexDragMode.body);
    const shape = Scene.vertexDragMode.fixture.getShape();

    if (shape.getType() === "polygon") {
      const clonedVertices = _.cloneDeep(shape.m_vertices);
      // Update the vertex position
      clonedVertices[Scene.vertexDragMode.vertexIndex].x = localPoint.x;
      clonedVertices[Scene.vertexDragMode.vertexIndex].y = localPoint.y;

      // Validate the new polygon shape
      let vertices = clonedVertices;
      let isValid = true;

      // Check if the polygon is still convex and not self-intersecting
      for (let i = 0; i < vertices.length; i++) {
        const i1 = i;
        const i2 = (i + 1) % vertices.length;
        const i3 = (i + 2) % vertices.length;

        const dx1 = vertices[i2].x - vertices[i1].x;
        const dy1 = vertices[i2].y - vertices[i1].y;
        const dx2 = vertices[i3].x - vertices[i2].x;
        const dy2 = vertices[i3].y - vertices[i2].y;

        // Cross product should be positive for convex polygon
        if (dx1 * dy2 - dy1 * dx2 <= 0) {
          isValid = false;
          break;
        }
      }

      // If the new shape is invalid, revert to original vertices
      if (!isValid) {
        for (let i = 0; i < vertices.length; i++) {
          vertices[i].x = Scene.vertexDragMode.originalVertices[i].x;
          vertices[i].y = Scene.vertexDragMode.originalVertices[i].y;
        }
      }

      updateFixtureVertices(
        Scene.dragAndDrop.selectedBody,
        Scene.dragAndDrop.selectedFixture,
        vertices
      );
    }
    Scene.dragAndDrop.selectedBody.resetMassData();
    render(Scene.world, { x: 0, y: 0 });
  }

  if (
    Scene.rotationMode.status &&
    Scene.dragAndDrop.selectedBody &&
    !Scene.dragAndDrop.selectedFixture
  ) {
    const currentAngle = Math.atan2(
      y - Scene.rotationMode.center.y,
      x - Scene.rotationMode.center.x
    );

    const deltaAngle = currentAngle - Scene.rotationMode.startAngle;
    Scene.rotationMode.body.setAngle(
      Scene.rotationMode.body.getAngle() + deltaAngle
    );
    Scene.rotationMode.startAngle = currentAngle;
    render(Scene.world, { x: 0, y: 0 });
  }
  if (
    Scene.rotationMode.status &&
    Scene.dragAndDrop.selectedBody &&
    Scene.dragAndDrop.selectedFixture
  ) {
    const fixture = Scene.dragAndDrop.selectedFixture;
    const vertices = fixture.getShape().m_vertices;
    const fixtureCenter = getFixtureCenter(fixture);
    // const currentAngle = Math.atan2(y - fixtureCenter.y, x - fixtureCenter.x);
    const currentAngle = Math.atan2(
      y - Scene.rotationMode.center.y,
      x - Scene.rotationMode.center.x
    );

    const rotatedModeCenter = {
      x: Scene.rotationMode.center.x,
      y: Scene.rotationMode.center.y,
    };

    const bodyPosition = Scene.dragAndDrop.selectedBody.getPosition();

    const offset = new Vec2(
      rotatedModeCenter.x - bodyPosition.x,
      rotatedModeCenter.y - bodyPosition.y
    );
    const deltaAngle = currentAngle - Scene.rotationMode.startAngle;

    /** 
     General approach to rotating vertices around the center of a fixture
      - In order to rotate the vertices around the fixture center, we need to 
        - translate the vertices to the body center 
        - rotate them
        - and then translate them back to the fixture center
      - To do this we first have to find the offset which is the vector from the center of the fixture (rotatedModeCenter) to the center of the body (bodyPosition) - both rotatedModeCenter and bodyPosition are global coordinate vectors
      - We then need to subtract the offset from each vertex to get the local coordinates
      - We rotate the now offset vertices with rotateVector
      - lastly we add the offset back to get the fixture back to its original position
    **/

    const rotatedVertices = vertices
      .map((v) => {
        return rotateVector(
          new Vec2(v.x - offset.x, v.y - offset.y),
          deltaAngle
        );
      })
      .map((v) => {
        return new Vec2(v.x + offset.x, v.y + offset.y);
      });

    updateFixtureVertices(
      Scene.dragAndDrop.selectedBody,
      fixture,
      rotatedVertices
    );

    Scene.rotationMode.startAngle = currentAngle;
    render(Scene.world, { x: 0, y: 0 });
  }

  if (Scene.resizeMode) {
    const dx = x - Scene.resizeMode.startPoint.x;
    const dy = y - Scene.resizeMode.startPoint.y;
    const aabb = Scene.resizeMode.originalAABB;
    const width = aabb.upperBound.x - aabb.lowerBound.x;
    const height = aabb.upperBound.y - aabb.lowerBound.y;

    // Calculate diagonal distance for uniform scaling
    const originalDiagonal = Math.sqrt(width * width + height * height);
    let newDiagonal;

    switch (Scene.resizeMode.handle) {
      case "topRight":
      case "bottomRight":
        newDiagonal = originalDiagonal + dx;
        break;
      case "topLeft":
      case "bottomLeft":
        newDiagonal = originalDiagonal - dx;
        break;
    }

    // Calculate uniform scale factor
    const scaleFactor = Math.max(0.1, newDiagonal / originalDiagonal);

    if (Scene.dragAndDrop.selectedBody && !Scene.dragAndDrop.selectedFixture) {
      scaleBody(
        Scene.resizeMode.body,
        Scene.resizeMode.originalFixtures,
        scaleFactor
      );
    }

    if (Scene.dragAndDrop.selectedFixture) {
      const fixture = Scene.dragAndDrop.selectedFixture;
      const vertices = fixture.getShape().m_vertices;
      const fixtureCenter = getFixtureCenter(fixture);
      const currentAngle = Math.atan2(y - fixtureCenter.y, x - fixtureCenter.x);
      const deltaAngle = currentAngle - Scene.rotationMode.startAngle;
      scaleFixture(fixture, Scene.dragAndDrop.selectedBody, scaleFactor);
      render(Scene.world, { x: 0, y: 0 });
    }
  }
  if (Scene.mode === "rectangle" && Scene.rectangle.status) {
    Scene.rectangle.endPoint = { x, y };
    render(Scene.world, { x: 0, y: 0 });
    return;
  }

  renderPolylinePreview(Scene.world);
  setMousePos(new Vec2(x, y));
  moveShape(e, rect);
  relocateShape(x, y, Scene.world);
}

export function mouseUp(e) {
  if (Scene.vertexDragMode) {
    Scene.vertexDragMode = null;
    return;
  }

  if (Scene.rotationMode.status) {
    Scene.rotationMode = {
      status: false,
      center: { x: 0, y: 0 },
      startAngle: 0,
    };
    return;
  }

  if (Scene.resizeMode) {
    Scene.resizeMode = null;
    return;
  }
  if (Scene.mode === "rectangle") {
    const { x, y } = Scene.mousePos;
    Scene.rectangle.endPoint = { x, y };
    Scene.rectangle.status = false;
    return;
  }

  throwShape(Scene.world);
  releaseShape();
  Scene.dragAndDrop.startMousePos = { x: 0, y: 0 };
}

function getFixtureCount(body) {
  let count = 0;
  let fixture = body.getFixtureList();

  while (fixture) {
    count++;
    fixture = fixture.getNext();
  }

  return count;
}
