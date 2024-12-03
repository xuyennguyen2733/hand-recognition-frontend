import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Scatter } from "react-chartjs-2";
import useHand from "../hooks/useHand";

function AnimatedGraph({frameSets}) {
    const dataSets = useRef([])
    const [animate, setAnimate] = useState(false);
    const [data, setData] = useState({
        datasets: [{
          data: [],
          backgroundColor: 'rgb(255, 99, 132)'
        }],
      });
    
    const chartRef = useRef(null);
    
    const colors = ["red", "green", "blue", "pink", "purple", "white"];
    const [thumbPoint, setThumbPoint] = useState([0]);
  const [indexPoint, setIndexPoint] = useState([0]);
  const [middlePoint, setMiddlePoint] = useState([0]);
  const [ringPoint, setRingPoint] = useState([0]);
  const [pinkyPoint, setPinkyPoint] = useState([0]);
  const [wristPoint, setWristPoint] = useState([0]);
  const [showChart, setShowChart] = useState(false);
    
    const toggleAnimation = () => {
        setAnimate(!animate)
    }
    
    const runAnimation = (dataSet, frameId, length) => {
            setData({
                datasets: [{
                  data: [{x: 0, y: -1}, ...dataSet, {x: 1, y:0}],
                  backgroundColor: 'rgb(255, 99, 132)'
                }],
              })
              
        if (frameId < length - 1) {
            setTimeout(() => runAnimation(dataSets.current[0][frameId + 1], frameId + 1, length), 100)
        }
        
        
    }
      
      const config = useRef({
        type: 'scatter',
        data: data,
        options: {
            maintainAspectRatio: true,
          scales: {
            x: {
              min: -1,
              max: 1,
              ticks: {
                stepSize: 0.2
              }
            },
            y: {
                min: -1,
                max: 1,
                beginAtZero: false,
                ticks: {
                  stepSize: 0.2
                }
            }
            
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
            runAnimation(dataSets.current[0][frameNum], frameNum, dataSets.current[0].length);
        
        }
        
    }, [frameSets, animate])
    

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <Button onClick={toggleAnimation}>Run animation</Button>
            <Scatter data={data} options={config.current} ref={chartRef} />
        </div>
    );
}

export default AnimatedGraph