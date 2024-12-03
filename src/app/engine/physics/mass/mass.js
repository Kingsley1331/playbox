import { isPointInShape } from "../../shapes/shapes";

export function findMass(centre, vertices, boundingRect) {
  var count = 0;
  var accuracy = 100;
  var resolution = { x: 1, y: 1 };
  var mass = 0;
  var centreOfMass = { x: 0, y: 0 };
  var massDistances = { x: 0, y: 0 };
  var width = boundingRect.maxX - boundingRect.minX;
  var height = boundingRect.maxY - boundingRect.minY;
  resolution.x = width < accuracy ? 1 : Math.round(width / accuracy);
  resolution.y = height < accuracy ? 1 : Math.round(height / accuracy);
  var startPoint = { x: boundingRect.minX, y: boundingRect.minY };
  var checkPoint = {};
  for (var i = 0; i < width; i += resolution.x) {
    for (var j = 0; j < height; j += resolution.y) {
      checkPoint.x = startPoint.x + i;
      checkPoint.y = startPoint.y + j;
      var pointInShape = isPointInShape({ x: 0, y: 0 }, vertices, checkPoint);
      if (pointInShape) {
        mass += resolution.x * resolution.y;
        count += 1;
        massDistances.x += checkPoint.x;
        massDistances.y += checkPoint.y;
      }
    }
  }
  centreOfMass.x = massDistances.x / count + centre.x;
  centreOfMass.y = massDistances.y / count + centre.y;
  //console.log({mass: mass, centreOfMass: centreOfMass});
  //console.log('count', count);
  return { mass: mass, centreOfMass: centreOfMass };
}
