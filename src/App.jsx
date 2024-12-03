import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";
import TopNav from "./components/navigation/TopNav";
import { useState } from "react";
import VideoHandDetection from "./components/VideoHandDetection";
import HandDataCollection from "./components/HandDataCollection";
import HandShapeRecognition from "./components/HandShapeRecognition";

function App() {
  const queryClient = new QueryClient();
  const [resultLandmarks, setResultLandmarks] = useState([]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopNav />
          <VideoHandDetection setResultLandmarks={setResultLandmarks} />

          <Routes>
            <Route path="/" element={<Home resultLandmarks={resultLandmarks} />} />
            <Route path="/collect-hand" element={<HandDataCollection />} />
            <Route path="/test" element={<HandShapeRecognition />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
