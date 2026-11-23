
package com.example.flightscheduleserver;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findBySourceCityIgnoreCaseAndDestinationCityIgnoreCase(
            String sourceCity,
            String destinationCity
    );
}
