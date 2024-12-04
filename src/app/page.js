"use client";
import React, { useEffect, useState, useCallback } from "react";
import animate from "./engine/utils/animation";
import { createWall } from "./engine/shapes/walls";
import Scene from "./engine/scenes/scene";
import Buttons from "./buttons";
import reCentre from "./engine/shapes/reCentre";
import updateScene from "./engine/scenes/updateScene";
import { clearShapes, shapeSelection } from "./engine/shapes/shapes";
import {
  mouseDown,
  mouseMove,
  mouseUp,
  doubleClick,
  click,
  rightClick,
} from "./engine/canvasEvents/listeners";

// import dynamic from "next/dynamic";

// const animate = dynamic(() => import("./engine/utils/animation"), {
//   ssr: false, // This ensures the component is not SSR'd
// });

const scene = Scene;

const Scenes = ({}) => {
  const [managedShapeIndex, setManagedShapeIndex] = useState(null);
  const [selected, setSelected] = useState("none");

  useEffect(() => {
    /** TODO: move functions into single index file and import **/
    console.log("===========================================scene ", scene);

    if (scene) {
      const canvas = document.getElementById("canvas");
      console.log("===========================================canvas ", canvas);
      animate();
      // mouseDown(canvas, setManagedShapeIdx);
      mouseDown(canvas);
      mouseMove(canvas);
      mouseUp(canvas);
      // doubleClick(canvas, selectShape, addRules, selectedEvent);
      click(canvas);
      rightClick(canvas);
      reCentre(shapeSelection);
      createWall(canvas, 250);
      // if (!Object.keys(scene)?.length) {
      //   createWall(canvas, 250);
      // }
      updateScene(scene);
    }
  }, []);

  useEffect(() => {
    scene.selected = selected;
  }, [selected]);

  // useEffect(() => {
  //   animate();
  // }, []);

  console.log("scene.selected", scene.selected);
  console.log("selected", selected);

  return (
    <div className="canvasWrapper">
      <Buttons
        buttons={Buttons}
        setManagedShapeIndex={setManagedShapeIndex}
        setSelected={setSelected}
      />
      <canvas id="canvas" width="1200" height="700" />
    </div>
  );
};

export default Scenes;
