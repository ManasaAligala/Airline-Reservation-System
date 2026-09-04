import React, { useEffect, useState } from "react";
 import { useNavigate, useParams } from "react-router-dom"; 
 
 import axios from "axios"; 
 const FlightDetails = () => { const { id } = useParams(); 
 const navigate = useNavigate();
 const [flight, setFlight] = useState(null);
 const [loading, setLoading] = useState(true); 
 const [error, setError] = useState("");
    useEffect(() => { const fetchFlightDetails = async () => { try { const response = await axios.get( `http://localhost:8080/api/flights/${id}` );
    setFlight(response.data); 
    } catch (error) { console.error(error);
        setError("Unable to load flight details."); 
        } finally { setLoading(false); 
    } }; 
        fetchFlightDetails();}, [id]);
     if (loading) { return <p>Loading flight details...</p>; 

     } if (error) { return <p>{error}</p>;
     } if (!flight) { return <p>Flight not found.</p>; } return ( <div> <h1>Flight Details</h1> <div> <h2>{flight.flightNumber}</h2> <p> <strong>Airline:</strong>{" "} {flight.airline} </p> <p> <strong>From:</strong>{" "} {flight.departureAirport?.name} {" "} ({flight.departureAirport?.code}) </p> <p> <strong>To:</strong>{" "} {flight.arrivalAirport?.name} {" "} ({flight.arrivalAirport?.code}) </p> <p> <strong>Duration:</strong>{" "} {flight.durationMinutes} minutes </p> <p> <strong>Status:</strong>{" "} {flight.status} </p> <p> <strong>Aircraft:</strong>{" "} {flight.aircraft?.model} </p> <p> <strong>Capacity:</strong>{" "} {flight.aircraft?.capacity} </p> </div> <button type="button" onClick={() => navigate("/flights/search")} > ← Back to Search </button> </div>
     ); };
      export default FlightDetails;