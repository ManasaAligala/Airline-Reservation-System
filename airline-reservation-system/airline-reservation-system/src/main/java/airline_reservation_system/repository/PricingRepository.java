package airline_reservation_system.repository;

import airline_reservation_system.entity.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PricingRepository extends JpaRepository<Pricing, Long> {

    Optional<Pricing> findByFlightId(Long flightId);
}