
import React, { useState } from "react";

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Temporary seat data
  // Later, we will load this from your Seat Availability API
  const seats = [
    { seatNumber: "1A", status: "AVAILABLE" },
    { seatNumber: "1B", status: "AVAILABLE" },
    { seatNumber: "1C", status: "BOOKED" },
    { seatNumber: "1D", status: "AVAILABLE" },
    { seatNumber: "1E", status: "BOOKED" },
    { seatNumber: "1F", status: "AVAILABLE" },

    { seatNumber: "2A", status: "AVAILABLE" },
    { seatNumber: "2B", status: "BOOKED" },
    { seatNumber: "2C", status: "AVAILABLE" },
    { seatNumber: "2D", status: "AVAILABLE" },
    { seatNumber: "2E", status: "AVAILABLE" },
    { seatNumber: "2F", status: "BOOKED" },

    { seatNumber: "3A", status: "BOOKED" },
    { seatNumber: "3B", status: "AVAILABLE" },
    { seatNumber: "3C", status: "AVAILABLE" },
    { seatNumber: "3D", status: "BOOKED" },
    { seatNumber: "3E", status: "AVAILABLE" },
    { seatNumber: "3F", status: "AVAILABLE" },
  ];

  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED") {
      return;
    }

    setSelectedSeat(seat.seatNumber);
  };

  return (
    <div style={styles.container}>
      <h1>Select Your Seat</h1>

      <p style={styles.subtitle}>
        Choose an available seat for your flight
      </p>

      {/* Seat Legend */}
      <div style={styles.legend}>
        <div>
          <span style={{ ...styles.legendBox, backgroundColor: "green" }}></span>
          Available
        </div>

        <div>
          <span style={{ ...styles.legendBox, backgroundColor: "red" }}></span>
          Booked
        </div>

        <div>
          <span style={{ ...styles.legendBox, backgroundColor: "blue" }}></span>
          Selected
        </div>
      </div>

      {/* Aircraft */}
      <div style={styles.aircraft}>
        <h2>✈ Aircraft</h2>

        <div style={styles.seatGrid}>
          {seats.map((seat) => {
            let backgroundColor = "green";

            if (seat.status === "BOOKED") {
              backgroundColor = "red";
            }

            if (selectedSeat === seat.seatNumber) {
              backgroundColor = "blue";
            }

            return (
              <button
                key={seat.seatNumber}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status === "BOOKED"}
                style={{
                  ...styles.seat,
                  backgroundColor,
                  cursor:
                    seat.status === "BOOKED" ? "not-allowed" : "pointer",
                }}
              >
                {seat.seatNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Seat */}
      <div style={styles.selection}>
        {selectedSeat ? (
          <>
            <h3>Selected Seat: {selectedSeat}</h3>

            <button style={styles.continueButton}>
              Continue
            </button>
          </>
        ) : (
          <h3>Please select a seat</h3>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },

  subtitle: {
    color: "#666",
  },

  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    margin: "25px 0",
  },

  legendBox: {
    display: "inline-block",
    width: "15px",
    height: "15px",
    marginRight: "8px",
    borderRadius: "3px",
  },

  aircraft: {
    border: "2px solid #ddd",
    borderRadius: "20px",
    padding: "30px",
    maxWidth: "600px",
    margin: "auto",
  },

  seatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "15px",
    marginTop: "30px",
  },

  seat: {
    padding: "15px 5px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
  },

  selection: {
    marginTop: "30px",
  },

  continueButton: {
    padding: "12px 30px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default SeatSelection;

