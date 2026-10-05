import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReports.css";

function AdminReports() {

    const [bookings, setBookings] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchReportsData = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login as admin.");
                    setLoading(false);
                    return;
                }

                const headers = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                };

                const [
                    bookingsResponse,
                    passengersResponse,
                    flightsResponse,
                    paymentsResponse
                ] = await Promise.all([
                    fetch("http://localhost:8080/api/bookings", {
                        headers
                    }),
                    fetch("http://localhost:8080/api/passengers", {
                        headers
                    }),
                    fetch("http://localhost:8080/api/flights", {
                        headers
                    }),
                    fetch("http://localhost:8080/api/payments", {
                        headers
                    })
                ]);

                if (
                    !bookingsResponse.ok ||
                    !passengersResponse.ok ||
                    !flightsResponse.ok ||
                    !paymentsResponse.ok
                ) {
                    throw new Error("Failed to load report data.");
                }

                const bookingsData = await bookingsResponse.json();
                const passengersData = await passengersResponse.json();
                const flightsData = await flightsResponse.json();
                const paymentsData = await paymentsResponse.json();

                setBookings(bookingsData);
                setPassengers(passengersData);
                setFlights(flightsData);
                setPayments(paymentsData);

            } catch (error) {

                console.error("Error loading reports:", error);
                setError("Unable to load report data.");

            } finally {

                setLoading(false);
            }
        };

        fetchReportsData();

    }, []);

    const totalBookings = bookings.length;

    const confirmedBookings = bookings.filter(
        booking => booking.status === "CONFIRMED"
    ).length;

    const cancelledBookings = bookings.filter(
        booking => booking.status === "CANCELLED"
    ).length;

    const successfulPayments = payments.filter(
        payment => payment.paymentStatus === "SUCCESS"
    );

    const failedPayments = payments.filter(
        payment => payment.paymentStatus === "FAILED"
    );

    const refundedPayments = payments.filter(
        payment => payment.paymentStatus === "REFUNDED"
    );

    const totalRevenue = successfulPayments.reduce(
        (total, payment) => total + payment.amount,
        0
    );

    const totalRefunded = refundedPayments.reduce(
        (total, payment) => total + payment.amount,
        0
    );

    if (loading) {
        return (
            <div className="admin-reports-container">
                <p className="report-message">
                    Loading reports...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-reports-container">
                <p className="report-error">
                    {error}
                </p>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="admin-reports-container">

            <div className="admin-reports-header">

                <div>
                    <h1>Reports & Statistics</h1>
                    <p>
                        View airline reservation system reports and financial statistics
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>

            {/* Booking Statistics */}

            <h2>Booking Statistics</h2>

            <div className="report-cards">

                <div className="report-card">
                    <h3>Total Bookings</h3>
                    <p>{totalBookings}</p>
                </div>

                <div className="report-card">
                    <h3>Confirmed Bookings</h3>
                    <p>{confirmedBookings}</p>
                </div>

                <div className="report-card">
                    <h3>Cancelled Bookings</h3>
                    <p>{cancelledBookings}</p>
                </div>

            </div>

            {/* System Statistics */}

            <h2>System Statistics</h2>

            <div className="report-cards">

                <div className="report-card">
                    <h3>Total Passengers</h3>
                    <p>{passengers.length}</p>
                </div>

                <div className="report-card">
                    <h3>Total Flights</h3>
                    <p>{flights.length}</p>
                </div>

            </div>

            {/* Payment Statistics */}

            <h2>Payment Statistics</h2>

            <div className="report-cards">

                <div className="report-card">
                    <h3>Successful Payments</h3>
                    <p>{successfulPayments.length}</p>
                </div>

                <div className="report-card">
                    <h3>Failed Payments</h3>
                    <p>{failedPayments.length}</p>
                </div>

                <div className="report-card">
                    <h3>Refunded Payments</h3>
                    <p>{refundedPayments.length}</p>
                </div>

            </div>

            {/* Financial Statistics */}

            <h2>Financial Statistics</h2>

            <div className="report-cards">

                <div className="report-card">
                    <h3>Total Revenue</h3>
                    <p>₹{totalRevenue.toFixed(2)}</p>
                </div>

                <div className="report-card">
                    <h3>Total Refunded</h3>
                    <p>₹{totalRefunded.toFixed(2)}</p>
                </div>

            </div>

            {/* Payment Report Table */}

            <h2>Payment Report</h2>

            <div className="report-table-container">

                <table className="report-table">

                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Booking ID</th>
                            <th>Passenger</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {payments.map((payment) => (

                            <tr key={payment.id}>

                                <td>{payment.paymentId}</td>

                                <td>
                                    {payment.booking?.bookingId || "N/A"}
                                </td>

                                <td>
                                    {payment.booking?.passenger
                                        ? `${payment.booking.passenger.firstName} ${payment.booking.passenger.lastName}`
                                        : "N/A"}
                                </td>

                                <td>
                                    ₹{payment.amount.toFixed(2)}
                                </td>

                                <td>
                                    {payment.paymentMethod}
                                </td>

                                <td>
                                    <span
                                        className={`status ${payment.paymentStatus.toLowerCase()}`}
                                    >
                                        {payment.paymentStatus}
                                    </span>
                                </td>

                                <td>
                                    {new Date(
                                        payment.paymentDate
                                    ).toLocaleString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default AdminReports;