import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const DistanceChart = ({ distances: landmarkDistances }) => {
  const colors = ["red", "green", "blue", "pink", "purple", "white"];
  const labels = [
    "THUMB_TIP",
    "INDEX_TIP",
    "MIDDLE_TIP",
    "RING_TIP",
    "PINKY_TIP",
    "WRIST_BASE",
  ];
  const [thumbDistance, setThumbDistance] = useState([0]);
  const [indexDistance, setIndexDistance] = useState([0]);
  const [middleDistance, setMiddleDistance] = useState([0]);
  const [ringDistance, setRingDistance] = useState([0]);
  const [pinkyDistance, setPinkyDistance] = useState([0]);
  const [wristDistance, setWristDistance] = useState([0]);
  const [showChart, setShowChart] = useState(false);

  // Example chart data
  const data = {
    labels: thumbDistance.map((_, idx) => `Time ${idx + 1}`), // Labels for each distance point
    datasets: [
      {
        label: labels[0],
        data: thumbDistance,
        fill: false,
        borderColor: colors[0],
        tension: 0.1,
      },
      {
        label: labels[1],
        data: indexDistance,
        fill: false,
        borderColor: colors[1],
        tension: 0.1,
      },
      {
        label: labels[2],
        data: middleDistance,
        fill: false,
        borderColor: colors[2],
        tension: 0.1,
      },
      {
        label: labels[3],
        data: ringDistance,
        fill: false,
        borderColor: colors[3],
        tension: 0.1,
      },
      {
        label: labels[4],
        data: pinkyDistance,
        fill: false,
        borderColor: colors[4],
        tension: 0.1,
      },
      {
        label: labels[5],
        data: wristDistance,
        fill: false,
        borderColor: colors[5],
        tension: 0.1,
      },
    ],
  };

  // Use useEffect to render chart only after distance is updated
  useEffect(() => {
    if (landmarkDistances && showChart) {
      setThumbDistance((prev) => [
        ...prev,
        landmarkDistances[0] < 0.1 ? landmarkDistances[0] : 0.1,
      ]);
      setIndexDistance((prev) => [
        ...prev,
        landmarkDistances[1] < 0.1 ? landmarkDistances[1] : 0.1,
      ]);
      setMiddleDistance((prev) => [
        ...prev,
        landmarkDistances[2] < 0.1 ? landmarkDistances[2] : 0.1,
      ]);
      setRingDistance((prev) => [
        ...prev,
        landmarkDistances[3] < 0.1 ? landmarkDistances[3] : 0.1,
      ]);
      setPinkyDistance((prev) => [
        ...prev,
        landmarkDistances[4] < 0.1 ? landmarkDistances[4] : 0.1,
      ]);
      setWristDistance((prev) => [
        ...prev,
        landmarkDistances[5] < 0.1 ? landmarkDistances[5] : 0.1,
      ]);
    }
  }, [landmarkDistances]);

  return (
    <div
      style={{
        width: "80vw",
        height: "30vh",
      }}
    >
      <Button onClick={() => setShowChart(!showChart)}>Show Chart</Button>
      {showChart && <Line data={data} />}
    </div>
  );
};

export default DistanceChart;
