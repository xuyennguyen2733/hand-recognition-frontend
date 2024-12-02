import { DrawingUtils, HandLandmarker } from "@mediapipe/tasks-vision";
import { FilesetResolver } from "@mediapipe/tasks-text";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Box } from "@mui/material";

const handLandmarkEnum = {
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20,
  WRIST_BASE: 0
}

function Home() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [handLandmarker, setsHandLandmarker] = useState(null);
    const detectedResults = useRef(null);
    const [canvasContext, setCanvasContext] = useState(null)
    const animationFrameId = useRef(0);
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    
    const handLandmarkIndices = Object.values(handLandmarkEnum);
    
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
              
              for (let i = 0; i < results.landmarks.length; i++) {
                const resultLandmarks = handLandmarkIndices.map((index) => results.landmarks[i][index])
                drawingUtils.drawLandmarks(resultLandmarks, {
                  lineWidth: 3,
                  color: "red",
                });
              }
      
              canvasContext.restore();
            }
        }
        window.cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = window.requestAnimationFrame(recognizeHands);
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
                numHands: 2,
            }
        );
        
        setsHandLandmarker(landmarker);
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
      console.log('window change', canvasWidth, canvasHeight)
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
                style={{width: '80vw', position: 'absolute', zIndex: -1}}
                />
            <canvas
                className="canvas"
                ref={canvasRef}
                width={window.innerWidth * 0.8}
                height={(window.innerWidth * 0.8) / 16 * 9}
                style={{ aspectRatio: 16 / 9}}
            ></canvas>
        </Box>
    );
}

export default Home;