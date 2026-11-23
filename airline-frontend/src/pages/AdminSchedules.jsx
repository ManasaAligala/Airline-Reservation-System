
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSchedules.css";

const API_URL = "http://localhost:8080";

function AdminSchedules() {
    const [schedules, setSchedules] = useState([]);
    const [flights, setFlights] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        flightId: "",
        departureTime: "",
        arrivalTime: "",
        status: "SCHEDULED"
    });

    const navigate = useNavigate();

    const getHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    });

    // Load schedules and available flights
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [scheduleResponse, flightResponse] = await Promise.all([
                fetch(`${API_URL}/api/flight-schedules`, {
                    headers: getHeaders()
                }),
                fetch(`${API_URL}/api/flights`, {
                    headers: getHeaders()
                })
            ]);

            if (!scheduleResponse.ok || !flightResponse.ok) {
                throw new Error("Unable to load schedules or flights.");
            }

            const scheduleData = await scheduleResponse.json();
            const flightData = await flightResponse.json();

            setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
            setFlights(Array.isArray(flightData) ? flightData : []);

        } catch (err) {
            console.error("Error loading data:", err);
            setError(err.message || "Unable to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Create schedule
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.flightId ||
            !formData.departureTime ||
            !formData.arrivalTime) {
            setError("Please fill in all required fields.");
            return;
        }

        if (
            new Date(formData.arrivalTime) <=
            new Date(formData.departureTime)
        ) {
            setError("Arrival time must be after departure time.");
            return;
        }

        const selectedFlight = flights.find(
            (flight) => String(flight.id) === String(formData.flightId)
        );

        if (!selectedFlight) {
            setError("Please select a valid flight.");
            return;
        }

        const scheduleData = {
            flight: {
                id: Number(formData.flightId)
            },
            departureTime: formData.departureTime,
            arrivalTime: formData.arrivalTime,
            status: formData.status
        };

        try {
            setSaving(true);

            const response = await fetch(
                `${API_URL}/api/flight-schedules`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(scheduleData)
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to create schedule.");
            }

            setSuccess("Flight schedule created successfully!");

            setFormData({
                flightId: "",
                departureTime: "",
                arrivalTime: "",
                status: "SCHEDULED"
            });

            setShowForm(false);

            await fetchData();

        } catch (err) {
            console.error("Schedule creation error:", err);
            setError(err.message || "Unable to create schedule.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-schedules-container">

            <div className="admin-schedules-header">
                <div>
                    <h1>Schedule Management</h1>
                    <p>View and manage all flight schedules</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {success && (
                <p className="success-message">{success}</p>
            )}

            {error && (
                <p className="error-message">{error}</p>
            )}

            <button
                type="button"
                onClick={() => {
                    setShowForm(!showForm);
                    setError("");
                    setSuccess("");
                }}
            >
                {showForm ? "Cancel" : "+ Add Schedule"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} className="schedule-form">

                    <h2>Add New Flight Schedule</h2>

                    <div>
                        <label htmlFor="flightId">Select Flight</label>

                        <select
                            id="flightId"
                            name="flightId"
                            value={formData.flightId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Flight --</option>

                            {flights.map((flight) => (
                                <option key={flight.id} value={flight.id}>
                                    {flight.flightNumber} - {flight.airline}
                                    {" ("}
                                    {flight.departureAirport?.code}
                                    {" → "}
                                    {flight.arrivalAirport?.code}
                                    {")"}
                                </option>
                            ))}
                        </select>

                        {flights.length === 0 && (
                            <p>No flights available. Add a flight first.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="departureTime">
                            Departure Date and Time
                        </label>

                        <input
                            id="departureTime"
                            type="datetime-local"
                            name="departureTime"
                            value={formData.departureTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="arrivalTime">
                            Arrival Date and Time
                        </label>

                        <input
                            id="arrivalTime"
                            type="datetime-local"
                            name="arrivalTime"
                            value={formData.arrivalTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status">Schedule Status</label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="DELAYED">DELAYED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || flights.length === 0}
                    >
                        {saving ? "Saving..." : "Save Schedule"}
                    </button>

                </form>
            )}

            {loading ? (
                <p className="message">Loading schedules...</p>
            ) : schedules.length === 0 ? (
                <p className="message">No flight schedules found.</p>
            ) : (
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

                                    <td>{schedule.flight?.airline}</td>

                                    <td>
                                        {schedule.flight?.departureAirport?.code}
                                    </td>

                                    <td>
                                        {schedule.flight?.arrivalAirport?.code}
                                    </td>

                                    <td>{schedule.departureTime}</td>

                                    <td>{schedule.arrivalTime}</td>

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
