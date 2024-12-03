import Vector from "./Vector";
// 3 x 3 Matrix
const Matrix = function(matrix) {
  this.r1 = matrix.r1;
  this.r2 = matrix.r2;
  this.r3 = matrix.r3;
};

Matrix.prototype.mMult = function(matrix2) {
  var newMatrix = {};
  var r11 =
    this.r1[0] * matrix2.r1[0] +
    this.r1[1] * matrix2.r2[0] +
    this.r1[2] * matrix2.r3[0];
  var r12 =
    this.r1[0] * matrix2.r1[1] +
    this.r1[1] * matrix2.r2[1] +
    this.r1[2] * matrix2.r3[1];
  var r13 =
    this.r1[0] * matrix2.r1[2] +
    this.r1[1] * matrix2.r2[2] +
    this.r1[2] * matrix2.r3[2];
  newMatrix.r1 = [r11, r12, r13];

  var r21 =
    this.r2[0] * matrix2.r1[0] +
    this.r2[1] * matrix2.r2[0] +
    this.r2[2] * matrix2.r3[0];
  var r22 =
    this.r2[0] * matrix2.r1[1] +
    this.r2[1] * matrix2.r2[1] +
    this.r2[2] * matrix2.r3[1];
  var r23 =
    this.r2[0] * matrix2.r1[2] +
    this.r2[1] * matrix2.r2[2] +
    this.r2[2] * matrix2.r3[2];
  newMatrix.r2 = [r21, r22, r23];

  var r31 =
    this.r3[0] * matrix2.r1[0] +
    this.r3[1] * matrix2.r2[0] +
    this.r3[2] * matrix2.r3[0];
  var r32 =
    this.r3[0] * matrix2.r1[1] +
    this.r3[1] * matrix2.r2[1] +
    this.r3[2] * matrix2.r3[1];
  var r33 =
    this.r3[0] * matrix2.r1[2] +
    this.r3[1] * matrix2.r2[2] +
    this.r3[2] * matrix2.r3[2];
  newMatrix.r3 = [r31, r32, r33];
  var matrix = new Matrix(newMatrix);
  return matrix;
};

Matrix.prototype.vMult = function(vector) {
  vector.z = vector.z ? vector.z : 0;
  var x = this.r1[0] * vector.x + this.r1[1] * vector.y + this.r1[2] * vector.z;
  var y = this.r2[0] * vector.x + this.r2[1] * vector.y + this.r2[2] * vector.z;
  var z = this.r3[0] * vector.x + this.r3[1] * vector.y + this.r3[2] * vector.z;
  var product = new Vector({ x: x, y: y, z: z });
  return product;
};

export default Matrix;
