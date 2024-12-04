import { Box, Button, MenuItem, Select } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Scatter } from "react-chartjs-2";
import { normalize, WRIST_BASE } from "../utils/Landmarks";

function AnimatedGraph({frameSets}) {
    const dataSets = useRef([])
    const [animate, setAnimate] = useState(false);
    const [selectedFrame, setSelectedFrame] = useState(0);
    const [selectedSequence, setSelectedSequence] = useState('');
    const animationMode = useRef("NONE");
    const timeoutId = useRef(false);
    const [data, setData] = useState({
      datasets: [{
          data: [],
        }],
      });
    
    const chartRef = useRef(null);
    
    const colors = ["turquoise", "turquoise","red","red","red", "green","green","green","green","blue","blue","blue", "blue", "pink","pink","pink","pink", "purple","purple","purple","purple", "transparent","transparent","transparent","transparent"];
    
    const toggleAnimation = (mode) => {
      if (frameSets.length > 0) {
          setAnimate(true);
        animationMode.current = mode;
        }
      }
      
   
    
    const runAnimation = (dataSet, frameId, sequenceId, length) => {
            setData({
              labels: ["animation"],
              datasets: [{
                  data: [ ...normalize(dataSet, dataSets.current[0][0][WRIST_BASE]), {x: NaN, y: NaN}, {x: -1, y: -1}, {x: NaN, y: NaN}, {x: 1, y: 1}],
                  pointBackgroundColor: colors,
            borderWidth: 10,
                }],
              })
              
        if (frameId < length - 1) {
            timeoutId.current = setTimeout(() => runAnimation(dataSets.current[sequenceId][frameId + 1], frameId + 1, sequenceId, length), 50)
          }
          else if (animationMode.current === "ALL" && sequenceId < dataSets.current.length - 1) {
            timeoutId.current = setTimeout(() => runAnimation(dataSets.current[sequenceId+1][0], 0, sequenceId+1, dataSets.current[sequenceId+1].length), 50)
          
        }
        else {
          setAnimate(false);
        }
        
    }
      
      const config = {
        type: 'scatter',
        data: data,
        options: {
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Custom Chart Title'
            ,
            customCanvasBackgroundColor: {
              color: 'lightGreen',
            }}
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                  beginAtZero: true,
                  max: 0,
                  min: 1
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: false,
                  max: -1,
                  min: 0
              }
          }]
            
          }
        }
      }
   
      
    useEffect(() => {
        if (frameSets.length > 0) {
            dataSets.current = frameSets.map((frames) => (
                frames.map((landmark) => (landmark.map((point) => ({
                    x: point.x,
                    y: -point.y
                })))))
            )
            
            if (animate && dataSets.current.length > 0) {
              switch (animationMode.current) {
                case 'ALL': {
                  runAnimation(dataSets.current[0][0], 0, 0, dataSets.current[0].length);
                  break;
                }
                case 'ONE': {
                  if (selectedSequence !== '') {
                  runAnimation(dataSets.current[selectedSequence][selectedFrame], selectedFrame, selectedSequence, dataSets.current[selectedSequence].length)
                  }
                  else {
                    setAnimate(false);
                  }
                }
              }
            }
        
        }
        else {
          setSelectedSequence('');
        }
        
    }, [frameSets, animate])
    

    return (
        <Box>
          <Button disabled={animate} onClick={() => toggleAnimation('ALL')}>Run all animation</Button>
          <Button disabled={animate} onClick={() => toggleAnimation('ONE')}>Run animation</Button>
          <Select defaultValue={''} value={selectedSequence} onChange={(event) => setSelectedSequence(event.target.value)}>
            <MenuItem value=''>
              <em>Select a frame</em>
            </MenuItem>
            {frameSets.map((_, index) => (
              <MenuItem key={index} value={index}>{index + 1}</MenuItem>
            ))}
          </Select>
          <Scatter data={data} config={config} ref={chartRef} />
        </Box>
    );
}

export default AnimatedGraph