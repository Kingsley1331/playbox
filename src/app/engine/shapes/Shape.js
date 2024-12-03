import { findMass } from "../physics/mass/mass";
import findBoundingRect from "./findBoundingRect";
import { findMomentOfInertiaCOM } from "../physics/mass/momentOfInertia";
import referenceVectors from "../physics/collisions/referenceVectors";
import checkEvents from "../utils/checkEvents";

export default class Shape {
  constructor(centre, vertices) {
    const boundingRect = findBoundingRect(vertices);
    const massData = findMass(centre, vertices, boundingRect);
    const centreOfMass = massData.centreOfMass;
    const momentOfInertiaCOM = findMomentOfInertiaCOM(
      centreOfMass,
      vertices,
      boundingRect
    );
    const references = referenceVectors(centre, vertices);
    this.id;
    this.type = "";
    this.fillColour = "#6495ED";
    this.strokeStyle = "black";
    this.linewidth = 0.7;
    this.centreOfMass = centreOfMass;
    this.centreOfRotation = centreOfMass;
    this.vertices = vertices;
    this.physics = {
      density: 1,
      mass: massData.mass,
      momentOfInertiaCOM: momentOfInertiaCOM,
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      angularVelocity: 0,
      angularAcceleration: 0,
      forcesCOM: [{ x: 0, y: 0 }],
      torque: 0
    };
    this.touchPoint = [];
    this.display = [];
    this.boundingRect = boundingRect;
    this.collisionData = {};
    this.referenceVectors = references;
    this.colliding = false;
    this.onShape = false;
    this.dragging = false;
    this.onClick = false;
    this.doubleClick = false;
    // this.onDoubleClick = false;
    this.selected = false;
    this.events = {
      subscribed: true
    };
    this.tags = [];
    this.checkEvents = checkEvents;
    this.isShapeFixed = false;
  }

  set freezeShape(value) {
    if (value === true) {
      this.physics.mass = Infinity;
      this.physics.momentOfInertiaCOM = Infinity;
      this.isShapeFixed = true;
    } else {
      const boundingRect = findBoundingRect(this.vertices);
      const { mass } = findMass(this.centreOfMass, this.vertices, boundingRect);
      const momentOfInertiaCOM = findMomentOfInertiaCOM(
        this.centreOfMass,
        this.vertices,
        boundingRect
      );

      this.physics.mass = mass;
      this.physics.momentOfInertiaCOM = momentOfInertiaCOM;
      this.isShapeFixed = false;
    }
  }
}
