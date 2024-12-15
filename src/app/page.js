"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";

function CarAndBoxesDemo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const pl = planck;
    const world = pl.World({
      gravity: Vec2(0, -10),
    });

    // Slight slope
    const slopeAngle = -0.2;
    const ground = world.createBody({
      position: Vec2(0, 0),
      angle: slopeAngle,
    });
    ground.createFixture(pl.Edge(Vec2(-50, 0), Vec2(50, 0)), {
      density: 0,
      friction: 0.9,
    });

    // Car parameters
    const carX = 0;
    const carY = 5;
    const carWidth = 2;
    const carHeight = 0.5;
    const car = world.createBody({
      type: "dynamic",
      position: Vec2(carX, carY),
    });
    car.createFixture(pl.Box(carWidth, carHeight), {
      density: 1,
      friction: 0.3,
      restitution: 0.1,
    });

    // Wheels
    const wheelRadius = 0.4;
    const wheelOffsetX = 1.0;
    const wheelOffsetY = -0.5;
    const wheelDensity = 1.0;

    const leftWheel = world.createBody({
      type: "dynamic",
      position: Vec2(carX - wheelOffsetX, carY + wheelOffsetY),
    });
    leftWheel.createFixture(pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    const rightWheel = world.createBody({
      type: "dynamic",
      position: Vec2(carX + wheelOffsetX, carY + wheelOffsetY),
    });
    rightWheel.createFixture(pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    // Joints for wheels
    world.createJoint(
      pl.RevoluteJoint(
        {
          enableMotor: false,
          motorSpeed: 0,
          maxMotorTorque: 10,
        },
        car,
        leftWheel,
        leftWheel.getPosition()
      )
    );

    world.createJoint(
      pl.RevoluteJoint(
        {
          enableMotor: false,
          motorSpeed: 0,
          maxMotorTorque: 10,
        },
        car,
        rightWheel,
        rightWheel.getPosition()
      )
    );

    // Move the stack closer to the car
    const stackX = 10;
    const boxSize = 0.5;
    const numBoxes = 5; // number of boxes in the stack

    for (let i = 0; i < numBoxes; i++) {
      const box = world.createBody({
        type: "dynamic",
        position: Vec2(stackX, boxSize / 2 + i * (boxSize * 2)),
      });
      box.createFixture(pl.Box(boxSize, boxSize), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.1,
      });
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 20;
    const fps = 60;

    function render() {
      world.step(1 / fps);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Setup transform
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(1, -1);
      ctx.scale(scale, scale);

      // Draw ground
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1 / scale;
      ctx.save();
      ctx.rotate(ground.getAngle());
      ctx.beginPath();
      ctx.moveTo(-50, 0);
      ctx.lineTo(50, 0);
      ctx.stroke();
      ctx.restore();

      // Draw all bodies
      for (let b = world.getBodyList(); b; b = b.getNext()) {
        drawBody(ctx, b);
      }

      ctx.restore();

      requestAnimationFrame(render);
    }

    function drawBody(ctx, body) {
      for (let f = body.getFixtureList(); f; f = f.getNext()) {
        const shape = f.getShape();
        const type = shape.getType();
        const pos = body.getPosition();
        const angle = body.getAngle();

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        // Assign colors with some transparency for the car
        let color = "red";
        if (body === car) {
          // Car: semi-transparent blue
          color = "transparent";
        } else if (body === leftWheel || body === rightWheel) {
          color = "transparent";
        }

        ctx.fillStyle = color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1 / scale;

        if (type === "polygon") {
          ctx.beginPath();
          const vertices = shape.m_vertices;
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (type === "circle") {
          ctx.beginPath();
          ctx.arc(shape.m_p.x, shape.m_p.y, shape.m_radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    requestAnimationFrame(render);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}

export default CarAndBoxesDemo;
