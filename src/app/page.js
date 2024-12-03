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
let scene = Scene;
const Scenes = ({}) => {
  const [managedShapeIndex, setManagedShapeIndex] = useState(null);
  useEffect(() => {
    /** TODO: move functions into single index file and import **/
    console.log("===========================================scene ", scene);
    counter;
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
    animate();
  }, []);

  const [counter, setCounter] = React.useState(0);
  return (
    <div className="canvasWrapper">
      <Buttons buttons={Buttons} setManagedShapeIndex={setManagedShapeIndex} />
      <canvas id="canvas" width="1200" height="700" />
      <br />
      <button onClick={() => setCounter((n) => n + 1)}>increase counter</button>
      <br />
      counter: {counter}
    </div>
  );
};

export default Scenes;
