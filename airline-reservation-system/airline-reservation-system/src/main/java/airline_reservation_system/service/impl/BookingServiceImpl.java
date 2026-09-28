package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.service.BookingService;
import airline_reservation_system.service.EmailService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            EmailService emailService) {

        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Override
    public Booking createBooking(Booking booking) {

        long bookingCount = bookingRepository.count();

        String bookingId = "BK" + String.format("%03d", bookingCount + 1);

        booking.setBookingId(bookingId);

        booking.setBookingDate(java.time.LocalDateTime.now());

        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    @Override
    public Booking getBookingByBookingId(String bookingId) {

        return bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));
    }

    @Override
    public void confirmBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("CONFIRMED");

        bookingRepository.save(booking);

        // Send booking confirmation email
        if (booking.getPassenger() != null
                && booking.getPassenger().getEmail() != null) {

            String email = booking.getPassenger().getEmail();

            String subject = "Booking Confirmation - "
                    + booking.getBookingId();

            String message =
                    "Dear " + booking.getPassenger().getFirstName() + ",\n\n"
                    + "Your airline booking has been confirmed successfully.\n\n"
                    + "Booking ID: " + booking.getBookingId() + "\n"
                    + "Status: CONFIRMED\n\n"
                    + "Thank you for choosing our Airline Reservation System.\n\n"
                    + "Have a safe journey!";

            emailService.sendEmail(email, subject, message);
        }
    }

    // Task 9 - Cancellation Notification
    @Override
    public void cancelBooking(String bookingId) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");

        bookingRepository.save(booking);

        // Send cancellation email
        if (booking.getPassenger() != null
                && booking.getPassenger().getEmail() != null) {

            String email = booking.getPassenger().getEmail();

            String subject = "Booking Cancellation - "
                    + booking.getBookingId();

            String message =
                    "Dear " + booking.getPassenger().getFirstName() + ",\n\n"
                    + "Your airline booking has been cancelled successfully.\n\n"
                    + "Booking ID: " + booking.getBookingId() + "\n"
                    + "Status: CANCELLED\n\n"
                    + "If you did not request this cancellation, "
                    + "please contact our support team.\n\n"
                    + "Thank you for using our Airline Reservation System.";

            emailService.sendEmail(email, subject, message);
        }
    }

    // Task 7 - Booking History
    @Override
    public List<Booking> getBookingsByUserId(Long userId) {

        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getUser() != null
                        && booking.getUser().getId() != null
                        && booking.getUser().getId().equals(userId))
                .collect(java.util.stream.Collectors.toList());
    }
}
