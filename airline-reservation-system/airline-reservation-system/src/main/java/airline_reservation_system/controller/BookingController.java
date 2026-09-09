package airline_reservation_system.controller;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking) {

        Booking savedBooking = bookingService.createBooking(booking);

        return new ResponseEntity<>(
                savedBooking,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    @GetMapping("/booking-id/{bookingId}")
    public ResponseEntity<Booking> getBookingByBookingId(
            @PathVariable String bookingId) {

        return ResponseEntity.ok(
                bookingService.getBookingByBookingId(bookingId)
        );
    }
}