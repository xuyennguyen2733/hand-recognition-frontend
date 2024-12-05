import { useEffect, useRef, useState } from "react";
import useHand from "../hooks/useHand";
import { Box, Button } from "@mui/material";
import AnimatedGraph from "./AnimatedGraph";
import { handColorsLite, normalize, processForScatterGraph } from "../utils/Landmarks";

function HandDataCollection({ resultLandmarks }) {
  const sequence = useRef([]);
  const origin = useRef(null);
  const sequences = useRef([]);
  const [collecting, setCollecting] = useState(false);
  const targetLength = 30;
  const collectButtonRef = useRef(null);

  const clearSequences = () => {
    sequences.current = [];
  };
  
  const processData = () => {
    const processedLandmarks = processForScatterGraph(resultLandmarks);
      if (sequence.current.length === 0) {
        origin.current = processedLandmarks[0];
      }
      const normalizedLandmarks = normalize(processedLandmarks, origin.current);
    return normalizedLandmarks;
  }

  const sampleData = () => {
      const sequenceLength = sequence.current.length;
      console.log('length', sequenceLength);
      let sampledSequence = [];
    if (sequenceLength < targetLength) {
        const lengthDifference = targetLength - sequenceLength;
        
        let increment = (sequenceLength - 1) / lengthDifference;
            let index = increment;
            let currentIndex = 0;
            for (let i = 0; i < targetLength; i++) {
                sampledSequence.push(sequence.current[currentIndex]);
                if (currentIndex === Math.floor(index)) {
                    index += increment;
                }
                else {
                    currentIndex++;
                }
            }
        
    } else if (sequenceLength > targetLength) {
        let increment = (sequenceLength - 1) / targetLength;
        let index = increment; 
        for (let i = 0; i < targetLength; i ++) {
            sampledSequence.push(sequence.current[Math.floor(index)]);
            index += increment;
        }
    }
    return sampledSequence;
  };

  useEffect(() => {
    if (collecting) {
      if (resultLandmarks.length > 0) {
        sequence.current.push(processData(resultLandmarks));
      } 
} else if (sequence.current.length > 0) {
        sequences.current.push(sampleData());
      sequence.current = [];
    }
  }, [resultLandmarks]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (collectButtonRef.current) {
          collectButtonRef.current.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Box>
      <Button
        ref={collectButtonRef}
        variant="contained"
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
        onClick={() => setCollecting(!collecting)}
      >
        {collecting ? "stop collecting" : "start collecting"}
      </Button>
      <Button
        variant="contained"
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
        onClick={clearSequences}
      >
        Clear sequences: {sequences.current.length}
      </Button>
      <AnimatedGraph frameSets={sequences.current} colors={handColorsLite} />
    </Box>
  );
}

export default HandDataCollection;
