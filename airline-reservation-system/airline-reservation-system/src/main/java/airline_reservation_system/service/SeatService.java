package airline_reservation_system.service;

import airline_reservation_system.entity.Seat;

import java.util.List;

public interface SeatService {

    List<Seat> getAvailableSeats(Long flightId);
}