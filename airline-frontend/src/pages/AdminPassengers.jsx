import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPassengers.css";

function AdminPassengers() {

    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchPassengers = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/passengers",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch passengers");
                }

                const data = await response.json();

                setPassengers(data);

            } catch (error) {

                console.error("Error fetching passengers:", error);

                setError("Unable to load passenger data.");

            } finally {

                setLoading(false);

            }
        };

        fetchPassengers();

    }, []);

    return (
        <div className="admin-passengers-container">

            <div className="admin-passengers-header">

                <div>
                    <h1>Passenger Management</h1>
                    <p>View all passengers and their flight details</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>

            {loading && (
                <p className="message">
                    Loading passengers...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && passengers.length === 0 && (
                <p className="message">
                    No passengers found.
                </p>
            )}

            {!loading && !error && passengers.length > 0 && (

                <div className="passenger-table-container">

                    <table className="passenger-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Passenger</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Age</th>
                                <th>Seat</th>
                                <th>Class</th>
                                <th>Seat Status</th>
                                <th>Flight</th>
                                <th>Route</th>
                            </tr>
                        </thead>

                        <tbody>

                            {passengers.map((passenger) => (

                                <tr key={passenger.id}>

                                    <td>
                                        {passenger.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {passenger.firstName}{" "}
                                            {passenger.lastName}
                                        </strong>
                                    </td>

                                    <td>
                                        {passenger.email}
                                    </td>

                                    <td>
                                        {passenger.phoneNumber}
                                    </td>

                                    <td>
                                        {passenger.age}
                                    </td>

                                    <td>
                                        {passenger.seat
                                            ? passenger.seat.seatNumber
                                            : "N/A"}
                                    </td>

                                    <td>
                                        {passenger.seat
                                            ? passenger.seat.seatClass
                                            : "N/A"}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                passenger.seat?.status === "BOOKED"
                                                    ? "status booked"
                                                    : "status available"
                                            }
                                        >
                                            {passenger.seat
                                                ? passenger.seat.status
                                                : "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        {passenger.seat?.flight?.flightNumber
                                            || "N/A"}
                                    </td>

                                    <td>
                                        {passenger.seat?.flight?.departureAirport?.code
                                            || "N/A"}
                                        {" → "}
                                        {passenger.seat?.flight?.arrivalAirport?.code
                                            || "N/A"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default AdminPassengers;

