import Scene from "../../scenes/scene";
import { forEachShape, isPointInShape } from "../../shapes/shapes";
import ShapesController from "../../shapes/ShapesController";
import collisionData from "./collisionData";
import findImpulse from "../forces/findImpulse";
import findVelocities from "../motion/findVelocities";
import collisionHandler from "./collisionHandler";
import collisionHandler1 from "./collisionHandler1";
const newCollision = 1;
const newHandler = 1;

export default function collisionDetector() {
  var shapes = Scene.shapes;
  var numShapes = shapes.length;
  forEachShape(function(i) {
    ShapesController.setProperty(i, "colliding", false);
  });

  let aCollisions = {};
  let bCollisions = {};
  forEachShape(function(i) {
    if (Scene.selected === "play" || Scene.selected === "step") {
      // let collisionDataArray = [];
      let collidingShapesData = {};
      var verticesA = ShapesController.getProperty(i, "vertices"); //ShapeA
      var centreOfMassA = ShapesController.getCentreOfMass(i);
      var length = verticesA.length;

      vertices: for (var vertIndexA = 0; vertIndexA < length; vertIndexA++) {
        // loop through all the vertices of shapeA
        let checkPoint = {};
        checkPoint.x = verticesA[vertIndexA].x + centreOfMassA.x;
        checkPoint.y = verticesA[vertIndexA].y + centreOfMassA.y;
        var collidingShape;

        innerShapes: for (var k = 0; k < numShapes; k++) {
          // check all other shapes against the vertex
          const lastShapeIndex =
            numShapes - 1 === i ? numShapes - 2 : numShapes - 1; // find index of the last shape to be checked
          if (i !== k) {
            var verticesB = ShapesController.getProperty(k, "vertices"); //shapeB
            var centreOfMassB = ShapesController.getProperty(k, "centreOfMass");

            if (isPointInShape(centreOfMassB, verticesB, checkPoint)) {
              ShapesController.setProperty(i, "colliding", true);
              ShapesController.setProperty(k, "colliding", true);

              const shapeAId = ShapesController.getProperty(i, "id");
              const shapeBId = ShapesController.getProperty(k, "id");

              Scene.currentEvents.collision.pairs.push([shapeBId, shapeAId]);
              collidingShape = k;

              /*** After vertex checks all other shapes ***/
              if (
                typeof collidingShape === "number" &&
                collidingShape !== verticesA[vertIndexA].collidingShape
              ) {
                verticesA[vertIndexA].collidingShape = collidingShape;

                // console.count('****************************************************************COLLISION COUNT');

                /*************************************************************************************************START PHYSICS ********************************************************************************/

                var velocityA = ShapesController.getProperty(
                  i,
                  "velocity",
                  true
                );
                var velocityB = ShapesController.getProperty(
                  collidingShape,
                  "velocity",
                  true
                );

                var angularVelocityA = ShapesController.getProperty(
                  i,
                  "angularVelocity",
                  true
                );
                var angularVelocityB = ShapesController.getProperty(
                  collidingShape,
                  "angularVelocity",
                  true
                );

                const velocities = {
                  velocityA,
                  velocityB,
                  angularVelocityA,
                  angularVelocityB
                };

                var centreOfRotationA = ShapesController.getProperty(
                  i,
                  "centreOfRotation"
                );
                var centreOfRotationB = ShapesController.getProperty(
                  collidingShape,
                  "centreOfRotation"
                );

                var data = collisionData(
                  i,
                  collidingShape,
                  checkPoint,
                  verticesB,
                  velocities
                );
                // collisionDataArray.push(data);

                if (collidingShapesData[collidingShape]) {
                  collidingShapesData[collidingShape].push(data);
                } else {
                  collidingShapesData[collidingShape] = [data];
                }
                if (newHandler) {
                  aCollisions[i] = collidingShapesData;
                }
                if (bCollisions[collidingShape]) {
                  bCollisions[collidingShape].push(i);
                } else {
                  bCollisions[collidingShape] = [i];
                }

                /** Collision handling start **/
                if (!newCollision) {
                  ShapesController.setProperty(
                    collidingShape,
                    "collisionData",
                    data
                  );
                  console.log("%coriginal collision", "color:red");
                  var massA = ShapesController.getProperty(i, "mass", true);
                  var massB = ShapesController.getProperty(
                    collidingShape,
                    "mass",
                    true
                  );

                  var momentOfInertiaA = ShapesController.getProperty(
                    i,
                    "momentOfInertiaCOM",
                    true
                  );
                  var momentOfInertiaB = ShapesController.getProperty(
                    collidingShape,
                    "momentOfInertiaCOM",
                    true
                  );
                  var unitNormal = data.unitNormal;
                  var masses = {
                    massA: massA,
                    massB: massB,
                    momentOfInertiaA: momentOfInertiaA,
                    momentOfInertiaB: momentOfInertiaB
                  };
                  var centres = {
                    centreA: centreOfMassA,
                    centreB: centreOfMassB
                  };

                  const newVelocity = findVelocities(
                    data,
                    masses,
                    centres,
                    velocities,
                    findImpulse
                  );
                  const newVelocityA = newVelocity.linearA;
                  const newVelocityB = newVelocity.linearB;
                  const newAngularVelocityA = newVelocity.angularA;
                  const newAngularVelocityB = newVelocity.angularB;

                  //verticesA[vertIndexA].isOverlapping = true;

                  ShapesController.setProperty(
                    i,
                    "velocity",
                    newVelocityA,
                    true
                  );
                  ShapesController.setProperty(
                    i,
                    "angularVelocity",
                    newAngularVelocityA,
                    true
                  );

                  ShapesController.setProperty(
                    collidingShape,
                    "velocity",
                    newVelocityB,
                    true
                  );
                  ShapesController.setProperty(
                    collidingShape,
                    "angularVelocity",
                    newAngularVelocityB,
                    true
                  );
                }
                /** Collision handling end **/
                /****************************************************************************************END PHYSICS ***********************************************************************************/
              }
              break innerShapes;
            } else if (k === lastShapeIndex) {
              // check if current shape is the last shape to be checked
              verticesA[vertIndexA].collidingShape = null;
              ShapesController.setProperty(i, "vertices", verticesA);
            }
          }
        }
      }
      /** Collision handling **/

      // console.log('collisionDataArray', collisionDataArray);
      if (
        Object.keys(collidingShapesData).length > 0 &&
        newCollision &&
        !newHandler
      ) {
        console.log("%cnew collision", "color:red");
        console.log("%coriginal collision handler", "color:red");
        collisionHandler(collidingShapesData, i);
      }
    }
  });
  if (Object.keys(aCollisions).length > 0 && newCollision && newHandler) {
    console.log("%cnew collision handler", "color:red");
    console.log("aCollisions", aCollisions);
    console.log("bCollisions", bCollisions);
    collisionHandler1(aCollisions, bCollisions);
  }
}
