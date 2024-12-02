import { DrawingUtils, HandLandmarker } from "@mediapipe/tasks-vision";
import { FilesetResolver } from "@mediapipe/tasks-text";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box, Typography } from "@mui/material";
import { isMoving3D } from "../utils/IsMoving";
import { HAND_LANDMARKS_LITE, INDEX_TIP, MIDDLE_TIP, PINKY_TIP, RING_TIP, THUMB_TIP, WRIST_BASE } from "../utils/Landmarks";

function Home() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [handLandmarker, setsHandLandmarker] = useState(null);
    const detectedResults = useRef(null);
    const [canvasContext, setCanvasContext] = useState(null)
    const animationFrameId = useRef(0);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const frameCount = useRef(0);
    const [handMoving, setHandMoving] = useState(false);
    const prevAverageLandmarks = useRef(null);
    const stillFrameCount = useRef(0);
    const movingFrameCount = useRef(0);
    const pastLandmarks = useRef([]);
    const [distance, setDistance] = useState(null)
    
    const recognizeHands = () => {
        detectedResults.current = null;
        if (handLandmarker) {
          const video = webcamRef.current.video;
          let results;
          if (video) {
             results = handLandmarker.detectForVideo(
                video,
                performance.now()
              );
              
            }
            
            canvasContext.save();
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            if (results?.landmarks?.length !== 0 && canvasRef.current) {
              
              const drawingUtils = new DrawingUtils(canvasContext);
              let resultLandmarks;
              
              for (let i = 0; i < results.landmarks.length; i++) {
                resultLandmarks = HAND_LANDMARKS_LITE.map((index) => results.landmarks[i][index])
                
                addLandmark(resultLandmarks);
                
                drawingUtils.drawLandmarks([results.landmarks[i][THUMB_TIP]], {
                  lineWidth: 3,
                  color: "red",
                });
                drawingUtils.drawLandmarks([results.landmarks[i][INDEX_TIP]], {
                  lineWidth: 3,
                  color: "green",
                });
                drawingUtils.drawLandmarks([results.landmarks[i][MIDDLE_TIP]], {
                  lineWidth: 3,
                  color: "blue",
                });
                drawingUtils.drawLandmarks([results.landmarks[i][RING_TIP]], {
                  lineWidth: 3,
                  color: "pink",
                });
                drawingUtils.drawLandmarks([results.landmarks[i][PINKY_TIP]], {
                  lineWidth: 3,
                  color: "purple",
                });
                drawingUtils.drawLandmarks([results.landmarks[i][WRIST_BASE]], {
                  lineWidth: 3,
                  color: "white",
                });
              }
      
              canvasContext.restore();
              
              if (frameCount.current === 0 && resultLandmarks) {
                const currentAverageLandmakrs = calculateAverageLandmark();
                if (prevAverageLandmarks.current) {
                  const [isMoving, euclDistance] = isMoving3D(prevAverageLandmarks.current, currentAverageLandmakrs)
                  setDistance(euclDistance);
                  if (isMoving) {
                    movingFrameCount.current += 1;
                    if (movingFrameCount.current > 5) {
                      setHandMoving(true);
                      stillFrameCount.current = 0;
                      movingFrameCount.current = 0;
                    }
                    console.log('1');
                    
                  }
                  else {
                    stillFrameCount.current += 1;
                    if (stillFrameCount.current > 5) {
                      setHandMoving(false);
                      stillFrameCount.current = 0;
                      movingFrameCount.current = 0;
                    }
                    console.log('0');
                  }
                }
                
                
                prevAverageLandmarks.current = currentAverageLandmakrs;
                
              }
              
            }
          }
          
        window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = window.requestAnimationFrame(recognizeHands);
        
        frameCount.current = (frameCount.current + 1) % 1;
      };
      
      const createRecognizers = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        const landmarker = await HandLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                modelAssetPath: "/assets/hand_landmarker.task",
                delegate: "GPU",
                },
                runningMode: "VIDEO",
                numHands: 1,
            }
        );
        
        setsHandLandmarker(landmarker);
    }
    
    const addLandmark = (landmark) => {
      pastLandmarks.current.push(landmark);
      
      if (pastLandmarks.current.length > 5) {
        pastLandmarks.current.shift();
      }
    }
    
    const calculateAverageLandmark = () => {
      return pastLandmarks.current.reduce(
        (acc, curr) => {
          return acc.map((coords, i) => {
            
            return ({
              x: coords.x + curr[i].x,
              y: coords.y + curr[i].y,
              z: coords.z + curr[i].z,
            })
          }), pastLandmarks.current[0]
        }
      ).map((coords) => {
        const averageCoords = {
          x: coords.x / pastLandmarks.current.length,
          y: coords.y / pastLandmarks.current.length,
          z: coords.z / pastLandmarks.current.length,
        };
        return averageCoords;
      });
    }
    
    useEffect(() => {
        createRecognizers();
        
        setCanvasContext(canvasRef.current?.getContext("2d"));
        
    }, []);
    
    useEffect(() => {
        if (handLandmarker){
            animationFrameId.current = window.requestAnimationFrame(recognizeHands);
        }
    }, [handLandmarker])
    
    useEffect(() => {
      setCanvasWidth(window.innerWidth * 0.8);
      setCanvasHeight((window.innerWidth * 0.8) / 16 * 9);
    }, [window])
    
    return (
        <Box sx={{
          width: '80vw',
          aspectRatio: 16/9
        }}>
          <Webcam
              muted={false}
              ref={webcamRef}
              width={canvasWidth}
              videoConstraints={{ aspectRatio: 16 / 9 }}
              style={{position: 'absolute', zIndex: -1}}
              />
          <canvas
              className="canvas"
              ref={canvasRef}
              width={window.innerWidth * 0.8}
              height={(window.innerWidth * 0.8) / 16 * 9}
              style={{}}
          ></canvas>
          <Typography>{handMoving ? 'moving' : 'still'}</Typography>
        </Box>
    );
}

export default Home;