"use client";
import React, { useEffect, useState, useCallback } from "react";
import Scene from "../scenes/scene";
import { forEachShape } from "../shapes/shapes";
import { applyMotion } from "../physics/motion";
import { draw } from "../scenes/draw";
import collisionDetector from "../physics/collisions/collisionDetector";
import ShapesController from "../shapes/ShapesController";
import applyForces from "../physics/forces/applyForces";

let canvas;
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

export default function animate() {
  // console.log("animate", Scene.shapes);
  const timeStep = Scene.timeStep;
  /** TODO: store canvas globally in Scene to make it less expensive **/
  /** TODO: destrucure Scene object **/
  canvas = document.getElementById("canvas");
  var date = new Date();
  var currentTime = date.getTime();
  let time = Scene.time;
  var tDelta = currentTime - time;
  let shapes = Scene.shapes;
  let numShapes = shapes.length;
  if (Scene.selected === "play") {
    forEachShape(function (i) {
      // applyMotion(i, tDelta);
      applyMotion(i, timeStep);
      applyForces(i);
    });
    /** TODO check if collisionDetector can be moved inside the forEachShape callback **/
    collisionDetector();

    forEachShape(function (i) {
      const shapeId = ShapesController.getProperty(i, "id");
      if (ShapesController.getProperty(i, "colliding")) {
        Scene.currentEvents.collision.state = true;
        Scene.currentEvents.collision.ids.push(shapeId);
      }
      if (ShapesController.getProperty(i, "onShape")) {
        Scene.currentEvents.hover.state = true;
        Scene.currentEvents.hover.ids.push(shapeId);
      }
      if (ShapesController.getProperty(i, "dragging")) {
        Scene.currentEvents.drag.state = true;
        Scene.currentEvents.drag.ids.push(shapeId);
      }
    });
    /** Note: Its important that checkEvents runs after collisionDetector and the Scene.currentEvents
      settings, because it needs all of those setting to be complete before it runs
     */
    forEachShape(function (i) {
      ShapesController.checkEvents(i, i === numShapes - 1);
    });

    Scene.time += timeStep;
  }
  if (canvas) {
    draw(canvas, Scene);
  }
  window.requestAnimFrame(animate);
  // Scene.time += currentTime;
}
