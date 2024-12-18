"use client";
import React, { useEffect, useRef, useState } from "react";
import planck, { Vec2 } from "planck";
import { render } from "../helpers/rendering";

function OneSidedPlatform() {
  const [fps, setFps] = useState(Infinity);
  const canvasRef = useRef(null);

  useEffect(() => {
    {
      /**********************************Custom code start ************************************/
    }
    var pl = planck;
    var world = new pl.World(Vec2(0, -10));

    var radius = 0.5;
    var top = 10.0 + 0.5;
    var bottom = 10.0 - 0.5;

    var UNKNOWN = 0,
      ABOVE = +1,
      BELOW = -1;

    var state = UNKNOWN;

    // Ground
    var ground = world.createBody();
    ground.createFixture(pl.Edge(Vec2(-20.0, 0.0), Vec2(20.0, 0.0)), 0.0);

    // Platform
    var platform = world.createBody(Vec2(0.0, 10.0));
    var platformFix = platform.createFixture(pl.Box(3.0, 0.5), 0.0);

    // Actor
    var character = world.createDynamicBody(Vec2(0.0, 12.0));
    var characterFix = character.createFixture(pl.Circle(radius), 20.0);
    character.setLinearVelocity(Vec2(0.0, -50.0));

    world.on("pre-solve", function (contact, oldManifold) {
      var fixA = contact.getFixtureA();
      var fixB = contact.getFixtureB();

      var isCharPlatformContact =
        (fixA === platformFix && fixB === characterFix) ||
        (fixB === platformFix && fixA === characterFix);

      if (!isCharPlatformContact) {
        return;
      }

      if (0) {
        var p = character.getPosition();

        if (p.y < top + radius - 3.0 * /*linearSlop*/ 0.005) {
          contact.setEnabled(false);
        }
      } else {
        var v = character.getLinearVelocity();
        if (v.y > 0.0) {
          contact.setEnabled(false);
        }
      }
    });

    // testbed.step = function (settings) {
    //   var v = character.getLinearVelocity();
    //   testbed.status("Character Linear Velocity", v.y);
    // };

    {
      /**********************************Custom code end ************************************/
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = 30;

    render(world, ctx, scale, fps, canvas, {
      x: canvas.width / 2,
      y: canvas.height,
    });
  }, [fps]);

  return (
    <div className="m-3 w-fit">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #333" }}
        onClick={() => setFps(fps === Infinity ? 60 : Infinity)}
      />
    </div>
  );
}

export default OneSidedPlatform;
