"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2, testbed } from "planck";
import { render } from "../helpers/rendering";

function Strandbeest() {
  const [fps, setFps] = useState(Infinity);
  const [motorSpeed, setMotorSpeed] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = new pl.World(Vec2(0, -10));
    const size = 1;

    const motorSpeedIncrement = 2.0;
    // var motorSpeed = 0;
    // var motorSpeed = 2.0;
    var motorOn = true;

    var offset = Vec2(0.0, 8.0);
    var pivot = Vec2(0.0, 0.8);

    // Ground
    var ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-50.0, 0.0), Vec2(50.0, 0.0)), 0.0);
    ground.createFixture(pl.Edge(Vec2(-50.0, 0.0), Vec2(-50.0, 10.0)), 0.0);
    ground.createFixture(pl.Edge(Vec2(50.0, 0.0), Vec2(50.0, 10.0)), 0.0);

    // Balls
    for (var i = 0; i < 40; ++i) {
      world
        .createDynamicBody(Vec2(-40.0 + 2.0 * i, 0.5))
        .createFixture(pl.Circle(0.25), 1.0);
    }

    // Chassis
    var chassis = world.createDynamicBody(Vec2.add(pivot, offset));
    chassis.createFixture(pl.Box(2.5, 1.0), {
      density: 1.0,
      filterGroupIndex: -1,
    });

    var wheel = world.createDynamicBody(Vec2.add(pivot, offset));
    wheel.createFixture(pl.Circle(1.6), {
      density: 1.0,
      filterGroupIndex: -1,
    });

    var motorjoint = world.createJoint(
      pl.RevoluteJoint(
        {
          collideConnected: false,
          motorSpeed,
          maxMotorTorque: 400.0,
          enableMotor: motorOn,
        },
        wheel,
        chassis,
        Vec2.add(pivot, offset)
      )
    );

    var wheelAnchor = Vec2(0.0, -0.8).add(pivot);

    CreateLeg(-1.0, wheelAnchor);
    CreateLeg(1.0, wheelAnchor);

    wheel.setTransform(wheel.getPosition(), (120.0 * Math.PI) / 180.0);
    CreateLeg(-1.0, wheelAnchor);
    CreateLeg(1.0, wheelAnchor);

    wheel.setTransform(wheel.getPosition(), (-120.0 * Math.PI) / 180.0);
    CreateLeg(-1.0, wheelAnchor);
    CreateLeg(1.0, wheelAnchor);

    function CreateLeg(s, wheelAnchor) {
      var p1 = Vec2(5.4 * s, -6.1);
      var p2 = Vec2(7.2 * s, -1.2);
      var p3 = Vec2(4.3 * s, -1.9);
      var p4 = Vec2(3.1 * s, 0.8);
      var p5 = Vec2(6.0 * s, 1.5);
      var p6 = Vec2(2.5 * s, 3.7);

      var poly1, poly2;
      if (s > 0.0) {
        poly1 = pl.Polygon([p1, p2, p3]);
        poly2 = pl.Polygon([Vec2(), Vec2.sub(p5, p4), Vec2.sub(p6, p4)]);
      } else {
        poly1 = pl.Polygon([p1, p3, p2]);
        poly2 = pl.Polygon([Vec2(), Vec2.sub(p6, p4), Vec2.sub(p5, p4)]);
      }

      var body1 = world.createDynamicBody({
        position: offset,
        angularDamping: 10.0,
      });
      body1.createFixture(poly1, {
        density: 1.0,
        filterGroupIndex: -1,
      });

      var body2 = world.createDynamicBody({
        position: Vec2.add(p4, offset),
        angularDamping: 10.0,
      });
      body2.createFixture(poly2, {
        density: 1.0,
        filterGroupIndex: -1,
      });

      // Using a soft distance constraint can reduce some jitter.
      // It also makes the structure seem a bit more fluid by
      // acting like a suspension system.
      var djd = {
        dampingRatio: 0.5,
        frequencyHz: 10.0,
      };
      world.createJoint(
        pl.DistanceJoint(
          djd,
          body1,
          body2,
          Vec2.add(p2, offset),
          Vec2.add(p5, offset)
        )
      );
      world.createJoint(
        pl.DistanceJoint(
          djd,
          body1,
          body2,
          Vec2.add(p3, offset),
          Vec2.add(p4, offset)
        )
      );
      world.createJoint(
        pl.DistanceJoint(
          djd,
          body1,
          wheel,
          Vec2.add(p3, offset),
          Vec2.add(wheelAnchor, offset)
        )
      );
      world.createJoint(
        pl.DistanceJoint(
          djd,
          body2,
          wheel,
          Vec2.add(p6, offset),
          Vec2.add(wheelAnchor, offset)
        )
      );

      world.createJoint(
        pl.RevoluteJoint({}, body2, chassis, Vec2.add(p4, offset))
      );
    }

    // function setMotorSpeed(speed) {
    //   springBack.setMotorSpeed(speed);
    //   springFront.setMotorSpeed(speed);
    // }

    // Keyboard controls
    function handleKeyDown(e) {
      e.preventDefault();
      if (e.code === "ArrowUp") {
        console.log("e", e.code);
        // Increase forward speed
        // motorSpeed += motorSpeedIncrement;
        setMotorSpeed((motorSpeed) => motorSpeed + motorSpeedIncrement);
        // setMotorSpeed(motorSpeed);
      } else if (e.code === "ArrowDown") {
        // Reverse
        // motorSpeed -= motorSpeedIncrement;
        setMotorSpeed((motorSpeed) => motorSpeed - motorSpeedIncrement);
        // setMotorSpeed(motorSpeed);
      } else if (e.code === "ArrowLeft") {
        // Nudge car to the left
        chassis.applyLinearImpulse(
          new Vec2(-5 * size, 0),
          chassis.getWorldCenter(),
          true
        );
      } else if (e.code === "ArrowRight") {
        // Nudge car to the right
        chassis.applyLinearImpulse(
          new Vec2(5 * size, 0),
          chassis.getWorldCenter(),
          true
        );
      }
    }

    console.log("motorSpeed", motorSpeed);

    window.addEventListener("keydown", handleKeyDown);
    // testbed.step = function () {
    //   if (testbed.activeKeys.right && testbed.activeKeys.left) {
    //     motorjoint.setMotorSpeed(0.0);
    //     motorjoint.enableMotor(false);
    //   } else if (testbed.activeKeys.right) {
    //     motorjoint.setMotorSpeed(motorSpeed);
    //     motorjoint.enableMotor(true);
    //   } else if (testbed.activeKeys.left) {
    //     motorjoint.setMotorSpeed(-motorSpeed);
    //     motorjoint.enableMotor(true);
    //   } else {
    //     motorjoint.setMotorSpeed(0.0);
    //     motorjoint.enableMotor(true);
    //   }

    //   if (wheel.getPosition().x > testbed.x + 10) {
    //     testbed.x = wheel.getPosition().x - 10;
    //   } else if (wheel.getPosition().x < testbed.x - 10) {
    //     testbed.x = wheel.getPosition().x + 10;
    //   }
    // };

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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fps, motorSpeed]);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={1600}
        height={600}
        style={{ border: "1px solid #333" }}
        onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
      />
    </div>
  );
}

export default Strandbeest;
