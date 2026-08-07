package airline_reservation_system.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import airline_reservation_system.entity.Airport;
import airline_reservation_system.repository.AirportRepository;
import airline_reservation_system.service.AirportService;

@Service
public class AirportServiceImpl implements AirportService {

    private final AirportRepository airportRepository;

    // Constructor Injection
    public AirportServiceImpl(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    @Override
    public Airport addAirport(Airport airport) {

        if (airportRepository.findByCode(airport.getCode()).isPresent()) {
            throw new RuntimeException("Airport code already exists.");
        }

        return airportRepository.save(airport);
    }

    @Override
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    @Override
    public Airport getAirportById(Long id) {
        return airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found."));
    }

    @Override
    public Airport updateAirport(Long id, Airport airport) {

        Airport existingAirport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found."));

        existingAirport.setName(airport.getName());
        existingAirport.setCity(airport.getCity());
        existingAirport.setCountry(airport.getCountry());
        existingAirport.setCode(airport.getCode());

        return airportRepository.save(existingAirport);
    }

    @Override
    public void deleteAirport(Long id) {

        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found."));

        airportRepository.delete(airport);
    }
}
