
package com.example.flightscheduleserver;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightRepository flightRepository;

    public FlightController(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    // Retrieve all imported flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Search flights between two cities
    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String sourceCity,
            @RequestParam String destinationCity) {

        return flightRepository
                .findBySourceCityIgnoreCaseAndDestinationCityIgnoreCase(
                        sourceCity, destinationCity);
    }
}
