import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = 1;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/bookings/user/${userId}`
      );

      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Unable to load bookings.");
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading bookings...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

 return (
  <div>
    <h1>My Bookings</h1>

    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            margin: "20px 0",
            borderRadius: "10px",
          }}
        >
          <h2>Booking ID: {booking.bookingId}</h2>

          <p>
            <strong>Booking Date:</strong> {booking.bookingDate}
          </p>

          <hr />

          <h3>Flight Details</h3>

          <p>
            <strong>Flight:</strong>{" "}
            {booking.flight?.flightNumber || "N/A"}
          </p>

          <p>
            <strong>Airline:</strong>{" "}
            {booking.flight?.airline || "N/A"}
          </p>

          <p>
            <strong>Route:</strong>{" "}
            {booking.flight?.departureAirport?.code || "N/A"}
            {" → "}
            {booking.flight?.arrivalAirport?.code || "N/A"}
          </p>

          <p>
            <strong>Duration:</strong>{" "}
            {booking.flight?.durationMinutes || "N/A"} minutes
          </p>

          <p>
            <strong>Flight Status:</strong>{" "}
            {booking.flight?.status || "N/A"}
          </p>

          <hr />

          <h3>Passenger Details</h3>

          <p>
            <strong>Name:</strong>{" "}
            {booking.passenger?.firstName || ""}{" "}
            {booking.passenger?.lastName || ""}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {booking.passenger?.email || "N/A"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {booking.passenger?.phoneNumber || "N/A"}
          </p>

          <p>
            <strong>Age:</strong>{" "}
            {booking.passenger?.age || "N/A"}
          </p>

          <hr />

          <h3>Seat Details</h3>

          <p>
            <strong>Seat Number:</strong>{" "}
            {booking.seat?.seatNumber || "N/A"}
          </p>

          <p>
            <strong>Seat Class:</strong>{" "}
            {booking.seat?.seatClass || "N/A"}
          </p>

          <p>
            <strong>Booking Status:</strong>{" "}
            {booking.status || "N/A"}
          </p>
        </div>
      ))
    )}
  </div>
);
}
export default MyBookings;