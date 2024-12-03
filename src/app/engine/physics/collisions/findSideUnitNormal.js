import Vector, { magnitude, rotateVector } from '../../utils/maths/Vector';

export default function findSideUnitNormal(collidingSideVector, referenceSideVector, referenceVector){
  collidingSideVector = new Vector(collidingSideVector);
  referenceVector = new Vector(referenceVector);
  var angle = referenceSideVector.findAngle(collidingSideVector);
  var unitNormal = rotateVector(angle, referenceVector);
  return unitNormal;
}
