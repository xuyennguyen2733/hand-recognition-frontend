import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import AnimatedGraph from "./AnimatedGraph";
import {
  handColorsLite,
  normalize,
  processForScatterGraph,
  sample,
} from "../utils/Landmarks";
import { predictHand, sendHandData } from "../api/HandApi";

function HandDataCollection({ resultLandmarks }) {
  const sequence = useRef([]);
  const origin = useRef(null);
  const [sequences, setSequences] = useState([]);
  const [collecting, setCollecting] = useState(false);
  const targetLength = 30;
  const collectButtonRef = useRef(null);
  const [label, setLabel] = useState("");
  const [sending, setSending] = useState(false);

  const clearSequences = () => {
    setSequences([]);
  };

  const processData = () => {
    const processedLandmarks = processForScatterGraph(resultLandmarks);
    if (sequence.current.length === 0) {
      origin.current = processedLandmarks[0];
    }
    const normalizedLandmarks = normalize(processedLandmarks, origin.current);
    return normalizedLandmarks;
  };

  const sendSequences = async () => {
    if (!label) alert("Label cannot be empty!");
    else {
      setSending(true);
      for (let i = 0; i < sequences.length; i++) {
        const body = {
          label: label.toLowerCase(),
          landmarks: sequences[i],
          index: i,
        };
        try {
          const result = await sendHandData(body);
          console.log("send success", result);
        } catch (err) {
          console.error("failed to send", err);
        }
      }
      setSending(false);
    }
  };
  const predictSequences = async () => {
    setSending(true);
    for (let i = 0; i < sequences.length; i++) {
      const body = {
        label: label.toLowerCase(),
        landmarks: sequences[i],
        index: i,
      };
      try {
        const result = await predictHand(body);
        console.log("send success", result);
      } catch (err) {
        console.error("failed to send", err);
      }
    }
    setSending(false);
  };

  const handleChangeLabel = (event) => {
    setLabel(event.target.value);
  };

  useEffect(() => {
    if (collecting) {
      if (resultLandmarks.length > 0) {
        sequence.current.push(processData(resultLandmarks));
      }
    } else if (sequence.current.length > 0) {
      setSequences((current) => [
        ...current,
        sample(sequence.current, targetLength),
      ]);
      sequence.current = [];
    }
    // console.log(resultLandmarks)
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
        Clear sequences: {sequences.length}
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
      <Button
        variant="contained"
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
        onClick={predictSequences}
      >
        Predict
      </Button>
      <TextField label="Label" value={label} onChange={handleChangeLabel} />
      <AnimatedGraph
        sequences={sequences}
        setSequences={setSequences}
        colors={handColorsLite}
      />
    </Box>
  );
}

export default HandDataCollection;
