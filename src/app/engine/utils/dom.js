export function isColour(strColor) {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== "";
}
