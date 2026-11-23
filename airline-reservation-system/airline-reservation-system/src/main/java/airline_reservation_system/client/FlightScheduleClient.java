
package airline_reservation_system.client;

import airline_reservation_system.dto.FlightSearchResponse;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class FlightScheduleClient {

    private final RestClient restClient;

    public FlightScheduleClient() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8081")
                .build();
    }

    public List<FlightSearchResponse> searchFlights(
            String sourceCity,
            String destinationCity,
            String travelDate) {

        List<FlightSearchResponse> flights = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/flights/search")
                        .queryParam("sourceCity", sourceCity)
                        .queryParam("destinationCity", destinationCity)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<List<FlightSearchResponse>>() {});

        if (flights == null) {
            return List.of();
        }

        for (FlightSearchResponse flight : flights) {
            flight.setTravelDate(travelDate);
        }

        return flights;
    }
}
