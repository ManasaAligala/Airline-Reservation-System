package airline_reservation_system.controller;

import airline_reservation_system.entity.Passenger;
import airline_reservation_system.service.PassengerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @PostMapping
    public ResponseEntity<Passenger> createPassenger(
            @Valid @RequestBody Passenger passenger) {

        Passenger savedPassenger = passengerService.createPassenger(passenger);

        return new ResponseEntity<>(savedPassenger, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Passenger>> getAllPassengers() {

        return ResponseEntity.ok(passengerService.getAllPassengers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Passenger> getPassengerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(passengerService.getPassengerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Passenger> updatePassenger(
            @PathVariable Long id,
            @Valid @RequestBody Passenger passenger) {

        return ResponseEntity.ok(
                passengerService.updatePassenger(id, passenger)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePassenger(
            @PathVariable Long id) {

        passengerService.deletePassenger(id);

        return ResponseEntity.ok("Passenger deleted successfully");
    }
}