"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function Pulleys() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = new pl.World(Vec2(0, -10));

    var y = 16.0;
    var L = 12.0;
    var a = 1.0;
    var b = 2.0;

    var ground = world.createBody();

    // ground.createFixture(pl.Edge(Vec2(-40.0, 0.0), Vec2(40.0, 0.0)), 0.0);

    ground.createFixture(pl.Circle(Vec2(-10.0, y + b + L), 2.0), 0.0);
    ground.createFixture(pl.Circle(Vec2(10.0, y + b + L), 2.0), 0.0);

    var shape = pl.Box(a, b);

    // bd.fixedRotation = true;
    var box1 = world.createDynamicBody(Vec2(-10.0, y));
    box1.createFixture(shape, 5.0);

    var box2 = world.createDynamicBody(Vec2(10.0, y));
    box2.createFixture(shape, 5.0);

    var anchor1 = Vec2(-10.0, y + b);
    var anchor2 = Vec2(10.0, y + b);
    var groundAnchor1 = Vec2(-10.0, y + b + L);
    var groundAnchor2 = Vec2(10.0, y + b + L);

    var joint1 = world.createJoint(
      pl.PulleyJoint(
        {},
        box1,
        box2,
        groundAnchor1,
        groundAnchor2,
        anchor1,
        anchor2,
        1.5
      )
    );

    // testbed.step = function () {
    //   var ratio = joint1.getRatio();
    //   var L = joint1.getCurrentLengthA() + ratio * joint1.getCurrentLengthB();
    //   testbed.status("ratio", ratio);
    //   testbed.status("L (L1 * ratio + L2)", L);
    // };
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

export default Pulleys;

// Unable to render the ropes in the pulleys demo
