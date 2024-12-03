"use client";
import React from "react";
// import Scene from "../../../src/engine/scenes/scene";
import Scene from "../engine/scenes/scene";
import {
  CloneInterface,
  resizeInterface,
  rotateInterface,
  ColourInterface,
} from "../engine/shapes/shapes";

export const update = () => {
  const name = prompt("Please enter a name for the scene", Scene.name);
  const imageURL = Scene.context.buffer.canvas.toDataURL();

  if (name !== null) {
    fetch(`/scenes/${Scene._id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...Scene, name, imageURL }), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("result", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
};

export const save = () => {
  const name = prompt("Please enter a name for the scene", "untitled");
  const imageURL = Scene.context.buffer.canvas.toDataURL();
  delete Scene._id;
  if (name !== null) {
    fetch("/scenes", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({ ...Scene, name, imageURL }), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("result", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
};

export const BUTTONS = [
  { name: "play" },
  { name: "step" },
  { name: "square" },
  { name: "triangle" },
  { name: "pentagon" },
  { name: "hexagon" },
  { name: "circle" },
  { name: "plus" },
  { name: "arrow" },
  { name: "star" },
  { name: "tShape" },
  { name: "bar", width: "10" },
  { name: "box" },
  { name: "_delete" },
  { name: "save", onClick: save },
  { name: "update", onClick: update },
  { name: "polyline", onClick: () => (Scene.polyline.vertices = []) },
  { name: "draw", onClick: () => (Scene.polyline.vertices = []) },
  { name: "clone", onClick: CloneInterface().resetClone },
  { name: "reshape" },
  { name: "resize", onClick: resizeInterface().selectShape },
  { name: "rotate", onClick: rotateInterface().selectShape },
  { name: "colour", onClick: ColourInterface().selectShape },
  { name: "manageShape" },
];

export const ImgButton = ({ alt, id, src, width, selected, selectShape }) => {
  return (
    <div
      className={`image_wrapper ${selected ? "selected" : ""}`}
      onClick={selectShape}
    >
      <img alt={alt} id={id} src={src} width={width} />
    </div>
  );
};
