import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FlightSearch from "./pages/FlightSearch";
import FlightDetails from "./pages/FlightDetails";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import MyBookings from "./pages/MyBookings";
import Ticket from "./pages/Ticket";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminPassengers from "./pages/AdminPassengers";
import AdminFlights from "./pages/AdminFlights";
import AdminAirports from "./pages/AdminAirports";
import AdminAircraft from "./pages/AdminAircraft";
import AdminSchedules from "./pages/AdminSchedules";
import AdminPricing from "./pages/AdminPricing";
import AdminReports from "./pages/AdminReports";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Normal User Routes */}

                <Route
                    path="/"
                    element={<FlightSearch />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/flights/search"
                    element={<FlightSearch />}
                />

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

                <Route
                    path="/my-bookings"
                    element={<MyBookings />}
                />

                <Route
                    path="/ticket/:id"
                    element={<Ticket />}
                />

                {/* Sprint 8 - Admin Routes */}

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/users"
                    element={<AdminUsers />}
                />

                <Route
                    path="/admin/bookings"
                    element={<AdminBookings />}
                />

                <Route
                    path="/admin/passengers"
                    element={<AdminPassengers />}
                />

                <Route
                    path="/admin/flights"
                    element={<AdminFlights />}
                />

                <Route
                    path="/admin/airports"
                    element={<AdminAirports />}
                />

                <Route
                    path="/admin/aircraft"
                    element={<AdminAircraft />}
                />

                <Route
                    path="/admin/schedules"
                    element={<AdminSchedules />}
                />

                <Route 
                    path="/admin/pricing"
                    element={<AdminPricing />}
                />

                <Route path="/admin/reports" element={<AdminReports />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;


