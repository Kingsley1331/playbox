"use client";
import React from "react";
import CarAndBoxesDemo from "./CarAndBoxesDemo";
import Demo2 from "./Demo2";
import Demo3 from "./Demo3";
import Demo4 from "./Demo4";

function DemoPage() {
  return (
    <div className=" grid grid-cols-2 justify-start m-3">
      {/* <CarAndBoxesDemo />
      <Demo2 /> */}
      {/* <Demo3 /> */}
      <Demo4 />
    </div>
  );
}

export default DemoPage;
