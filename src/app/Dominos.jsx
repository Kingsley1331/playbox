"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { drawBody } from "./helpers/rendering";

function Dominos() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    const pl = planck;

    const world = new pl.World(new Vec2(0, -10));

    // testbed.width = 40;
    // testbed.height = 40;

    const b1 = world.createBody();
    b1.createFixture(new pl.Edge(new Vec2(-40, 0), new Vec2(40, 0)), 0);

    let ground = world.createBody(new Vec2(-1.5, 10));
    ground.createFixture(new pl.Box(6, 0.25), 0);

    const columnShape = new pl.Box(0.1, 1);

    let fd = {};
    fd.density = 20;
    fd.friction = 0.1;

    for (let i = 0; i < 10; ++i) {
      const body = world.createDynamicBody(new Vec2(-6 + 1 * i, 11.25));
      body.createFixture(columnShape, fd);
    }

    ground = world.createBody(new Vec2(1, 6));
    ground.createFixture(new pl.Box(7, 0.25, new Vec2(), 0.3), 0);

    const b2 = world.createBody(new Vec2(-7, 4));
    b2.createFixture(new pl.Box(0.25, 1.5), 0);

    const b3 = world.createDynamicBody(new Vec2(-0.9, 1), -0.15);
    b3.createFixture(new pl.Box(6, 0.125), 10);

    const jd = {};
    jd.collideConnected = true;
    world.createJoint(new pl.RevoluteJoint(jd, b1, b3, new Vec2(-2, 1)));

    const b4 = world.createDynamicBody(new Vec2(-10, 15));
    b4.createFixture(new pl.Box(0.25, 0.25), 10);

    world.createJoint(new pl.RevoluteJoint(jd, b2, b4, new Vec2(-7, 15)));

    const b5 = world.createDynamicBody(new Vec2(6.5, 3));

    fd = {};
    fd.density = 10;
    fd.friction = 0.1;

    b5.createFixture(new pl.Box(1, 0.1, new Vec2(0, -0.9), 0), fd);
    b5.createFixture(new pl.Box(0.1, 1, new Vec2(-0.9, 0), 0), fd);
    b5.createFixture(new pl.Box(0.1, 1, new Vec2(0.9, 0), 0), fd);

    world.createJoint(new pl.RevoluteJoint(jd, b1, b5, new Vec2(6, 2)));

    const b6 = world.createDynamicBody(new Vec2(6.5, 4.1));
    b6.createFixture(new pl.Box(1, 0.1), 30);

    world.createJoint(new pl.RevoluteJoint(jd, b5, b6, new Vec2(7.5, 4)));

    const b7 = world.createDynamicBody(new Vec2(7.4, 1));
    b7.createFixture(new pl.Box(0.1, 1), 10);

    world.createJoint(
      new pl.DistanceJoint({
        bodyA: b3,
        localAnchorA: new Vec2(6, 0),
        bodyB: b7,
        localAnchorB: new Vec2(0, -1),
      })
    );

    const radius = 0.2;
    const circleShape = new pl.Circle(radius);
    for (let i = 0; i < 4; ++i) {
      const body = world.createDynamicBody(new Vec2(5.9 + 2 * radius * i, 2.4));
      body.createFixture(circleShape, 10);
    }

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 30;

    function render() {
      world.step(1 / fps);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Setup transform
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height);
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
  }, [fps]);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #333" }}
        onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
      />
    </div>
  );
}

export default Dominos;
