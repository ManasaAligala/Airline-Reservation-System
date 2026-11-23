
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function PassengerDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    // Receive information from the Seat Selection page
    const { flightId, flight, seatNumber, seatId } = location.state || {};

    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        age: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPassenger({
            ...passenger,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!flightId || !seatNumber) {
            alert("Please select a flight and seat first.");
            navigate("/flights/search");
            return;
        }

        // The backend needs the database seat ID, not just its label (3C).
        if (!seatId) {
            alert(
                `You selected seat ${seatNumber}, but its database ID ` +
                "has not been passed to this page yet. We need to connect " +
                "seat selection with the database before saving the booking."
            );
            return;
        }

        setLoading(true);

        try {
            const passengerResponse = await axios.post(
                "http://localhost:8080/api/passengers",
                {
                    ...passenger,
                    age: Number(passenger.age),
                    seat: { id: seatId }
                }
            );

            const passengerId = passengerResponse.data.id;

            // Read the logged-in user ID from the saved login response.
            // The exact storage key must match your Login.jsx implementation.
            const savedUser = localStorage.getItem("user");
            const user = savedUser ? JSON.parse(savedUser) : null;

            if (!user?.id) {
                alert(
                    "Passenger saved, but the logged-in user ID was not " +
                    "found. Please check your Login.jsx storage code."
                );
                return;
            }

            const bookingResponse = await axios.post(
                "http://localhost:8080/api/bookings",
                {
                    user: { id: user.id },
                    flight: { id: Number(flightId) },
                    passenger: { id: passengerId },
                    seat: { id: Number(seatId) },
                    bookingDate: new Date().toISOString().slice(0, 19),
                    status: "PENDING"
                }
            );

            alert(
                "Booking created successfully! Booking ID: " +
                bookingResponse.data.bookingId
            );

            console.log("Booking created:", bookingResponse.data);
        } catch (error) {
            console.error("Booking error:", error.response?.data || error);

            alert(
                error.response?.data?.message ||
                "Unable to complete booking. Please check the backend error."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!flightId || !seatNumber) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <h2>Please select a flight and seat first.</h2>
                    <button
                        style={styles.button}
                        onClick={() => navigate("/flights/search")}
                    >
                        Back to Flight Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.heading}>Passenger Details</h1>

                <p style={styles.subtitle}>
                    Enter the passenger information for your booking
                </p>

                <div style={styles.selectedSeat}>
                    <strong>Flight:</strong>{" "}
                    {flight?.flightNumber || `Flight ID ${flightId}`}
                    <br />
                    <strong>Selected Seat:</strong> {seatNumber}
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={passenger.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={passenger.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={passenger.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={passenger.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            min="1"
                            value={passenger.age}
                            onChange={handleChange}
                            placeholder="Enter age"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px"
    },
    container: {
        width: "500px",
        maxWidth: "100%",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    },
    heading: {
        textAlign: "center",
        marginBottom: "10px"
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "30px"
    },
    row: {
        display: "flex",
        flexWrap: "wrap",
        gap: "15px"
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        marginBottom: "20px",
        flex: 1
    },
    selectedSeat: {
        backgroundColor: "#eef2ff",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center",
        lineHeight: "1.8"
    },
    button: {
        width: "100%",
        padding: "13px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer"
    }
};

export default PassengerDetails;
