import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import "./App.css";
import TopNav from "./components/navigation/TopNav";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TopNav />

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
