package airline_reservation_system.controller;

import airline_reservation_system.entity.Seat;
import airline_reservation_system.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/flight/{flightId}/available")
    public ResponseEntity<List<Seat>> getAvailableSeats(
            @PathVariable Long flightId) {

        return ResponseEntity.ok(
                seatService.getAvailableSeats(flightId)
        );
    }
    @PostMapping("/{seatId}/select")
    public Seat selectSeat(@PathVariable Long seatId) {

    return seatService.selectSeat(seatId);
    }
}