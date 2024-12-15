"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";

function FallingBox() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const pl = planck;
    const world = pl.World({ gravity: Vec2(0, -10) });

    // Create the ground body (static)
    const ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-20, 0), Vec2(20, 0)), 0.0);

    // Create a dynamic body for the falling box
    const boxBody = world.createBody({
      type: "dynamic",
      position: Vec2(0, 10), // starting 10 units above the ground
    });

    boxBody.createFixture(pl.Box(0.5, 0.5), {
      density: 1.0,
      friction: 0.3,
      restitution: 0.1,
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 20;
    const fps = 60;

    function render() {
      // Step the physics simulation
      world.step(1 / fps);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the ground
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(-20 * scale + canvas.width / 2, canvas.height - 0 * scale);
      ctx.lineTo(20 * scale + canvas.width / 2, canvas.height - 0 * scale);
      ctx.stroke();

      // Draw the box
      const pos = boxBody.getPosition();
      const angle = boxBody.getAngle();
      const half = 0.5 * scale;

      ctx.save();
      ctx.translate(
        canvas.width / 2 + pos.x * scale,
        canvas.height - pos.y * scale
      );
      ctx.rotate(-angle);
      ctx.fillStyle = "red";
      ctx.fillRect(-half, -half, half * 2, half * 2);
      ctx.restore();

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Cleanup function if needed (in this case, we just don't cancel)
    return () => {
      // If you want to handle cleanup, you can cancel animation here if stored.
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}

export default FallingBox;
