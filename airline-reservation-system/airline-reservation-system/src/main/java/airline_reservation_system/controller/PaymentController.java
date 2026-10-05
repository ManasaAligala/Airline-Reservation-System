package airline_reservation_system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import airline_reservation_system.entity.Payment;
import airline_reservation_system.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Get all payments
    @GetMapping
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }

    // Get payment by database ID
    @GetMapping("/{id}")
    public Payment getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }

    // Get payment by payment ID
    @GetMapping("/payment-id/{paymentId}")
    public Payment getPaymentByPaymentId(
            @PathVariable String paymentId) {

        return paymentService.getPaymentByPaymentId(paymentId);
    }

    // Initiate payment
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

    // Handle successful payment
    @PutMapping("/success/{paymentId}")
    public Payment handlePaymentSuccess(
            @PathVariable String paymentId) {

        return paymentService.handlePaymentSuccess(paymentId);
    }

    // Handle failed payment
    @PutMapping("/failure/{paymentId}")
    public Payment handlePaymentFailure(
            @PathVariable String paymentId) {

        return paymentService.handlePaymentFailure(paymentId);
    }

    // ---------------------------------------------------------
    // SPRINT 7 - TASK 7
    // Request refund
    // ---------------------------------------------------------
    @PutMapping("/refund/{paymentId}")
    public Payment requestRefund(
            @PathVariable String paymentId) {

        return paymentService.requestRefund(paymentId);
    }

    // ---------------------------------------------------------
    // SPRINT 7 - TASK 7
    // Complete refund
    // ---------------------------------------------------------
    @PutMapping("/refund/complete/{paymentId}")
    public Payment completeRefund(
            @PathVariable String paymentId) {

        return paymentService.completeRefund(paymentId);
    }
}