package airline_reservation_system.service;

import airline_reservation_system.entity.Flight;

import java.util.List;

public interface FlightService {

    Flight createFlight(Flight flight);

    List<Flight> getAllFlights();

    Flight getFlightById(Long id);

    Flight updateFlight(Long id, Flight flight);

    void deleteFlight(Long id);
    List<Flight> searchFlights(String from, String to, String date);
}
