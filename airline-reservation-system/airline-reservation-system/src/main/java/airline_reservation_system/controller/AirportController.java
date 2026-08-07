package airline_reservation_system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import airline_reservation_system.entity.Airport;
import airline_reservation_system.service.AirportService;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    private final AirportService airportService;

    // Constructor Injection
    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    // Add Airport
    @PostMapping
    public Airport addAirport(@RequestBody Airport airport) {
        return airportService.addAirport(airport);
    }

    // Get All Airports
    @GetMapping
    public List<Airport> getAllAirports() {
        return airportService.getAllAirports();
    }

    // Get Airport By ID
    @GetMapping("/{id}")
    public Airport getAirportById(@PathVariable Long id) {
        return airportService.getAirportById(id);
    }

    // Update Airport
    @PutMapping("/{id}")
    public Airport updateAirport(@PathVariable Long id,
                                 @RequestBody Airport airport) {
        return airportService.updateAirport(id, airport);
    }

    // Delete Airport
    @DeleteMapping("/{id}")
    public String deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
        return "Airport deleted successfully.";
    }
}