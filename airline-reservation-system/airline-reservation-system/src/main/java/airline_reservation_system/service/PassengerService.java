package airline_reservation_system.service;

import airline_reservation_system.entity.Passenger;

import java.util.List;

public interface PassengerService {

    Passenger createPassenger(Passenger passenger);

    List<Passenger> getAllPassengers();

    Passenger getPassengerById(Long id);

    Passenger updatePassenger(Long id, Passenger passenger);

    void deletePassenger(Long id);
}