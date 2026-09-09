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

        if (booking.getBookingId() != null &&
                bookingRepository.existsByBookingId(booking.getBookingId())) {

            throw new RuntimeException("Booking ID already exists");
        }

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
}