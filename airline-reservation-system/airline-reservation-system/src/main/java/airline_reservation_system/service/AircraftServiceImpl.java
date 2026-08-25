package airline_reservation_system.service;


import airline_reservation_system.entity.Aircraft;
import airline_reservation_system.repository.AircraftRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AircraftServiceImpl implements AircraftService {

    private final AircraftRepository aircraftRepository;

    public AircraftServiceImpl(AircraftRepository aircraftRepository) {
        this.aircraftRepository = aircraftRepository;
    }

    @Override
    public Aircraft createAircraft(Aircraft aircraft) {
        return aircraftRepository.save(aircraft);
    }

    @Override
    public List<Aircraft> getAllAircraft() {
        return aircraftRepository.findAll();
    }

    @Override
    public Aircraft getAircraftById(Long id) {
        return aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));
    }

    @Override
    public Aircraft updateAircraft(Long id, Aircraft aircraft) {

        Aircraft existingAircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        existingAircraft.setModel(aircraft.getModel());
        existingAircraft.setManufacturer(aircraft.getManufacturer());
        existingAircraft.setCapacity(aircraft.getCapacity());

        return aircraftRepository.save(existingAircraft);
    }

    @Override
    public void deleteAircraft(Long id) {

        Aircraft existingAircraft = aircraftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        aircraftRepository.delete(existingAircraft);
    }
}