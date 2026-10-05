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

                const response = await fetch(
                    "http://localhost:8080/api/airports",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch airports");
                }

                const data = await response.json();

                setAirports(data);

            } catch (error) {

                console.error("Error fetching airports:", error);

                setError("Unable to load airport data.");

            } finally {

                setLoading(false);

            }
        };

        fetchAirports();

    }, []);

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
                <p className="message">
                    Loading airports...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && airports.length === 0 && (
                <p className="message">
                    No airports found.
                </p>
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