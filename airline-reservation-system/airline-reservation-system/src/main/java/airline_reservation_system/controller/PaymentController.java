package airline_reservation_system.controller;

import airline_reservation_system.entity.Payment;
import airline_reservation_system.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/payment-id/{paymentId}")
    public Payment getPaymentByPaymentId(
            @PathVariable String paymentId) {

        return paymentService.getPaymentByPaymentId(paymentId);
    }

    

    @PostMapping
    public Payment initiatePayment(
            @RequestParam String bookingId,
            @RequestParam Double amount,
            @RequestParam String paymentMethod) {

        return paymentService.initiatePayment(
                bookingId,
                amount,
                paymentMethod
        );
    }

    @PutMapping("/success/{paymentId}")
    public Payment handlePaymentSuccess(
        @PathVariable String paymentId) {

    return paymentService.handlePaymentSuccess(paymentId);
    }

    @PutMapping("/failure/{paymentId}")
    public Payment handlePaymentFailure(
        @PathVariable String paymentId) {

    return paymentService.handlePaymentFailure(paymentId);
    }
}