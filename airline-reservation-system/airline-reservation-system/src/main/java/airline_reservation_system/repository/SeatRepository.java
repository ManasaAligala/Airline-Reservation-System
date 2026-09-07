package airline_reservation_system.repository;

import airline_reservation_system.entity.Seat;
import airline_reservation_system.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByFlightIdAndStatus(Long flightId, SeatStatus status);
}