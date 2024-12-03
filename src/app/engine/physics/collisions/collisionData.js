import ShapesController from "../../shapes/ShapesController";
import Vector, { magnitude, rotateVector } from "../../utils/maths/Vector";
import findCollidingSide from "./findCollidingSide";
import findSideUnitNormal from "./findSideUnitNormal";

export default function collisionData(
  shapeAIndex,
  shapeBIndex,
  collisionPoint,
  shapeBVertices,
  velocities
) {
  var referenceVectors = ShapesController.getProperty(
    shapeBIndex,
    "referenceVectors"
  );
  var referenceSideVector = referenceVectors.sideVector;

  var velocityA = velocities.velocityA;
  var velocityB = velocities.velocityB;

  var angularVelocityA = velocities.angularVelocityA;
  var angularVelocityB = velocities.angularVelocityB;

  var massA = ShapesController.getProperty(shapeAIndex, "mass", true);
  var massB = ShapesController.getProperty(shapeBIndex, "mass", true);

  var centreA = ShapesController.getProperty(shapeAIndex, "centreOfMass");
  var centreB = ShapesController.getProperty(shapeBIndex, "centreOfMass");

  var collisionPointA = {
    x: collisionPoint.x - centreA.x,
    y: collisionPoint.y - centreA.y
  };
  var collisionPointB = {
    x: collisionPoint.x - centreB.x,
    y: collisionPoint.y - centreB.y
  };

  var collisionPointDistanceA = magnitude(collisionPointA);
  var collisionPointDistanceB = magnitude(collisionPointB);

  var tangentialVelocityMagnitudeA = Math.abs(
    collisionPointDistanceA * angularVelocityA
  );
  var tangentialVelocityMagnitudeB = Math.abs(
    collisionPointDistanceB * angularVelocityB
  );

  // var tangentialVelocityA = {x: tangentialVelocityMagnitudeA * Math.sin(angularVelocityA), y: tangentialVelocityMagnitudeA * Math.cos(angularVelocityA)};
  // var tangentialVelocityB = {x: tangentialVelocityMagnitudeB * Math.sin(angularVelocityB), y: tangentialVelocityMagnitudeB * Math.cos(angularVelocityB)};

  // below are the coordinates of the collisionpoint after being rotated by the angularVelocity angle
  var collisionPointRotationA = rotateVector(angularVelocityA, {
    x: collisionPointA.x,
    y: collisionPointA.y
  });
  var collisionPointRotationB = rotateVector(angularVelocityB, {
    x: collisionPointB.x,
    y: collisionPointB.y
  });

  var tangentialVelocityA = {
    x: collisionPointRotationA.x - collisionPointA.x,
    y: collisionPointRotationA.y - collisionPointA.y
  };
  var tangentialVelocityB = {
    x: collisionPointRotationB.x - collisionPointB.x,
    y: collisionPointRotationB.y - collisionPointB.y
  };

  var collisionPointVelocityA = {
    x: velocityA.x + tangentialVelocityA.x,
    y: velocityA.y + tangentialVelocityA.y
  };
  var collisionPointVelocityB = {
    x: velocityB.x + tangentialVelocityB.x,
    y: velocityB.y + tangentialVelocityB.y
  };

  var collisionVelocity = new Vector({
    x: collisionPointVelocityA.x - collisionPointVelocityB.x,
    y: collisionPointVelocityA.y - collisionPointVelocityB.y
  });
  //console.log('================================collisionVelocity', collisionVelocity);

  var collidingSideData = findCollidingSide(
    collisionPoint,
    shapeBVertices,
    collisionPointVelocityA,
    collisionPointVelocityB,
    centreB,
    shapeBIndex
  );

  var collidingSideVector = {
    x: collidingSideData.side[1].x - collidingSideData.side[0].x,
    y: collidingSideData.side[1].y - collidingSideData.side[0].y
  };

  var unitNormalB = findSideUnitNormal(
    collidingSideVector,
    referenceSideVector,
    referenceVectors.unitNormal
  );

  // console.log('collidingSideVector', collidingSideVector);
  // console.log('referenceVectors', referenceVectors);

  var collisionDistanceA = new Vector({
    x: collidingSideData.x - centreA.x,
    y: collidingSideData.y - centreA.y
  });
  var collisionDistanceB = new Vector({
    x: collidingSideData.x - centreB.x,
    y: collidingSideData.y - centreB.y
  });

  var data = {
    shapeBIndex,
    collisionPoint,
    side: collidingSideData.side,
    sideVector: collidingSideVector,
    unitNormal: unitNormalB,
    collisionPointVelocityA,
    collisionPointVelocityB,
    collisionVelocity,
    collisionDistanceA,
    collisionDistanceB
  };

  console.log("================================>data", data);
  return data;
}
