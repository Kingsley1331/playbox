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
    var pl = planck;

    var world = new pl.World(Vec2(0, -10));

    var ground = world.createBody();

    var groundFD = {
      filterCategoryBits: 2,
      filterMaskBits: 0xffff,
      filterGroupIndex: 0,
    };
    ground.createFixture(pl.Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)), groundFD);

    var rotator = world.createDynamicBody(Vec2(-10.0, 20.0));
    rotator.createFixture(pl.Circle(0.5), 5.0);

    var w = 100.0;
    rotator.setAngularVelocity(w);
    rotator.setLinearVelocity(Vec2(-8.0 * w, 0.0));

    var joint = world.createJoint(
      pl.RevoluteJoint(
        {
          motorSpeed: 1.0 * Math.PI,
          maxMotorTorque: 10000.0,
          enableMotor: true,
          lowerAngle: -0.25 * Math.PI,
          upperAngle: 0.5 * Math.PI,
          enableLimit: false,
          collideConnected: true,
        },
        ground,
        rotator,
        Vec2(-10.0, 12.0)
      )
    );

    var ball = world.createDynamicBody(Vec2(5.0, 30.0));
    ball.createFixture(pl.Circle(3.0), {
      density: 5.0,
      // filterMaskBits: 1,
    });

    var platform = world.createBody({
      position: Vec2(20.0, 10.0),
      type: "dynamic",
      bullet: true,
    });
    platform.createFixture(pl.Box(10.0, 0.2, Vec2(-10.0, 0.0), 0.0), 2.0);

    world.createJoint(
      pl.RevoluteJoint(
        {
          lowerAngle: -0.25 * Math.PI,
          upperAngle: 0.0 * Math.PI,
          enableLimit: true,
        },
        ground,
        platform,
        Vec2(20.0, 10.0)
      )
    );

    // Tests mass computation of a small object far from the origin
    var triangle = world.createDynamicBody();

    triangle.createFixture(
      pl.Polygon([Vec2(17.63, 36.31), Vec2(17.52, 36.69), Vec2(17.19, 36.36)]),
      1
    ); // assertion hits inside here

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 10;

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

export default Demo4;
