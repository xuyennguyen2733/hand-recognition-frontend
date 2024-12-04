import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Scatter } from "react-chartjs-2";
import useHand from "../hooks/useHand";
import { normalize, WRIST_BASE } from "../utils/Landmarks";

function AnimatedGraph({frameSets}) {
    const dataSets = useRef([])
    const [animate, setAnimate] = useState(false);
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
              datasets: [{
                  data: [ ...normalize(dataSet), {x: NaN, y: NaN}, {x: -0.6, y: -0.6}, {x: NaN, y: NaN}, {x: 0.6, y: 0.6}],
                  pointBackgroundColor: colors,
                  showLine: true, // Connect the dots
            borderWidth: 10,
            tension: 0.05
                }],
              })
              
        if (frameId < length - 1) {
            setTimeout(() => runAnimation(dataSets.current[sequenceId][frameId + 1], frameId + 1, sequenceId, length), 100)
          }
          else if (sequenceId < dataSets.current.length - 1) {
          setTimeout(() => runAnimation(dataSets.current[sequenceId+1][0], 0, sequenceId+1, dataSets.current[sequenceId+1].length), 100)
          
        }
        
    }
      
      const config = useRef({
        type: 'scatter',
        data: data,
        options: {
          animation: {
            duration: 0
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
      })
   
      
    useEffect(() => {
        if (frameSets.length > 0) {
            dataSets.current = frameSets.map((frames) => (
                frames.map((landmark) => (landmark.map((point) => ({
                    x: point.x,
                    y: -point.y
                })))))
            )
            
            let frameNum = 0;
            runAnimation(dataSets.current[0][frameNum], frameNum, 0, dataSets.current[0].length);
        
        }
        
    }, [frameSets, animate])
    

    return (
        <Box>
          <Button onClick={toggleAnimation}>Run animation</Button>
          <Scatter data={data} options={config.current} ref={chartRef}  />
        </Box>
    );
}

export default AnimatedGraph