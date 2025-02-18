"use client";

export function render2(
  worldRef,
  ctxRef,
  scale,
  canvasRef,
  translation = { x: canvas.width / 2, y: canvas.height / 2 },
  isPausedRef
) {
  const canvas = canvasRef.current;
  if (worldRef?.current && ctxRef.current) {
    const world = worldRef.current;
    const ctx = ctxRef.current;
    const frameRate = isPausedRef.current ? Infinity : 60;

    world?.step(1 / frameRate);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Setup transform
    ctx.save();
    ctx.translate(translation.x, translation.y);
    ctx.scale(1, -1);
    ctx.scale(scale, scale);

    // Draw all bodies
    for (let b = world?.getBodyList(); b; b = b.getNext()) {
      drawBody(ctx, b, scale);
    }

    ctx.restore();
    if (!isPausedRef.current) {
      requestAnimationFrame(() =>
        render2(
          worldRef,
          ctxRef,
          scale,
          canvasRef,
          { x: translation.x, y: translation.y },
          isPausedRef
        )
      );
    }
  }
}

export function render(
  world,
  ctx,
  scale,
  fps,
  canvas,
  translation = { x: canvas.width / 2, y: canvas.height / 2 }
) {
  world?.step(1 / fps);
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Setup transform
  ctx.save();
  ctx.translate(translation.x, translation.y);
  ctx.scale(1, -1);
  ctx.scale(scale, scale);

  // Draw all bodies
  for (let b = world?.getBodyList(); b; b = b.getNext()) {
    drawBody(ctx, b, scale);
  }

  ctx.restore();

  requestAnimationFrame(() =>
    render(world, ctx, scale, fps, canvas, translation)
  );
}

export function drawBody(ctx, body, scale) {
  const colour = "rgb(175, 224, 230, 0.8)";
  // const colour = "rgba(196, 203, 2000, 0.5)";
  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    const shape = f.getShape();
    const type = shape.getType();
    const pos = body.getPosition();
    const angle = body.getAngle();

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    ctx.fillStyle = colour;
    // ctx.fillStyle = "transparent";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.3 / scale;

    // console.log("=========>type", type);

    if (type === "polygon") {
      ctx.beginPath();
      const vertices = shape.m_vertices;

      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.m_p.x, shape.m_p.y, shape.m_radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (type === "edge") {
      ctx.beginPath();
      ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
      ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
      ctx.stroke();
    } else if (type === "chain") {
      ctx.beginPath();
      const vertices = shape.m_vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}
