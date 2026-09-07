package airline_reservation_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
    name = "seats",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"flight_id", "seat_number"})
    }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "seat_class", nullable = false)
    private SeatClass seatClass;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    public Seat() {
    }

    public Seat(String seatNumber, SeatClass seatClass,
                SeatStatus status, Flight flight) {
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.status = status;
        this.flight = flight;
    }

    public Long getId() {
        return id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public SeatClass getSeatClass() {
        return seatClass;
    }

    public void setSeatClass(SeatClass seatClass) {
        this.seatClass = seatClass;
    }

    public SeatStatus getStatus() {
        return status;
    }

    public void setStatus(SeatStatus status) {
        this.status = status;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}
