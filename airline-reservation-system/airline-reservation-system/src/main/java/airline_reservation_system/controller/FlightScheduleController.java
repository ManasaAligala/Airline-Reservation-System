package airline_reservation_system.controller;

import airline_reservation_system.entity.FlightSchedule;
import airline_reservation_system.service.FlightScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flight-schedules")
public class FlightScheduleController {

    private final FlightScheduleService flightScheduleService;

    public FlightScheduleController(FlightScheduleService flightScheduleService) {
        this.flightScheduleService = flightScheduleService;
    }

    // Create Flight Schedule
    @PostMapping
    public ResponseEntity<FlightSchedule> createSchedule(
            @RequestBody FlightSchedule schedule) {

        FlightSchedule createdSchedule =
                flightScheduleService.createSchedule(schedule);

        return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
    }

    // Get All Flight Schedules
    @GetMapping
    public ResponseEntity<List<FlightSchedule>> getAllSchedules() {

        return ResponseEntity.ok(
                flightScheduleService.getAllSchedules()
        );
    }

    // Get Flight Schedule By ID
    @GetMapping("/{id}")
    public ResponseEntity<FlightSchedule> getScheduleById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                flightScheduleService.getScheduleById(id)
        );
    }

    // Update Flight Schedule
    @PutMapping("/{id}")
    public ResponseEntity<FlightSchedule> updateSchedule(
            @PathVariable Long id,
            @RequestBody FlightSchedule schedule) {

        return ResponseEntity.ok(
                flightScheduleService.updateSchedule(id, schedule)
        );
    }

    // Delete Flight Schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long id) {

        flightScheduleService.deleteSchedule(id);

        return ResponseEntity.ok("Flight schedule deleted successfully");
    }
}