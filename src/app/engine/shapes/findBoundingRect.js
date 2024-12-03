import { magnitude } from "../utils/maths/Vector";

export default function findBoundingRect(vertices) {
  let boundingRect = {};
  let maxX = vertices[0].x;
  let minX = vertices[0].x;
  let maxY = vertices[0].y;
  let minY = vertices[0].y;
  const length = vertices.length;
  for (let i = 0; i < length; i++) {
    if (maxX < vertices[i].x) {
      maxX = vertices[i].x;
    }
    if (minX > vertices[i].x) {
      minX = vertices[i].x;
    }
    if (maxY < vertices[i].y) {
      maxY = vertices[i].y;
    }
    if (minY > vertices[i].y) {
      minY = vertices[i].y;
    }
  }
  boundingRect = {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY,
    centre: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2
    },
    vertices: [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
    ]
  };

  const { centre } = boundingRect;

  const centreToVertexDistances = vertices.map(vertex => {
    const { x, y } = vertex;
    const { x: centreX, y: centreY } = centre;
    const distance = magnitude({ x: x - centreX, y: y - centreY });
    return distance;
  });

  const radius = Math.max(...centreToVertexDistances);

  boundingRect.radius = radius;

  return boundingRect;
}
