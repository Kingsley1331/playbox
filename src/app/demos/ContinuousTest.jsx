"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function ContinuousTest() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = pl.World(Vec2(0, -10));

    var stats = pl.internal.stats;

    var bullet;
    var angularVelocity;

    var ground = world.createBody(Vec2(0.0, 0.0));

    ground.createFixture(pl.Edge(Vec2(-10.0, 0.0), Vec2(10.0, 0.0)), 0.0);
    ground.createFixture(pl.Box(0.2, 1.0, Vec2(0.5, 1.0), 0.0), 0.0);

    if (1) {
      // angle = 0.1;
      bullet = world.createDynamicBody(Vec2(0.0, 20.0));
      bullet.createFixture(pl.Box(2.0, 0.1), 1.0);

      angularVelocity = pl.Math.random(-50.0, 50.0);
      // angularVelocity = 46.661274;
      bullet.setLinearVelocity(Vec2(0.0, -100.0));
      bullet.setAngularVelocity(angularVelocity);
    } else {
      var shape = pl.Circle(0.5);

      var body = world.createDynamicBody(Vec2(0.0, 2.0));
      body.createFixture(shape, 1.0);

      var body = world.createDynamicBody({
        bullet: true,
        position: Vec2(0.0, 2.0),
      });
      body.createFixture(shape, 1.0);
      body.setLinearVelocity(Vec2(0.0, -100.0));
    }

    function Launch() {
      stats.gjkCalls = 0;
      stats.gjkIters = 0;
      stats.gjkMaxIters = 0;

      stats.toiCalls = 0;
      stats.toiIters = 0;
      stats.toiRootIters = 0;
      stats.toiMaxRootIters = 0;
      stats.toiTime = 0.0;
      stats.toiMaxTime = 0.0;

      bullet.setTransform(Vec2(0.0, 20.0), 0.0);
      angularVelocity = pl.Math.random(-50.0, 50.0);
      bullet.setLinearVelocity(Vec2(0.0, -100.0));
      bullet.setAngularVelocity(angularVelocity);
    }

    Launch();

    // var stepCount = 0;
    // testbed.step = function () {
    //   testbed.status(stats);

    //   if (stats.gjkCalls > 0) {
    //     // "gjk calls = %d, ave gjk iters = %3.1, max gjk iters = %d", stats.gjkCalls, stats.gjkIters / float32(stats.gjkCalls), stats.gjkMaxIters
    //   }

    //   if (stats.toiCalls > 0) {
    //     // "toi calls = %d, ave [max] toi iters = %3.1 [%d]", stats.toiCalls, stats.toiIters / float32(stats.toiCalls), stats.toiMaxRootIters
    //     // "ave [max] toi root iters = %3.1 [%d]", stats.toiRootIters / float32(stats.toiCalls), stats.toiMaxRootIters
    //     // "ave [max] toi time = %.1 [%.1] (microseconds)", 1000.0 * stats.toiTime / float32(stats.toiCalls), 1000.0 * stats.toiMaxTime
    //   }

    //   if (stepCount++ % 60 == 0) {
    //     Launch();
    //   }
    // };

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

export default ContinuousTest;
