// finds the equation of a line segment 'side' in the form of y = mx + c
export default function lineFormula(side){ //console.log('side', side);
  var gradient = (side[1].y - side[0].y) / (side[1].x - side[0].x);
  var intercept = side[0].y - gradient * side[0].x;
  return {gradient: gradient, intercept: intercept};
}
