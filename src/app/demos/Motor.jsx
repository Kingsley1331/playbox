"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2, Testbed } from "planck";
import { render } from "../helpers/rendering";

function Motor() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;

    var world = new pl.World(Vec2(0, -10));

    var time = 0;

    const testbed = Testbed.mount();

    var ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-20.0, 0.0), Vec2(20.0, 0.0)));

    // Define motorized body
    var body = world.createDynamicBody(Vec2(0.0, 8.0));
    body.createFixture(pl.Box(2.0, 0.5), {
      friction: 0.6,
      density: 2.0,
    });

    var joint = world.createJoint(
      pl.MotorJoint(
        {
          maxForce: 1000.0,
          maxTorque: 1000.0,
        },
        ground,
        body
      )
    );

    testbed.step = function (dt) {
      console.log("step", dt);
      // if (m_go && settings.hz > 0.0) {
      //   time += 1.0 / settings.hz;
      // }
      time += Math.min(dt, 100) / 1000;

      var linearOffset = Vec2();
      linearOffset.x = 6.0 * Math.sin(2.0 * time);
      linearOffset.y = 8.0 + 4.0 * Math.sin(1.0 * time);

      var angularOffset = 4.0 * time;

      joint.setLinearOffset(linearOffset);
      joint.setAngularOffset(angularOffset);
    };

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

export default Motor;
