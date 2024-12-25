"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "./helpers/rendering";
import { createWalls } from "./helpers/bodies";
import Navbar from "./components/Navbar";

function HomePage() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);
  const [carVanish, setCarVanish] = useState(false);

  const pl = planck;
  const world = new pl.World(new Vec2(0, -10));
  let car = null;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 20;

    createWalls(world, canvas, scale);

    world
      .createDynamicBody(new Vec2(10, -10))
      .createFixture(new pl.Box(2, 2), 5.0);

    world
      .createDynamicBody(new Vec2(10, -15))
      .createFixture(new pl.Box(2, 2), 5.0);

    world
      .createDynamicBody(new Vec2(12, -20))
      .createFixture(new pl.Box(2, 2), 5.0);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Car parameters
    const carX = 20;
    const carY = -50;
    const carWidth = 2;
    const carHeight = 0.5;

    car = world.createDynamicBody(new Vec2(carX, carY));

    car.createFixture(new pl.Box(carWidth, carHeight), {
      density: 1,
      friction: 0.3,
      restitution: 0.1,
    });

    // Wheels
    const wheelRadius = 0.4;
    const wheelOffsetX = 1.0;
    const wheelOffsetY = -0.5;
    const wheelDensity = 1.0;

    const leftWheel = world.createDynamicBody(
      new Vec2(carX - wheelOffsetX, carY + wheelOffsetY)
    );

    leftWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    const rightWheel = world.createDynamicBody(
      new Vec2(carX + wheelOffsetX, carY + wheelOffsetY)
    );

    rightWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    // Enable motors so we can control wheels
    const maxMotorTorque = 80;
    const motorSpeed = -80;
    const leftJoint = world.createJoint(
      new pl.RevoluteJoint(
        {
          enableMotor: true,
          motorSpeed,
          maxMotorTorque,
        },
        car,
        leftWheel,
        leftWheel.getPosition()
      )
    );

    const rightJoint = world.createJoint(
      new pl.RevoluteJoint(
        {
          enableMotor: true,
          motorSpeed,
          maxMotorTorque,
        },
        car,
        rightWheel,
        rightWheel.getPosition()
      )
    );

    // Stack of boxes
    const stackX = 90;
    const boxSize = 1;
    const numBoxes = 5;
    for (let i = 0; i < numBoxes; i++) {
      const box = world.createBody({
        type: "dynamic",
        position: new Vec2(
          stackX,
          boxSize / 2 + i * (boxSize * 2) - canvas.height / scale
        ),
      });
      box.createFixture(new pl.Box(boxSize, boxSize), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.1,
      });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const pivotHeight = -40;

    const pivot = world.createBody(new Vec2(100, pivotHeight));

    const pendulum = world.createDynamicBody(new Vec2(100, pivotHeight + 3));

    pendulum.createFixture(new pl.Box(8.0, 1.0), {
      density: 1,
      friction: 0,
      restitution: 0.1,
    });
    // pendulum.createFixture(new pl.Box(4.0, 1.0), 2.0);

    world.createJoint(
      new pl.RevoluteJoint({}, pivot, pendulum, new Vec2(88, pivotHeight + 3))
    );

    console.log("Pendulum type", pendulum.getFixtureList());

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const size = 5;
    const polygon = world.createBody(new Vec2(50, -50));
    polygon.createFixture(
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
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const bottom = new pl.Box(1.5, 0.15);
    const left = new pl.Box(0.15, 2.7, new Vec2(-1.45, 2.35), 0.2);
    const right = new pl.Box(0.15, 2.7, new Vec2(1.45, 2.35), -0.2);

    const container = world.createDynamicBody(new Vec2(50, -40));
    container.createFixture(bottom, 4.0);
    container.createFixture(left, 4.0);
    container.createFixture(right, 4.0);

    const bottom2 = new pl.Box(1.5, 0.15);
    const left2 = new pl.Box(0.15, 2.7, new Vec2(-2, 4), 0.2);
    const right2 = new pl.Box(0.15, 2.7, new Vec2(2, 4), -0.2);

    const container2 = world.createDynamicBody(new Vec2(60, -40));
    container2.createFixture(bottom2, 4.0);
    container2.createFixture(left2, 4.0);
    container2.createFixture(right2, 4.0);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //delete body or joint
    // world.destroyBody(container2);
    // world.destroyJoint(leftJoint);

    // if (car && carVanish) {
    //   console.log("Car vanished");
    //   world.destroyBody(car);
    // }

    render(world, ctx, scale, fps, canvas, {
      x: 0,
      y: 0,
    });
  }, [fps /*carVanish*/]);

  // Detect collisions

  world.on("begin-contact", (contact) => {
    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();

    const bodyA = fixtureA.getBody();
    const bodyB = fixtureB.getBody();

    if (bodyA === car || bodyB === car) {
      // console.log("bodaA", bodyA);
      console.log("Car collided with something");
      setCarVanish(true);
    }
  });

  return (
    <div>
      <Navbar />
      <div className="m-3 w-fit">
        <canvas
          ref={canvasRef}
          width={2400}
          height={1200}
          style={{ border: "1px solid #333" }}
          onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
        />
      </div>
    </div>
  );
}

export default HomePage;
