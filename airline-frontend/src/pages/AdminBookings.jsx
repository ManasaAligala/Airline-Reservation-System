import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminBookings.css";

function AdminBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login as Admin.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                "http://localhost:8080/api/bookings",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401) {
                setError("Unauthorized. Please login again.");
                setLoading(false);
                return;
            }

            if (response.status === 403) {
                setError("Access denied. Admin access required.");
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }

            const data = await response.json();

            setBookings(data);
            setLoading(false);

        } catch (error) {

            console.error("Error fetching bookings:", error);

            setError("Unable to load bookings.");
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/admin-dashboard");
    };

    return (

        <div className="admin-bookings">

            <header className="admin-bookings-header">

                <div>
                    <h1>✈️ Airline Reservation System</h1>
                    <p>Booking Management</p>
                </div>

                <button
                    className="back-button"
                    onClick={handleBack}
                >
                    ← Back to Dashboard
                </button>

            </header>

            <main className="admin-bookings-content">

                <div className="bookings-title-section">

                    <h2>All Bookings</h2>

                    <p>
                        View all airline reservations made in the system.
                    </p>

                </div>

                {loading && (
                    <p className="loading-message">
                        Loading bookings...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && (

                    <div className="bookings-table-container">

                        <table className="bookings-table">

                            <thead>

                                <tr>
                                    <th>Booking ID</th>
                                    <th>Passenger</th>
                                    <th>Email</th>
                                    <th>Flight</th>
                                    <th>Route</th>
                                    <th>Seat</th>
                                    <th>Booking Date</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {bookings.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="no-bookings"
                                        >
                                            No bookings found.
                                        </td>

                                    </tr>

                                ) : (

                                    bookings.map((booking) => (

                                        <tr key={booking.id}>

                                            <td>
                                                <strong>
                                                    {booking.bookingId}
                                                </strong>
                                            </td>

                                            <td>
                                                {booking.passenger
                                                    ? `${booking.passenger.firstName} ${booking.passenger.lastName}`
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                {booking.passenger?.email || "N/A"}
                                            </td>

                                            <td>
                                                {booking.flight?.flightNumber || "N/A"}
                                            </td>

                                            <td>
                                                {booking.flight
                                                    ? `${booking.flight.departureAirport?.code || "N/A"} → ${booking.flight.arrivalAirport?.code || "N/A"}`
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                {booking.seat?.seatNumber || "N/A"}
                                            </td>

                                            <td>
                                                {booking.bookingDate
                                                    ? new Date(
                                                        booking.bookingDate
                                                    ).toLocaleString()
                                                    : "N/A"}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        booking.status === "CONFIRMED"
                                                            ? "status-confirmed"
                                                            : booking.status === "CANCELLED"
                                                                ? "status-cancelled"
                                                                : "status-pending"
                                                    }
                                                >
                                                    {booking.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </main>

        </div>
    );
}

export default AdminBookings;

