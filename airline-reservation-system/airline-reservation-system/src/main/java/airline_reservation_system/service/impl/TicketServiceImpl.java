package airline_reservation_system.service.impl;

import airline_reservation_system.entity.Booking;
import airline_reservation_system.entity.Ticket;
import airline_reservation_system.repository.BookingRepository;
import airline_reservation_system.repository.TicketRepository;
import airline_reservation_system.service.TicketService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             BookingRepository bookingRepository) {
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Ticket getTicket(Long ticketId) {

    return ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public Ticket generateTicket(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Ticket ticket = new Ticket();

        ticket.setBooking(booking);

        long ticketCount = ticketRepository.count() + 1;

        String ticketNumber = String.format("TKT%03d", ticketCount);

        ticket.setTicketNumber(ticketNumber);
        ticket.setIssueDate(LocalDateTime.now());
        ticket.setStatus("ISSUED");

        return ticketRepository.save(ticket);
    }
}