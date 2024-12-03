import Vector from './Vector';

console.log('Vector', Vector);
var v1 = new Vector({x:5, y:-4, z:-15});
var v2 = new Vector({x:4, y:6, z:-8});

var m1 = new Matrix({r1: [1, 2, 3], r2: [4, 5, 6], r3: [7, 8, 9]});
var m2 = new Matrix({r1: [5, 5, 3], r2: [6, 8, 9], r3: [10, 7, 3]});

var v3 = v1.add(v2);
var v4 = v1.crossProd(v2);
var v5 = v1.scalProd(5);
var v6 = v1.dotProd(v2);

var m3 = m1.mMult(m2);
var v7 = m1.vMult(v1);

// console.log('m1', m1);
// console.log('m2', m2);
// console.log('m3', m3);
// console.log('v7', v7);

// console.log('v1', v1);
// console.log('v2', v2);
// console.log('v3', v3);
// console.log('crossProd v4', v4);
// console.log('v5', v5);
// console.log('dotProd v6', v6);
//
// var v10 = new Vector({x:3, y:4, z:8});
// console.log('v10.magnitude', v10.magnitude);

var vector1 = new Vector({x:0, y:1});
var vector1a = new Vector({x:0, y:2})
var vector2 = new Vector({x:1, y:1});
var vector3 = new Vector({x:1, y:0});
var vector4 = new Vector({x:1, y:-1});
var vector5 = new Vector({x:0, y:-1});
var vector6 = new Vector({x:-1, y:-1});
var vector7 = new Vector({x:-1, y:0});
var vector8 = new Vector({x:-1, y:1});

vector1.findAngle(vector1);
vector1.findAngle(vector2);
vector1.findAngle(vector3);
vector1.findAngle(vector4);
vector1.findAngle(vector5);
vector1.findAngle(vector6);
vector1.findAngle(vector7);
vector1.findAngle(vector8);

vector1.findAngle(vector2);
vector1.isParallel(vector5);
console.log('crossProd', vector1.crossProd(vector2));

var referenceSideVector1 = new Vector({x: 35.99988336809515, y: -0.09163778449409044, z: 0, magnitude: 36.00000000000001});
var collidingSideVector1 = new Vector({x: -35.9998833680952, y: 0.09163778449408255, z: 0, magnitude: 36.00000000000006});
var angle1 = referenceSideVector1.findAngle(collidingSideVector1);
//console.log('=====================angle', angle1);
