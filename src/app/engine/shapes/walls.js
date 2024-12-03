import { shapeSelection, createShape } from "./shapes";
import { rotateShape } from "../utils/maths/Vector";
import { reCentreVertices } from "../shapes/reCentre";

export function createWall(canvas, thickness) {
  // const width = 500;
  console.log("===================== createWall");
  // const height = 300;
  let { width, height } = canvas;
  // height = height / 2;
  // width = width / 2;
  // console.log({ width, height });
  const vertices = [
    { x: -(width / 2) - 1, y: -height / 2 },
    { x: width / 2 + 1, y: -height / 2 },
    { x: width / 2 + 1, y: height / 2 + 1 },
    { x: -(width / 2) - thickness, y: height / 2 + 1 },
    { x: -(width / 2) - thickness, y: height / 2 + thickness },
    { x: width / 2 + thickness, y: height / 2 + thickness },
    { x: width / 2 + thickness, y: -height / 2 - thickness },
    { x: -width / 2 - thickness, y: -height / 2 - thickness },
    { x: -(width / 2) - thickness, y: height / 2 },
    { x: -(width / 2) - 1, y: height / 2 },
  ];

  const Wall = createShape({ x: 0, y: 0 }, vertices);
  Wall.centreOfMass = { x: width / 2, y: height / 2 };
  // const Wall = createShape({ x: width, y: height }, vertices);

  Wall.fillColour = "transparent";
  Wall.physics.mass = Infinity;
  Wall.physics.momentOfInertia = Infinity;
  Wall.physics.momentOfInertiaCOM = Infinity;
  Wall.physics.acceleration = { x: 0, y: 0 };
  Wall.type = "fixed";
  Wall.events.subscribed = false;
  Wall.events.subscribed = false;

  const square = createShape({ x: 200, y: 252 }, [
    { x: -18, y: -18 },
    { x: 18, y: -18 },
    { x: 18, y: 18 },
    { x: -18, y: 18 },
  ]);

  square.fillColour = "red";
  square.physics.velocity.x = 0.2;

  const bar = createShape({ x: 470, y: 262 }, shapeSelection.bar);
}

// export function createWalls() {
//   const leftWall = createShape({ x: -19, y: 297 }, shapeSelection.verticalWall);
//   leftWall.fillColour = "transparent";
//   leftWall.physics.mass = Infinity;
//   leftWall.physics.momentOfInertia = Infinity;
//   leftWall.physics.momentOfInertiaCOM = Infinity;
//   leftWall.physics.acceleration = { x: 0, y: 0 };
//   leftWall.type = "fixed";
//   leftWall.events.subscribed = false;
//   leftWall.events.subscribed = false;

//   const rightWall = createShape(
//     { x: 1018, y: 297 },
//     shapeSelection.verticalWall
//   );
//   rightWall.fillColour = "transparent";
//   rightWall.physics.mass = Infinity;
//   rightWall.physics.momentOfInertia = Infinity;
//   rightWall.physics.momentOfInertiaCOM = Infinity;
//   rightWall.physics.acceleration = { x: 0, y: 0 };
//   rightWall.type = "fixed";
//   rightWall.events.subscribed = false;
//   rightWall.events.subscribed = false;

//   const bottomWall = createShape(
//     { x: 500, y: 619 },
//     shapeSelection.horizontalWall
//   );
//   bottomWall.fillColour = "transparent";
//   bottomWall.physics.mass = Infinity;
//   bottomWall.physics.momentOfInertia = Infinity;
//   bottomWall.physics.momentOfInertiaCOM = Infinity;
//   bottomWall.physics.acceleration = { x: 0, y: 0 };
//   bottomWall.type = "fixed";
//   bottomWall.events.subscribed = false;
//   bottomWall.events.subscribed = false;

//   const topWall = createShape(
//     { x: 500, y: -20 },
//     shapeSelection.horizontalWall
//   );
//   topWall.fillColour = "transparent";
//   topWall.physics.mass = Infinity;
//   topWall.physics.momentOfInertia = Infinity;
//   topWall.physics.momentOfInertiaCOM = Infinity;
//   topWall.physics.acceleration = { x: 0, y: 0 };
//   topWall.type = "fixed";
//   topWall.events.subscribed = false;
//   topWall.events.subscribed = false;
// }
// const box = createShape({x: 350, y: 300}, shapeSelection.box);

// const hexagon = createShape({x: 465, y: 250}, shapeSelection.hexagon);
// const bar = createShape({x: 420, y: 300}, shapeSelection.bar);
// const hexagon = createShape({x: 465, y: 250}, shapeSelection.hexagon);
// hexagon.physics.velocity.x = -0.005;

/** collision bugs**/

// const bar = createShape({ x: 20, y: 252 }, shapeSelection.bar);
// bar.physics.velocity.x = -0.01;

/* ---------------------------- Two vertical bars ------------------------------------------- */
// const bar = createShape({ x: 430, y: 252 }, shapeSelection.bar);
// const bar1 = createShape({ x: 470, y: 262 }, shapeSelection.bar);
// bar1.physics.velocity.x = -0.02;

