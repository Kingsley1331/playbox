"use client";
import { Scene } from "./World";
console.log("rendering123");
export function render2(
  world,
  ctxRef,
  scale,
  canvasRef,
  translation = { x: canvas.width / 2, y: canvas.height / 2 },
  isPausedRef
) {
  const canvas = canvasRef.current;

  if (world && ctxRef.current) {
    // const world = worldRef.current;
    const ctx = ctxRef.current;
    const frameRate = isPausedRef.current ? Infinity : 60;

    world?.step(1 / frameRate);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Setup transform
    ctx.save();
    ctx.translate(translation.x, translation.y);
    ctx.scale(scale, -scale);

    // Draw all bodies
    for (let b = world?.getBodyList(); b; b = b.getNext()) {
      drawBody(ctx, b, scale);
    }

    ctx.restore();

    if (Scene.polylinePoints.length > 0) {
      // console.log("Number of points:", Scene.polylinePoints.length);

      ctx.save();
      // Apply the same transforms as the main drawing
      ctx.translate(translation.x, translation.y);
      ctx.scale(scale, -scale);

      // Make the line more visible for debugging
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1 / scale;

      // Draw first point with a distinct circle
      ctx.beginPath();
      // console.log("First point:", Scene.polylinePoints[0]);
      ctx.moveTo(Scene.polylinePoints[0].x, Scene.polylinePoints[0].y);

      // Start a new path for the line
      ctx.beginPath();
      ctx.moveTo(Scene.polylinePoints[0].x, Scene.polylinePoints[0].y);

      ctx.setLineDash([0.5, 0.5]); // Set dash pattern scaled to match world units
      for (let i = 0; i < Scene.polylinePoints.length; i++) {
        ctx.lineTo(Scene.polylinePoints[i].x, Scene.polylinePoints[i].y);
      }
      ctx.lineTo(Scene.mousePos.x, -Scene.mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash pattern
      ctx.restore();
    }

    // if (!isPausedRef.current) {
    requestAnimationFrame(() =>
      render2(
        world,
        ctxRef,
        scale,
        canvasRef,
        { x: translation.x, y: translation.y },
        isPausedRef
      )
    );
    // }
  }
}

export function drawBody(ctx, body, scale) {
  // console.log("Scene.fixtures", Scene.fixtures);
  const colour = "rgb(175, 224, 230, 0.8)";
  // console.log("Scene.fixtures[0]", Scene.fixtures[0]);
  // const colour = "rgba(196, 203, 2000, 0.5)";
  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    // for (let f of Scene.fixtures) {
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
      // console.log("=========>polygon");
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
      // console.log("=========>circle");
      ctx.beginPath();
      ctx.arc(shape.m_p.x, shape.m_p.y, shape.m_radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (type === "edge") {
      // console.log("=========>edge");
      ctx.beginPath();
      ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
      ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
      ctx.stroke();
    } else if (type === "chain") {
      // console.log("=========>chain");
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
