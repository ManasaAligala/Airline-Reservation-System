
package airline_reservation_system.service.impl;

import airline_reservation_system.client.FlightScheduleClient;
import airline_reservation_system.dto.FlightSearchResponse;
import airline_reservation_system.entity.Flight;
import airline_reservation_system.repository.FlightRepository;
import airline_reservation_system.service.FlightService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final FlightScheduleClient flightScheduleClient;

    public FlightServiceImpl(
            FlightRepository flightRepository,
            FlightScheduleClient flightScheduleClient) {

        this.flightRepository = flightRepository;
        this.flightScheduleClient = flightScheduleClient;
    }

    // Search flights using the external Flight Schedule Server
    @Override
    public List<FlightSearchResponse> searchFlights(
            String from,
            String to,
            String date) {

        return flightScheduleClient.searchFlights(
                from,
                to,
                date
        );
    }

    // Create Flight
    @Override
    public Flight createFlight(Flight flight) {

        if (flightRepository.existsByFlightNumber(
                flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        if (flight.getDepartureAirport().getId()
                .equals(flight.getArrivalAirport().getId())) {
            throw new RuntimeException(
                    "Departure and arrival airports cannot be the same");
        }

        return flightRepository.save(flight);
    }

    // Get All Flights
    @Override
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Get Flight By ID
    @Override
    public Flight getFlightById(Long id) {

        return flightRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with id: " + id));
    }

    // Update Flight
    @Override
    public Flight updateFlight(Long id, Flight flight) {

        Flight existingFlight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with id: " + id));

        existingFlight.setFlightNumber(flight.getFlightNumber());
        existingFlight.setAirline(flight.getAirline());
        existingFlight.setDepartureAirport(flight.getDepartureAirport());
        existingFlight.setArrivalAirport(flight.getArrivalAirport());
        existingFlight.setAircraft(flight.getAircraft());
        existingFlight.setDurationMinutes(flight.getDurationMinutes());
        existingFlight.setStatus(flight.getStatus());

        return flightRepository.save(existingFlight);
    }

    // Delete Flight
    @Override
    public void deleteFlight(Long id) {

        if (!flightRepository.existsById(id)) {
            throw new RuntimeException(
                    "Flight not found with id: " + id);
        }

        flightRepository.deleteById(id);
    }
}
