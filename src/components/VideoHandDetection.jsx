import {
  DrawingUtils,
  HandLandmarker,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";
import { FilesetResolver } from "@mediapipe/tasks-text";
import { Fragment, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  Modal,
  Typography,
} from "@mui/material";

import {
  HAND_LANDMARKS_LITE,
  INDEX_TIP,
  MIDDLE_TIP,
  NOSE_TIP,
  PINKY_TIP,
  RING_TIP,
  THUMB_TIP,
  WRIST_BASE,
} from "../utils/Landmarks";

/**
 * Integrates with the React Webcam, canvas, and MediaPipe functions to detect hand movements and draw the landmarks on to the screen.
 *
 * This component:
 * 1. Captures a video stream from the user's webcam using the `react-webcam` library.
 * 2. Uses a hand-landmarking model to detect hand landmarks in each frame.
 * 3. Applies movement detection logic to determine if the hand is moving or still.
 *
 * Movement Detection Logic:
 * 1. **Average Coordinates**:
 *    - **Reason**: Certain hand positions yield lower accuracy, causing landmarks to jitter around specific points.
 *    - **Solution**: The component calculates the average position from the past N (5) landmarks to reduce noise.
 *
 * 2. **Continuous States**:
 *    - The state (moving/still) is only updated when it remains consistent for N (5) consecutive frames, reducing false positives.
 *
 * 3. **Threshold**:
 *    - A Euclidean distance threshold is used to filter out minor or excessive movements.
 *    - The distance is calculated within a defined range (`LOWER_THRESHOLD` and `UPPER_THRESHOLD`) to ignore small jitters or outlier movements.
 *
 * @returns {JSX.Element} A React component that renders the webcam and canvas, and displays the current movement status.
 */

function VideoHandDetection({ setResultLandmarks, setResultLandmarksLite }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [handLandmarker, setHandLandmarker] = useState(null);
  // const [poseLandmarker, setPoseLandmarker] = useState(null);
  const detectedResults = useRef(null);
  const [canvasContext, setCanvasContext] = useState(null);
  const animationFrameId = useRef(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  const recognizeHands = () => {
    detectedResults.current = null;
    if (handLandmarker) {
      const video = webcamRef?.current?.video;
      let handResults;
      let poseResults;
      const timeStamp = performance.now();
      // console.log('video', video);
      if (
        (video?.width || 0) > 0 &&
        (video?.height || 0) > 0 &&
        video.currentTime !== timeStamp
      ) {
        // console.log('vid width and height', video.width, video.height)
        // console.log('handLandmarker', handLandmarker)
        handResults = handLandmarker.detectForVideo(video, timeStamp);
        // poseResults = poseLandmarker.detectForVideo(video, timeStamp);
      } else return;

      canvasContext.save();
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      const drawingUtils = new DrawingUtils(canvasContext);
      if (handResults.landmarks?.length !== 0 && canvasRef.current) {
        let resultLandmarks;
        // const noseTipLandmarks = poseResults.landmarks[0][NOSE_TIP]

        for (let i = 0; i < (handResults?.landmarks?.length || 0); i++) {
          resultLandmarks = HAND_LANDMARKS_LITE.map(
            (index) => handResults.landmarks[i][index],
          );

          setResultLandmarks(handResults.landmarks[i]);
          setResultLandmarksLite(resultLandmarks);

          drawingUtils.drawLandmarks([handResults.landmarks[i][WRIST_BASE]], {
            lineWidth: 3,
            color: "white",
          });

          drawingUtils.drawLandmarks([handResults.landmarks[i][THUMB_TIP]], {
            lineWidth: 3,
            color: "red",
          });
          drawingUtils.drawLandmarks([handResults.landmarks[i][INDEX_TIP]], {
            lineWidth: 3,
            color: "green",
          });
          drawingUtils.drawLandmarks([handResults.landmarks[i][MIDDLE_TIP]], {
            lineWidth: 3,
            color: "blue",
          });
          drawingUtils.drawLandmarks([handResults.landmarks[i][RING_TIP]], {
            lineWidth: 3,
            color: "pink",
          });
          drawingUtils.drawLandmarks([handResults.landmarks[i][PINKY_TIP]], {
            lineWidth: 3,
            color: "purple",
          });
        }
        // for (let i = 0; i < (poseResults?.landmarks?.length || 0); i++) {
        //   drawingUtils.drawLandmarks([noseTipLandmarks], {
        //     lineWidth: 3,
        //     color: "turquoise",
        //   })
        // }

        canvasContext.restore();
      } else {
        setResultLandmarks([]);
        setResultLandmarksLite([]);
      }
    }

    window.cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = window.requestAnimationFrame(recognizeHands);
  };

  const createRecognizers = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    const hand = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "/assets/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
    // const pose = await PoseLandmarker.createFromOptions(vision, {
    //   baseOptions: {
    //     modelAssetPath: "/assets/pose_landmarker_lite.task",
    //     delegate: "GPU",
    //   },
    //   runningMode: "VIDEO",
    // });

    setHandLandmarker(hand);
    // setPoseLandmarker(pose);
  };

  useEffect(() => {
    createRecognizers();

    setCanvasContext(canvasRef.current?.getContext("2d"));
  }, []);

  useEffect(() => {
    if (handLandmarker) {
      animationFrameId.current = window.requestAnimationFrame(recognizeHands);
    }
  }, [handLandmarker]);

  useEffect(() => {
    setCanvasWidth(window.innerWidth * 0.8);
    setCanvasHeight(((window.innerWidth * 0.8) / 16) * 9);
  }, [window, canvasWidth, canvasHeight]);

  return (
    <Fragment>
      <Modal
        open={handLandmarker === null}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          flexDirection="column"
          alignItems="center"
          spacing={3}
          sx={{
            outline: "none",
          }}
        >
          <Grid xs={12}>
            <CircularProgress />
          </Grid>
          <Grid xs={12}>
            <Typography>Loading Hand Landmarker</Typography>
          </Grid>
        </Grid>
      </Modal>
      <Box
        sx={{
          width: "80vw",
          aspectRatio: 16 / 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "5rem",
        }}
      >
        <Webcam
          muted={false}
          ref={webcamRef}
          width={canvasWidth}
          height={canvasHeight}
          videoConstraints={{ aspectRatio: 16 / 9 }}
          style={{ position: "absolute", zIndex: -1 }}
        />
        <canvas
          className="canvas"
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
        ></canvas>
      </Box>
    </Fragment>
  );
}

export default VideoHandDetection;
