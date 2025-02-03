"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import planck, { Vec2 } from "planck";
import { render } from "./helpers/rendering";
import { createWalls } from "./helpers/bodies";
import Navbar from "../components/Navbar";
import { attachCanvasEvents, removeCanvasEvents } from "./helpers/utilities";
import {
  mouseDown,
  mouseUp,
  mouseMove,
  click,
  doubleClick,
} from "./events/canvas/handlers";
import { Scene } from "./World";
// import { addFixture } from "./World";
import { setMode } from "./helpers/utilities";

const { scale, canvas } = Scene;

function Lab() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [carVanish, setCarVanish] = useState(false);
  const [mousePosUI, setMousePosUI] = useState({ x: 0, y: 0 });
  const carRef = useRef(null);
  const boxRef = useRef(null);
  const boxRef2 = useRef(null);
  const [isBoxCreationMode, setIsBoxCreationMode] = useState(false);
  const [isPolylineMode, setIsPolylineMode] = useState(false);
  const [isCircleMode, setIsCircleMode] = useState(false);
  const [isPolygonMode, setIsPolygonMode] = useState(false);
  const [fixtureList, setFixtureList] = useState([]);
  const [isAddingFixture, setIsAddingFixture] = useState(false);
  const [polygonSides, setPolygonSides] = useState(3);
  const [rectangleMode, setRectangleMode] = useState(false);
  const mousePos = Scene.mousePos;

  // TODO: turn into custom hook
  const UpdateMode = useCallback((mode) => {
    setIsPolylineMode(false);
    setIsPolygonMode(false);
    setIsCircleMode(false);
    setIsBoxCreationMode(false);
    setRectangleMode(false);
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
    } else if (mode === "polygon") {
      setIsPolygonMode(true);
    } else if (mode === "box") {
      setIsBoxCreationMode(true);
    } else if (mode === "playing") {
      setIsPlaying(true);
    } else if (mode === "rectangle") {
      setRectangleMode(true);
    }
  }, []);

  const world = Scene.world;

  const circleRain = () => {
    for (let i = 0; i < 200; i++) {
      const circle = world.createDynamicBody({
        position: new Vec2(
          5 + i * 1 + Math.random() * 10,
          -5 - Math.random() * 10
        ),
      });
      const fixture = circle.createFixture(new pl.Circle(0.25), {
        density: 1.0,
        friction: 0.3,
        restitution: 0.2,
      });
    }
  };

  const pl = planck;
  useEffect(() => {
    if (carRef && carVanish) {
      world.destroyBody(boxRef.current);
      world.destroyBody(boxRef2.current);
      circleRain();
    }
  }, [carVanish, world]);

  useEffect(() => {
    // Add a ground body for the mouse joint
    const groundBody = world.createBody();
    const handlers = { mouseDown, mouseUp, mouseMove, click, doubleClick };

    // Stack of boxes
    const stackX = 90;
    const boxSize = 1;
    const numBoxes = 12;
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
      if (i === 0) {
        boxRef.current = box;
      } else if (i === 1) {
        boxRef2.current = box;
      }
      // addFixture(fixture);
    }

    let car = null;

    const fixture = world
      .createDynamicBody(new Vec2(10, -10))
      .createFixture(new pl.Box(2, 2), 5.0);
    // addFixture(fixture);

    const fixture2 = world
      .createDynamicBody(new Vec2(10, -15))
      .createFixture(new pl.Box(2, 2), 5.0);
    // addFixture(fixture2);

    const fixture3 = world
      .createBody(new Vec2(13, -20))
      .createFixture(new pl.Box(2, 2), 5.0);

    // addFixture(fixture3);

    const canvas = canvasRef.current;
    Scene.canvas.element = canvas;

    Scene.canvas.context = canvas?.getContext("2d");

    attachCanvasEvents(canvas, handlers, setMousePosUI);

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
    // addFixture(fixture4);

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

    // addFixture(fixture5);

    const rightWheel = world.createDynamicBody(
      new Vec2(carX + wheelOffsetX, carY + wheelOffsetY)
    );
    const fixture6 = rightWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });
    // addFixture(fixture6);

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
    const scaleFactor = 3;
    const bottom = new pl.Box(1.5 * scaleFactor, 0.15 * scaleFactor);
    const left = new pl.Box(
      0.15 * scaleFactor,
      2.7 * scaleFactor,
      new Vec2(-2 * scaleFactor, 4 * scaleFactor),
      0.2
    );
    const right = new pl.Box(
      0.15 * scaleFactor,
      2.7 * scaleFactor,
      new Vec2(2 * scaleFactor, 4 * scaleFactor),
      -0.2
    );

    const container = world.createBody(new Vec2(40, -40));
    container.createFixture(bottom, 4.0);
    container.createFixture(left, 4.0);
    container.createFixture(right, 4.0);
    //======================================================================
    const bottom2 = new pl.Box(1.5 * scaleFactor, 0.15 * scaleFactor);
    const left2 = new pl.Box(
      0.15 * scaleFactor,
      2.7 * scaleFactor,
      new Vec2(-2 * scaleFactor, 4 * scaleFactor),
      0.2
    );
    const right2 = new pl.Box(
      0.15 * scaleFactor,
      2.7 * scaleFactor,
      new Vec2(2 * scaleFactor, 4 * scaleFactor),
      -0.2
    );

    const container2 = world.createDynamicBody(new Vec2(70, -40));
    container2.createFixture(bottom2, 4.0);
    container2.createFixture(left2, 4.0);
    container2.createFixture(right2, 4.0);

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

    return () => {
      removeCanvasEvents(canvas, Scene.handlers);
    };
  }, []);

  useEffect(() => {
    render(world, { x: 0, y: 0 });
  }, [fixtureList, world]);

  const handlePauseToggle = () => {
    render(world, { x: 0, y: 0 });
  };

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
            setIsPolylineMode(!isPolylineMode); // TODO: looks like this line is not needed
            UpdateMode("polyline");
            render(world, { x: 0, y: 0 });
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
        <div className="relative inline-block">
          <button
            className={`px-4 py-2 rounded ${
              isPolygonMode
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
            onClick={() => {
              setIsPolygonMode(!isPolygonMode);
              UpdateMode("polygon");
            }}
          >
            Create Polygon ({polygonSides} sides)
          </button>
          {isPolygonMode && (
            <div className="absolute z-10 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sides) => (
                <button
                  key={sides}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setPolygonSides(sides);
                    Scene.polygonSides = sides;
                  }}
                >
                  {sides} sides
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className={`px-4 py-2 rounded ${
            rectangleMode ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}
          onClick={() => {
            setRectangleMode(!rectangleMode);
            UpdateMode("rectangle");
          }}
        >
          Rectangle Mode
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isAddingFixture
              ? "bg-green-500 text-white"
              : "bg-blue-500 text-white"
          }`}
          onClick={() => {
            setIsAddingFixture(!isAddingFixture);
            Scene.isAddingFixture = !isAddingFixture;
          }}
        >
          Add fixture
        </button>
      </div>

      <div className="m-3 w-fit">
        X: {mousePosUI.x.toFixed(0)}, Y:{mousePosUI.y.toFixed(0)}
        <canvas
          ref={canvasRef}
          id="canvas"
          width={canvas.width}
          height={canvas.height}
          style={{ border: "1px solid #333" }}
        />
      </div>
    </div>
  );
}

export default Lab;
