import planck, { Vec2 } from "planck";

export const createWalls = (world, canvas, scale) => {
  const groundHeight = -canvas.height / scale;
  const canvasWidth = canvas.width / scale;
  const canvasHeight = canvas.height / scale;

  const ground = world.createBody();
  // Bottom edge
  ground.createFixture(
    new planck.Edge(
      new Vec2(0, groundHeight),
      new Vec2(canvasWidth, groundHeight)
    ),
    0.0
  );
  // Left edge
  ground.createFixture(
    new planck.Edge(new Vec2(0, 0), new Vec2(0, -canvasHeight)),
    0.0
  );
  // Top edge
  ground.createFixture(
    new planck.Edge(new Vec2(0, 0), new Vec2(canvasWidth, 0)),
    0.0
  );
  // Right edge
  ground.createFixture(
    new planck.Edge(
      new Vec2(canvasWidth, 0),
      new Vec2(canvasWidth, -canvasHeight)
    ),
    0.0
  );
};
