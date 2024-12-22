"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function ConveyorBelt() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = new pl.World(new Vec2(0, -10));

    // Ground
    var ground = world.createBody();
    ground.createFixture(
      new pl.Edge(new Vec2(-20.0, 0.0), new Vec2(20.0, 0.0)),
      0.0
    );

    // Platform
    var platform = world
      .createBody(new Vec2(-5.0, 5.0))
      .createFixture(new pl.Box(10.0, 0.5), { friction: 0.8 });

    // Boxes
    for (let i = 0; i < 5; ++i) {
      world
        .createDynamicBody(new Vec2(-10.0 + 2.0 * i, 7.0))
        .createFixture(new pl.Box(0.5, 0.5), 20.0);
    }

    world.on("pre-solve", function (contact, oldManifold) {
      var fixtureA = contact.getFixtureA();
      var fixtureB = contact.getFixtureB();

      if (fixtureA == platform) {
        contact.setTangentSpeed(5.0);
      }

      if (fixtureB == platform) {
        contact.setTangentSpeed(-5.0);
      }
    });

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

export default ConveyorBelt;
