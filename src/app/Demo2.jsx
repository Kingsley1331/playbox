"use client";
import React, { useEffect, useRef } from "react";
import planck, { Vec2 } from "planck";

function Demo2() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const pl = planck;
    const world = new pl.World({
      gravity: new Vec2(0, -10),
    });

    // Make the ground horizontal by setting angle to 0
    const ground = world.createBody({
      position: new Vec2(0, 0),
      angle: 0,
    });
    ground.createFixture(new pl.Edge(new Vec2(-50, 0), new Vec2(50, 0)), {
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
      position: new Vec2(carX, carY),
    });
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

    const leftWheel = world.createBody({
      type: "dynamic",
      position: new Vec2(carX - wheelOffsetX, carY + wheelOffsetY),
    });
    leftWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    const rightWheel = world.createBody({
      type: "dynamic",
      position: new Vec2(carX + wheelOffsetX, carY + wheelOffsetY),
    });
    rightWheel.createFixture(new pl.Circle(wheelRadius), {
      density: wheelDensity,
      friction: 0.9,
    });

    // Enable motors so we can control wheels
    const maxMotorTorque = 50;
    const leftJoint = world.createJoint(
      new pl.RevoluteJoint(
        {
          enableMotor: true,
          motorSpeed: 0,
          maxMotorTorque: maxMotorTorque,
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
          motorSpeed: 0,
          maxMotorTorque: maxMotorTorque,
        },
        car,
        rightWheel,
        rightWheel.getPosition()
      )
    );

    // Stack of boxes
    const stackX = 10;
    const boxSize = 0.5;
    const numBoxes = 5;
    for (let i = 0; i < numBoxes; i++) {
      const box = world.createBody({
        type: "dynamic",
        position: new Vec2(stackX, boxSize / 2 + i * (boxSize * 2)),
      });
      box.createFixture(new pl.Box(boxSize, boxSize), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.1,
      });
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 20;
    const fps = 60;

    // Motor speed control variables
    let motorSpeed = 0;
    const motorSpeedIncrement = 2.0; // how much to change speed by per key press

    function setMotorSpeed(speed) {
      leftJoint.setMotorSpeed(speed);
      rightJoint.setMotorSpeed(speed);
    }

    // Keyboard controls
    function handleKeyDown(e) {
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
        car.applyLinearImpulse(new Vec2(-5, 0), car.getWorldCenter(), true);
      } else if (e.code === "ArrowRight") {
        // Nudge car to the right
        car.applyLinearImpulse(new Vec2(5, 0), car.getWorldCenter(), true);
      }
    }

    function handleKeyUp(e) {
      // Optional: On key up, you could reset speed or let it coast
      // For now, we do nothing, so it continues at the last speed
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

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
      ctx.beginPath();
      ctx.moveTo(-50, 0);
      ctx.lineTo(50, 0);
      ctx.stroke();

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

        // Color coding with transparent car
        let color = "red";
        if (body === car) {
          color = "transparent"; // semi-transparent blue for car
        } else if (body === leftWheel || body === rightWheel) {
          color = "transparent"; // transparent for wheels
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
      // Cleanup event listeners on unmount
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}

export default Demo2;
