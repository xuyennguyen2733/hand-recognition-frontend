import { useEffect, useRef, useState } from "react";
import useHand from "../hooks/useHand";
import { Box, Button } from "@mui/material";
import AnimatedGraph from "./AnimatedGraph";
import { handColorsFull, normalize, processForScatterGraph } from "../utils/Landmarks";

function HandExamination({ resultLandmarks }) {
  const { handMoving } = useHand();
  const sequence = useRef([]);
  const sequences = useRef([]);
  const origin = useRef(null);
  const [collecting, setCollecting] = useState(false);
  const [collectingTimeoutId, setCollectingTimeoutId] = useState(null);
  const [sequenceTimeoutId, setSequenceTimeoutId] = useState(null);

  const stopCollecting = () => {
    const timeoutId = setTimeout(() => {
      setCollecting(false);
      // console.log('stop collecting');
      // console.log(sequences.current);
      sequence.current = [];
    }, 2000);

    setCollectingTimeoutId(timeoutId);
  };

  const endSequence = () => {
    const timeoutId = setTimeout(() => {
      // console.log('switching sequence');
      // console.log(sequence.current);
      sequences.current.push(sequence.current);
      sequence.current = [];
    }, 100);

    setSequenceTimeoutId(timeoutId);
  };

  const keepCollecting = (timeoutId) => {
    clearTimeout(timeoutId);
    // console.log("keep collecting", timeoutId);
  };

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

  useEffect(() => {
    if (
      resultLandmarks.length > 0 &&
      sequence.current.length < 300 &&
      collecting
    ) {
      // console.log('collecting')
      sequence.current.push(processData(resultLandmarks));
    }
  }, [resultLandmarks]);

  useEffect(() => {
    if (handMoving) {
      if (resultLandmarks.length > 0) {
        if (!collecting) {
          setCollecting(true);
          // console.log('start collecting')
        }
      }

      if (collectingTimeoutId || sequenceTimeoutId) {
        keepCollecting(sequenceTimeoutId);
        keepCollecting(collectingTimeoutId);
        setCollectingTimeoutId(null);
        setSequenceTimeoutId(null);
      }
    } else if (collecting) {
      endSequence();
      stopCollecting();
    }
  }, [handMoving]);

  return (
    <Box>
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
      <AnimatedGraph frameSets={sequences.current} colors={handColorsFull} />
    </Box>
  );
}

export default HandExamination;
