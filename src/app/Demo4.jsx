"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";
import { drawBody, render } from "./helpers/rendering";

function Demo4() {
  const canvasRef = useRef(null);
  const fps = 60;

  useEffect(() => {
    const pl = planck;
    const world = new pl.World(new Vec2(0, -10));
    const container = world.createKinematicBody();

    container.createFixture(new pl.Edge(new Vec2(15, -5), new Vec2(25, 5)));
    container.createFixture(new pl.Circle(new Vec2(-10, -10), 3));
    container.createFixture(new pl.Circle(new Vec2(10, 10), 3));
    container.createFixture(new pl.Box(3, 3, new Vec2(-10, 10)));
    container.createFixture(new pl.Box(3, 3, new Vec2(10, -10)));

    container.createFixture(
      new pl.Chain(
        [
          new Vec2(-20, -20),
          new Vec2(20, -20),
          new Vec2(20, 20),
          new Vec2(-20, 20),
        ],
        true
      )
    );

    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        const particle = world.createDynamicBody(new Vec2(i * 2, j * 2));
        particle.createFixture(
          Math.random() > 0.5 ? new pl.Circle(0.6) : new pl.Box(0.6, 0.4)
        );
        particle.setMassData({
          mass: 2,
          center: new Vec2(),
          I: 0.4,
        });
        particle.applyForceToCenter(
          new Vec2(pl.Math.random(-100, 100), pl.Math.random(-100, 100))
        );
      }
    }

    container.setAngularVelocity(0.3);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 10;

    function render() {
      world.step(1 / fps);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Setup transform
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(1, -1);
      ctx.scale(scale, scale);

      // Draw all bodies
      for (let b = world.getBodyList(); b; b = b.getNext()) {
        drawBody(ctx, b, scale);
      }

      ctx.restore();

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // requestAnimationFrame(() => render(world, fps, canvas, ctx, scale));
  }, []);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}

export default Demo4;
