package airline_reservation_system.service;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.entity.Payment;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public Payment handlePaymentFailure(String paymentId) {

    Payment payment = paymentRepository.findByPaymentId(paymentId)
            .orElseThrow(() -> new RuntimeException(
                    "Payment not found: " + paymentId));

    payment.setPaymentStatus("FAILED");

    return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payment getPaymentByPaymentId(String paymentId) {
        return paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

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

    // Save and return the updated payment
    return paymentRepository.save(payment);
}
}