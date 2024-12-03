export function calculateBoolean(param1, operator, param2) {
  switch (operator) {
    case "===":
      return param1 === param2;
    case "!==":
      return param1 !== param2;
    case "<":
      return param1 < param2;
    case ">":
      return param1 > param2;
    case "<=":
      return param1 <= param2;
    case ">=":
      return param1 >= param2;
    case "AND":
      return param1 && param2;
    case "OR":
      return param1 || param2;
    case "NOT":
      return param1 && !param2;
    default:
      return false;
  }
}
