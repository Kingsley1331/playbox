"use client";
import React from "react";
import CarAndBoxesDemo from "./CarAndBoxesDemo";
import Piston from "./Piston";
import Mixer from "./Mixer";
import CompoundShapes from "./CompoundShapes";
import Bridge from "./Bridge";
import Cantilever from "./Cantilever";
import Dominos from "./Dominos";

function DemoPage() {
  return (
    <div className=" grid grid-cols-2 justify-start m-3">
      <CarAndBoxesDemo />
      <Piston />
      <Mixer />
      <CompoundShapes />
      <Bridge />
      <Cantilever />
      <Dominos />
    </div>
  );
}

export default DemoPage;
