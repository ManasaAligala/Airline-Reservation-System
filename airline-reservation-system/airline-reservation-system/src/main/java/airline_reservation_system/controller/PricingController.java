package airline_reservation_system.controller;

import airline_reservation_system.entity.Pricing;
import airline_reservation_system.service.PricingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @PostMapping
    public ResponseEntity<Pricing> createPricing(
            @RequestBody Pricing pricing) {

        Pricing createdPricing =
                pricingService.createPricing(pricing);

        return new ResponseEntity<>(
                createdPricing,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Pricing>> getAllPricing() {

        return ResponseEntity.ok(
                pricingService.getAllPricing()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pricing> getPricingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                pricingService.getPricingById(id)
        );
    }

    @GetMapping("/flight/{flightId}")
    public ResponseEntity<Pricing> getPricingByFlightId(
            @PathVariable Long flightId) {

        return ResponseEntity.ok(
                pricingService.getPricingByFlightId(flightId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pricing> updatePricing(
            @PathVariable Long id,
            @RequestBody Pricing pricing) {

        return ResponseEntity.ok(
                pricingService.updatePricing(id, pricing)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePricing(
            @PathVariable Long id) {

        pricingService.deletePricing(id);

        return ResponseEntity.ok(
                "Pricing deleted successfully"
        );
    }
}
