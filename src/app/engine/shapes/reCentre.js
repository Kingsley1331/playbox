import { findMass } from "../physics/mass/mass";
import findBoundingRect from "./findBoundingRect";

export function reCentreVertices(vertices, centreShift) {
  var length = vertices.length;
  for (var i = 0; i < length; i++) {
    vertices[i].x -= centreShift.x;
    vertices[i].y -= centreShift.y;
  }
  return vertices;
}

export default function reCentre(shapes) {
  for (var shape in shapes) {
    var centre = { x: 0, y: 0 };
    var vertices = shapes[shape];
    var boundingRect = findBoundingRect(vertices);
    var mass = findMass(centre, vertices, boundingRect);
    var centreOfMass = mass.centreOfMass;
    vertices = reCentreVertices(vertices, centreOfMass);
    shapes[shape] = vertices;
  }
}
