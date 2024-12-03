import { useState } from "react";
import DistanceChart from "./DistanceChart";
import MovementDetection from "./MovementDetection";

function Home({ resultLandmarks, distances}) {
  
  return (
    <>
      <DistanceChart distances={distances} />
    </>
  );
}

export default Home;
