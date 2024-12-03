import React, { useState, useEffect, useCallback } from "react";
import { ColourInterface } from "../engine/shapes/shapes";
import ShapesController from "../engine/shapes/ShapesController";
import DatGui, { DatColor, DatString } from "react-dat-gui";
import { isColour } from "../../../engine/utils/dom";
import "../../../../../client/src/style/dat_gui.css";
import "./ColourPalette.css";

const COLOURS = [
  "blue",
  "green",
  "red",
  "yellow",
  "black",
  "orange",
  "purple",
  "white",
  "violet",
  "transparent",
];

const Palette = ({ colours, setColour, selectedColour }) => {
  const colourOptions = colours.map((colour) => {
    return (
      <div
        key={colour}
        onClick={() => setColour(colour)}
        className={`${colour} colour_option`}
        style={{ backgroundColor: colour }}
      ></div>
    );
  });
  return (
    <div className="palette_wrapper">
      <div className="colour_options">{colourOptions}</div>
      <div
        className="selected_colour"
        style={{
          backgroundColor: selectedColour || "grey",
          opacity: selectedColour ? 1 : 0.2,
        }}
      ></div>
    </div>
  );
};

const ColourPalette = () => {
  const { setCurrentColour, getSelectedShapeIndex } = ColourInterface();

  const [colour, setColour] = useState("");
  const [colourInput, setColourInput] = useState("");

  useEffect(() => {
    const Swatch = document.querySelector(".swatch");
    if (Swatch) {
      Swatch.addEventListener("click", (event) => {
        setColourInput("");
      });
    }
    return () => {
      Swatch.removeEventListener("click", setColourInput);
    };
  }, [setColourInput]);

  const updateColour = useCallback(
    (colour) => {
      const selectedShapeIndex = getSelectedShapeIndex();
      setColour(colour);
      setCurrentColour(colour);
      if (selectedShapeIndex) {
        ShapesController.setProperty(selectedShapeIndex, "fillColour", colour);
      }
    },
    [
      setColour,
      setCurrentColour,
      getSelectedShapeIndex,
      ShapesController.setProperty,
    ]
  );

  useEffect(() => {
    updateColour(colour);
  }, [colour]);

  const handleUpdate = useCallback(
    (data) => {
      const { colour, colourInput: colourFromInput } = data;

      if (isColour(colourFromInput)) {
        updateColour(colourFromInput);
      } else {
        updateColour(colour);
      }
      setColourInput(colourFromInput);
    },
    [updateColour]
  );

  return (
    <DatGui data={{ colour, colourInput }} onUpdate={handleUpdate}>
      <DatString path="colourInput" label="Colour" />
      <Palette
        colours={COLOURS}
        setColour={(colour) => {
          setColour(colour);
          setColourInput("");
        }}
        selectedColour={colour}
      />
      <DatColor path="colour" label="Colour" />
    </DatGui>
  );
};

export default ColourPalette;
