package airline_reservation_system.service;

public interface EmailService {

    void sendEmail(String to, String subject, String message);
}