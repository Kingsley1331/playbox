"use client";
import React, { useEffect, useState, useCallback } from "react";
// import { connect } from "react-redux";
import Buttons from "./buttons";
/* Gamecraft change: commented out 2 lines below */
// import EventForm from "./events/EventForm";
import updateScene from "./engine/scenes/updateScene";
import { clearShapes, shapeSelection } from "./engine/shapes/shapes";
import { createWall } from "./engine/shapes/walls";
import reCentre from "./engine/shapes/reCentre";
import { ShapeManagerInterface } from "./engine/shapes/shapes";
import {
  mouseDown,
  mouseMove,
  mouseUp,
  doubleClick,
  click,
  rightClick,
} from "./engine/canvasEvents/listeners";
import Scene from "./engine/scenes/scene";
// import SceneManager from "./data_control/SceneManager";
// import animate from "./engine/utils/animation";

import dynamic from "next/dynamic";

const animate = dynamic(() => import("./engine/utils/animation"), {
  ssr: false, // This ensures the component is not SSR'd
});

/* Gamecraft change: commented out 2 lines below */

// import ShapeManager from "./data_control/ShapeManager";
// import ColourPalette from "./data_control/ColourPalette";

let canvas;
/**TODO: place in new utility file e.g rulesAndFormIntegration.js  */
// const convertSceneRulesToFormRules = (rules) => {
//   console.log("scene.rules", rules);
//   const convertedRules = [];
//   const numOfRules = rules.length;
//   for (let i = 0; i < numOfRules; i++) {
//     const rule = rules[i];
//     const convertedRule = { ...rule };
//     const conditionTypeList = [
//       ["conditions", "logicalOperators"],
//       ["emitterConditions", "emitterLogicalOperators"],
//       ["receiverConditions", "receiverLogicalOperators"],
//     ];
//     const numOfConditionTypes = conditionTypeList.length;
//     for (let j = 0; j < numOfConditionTypes; j++) {
//       const conditionType = conditionTypeList[j][0];
//       const operatorType = conditionTypeList[j][1];

//       if (convertedRule[conditionType]) {
//         const operators = convertedRule[operatorType];
//         const conditions = convertedRule[conditionType];
//         const convertedConditions = conditions.map((condition, idx) => {
//           const newCondition = {
//             ...condition,
//           };
//           if (idx > 0) {
//             newCondition.logicalOperator = operators[idx - 1];
//           }
//           return newCondition;
//         });
//         convertedRule[conditionType] = convertedConditions;
//         delete convertedRule[operatorType];
//       }
//     }
//     convertedRules.push(convertedRule);
//   }
//   console.log("convertedRules", convertedRules);
//   return convertedRules;
// };

let scene = Scene;

const Scenes = ({
  selectShape,
  selectedShapeId,
  addRules,
  selectedEvent,
  // scene,
  clearScene,
  buttons,
}) => {
  const [formRules, setFormRules] = useState([]);
  const [selected, setSelected] = useState();
  const [managedShapeIndex, setManagedShapeIndex] = useState(null);

  // this useEffect was added as part of Gamecraft changes
  useEffect(() => {
    const bufferCanvas = document.createElement("canvas");
    const bufferCtx = bufferCanvas.getContext("2d");
    let width = bufferCtx.canvas.width;
    let height = bufferCtx.canvas.height;
    bufferCtx.fillStyle = scene.backgroundColour;
    bufferCtx.fillRect(0, 0, width, height);
    scene.context.buffer = bufferCtx;
  }, [scene]);

  useEffect(() => {
    for (let button in buttons) {
      if (buttons[button]) {
        setSelected(button);
      }
    }
  }, [buttons, setSelected]);

  useEffect(() => {
    if (scene?.rules) {
      setFormRules(scene.rules);
      console.log("scene.rules", scene.rules);
      // setFormRules(convertSceneRulesToFormRules(scene.rules));
    }
  }, [scene?.rules]);

  const setManagedShapeIdx = useCallback(
    (idx = null) => {
      setManagedShapeIndex(idx);
      ShapeManagerInterface().selectShape(idx);
    },
    [setManagedShapeIndex]
  );

  const addRule = () => {
    const id = new Date().getTime();
    setFormRules((rulesArray) => [...rulesArray, { id }]);
  };

  console.log("===========================================scene1", scene);

  useEffect(() => {
    /** TODO: move functions into single index file and import **/
    console.log("===========================================scene2 ", scene);

    if (scene) {
      canvas = document.getElementById("canvas");
      console.log("===========================================canvas ", canvas);
      animate();
      mouseDown(canvas, setManagedShapeIdx);
      mouseMove(canvas);
      mouseUp(canvas);
      doubleClick(canvas, selectShape, addRules, selectedEvent);
      click(canvas);
      rightClick(canvas);
      reCentre(shapeSelection);
      if (!Object.keys(scene)?.length) {
        createWall(canvas, 250);
      }
      updateScene(scene);
    }
  }, [selectShape, addRules, selectedEvent]);

  useEffect(() => {
    doubleClick(canvas, selectShape, addRules, selectedEvent);
  }, [selectedEvent, selectShape, addRules]);

  useEffect(() => {
    return () => {
      clearShapes();
      clearScene();
    };
  }, [clearShapes, clearScene]);
  console.log({ formRules });

  return (
    <div className="scenesWrapper">
      <div className="canvasWrapper">
        {/* Gamecraft change: commented out line below */}
        <Buttons setManagedShapeIndex={setManagedShapeIdx} />
        <canvas id="canvas" width="1200" height="700" />
        {/* <canvas id="canvas" width="1400" height="800" /> */}
        {/* <SceneManager /> */}

        {/* <canvas id="canvas" width="1000" height="600" /> */}
      </div>
      {/* Gamecraft change: commented out line below */}
      {/* {selected === "colour" && <ColourPalette />} */}
      {/* Gamecraft change: commented out line below */}
      {/* {formRules.map((rule, index) => (
        <EventForm key={rule.id} rule={rule} setFormRules={setFormRules} />
      ))} */}
      <button className="add_rule" onClick={addRule}>
        Add rule
      </button>
      {selected === "manageShape" && managedShapeIndex !== null && (
        <ShapeManager shapeIndex={managedShapeIndex} />
      )}
    </div>
  );
};

// const mapStateToProps = ({ buttons, scene, event, selectedShape }) => {
//   return {
//     buttons,
//     scene,
//     selectedEvent: event,
//     selectedShapeId: selectedShape,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     selectShape: (shapeId) => {
//       // dispatch({ type: "SELECTED_SHAPE", shapeId });
//       dispatch({ type: "SELECT_SHAPE", payload: shapeId });
//     },
//     clearScene: () => {
//       dispatch({ type: "GET_SCENE", payload: {} });
//     },
//     addRules: (rules) => dispatch({ type: "ADD_RULES", payload: rules }),
//   };
// };

// // export default connect(mapStateToProps)(Scenes);
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
export default Scenes;
