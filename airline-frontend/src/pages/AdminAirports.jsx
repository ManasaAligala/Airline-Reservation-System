
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAirports.css";

function AdminAirports() {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const token = localStorage.getItem("token");

                // Check whether the user is logged in
                if (!token) {
                    navigate("/login", { replace: true });
                    return;
                }

                const response = await fetch(
                    "http://localhost:8080/api/airports",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json"
                        }
                    }
                );

                // Read the backend response
                const responseText = await response.text();

                let data = null;

                if (responseText) {
                    try {
                        data = JSON.parse(responseText);
                    } catch {
                        data = responseText;
                    }
                }

                // Display the actual HTTP error
                if (!response.ok) {
                    if (response.status === 401) {
                        setError(
                            "Your login session is invalid or expired. Please log in again."
                        );
                        return;
                    }

                    if (response.status === 403) {
                        setError(
                            "Access denied. Check your admin permissions and backend security configuration."
                        );
                        return;
                    }

                    if (response.status === 404) {
                        setError(
                            "Airport API endpoint not found. Check the backend AirportController URL."
                        );
                        return;
                    }

                    throw new Error(
                        `Server error ${response.status}: ${
                            typeof data === "string"
                                ? data
                                : JSON.stringify(data)
                        }`
                    );
                }

                // Support common backend response formats
                let airportList = [];

                if (Array.isArray(data)) {
                    airportList = data;
                } else if (Array.isArray(data?.airports)) {
                    airportList = data.airports;
                } else if (Array.isArray(data?.content)) {
                    airportList = data.content;
                } else {
                    throw new Error(
                        "The backend response is not an airport list. Check the AirportController response format."
                    );
                }

                setAirports(airportList);
                setError("");
            } catch (err) {
                console.error("Error fetching airports:", err);

                setError(
                    err.message ||
                    "Unable to connect to the backend. Check whether Spring Boot is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAirports();
    }, [navigate]);

    return (
        <div className="admin-airports-container">
            <div className="admin-airports-header">
                <div>
                    <h1>Airport Management</h1>
                    <p>View all airports in the system</p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {loading && (
                <p className="message">Loading airports...</p>
            )}

            {!loading && error && (
                <p className="error-message">{error}</p>
            )}

            {!loading && !error && airports.length === 0 && (
                <p className="message">No airports found.</p>
            )}

            {!loading && !error && airports.length > 0 && (
                <div className="airport-table-container">
                    <table className="airport-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Airport Name</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Code</th>
                            </tr>
                        </thead>

                        <tbody>
                            {airports.map((airport) => (
                                <tr key={airport.id}>
                                    <td>{airport.id}</td>
                                    <td>
                                        <strong>
                                            {airport.name}
                                        </strong>
                                    </td>
                                    <td>{airport.city}</td>
                                    <td>{airport.country}</td>
                                    <td>
                                        <span className="airport-code">
                                            {airport.code}
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

export default AdminAirports;
