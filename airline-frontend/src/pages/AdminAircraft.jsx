import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAircraft.css";

function AdminAircraft() {

    const [aircraft, setAircraft] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchAircraft = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/aircraft",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch aircraft");
                }

                const data = await response.json();

                setAircraft(data);

            } catch (error) {

                console.error("Error fetching aircraft:", error);

                setError("Unable to load aircraft data.");

            } finally {

                setLoading(false);

            }
        };

        fetchAircraft();

    }, []);

    return (
        <div className="admin-aircraft-container">

            <div className="admin-aircraft-header">

                <div>
                    <h1>Aircraft Management</h1>

                    <p>
                        View all aircraft in the system
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
                    Loading aircraft...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && aircraft.length === 0 && (
                <p className="message">
                    No aircraft found.
                </p>
            )}

            {!loading && !error && aircraft.length > 0 && (

                <div className="aircraft-table-container">

                    <table className="aircraft-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Manufacturer</th>
                                <th>Model</th>
                                <th>Capacity</th>
                            </tr>

                        </thead>

                        <tbody>

                            {aircraft.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.id}</td>

                                    <td>
                                        <strong>
                                            {item.manufacturer}
                                        </strong>
                                    </td>

                                    <td>{item.model}</td>

                                    <td>
                                        {item.capacity} passengers
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

export default AdminAircraft;