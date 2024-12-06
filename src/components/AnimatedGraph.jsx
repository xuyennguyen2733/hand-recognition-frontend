import { Box, Button, IconButton, MenuItem, Select } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { normalize, WRIST_BASE } from "../utils/Landmarks";
import { Close } from "@mui/icons-material";

function AnimatedGraph({ sequences, colors, setSequences }) {
  const dataSets = useRef([]);
  const [animate, setAnimate] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [selectedSequence, setSelectedSequence] = useState("");
  const animationMode = useRef("NONE");
  const timeoutId = useRef(false);
  const [data, setData] = useState({
    datasets: [
      {
        data: [],
      },
    ],
  });

  const chartRef = useRef(null);

  const toggleAnimation = (mode) => {
    if (sequences.length > 0) {
      setAnimate(true);
      animationMode.current = mode;
    }
  };

  const runAnimation = (dataSet, frameId, sequenceId, length) => {
    console.log('set', dataSet)
    setData({
      labels: ["animation"],
      datasets: [
        {
          data: [
            ...dataSet.map(point => ({x: point[0], y: point[1]})),
            { x: NaN, y: NaN },
            { x: -1.0, y: -1.5 },
            { x: NaN, y: NaN },
            { x: 1.0, y: 1.5 },
          ],
          pointBackgroundColor: colors,
          borderWidth: 10,
        },
      ],
    });

    if (frameId < length - 1) {
      timeoutId.current = setTimeout(
        () =>
          runAnimation(
            sequences[sequenceId][frameId + 1],
            frameId + 1,
            sequenceId,
            length,
          ),
        50,
      );
    } else if (
      animationMode.current === "ALL" &&
      sequenceId < sequences.length - 1
    ) {
      timeoutId.current = setTimeout(
        () =>
          runAnimation(
            sequences[sequenceId + 1][0],
            0,
            sequenceId + 1,
            sequences[sequenceId + 1].length,
          ),
        50,
      );
    } else {
      setAnimate(false);
    }
  };
  
  const handleRemoveSequence = (e, index) => {
    e.stopPropagation();
    setSelectedSequence(sequences.length - 2 < 0 ? "" : sequences.length - 2);
    setSequences(prev => prev.filter((_, idx) => idx !== index));
    
  }

  const config = {
    type: "scatter",
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Custom Chart Title",
          customCanvasBackgroundColor: {
            color: "lightGreen",
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              max: 0,
              min: 1,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              max: -1,
              min: 0,
            },
          },
        ],
      },
    },
  };

  useEffect(() => {
    if (sequences.length > 0) {

      if (animate) {
        switch (animationMode.current) {
          case "ALL": {
            runAnimation(
              sequences[0][0],
              0,
              0,
              sequences[0].length,
            );
            break;
          }
          case "ONE": {
            if (selectedSequence !== "") {
              runAnimation(
                sequences[selectedSequence][selectedFrame],
                selectedFrame,
                selectedSequence,
                sequences[selectedSequence].length,
              );
            } else {
              setAnimate(false);
            }
          }
        }
      }
    } else {
      setSelectedSequence("");
      console.log('set changes', sequences)
    }
  }, [sequences, animate]);

  return (
    <Box>
      <Button disabled={animate} onClick={() => toggleAnimation("ALL")}>
        Run all animation
      </Button>
      <Button disabled={animate} onClick={() => toggleAnimation("ONE")}>
        Run animation
      </Button>
      <Select
        defaultValue={""}
        value={selectedSequence}
        onChange={(event) => setSelectedSequence(event.target.value)}
      >
        <MenuItem value="">
          <em>Select a frame</em>
        </MenuItem>
        {sequences.map((_, index) => (
          <MenuItem key={index} value={index}>
            <span style={{flexGrow: 1}}>{index + 1}</span>
            <IconButton edge="end" size="small" onClick={(e) => handleRemoveSequence(e, index)}><Close /></IconButton>
          </MenuItem>
        ))}
      </Select>
      <Scatter data={data} config={config} ref={chartRef} />
    </Box>
  );
}

export default AnimatedGraph;
