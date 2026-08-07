package airline_reservation_system.service;

import java.util.List;

import airline_reservation_system.entity.Airport;

public interface AirportService {

    // Add a new airport
    Airport addAirport(Airport airport);

    // Get all airports
    List<Airport> getAllAirports();

    // Get airport by ID
    Airport getAirportById(Long id);

    // Update airport details
    Airport updateAirport(Long id, Airport airport);

    // Delete airport
    void deleteAirport(Long id);
}