/* ----------------------------------------------------------------------- */
// const bar2 = createShape({ x: 430, y: 252 }, shapeSelection.bar);
// const bar3 = createShape({ x: 480, y: 252 }, shapeSelection.bar);
// bar3.physics.velocity.x = -0.005;

/* ----------------------------------------------------------------------- */
// const bar4 = createShape({ x: 430, y: 400 }, shapeSelection.bar);
// const bar5 = createShape({ x: 570, y: 252 }, shapeSelection.bar);
// bar5.physics.angularVelocity = -0.00025;

/* ----------------------------------------------------------------------- */
// const bar5 = createShape({ x: 430, y: 250 }, shapeSelection.bar);
// const bar6 = createShape({ x: 600, y: 230 }, shapeSelection.bar);
// rotateShape({ x: 570, y: 252 }, Math.PI / 2, 5);
// bar6.physics.velocity.x = -0.005;

/* ----------------------------------------------------------------------- */
/*** Multiple object collisions ***/
// const bar7 = createShape({ x: 430, y: 300 }, shapeSelection.bar);
// const square = createShape({ x: 570, y: 200 }, shapeSelection.square);
// const square2 = createShape({ x: 570, y: 400 }, shapeSelection.square);
// square.physics.velocity.x = -0.05;
// square2.physics.velocity.x = -0.05;

/* ----------------------------------------------------------------------- */
// const hexagon = createShape({ x: 650, y: 300 }, shapeSelection.hexagon);
// createShape({ x: 450, y: 300 }, shapeSelection.hexagon);
// createShape({ x: 507, y: 300 }, shapeSelection.hexagon);
// createShape({ x: 575, y: 300 }, shapeSelection.arrow);

// hexagon.physics.velocity.x = -0.1;
// /* ----------------------------------------------------------------------- */
// const hexagon = createShape({ x: 600, y: 300 }, shapeSelection.hexagon);
// const square = createShape({ x: 470, y: 300 }, shapeSelection.square);
// const square2 = createShape({ x: 507, y: 300 }, shapeSelection.square);
// const square3 = createShape({ x: 544, y: 300 }, shapeSelection.square);

// hexagon.physics.velocity.x = -0.1;

/* ----------------------------------------------------------------------- */
/*** Newton's Cradle */
// const circle = createShape({ x: 470, y: 300 }, shapeSelection.circle);
// const circle2 = createShape({ x: 510, y: 300 }, shapeSelection.circle);
// const circle3 = createShape({ x: 550, y: 300 }, shapeSelection.circle);
// const circle4 = createShape({ x: 650, y: 300 }, shapeSelection.circle);
// circle.type = "circle";
// circle2.type = "circle";
// circle3.type = "circle";
// circle4.type = "circle";
// circle4.physics.velocity.x = -0.05;

/* ----------------------------------------------------------------------- */
/*** Box within a Box */
// const box = createShape({ x: 500, y: 300 }, shapeSelection.box);
// const square = createShape({ x: 500, y: 302 }, shapeSelection.square);
// rotateShape({ x: 500, y: 302 }, Math.PI / 4, 5);
// square.physics.velocity.x = 0.05;
// square.physics.velocity.y = -0.05;

/* ----------------------------------------------------------------------- */
/*** Two Arrows */
// const arrow = createShape({ x: 500, y: 250 }, shapeSelection.arrow);
// const arrow2 = createShape({ x: 416, y: 250 }, shapeSelection.arrow);
// arrow2.physics.velocity.x = 0.03;

/* ----------------------------------------------------------------------- */
/*** Flying Arrows */

// const arrowVelocity = 0.4;
/** Temporary squares*/
// const square = createShape({ x: 528, y: 272 }, shapeSelection.square);
// const square2 = createShape({ x: 528, y: 428 }, shapeSelection.square);

//   /**Temporary commenting */
// const arrow3 = createShape({ x: /*500*/ 545, y: 300 }, shapeSelection.arrow);
// const arrow5 = createShape({ x: /*500*/ 545, y: 350 }, shapeSelection.arrow);
// const arrow7 = createShape({ x: /*500*/ 545, y: 400 }, shapeSelection.arrow);

// const arrow4 = createShape({ x: 416, y: 300 }, shapeSelection.arrow);
// const arrow6 = createShape({ x: 416, y: 350 }, shapeSelection.arrow);
// const arrow8 = createShape({ x: 416, y: 400 }, shapeSelection.arrow);

// arrow4.physics.velocity.x = arrowVelocity;
// arrow6.physics.velocity.x = arrowVelocity;
// arrow8.physics.velocity.x = arrowVelocity;

// arrow3.physics.velocity.x = -arrowVelocity;
// arrow5.physics.velocity.x = -arrowVelocity;
// arrow7.physics.velocity.x = -arrowVelocity;

/* ----------------------------------------------------------------------- */
// Step 32 wrong colliding sides chosen
/*** Step 31 */
// const bar = createShape({ x: 600, y: 252 }, shapeSelection.bar);
// const bar2 = createShape({ x: 300, y: 252 }, shapeSelection.bar);
// rotateShape({ x: 570, y: 252 }, Math.PI / 4, 4);
// bar.physics.velocity.x = -1.2;
