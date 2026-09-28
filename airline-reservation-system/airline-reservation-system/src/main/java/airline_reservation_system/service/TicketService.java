package airline_reservation_system.service;

import airline_reservation_system.entity.Ticket;

public interface TicketService {

    Ticket generateTicket(Long bookingId);

    Ticket getTicket(Long ticketId);
}