import React, { useState, useEffect } from "react";
import ShapesController from "../engine/shapes/ShapesController";
import DatGui, {
  DatBoolean,
  DatFolder,
  DatNumber,
  DatString,
} from "react-dat-gui";
import "../../../../../client/src/style/dat_gui.css";

const ShapeManager = ({ shapeIndex }) => {
  const id = ShapesController.getProperty(shapeIndex, "id");
  const isShapeFixed = ShapesController.getProperty(shapeIndex, "isShapeFixed");
  const fillColour = ShapesController.getProperty(shapeIndex, "fillColour");
  const centreOfMass = ShapesController.getProperty(shapeIndex, "centreOfMass");
  const physics = ShapesController.getProperty(shapeIndex, "physics");
  const strokeStyle = ShapesController.getProperty(shapeIndex, "strokeStyle");
  const linewidth = ShapesController.getProperty(shapeIndex, "linewidth");

  const [shapeData, setShapeData] = useState({
    id,
    fillColour,
    strokeStyle,
    linewidth,
    physics,
    isShapeFixed,
    centreOfMass,
  });

  useEffect(() => {
    const data = {
      id,
      fillColour,
      strokeStyle,
      linewidth,
      physics,
      isShapeFixed,
      centreOfMass,
    };
    setShapeData({ ...data });
  }, [
    id,
    fillColour,
    strokeStyle,
    linewidth,
    physics,
    isShapeFixed,
    centreOfMass,
  ]);

  const handleUpdate = (data) => {
    const {
      fillColour,
      strokeStyle,
      linewidth,
      physics: physicsData,
      isShapeFixed,
      centreOfMass,
    } = data;

    setShapeData({ ...data });
    ShapesController.setProperty(shapeIndex, "fillColour", fillColour);
    ShapesController.setProperty(shapeIndex, "strokeStyle", strokeStyle);
    ShapesController.setProperty(shapeIndex, "linewidth", linewidth);
    ShapesController.setProperty(shapeIndex, "physics", physicsData);
    ShapesController.setProperty(shapeIndex, "freezeShape", isShapeFixed);
    ShapesController.setProperty(shapeIndex, "centreOfMass", centreOfMass);
  };

  return (
    <DatGui data={shapeData} onUpdate={handleUpdate}>
      <DatString path="id" label="shape id" />
      <DatString path="fillColour" label="Colour" />
      <DatString path="strokeStyle" label="Line colour" />
      <DatNumber path={"linewidth"} label="linewidth"></DatNumber>
      <DatNumber path={"centreOfMass.x"} label="x" step={1}></DatNumber>
      <DatNumber path={"centreOfMass.y"} label="y" step={1}></DatNumber>
      <DatFolder title="Physics">
        <DatNumber
          path={"physics.velocity.x"}
          label="velocity.x"
          step={0.01}
        ></DatNumber>
        <DatNumber
          path={"physics.velocity.y"}
          label="velocity.y"
          step={0.01}
        ></DatNumber>
        <DatNumber
          path={"physics.angularVelocity"}
          label="Angular velocity"
          step={0.001}
        ></DatNumber>
        <DatNumber path={"physics.mass"} label="Mass"></DatNumber>
      </DatFolder>
      <DatBoolean path="isShapeFixed" label="Freeze" labelWidth="90px" />
    </DatGui>
  );
};

export default ShapeManager;
