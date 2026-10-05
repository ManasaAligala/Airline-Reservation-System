import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminFlights.css";

function AdminFlights() {

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchFlights = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/flights",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch flights");
                }

                const data = await response.json();

                setFlights(data);

            } catch (error) {

                console.error("Error fetching flights:", error);

                setError("Unable to load flight data.");

            } finally {

                setLoading(false);

            }
        };

        fetchFlights();

    }, []);

    return (
        <div className="admin-flights-container">

            <div className="admin-flights-header">

                <div>
                    <h1>Flight Management</h1>
                    <p>View and manage all flights</p>
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
                    Loading flights...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && flights.length === 0 && (
                <p className="message">
                    No flights found.
                </p>
            )}

            {!loading && !error && flights.length > 0 && (

                <div className="flight-table-container">

                    <table className="flight-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Flight Number</th>
                                <th>Airline</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Duration</th>
                                <th>Aircraft</th>
                                <th>Capacity</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {flights.map((flight) => (

                                <tr key={flight.id}>

                                    <td>
                                        {flight.id}
                                    </td>

                                    <td>
                                        <strong>
                                            {flight.flightNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {flight.airline}
                                    </td>

                                    <td>
                                        {flight.departureAirport?.code}
                                        <br />
                                        <small>
                                            {flight.departureAirport?.city}
                                        </small>
                                    </td>

                                    <td>
                                        {flight.arrivalAirport?.code}
                                        <br />
                                        <small>
                                            {flight.arrivalAirport?.city}
                                        </small>
                                    </td>

                                    <td>
                                        {flight.durationMinutes} mins
                                    </td>

                                    <td>
                                        {flight.aircraft?.manufacturer}{" "}
                                        {flight.aircraft?.model}
                                    </td>

                                    <td>
                                        {flight.aircraft?.capacity}
                                    </td>

                                    <td>

                                        <span
                                            className={`flight-status ${
                                                flight.status?.toLowerCase()
                                            }`}
                                        >
                                            {flight.status}
                                        </span>

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

export default AdminFlights;