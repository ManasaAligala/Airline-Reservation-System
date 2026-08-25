package airline_reservation_system.service;



import airline_reservation_system.entity.Aircraft;

import java.util.List;

public interface AircraftService {

    Aircraft createAircraft(Aircraft aircraft);

    List<Aircraft> getAllAircraft();

    Aircraft getAircraftById(Long id);

    Aircraft updateAircraft(Long id, Aircraft aircraft);

    void deleteAircraft(Long id);
}