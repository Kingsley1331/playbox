"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function Chain() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = pl.World(Vec2(0, -10));

    var ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)), 0.0);

    var shape = pl.Box(0.6, 0.125);

    var y = 25.0;
    var prevBody = ground;
    for (var i = 0; i < 30; ++i) {
      var body = world.createDynamicBody(Vec2(0.5 + i, y));
      body.createFixture(shape, {
        density: 20.0,
        friction: 0.2,
      });

      var anchor = Vec2(i, y);
      world.createJoint(
        pl.RevoluteJoint(
          {
            collideConnected: false,
          },
          prevBody,
          body,
          anchor
        )
      );

      prevBody = body;
    }

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 13;

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

export default Chain;
