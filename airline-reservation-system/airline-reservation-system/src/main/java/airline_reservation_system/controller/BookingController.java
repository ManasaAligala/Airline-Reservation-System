package airline_reservation_system.controller;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.service.BookingService;
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

        Booking createdBooking = bookingService.createBooking(booking);

        return ResponseEntity.ok(createdBooking);
    }

    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<String> confirmBooking(
            @PathVariable String bookingId) {

        bookingService.confirmBooking(bookingId);

        return ResponseEntity.ok(
                "Booking " + bookingId + " confirmed successfully"
        );
    }

    // Task 7 - Booking History
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(
            @PathVariable Long userId) {

        List<Booking> bookings = bookingService.getBookingsByUserId(userId);

        return ResponseEntity.ok(bookings);
    }
}