import planck, { Vec2 } from "planck";
import { Scene } from "../../World";

const pl = planck;
const { scale } = Scene;

export const dragShape = (e, rect, world) => {
  console.log("dragShape");
  const groundBody = world.createBody();
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / -scale;

  const aabb = new pl.AABB(
    new Vec2(x - 0.01, y - 0.01),
    new Vec2(x + 0.01, y + 0.01)
  );

  let selectedBody = null;
  world.queryAABB(aabb, (fixture) => {
    if (fixture.getBody().isDynamic()) {
      selectedBody = fixture.getBody();
      return false;
    }
    return true;
  });

  // Update the mouse joint definition
  const md = {
    maxForce: 10000.0,
    frequencyHz: 5.0,
    dampingRatio: 0.9,
  };

  if (selectedBody) {
    Scene.dragAndThrow.selectedBody = selectedBody;
    const mouseJoint = world.createJoint(
      new pl.MouseJoint(md, groundBody, selectedBody, new Vec2(x, y))
    );
    Scene.dragAndThrow.mouseJoint = mouseJoint;
  }
};

export const moveShape = (e, rect) => {
  if (Scene.dragAndThrow.mouseJoint) {
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / -scale;
    Scene.dragAndThrow.mouseJoint.setTarget(new Vec2(x, y));
  }
};

export const throwShape = (world) => {
  if (Scene.dragAndThrow.mouseJoint) {
    world.destroyJoint(Scene.dragAndThrow.mouseJoint);
    Scene.dragAndThrow = { selectedBody: null, mouseJoint: null };
  }
};
