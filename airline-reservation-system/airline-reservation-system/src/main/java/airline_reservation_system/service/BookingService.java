package airline_reservation_system.service;

import airline_reservation_system.entity.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(Booking booking);

    List<Booking> getAllBookings();

    Booking getBookingById(Long id);

    Booking getBookingByBookingId(String bookingId);
}
