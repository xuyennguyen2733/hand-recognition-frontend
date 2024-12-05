import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import AnimatedGraph from "./AnimatedGraph";
import { handColorsLite, normalize, processForScatterGraph, sample } from "../utils/Landmarks";
import { sendHandData } from "../api/HandApi";

function HandDataCollection({ resultLandmarks }) {
  const sequence = useRef([]);
  const origin = useRef(null);
  const sequences = useRef([]);
  const [collecting, setCollecting] = useState(false);
  const targetLength = 30;
  const collectButtonRef = useRef(null);
  const [label, setLabel] = useState("");
  const [sending, setSending] = useState(false);

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

  const sendSequences = async () => {
    if (!label) alert("Label cannot be empty!");
        else 
    {
        setSending(true);
        for (let i = 0; i < sequences.current.length; i ++) {
            const body = {
                label: label,
                landmarks: sequences.current[i],
                index: i
            }
            console.log(body);
            try {
                const result = await sendHandData(body);
                console.log("send success", result);
            }
            catch (err) {
                console.error("failed to send", err);
            }
        }
        setSending(false);
    }
  }
  
  const handleChangeLabel = (event) => {
    setLabel(event.target.value)
  }

  useEffect(() => {
    if (collecting) {
      if (resultLandmarks.length > 0) {
        sequence.current.push(processData(resultLandmarks));
      } 
} else if (sequence.current.length > 0) {
        sequences.current.push(sample(sequence.current, targetLength));
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
      <Button
        variant="contained"
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
        onClick={sendSequences}
      >
        Send
      </Button>
      <TextField label="Label" value={label} onChange={handleChangeLabel} />
      <AnimatedGraph frameSets={sequences.current} colors={handColorsLite} />
    </Box>
  );
}

export default HandDataCollection;
