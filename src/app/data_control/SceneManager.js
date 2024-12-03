import React, { useState } from "react";
import Scene from "../engine/scenes/scene";
// import DatGui, {
//   DatBoolean,
//   DatButton,
//   DatColor,
//   DatFolder,
//   DatNumber,
//   DatPresets,
//   DatSelect,
//   DatString,
// } from "react-dat-gui";

const SceneManager = () => {
  const [backgroundColour, setBackgroundColour] = useState({
    backgroundColour: Scene.backgroundColour,
  });
  console.log("Scene", Scene);
  const handleUpdate = (data) => {
    const { backgroundColour } = data;
    setBackgroundColour({ backgroundColour });
    Scene.backgroundColour = backgroundColour;
    console.log("backgroundColour", backgroundColour);
    console.log("data", data);
  };

  return <div>Hello</div>;
  // return (
  //   <DatGui data={backgroundColour} onUpdate={handleUpdate}>
  //     <DatString path="backgroundColour" label="BackgroundColour" />
  //     <DatColor label="Color" path="backgroundColour" />
  //   </DatGui>
  // );
};

export default SceneManager;
