import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";
import TopNav from "./components/navigation/TopNav";
import { useState } from "react";
import VideoHandDetection from "./components/VideoHandDetection";
import HandDataCollection from "./components/HandDataCollection";
import HandShapeRecognition from "./components/HandShapeRecognition";
import HandProvider from "./contexts/HandContext";
import MovementDetection from "./components/MovementDetection";

function App() {
  const queryClient = new QueryClient();
  const [resultLandmarks, setResultLandmarks] = useState([]);
  const [distances, setDistances] = useState([]);

  return (
    <QueryClientProvider client={queryClient}>
        <HandProvider>
        <BrowserRouter>
          <TopNav />
          <VideoHandDetection setResultLandmarks={setResultLandmarks} />
          <MovementDetection
        resultLandmarks={resultLandmarks}
        setDistances={setDistances}
      />
          <Routes>
            <Route path="/" element={<Home resultLandmarks={resultLandmarks} distances={distances} />} />
            <Route path="/collect-hand" element={<HandDataCollection resultLandmarks={resultLandmarks} />} />
            <Route path="/test" element={<HandShapeRecognition />} />
          </Routes>
        </BrowserRouter>
    </HandProvider>
      </QueryClientProvider>
  );
}

export default App;
