"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import planck, { Vec2 } from "planck";
import { render } from "./rendering";
import { createWalls } from "../helpers/bodies";
import Navbar from "../components/Navbar";
import { mouseEvents } from "../helpers/utilities";
import { Scene } from "./World";
import { addFixture } from "./World";
import { setMode } from "../helpers/utilities";

const { scale } = Scene;

function Lab() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [carVanish, setCarVanish] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const carRef = useRef(null);
  const mouseJointRef = useRef(null);
  const selectedBodyRef = useRef(null);
  const [isBoxCreationMode, setIsBoxCreationMode] = useState(false);
  const [isPolylineMode, setIsPolylineMode] = useState(false);
  const [isCircleMode, setIsCircleMode] = useState(false);
  const [fixtureList, setFixtureList] = useState([]);

  // TODO: turn into custom hook
  const UpdateMode = useCallback((mode) => {
    setIsPolylineMode(false);
    setIsCircleMode(false);
    setIsBoxCreationMode(false);
    setIsPlaying(false);
    if (mode === Scene.mode) {
      Scene.mode = "";
      return;
    }

    setMode(mode);
    if (mode === "polyline") {
      setIsPolylineMode(true);
    } else if (mode === "circle") {
      setIsCircleMode(true);
    } else if (mode === "box") {
      setIsBoxCreationMode(true);
    } else if (mode === "playing") {
      setIsPlaying(true);
    }
  }, []);

  const world = Scene.world;

  const pl = planck;
  // useEffect(() => {
  //   if (carRef && carVanish) {
  //     worldRef.current.destroyBody(carRef.current);
  //   }
  // }, [carVanish]);

  useEffect(() => {
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
      const fixture = box.createFixture(new pl.Box(boxSize, boxSize), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.1,
      });
      addFixture(fixture);
    }

    let car = null;

    const fixture = world
      .createDynamicBody(new Vec2(10, -10))
      .createFixture(new pl.Box(2, 2), 5.0);
    addFixture(fixture);

    const fixture2 = world
      .createDynamicBody(new Vec2(10, -15))
      .createFixture(new pl.Box(2, 2), 5.0);
    addFixture(fixture2);

    const fixture3 = world
      .createBody(new Vec2(13, -20))
      .createFixture(new pl.Box(2, 2), 5.0);

    addFixture(fixture3);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctxRef.current = ctx;

    const mouse = mouseEvents(canvas, setMousePos);

    createWalls(world, canvas);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //delete body or joint
    // world.destroyBody(container2);
    // world.destroyJoint(leftJoint);

    // Car parameters
    const carX = 20;
    const carY = -50;
    const carWidth = 2 * 4;
    const carHeight = 0.5;

    car = world.createDynamicBody(new Vec2(carX, carY));
    carRef.current = car;

    const fixture4 = car.createFixture(new pl.Box(carWidth, carHeight), {
      density: 1,
      friction: 0.3,
      restitution: 0.1,
    });
    addFixture(fixture4);

    // Wheels
    const wheelRadius = 0.4;
    const wheelOffsetX = 1.0;
    const wheelOffsetY = -0.5;
    const wheelDensity = 1.0;

    const leftWheel = world.createDynamicBody(
      new Vec2(carX - wheelOffsetX, carY + wheelOffsetY)
    );
    const fixture5 = leftWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    addFixture(fixture5);

    const rightWheel = world.createDynamicBody(
      new Vec2(carX + wheelOffsetX, carY + wheelOffsetY)
    );
    const fixture6 = rightWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });
    addFixture(fixture6);

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

  useEffect(() => {
    render(world, ctxRef, canvasRef, { x: 0, y: 0 });
  }, [fixtureList, world]);

  const handlePauseToggle = () => {
    render(world, ctxRef, canvasRef, { x: 0, y: 0 });
  };

  const createPolylineBox = useCallback(
    (world, x, y) => {
      const boxSize = 0.5;
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

      const polygonShape = new pl.Polygon(vertices);
      const fixture = body.createFixture(polygonShape, {
        density: 1.0,
        friction: 0.3,
        restitution: 0.2,
      });
      addFixture(fixture);
      setFixtureList((fixtureList) => [...fixtureList, body]);
      return body;
    },
    [pl]
  );

  const createPolylineShape = useCallback((points) => {
    if (!world || points.length < 3) return;

    const body = world.createDynamicBody({
      position: new Vec2(0, 0), // TODO: we need to set the position to the center of the polygon
      angularDamping: 0.5,
    });

    const polygonShape = new pl.Polygon(points);

    const fixture = body.createFixture(polygonShape, {
      density: 1.0,
      friction: 0.3,
      restitution: 0.2,
    });

    addFixture(fixture);

    return body;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleCanvasClick = (e) => {
      if (!isBoxCreationMode || !world) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / -scale;
      createPolylineBox(world, x, y);
    };

    canvas.addEventListener("click", handleCanvasClick);
    return () => canvas.removeEventListener("click", handleCanvasClick);
  }, [isBoxCreationMode, createPolylineBox, world]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleCanvasClick = (e) => {
      if (!isPolylineMode && !isCircleMode) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / -scale;

      if (isCircleMode) {
        // create circle
        const circle = world.createDynamicBody({
          position: new Vec2(x, y),
        });
        const fixture = circle.createFixture(new pl.Circle(0.5), {
          density: 1.0,
          friction: 0.3,
          restitution: 0.2,
        });
        addFixture(fixture);

        setFixtureList((fixtureList) => [...fixtureList, circle]);
      } else {
        // setPolylinePoints((prev) => [...prev, new Vec2(x, y)]);
        Scene.polylinePoints = [...Scene.polylinePoints, new Vec2(x, y)];
      }
    };

    const handleDoubleClick = (e) => {
      if (!isPolylineMode || Scene.polylinePoints < 3) return;

      const polyline = createPolylineShape(Scene.polylinePoints);
      setFixtureList((fixtureList) => [...fixtureList, polyline]);

      Scene.polylinePoints = [];
      setIsPolylineMode(false);
      UpdateMode("");
    };

    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [isPolylineMode, createPolylineShape, isCircleMode]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx || !Scene.polylinePoints.length) return;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.scale(scale, -scale);
    ctx.lineWidth = 0.5 / scale;

    ctx.moveTo(Scene.polylinePoints[0].x, Scene.polylinePoints[0].y);
    for (let i = 1; i < Scene.polylinePoints.length; i++) {
      ctx.lineTo(Scene.polylinePoints[i].x, Scene.polylinePoints[i].y);
    }
    ctx.lineTo(mousePos.x, -mousePos.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.restore();
  }, [mousePos]);

  return (
    <div>
      <Navbar />
      <div className="flex gap-2">
        <button
          onClick={() => {
            UpdateMode("playing");
            handlePauseToggle();
          }}
          className={`px-4 py-2 rounded ${
            Scene.mode === "paused"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            UpdateMode("box");
          }}
          className={`px-4 py-2 rounded ${
            isBoxCreationMode
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          Create Box
        </button>
        <button
          onClick={() => {
            UpdateMode("circle");
          }}
          className={`px-4 py-2 rounded ${
            isCircleMode ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          Create Circle
        </button>
        <button
          onClick={() => {
            setIsPolylineMode(!isPolylineMode);
            UpdateMode("polyline");
            render(world, ctxRef, canvasRef, { x: 0, y: 0 });
          }}
          className={`px-4 py-2 rounded ${
            isPolylineMode
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {isPolylineMode
            ? `Creating Shape (${isPolylineMode} points)`
            : "Create Polyline Shape"}
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
