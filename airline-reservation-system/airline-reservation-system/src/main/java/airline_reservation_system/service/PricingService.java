package airline_reservation_system.service;

import airline_reservation_system.entity.Pricing;

import java.util.List;

public interface PricingService {

    Pricing createPricing(Pricing pricing);

    List<Pricing> getAllPricing();

    Pricing getPricingById(Long id);

    Pricing getPricingByFlightId(Long flightId);

    Pricing updatePricing(Long id, Pricing pricing);

    void deletePricing(Long id);
}