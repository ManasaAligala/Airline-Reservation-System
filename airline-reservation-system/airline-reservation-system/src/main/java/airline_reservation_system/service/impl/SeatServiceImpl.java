package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Seat;
import airline_reservation_system.entity.SeatStatus;
import airline_reservation_system.repository.SeatRepository;
import airline_reservation_system.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {

    @Autowired
    private SeatRepository seatRepository;

    @Override
    public Seat selectSeat(Long seatId) {

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // Task 5: Prevent duplicate booking
        if (seat.getStatus() == SeatStatus.BOOKED) {
            throw new RuntimeException(
                    "Seat " + seat.getSeatNumber() + " is already booked"
            );
        }

        seat.setStatus(SeatStatus.BOOKED);

        return seatRepository.save(seat);
    }

    @Override
    public List<Seat> getAvailableSeats(Long flightId) {

        return seatRepository.findByFlightIdAndStatus(
                flightId,
                SeatStatus.AVAILABLE
        );
    }
}