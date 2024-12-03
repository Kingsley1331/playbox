import Vector, { rotateShape } from "../../../utils/maths/Vector";
export function screenWriter(context, text, position) {
  context.save();
  context.fillStyle = "black";
  context.font = "15px Arial";
  context.fillText(text, position.x, position.y);
  context.restore();
}

export function drawShape(
  context,
  vertices,
  centreOfMass,
  config,
  callback = () => {}
) {
  const numOfVertices = vertices.length;
  const x0 = vertices[0].x + centreOfMass.x;
  const y0 = vertices[0].y + centreOfMass.y;

  context.beginPath();
  context.moveTo(x0, y0);
  for (let j = 1; j < numOfVertices; j++) {
    const x = vertices[j].x + centreOfMass.x;
    const y = vertices[j].y + centreOfMass.y;
    context.lineTo(x, y);
  }
  context.save();
  for (let prop in config) {
    if (typeof context[prop] === "function") {
      context[prop](config[prop]);
    } else {
      context[prop] = config[prop];
    }
  }
  context.closePath();
  context.stroke();
  context.fill();
  context.restore();
  callback();
}

export const drawSquare = (context, centre, sideLength, config) => {
  const length = sideLength / 2;
  const vertices = [
    { x: -length, y: -length },
    { x: length, y: -length },
    { x: length, y: length },
    { x: -length, y: length }
  ];

  drawShape(context, vertices, centre, config);
};

export const drawPolyline = (context, vertices, config, open = false) => {
  var numOfPoints = vertices.length;
  if (numOfPoints) {
    const startingPoint = {
      x: vertices[0].x,
      y: vertices[0].y
    };
    context.beginPath();
    context.moveTo(startingPoint.x, startingPoint.y);
    for (let i = 1; i < numOfPoints; i++) {
      let x = vertices[i].x;
      let y = vertices[i].y;
      context.lineTo(x, y);
    }

    context.save();
    for (let prop in config) {
      context[prop] = config[prop];
    }
    if (!open) {
      context.closePath();
      context.fill();
    }
    context.stroke();
    context.restore();
  }
};

export function drawDot(context, radius, centre, colour) {
  context.save();
  context.fillStyle = colour;
  context.beginPath();
  context.arc(centre.x, centre.y, radius, 0, 2 * Math.PI);
  context.fill();
  context.restore();
}

export function drawCircle(context, radius, centre, config) {
  const isFilled = "fillStyle" in config;
  context.save();
  for (var prop in config) {
    if (typeof context[prop] === "function") {
      context[prop](config[prop]);
    } else {
      context[prop] = config[prop];
    }
  }
  context.beginPath();
  context.arc(centre.x, centre.y, radius, 0, 2 * Math.PI);
  if (isFilled) {
    context.fill();
  } else {
    context.stroke();
  }
  context.restore();
}

export function drawLine(context, start, end, config) {
  context.save();
  for (var prop in config) {
    if (typeof context[prop] === "function") {
      context[prop](config[prop]);
    } else {
      context[prop] = config[prop];
    }
  }
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
  context.restore();
}

export function drawArrow(context, head, shaft, config, length) {
  var start = shaft[0];
  var end = { x: shaft[0].x + shaft[1].x, y: shaft[0].y + shaft[1].y };
  // var vector = shaft[1];
  // var shaftVector = new Vector({x: vector.x - start.x, y: vector.y - start.y});
  var shaftVector = new Vector({ x: shaft[1].x, y: shaft[1].y });

  var magnitude = shaftVector.magnitude;
  if (length) {
    var scale = length / magnitude;
    shaftVector = shaftVector.scalProd(scale);
    end = { x: shaft[0].x + shaftVector.x, y: shaft[0].y + shaftVector.y };
  }
  var referenceVector = new Vector({ x: 0, y: 1 });
  //var angle = shaftVector.findAngle(referenceVector);
  var angle = referenceVector.findAngle(shaftVector);
  var rotatedHead = rotateShape(end, angle, head);

  drawShape(context, rotatedHead, end, config);

  drawLine(context, start, end, config, context);
}

export const shadow = {
  shadowColor: "rgba( 9, 9, 9, 0.3)",
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  shadowBlur: 10
};
