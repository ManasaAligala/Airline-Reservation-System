package airline_reservation_system.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.entity.Payment;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          EmailService emailService) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    // Handle payment failure
    public Payment handlePaymentFailure(String paymentId) {

        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found: " + paymentId));

        payment.setPaymentStatus("FAILED");

        return paymentRepository.save(payment);
    }

    // Get all payments
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }

    // Get payment by database ID
    public Payment getPaymentById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }

    // Get payment by payment ID
    public Payment getPaymentByPaymentId(String paymentId) {

        return paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));
    }

    // Initiate payment
    public Payment initiatePayment(String bookingId,
                                   Double amount,
                                   String paymentMethod) {

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found: " + bookingId));

        Payment payment = new Payment();

        long paymentCount = paymentRepository.count() + 1;

        payment.setPaymentId(
                "PAY" + String.format("%03d", paymentCount)
        );

        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    // Handle successful payment
    public Payment handlePaymentSuccess(String paymentId) {

        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found: " + paymentId));

        // Update payment status
        payment.setPaymentStatus("SUCCESS");

        // Get the booking connected to this payment
        Booking booking = payment.getBooking();

        // Confirm the booking
        booking.setStatus("CONFIRMED");

        // Save the updated booking
        bookingRepository.save(booking);

        // Send payment confirmation email
        if (booking.getPassenger() != null
                && booking.getPassenger().getEmail() != null) {

            String email = booking.getPassenger().getEmail();

            String subject = "Payment Confirmation - "
                    + payment.getPaymentId();

            String message =
                    "Dear " + booking.getPassenger().getFirstName() + ",\n\n"
                    + "Your payment has been completed successfully.\n\n"
                    + "Payment ID: " + payment.getPaymentId() + "\n"
                    + "Booking ID: " + booking.getBookingId() + "\n"
                    + "Amount: " + payment.getAmount() + "\n"
                    + "Payment Method: " + payment.getPaymentMethod() + "\n"
                    + "Payment Status: SUCCESS\n"
                    + "Booking Status: CONFIRMED\n\n"
                    + "Thank you for choosing our Airline Reservation System.\n\n"
                    + "Have a safe journey!";

            emailService.sendEmail(
                    email,
                    subject,
                    message
            );
        }

        // Save and return the updated payment
        return paymentRepository.save(payment);
    }

    // ---------------------------------------------------------
    // SPRINT 7 - TASK 7
    // Mark payment as REFUND_PENDING
    // ---------------------------------------------------------

    public Payment requestRefund(String paymentId) {

        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found: " + paymentId));

        // Refund can only be requested for a successful payment
        if (!"SUCCESS".equals(payment.getPaymentStatus())) {

            throw new RuntimeException(
                    "Refund can only be requested for a successful payment"
            );
        }

        // Update refund status
        payment.setPaymentStatus("REFUND_PENDING");

        return paymentRepository.save(payment);
    }

    // ---------------------------------------------------------
    // SPRINT 7 - TASK 7
    // Mark payment as REFUNDED
    // ---------------------------------------------------------

    public Payment completeRefund(String paymentId) {

        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException(
                        "Payment not found: " + paymentId));

        // Refund can only be completed when it is pending
        if (!"REFUND_PENDING".equals(payment.getPaymentStatus())) {

            throw new RuntimeException(
                    "Payment must be in REFUND_PENDING status"
            );
        }

        // Update payment status
        payment.setPaymentStatus("REFUNDED");

        return paymentRepository.save(payment);
    }
}