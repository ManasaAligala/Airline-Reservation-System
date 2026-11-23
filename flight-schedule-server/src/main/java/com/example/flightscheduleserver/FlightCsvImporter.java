
package com.example.flightscheduleserver;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class FlightCsvImporter implements CommandLineRunner {

    private final FlightRepository flightRepository;

    public FlightCsvImporter(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // Avoid importing the same CSV again
        if (flightRepository.count() > 0) {
            System.out.println("Flight data already exists!");
            return;
        }

        // Read CSV file from resources/data folder
        ClassPathResource resource = new ClassPathResource(
                "data/indian_unique_flights_1000.csv");

        List<Flight> flights = new ArrayList<>();

        try (Reader reader = new InputStreamReader(
                    resource.getInputStream(), StandardCharsets.UTF_8);

             CSVParser csvParser = CSVFormat.DEFAULT.builder()
                    .setHeader()
                    .get()
                    .parse(reader)) {

            for (CSVRecord record : csvParser) {

                Flight flight = new Flight();

                flight.setAirline(record.get("airline"));
                flight.setFlight(record.get("flight"));
                flight.setSourceCity(record.get("source_city"));
                flight.setDestinationCity(record.get("destination_city"));
                flight.setDepartureTime(record.get("departure_time"));
                flight.setArrivalTime(record.get("arrival_time"));
                flight.setStops(record.get("stops"));
                flight.setFlightClass(record.get("class"));

                flight.setDuration(
                        Double.parseDouble(record.get("duration")));

                flight.setDaysLeft(
                        Integer.parseInt(record.get("days_left")));

                flight.setPrice(
                        Double.parseDouble(record.get("price")));

                flights.add(flight);
            }
        }

        // Save all CSV records into MySQL
        flightRepository.saveAll(flights);

        System.out.println("================================");
        System.out.println("CSV IMPORT COMPLETED!");
        System.out.println("Total flights imported: " + flights.size());
        System.out.println("================================");
    }
}
