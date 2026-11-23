import React, { useState } from "react";
import { searchFlights } from "../services/flightService";

const FlightSearch = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Supported Indian airport codes and their cities
    const airportCityMap = {
        HYD: "Hyderabad",
        DEL: "Delhi",
        BLR: "Bangalore",
        BOM: "Mumbai",
        CCU: "Kolkata",
        MAA: "Chennai"
    };

    // Get today's date
    const getToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const [minDate] = useState(getToday);

    // Search flights from the separate flight schedule database
    const handleSearch = async (e) => {
        e.preventDefault();

        setError("");
        setFlights([]);

        const fromCode = from.trim().toUpperCase();
        const toCode = to.trim().toUpperCase();

        // Validate required fields
        if (!fromCode || !toCode || !date) {
            setError("Please enter departure, destination, and travel date.");
            return;
        }

        // Validate airport codes
        if (
            !/^[A-Z]{3}$/.test(fromCode) ||
            !/^[A-Z]{3}$/.test(toCode)
        ) {
            setError("Please enter valid 3-letter airport codes, such as HYD or DEL.");
            return;
        }

        // Get city names
        const fromCity = airportCityMap[fromCode];
        const toCity = airportCityMap[toCode];

        if (!fromCity || !toCity) {
            setError("Please enter a supported Indian airport code: HYD, DEL, BLR, BOM, CCU or MAA.");
            return;
        }

        // Validate travel date
        if (date < getToday()) {
            setError("Travel date cannot be in the past.");
            return;
        }

        // Check same departure and destination
        if (fromCode === toCode) {
            setError("Departure and destination airports must be different.");
            return;
        }

        setLoading(true);

        try {
            // Send city names to the main backend
            const data = await searchFlights(fromCity, toCity, date);

            setFlights(Array.isArray(data) ? data : []);

            if (!Array.isArray(data) || data.length === 0) {
                setError("No flights found for this route. Please try another route.");
            }
        } catch (err) {
            console.error("Database flight search failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to search flights. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flight-search">
            <h1>Search Flights</h1>

            <p>Choose your departure and destination airports.</p>

            <form onSubmit={handleSearch}>
                {/* Departure Airport */}
                <div>
                    <label htmlFor="from">From Airport</label>
                    <input
                        id="from"
                        type="text"
                        placeholder="Enter airport code (e.g. HYD)"
                        value={from}
                        onChange={(e) => setFrom(e.target.value.toUpperCase())}
                        maxLength={3}
                        required
                    />
                </div>

                {/* Destination Airport */}
                <div>
                    <label htmlFor="to">To Airport</label>
                    <input
                        id="to"
                        type="text"
                        placeholder="Enter airport code (e.g. DEL)"
                        value={to}
                        onChange={(e) => setTo(e.target.value.toUpperCase())}
                        maxLength={3}
                        required
                    />
                </div>

                {/* Travel Date */}
                <div>
                    <label htmlFor="date">Travel Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        min={minDate}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search Flights"}
                </button>
            </form>

            {/* Loading */}
            {loading && <p>Searching available flights...</p>}

            {/* Error */}
            {error && (
                <p role="alert" style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {/* Flight Results */}
            {flights.length > 0 && (
                <div>
                    <h2>Available Flights</h2>

                    {flights.map((flight) => (
                        <div key={flight.id} className="flight-card">
                            <h3>{flight.flight || flight.flightNumber}</h3>

                            <p>Airline: {flight.airline}</p>
                            <p>Route: {flight.sourceCity} → {flight.destinationCity}</p>
                            <p>Departure: {flight.departureTime}</p>
                            <p>Arrival: {flight.arrivalTime}</p>
                            <p>Duration: {flight.duration} hours</p>
                            <p>Stops: {flight.stops}</p>
                            <p>Class: {flight.flightClass}</p>
                            <p>Price: ₹{flight.price}</p>
                            <p>Travel date selected: {date}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Initial Message */}
            {!loading && flights.length === 0 && !error && (
                <p>Enter your journey details to search for flights.</p>
            )}
        </div>
    );
};

export default FlightSearch;







