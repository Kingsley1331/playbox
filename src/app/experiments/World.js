import planck, { Vec2 } from "planck";

const Scene = {};

const fixtures = [];

const world = new planck.World(new Vec2(0, -10));

Scene.fixtures = fixtures;
Scene.world = world;
Scene.scale = 20;
// Scene.translation = { x: 0, y: 0 };
Scene.polylinePoints = [];
Scene.mousePos = { x: 0, y: 0 };
// Scene.isPolylines = false;
Scene.mode = "";
Scene.dragAndThrow = { selectedBody: null, mouseJoint: null };
Scene.dragAndDrop = { selectedBody: null };
// Scene.selectedBody = null;
// Scene.rotationStartPoint = null;
// Scene.rotationStartAngle = 0;
Scene.canvas = {
  element: null,
  context: null,
  width: 2400,
  height: 1200,
};

Scene.handlers = {
  mousemove: null,
  mousedown: null,
  mouseup: null,
  click: null,
  doubleClick: null,
};

// export function addFixture(fixture) {
//   Scene.fixtures.push(fixture);
//   //   Scene.fixtures = [...Scene.fixtures, { ...fixture }];
// }

// export function addFixtures(world) {
//   const bodies = world.getBodyList();
//   for (let b = bodies; b; b = b.getNext()) {
//     console.log("bodies", b);
//     for (let f = b.getFixtureList(); f; f = f.getNext()) {
//       console.log("fixtures", f);
//       Scene.fixtures = push(f);
//       // for (let v = f.getShape().getVertices(); v; v = v.getNext()) {
//       //   console.log("vertices", v);
//       // }
//     }
//   }
// }

export { Scene };
