"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";
// import { render } from "./render";

function Piston() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    const pl = planck;
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
      position: new Vec2(12.0, 20.0),
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

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 15;

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
