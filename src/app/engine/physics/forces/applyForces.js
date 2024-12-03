import ShapesController from '../../shapes/ShapesController';

export default function applyForces(i){
  var acceleration = {};
  var angularAcceleration;
  // simplified implementation which assumes there is only one force at the centre of mass, torque is assumed to be also around the centre of mass
  var forcesCOM = ShapesController.getProperty(i, 'forcesCOM', true);
  var mass = ShapesController.getProperty(i, 'mass', true);
  var torque = ShapesController.getProperty(i, 'torque', true);
  var momentOfInertiaCOM = ShapesController.getProperty(i, 'momentOfInertiaCOM', true);
  acceleration.x = forcesCOM[0].x / mass;
  acceleration.y = forcesCOM[0].y / mass;
  angularAcceleration = torque / momentOfInertiaCOM;
  ShapesController.setProperty(i, 'acceleration', acceleration, true);
  ShapesController.setProperty(i, 'angularAcceleration', angularAcceleration, true);
}
