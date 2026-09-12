package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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