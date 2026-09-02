package airline_reservation_system.service.impl;

import airline_reservation_system.entity.FlightSchedule;
import airline_reservation_system.repository.FlightScheduleRepository;
import airline_reservation_system.service.FlightScheduleService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightScheduleServiceImpl implements FlightScheduleService {

    private final FlightScheduleRepository flightScheduleRepository;

    public FlightScheduleServiceImpl(FlightScheduleRepository flightScheduleRepository) {
        this.flightScheduleRepository = flightScheduleRepository;
    }

    @Override
    public FlightSchedule createSchedule(FlightSchedule schedule) {
        return flightScheduleRepository.save(schedule);
    }

    @Override
    public List<FlightSchedule> getAllSchedules() {
        return flightScheduleRepository.findAll();
    }

    @Override
    public FlightSchedule getScheduleById(Long id) {
        return flightScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight schedule not found"));
    }

    @Override
    public FlightSchedule updateSchedule(Long id, FlightSchedule schedule) {

        FlightSchedule existingSchedule = flightScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight schedule not found"));

        existingSchedule.setFlight(schedule.getFlight());
        existingSchedule.setDepartureTime(schedule.getDepartureTime());
        existingSchedule.setArrivalTime(schedule.getArrivalTime());
        existingSchedule.setStatus(schedule.getStatus());

        return flightScheduleRepository.save(existingSchedule);
    }

    @Override
    public void deleteSchedule(Long id) {

        if (!flightScheduleRepository.existsById(id)) {
            throw new RuntimeException("Flight schedule not found");
        }

        flightScheduleRepository.deleteById(id);
    }
}
