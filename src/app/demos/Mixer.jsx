"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function Demo4() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
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

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 10;

    render(world, ctx, scale, fps, canvas);
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

export default Demo4;
