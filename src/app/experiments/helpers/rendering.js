"use client";
import { Scene } from "../World";

const { scale } = Scene;

export function render(
  world,
  translation = { x: canvas.width / 2, y: canvas.height / 2 }
) {
  const canvas = Scene.canvas.element;

  if (world && Scene.canvas.context) {
    const ctx = Scene.canvas.context;
    const frameRate = Scene.mode === "playing" ? 60 : Infinity;

    world?.step(1 / frameRate);
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Setup transform
    ctx.save();
    ctx.translate(translation.x, translation.y);
    ctx.scale(scale, -scale);

    // Draw all bodies
    for (let b = world?.getBodyList(); b; b = b.getNext()) {
      drawBody(ctx, b);
    }

    ctx.restore();

    if (Scene.polylinePoints.length > 0) {
      ctx.save();
      // Apply the same transforms as the main drawing
      ctx.translate(translation.x, translation.y);
      ctx.scale(scale, -scale);

      // Make the line more visible for debugging
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1 / scale;

      // Draw first point with a distinct circle
      ctx.beginPath();
      ctx.moveTo(Scene.polylinePoints[0].x, Scene.polylinePoints[0].y);

      // Start a new path for the line
      ctx.beginPath();
      ctx.moveTo(Scene.polylinePoints[0].x, Scene.polylinePoints[0].y);

      ctx.setLineDash([0.5, 0.5]); // Set dash pattern scaled to match world units
      for (let i = 0; i < Scene.polylinePoints.length; i++) {
        ctx.lineTo(Scene.polylinePoints[i].x, Scene.polylinePoints[i].y);
      }
      ctx.lineTo(Scene.mousePos.x, Scene.mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    if (Scene.mode === "playing") {
      requestAnimationFrame(() =>
        render(world, { x: translation.x, y: translation.y })
      );
    }
  }
}

export function drawBody(ctx, body) {
  const colour = "rgb(175, 224, 230, 0.8)";
  for (let f = body.getFixtureList(); f; f = f.getNext()) {
    const shape = f.getShape();
    const type = shape.getType();
    const pos = body.getPosition();
    const angle = body.getAngle();
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(angle);

    ctx.fillStyle = colour;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.3 / scale;

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

      // Draw vertices if body is selected
      // TODO: Reduce repetition of code
      if (body === Scene.dragAndDrop.selectedBody) {
        ctx.fillStyle = "black";
        vertices.forEach((vertex) => {
          ctx.beginPath();
          ctx.arc(vertex.x, vertex.y, 0.2, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    } else if (type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.m_p.x, shape.m_p.y, shape.m_radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw center point if body is selected
      // TODO: Reduce repetition of code
      if (body === Scene.dragAndDrop.selectedBody) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(shape.m_p.x, shape.m_p.y, 0.1, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else if (type === "edge") {
      ctx.beginPath();
      ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
      ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
      ctx.stroke();

      // Draw vertices if body is selected
      // TODO: Reduce repetition of code
      if (body === Scene.dragAndDrop.selectedBody) {
        ctx.fillStyle = "red";
        [shape.m_vertex1, shape.m_vertex2].forEach((vertex) => {
          ctx.beginPath();
          ctx.arc(vertex.x, vertex.y, 0.1, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    } else if (type === "chain") {
      ctx.beginPath();
      const vertices = shape.m_vertices;
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.stroke();

      // Draw vertices if body is selected
      // TODO: Reduce repetition of code
      if (body === Scene.dragAndDrop.selectedBody) {
        ctx.fillStyle = "green";
        vertices.forEach((vertex) => {
          ctx.beginPath();
          ctx.arc(vertex.x, vertex.y, 0.1, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }
    ctx.restore();
  }

  // Draw the bounding box and handles
  const aabb = getBodyAABB(body);
  // console.log("aabb", aabb);
  if (aabb && Scene.mode === "" && body === Scene.dragAndDrop.selectedBody) {
    const padding = 0.4;
    const handleHeight = 1.0;
    const handleRadius = 0.5;
    const resizeHandleSize = 0.6; // Size of resize handles

    // Calculate padded bounds
    const left = aabb.lowerBound.x - padding;
    const right = aabb.upperBound.x + padding;
    const top = aabb.upperBound.y + padding;
    const bottom = aabb.lowerBound.y - padding;

    ctx.save();
    // Draw bounding box
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1 / scale;
    ctx.setLineDash([0.5, 0.5]);
    ctx.beginPath();
    ctx.rect(left, bottom, right - left, top - bottom);
    ctx.stroke();

    // Draw resize handles at corners
    ctx.setLineDash([]);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";

    const corners = [
      { x: left, y: top, position: "topLeft" },
      { x: right, y: top, position: "topRight" },
      { x: right, y: bottom, position: "bottomRight" },
      { x: left, y: bottom, position: "bottomLeft" },
    ];

    body.resizeHandles = {};
    corners.forEach((corner) => {
      ctx.beginPath();
      ctx.rect(
        corner.x - resizeHandleSize / 2,
        corner.y - resizeHandleSize / 2,
        resizeHandleSize,
        resizeHandleSize
      );
      ctx.fill();
      ctx.stroke();

      // Store handle positions for hit testing
      body.resizeHandles[corner.position] = {
        x: corner.x,
        y: corner.y,
        size: resizeHandleSize,
      };
    });

    // Draw rotation handle
    const handleX = (left + right) / 2;
    const handleTopY = top + handleHeight;

    ctx.beginPath();
    ctx.moveTo(handleX, top);
    ctx.lineTo(handleX, handleTopY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(handleX, handleTopY, handleRadius, 0, 2 * Math.PI);
    ctx.stroke();

    body.rotationHandle = {
      x: handleX,
      y: handleTopY,
      radius: handleRadius,
    };

    ctx.restore();
  }
}

export function getBodyAABB(body) {
  let aabb = null;

  // Loop through all fixtures of the body
  for (
    let fixture = body.getFixtureList();
    fixture;
    fixture = fixture.getNext()
  ) {
    const shape = fixture.getShape();
    const transform = body.getTransform();
    const shapeAABB = fixture.getAABB(0); // Get AABB directly from fixture

    if (!aabb) {
      aabb = shapeAABB;
    } else {
      // Combine AABBs
      aabb.combine(shapeAABB);
    }
  }

  return aabb;
}
