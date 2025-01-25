package com.loco.lennysbakery.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "inventory")
@Getter
@Setter
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String description;
    private BigDecimal price;

    @Override
    public String toString() {
        return "Inventory(id="
                + id
                + ", name="
                + name
                + ", description="
                + description
                + ", price="
                + price
                + ")";
    }
}
