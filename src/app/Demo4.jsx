"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";

function Demo3() {
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
          center: Vec2(),
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
    const scale = 20;
    const fps = 60;

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
        drawBody(ctx, b);
      }

      ctx.restore();

      requestAnimationFrame(render);
    }

    function drawBody(ctx, body) {
      // console.log("body", body.getFixtureList());
      for (let f = body.getFixtureList(); f; f = f.getNext()) {
        const shape = f.getShape();
        const type = shape.getType();
        const pos = body.getPosition();
        const angle = body.getAngle();

        console.log("type", type);

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        ctx.fillStyle = "transparent";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1 / scale;
        // console.log("shape.m_vertices", shape.m_vertices);

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
        }

        ctx.restore();
      }
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={3000}
        height={3000}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}

export default Demo3;
