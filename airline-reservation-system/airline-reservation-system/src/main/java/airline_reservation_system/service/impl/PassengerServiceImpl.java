package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Passenger;
import airline_reservation_system.repository.PassengerRepository;
import airline_reservation_system.service.PassengerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerServiceImpl(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    @Override
    public Passenger createPassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    @Override
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    @Override
    public Passenger getPassengerById(Long id) {
        return passengerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found with id: " + id));
    }

    @Override
    public Passenger updatePassenger(Long id, Passenger passenger) {

        Passenger existingPassenger = getPassengerById(id);

        existingPassenger.setFirstName(passenger.getFirstName());
        existingPassenger.setLastName(passenger.getLastName());
        existingPassenger.setEmail(passenger.getEmail());
        existingPassenger.setPhoneNumber(passenger.getPhoneNumber());
        existingPassenger.setAge(passenger.getAge());

        return passengerRepository.save(existingPassenger);
    }

    @Override
    public void deletePassenger(Long id) {

        Passenger existingPassenger = getPassengerById(id);

        passengerRepository.delete(existingPassenger);
    }
}