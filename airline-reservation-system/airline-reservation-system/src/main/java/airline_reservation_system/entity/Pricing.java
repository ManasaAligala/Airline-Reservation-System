package airline_reservation_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "pricing")
public class Pricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "flight_id", nullable = false, unique = true)
    private Flight flight;

    @NotNull(message = "Base fare is required")
    @Positive(message = "Base fare must be greater than 0")
    @Column(nullable = false)
    private Double baseFare;

    @NotNull(message = "Tax is required")
    @Positive(message = "Tax must be greater than 0")
    @Column(nullable = false)
    private Double tax;

    @NotNull(message = "Total fare is required")
    @Positive(message = "Total fare must be greater than 0")
    @Column(nullable = false)
    private Double totalFare;

    public Pricing() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }

    public Double getBaseFare() {
        return baseFare;
    }

    public void setBaseFare(Double baseFare) {
        this.baseFare = baseFare;
    }

    public Double getTax() {
        return tax;
    }

    public void setTax(Double tax) {
        this.tax = tax;
    }

    public Double getTotalFare() {
        return totalFare;
    }

    public void setTotalFare(Double totalFare) {
        this.totalFare = totalFare;
    }
}