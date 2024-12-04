"use client";
import React, { useEffect, useState, useCallback } from "react";
import animate from "./engine/utils/animation";
import { createWall } from "./engine/shapes/walls";
import Scene from "./engine/scenes/scene";
import Buttons from "./buttons";

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

      createWall(canvas, 250);
      // scene.selected = "play";
      // if (!Object.keys(scene)?.length) {
      //   createWall(canvas, 250);
      // }
    }
  }, []);

  useEffect(() => {
    scene.selected = selected;
  }, [selected]);

  useEffect(() => {
    animate();
  }, []);

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
