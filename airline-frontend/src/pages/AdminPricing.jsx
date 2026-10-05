import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPricing.css";

function AdminPricing() {

    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchPricing = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/pricing",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch pricing");
                }

                const data = await response.json();

                setPricing(data);

            } catch (error) {

                console.error("Error fetching pricing:", error);

                setError("Unable to load pricing data.");

            } finally {

                setLoading(false);

            }
        };

        fetchPricing();

    }, []);

    return (
        <div className="admin-pricing-container">

            <div className="admin-pricing-header">

                <div>
                    <h1>Pricing Management</h1>

                    <p>
                        View flight pricing and fare details
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
                    Loading pricing...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && pricing.length === 0 && (
                <p className="message">
                    No pricing records found.
                </p>
            )}

            {!loading && !error && pricing.length > 0 && (

                <div className="pricing-table-container">

                    <table className="pricing-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Flight Number</th>
                                <th>Airline</th>
                                <th>Route</th>
                                <th>Base Fare</th>
                                <th>Tax</th>
                                <th>Total Fare</th>
                                <th>Flight Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {pricing.map((item) => (

                                <tr key={item.id}>

                                    <td>{item.id}</td>

                                    <td>
                                        <strong>
                                            {item.flight?.flightNumber}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.flight?.airline}
                                    </td>

                                    <td>
                                        {item.flight?.departureAirport?.code}
                                        {" → "}
                                        {item.flight?.arrivalAirport?.code}
                                    </td>

                                    <td>
                                        ₹{item.baseFare}
                                    </td>

                                    <td>
                                        ₹{item.tax}
                                    </td>

                                    <td>
                                        <strong>
                                            ₹{item.totalFare}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="flight-status">
                                            {item.flight?.status}
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

export default AdminPricing;