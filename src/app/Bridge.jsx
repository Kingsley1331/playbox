"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { drawBody } from "./helpers/rendering";

function Bridge() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    const pl = planck;

    const world = new pl.World(new Vec2(0, -4));

    const COUNT = 30;

    let middle;

    const ground = world.createBody();
    ground.createFixture(
      new pl.Edge(new Vec2(-40.0, 0.0), Vec2(40.0, 0.0)),
      0.0
    );

    const bridgeRect = new pl.Box(0.5, 0.125);

    const bridgeFD = {
      density: 20.0,
      friction: 0.2,
    };

    let prevBody = ground;
    for (var i = 0; i < COUNT; ++i) {
      var body = world.createDynamicBody(new Vec2(-14.5 + 1.0 * i, 5.0));
      body.createFixture(bridgeRect, bridgeFD);

      const anchor = new Vec2(-15.0 + 1.0 * i, 5.0);
      world.createJoint(new pl.RevoluteJoint({}, prevBody, body, anchor));

      if (i * 2 === COUNT) {
        middle = body;
      }
      prevBody = body;
    }

    const anchor = new Vec2(-15.0 + 1.0 * COUNT, 5.0);
    world.createJoint(new pl.RevoluteJoint({}, prevBody, ground, anchor));

    for (let i = 0; i < 2; ++i) {
      const body = world.createDynamicBody(new Vec2(-8.0 + 8.0 * i, 12.0));

      const vertices = [Vec2(-0.5, 0.0), new Vec2(0.5, 0.0), Vec2(0.0, 1.5)];
      body.createFixture(new pl.Polygon(vertices), 1.0);
    }

    const shape = new pl.Circle(0.5);
    for (let i = 0; i < 3; ++i) {
      const body = world.createDynamicBody(Vec2(-6.0 + 6.0 * i, 10.0));
      body.createFixture(shape, 1.0);
    }

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 25;

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

export default Bridge;
