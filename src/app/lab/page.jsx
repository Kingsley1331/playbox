"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";
import { createWalls } from "../helpers/bodies";
import Navbar from "../components/Navbar";
import { mouseEvents } from "../helpers/utilities";

function Lab() {
  //   console.log("==============================================>Lab");
  const scale = 20;
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);
  const [carVanish, setCarVanish] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(true);
  //   const [canvas, setCanvas] = useState(null);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  //   // Stack of boxes
  //   const stackX = 90;
  //   const boxSize = 1;
  //   const numBoxes = 5;
  //   for (let i = 0; i < numBoxes; i++) {
  //     const box = world.createBody({
  //       type: "dynamic",
  //       position: new Vec2(
  //         stackX,
  //         boxSize / 2 + i * (boxSize * 2) - 1200 / scale
  //       ),
  //     });
  //     box.createFixture(new pl.Box(boxSize, boxSize), {
  //       density: 1.0,
  //       friction: 0.5,
  //       restitution: 0.1,
  //     });
  //   }

  //   useEffect(() => {
  //     // Car parameters
  //     const carX = 20;
  //     const carY = -50;
  //     const carWidth = 2;
  //     const carHeight = 0.5;

  //     car = world.createDynamicBody(new Vec2(carX, carY));

  //     car.createFixture(new pl.Box(carWidth, carHeight), {
  //       density: 1,
  //       friction: 0.3,
  //       restitution: 0.1,
  //     });

  //     // Wheels
  //     const wheelRadius = 0.4;
  //     const wheelOffsetX = 1.0;
  //     const wheelOffsetY = -0.5;
  //     const wheelDensity = 1.0;

  //     const leftWheel = world.createDynamicBody(
  //       new Vec2(carX - wheelOffsetX, carY + wheelOffsetY)
  //     );

  //     leftWheel.createFixture(new pl.Circle(wheelRadius), {
  //       density: wheelDensity,
  //       friction: 0.9,
  //     });

  //     const rightWheel = world.createDynamicBody(
  //       new Vec2(carX + wheelOffsetX, carY + wheelOffsetY)
  //     );

  //     rightWheel.createFixture(new pl.Circle(wheelRadius), {
  //       density: wheelDensity,
  //       friction: 0.9,
  //     });

  //     // Enable motors so we can control wheels
  //     const maxMotorTorque = 80;
  //     const motorSpeed = -80;
  //     const leftJoint = world.createJoint(
  //       new pl.RevoluteJoint(
  //         {
  //           enableMotor: true,
  //           motorSpeed,
  //           maxMotorTorque,
  //         },
  //         car,
  //         leftWheel,
  //         leftWheel.getPosition()
  //       )
  //     );

  //     const rightJoint = world.createJoint(
  //       new pl.RevoluteJoint(
  //         {
  //           enableMotor: true,
  //           motorSpeed,
  //           maxMotorTorque,
  //         },
  //         car,
  //         rightWheel,
  //         rightWheel.getPosition()
  //       )
  //     );
  //   }, [fps, carVanish]);

  useEffect(() => {
    const pl = planck;
    const world = new pl.World(new Vec2(0, -10));

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

    const mouse = mouseEvents(canvas, scale, setMousePos);
    console.log("mouse", mouse);

    createWalls(world, canvas, scale);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //delete body or joint
    // world.destroyBody(container2);
    // world.destroyJoint(leftJoint);

    render(world, ctx, scale, fps, canvas, {
      x: 0,
      y: 0,
    });

    if (car && carVanish) {
      // world.destroyBody(car);
    }

    //   useEffect(() => {
    //     console.log("car", car);
    //     if (car && carVanish) {
    //       console.log("Car vanished");
    //       world.destroyBody(car);
    //     }
    //   }, [carVanish]);

    // Detect collisions
    world.on("begin-contact", (contact) => {
      console.log("Collided with something");
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
  }, [fps]);

  return (
    <div>
      <Navbar />
      <button onClick={() => setPaused(!paused)}>
        {paused ? "Resume" : "Pause"}
      </button>
      <div className="m-3 w-fit">
        X: {mousePos.x.toFixed(0)}, Y:{mousePos.y.toFixed(0)}
        <canvas
          ref={canvasRef}
          id="canvas"
          width={2400}
          height={1200}
          style={{ border: "1px solid #333" }}
          onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
        />
      </div>
    </div>
  );
}

export default Lab;

// import React, { useEffect, useRef, useState } from "react";
// import planck, { Vec2 } from "planck";

// function Simulation() {
//   const canvasRef = useRef(null);
//   const [paused, setPaused] = useState(true#);

//   useEffect(() => {
//     const pl = planck;
//     const world = new pl.World(new Vec2(0, -10));

//     // Create a dynamic body
//     const body = world.createDynamicBody(new Vec2(0, 10));
//     const circle = new pl.Circle(1.0);
//     body.createFixture(circle, 2.0);

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const scale = 20;

//     function render() {
//       if (!paused) {
//         world.step(1 / 60);

//         // Clear the canvas
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Setup transform
//         ctx.save();
//         ctx.translate(canvas.width / 2, canvas.height / 2);
//         ctx.scale(1, -1);
//         ctx.scale(scale, scale);

//         // Draw all bodies
//         for (let b = world.getBodyList(); b; b = b.getNext()) {
//           drawBody(ctx, b);
//         }

//         ctx.restore();
//       }

//       requestAnimationFrame(render);
//     }

//     function drawBody(ctx, body) {
//       for (let f = body.getFixtureList(); f; f = f.getNext()) {
//         const shape = f.getShape();
//         const type = shape.getType();
//         const pos = body.getPosition();
//         const angle = body.getAngle();

//         ctx.save();
//         ctx.translate(pos.x, pos.y);
//         ctx.rotate(angle);

//         ctx.fillStyle = "transparent";
//         ctx.strokeStyle = "black";
//         ctx.lineWidth = 1 / scale;

//         if (type === "polygon") {
//           ctx.beginPath();
//           const vertices = shape.m_vertices;

//           ctx.moveTo(vertices[0].x, vertices[0].y);
//           for (let i = 1; i < vertices.length; i++) {
//             ctx.lineTo(vertices[i].x, vertices[i].y);
//           }
//           ctx.closePath();
//           ctx.fill();
//           ctx.stroke();
//         } else if (type === "circle") {
//           ctx.beginPath();
//           ctx.arc(shape.m_p.x, shape.m_p.y, shape.m_radius, 0, 2 * Math.PI);
//           ctx.fill();
//           ctx.stroke();
//         }

//         ctx.restore();
//       }
//     }

//     requestAnimationFrame(render);
//   }, [paused]);

//   return (
//     <div className="m-3 w-fit">
//       <button onClick={() => setPaused(!paused)}>
//         {paused ? "Resume" : "Pause"}
//       </button>
//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={600}
//         style={{ border: "1px solid #333" }}
//       />
//     </div>
//   );
// }

// export default Simulation;
