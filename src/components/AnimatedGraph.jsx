import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Scatter } from "react-chartjs-2";
import { normalize, WRIST_BASE } from "../utils/Landmarks";

function AnimatedGraph({frameSets}) {
    const dataSets = useRef([])
    const [animate, setAnimate] = useState(false);
    const animationRunning = useRef(false);
    const [data, setData] = useState({
      datasets: [{
          data: [],
        }],
      });
    
    const chartRef = useRef(null);
    
    const colors = ["red", "red","red","red","red", "green","green","green","green","blue","blue","blue", "blue", "pink","pink","pink","pink", "purple","purple","purple","purple", "transparent","transparent","transparent","transparent"];
    
    const toggleAnimation = () => {
        setAnimate(!animate)
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
            setTimeout(() => runAnimation(dataSets.current[sequenceId][frameId + 1], frameId + 1, sequenceId, length), 50)
          }
          else if (sequenceId < dataSets.current.length - 1) {
          setTimeout(() => runAnimation(dataSets.current[sequenceId+1][0], 0, sequenceId+1, dataSets.current[sequenceId+1].length), 50)
          
        }
        else {
          animationRunning.current = false;
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
            
            let frameNum = 0;
            if (!animationRunning.current) {
              animationRunning.current = true;
              runAnimation(dataSets.current[0][frameNum], frameNum, 0, dataSets.current[0].length);
            }
        
        }
        
    }, [frameSets, animate])
    

    return (
        <Box>
          <Button disabled={animationRunning.current} onClick={toggleAnimation}>Run animation</Button>
          <Scatter data={data} config={config} ref={chartRef} />
        </Box>
    );
}

export default AnimatedGraph