import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSchedules.css";

function AdminSchedules() {

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchSchedules = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/flight-schedules",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch schedules");
                }

                const data = await response.json();

                setSchedules(data);

            } catch (error) {

                console.error("Error fetching schedules:", error);

                setError("Unable to load schedule data.");

            } finally {

                setLoading(false);

            }
        };

        fetchSchedules();

    }, []);

    return (
        <div className="admin-schedules-container">

            <div className="admin-schedules-header">

                <div>
                    <h1>Schedule Management</h1>

                    <p>
                        View all flight schedules in the system
                    </p>
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
                    Loading schedules...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && schedules.length === 0 && (
                <p className="message">
                    No flight schedules found.
                </p>
            )}

            {!loading && !error && schedules.length > 0 && (

                <div className="schedule-table-container">

                    <table className="schedule-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Flight Number</th>
                                <th>Airline</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Schedule Status</th>
                                <th>Flight Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {schedules.map((schedule) => (

                                <tr key={schedule.id}>

                                    <td>{schedule.id}</td>

                                    <td>
                                        <strong>
                                            {schedule.flight?.flightNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {schedule.flight?.airline}
                                    </td>

                                    <td>
                                        {schedule.flight?.departureAirport?.code}
                                    </td>

                                    <td>
                                        {schedule.flight?.arrivalAirport?.code}
                                    </td>

                                    <td>
                                        {schedule.departureTime}
                                    </td>

                                    <td>
                                        {schedule.arrivalTime}
                                    </td>

                                    <td>
                                        <span className="schedule-status">
                                            {schedule.status}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="flight-status">
                                            {schedule.flight?.status}
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

export default AdminSchedules;