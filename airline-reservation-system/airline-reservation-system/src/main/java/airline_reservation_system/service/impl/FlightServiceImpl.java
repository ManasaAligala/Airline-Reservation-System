package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Flight;
import airline_reservation_system.entity.FlightSchedule;
import airline_reservation_system.repository.FlightRepository;
import airline_reservation_system.repository.FlightScheduleRepository;
import airline_reservation_system.service.FlightService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final FlightScheduleRepository flightScheduleRepository;

    public FlightServiceImpl(
            FlightRepository flightRepository,
            FlightScheduleRepository flightScheduleRepository) {

        this.flightRepository = flightRepository;
        this.flightScheduleRepository = flightScheduleRepository;
    }

    // Search Flights
    @Override
    public List<Flight> searchFlights(String from, String to, String date) {

        LocalDate searchDate = LocalDate.parse(date);

        LocalDateTime startOfDay = searchDate.atStartOfDay();
        LocalDateTime startOfNextDay = searchDate.plusDays(1).atStartOfDay();

        List<FlightSchedule> schedules =
                flightScheduleRepository
                        .findByFlight_DepartureAirport_CodeAndFlight_ArrivalAirport_CodeAndDepartureTimeGreaterThanEqualAndDepartureTimeLessThan(
                                from,
                                to,
                                startOfDay,
                                startOfNextDay
                        );

        return schedules.stream()
                .map(FlightSchedule::getFlight)
                .distinct()
                .toList();
    }

    // Create Flight
    @Override
    public Flight createFlight(Flight flight) {

        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new RuntimeException("Flight number already exists");
        }

        if (flight.getDepartureAirport().getId()
                .equals(flight.getArrivalAirport().getId())) {

            throw new RuntimeException(
                    "Departure and arrival airports cannot be the same"
            );
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
                        new RuntimeException("Flight not found with id: " + id)
                );
    }

    // Update Flight
    @Override
    public Flight updateFlight(Long id, Flight flight) {

        Flight existingFlight = flightRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found with id: " + id)
                );

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
                    "Flight not found with id: " + id
            );
        }

        flightRepository.deleteById(id);
    }
}