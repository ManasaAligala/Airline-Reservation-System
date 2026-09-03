import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<FlightSearch />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/flights/search" element={<FlightSearch />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;