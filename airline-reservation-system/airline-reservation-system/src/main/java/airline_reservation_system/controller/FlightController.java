package airline_reservation_system.controller;

import airline_reservation_system.entity.Flight;
import airline_reservation_system.service.FlightService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    // Create Flight
    @PostMapping
    public ResponseEntity<Flight> createFlight(
            @Valid @RequestBody Flight flight) {

        Flight createdFlight = flightService.createFlight(flight);

        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }

    // Get All Flights
    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {

        List<Flight> flights = flightService.getAllFlights();

        return ResponseEntity.ok(flights);
    }

    // Get Flight By ID
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {

        Flight flight = flightService.getFlightById(id);

        return ResponseEntity.ok(flight);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Flight>> searchFlights(
        @RequestParam String from,
        @RequestParam String to,
        @RequestParam String date) {

    List<Flight> flights = flightService.searchFlights(from, to, date);

    return ResponseEntity.ok(flights);
    }

    // Update Flight
    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody Flight flight) {

        Flight updatedFlight = flightService.updateFlight(id, flight);

        return ResponseEntity.ok(updatedFlight);
    }

    // Delete Flight
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFlight(@PathVariable Long id) {

        flightService.deleteFlight(id);

        return ResponseEntity.ok("Flight deleted successfully");
    }
}
