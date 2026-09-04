import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights } from "../services/flightService";

const FlightSearch = () => {

    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setFlights([]);

        try {
            const data = await searchFlights(from, to, date);

            setFlights(data);

        } catch (error) {
            console.error(error);
            setError("Unable to search flights.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <h1>Search Flights</h1>

            <form onSubmit={handleSearch}>

                <div>
                    <label>From</label>
                    <input
                        type="text"
                        placeholder="HYD"
                        value={from}
                        onChange={(e) =>
                            setFrom(e.target.value.toUpperCase())
                        }
                        required
                    />
                </div>

                <div>
                    <label>To</label>
                    <input
                        type="text"
                        placeholder="DEL"
                        value={to}
                        onChange={(e) =>
                            setTo(e.target.value.toUpperCase())
                        }
                        required
                    />
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        required
                    />
                </div>

                <button type="submit">
                    Search Flights
                </button>

            </form>

            {loading && (
                <p>Searching for flights...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            <div>

                {flights.length > 0 && (
                    <div>

                        <h2>Available Flights</h2>

                        {flights.map((flight) => (
                            <div key={flight.id}>

                                <h3>
                                    {flight.flightNumber}
                                </h3>

                                <p>
                                    Airline: {flight.airline}
                                </p>

                                <p>
                                    Duration: {flight.durationMinutes} minutes
                                </p>

                                <p>
                                    Status: {flight.status}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/flights/${flight.id}`)
                                    }
                                >
                                    View Details
                                </button>

                            </div>
                        ))}

                    </div>
                )}

                {!loading &&
                    flights.length === 0 &&
                    !error && (
                        <p>
                            Search for available flights.
                        </p>
                    )}

            </div>

        </div>
    );
};

export default FlightSearch;






