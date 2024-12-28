"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render2 } from "../helpers/rendering";
import { createWalls } from "../helpers/bodies";
import Navbar from "../components/Navbar";
import { mouseEvents } from "../helpers/utilities";

function Lab() {
  //   console.log("==============================================>Lab");
  const scale = 20;
  const [fps, setFps] = useState(60);
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const ctxRef = useRef(null);
  const isPausedRef = useRef(false); // Track pause state in ref
  const [isPaused, setIsPaused] = useState(true);
  const [reset, setReset] = useState(false);
  const [carVanish, setCarVanish] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const carRef = useRef(null);
  const mouseJointRef = useRef(null);
  const selectedBodyRef = useRef(null);
  const [isBoxCreationMode, setIsBoxCreationMode] = useState(false);

  const pl = planck;
  useEffect(() => {
    if (carRef && carVanish) {
      worldRef.current.destroyBody(carRef.current);
    }
  }, [carVanish]);

  useEffect(() => {
    const world = new pl.World(new Vec2(0, -10));
    worldRef.current = world;

    // Add a ground body for the mouse joint
    const groundBody = world.createBody();

    // Stack of boxes
    const stackX = 90;
    const boxSize = 1;
    const numBoxes = 5;
    for (let i = 0; i < numBoxes; i++) {
      const box = world.createBody({
        type: "dynamic",
        position: new Vec2(
          stackX,
          boxSize / 2 + i * (boxSize * 2) - 1200 / scale
        ),
      });
      box.createFixture(new pl.Box(boxSize, boxSize), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.1,
      });
    }

    let car = null;

    world
      .createDynamicBody(new Vec2(10, -10))
      .createFixture(new pl.Box(2, 2), 5.0);

    world
      .createDynamicBody(new Vec2(10, -15))
      .createFixture(new pl.Box(2, 2), 5.0);

    world.createBody(new Vec2(13, -20)).createFixture(new pl.Box(2, 2), 5.0);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctxRef.current = ctx;

    const mouse = mouseEvents(canvas, scale, setMousePos);
    console.log("mouse", mouse);

    createWalls(world, canvas, scale);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //delete body or joint
    // world.destroyBody(container2);
    // world.destroyJoint(leftJoint);

    // Car parameters
    const carX = 20;
    const carY = -50;
    const carWidth = 2;
    const carHeight = 0.5;

    car = world.createDynamicBody(new Vec2(carX, carY));
    carRef.current = car;

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

    render2(
      worldRef,
      ctxRef,
      scale,
      fps,
      canvasRef,
      {
        x: 0,
        y: 0,
      },
      isPausedRef
    );

    // Detect collisions
    world.on("begin-contact", (contact) => {
      console.log("Collided with something");
      const fixtureA = contact.getFixtureA();
      const fixtureB = contact.getFixtureB();

      const bodyA = fixtureA.getBody();
      const bodyB = fixtureB.getBody();

      if (bodyA === car || bodyB === car) {
        console.log("Car collided with something");
        setCarVanish(true);
      }
    });

    isPausedRef.current = true;

    // Update the mouse joint definition
    const md = {
      maxForce: 10000.0,
      frequencyHz: 5.0,
      dampingRatio: 0.9,
    };

    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / -scale;

      const aabb = new pl.AABB(
        new Vec2(x - 0.01, y - 0.01),
        new Vec2(x + 0.01, y + 0.01)
      );

      let selectedBody = null;
      world.queryAABB(aabb, (fixture) => {
        if (fixture.getBody().isDynamic()) {
          selectedBody = fixture.getBody();
          return false;
        }
        return true;
      });

      if (selectedBody) {
        selectedBodyRef.current = selectedBody;
        const mouseJoint = world.createJoint(
          new pl.MouseJoint(md, groundBody, selectedBody, new Vec2(x, y))
        );
        mouseJointRef.current = mouseJoint;
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (mouseJointRef.current) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / -scale;
        mouseJointRef.current.setTarget(new Vec2(x, y));
      }
    });

    canvas.addEventListener("mouseup", () => {
      if (mouseJointRef.current) {
        world.destroyJoint(mouseJointRef.current);
        mouseJointRef.current = null;
        selectedBodyRef.current = null;
      }
    });
  }, []);

  const handlePauseToggle = () => {
    isPausedRef.current = !isPausedRef.current;

    setIsPaused(!isPaused);

    if (!isPausedRef.current) {
      render2(
        worldRef,
        ctxRef,
        scale,
        fps,
        canvasRef,
        { x: 0, y: 0 },
        isPausedRef
      );
    }
  };

  const createPolylineBox = (world, x, y) => {
    const boxSize = 2; // Size of the box

    // Create vertices for a box
    const vertices = [
      new Vec2(-boxSize, -boxSize),
      new Vec2(boxSize, -boxSize),
      new Vec2(boxSize, boxSize),
      new Vec2(-boxSize, boxSize),
    ];

    const body = world.createDynamicBody({
      position: new Vec2(x, y),
      angularDamping: 0.5,
    });

    // Create a polygon shape instead of a chain
    const polygonShape = pl.Polygon(vertices);
    body.createFixture(polygonShape, {
      density: 1.0,
      friction: 0.3,
      restitution: 0.2,
    });

    return body;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleCanvasClick = (e) => {
      if (!isBoxCreationMode || !worldRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / -scale;
      createPolylineBox(worldRef.current, x, y);
    };

    canvas.addEventListener("click", handleCanvasClick);
    return () => canvas.removeEventListener("click", handleCanvasClick);
  }, [isBoxCreationMode, createPolylineBox]);

  return (
    <div>
      <Navbar />
      <div className="flex gap-2">
        <button
          onClick={handlePauseToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isPaused ? "Play" : "Pause"}
        </button>
        <button
          onClick={() => setIsBoxCreationMode(!isBoxCreationMode)}
          className={`px-4 py-2 rounded ${
            isBoxCreationMode
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          Create Box
        </button>
      </div>

      <div className="m-3 w-fit">
        X: {mousePos.x.toFixed(0)}, Y:{mousePos.y.toFixed(0)}
        <canvas
          ref={canvasRef}
          id="canvas"
          width={2400}
          height={1200}
          style={{ border: "1px solid #333" }}
        />
      </div>
    </div>
  );
}

export default Lab;
