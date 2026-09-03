package airline_reservation_system.repository;

import airline_reservation_system.entity.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {

    List<FlightSchedule> findByFlight_DepartureAirport_CodeAndFlight_ArrivalAirport_CodeAndDepartureTimeGreaterThanEqualAndDepartureTimeLessThan(
            String from,
            String to,
            LocalDateTime start,
            LocalDateTime end
    );
}
