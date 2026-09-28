package airline_reservation_system.controller;

import airline_reservation_system.entity.Ticket;
import airline_reservation_system.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/generate/{bookingId}")
    public ResponseEntity<Ticket> generateTicket(
            @PathVariable Long bookingId) {

        Ticket ticket = ticketService.generateTicket(bookingId);

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<Ticket> getTicket(
        @PathVariable Long ticketId) {

    Ticket ticket = ticketService.getTicket(ticketId);

    return ResponseEntity.ok(ticket);
    }
}
