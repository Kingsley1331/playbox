"use client";
import React from "react";
import CarAndBoxesDemo from "./demos/CarAndBoxesDemo";
import Piston from "./demos/Piston";
import Mixer from "./demos/Mixer";
import CompoundShapes from "./demos/CompoundShapes";
import Bridge from "./demos/Bridge";
import Cantilever from "./demos/Cantilever";
import Dominos from "./demos/Dominos";

function DemoPage() {
  return (
    <div className=" grid grid-cols-2 justify-start m-3">
      <CarAndBoxesDemo />
      <Mixer />
      <CompoundShapes />
      <Bridge />
      <Cantilever />
      <Dominos />
      <Piston />
    </div>
  );
}

export default DemoPage;
