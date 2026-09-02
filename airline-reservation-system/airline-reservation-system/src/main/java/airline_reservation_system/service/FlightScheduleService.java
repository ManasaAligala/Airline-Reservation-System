package airline_reservation_system.service;

import airline_reservation_system.entity.FlightSchedule;

import java.util.List;

public interface FlightScheduleService {

    FlightSchedule createSchedule(FlightSchedule schedule);

    List<FlightSchedule> getAllSchedules();

    FlightSchedule getScheduleById(Long id);

    FlightSchedule updateSchedule(Long id, FlightSchedule schedule);

    void deleteSchedule(Long id);
}