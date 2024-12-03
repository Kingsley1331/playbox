import Scene from "../../scenes/scene";
import Matrix from "./Matrix";
import ShapesController from "../../shapes/ShapesController";
import findBoundingRect from "../../shapes/findBoundingRect";

/** check direction from vector1 to vector2 **/
export function checkDirection(vector1, vector2, angle) {
  var rotatedVector = rotateVector(angle, vector1);
  var direction = "anti-clockwise";
  var dotProd = vector2.dotProd(rotatedVector);
  var isParallel = rotatedVector.isParallel(vector2);
  // dotProd > 0 means that the vectors are facing the same direction
  if (isParallel === true && dotProd >= 0) {
    return "anti-clockwise";
  } else {
    return "clockwise";
  }
}

export function rotateVector(theta, vector) {
  var vector = new Vector(vector);
  var rotationMatrix = new Matrix({
    r1: [Math.cos(theta), -Math.sin(theta), 0],
    r2: [Math.sin(theta), Math.cos(theta), 0],
    r3: [0, 0, 1]
  });
  // console.log('vector', vector);
  // console.log('rotationMatrix', rotationMatrix);
  var rotatedVector = rotationMatrix.vMult(vector);
  //console.log('rotatedVector', rotatedVector);
  return rotatedVector;
}

export function rotateShape(centre, theta, index, referenceVertices) {
  // theta *= -1
  if (Scene.shapes[0]) {
    //var centreOfMass = ShapesController.getProperty(index, 'centreOfMass');
    //var vertices = ShapesController.getProperty(index, 'vertices');
    var centreOfMass =
      typeof index === "number"
        ? ShapesController.getProperty(index, "centreOfMass")
        : centre;

    var vertices =
      typeof index === "number"
        ? referenceVertices
          ? referenceVertices
          : ShapesController.getProperty(index, "vertices")
        : index;

    // var vertices =
    //   typeof index === "number"
    //     ? ShapesController.getProperty(index, "vertices")
    //     : index;

    var rotatedVertices = [];
    var length = vertices.length;
    var centreOR = {
      x: centreOfMass.x - centre.x,
      y: centreOfMass.y - centre.y
    };
    for (var i = 0; i < length; i++) {
      //if(vertices.length === 6 && i === 4){console.log('collidingShape', vertices[4].collidingShape)};

      var rotatedVertex = rotateVector(theta, {
        x: vertices[i].x,
        y: vertices[i].y
      });

      for (let prop in vertices[i]) {
        if (prop !== "x" && prop !== "y") {
          rotatedVertex[prop] = vertices[i][prop];
        }
      }
      rotatedVertices.push(rotatedVertex);

      //if(vertices.length === 6 && i === 4){console.log('collidingShape', rotatedVertex.collidingShape)}
    }

    if (typeof index === "number") {
      var referenceVectors = ShapesController.getProperty(
        index,
        "referenceVectors"
      );
      var location = referenceVectors.location; // need to find way of updating "sub-objects" individually
      var sideVector = referenceVectors.sideVector;
      var unitNormal = referenceVectors.unitNormal;
      if (location) {
        var rotatedLocation = rotateVector(theta, {
          x: location.x,
          y: location.y
        });
      }
      if (sideVector) {
        var rotatedSideVector = rotateVector(theta, {
          x: sideVector.x,
          y: sideVector.y
        });
      }
      if (unitNormal) {
        var rotatedUnitNormal = rotateVector(theta, {
          x: unitNormal.x,
          y: unitNormal.y
        });
      }
      referenceVectors = {
        location: rotatedLocation,
        sideVector: rotatedSideVector,
        unitNormal: rotatedUnitNormal
      };
    }
    var centreOR = {
      x: centreOfMass.x - centre.x,
      y: centreOfMass.y - centre.y
    };
    var rotateCOM = rotateVector(theta, { x: centreOR.x, y: centreOR.y });
    var newCentreOfMass = {
      x: centre.x + rotateCOM.x,
      y: centre.y + rotateCOM.y
    };
    const rotatedBoundingRect = findBoundingRect(rotatedVertices);

    if (typeof index === "number") {
      ShapesController.setProperty(index, "centreOfMass", newCentreOfMass);
      ShapesController.setProperty(index, "vertices", rotatedVertices);
      ShapesController.setProperty(index, "referenceVectors", referenceVectors);
      ShapesController.setProperty(index, "boundingRect", rotatedBoundingRect);
    }
    return rotatedVertices;
  }
}

export function rotateShapeGeneral(vertices, theta) {
  const rotatedVertices = vertices.map(vertex => {
    const rotatedVertex = rotateVector(theta, {
      x: vertex.x,
      y: vertex.y
    });
    return rotatedVertex;
  });

  return rotatedVertices;
}

