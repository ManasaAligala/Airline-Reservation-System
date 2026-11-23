
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SeatSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const flightId = location.state?.flightId;
    const flight = location.state?.flight;

    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!flightId) return;

        const fetchSeats = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/seats/flight/${flightId}/available`
                );

                setSeats(response.data);
            } catch (err) {
                console.error("Error loading seats:", err);
                setError("Unable to load available seats. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchSeats();
    }, [flightId]);

    const handleSeatClick = (seat) => {
        if (seat.status !== "AVAILABLE") return;
        setSelectedSeat(seat);
    };

    const handleContinue = () => {
        if (!selectedSeat) {
            alert("Please select an available seat.");
            return;
        }

        navigate("/passenger-details", {
            state: {
                flightId,
                flight,
                seatId: selectedSeat.id,
                seatNumber: selectedSeat.seatNumber
            }
        });
    };

    if (!flightId) {
        return (
            <div style={styles.container}>
                <h1>Select Your Seat</h1>
                <p>Please select a flight before choosing a seat.</p>
                <button
                    type="button"
                    onClick={() => navigate("/flights/search")}
                >
                    Back to Flight Search
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1>Select Your Seat</h1>

            {flight && (
                <p>
                    Flight: <strong>{flight.flightNumber}</strong>
                </p>
            )}

            <p style={styles.subtitle}>
                Choose an available seat for your flight.
            </p>

            <div style={styles.legend}>
                <span><span style={{ ...styles.legendBox, backgroundColor: "green" }} /> Available</span>
                <span><span style={{ ...styles.legendBox, backgroundColor: "red" }} /> Booked</span>
                <span><span style={{ ...styles.legendBox, backgroundColor: "blue" }} /> Selected</span>
            </div>

            {loading && <p>Loading seats...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && seats.length === 0 && (
                <p>No available seats were returned for this flight.</p>
            )}

            {!loading && !error && seats.length > 0 && (
                <div style={styles.aircraft}>
                    <h2>✈ Aircraft</h2>

                    <div style={styles.seatGrid}>
                        {seats.map((seat) => {
                            const isSelected = selectedSeat?.id === seat.id;

                            return (
                                <button
                                    type="button"
                                    key={seat.id}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={seat.status !== "AVAILABLE"}
                                    title={`Seat ${seat.seatNumber} — ${seat.status}`}
                                    style={{
                                        ...styles.seat,
                                        backgroundColor: isSelected
                                            ? "blue"
                                            : seat.status === "AVAILABLE"
                                                ? "green"
                                                : "red",
                                        cursor: seat.status === "AVAILABLE"
                                            ? "pointer"
                                            : "not-allowed"
                                    }}
                                >
                                    {seat.seatNumber}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={styles.selection}>
                {selectedSeat ? (
                    <>
                        <h3>Selected Seat: {selectedSeat.seatNumber}</h3>
                        <button
                            type="button"
                            style={styles.continueButton}
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </>
                ) : (
                    <h3>Please select an available seat</h3>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif"
    },
    subtitle: {
        color: "#666"
    },
    legend: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "25px",
        margin: "25px 0"
    },
    legendBox: {
        display: "inline-block",
        width: "15px",
        height: "15px",
        marginRight: "8px",
        borderRadius: "3px"
    },
    aircraft: {
        border: "2px solid #ddd",
        borderRadius: "20px",
        padding: "30px",
        maxWidth: "600px",
        margin: "auto"
    },
    seatGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(35px, 1fr))",
        gap: "15px",
        marginTop: "30px"
    },
    seat: {
        padding: "15px 5px",
        border: "none",
        borderRadius: "8px",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px"
    },
    selection: {
        marginTop: "30px"
    },
    continueButton: {
        padding: "12px 30px",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px"
    }
};

export default SeatSelection;

