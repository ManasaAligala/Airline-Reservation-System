import React, { useEffect, useState } from "react"; import { useParams } from "react-router-dom"; 
import axios from "axios";
 function Ticket() { const { id } = useParams(); 
 const [ticket, setTicket] = useState(null); 
 const [loading, setLoading] = useState(true); 
 useEffect(() => { axios.get(`http://localhost:8080/api/tickets/${id}`) .then(response => { setTicket(response.data); 
    setLoading(false); }) .catch(error => { console.error("Error fetching ticket:", error);
         setLoading(false); }); 
        }, [id]); 
        const handleDownload = () => { window.print(); };
         if (loading) { return <h2>Loading ticket...</h2>;

          } if (!ticket) { return <h2>Ticket not found</h2>;
            
           } return ( <div> <h1>E-Ticket</h1> <button onClick={handleDownload}> Download Ticket </button> <p> <strong>Ticket Number:</strong>{" "} {ticket.ticketNumber} </p> <p> <strong>Status:</strong>{" "} {ticket.status} </p> <hr /> <h2>Passenger Details</h2> <p> <strong>Name:</strong>{" "} {ticket.booking.passenger.firstName}{" "} {ticket.booking.passenger.lastName} </p> <p> <strong>Email:</strong>{" "} {ticket.booking.passenger.email} </p> <p> <strong>Phone:</strong>{" "} {ticket.booking.passenger.phoneNumber} </p> <hr /> <h2>Flight Details</h2> <p> <strong>Airline:</strong>{" "} {ticket.booking.flight.airline} </p> <p> <strong>Flight:</strong>{" "} {ticket.booking.flight.flightNumber} </p> <p> <strong>From:</strong>{" "} {ticket.booking.flight.departureAirport.city} {" ("} {ticket.booking.flight.departureAirport.code} {")"} </p> <p> <strong>To:</strong>{" "} {ticket.booking.flight.arrivalAirport.city} {" ("} {ticket.booking.flight.arrivalAirport.code} {")"} </p> <p> <strong>Seat:</strong>{" "} {ticket.booking.seat.seatNumber} </p> <p> <strong>Class:</strong>{" "} {ticket.booking.seat.seatClass} </p> <hr /> <p> <strong>Booking ID:</strong>{" "} {ticket.booking.bookingId} </p> <p> <strong>Issue Date:</strong>{" "} {ticket.issueDate} </p> </div> ); } 
export default Ticket;