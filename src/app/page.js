"use client";
import React, { useEffect, useRef } from "react";
import { World, Vec2, Edge, Box, Testbed } from "planck";

let world = new World({
  gravity: new Vec2(0.0, -10.0),
});

class Renderer {
  world = null;
  started = false;
  context = null;

  start(world, canvas) {
    this.world = world;
    this.context = canvas.getContext("2d");

    // Add listeners
    world.on("remove-body", this.removeBody);
    world.on("remove-joint", this.removeJoint);
    world.on("remove-fixture", this.removeFixture);

    // Start frame loop
    this.started = true;
    this.loop(0);
  }

  stop() {
    // Remove listeners
    world.off("remove-body", this.removeBody);
    world.off("remove-joint", this.removeJoint);
    world.off("remove-fixture", this.removeFixture);

    // Stop next frame
    this.started = false;
  }

  // Game loop
  loop = (timeStamp) => {
    if (!this.started) {
      return;
    }

    // Clear canvas
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    // In each frame call world.step with fixed timeStep
    this.world.step(1 / 60);

    // Iterate over bodies
    for (let body = this.world.getBodyList(); body; body = body.getNext()) {
      this.renderBody(body);
      // ... and fixtures
      for (
        let fixture = body.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {
        this.renderFixture(fixture);
      }
    }
    // Iterate over joints
    for (
      let joint = this.world.getJointList();
      joint;
      joint = joint.getNext()
    ) {
      this.renderJoint(joint);
    }

    // Request a new frame
    window.requestAnimationFrame(this.loop);
  };

  renderBody(body) {
    // Render or update body rendering
    const position = body.getPosition();
    const angle = body.getAngle();
    this.context.save();
    this.context.translate(position.x, position.y);
    this.context.rotate(angle);
    this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
    this.context.fillRect(-0.5, -0.5, 1, 1);
    this.context.restore();
  }

  renderFixture(fixture) {
    // Render or update fixture rendering
  }

  renderJoint(joint) {
    // Render or update joint rendering
  }

  removeBody(body) {
    // Remove body rendering
  }

  removeFixture(fixture) {
    // Remove fixture rendering
  }

  removeJoint(joint) {
    // Remove joint from rendering
  }
}

const renderer = new Renderer();

const Scenes = ({}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    renderer.start(world, canvas);
    return () => renderer.stop();
  }, []);

  return (
    <div className="canvasWrapper">
      <h1>Hello</h1>
      <canvas ref={canvasRef} id="canvas" width="1200" height="700" />
    </div>
  );
};

export default Scenes;
