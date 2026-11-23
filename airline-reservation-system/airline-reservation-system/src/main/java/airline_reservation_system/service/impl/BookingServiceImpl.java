
package airline_reservation_system.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.entity.Seat;
import airline_reservation_system.entity.SeatStatus;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.repository.SeatRepository;
import airline_reservation_system.service.BookingService;
import airline_reservation_system.service.EmailService;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final EmailService emailService;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            SeatRepository seatRepository,
            EmailService emailService) {

        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.emailService = emailService;
    }

    // Create a new booking
    @Override
    @Transactional
    public Booking createBooking(Booking booking) {

        long bookingCount = bookingRepository.count();

        String bookingId =
                "BK" + String.format("%03d", bookingCount + 1);

        booking.setBookingId(bookingId);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // Retrieve all bookings
    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // Retrieve booking using database ID
    @Override
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id));
    }

    // Retrieve booking using booking reference
    @Override
    public Booking getBookingByBookingId(String bookingId) {

        return bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found: " + bookingId));
    }

    // Confirm booking and send confirmation email
    @Override
    @Transactional
    public void confirmBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException(
                    "Cancelled booking cannot be confirmed");
        }

        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        if (booking.getPassenger() != null
                && booking.getPassenger().getEmail() != null) {

            String email = booking.getPassenger().getEmail();

            String subject = "Booking Confirmation - "
                    + booking.getBookingId();

            String message =
                    "Dear "
                    + booking.getPassenger().getFirstName()
                    + ",\n\n"
                    + "Your airline booking has been confirmed successfully.\n\n"
                    + "Booking ID: "
                    + booking.getBookingId()
                    + "\n"
                    + "Status: CONFIRMED\n\n"
                    + "Thank you for choosing our Airline Reservation System.\n\n"
                    + "Have a safe journey!";

            emailService.sendEmail(email, subject, message);
        }
    }

    // Cancel booking and release the seat safely
    @Override
    @Transactional
    public void cancelBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException(
                    "This booking has already been cancelled");
        }

        // Update booking status first
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        if (booking.getSeat() != null) {

            Long seatId = booking.getSeat().getId();

            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seat not found with ID: " + seatId));

            // Check whether another active booking uses this seat
            boolean anotherActiveBookingExists =
                    bookingRepository.findAll().stream()
                            .anyMatch(otherBooking ->
                                    !otherBooking.getId().equals(
                                            booking.getId())
                                    && otherBooking.getSeat() != null
                                    && otherBooking.getSeat().getId()
                                            .equals(seatId)
                                    && ("PENDING".equalsIgnoreCase(
                                                otherBooking.getStatus())
                                        || "CONFIRMED".equalsIgnoreCase(
                                                otherBooking.getStatus())));

            if (anotherActiveBookingExists) {

                // Do not release a seat used by another active booking
                seat.setStatus(SeatStatus.BOOKED);
                seatRepository.save(seat);

                System.out.println(
                        "Seat " + seat.getSeatNumber()
                        + " remains BOOKED by another active booking.");

            } else {

                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);

                System.out.println(
                        "Seat " + seat.getSeatNumber()
                        + " is now AVAILABLE.");
            }
        }

        // Send cancellation email
        if (booking.getPassenger() != null
                && booking.getPassenger().getEmail() != null) {

            String email = booking.getPassenger().getEmail();

            String subject = "Booking Cancellation - "
                    + booking.getBookingId();

            String message =
                    "Dear "
                    + booking.getPassenger().getFirstName()
                    + ",\n\n"
                    + "Your airline booking has been cancelled successfully.\n\n"
                    + "Booking ID: "
                    + booking.getBookingId()
                    + "\n"
                    + "Status: CANCELLED\n\n"
                    + "Thank you for using our Airline Reservation System.";

            emailService.sendEmail(email, subject, message);
        }
    }

    // Retrieve booking history for a user
    @Override
    public List<Booking> getBookingsByUserId(Long userId) {

        return bookingRepository.findAll().stream()
                .filter(booking ->
                        booking.getUser() != null
                        && booking.getUser().getId() != null
                        && booking.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }
}
