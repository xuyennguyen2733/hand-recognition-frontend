import { useState } from "react";
import DistanceChart from "./DistanceChart";
import VideoHandDetection from "./VideoHandDetection";
import MovementDetection from "./MovementDetection";

function Home() {
  const [distances, setDistances] = useState([]);
  const [resultLandmarks, setResultLandmarks] = useState([]);

  return (
    <>
      <VideoHandDetection setResultLandmarks={setResultLandmarks} />
      <MovementDetection
        resultLandmarks={resultLandmarks}
        setDistances={setDistances}
      />
      <DistanceChart distances={distances} />
    </>
  );
}

export default Home;
