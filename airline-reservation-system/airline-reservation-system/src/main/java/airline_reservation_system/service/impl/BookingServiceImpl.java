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
                        new RuntimeException("Booking not found"));
    }

    // Retrieve booking using booking reference
    @Override
    public Booking getBookingByBookingId(String bookingId) {

        return bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    // Confirm booking and send confirmation email
    @Override
    public void confirmBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Prevent cancelled booking from being confirmed
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {

            throw new RuntimeException(
                    "Cancelled booking cannot be confirmed");
        }

        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);

        // Send booking confirmation email
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

            emailService.sendEmail(
                    email,
                    subject,
                    message
            );
        }
    }

    // Cancel booking, release seat, and send cancellation email
    @Override
    @Transactional
    public void cancelBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Prevent duplicate cancellation
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {

            throw new RuntimeException(
                    "This booking has already been cancelled");
        }

        // Update booking status
        booking.setStatus("CANCELLED");

        bookingRepository.save(booking);

        // Release the seat after cancellation
        if (booking.getSeat() != null) {

            Long seatId = booking.getSeat().getId();

            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seat not found with ID: " + seatId));

            // Temporary debug messages
            System.out.println(
                    "DEBUG - Seat ID: " + seat.getId());

            System.out.println(
                    "DEBUG - Seat Number: " + seat.getSeatNumber());

            System.out.println(
                    "DEBUG - Old Seat Status: " + seat.getStatus());

            // Change seat status to AVAILABLE
            seat.setStatus(SeatStatus.AVAILABLE);

            System.out.println(
                    "DEBUG - New Seat Status: " + seat.getStatus());

            // Save the updated seat immediately
            seatRepository.saveAndFlush(seat);

            System.out.println(
                    "DEBUG - Seat saved successfully");
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
                    + "Your seat has been released and is now available "
                    + "for booking.\n\n"
                    + "Your refund status will be handled separately, "
                    + "according to the applicable refund process.\n\n"
                    + "If you did not request this cancellation, "
                    + "please contact our support team.\n\n"
                    + "Thank you for using our Airline Reservation System.";

            emailService.sendEmail(
                    email,
                    subject,
                    message
            );
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