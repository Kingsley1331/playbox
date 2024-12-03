export function getObjectValueFromString(object, prop) {
  if (!prop) {
    return;
  }
  const propArray = prop.split(".");
  return propArray.reduce((acc, curr) => {
    if (typeof acc === "object") {
      return acc[curr];
    }
  }, object);
}

export function setObjectValueFromString(object, prop, newValue) {
  let propString = prop;
  let targetProp = prop;
  let targetObj = object;
  if (prop.indexOf(".") !== -1) {
    const propArray = prop.split(".");
    targetProp = propArray.pop();
    propString = propArray.join(".");
    targetObj = getObjectValueFromString(object, propString);
  }
  targetObj[targetProp] = newValue;
  /**NOTE: STRING VALUES */
  if (targetProp === "x" || targetProp === "y") {
    targetObj[targetProp] = Number(newValue);
  }
}

// export function setObjectValueFromString(object, prop, newValue) {
//   const propArray = prop.split(".");
//   const targetProp = propArray.pop();

//   const propString = propArray.join(".");
//   const targetObj = getObjectValueFromString(object, propString);
//   targetObj[targetProp] = newValue;
// }
