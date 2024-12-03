export default function selectShape(shape) {
  return {
    type: 'SELECT',
    payload: shape,
  }
}
