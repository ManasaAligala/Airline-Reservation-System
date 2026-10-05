package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Pricing;
import airline_reservation_system.repository.PricingRepository;
import airline_reservation_system.service.PricingService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PricingServiceImpl implements PricingService {

    private final PricingRepository pricingRepository;

    public PricingServiceImpl(PricingRepository pricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    @Override
    public Pricing createPricing(Pricing pricing) {
        return pricingRepository.save(pricing);
    }

    @Override
    public List<Pricing> getAllPricing() {
        return pricingRepository.findAll();
    }

    @Override
    public Pricing getPricingById(Long id) {
        return pricingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pricing not found with id: " + id)
                );
    }

    @Override
    public Pricing getPricingByFlightId(Long flightId) {
        return pricingRepository.findByFlightId(flightId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Pricing not found for flight id: " + flightId
                        )
                );
    }

    @Override
    public Pricing updatePricing(Long id, Pricing pricing) {

        Pricing existingPricing = getPricingById(id);

        existingPricing.setFlight(pricing.getFlight());
        existingPricing.setBaseFare(pricing.getBaseFare());
        existingPricing.setTax(pricing.getTax());
        existingPricing.setTotalFare(pricing.getTotalFare());

        return pricingRepository.save(existingPricing);
    }

    @Override
    public void deletePricing(Long id) {

        Pricing pricing = getPricingById(id);

        pricingRepository.delete(pricing);
    }
}