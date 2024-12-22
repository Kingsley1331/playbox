"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2, testbed, Testbed } from "planck";
import { render } from "../helpers/rendering";

function Car() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }

    testbed.speed = 1.3;
    testbed.hz = 50;

    var pl = planck;

    var world = new pl.World({
      gravity: Vec2(0, -10),
    });

    // wheel spring settings
    var HZ = 4.0;
    var ZETA = 0.7;
    var SPEED = 50.0;

    var ground = world.createBody();

    var groundFD = {
      density: 0.0,
      friction: 0.6,
    };

    ground.createFixture(pl.Edge(Vec2(-20.0, 0.0), Vec2(20.0, 0.0)), groundFD);

    var hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0];

    var x = 20.0,
      y1 = 0.0,
      dx = 5.0;

    for (var i = 0; i < 10; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }

    for (var i = 0; i < 10; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }

    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);

    x += 80.0;
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);

    x += 40.0;
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 10.0, 5.0)), groundFD);

    x += 20.0;
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);

    x += 40.0;
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x, 20.0)), groundFD);

    // Teeter
    var teeter = world.createDynamicBody(Vec2(140.0, 1.0));
    teeter.createFixture(pl.Box(10.0, 0.25), 1.0);
    world.createJoint(
      pl.RevoluteJoint(
        {
          lowerAngle: (-8.0 * Math.PI) / 180.0,
          upperAngle: (8.0 * Math.PI) / 180.0,
          enableLimit: true,
        },
        ground,
        teeter,
        teeter.getPosition()
      )
    );

    teeter.applyAngularImpulse(100.0, true);

    // Bridge
    var bridgeFD = {};
    bridgeFD.density = 1.0;
    bridgeFD.friction = 0.6;

    var prevBody = ground;
    for (var i = 0; i < 20; ++i) {
      var bridgeBlock = world.createDynamicBody(Vec2(161.0 + 2.0 * i, -0.125));
      bridgeBlock.createFixture(pl.Box(1.0, 0.125), bridgeFD);

      world.createJoint(
        pl.RevoluteJoint(
          {},
          prevBody,
          bridgeBlock,
          Vec2(160.0 + 2.0 * i, -0.125)
        )
      );

      prevBody = bridgeBlock;
    }

    world.createJoint(
      pl.RevoluteJoint({}, prevBody, ground, Vec2(160.0 + 2.0 * i, -0.125))
    );

    // Boxes
    var box = pl.Box(0.5, 0.5);

    world.createDynamicBody(Vec2(230.0, 0.5)).createFixture(box, 0.5);

    world.createDynamicBody(Vec2(230.0, 1.5)).createFixture(box, 0.5);

    world.createDynamicBody(Vec2(230.0, 2.5)).createFixture(box, 0.5);

    world.createDynamicBody(Vec2(230.0, 3.5)).createFixture(box, 0.5);

    world.createDynamicBody(Vec2(230.0, 4.5)).createFixture(box, 0.5);

    // Car
    const size = 3;

    // const car = world.createBody({
    //   type: "dynamic",
    //   position: new Vec2(0.0, 1.0 * size),
    // });

    const car = world.createDynamicBody(new Vec2(0.0, 1.0 * size));
    car.createFixture(
      new pl.Polygon([
        new Vec2(-1.5 * size, -0.5 * size),
        new Vec2(1.5 * size, -0.5 * size),
        new Vec2(1.5 * size, 0.0 * size),
        new Vec2(0.0 * size, 0.9 * size),
        new Vec2(-1.15 * size, 0.9 * size),
        new Vec2(-1.5 * size, 0.2 * size),
      ]),
      1.0
    );

    var wheelFD = {};
    wheelFD.density = 1.0;
    wheelFD.friction = 0.9;

    var wheelBack = world.createDynamicBody(new Vec2(-1.0 * size, 0.35 * size));
    wheelBack.createFixture(new pl.Circle(0.4 * size), wheelFD);

    var wheelFront = world.createDynamicBody(new Vec2(1.0 * size, 0.4 * size));
    wheelFront.createFixture(new pl.Circle(0.4 * size), wheelFD);

    var springBack = world.createJoint(
      new pl.WheelJoint(
        {
          motorSpeed: 0.0,
          maxMotorTorque: 20.0,
          enableMotor: true,
          frequencyHz: HZ,
          dampingRatio: ZETA,
        },
        car,
        wheelBack,
        wheelBack.getPosition(),
        new Vec2(0.0, 1.0)
      )
    );

    var springFront = world.createJoint(
      new pl.WheelJoint(
        {
          motorSpeed: 0.0,
          maxMotorTorque: 10.0,
          enableMotor: false,
          frequencyHz: HZ,
          dampingRatio: ZETA,
        },
        car,
        wheelFront,
        wheelFront.getPosition(),
        new Vec2(0.0, 1.0)
      )
    );

    // Motor speed control variables
    let motorSpeed = 0;
    const motorSpeedIncrement = 2.0 * 100; // how much to change speed by per key press

    function setMotorSpeed(speed) {
      springBack.setMotorSpeed(speed);
      springFront.setMotorSpeed(speed);
    }

    // Keyboard controls
    function handleKeyDown(e) {
      e.preventDefault();
      if (e.code === "ArrowUp") {
        // Increase forward speed
        motorSpeed += motorSpeedIncrement;
        setMotorSpeed(motorSpeed);
      } else if (e.code === "ArrowDown") {
        // Reverse
        motorSpeed -= motorSpeedIncrement;
        setMotorSpeed(motorSpeed);
      } else if (e.code === "ArrowLeft") {
        // Nudge car to the left
        car.applyLinearImpulse(
          new Vec2(-5 * size, 0),
          car.getWorldCenter(),
          true
        );
      } else if (e.code === "ArrowRight") {
        // Nudge car to the right
        car.applyLinearImpulse(
          new Vec2(5 * size, 0),
          car.getWorldCenter(),
          true
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // testbed.keydown = function () {
    //   if (testbed.activeKeys.down) {
    //     HZ = Math.max(0.0, HZ - 1.0);
    //     springBack.setSpringFrequencyHz(HZ);
    //     springFront.setSpringFrequencyHz(HZ);
    //   } else if (testbed.activeKeys.up) {
    //     HZ += 1.0;
    //     springBack.setSpringFrequencyHz(HZ);
    //     springFront.setSpringFrequencyHz(HZ);
    //   }
    // };

    // testbed.step = function () {
    //   if (testbed.activeKeys.right && testbed.activeKeys.left) {
    //     springBack.setMotorSpeed(0);
    //     springBack.enableMotor(true);
    //   } else if (testbed.activeKeys.right) {
    //     springBack.setMotorSpeed(-SPEED);
    //     springBack.enableMotor(true);
    //   } else if (testbed.activeKeys.left) {
    //     springBack.setMotorSpeed(+SPEED);
    //     springBack.enableMotor(true);
    //   } else {
    //     springBack.setMotorSpeed(0);
    //     springBack.enableMotor(false);
    //   }

    //   var cp = car.getPosition();
    //   if (cp.x > testbed.x + 10) {
    //     testbed.x = cp.x - 10;
    //   } else if (cp.x < testbed.x - 10) {
    //     testbed.x = cp.x + 10;
    //   }
    // };

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 10;

    render(world, ctx, scale, fps, canvas, {
      x: 300,
      y: canvas.height / 2,
    });
  }, [fps]);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={3500}
        height={600}
        style={{ border: "1px solid #333" }}
        onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
      />
    </div>
  );
}

export default Car;
