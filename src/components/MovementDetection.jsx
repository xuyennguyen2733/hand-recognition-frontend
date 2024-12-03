import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { isMoving3D } from "../utils/IsMoving";
import useHand from "../hooks/useHand";

function MovementDetection({ resultLandmarks, setDistances }) {
  const {handMoving, setHandMoving} = useHand();
  const prevAverageLandmarks = useRef(null);
  const stillFrameCount = useRef(0);
  const movingFrameCount = useRef(0);
  const pastLandmarks = useRef([]);

  const addLandmark = (landmark) => {
    pastLandmarks.current.push(landmark);

    if (pastLandmarks.current.length > 5) {
      pastLandmarks.current.shift();
    }
  };

  const calculateAverageLandmark = () => {
    return pastLandmarks.current
      .reduce((acc, curr) => {
        return (
          acc.map((coords, i) => {
            return {
              x: coords.x + curr[i].x,
              y: coords.y + curr[i].y,
              z: coords.z + curr[i].z,
            };
          }),
          pastLandmarks.current[0]
        );
      })
      .map((coords) => {
        const averageCoords = {
          x: coords.x / pastLandmarks.current.length,
          y: coords.y / pastLandmarks.current.length,
          z: coords.z / pastLandmarks.current.length,
        };
        return averageCoords;
      });
  };

  useEffect(() => {
    if (resultLandmarks.length > 0) {
      addLandmark(resultLandmarks);
      const currentAverageLandmarks = calculateAverageLandmark();
      if (!!prevAverageLandmarks.current) {
        const [isMoving, euclDistance] = isMoving3D(
          prevAverageLandmarks.current,
          currentAverageLandmarks,
        );
        setDistances(euclDistance);
        if (isMoving) {
          movingFrameCount.current += 1;
          if (movingFrameCount.current > 5) {
            setHandMoving(true);
            stillFrameCount.current = 0;
            movingFrameCount.current = 0;
          }
        } else {
          stillFrameCount.current += 1;
          if (stillFrameCount.current > 5) {
            setHandMoving(false);
            stillFrameCount.current = 0;
            movingFrameCount.current = 0;
          }
        }
      }
      prevAverageLandmarks.current = currentAverageLandmarks;
    } else {
      stillFrameCount.current += 1;
      if (stillFrameCount.current > 5) {
        setHandMoving(false);
        stillFrameCount.current = 0;
        movingFrameCount.current = 0;
      }
    }
  }, [resultLandmarks]);

  return <Typography>{handMoving ? "moving" : "still"}</Typography>;
}

export default MovementDetection;
