"use client";
import React from "react";
import CarAndBoxesDemo from "./demos/CarAndBoxesDemo";
import Piston from "./demos/Piston";
import Mixer from "./demos/Mixer";
import CompoundShapes from "./demos/CompoundShapes";
import Bridge from "./demos/Bridge";
import Cantilever from "./demos/Cantilever";
import Dominos from "./demos/Dominos";
import Revolute from "./demos/Revolute";
import Chain from "./demos/Chain";
import Motor from "./demos/Motor";
import OneSidedPlatform from "./demos/OneSidedPlatform";
import Pyramid from "./demos/Pyramid";
import Pulleys from "./demos/Pulleys";
import ConveyorBelt from "./demos/ConveyorBelt";
import ContinuousTest from "./demos/ContinuousTest";
import Car from "./demos/Car";

function DemoPage() {
  return (
    <div className=" grid grid-cols-2 justify-start m-3">
      {/* <Motor /> */}
      <CarAndBoxesDemo />
      <Mixer />
      <CompoundShapes />
      <Bridge />
      <Cantilever />
      <Dominos />
      <Piston />
      <Revolute />
      <Chain />
      <OneSidedPlatform />
      <Pyramid />
      <Pulleys />
      <ConveyorBelt />
      <ContinuousTest />
      <Car />
    </div>
  );
}

export default DemoPage;
