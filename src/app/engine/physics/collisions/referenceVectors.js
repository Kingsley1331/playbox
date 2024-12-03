import { isPointInShape } from '../../shapes/shapes';
import Vector, { rotateVector } from '../../utils/maths/Vector';

export default function referenceVectors(centre, vertices){
  var firstPoint = {x: vertices[0].x, y: vertices[0].y};
  var secondPoint = {x: vertices[1].x, y: vertices[1].y};
  //turn the first side into a vector pointing away from the first point
  var firstSideVector = new Vector({x: secondPoint.x - firstPoint.x, y: secondPoint.y - firstPoint.y});
  var sideLength = firstSideVector.magnitude;
  var angle = Math.PI / 2;
  var normalVector = rotateVector(angle, firstSideVector);
  var unitNormal = {x: normalVector.x / sideLength, y: normalVector.y / sideLength};
  var location = {x: firstPoint.x + firstSideVector.x/2, y: firstPoint.y + firstSideVector.y/2};
  var point = {x:centre.x + location.x + unitNormal.x, y: centre.y + location.y + unitNormal.y}
  var pointInShape = isPointInShape(centre, vertices, point);
  if(pointInShape){
    unitNormal = {x: -unitNormal.x, y: -unitNormal.y};
  }
  /** TODO - Should be able to change property name sideVector => firstSideVector without having to make changes everywhere **/
  return {location, sideVector: firstSideVector, unitNormal};
}
