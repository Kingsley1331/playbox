export const propertyMap = {
  fillColour: "fillColour",
  lineColour: "strokeStyle",
  linewidth: "linewidth",
  "centreOfMass.x": "centreOfMass.x",
  "centreOfMass.y": "centreOfMass.y",
  "velocity.x": "physics.velocity.x",
  "velocity.y": "physics.velocity.y",
  id: "id"
};

export const eventMap = {
  collision: "collision",
  drag: "drag",
  hover: "hover",
  click: "click",
  "double click": "doubleClick"
};
export const propertiesArray = [
  "velocity.x",
  "velocity.y",
  "fillColour",
  "linewidth",
  "lineColour"
];
export const operatorsArray = [
  ["===", "equal"],
  ["!==", "not equal"],
  [">", "greater than"],
  ["<", "less than"]
];