// export function rotateShapeGeneral(
//   centre,
//   theta,
//   index,
//   referenceVertices,
//   referenceCentreOfMass
// ) {
//   console.log({ referenceCentreOfMass });
//   console.log({ centre });
//   // debugger;
//   // theta *= -1
//   if (Scene.shapes[0]) {
//     // const centreOfMass = ShapesController.getProperty(index, "centreOfMass");

//     const vertices = referenceVertices
//       ? referenceVertices
//       : ShapesController.getProperty(index, "vertices");

//     const rotatedVertices = vertices.map(vertex => {
//       const rotatedVertex = rotateVector(theta, {
//         x: vertex.x,
//         y: vertex.y
//       });
//       return rotatedVertex;
//     });

//     const centreShift = {
//       x: referenceCentreOfMass.x - centre.x,
//       y: referenceCentreOfMass.y - centre.y
//     };
//     console.log("centreShift", centreShift);
//     const rotatedCentreShift = rotateVector(theta, centreShift);

//     const newCentreOfMass = {
//       x: centre.x + rotatedCentreShift.x,
//       y: centre.y + rotatedCentreShift.y
//     };

//     const rotatedBoundingRect = findBoundingRect(rotatedVertices);

//     if (typeof index === "number") {
//       ShapesController.setProperty(index, "centreOfMass", newCentreOfMass);
//       ShapesController.setProperty(index, "vertices", rotatedVertices);
//       ShapesController.setProperty(index, "boundingRect", rotatedBoundingRect);
//     }
//     return rotatedVertices;
//   }
// }

export function doVectorsOppose(vector1, vector2) {
  let angle = vector1.findAngle(vector2);
  angle = Math.abs(angle);
  const condition =
    (angle > Math.PI / 2 && angle < Math.PI) || angle === Math.PI;
  const opposing = condition ? true : false;
  console.log("opposing", opposing);
  return opposing;
}

export function magnitude(vector) {
  var x = vector.x;
  var y = vector.y;
  var z = vector.z;
  const result = vector.z
    ? Math.sqrt(x * x + y * y + z * z)
    : Math.sqrt(x * x + y * y);
  // const result = vector.z ? Math.hypot(x, y, z) : Math.hypot(x, y);
  return result;
}

const Vector = function(vector) {
  var mag = magnitude(vector);
  this.x = vector.x;
  this.y = vector.y;
  this.z = vector.z ? vector.z : 0;
  this.magnitude = mag;
};

Vector.prototype.add = function(vector2) {
  var sum = {
    x: this.x + vector2.x,
    y: this.y + vector2.y,
    z: this.z + vector2.z
  };
  const result = new Vector(sum);
  return result;
};

Vector.prototype.scalProd = function(scale) {
  var product = { x: this.x * scale, y: this.y * scale, z: this.z * scale };
  product = new Vector(product);
  return product;
};

Vector.prototype.dotProd = function(vector2) {
  var product = this.x * vector2.x + this.y * vector2.y + this.z * vector2.z;
  return product;
};

Vector.prototype.square = function() {
  var product = this.x * this.x + this.y * this.y + this.z * this.z;
  return product;
};

Vector.prototype.crossProd = function(vector2) {
  var x = this.y * vector2.z - this.z * vector2.y;
  var y = this.z * vector2.x - this.x * vector2.z;
  var z = this.x * vector2.y - this.y * vector2.x;
  var product = new Vector({ x: x, y: y, z: z });
  return product;
};

Vector.prototype.findAngle = function(vector2) {
  var vector1 = { x: this.x, y: this.y };
  var vector2 = new Vector(vector2);
  var dotProd = this.dotProd(vector2);
  var mag = this.magnitude;
  var mag2 = vector2.magnitude;
  var ratio = dotProd / (mag * mag2);
  //ratio = -5;
  ratio = ratio > 1 ? 1 : ratio < -1 ? -1 : ratio;
  //console.log('ratio', ratio);
  var angle = Math.acos(ratio);
  var direction = checkDirection(vector1, vector2, angle);
  angle = direction === "clockwise" ? angle * -1 : angle;
  // console.log('vector1', vector1);
  // console.log('dotProd', dotProd);
  // console.log('mag', mag);
  // console.log('mag2', mag2);
  // console.log('calculated angle', angle);
  // console.log('direction', direction);
  return angle;
};

Vector.prototype.isParallel = function(vector2) {
  var product = this.crossProd(vector2);
  // console.log('product', product);
  // console.log('isParallel vector', vector2);
  // console.log('this vector', {x:this.x, y:this.y});

  product.x = Math.abs(product.x) <= 0.0000001 ? 0 : product.x;
  product.y = Math.abs(product.y) <= 0.0000001 ? 0 : product.y;
  product.z = Math.abs(product.z) <= 0.0000001 ? 0 : product.z;

  // console.log('isParallel', product.x === 0 && product.y === 0 && product.z === 0);

  if (product.x === 0 && product.y === 0 && product.z === 0) {
    return true;
  } else {
    return false;
  }
};

export default Vector;
