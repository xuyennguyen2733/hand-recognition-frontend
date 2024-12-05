import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";
import TopNav from "./components/navigation/TopNav";
import { useState } from "react";
import VideoHandDetection from "./components/VideoHandDetection";
import HandExamination from "./components/HandExamination";
import HandShapeRecognition from "./components/HandShapeRecognition";
import HandProvider from "./contexts/HandContext";
import MovementDetection from "./components/MovementDetection";
import HandDataCollection from "./components/HandDataCollection";

function App() {
  const queryClient = new QueryClient();
  const [resultLandmarks, setResultLandmarks] = useState([]);
  const [resultLandmarksLite, setResultLandmarksLite] = useState([]);
  const [distances, setDistances] = useState([]);

  return (
    <QueryClientProvider client={queryClient}>
        <HandProvider>
        <BrowserRouter>
          <TopNav />
          <VideoHandDetection setResultLandmarks={setResultLandmarks} setResultLandmarksLite={setResultLandmarksLite} />
          <MovementDetection
        resultLandmarks={resultLandmarksLite}
        setDistances={setDistances}
      />
          <Routes>
            <Route path="/" element={<Home resultLandmarks={resultLandmarks} distances={distances} />} />
            <Route path="/examine-hand" element={<HandExamination resultLandmarks={resultLandmarks} />} />
            <Route path="/collect-hand-lite" element={<HandExamination resultLandmarks={resultLandmarksLite} />} />
            <Route path="/collect-hand" element={<HandDataCollection resultLandmarks={resultLandmarksLite} />} />
            <Route path="/test" element={<HandShapeRecognition />} />
          </Routes>
        </BrowserRouter>
    </HandProvider>
      </QueryClientProvider>
  );
}

export default App;
