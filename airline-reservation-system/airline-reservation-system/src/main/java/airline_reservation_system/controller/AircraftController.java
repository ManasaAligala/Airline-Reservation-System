package airline_reservation_system.controller;



import airline_reservation_system.entity.Aircraft;
import airline_reservation_system.service.AircraftService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aircraft")
public class AircraftController {

    private final AircraftService aircraftService;

    public AircraftController(AircraftService aircraftService) {
        this.aircraftService = aircraftService;
    }

    @PostMapping
    public ResponseEntity<Aircraft> createAircraft(@RequestBody Aircraft aircraft) {
        return ResponseEntity.ok(aircraftService.createAircraft(aircraft));
    }

    @GetMapping
    public ResponseEntity<List<Aircraft>> getAllAircraft() {
        return ResponseEntity.ok(aircraftService.getAllAircraft());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aircraft> getAircraftById(@PathVariable Long id) {
        return ResponseEntity.ok(aircraftService.getAircraftById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aircraft> updateAircraft(
            @PathVariable Long id,
            @RequestBody Aircraft aircraft) {

        return ResponseEntity.ok(
                aircraftService.updateAircraft(id, aircraft)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAircraft(@PathVariable Long id) {
        aircraftService.deleteAircraft(id);
        return ResponseEntity.ok("Aircraft deleted successfully");
    }
}