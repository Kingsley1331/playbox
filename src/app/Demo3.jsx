"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";

function Demo3() {
  const canvasRef = useRef(null);
  const fps = 60;

  useEffect(() => {
    // planck.testbed("BasicSliderCrank", function (testbed) {
    const pl = planck;
    // Vec2 = pl.Vec2;
    const world = new pl.World(new Vec2(0, -10));

    const ground = world.createBody(new Vec2(0.0, 17.0));

    // Define crank.
    const crank = world.createDynamicBody(new Vec2(-8.0, 20.0));
    crank.createFixture(new pl.Box(4.0, 1.0), 2.0);
    world.createJoint(
      new pl.RevoluteJoint({}, ground, crank, new Vec2(-12.0, 20.0))
    );

    // Define connecting rod
    const rod = world.createDynamicBody(new Vec2(4.0, 20.0));
    rod.createFixture(new pl.Box(8.0, 1.0), 2.0);
    world.createJoint(
      new pl.RevoluteJoint({}, crank, rod, new Vec2(-4.0, 20.0))
    );

    // Define piston
    const piston = world.createDynamicBody({
      fixedRotation: true,
      position: Vec2(12.0, 20.0),
    });
    piston.createFixture(new pl.Box(3.0, 3.0), 2.0);
    world.createJoint(
      new pl.RevoluteJoint({}, rod, piston, new Vec2(12.0, 20.0))
    );
    world.createJoint(
      new pl.PrismaticJoint(
        {},
        ground,
        piston,
        new Vec2(12.0, 17.0),
        new Vec2(1.0, 0.0)
      )
    );

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 40;
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
