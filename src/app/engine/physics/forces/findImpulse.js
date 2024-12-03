import Scene from '../../scenes/scene';

export default function findImpulse(data, masses, centres){
  var collisionPoint = data.collisionPoint;
  var collisionPointVelocityA = data.velocityA;
  var collisionPointVelocityB = data.velocityB;
  var collisionDistanceA = data.collisionDistanceA;
  var collisionDistanceB = data.collisionDistanceB;
  var massA = masses.massA;
  var massB = masses.massB;
  var momentOfInertiaA = masses.momentOfInertiaA;
  var momentOfInertiaB = masses.momentOfInertiaB;
  var unitNormal = data.unitNormal;
  var collisionVelocity = data.collisionVelocity;
  var collisionVelocityNormalDotProduct = collisionVelocity.dotProd(unitNormal);
  var collisionDistanceNormalCrossProductA = collisionDistanceA.crossProd(unitNormal);
  var collisionDistanceNormalCrossProductB = collisionDistanceB.crossProd(unitNormal);
  var collisionDistSquareA = collisionDistanceNormalCrossProductA.square();
  var collisionDistSquareB = collisionDistanceNormalCrossProductB.square();
  var e = Scene.settings.restitution;
  var impulse = -(1 + e) * collisionVelocityNormalDotProduct / (1/massA + 1/massB + collisionDistSquareA/momentOfInertiaA + collisionDistSquareB/momentOfInertiaB);
  return impulse;
}
