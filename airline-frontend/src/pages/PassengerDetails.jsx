import React, { useState } from "react";

function PassengerDetails() {

    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    const handleChange = (e) => {
        setPassenger({
            ...passenger,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Passenger Details:", passenger);

        alert("Passenger details submitted successfully!");
    };

    return (
        <div style={styles.page}>

            <div style={styles.container}>

                <h1 style={styles.heading}>
                    Passenger Details
                </h1>

                <p style={styles.subtitle}>
                    Enter the passenger information for your booking
                </p>

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

                    <div style={styles.selectedSeat}>
                        <strong>Selected Seat:</strong> 1B
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                    >
                        Continue
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
        gap: "15px"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
        flex: 1
    },

    label: {
        marginBottom: "7px",
        fontWeight: "600"
    },

    input: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px"
    },

    selectedSeat: {
        backgroundColor: "#eef2ff",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        textAlign: "center"
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