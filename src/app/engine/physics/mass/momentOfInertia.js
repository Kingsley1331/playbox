import { isPointInShape } from '../../shapes/shapes';
import { magnitude } from '../../utils/maths/Vector';

export function findMomentOfInertiaCOM(centreOfMass, vertices, boundingRect){
  var count = 0;
  var accuracy = 100;
  var resolution = {x: 10, y: 10};
  var momentOfInertiaCOM = 0;
  var width = boundingRect.maxX - boundingRect.minX;
  var height = boundingRect.maxY - boundingRect.minY;
  resolution.x = width < accuracy ? 1 : Math.round(width / accuracy);
  resolution.y = height < accuracy ? 1 : Math.round(height / accuracy);
  //console.log('resolution', resolution);
  var startPoint = {x: boundingRect.minX, y: boundingRect.minY};
  var checkPoint = {};
  for(var i = 0; i < width; i += resolution.x){
    for(var j = 0; j < height; j += resolution.y){
      checkPoint.x = startPoint.x + i;
      checkPoint.y = startPoint.y + j;
      var pointInShape = isPointInShape({x: 0, y: 0}, vertices, checkPoint);
      if(pointInShape){
        momentOfInertiaCOM += (resolution.x * resolution.y) * Math.pow(magnitude(checkPoint), 2);
        count += 1;
      }
    }
  }
  //console.log('momentOfInertiaCOM', momentOfInertiaCOM);
  //console.log('count', count);
  return momentOfInertiaCOM;
}

export function findMomentOfInertia(pointInShape, momentOfInertiaCOM, mass){
  var momentOfInertia = momentOfInertiaCOM + mass * Math.pow(magnitude(pointInShape), 2);
  //console.log('PAT momentOfInertia', momentOfInertia);
  return momentOfInertia;
}
