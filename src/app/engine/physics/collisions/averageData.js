import Vector from "../../utils/maths/Vector";
const averageData = (dataArray, centreOfMassA, centreOfMassB) => {
  const length = dataArray.length;
  let collisionPoint = new Vector({ x: 0, y: 0 });
  let collisionVelocity = new Vector({ x: 0, y: 0 });
  let collisionDistanceA = new Vector({ x: 0, y: 0 });
  let collisionDistanceB = new Vector({ x: 0, y: 0 });
  let collisionPointVelocityA = new Vector({ x: 0, y: 0 });
  let collisionPointVelocityB = new Vector({ x: 0, y: 0 });
  let unitNormal = new Vector({ x: 0, y: 0 });

  for (let data of dataArray) {
    collisionPoint.x += data.collisionPoint.x;
    collisionPoint.y += data.collisionPoint.y;

    collisionVelocity.x += data.collisionVelocity.x;
    collisionVelocity.y += data.collisionVelocity.y;

    collisionDistanceA.x += data.collisionDistanceA.x;
    collisionDistanceA.y += data.collisionDistanceA.y;

    collisionDistanceB.x += data.collisionDistanceB.x;
    collisionDistanceB.y += data.collisionDistanceB.y;

    collisionPointVelocityA.x += data.collisionPointVelocityA.x;
    collisionPointVelocityA.y += data.collisionPointVelocityA.y;

    collisionPointVelocityB.x += data.collisionPointVelocityB.x;
    collisionPointVelocityB.y += data.collisionPointVelocityB.y;

    unitNormal.x += data.unitNormal.x;
    unitNormal.y += data.unitNormal.y;
  }
  collisionPoint.x /= length;
  collisionPoint.y /= length;
  collisionVelocity.x /= length;
  collisionVelocity.y /= length;
  collisionDistanceA.x /= length;
  collisionDistanceA.y /= length;
  collisionDistanceB.x /= length;
  collisionDistanceB.y /= length;
  collisionPointVelocityA.x /= length;
  collisionPointVelocityA.y /= length;
  collisionPointVelocityB.x /= length;
  collisionPointVelocityB.y /= length;
  unitNormal.x /= length;
  unitNormal.y /= length;

  return {
    shapeBIndex: dataArray[0].shapeBIndex,
    collisionPoint,
    side: dataArray[0].side,
    sideVector: dataArray[0].sideVector,
    unitNormal,
    collisionPointVelocityA,
    collisionPointVelocityB,
    collisionVelocity,
    collisionDistanceA,
    collisionDistanceB
  };
};

export default averageData;
