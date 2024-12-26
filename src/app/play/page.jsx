"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import Navbar from "../components/Navbar";
import { render2 } from "../helpers/rendering";

function BouncingBall() {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const ctxRef = useRef(null);
  const isPausedRef = useRef(false); // Track pause state in ref
  const [isPaused, setIsPaused] = useState(false);
  const scale = 20;
  console.log("BouncingBall");

  useEffect(() => {
    const world = new planck.World({
      gravity: Vec2(0, -10),
    });
    worldRef.current = world;

    const ground = world.createBody();
    ground.createFixture(planck.Edge(Vec2(-15, -5), Vec2(15, -5)), {
      friction: 0.6,
      restitution: 0.5,
    });

    const ball = world.createDynamicBody({
      position: Vec2(0, 10),
      bullet: true,
    });
    ball.createFixture(planck.Circle(1), {
      density: 1,
      friction: 0.3,
      restitution: 0.8,
    });

    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");

    render2(
      worldRef,
      ctxRef,
      scale,
      60,
      canvasRef,
      { x: canvasRef.current.width, y: canvasRef.current.height },
      isPausedRef
    );
  }, []);

  const handlePauseToggle = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(!isPaused);

    if (!isPausedRef.current) {
      render2(
        worldRef,
        ctxRef,
        scale,
        60,
        canvasRef,
        { x: canvasRef.current.width / 2, y: canvasRef.current.height / 2 },
        isPausedRef
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Navbar />
      <button
        onClick={handlePauseToggle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPaused ? "Resume" : "Pause"}
      </button>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300"
      />
    </div>
  );
}

export default BouncingBall;
