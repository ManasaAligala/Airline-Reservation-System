package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Seat;
import airline_reservation_system.entity.SeatStatus;
import airline_reservation_system.repository.SeatRepository;
import airline_reservation_system.service.SeatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;

    public SeatServiceImpl(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @Override
    public List<Seat> getAvailableSeats(Long flightId) {

        return seatRepository.findByFlightIdAndStatus(
                flightId,
                SeatStatus.AVAILABLE
        );
    }
}