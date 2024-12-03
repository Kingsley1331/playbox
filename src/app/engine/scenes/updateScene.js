import Scene from "./scene";
import checkEvents from "../utils/checkEvents";
import Shape from "../shapes/Shape";

export default function updateScene(scene) {
  if (scene.shapes) {
    for (let key in scene) {
      if (key !== "shapes") {
        Scene[key] = scene[key];
      }
      if (key === "shapes") {
        for (let i = 0; i < scene.shapes.length; i++) {
          Scene.shapes[i] = new Shape({ ...scene.shapes[i].centreOfMass }, [
            ...scene.shapes[i].vertices
          ]);

          Scene.shapes[i].boundingRect = {
            ...scene.shapes[i].boundingRect,
            vertices: [...scene.shapes[i].boundingRect.vertices]
          };

          Scene.shapes[i].centreOfMass = { ...scene.shapes[i].centreOfMass };
          Scene.shapes[i].centreOfRotation = {
            ...scene.shapes[i].centreOfRotation
          };

          Scene.shapes[i].physics = { ...scene.shapes[i].physics };
          Scene.shapes[i].referenceVectors = {
            ...scene.shapes[i].referenceVectors
          };

          Scene.shapes[i].colliding = scene.shapes[i].colliding;
          Scene.shapes[i].dragging = scene.shapes[i].dragging;
          Scene.shapes[i].fillColour = scene.shapes[i].fillColour;
          Scene.shapes[i].id = scene.shapes[i].id;
          Scene.shapes[i].strokeStyle = scene.shapes[i].strokeStyle;
          Scene.shapes[i].linewidth = scene.shapes[i].linewidth;
          Scene.shapes[i].onShape = scene.shapes[i].onShape;
          Scene.shapes[i].selected = scene.shapes[i].selected;
          Scene.shapes[i].touchPoint = scene.shapes[i].touchPoint;
          Scene.shapes[i].type = scene.shapes[i].type;
          Scene.shapes[i].collisionData = scene.shapes[i].collisionData || {};
          Scene.shapes[i].events = scene.shapes[i].events || {};
          Scene.shapes[i].isShapeFixed = scene.shapes[i].isShapeFixed;

          Scene.shapes[i].checkEvents = checkEvents;
          /** The type property will be removed after the Physics bugs have been fixed */
          if (
            scene.shapes[i].type === "fixed" ||
            Scene.shapes[i].isShapeFixed
          ) {
            Scene.shapes[i].freezeShape = true;
          }
        }
      }
    }

    console.log("updated scene", Scene);
  }
}
