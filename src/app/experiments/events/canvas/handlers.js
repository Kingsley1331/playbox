import planck, { Vec2 } from "planck";
import { Scene } from "../../World";
import { mousePosition, setMousePos } from "../../helpers/utilities";
import { render, getBodyAABB } from "../../helpers/rendering";

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
const addFixtureToBody = (body, fixture) => {
  body.createFixture(fixture.getShape(), fixture.getDensity());
};

const removeFixtureFromBody = (body, fixture) => {
  body.destroyFixture(fixture);
};

const createFixtureAndAddToBody = (body, vertices) => {
  const bodyPos = body.getPosition();
  const mousePos = Scene.mousePos;
  const offset = mousePos.sub(bodyPos);

  const offsetVertices = vertices.map((v) => {
    return new Vec2(v.x + offset.x, v.y + offset.y);
  });

  const polygonShape = new pl.Polygon(
    Scene.isAddingFixture ? offsetVertices : vertices
  );
  const fixture = body.createFixture(polygonShape, {
    density: 1.0,
    friction: 0.3,
    restitution: 0.2,
  });
  return fixture;
};

const createPolylineShape = (world, points, shouldRecenter = false) => {
  if (!world || points.length < 3) return;
  const mousePos = Scene.mousePos;
  const numPoints = points.length;
  let centerOfMass = points.reduce(
    (sum, point) => sum.add(point),
    new Vec2(0, 0)
  );
  centerOfMass = new Vec2(
    centerOfMass.x / numPoints,
    centerOfMass.y / numPoints
  );

  const reCenteredPoints = shouldRecenter
    ? points.map((point) => point.sub(centerOfMass))
    : points;

  const body = world.createDynamicBody({
    position: shouldRecenter ? centerOfMass : mousePos,
    angularDamping: 0.5,
  });

  createFixtureAndAddToBody(
    Scene.isAddingFixture ? Scene.dragAndDrop.selectedBody : body,
    reCenteredPoints
  );

  Scene.polylinePoints = [];
  render(world, { x: 0, y: 0 });
  return body;
};

const createBox = (e, rect, world) => {
  if (Scene.mode !== "box" || !world) return;
  createPolylineShape(world, BOX_VERTICES);
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

export const doubleClick = (e, rect, world) => {
  createPolylineShape(world, Scene.polylinePoints, true);
  const { x, y } = mousePosition(e, rect);

  if (!Scene.dragAndDrop.selectedFixture) {
    // Get mouse position and query for fixture
    const point = new Vec2(x, y);

    // Query all bodies in the area
    const aabb = new pl.AABB(
      new Vec2(x - 0.01, y - 0.01),
      new Vec2(x + 0.01, y + 0.01)
    );

    world.queryAABB(aabb, (fixture) => {
      // Test if the point is actually inside this fixture
      if (fixture.testPoint(point)) {
        console.log("======================fixture", fixture);
        Scene.dragAndDrop.selectedFixture = fixture;
        render(world, { x: 0, y: 0 });
        return true; // Stop querying after finding a match
      }
      return false; // Continue searching if point not in this fixture
    });
    render(world, { x: 0, y: 0 });
    return;
  }

  if (Scene.dragAndDrop.selectedFixture) {
    console.log("======================deselecting fixture");
    Scene.dragAndDrop.selectedFixture = null;
  }
  render(world, { x: 0, y: 0 });
  return;
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
    const originalShape = originalFixtures[fixtureIndex];

    if (shape.getType() === "polygon") {
      const vertices = shape.m_vertices;
      const originalVertices = originalShape.vertices;

      for (let i = 0; i < vertices.length; i++) {
        vertices[i].x = originalVertices[i].x * scale;
        vertices[i].y = originalVertices[i].y * scale;
      }
    } else if (shape.getType() === "circle") {
      shape.m_radius = originalShape.radius * scale;
    }

    fixture = fixture.getNext();
    fixtureIndex++;
  }
  render(Scene.world, { x: 0, y: 0 });
}

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
  const rect = Scene.canvas.element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / Scene.scale;
  const y = -(e.clientY - rect.top) / Scene.scale;

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
              fixture: fixture,
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

  // Check if clicking resize handles
  if (Scene.dragAndDrop.selectedBody?.resizeHandles) {
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
            });
          }
          fixture = fixture.getNext();
        }

        Scene.resizeMode = {
          body: Scene.dragAndDrop.selectedBody,
          handle: position,
          startPoint: { x, y },
          originalFixtures,
          originalAABB: getBodyAABB(Scene.dragAndDrop.selectedBody),
        };
      }
    }
  }
  dragShape(e, rect, Scene.world);
  grabShape(e, rect, Scene.world);
}

export function mouseMove(e) {
  const rect = Scene.canvas.element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / Scene.scale;
  const y = -(e.clientY - rect.top) / Scene.scale;

  if (Scene.vertexDragMode) {
    const localPoint = getLocalPoint(x, y, Scene.vertexDragMode.body);
    const shape = Scene.vertexDragMode.fixture.getShape();

    if (shape.getType() === "polygon") {
      // Update the vertex position
      shape.m_vertices[Scene.vertexDragMode.vertexIndex].x = localPoint.x;
      shape.m_vertices[Scene.vertexDragMode.vertexIndex].y = localPoint.y;

      // Validate the new polygon shape
      const vertices = shape.m_vertices;
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
    }
    render(Scene.world, { x: 0, y: 0 });
  }

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

    scaleBody(
      Scene.resizeMode.body,
      Scene.resizeMode.originalFixtures,
      scaleFactor
    );
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

  if (Scene.rotationMode) {
    Scene.rotationMode = null;
    return;
  }

  if (Scene.resizeMode) {
    Scene.resizeMode = null;
    return;
  }

  throwShape(Scene.world);
  releaseShape();
}
