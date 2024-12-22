"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function Piston() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;

    const Transform = pl.Transform;
    var world = new pl.World(new Vec2(0, -10));

    world
      .createBody(new Vec2(0.0, 0.0))
      .createFixture(
        new pl.Edge(new Vec2(50.0, 0.0), new Vec2(-50.0, 0.0)),
        0.0
      );

    var circle1 = new pl.Circle(new Vec2(-0.5, 0.5), 0.5);
    var circle2 = new pl.Circle(new Vec2(0.5, 0.5), 0.5);

    for (var i = 0; i < 10; ++i) {
      var body = world.createDynamicBody({
        position: new Vec2(pl.Math.random(-0.1, 0.1) + 5.0, 1.05 + 2.5 * i),
        angle: pl.Math.random(-Math.PI, Math.PI),
      });
      body.createFixture(circle1, 2.0);
      body.createFixture(circle2, 0.0);
    }

    var polygon1 = new pl.Box(0.25, 0.5);
    var polygon2 = new pl.Box(0.25, 0.5, new Vec2(0.0, -0.5), 0.5 * Math.PI);

    for (var i = 0; i < 10; ++i) {
      var body = world.createDynamicBody({
        position: new Vec2(pl.Math.random(-0.1, 0.1) - 5.0, 1.05 + 2.5 * i),
        angle: pl.Math.random(-Math.PI, Math.PI),
      });
      body.createFixture(polygon1, 2.0);
      body.createFixture(polygon2, 2.0);
    }

    var xf1 = new pl.Transform();
    xf1.q.set(0.3524 * Math.PI);
    xf1.p = xf1.q.getXAxis();

    var triangle1 = new pl.Polygon(
      [new Vec2(-1.0, 0.0), new Vec2(1.0, 0.0), new Vec2(0.0, 0.5)].map(
        Transform.mulFn(xf1)
      )
    );

    var xf2 = new pl.Transform();
    xf2.q.set(-0.3524 * Math.PI);
    xf2.p = new Vec2.neg(xf2.q.getXAxis());

    var triangle2 = new pl.Polygon(
      [new Vec2(-1.0, 0.0), new Vec2(1.0, 0.0), new Vec2(0.0, 0.5)].map(
        Transform.mulFn(xf2)
      )
    );

    for (var i = 0; i < 10; ++i) {
      var body = world.createDynamicBody({
        position: new Vec2(pl.Math.random(-0.1, 0.1), 2.05 + 2.5 * i),
        angle: 0.0,
      });
      body.createFixture(triangle1, 2.0);
      body.createFixture(triangle2, 2.0);
    }

    var bottom = new pl.Box(1.5, 0.15);
    var left = new pl.Box(0.15, 2.7, new Vec2(-1.45, 2.35), 0.2);
    var right = new pl.Box(0.15, 2.7, new Vec2(1.45, 2.35), -0.2);

    var container = world.createBody(new Vec2(0.0, 2.0));
    container.createFixture(bottom, 4.0);
    container.createFixture(left, 4.0);
    container.createFixture(right, 4.0);

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 20;

    render(world, ctx, scale, fps, canvas, {
      x: canvas.width / 2,
      y: canvas.height,
    });
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

export default Piston;
