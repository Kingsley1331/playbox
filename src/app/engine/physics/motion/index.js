import Scene from "../../scenes/scene";
import ShapesController from "../../shapes/ShapesController";
import { rotateShape } from "../../utils/maths/Vector";

export function applyMotion(i, tDelta) {
  const velFactor = 0.1;
  // if(selectedShape === 'play'){
  if (Scene.selected === "play" || Scene.selected === "step") {
    var acceleration = ShapesController.getProperty(i, "acceleration", true);

    var angularAcceleration = ShapesController.getProperty(
      i,
      "angularAcceleration",
      true
    );
    var velocity = ShapesController.getProperty(i, "velocity", true);
    // console.log('velocity', velocity);
    var angularVelocity = ShapesController.getProperty(
      i,
      "angularVelocity",
      true
    );
    // console.log('============================>angularVelocity', angularVelocity);
    // console.log('============================>tDelta', tDelta);
    var centreOfMass = ShapesController.getCentreOfMass(i);
    var centreOfRotation = ShapesController.getProperty(i, "centreOfRotation");
    // var referenceVectors = ShapesController.getProperty(i, 'referenceVectors');
    // var location = referenceVectors.location;
    /** velocity equation looks dodgy should look like deltaVelocity = acceleration * deltaTime **/
    velocity.x += acceleration.x * tDelta * velFactor;
    velocity.y += acceleration.y * tDelta * velFactor;
    // location.x += acceleration.x;
    // location.y += acceleration.y;
    angularVelocity += angularAcceleration * tDelta;
    // velocity = { x: 0.5, y: 0 };
    centreOfMass.x += velocity.x * tDelta;
    centreOfMass.y += velocity.y * tDelta;

    ShapesController.setProperty(i, "angularVelocity", angularVelocity, true);
    ShapesController.setProperty(i, "centreOfMass", centreOfMass);
    ShapesController.setProperty(i, "centreOfRotation", centreOfMass);
    ShapesController.setProperty(i, "velocity", velocity);
    // console.log('============================>angularVelocity', angularVelocity);
    rotateShape(centreOfRotation, angularVelocity * tDelta, i);
  }
}
