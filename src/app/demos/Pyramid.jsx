"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function Pyramid() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = new pl.World(Vec2(0, -10));

    var COUNT = 20;

    var ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)), 0.0);

    var a = 0.5;
    var box = pl.Box(a, a);

    var x = Vec2(-7.0, 0.75);
    var y = Vec2();
    var deltaX = Vec2(0.5625, 1.25);
    var deltaY = Vec2(1.125, 0.0);

    for (var i = 0; i < COUNT; ++i) {
      y.set(x);
      for (var j = i; j < COUNT; ++j) {
        world.createDynamicBody(y).createFixture(box, 5.0);

        y.add(deltaY);
      }
      x.add(deltaX);
    }

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

export default Pyramid;
