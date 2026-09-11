import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";
import FlightDetails from "./pages/FlightDetails";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<FlightSearch />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/flights/search" element={<FlightSearch />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route
          path="/flights/:id"
          element={<FlightDetails />}
        />

        <Route
          path="/seat-selection"
          element={<SeatSelection />}
        />

      

        <Route
          path="/passenger-details"
          element={<PassengerDetails />}
        />
    </Routes>
    </BrowserRouter>
  );
}

export default App;



