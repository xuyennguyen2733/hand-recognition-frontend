import { useState } from "react";
import DistanceChart from "./DistanceChart";
import VideoHandDetection from "./VideoHandDetection";
import MovementDetection from "./MovementDetection";

function Home({ resultLandmarks}) {
  const [distances, setDistances] = useState([]);
  

  return (
    <>
      
      <MovementDetection
        resultLandmarks={resultLandmarks}
        setDistances={setDistances}
      />
      <DistanceChart distances={distances} />
    </>
  );
}

export default Home;
